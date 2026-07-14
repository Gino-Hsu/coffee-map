import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { enumCity } from '@/type/shopsType';

const passwordSchema = (t: ReturnType<typeof useTranslations>) =>
  z
    .string()
    .min(8, t('errorMSG.password.length'))
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
      t('errorMSG.password.requireAlphaNum')
    );

const createLoginSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    email: z.email(t('errorMSG.email.format')).min(1, t('errorMSG.required')),
    password: passwordSchema(t),
  });
};

const createRegisterSchema = (t: ReturnType<typeof useTranslations>) => {
  return z
    .object({
      email: z.email(t('errorMSG.email.format')).min(1, t('errorMSG.required')),
      name: z.string().min(1, t('errorMSG.required')),
      password: passwordSchema(t),
      confirmPassword: z.string().min(1, t('errorMSG.required')),
    })
    .refine(data => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('errorMSG.confirmPassword.passwordMismatch'),
    });
};

const createForgotPasswordSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    email: z.email(t('errorMSG.email.format')).min(1, t('required')),
  });
};

const createResetPasswordMailSchema = (
  t: ReturnType<typeof useTranslations>
) => {
  return z
    .object({
      password: passwordSchema(t),
      confirmPassword: z.string().min(1, t('errorMSG.required')),
    })
    .refine(data => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('errorMSG.confirmPassword.passwordMismatch'),
    });
};

// Object.values 取出的是 string[]
const cityValues = Object.values(enumCity) as [string, ...string[]];

const createShopSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    name: z.string().min(1, t('errorMSG.required')),
    address: z.string().min(1, t('errorMSG.required')),
    city: z.enum(cityValues, {
      message: t('errorMSG.required'),
    }),
  });
};

const createUpdateInfoSchema = (t: ReturnType<typeof useTranslations>) => {
  return z
    .object({
      name: z.string().min(1, t('errorMSG.required')),
      password: z.preprocess(
        val => (typeof val === 'string' && val.trim() === '' ? undefined : val),
        passwordSchema(t).optional()
      ),
      confirmPassword: z.string(),
      avatar: z.number().min(1, t('errorMSG.required')),
    })
    .refine(data => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('errorMSG.confirmPassword.passwordMismatch'),
    });
};

export {
  createLoginSchema,
  createRegisterSchema,
  createUpdateInfoSchema,
  createForgotPasswordSchema,
  createResetPasswordMailSchema,
  createShopSchema,
};
