'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { logoutAction } from '../user/logout';
import { getCoordsFromAddress } from '@/lib/map/helper';

interface createShopParams {
  name: string;
  address: string;
  city: string;
  locale: string;
}

export async function createShopAction({
  name,
  address,
  city,
  locale,
}: createShopParams) {
  const t = await getTranslations({ locale, namespace: 'CreateShopAction' });
  const cookieStore = await cookies();
  const token = cookieStore.get('coffee_auth_token')?.value;

  if (!token) {
    return { data: { message: t('missingToken') }, status: 401 };
  }

  try {
    const decoded = verifyToken(token) as {
      userId: string;
    };
    const userId = decoded.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      await logoutAction();
      return {
        data: { message: t('userNotFound') },
        status: 404,
      };
    }

    // 地址轉經緯度
    const { lat, lng } = await getCoordsFromAddress(address);

    // 建立店家資料
    const newShop = await prisma.shopList.create({
      data: {
        name,
        address,
        city,
        lat,
        lng,
        createdBy: userId,
      },
    });

    // 更新 user 的 createdList
    await prisma.user.update({
      where: { id: userId },
      data: {
        createdList: {
          push: newShop.id,
        },
      },
    });

    return { data: newShop, status: 200 };
  } catch (e) {
    if (e instanceof Error) {
      const name = e?.name;
      console.log('error in getUserAction, name: ', name);

      if (name === 'TokenExpiredError') {
        console.warn('❗️JWT 已過期');
        await logoutAction();
        return {
          data: { message: t('tokenExpired'), resData: null },
          status: 401,
        };
      }

      if (name === 'JsonWebTokenError') {
        await logoutAction();
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
