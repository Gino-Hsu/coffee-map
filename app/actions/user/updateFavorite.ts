'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { logoutAction } from './logout';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function updateFavoriteAction(locale: string, shopId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('coffee_auth_token')?.value;
  console.log('userAction called with token');

  const t = await getTranslations({
    locale,
    namespace: 'UpdateFavoriteAction',
  });

  if (!token) {
    return { data: { message: t('unverifiedUser') }, status: 401 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log('decoded: ', decoded);
    const userId = decoded.userId;

    // 查詢目前的 favoriteList
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favoriteList: true },
    });

    if (!user) {
      return { data: { message: 'User not found' }, status: 404 };
    }

    const currentFavorites = user.favoriteList || [];
    let updatedFavorites: string[];

    if (currentFavorites.includes(shopId)) {
      // 如果已存在 → 移除
      updatedFavorites = currentFavorites.filter(id => id !== shopId);
    } else {
      // 如果不存在 → 加入
      updatedFavorites = [...currentFavorites, shopId];
    }

    // 更新 favoriteList
    await prisma.user.update({
      where: { id: userId },
      data: { favoriteList: updatedFavorites },
    });

    return {
      data: {
        message: currentFavorites.includes(shopId)
          ? t('removedFavorite')
          : t('addedFavorite'),
        resData: updatedFavorites,
      },
      status: 200,
    };
  } catch (error) {
    await logoutAction();
    if (error instanceof Error) {
      const name = error?.name;
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
          data: { message: t('unverifiedUser'), resData: null },
          status: 401,
        };
      }
    }
    console.error('❗️update Favorite error:', error);
    return {
      data: { message: t('serverError'), resData: null },
      status: 500,
    };
  }
}
