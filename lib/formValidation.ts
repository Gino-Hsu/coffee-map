import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';

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

export {
  createLoginSchema,
  createRegisterSchema,
  createForgotPasswordSchema,
  createResetPasswordMailSchema,
};
