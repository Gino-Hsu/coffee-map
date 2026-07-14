/**
 * OSM 咖啡廳爬蟲
 * -----------------------------------------------------------------------------
 * 從 OpenStreetMap 的 Overpass API 抓取台灣主要城市的咖啡廳 (amenity=cafe)，
 * 輸出對齊 Prisma `ShopList` 的 JSON 供人工檢查，確認後再決定是否匯入。
 *
 * 執行：  npx tsx scripts/crawl/osmCafes.ts
 * 輸出：  scripts/crawl/output/<city>.json 以及 all.json
 *
 * 備註：
 * - OSM（台灣）沒有「插座 / 限時」欄位，「寵物友善」也極少，故這些欄位一律輸出
 *   為 null，保留給日後人工補齊；wifi 會盡量從 internet_access 標籤帶出。
 * - 尊重 Overpass 使用禮節：查詢間留間隔、單一 city 用一次查詢、設逾時。
 */

// 目標城市：slug 對應 app 內的 city 值；osmName 為 OSM 行政區名稱 (admin_level=4)
const CITIES: { slug: string; osmName: string; label: string }[] = [
  { slug: 'taipei', osmName: '臺北市', label: '台北市' },
  { slug: 'new-taipei', osmName: '新北市', label: '新北市' },
  { slug: 'taoyuan', osmName: '桃園市', label: '桃園市' },
  { slug: 'taichung', osmName: '臺中市', label: '台中市' },
  { slug: 'tainan', osmName: '臺南市', label: '台南市' },
  { slug: 'kaohsiung', osmName: '高雄市', label: '高雄市' },
];

// Overpass 端點：優先用官方，連不到時依序 fallback（可用 OVERPASS_URL 覆寫）
const OVERPASS_ENDPOINTS = [
  process.env.OVERPASS_URL,
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
].filter(Boolean) as string[];

const USER_AGENT =
  'coffee-map-crawler/1.0 (OSM cafe data for a personal side project)';

const DELAY_BETWEEN_CITIES_MS = 8000;
const RETRIES_PER_ENDPOINT = 2;

// 手搖飲 / 茶飲連鎖黑名單：OSM 常把這些也標成 amenity=cafe，但它們不是咖啡廳。
// 只過濾手搖飲，保留真正的咖啡/烘焙連鎖（星巴克、路易莎、85度C 等）。
// 比對方式：店名（轉小寫）包含任一關鍵字即濾除。
const DRINK_CHAIN_BLACKLIST = [
  '50嵐',
  '五十嵐',
  '清心',
  '五桐號',
  'wootea',
  '再睡5分鐘',
  'coco都可',
  '都可',
  '迷客夏',
  'milksha',
  '茶湯會',
  '可不可',
  '茶的魔手',
  '一沐日',
  '大苑子',
  '龜記',
  '麻古',
  '鶴茶樓',
  '得正',
  'comebuy',
  '快可立',
  '日出茶太',
  'chatime',
  '珍煮丹',
  '老虎堂',
  '樺達',
  '水巷茶弄',
  '圓石',
  '康青龍',
  '鮮茶道',
  '清玉',
  '萬波',
  '波哥',
  '樂法',
  '桔子工坊',
  '烏弄',
  'sharetea',
  'tp tea',
  '六角',
  '春陽茶事',
  '珍珠奶茶',
  '手搖',
  // 連鎖茶館（非咖啡，依需求一併排除）
  '天仁',
  '春水堂',
  '喫茶趣',
];

