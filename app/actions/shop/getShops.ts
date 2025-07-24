'use server';

import prisma from '@/lib/prisma';

interface getShopsParams {
  city: string;
}

enum cityEnum {
  TAIPEI = 'taipei',
}

const validateCityArr: string[] = [cityEnum.TAIPEI];

export async function getShopsAction({ city }: getShopsParams) {
  const cityLower = city.trim().toLowerCase();
  //! 確保 city 不為空
  if (!cityLower) {
    console.error('❗️City is required');
    return { data: { message: 'City is required' }, status: 400 };
  }
  //! 確保 city 在允許的城市列表中
  if (!validateCityArr.includes(cityLower)) {
    console.error('❗️Invalid city:', city);
    return { data: { message: 'Invalid city' }, status: 400 };
  }

  try {
    const shops = await prisma.shopList.findMany({
      where: {
        city: {
          equals: cityLower,
          mode: 'insensitive', // 不區分大小寫
        },
      },
      orderBy: {
        // 根據 createdAt 欄位降序排列
        createdAt: 'desc',
      },
      select: {
        // 選擇需要的欄位
        id: true,
        name: true,
        address: true,
        city: true,
        lat: true,
        lng: true,
        createdAt: true,
        createdBy: true,
      },
    });

    if (shops.length === 0) {
      //! 如果沒有找到商店，返回適當的訊息
      console.warn('❗️No shops found for city:', city);
      return { data: { message: 'No shops found' }, status: 404 };
    }

    // 返回找到的商店列表
    console.log('✅ Shops fetched successfully:', shops.length, shops);
    return {
      data: {
        message: 'Shops fetched successfully',
        resData: shops,
      },
      status: 200,
    };
  } catch (error) {
    console.error('❗️Error fetching shops:', error);
    return { data: { message: 'Server error' }, status: 500 };
  }
}
