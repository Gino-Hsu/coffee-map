'use server';

import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getTranslations } from 'next-intl/server';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = '7d';

interface LoginInput {
  account: string;
  password: string;
  locale?: string;
}

export async function loginAction({
  account,
  password,
  locale = 'zh',
}: LoginInput) {
  const t = await getTranslations({ locale, namespace: 'LoginServerAction' });

  console.log('loginAction called with:', { account, password });
  //! 確保帳號和密碼不為空
  if (!account || !password) {
    console.error('❗️Account and password are required');
    return { data: { message: t('missing') }, status: 400 };
  }
  //! 確保 JWT_SECRET 已定義
  if (!JWT_SECRET) {
    console.error('❗️JWT_SECRET is not defined');
    return { data: { message: t('serverError') }, status: 500 };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: account } });
    //! 檢查使用者是否存在以及密碼是否正確
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error('❗️Invalid account or password');
      return { data: { message: t('invalidCredentials') }, status: 401 };
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: EXPIRES_IN }
    );
    const cookieStore = await cookies();
    cookieStore.set('coffee_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // 返回成功訊息和狀態碼
    console.log('✅Login successful, token set in cookies');
    return { data: { message: t('success') }, status: 200 };
  } catch (error) {
    console.error('❗️Login error:', error);
    return { date: { message: t('serverError') }, status: 500 };
  }
}