function isDrinkChain(name: string): boolean {
  const lower = name.toLowerCase();
  return DRINK_CHAIN_BLACKLIST.some(kw => lower.includes(kw.toLowerCase()));
}

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface CafeRecord {
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string; // slug
  // 附帶資訊（ShopList 目前沒有這些欄位，先放在 JSON 供檢查/未來擴充）
  wifi: boolean | null;
  hasSocket: boolean | null; // OSM 無此資料 → null
  petFriendly: boolean | null; // OSM 幾乎無此資料 → null
  timeLimit: boolean | null; // OSM 無此資料 → null
  openingHours: string | null;
  phone: string | null;
  source: 'osm';
  osmType: string;
  osmId: number;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function buildQuery(osmName: string): string {
  return `[out:json][timeout:90];
area["name"="${osmName}"]["admin_level"="4"]->.a;
(
  node["amenity"="cafe"](area.a);
  way["amenity"="cafe"](area.a);
);
out center tags;`;
}

/** 由 OSM 標籤組出可讀地址：優先 addr:full，否則以縣市/區/路/號組合 */
function buildAddress(tags: Record<string, string>): string {
  if (tags['addr:full']) return tags['addr:full'].trim();
  const parts = [
    tags['addr:city'],
    tags['addr:district'],
    tags['addr:street'],
    tags['addr:housenumber']
      ? `${tags['addr:housenumber']}號`
      : undefined,
  ].filter(Boolean);
  return parts.join('');
}

function parseWifi(tags: Record<string, string>): boolean | null {
  const v = tags['internet_access'];
  if (v === undefined) return null;
  return v !== 'no';
}

async function runOverpass(query: string): Promise<OverpassElement[]> {
  let lastErr: unknown;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    for (let attempt = 1; attempt <= RETRIES_PER_ENDPOINT; attempt++) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': USER_AGENT,
          },
          body: 'data=' + encodeURIComponent(query),
          signal: AbortSignal.timeout(120_000),
        });
        if (!res.ok) {
          lastErr = new Error(`${endpoint} -> HTTP ${res.status}`);
        } else {
          const json = (await res.json()) as { elements?: OverpassElement[] };
          return json.elements ?? [];
        }
      } catch (err) {
        lastErr = err;
      }
      console.warn(
        `  端點失敗 (${attempt}/${RETRIES_PER_ENDPOINT}) ${endpoint}: ${lastErr instanceof Error ? lastErr.message : lastErr}`
      );
      if (attempt < RETRIES_PER_ENDPOINT) await sleep(attempt * 4000); // 退避
    }
  }
  throw new Error(
    `所有 Overpass 端點都失敗: ${lastErr instanceof Error ? lastErr.message : lastErr}`
  );
}

function toRecord(el: OverpassElement, citySlug: string): CafeRecord | null {
  const tags = el.tags ?? {};
  const name = tags.name?.trim();
  if (!name) return null; // 沒名字的略過

  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (lat === undefined || lng === undefined) return null; // 沒座標的略過

  return {
    name,
    lat,
    lng,
    address: buildAddress(tags),
    city: citySlug,
    wifi: parseWifi(tags),
    hasSocket: null,
    petFriendly: tags.dog === 'yes' || tags.pets === 'yes' ? true : null,
    timeLimit: null,
    openingHours: tags.opening_hours ?? null,
    phone: tags.phone ?? tags['contact:phone'] ?? null,
    source: 'osm',
    osmType: el.type,
    osmId: el.id,
  };
}

async function main() {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const outDir = path.join(process.cwd(), 'scripts/crawl/output');
  await fs.mkdir(outDir, { recursive: true });

  const all: CafeRecord[] = [];
  const summary: Record<string, number> = {};

  for (const city of CITIES) {
    const outFile = path.join(outDir, `${city.slug}.json`);

    // 續跑：已抓過的城市沿用快取，避免重打 Overpass（FORCE=1 可強制重抓）
    let records: CafeRecord[] | null = null;
    if (!process.env.FORCE) {
      try {
        const cached = JSON.parse(
          await fs.readFile(outFile, 'utf-8')
        ) as CafeRecord[];
        if (cached.length > 0) {
          records = cached;
          console.log(`\n📍 ${city.label}：沿用快取 ${cached.length} 筆`);
        }
      } catch {
        // 檔案不存在或壞掉 → 照常抓取
      }
    }

    if (!records) {
      console.log(`\n📍 抓取 ${city.label} (${city.osmName}) ...`);
      const elements = await runOverpass(buildQuery(city.osmName));

      // 去重：同一 osmType+osmId 只留一筆
      const seen = new Set<string>();
      records = [];
      for (const el of elements) {
        const rec = toRecord(el, city.slug);
        if (!rec) continue;
        const key = `${rec.osmType}/${rec.osmId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        records.push(rec);
      }
      console.log(`  → ${elements.length} 筆原始，取得 ${records.length} 家`);
    }

    // 過濾手搖飲/茶飲連鎖（無論來源是快取或新抓，一律套用並重寫檔案）
    const beforeCount = records.length;
    records = records.filter(r => !isDrinkChain(r.name));
    const filtered = beforeCount - records.length;
    const withAddr = records.filter(r => r.address).length;
    console.log(
      `  過濾手搖飲 ${filtered} 家 → 保留 ${records.length} 家咖啡廳（含地址 ${withAddr}）`
    );

    await fs.writeFile(outFile, JSON.stringify(records, null, 2), 'utf-8');
    all.push(...records);
    summary[city.slug] = records.length;

    await sleep(DELAY_BETWEEN_CITIES_MS);
  }

  await fs.writeFile(
    path.join(outDir, 'all.json'),
    JSON.stringify(all, null, 2),
    'utf-8'
  );

  console.log('\n===== 完成 =====');
  console.table(summary);
  console.log(`總計 ${all.length} 家，輸出於 scripts/crawl/output/`);
}

main().catch(err => {
  console.error('爬取失敗:', err);
  process.exit(1);
});
