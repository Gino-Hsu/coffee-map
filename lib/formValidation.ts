import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
const createLoginSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    account: z.email(t('errorMSG.email.format')).min(1, t('required')),
    password: z.string().min(1, t('required')), //TODO:密碼驗證格式待確認
  });
};

export { createLoginSchema };
