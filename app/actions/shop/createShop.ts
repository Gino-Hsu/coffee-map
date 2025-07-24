'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logoutAction } from '../user/logout';
import { getCoordsFromAddress } from '@/lib/map/helper';

interface createShopParams {
  name: string;
  address: string;
  city: string;
}

export async function createShopAction({
  name,
  address,
  city,
}: createShopParams) {
  const cookieStore = await cookies();
  const token = cookieStore.get('coffee_auth_token')?.value;

  if (!token) {
    return { data: { message: 'missingToken' }, status: 401 };
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
        data: { message: 'userNotFound' },
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
  } catch (error) {
    await logoutAction();
    console.error('JWT 驗證錯誤', error);

    return {
      data: { message: 'invalidToken' },
      status: 403,
    };
  }
}
