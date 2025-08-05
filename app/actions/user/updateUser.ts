'use server';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { logoutAction } from '@/app/actions/user/logout';
import bcrypt from 'bcrypt';

interface updateData {
  name: string;
  avatar: number;
  password?: string;
}
interface updateInfoInput extends updateData {
  email: string;
  name: string;
  avatar: number;
  password: string;
  locale?: string;
}

export async function updateUserAction({
  email,
  name,
  avatar,
  password,
  locale = 'zh',
}: updateInfoInput) {
  const t = await getTranslations({
    locale,
    namespace: 'MemberCenterPage',
  });
  console.log('updateUserActions called with:', { email });

  const cookieStore = await cookies();
  const token = cookieStore.get('coffee_auth_token')?.value;

  if (!token) {
    await logoutAction();
    return { data: { message: t('missingToken') }, status: 401 };
  }

  //! 確保姓名、大頭貼皆不為空
  if (!name.trim() || !avatar) {
    console.error('❗️All fields are required.');
    return { data: { message: t('missing') }, status: 400 };
  }

  const updateData: updateData = { name, avatar };

  if (password.trim()) {
    // 如果有輸入密碼，就加密密碼並存入使用者資料
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    updateData.password = hashedPassword;
  }

  try {
    // 用email找到對user並且更新name/avatar欄位
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { ...updateData },
    });

    //找不到或是更新失敗時回傳status
    if (!updatedUser) {
      console.error('❗️Invalid email or password');
      return { data: { message: t('invalidCredentials') }, status: 401 };
    }

    // 返回成功訊息和狀態碼
    console.log('✅Update info successful, updatedUser', {
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    });

    return { data: { message: t('success') }, status: 200 };
  } catch (error) {
    console.error('Update user error:', error);
    return { data: { message: t('serverError') }, status: 500 };
  }
}
