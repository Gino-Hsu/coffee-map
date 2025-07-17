'use server';

import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import bcrypt from 'bcrypt';

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
  console.log('registerAction called with:', { email });

  //! 確保帳號、名稱密碼、忘記密碼皆不為空
  if (
    !email.trim() ||
    !name.trim() ||
    !password.trim() ||
    !confirmPassword.trim()
  ) {
    console.error('❗️All register fields are required.');
    return { data: { message: t('missing') }, status: 400 };
  }

  //! 密碼跟確認密碼有沒有一樣
  if (password.trim() !== confirmPassword.trim()) {
    console.error("❗️Password doesn't match with confirmPassword.");
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
    const newUser = await prisma.user.create({
      data: {
        email: email.trim(),
        name: name.trim(),
        password: hashedPassword,
      },
    });
    // 返回成功訊息和狀態碼
    console.log('✅Register successful, newUser', {
      id: newUser.id,
      email: newUser.email,
    });

    return { data: { message: t('success') }, status: 200 };
  } catch (error) {
    console.error('❗️Register error:', error);
    return { date: { message: t('serverError') }, status: 500 };
  }
}
