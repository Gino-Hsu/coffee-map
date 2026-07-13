'use server';

import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import bcrypt from 'bcrypt';
import { registerServerSchema } from '@/lib/serverValidation';

interface registerInput {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  locale?: string;
}

export async function registerAction({
  email,
  name,
  password,
  confirmPassword,
  locale = 'zh',
}: registerInput) {
  const t = await getTranslations({
    locale,
    namespace: 'RegisterServerAction',
  });

  //! Server 端驗證：帳號格式、密碼強度、必填欄位（前端可能被繞過）
  const parsed = registerServerSchema.safeParse({
    email,
    name,
    password,
    confirmPassword,
  });
  if (!parsed.success) {
    console.error('❗️Register validation failed');
    return { data: { message: t('missing') }, status: 400 };
  }

  //! 密碼跟確認密碼有沒有一樣
  if (password.trim() !== confirmPassword.trim()) {
    return { data: { message: t('confirmPasswordUnmatched') }, status: 400 };
  }

  //! 檢查帳號是否已註冊過
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!!existingUser) {
    console.error('❗️Email already in use');
    return { data: { message: t('emailAlreadyInUse') }, status: 400 };
  }

  // 加密密碼並存入使用者資料
  const hashedPassword = await bcrypt.hash(password.trim(), 10);

  try {
    await prisma.user.create({
      data: {
        email: email.trim(),
        name: name.trim(),
        password: hashedPassword,
      },
    });
    // 返回成功訊息和狀態碼
    console.log('✅Register successful');

    return { data: { message: t('success') }, status: 200 };
  } catch (error) {
    console.error('❗️Register error:', error);
    return { data: { message: t('serverError') }, status: 500 };
  }
}
