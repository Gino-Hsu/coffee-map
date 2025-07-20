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

  const t = await getTranslations({ locale, namespace: 'GetUserServerAction' });

  if (!token) {
    return { data: { message: t('missingToken') }, status: 401 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log('decoded: ', decoded);

    const userInfo = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        avatar: true,
        email: true,
        name: true,
        role: true,
        favoriteList: true,
      },
    });

    if (!userInfo) {
      console.error('❗️User not found in prisma');
      return {
        data: { message: t('userNotFound'), resData: null },
        status: 401,
      };
    }

    console.log('✅User info found');
    return {
      data: { message: t('userFound'), resData: userInfo },
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
          data: { message: t('tokenExpired'), resData: null },
          status: 401,
        };
      }

      if (name === 'JsonWebTokenError') {
        console.warn('❗️JWT 解析錯誤');
        return {
          data: { message: t('tokenValidationFailed'), resData: null },
          status: 401,
        };
      }
    }
    return {
      data: { message: t('serverError'), resData: null },
      status: 500,
    };
  }
}
