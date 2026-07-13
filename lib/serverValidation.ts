// Server 端的最後一道輸入驗證。
// 前端 lib/formValidation.ts 已用相同規則做即時驗證並顯示逐欄訊息；
// 由於 Server Action 本質上是公開 endpoint，可被直接呼叫，這裡再驗一次以防
// 繞過前端送入不合法或惡意的資料。這些 schema 不依賴 i18n，只回傳 pass/fail。
import { z } from 'zod/v4';
import { enumCity } from '@/type/shopsType';

// 至少 8 碼，且同時包含英文字母與數字（與前端規則一致）
const passwordSchema = z
  .string()
  .min(8)
  .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/);

// 空字串視為「未輸入」→ 通過（更新資料時密碼為選填）
const optionalPasswordSchema = z.preprocess(
  val => (typeof val === 'string' && val.trim() === '' ? undefined : val),
  passwordSchema.optional()
);

export const registerServerSchema = z
  .object({
    email: z.email(),
    name: z.string().trim().min(1),
    password: passwordSchema,
    confirmPassword: z.string().min(1),
  })
  .refine(data => data.password === data.confirmPassword);

export const resetPasswordServerSchema = z.object({
  token: z.string().min(1),
  newPassword: passwordSchema,
});

export const updateUserServerSchema = z.object({
  name: z.string().trim().min(1),
  avatar: z.number().int().min(1),
  password: optionalPasswordSchema,
});

const cityValues = Object.values(enumCity) as [string, ...string[]];

export const createShopServerSchema = z.object({
  name: z.string().trim().min(1),
  address: z.string().trim().min(1),
  city: z.enum(cityValues),
});
