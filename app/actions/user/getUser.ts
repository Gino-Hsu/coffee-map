'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function getUserAction(locale: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('coffee_auth_token')?.value;
  console.log('userAction called with token');

  const t = await getTranslations({ locale, namespace: 'LoginServerAction' });

  if (!token) {
    return { data: { message: t('missing') }, status: 401 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userInfo = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        favoriteList: true,
      },
    });
    console.log('✅User info found');
    return {
      data: { message: '成功抓取登入資料', resData: userInfo },
      status: 200,
    };
  } catch (error) {
    console.error('❗️JWT 解析錯誤', error);
    return {
      data: { message: 'JWT 解析錯誤', resData: null },
      status: 500,
    };
  }
}
