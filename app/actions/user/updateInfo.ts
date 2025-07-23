'use server';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
// import { cookies } from 'next/headers';

interface updateInfoInput {
  email: string;
  name: string;
  avatar: number;
  locale?: string;
}

export async function updateInfoAction({
  email,
  name,
  avatar,
  locale = 'zh',
}: updateInfoInput) {
  const t = await getTranslations({
    locale,
    namespace: 'MemberCenterPage',
  });

  // const cookieStore = await cookies();
  // const token = cookieStore.get('coffee_auth_token')?.value;
  // console.log('updateInfoAction called with token');

  // if (!token) {
  //   return { data: { message: t('missingToken') }, status: 401 };
  // }

  //! 確保信箱、名稱、大頭貼皆不為空
  if (!name.trim() || !avatar) {
    console.error('❗️All register fields are required.');
    return { data: { message: t('missing') }, status: 400 };
  }

  try {
    // 用email找到對user並且更新name/avatar欄位
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { name, avatar },
    });

    //找不到或是更新失敗時回傳status
    if (!updatedUser) {
      console.error('❗️Invalid email or password');
      return { data: { message: 'invalidCredentials' }, status: 401 };
    }

    // 返回成功訊息和狀態碼
    console.log('✅Update info successful, updatedUser', {
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    });

    return { data: { message: t('success') }, status: 200 };
  } catch (error) {
    console.error('❗️Register error:', error);
    return { date: { message: t('serverError') }, status: 500 };
  }
}
