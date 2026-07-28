# Coffee Map ☕️

台灣咖啡廳地圖。以 Next.js App Router + Prisma + PostgreSQL 建置，資料來源為 OpenStreetMap（Overpass API）爬取的咖啡廳，並支援會員註冊、收藏與自行新增店家。

目前收錄六個城市：台北、新北、桃園、台中、台南、高雄。介面支援 `zh` / `en` / `ja` 三種語系。

## 技術棧

| 項目 | 使用 |
| --- | --- |
| 框架 | Next.js 16（App Router、Server Actions） |
| UI | React 19、MUI 7、Emotion、Tailwind CSS 3 |
| 地圖 | Leaflet / react-leaflet |
| 資料庫 | PostgreSQL + Prisma 6 |
| 多語系 | next-intl（`middleware.ts` 以路徑前綴切換） |
| 其他 | JWT 登入、bcrypt、Redis（登入 / 忘記密碼限流，選用）、Nodemailer（重設密碼信，選用） |

---

## 在本機啟動專案

### 0. 事前需求

- **Node.js 22**（`package.json` 的 `engines` 限定 `^22.0.0`，且 `.npmrc` 設了 `engine-strict=true`，版本不符 `npm install` 會直接失敗）。專案附 `.nvmrc`，可直接 `nvm use`。
- **PostgreSQL**：本機安裝或用 Docker 起一個都可以。
- Redis 與 SMTP 為選用，沒有也能跑起來（見下方說明）。

```bash
nvm use            # 讀 .nvmrc，切到 Node 22
node -v            # 確認是 v22.x
```

### 1. 取得程式碼並安裝套件

```bash
git clone <repo-url>
cd coffee-map
npm install        # postinstall 會自動跑 prisma generate
```

### 2. 準備資料庫

沒有現成 Postgres 的話，用 Docker 最快：

```bash
docker run --name coffee-map-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=coffee_map \
  -p 5432:5432 -d postgres:16
```

### 3. 建立 `.env`

在專案根目錄新增 `.env`（已被 `.gitignore` 排除，不會進版控）：

```bash
# 必填 —— 資料庫連線
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/coffee_map?schema=public"

# 必填 —— 簽發登入 JWT 用，本機隨便給一組長字串即可
JWT_SECRET="請換成一組隨機字串"

# 選用 —— 登入 / 忘記密碼的限流，未設定時自動停用（只會印一行警告）
REDIS_URL="redis://localhost:6379"

# 選用 —— 寄送重設密碼信，未設定則該功能無法寄信
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="your@gmail.com"
SMTP_PASS="應用程式專用密碼"

# 選用 —— OSM 爬蟲的 Overpass 端點覆寫，預設會自動輪替公用端點
# OVERPASS_URL="https://overpass-api.de/api/interpreter"
```

> `DATABASE_URL` 同時支援本機直連（`postgresql://`）與 Prisma Accelerate（`prisma://`、`prisma+postgres://`）。[lib/prisma.ts](lib/prisma.ts) 會依連線字串自動決定要不要套 Accelerate 擴充，本機直連不需額外設定。

### 4. 建立資料表

```bash
npx prisma migrate dev      # 套用 prisma/migrations 下的既有 migration
```

### 5. 塞入初始資料（選用，但建議）

```bash
npm run seed                        # 少量示範店家（prisma/seed/shopListSeed.ts）
npx tsx prisma/seed/userSeed.ts     # 管理者帳號，需先填好 ADMIN_* 環境變數
```

想要完整的咖啡廳資料，跑 OSM 爬蟲再匯入（爬六個城市、城市間會間隔 8 秒，約需數分鐘）：

```bash
npm run crawl:osm                          # 產出 scripts/crawl/output/<city>.json 與 all.json
npx tsx prisma/seed/importOsmCafes.ts      # 讀 all.json 匯入 ShopList
```

爬蟲會沿用 `scripts/crawl/output/` 下的快取，加上 `FORCE=1` 可強制重抓。

### 6. 啟動開發伺服器

```bash
npm run dev
```

開啟 <http://localhost:3000>，會被 middleware 導向預設語系 `/zh`。

---

## 常用指令

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | `prisma generate` + 正式版建置 |
| `npm start` | 執行建置後的產物 |
| `npm run lint` | ESLint 檢查 |
| `npm run studio` | 開 Prisma Studio 檢視 / 編輯資料 |
| `npm run migrate:update -- <name>` | 建立並套用新 migration |
| `npm run reset` | **清空資料庫**並重跑所有 migration 與 seed |
| `npm run seed` | 塞入示範店家資料 |
| `npm run crawl:osm` | 從 Overpass API 爬取六城市咖啡廳 |

---

## 專案結構

```
app/
  [lang]/                  依語系的頁面路由
    [city]/map             城市地圖頁
    [city]/information     店家資訊列表頁
    (member)/              登入、註冊、會員中心、收藏、新增店家
  actions/                 Server Actions（shop / user）
components/                各頁面對應的元件
lib/
  prisma.ts                Prisma client（自動判斷是否套 Accelerate）
  redis.ts                 Redis client，未設定時降級為 no-op
  auth.ts                  JWT 驗證與寄信
  map/                     地圖 icon、城市清單等工具
prisma/
  schema.prisma            User / ShopList 資料模型
  migrations/              migration 紀錄
  seed/                    seed 與 OSM 匯入腳本
scripts/crawl/osmCafes.ts  OSM 咖啡廳爬蟲
locales/{zh,en,ja}/        翻譯字串
i18n/                      next-intl routing 設定
```

---

## 疑難排解

- **`npm install` 因 engine 檢查失敗**：切到 Node 22（`nvm use`）。若真的要略過，可用 `npm install --engine-strict=false`，但不建議。
- **`Environment variable not found: DATABASE_URL`**：`.env` 沒建立或不在專案根目錄。
- **啟動時出現 `⚠️ REDIS_URL 未設定，限流功能將停用`**：正常，本機不裝 Redis 也能開發，只是登入 / 忘記密碼沒有限流保護。
- **爬蟲抓不到資料**：公用 Overpass 端點常常忙碌，腳本已內建三個 fallback 與重試；仍失敗時可設 `OVERPASS_URL` 指定其他端點，或稍後再試。
- **地圖空白**：確認資料庫已有 `ShopList` 資料（`npm run studio` 看一下），沒有的話跑第 5 步的 seed。

---

## 部署

專案設定給 Vercel 使用，[vercel.sh](vercel.sh) 只允許 `main` 與 `test` 分支觸發建置，其餘分支會跳過。
