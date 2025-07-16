'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { logoutAction } from './logout';

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
    console.log('decoded: ', decoded);

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

    if (!userInfo) {
      console.error('❗️User not found in prisma');
      return {
        data: { message: '找不到對應的user資料', resData: null },
        status: 401,
      };
    }

    console.log('✅User info found');
    return {
      data: { message: '成功抓取登入資料', resData: userInfo },
      status: 200,
    };
  } catch (e) {
    await logoutAction();
    if (e instanceof Error) {
      const name = e?.name;
      console.log('error in getUserAction, name: ', name);

      if (name === 'TokenExpiredError') {
        console.warn('❗️JWT 已過期');
        return {
          data: { message: '登入已過期，請重新登入', resData: null },
          status: 401,
        };
      }

      if (name === 'JsonWebTokenError') {
        console.warn('❗️JWT 解析錯誤');
        return {
          data: { message: '驗證失敗，請重新登入', resData: null },
          status: 401,
        };
      }
    }
    return {
      data: { message: 'server error', resData: null },
      status: 500,
    };
  }
}
