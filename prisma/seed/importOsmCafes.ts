/**
 * 將 OSM 爬蟲產出的咖啡廳資料匯入 ShopList。
 *
 * 前置：先跑過 `npm run crawl:osm` 產生 scripts/crawl/output/all.json
 * 執行：npx tsx prisma/seed/importOsmCafes.ts
 *
 * 特性：
 * - 以 `osmId`（格式 type/id）作為唯一鍵，createMany + skipDuplicates 匯入，
 *   重複執行只會略過已存在者，不會製造重複資料。
 * - 缺地址者以空字串匯入（ShopList.address 為必填），可日後再反查補齊。
 */
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// 依連線字串自動判斷：雲端 (prisma+postgres) 需套 Accelerate 擴充，本機直連則否。
function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? '';
  const client = new PrismaClient();
  if (url.startsWith('prisma://') || url.startsWith('prisma+postgres://')) {
    return client.$extends(withAccelerate()) as unknown as PrismaClient;
  }
  return client;
}

const prisma = createPrismaClient();

interface OsmCafe {
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  phone: string | null;
  openingHours: string | null;
  osmType: string;
  osmId: number;
}

async function main() {
  const file = path.join(process.cwd(), 'scripts/crawl/output/all.json');
  const records = JSON.parse(await readFile(file, 'utf-8')) as OsmCafe[];

  // 對齊 ShopList 欄位；osmId 用 type/id 保證跨類型唯一；順手在記憶體去重
  const seen = new Set<string>();
  const data: {
    name: string;
    lat: number;
    lng: number;
    address: string;
    city: string;
    phone: string | null;
    openingHours: string | null;
    osmId: string;
  }[] = [];
  for (const r of records) {
    const osmId = `${r.osmType}/${r.osmId}`;
    if (seen.has(osmId)) continue;
    seen.add(osmId);
    data.push({
      name: r.name,
      lat: r.lat,
      lng: r.lng,
      address: r.address ?? '',
      city: r.city,
      phone: r.phone ?? null,
      openingHours: r.openingHours ?? null,
      osmId,
    });
  }

  console.log(`準備匯入 ${data.length} 家（來源 ${records.length} 筆）...`);

  // 全量刷新 OSM 資料：先刪掉來源為 OSM 的既有列（保留使用者自建、osmId 為 null 者），
  // 再重新寫入，確保欄位更新（如新增的 phone / openingHours）也會生效。
  const removed = await prisma.shopList.deleteMany({
    where: { osmId: { not: null } },
  });
  console.log(`清除舊 OSM 資料 ${removed.count} 筆，重新寫入...`);

  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < data.length; i += BATCH) {
    const chunk = data.slice(i, i + BATCH);
    const res = await prisma.shopList.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    inserted += res.count;
    console.log(`  ${Math.min(i + BATCH, data.length)}/${data.length}`);
  }

  console.log(`✅ 匯入完成：寫入 ${inserted} 家`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error('匯入失敗:', e);
    prisma.$disconnect();
    process.exit(1);
  });
