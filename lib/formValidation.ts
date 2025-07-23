import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';

// Function to create a Zod schema for login validation
const createLoginSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    email: z.email(t('errorMSG.email.format')).min(1, t('required')),
    password: z.string().min(8, t('errorMSG.password.length')), //TODO:密碼驗證格式待確認
  });
};

// Function to create a Zod schema for registration validation
const createRegisterSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    email: z.email(t('errorMSG.email.format')).min(1, t('errorMSG.required')),
    name: z.string().min(1, t('errorMSG.required')),
    password: z.string().min(1, t('errorMSG.required')), //TODO:密碼驗證格式待確認
    confirmPassword: z.string().min(1, t('errorMSG.required')),
  });
  // .refine(data => data.password === data.confirmPassword, {
  //   path: ['confirmPassword'],
  //   message: t('errorMSG.confirmPassword.passwordMismatch'),
  // });
};

const createForgotPasswordSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    email: z.email(t('errorMSG.email.format')).min(1, t('required')),
  });
};

const createUpdateInfoSchema = (t: ReturnType<typeof useTranslations>) => {
  return z
    .object({
      email: z.email(t('errorMSG.email.format')).min(1, t('errorMSG.required')),
      name: z.string().min(1, t('errorMSG.required')),
      password: z.string().min(1, t('errorMSG.required')), //TODO:密碼驗證格式待確認
      confirmPassword: z.string().min(1, t('errorMSG.required')),
      avatar: z
        .number()
        .min(1, t('errorMSG.required'))
        .max(1, t('errorMSG.required')),
    })
    .refine(data => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('errorMSG.confirmPassword.passwordMismatch'),
    });
};

export {
  createLoginSchema,
  createRegisterSchema,
  createForgotPasswordSchema,
  createUpdateInfoSchema,
};
