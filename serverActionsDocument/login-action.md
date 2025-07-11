## 使用者登入（Login）

### 描述
使用者透過帳號與密碼登入系統，登入成功後會在 Cookie 中寫入 JWT Token，供後續請求做身份驗證。

---

### Endpoint

```
POST /server-actions/loginAction
```

> 此為 Next.js App Router 架構中的 Server Action

---

### Request Payload

| 欄位     | 型別     | 是否必填 | 描述               |
|----------|----------|----------|--------------------|
| account  | `string` | ✅       | 使用者帳號（email）|
| password | `string` | ✅       | 使用者密碼         |
| locale   | `string` | ❌       | 語系（預設為 `"zh"`）|

#### 範例 JSON

```json
{
  "account": "user@coffeemap.com",
  "password": "123456",
  "locale": "zh"
}
```

---

### Response

| 狀態碼 | 描述                 | 回傳內容                           |
|--------|----------------------|------------------------------------|
| 200    | 登入成功             | `{ message: "登入成功" }`          |
| 400    | 資料不完整           | `{ message: "帳號和密碼為必填項目" }` |
| 401    | 帳號或密碼錯誤       | `{ message: "帳號或密碼錯誤" }`    |
| 500    | 系統錯誤或 JWT 未設定 | `{ message: "伺服器錯誤，請稍後再試" }` |

---

### 成功回應範例

```json
{
  "data": {
    "message": "登入成功"
  },
  "status": 200
}
```

**同時在 HTTP 回應中設置：**

```http
Set-Cookie: coffee_auth_token=<JWT_TOKEN>; HttpOnly; Path=/; Max-Age=604800;
```

---

### 失敗回應範例

#### 1. 缺少帳密資料

```json
{
  "data": {
    "message": "帳號和密碼為必填項目"
  },
  "status": 400
}
```

#### 2. 帳密錯誤

```json
{
  "data": {
    "message": "帳號或密碼錯誤"
  },
  "status": 401
}
```

#### 3. 系統錯誤

```json
{
  "data": {
    "message": "伺服器錯誤，請稍後再試"
  },
  "status": 500
}
```

---

### Cookies 說明

| 名稱                | 描述             | 屬性                                           |
|---------------------|------------------|------------------------------------------------|
| `coffee_auth_token` | JWT 存取 Token   | HttpOnly, Secure（prod 環境）, SameSite=Lax, Max-Age=7天 |

---
