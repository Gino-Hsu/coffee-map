'use server';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logoutAction } from '@/app/actions/user/logout';
import { updateUserServerSchema } from '@/lib/serverValidation';
import bcrypt from 'bcrypt';

interface updateData {
  name: string;
  avatar: number;
  password?: string;
}
interface updateInfoInput extends updateData {
  name: string;
  avatar: number;
  password: string;
  locale?: string;
}

export async function updateUserAction({
  name,
  avatar,
  password,
  locale = 'zh',
}: updateInfoInput) {
  const t = await getTranslations({
    locale,
    namespace: 'MemberCenterPage',
  });

  const cookieStore = await cookies();
  const token = cookieStore.get('coffee_auth_token')?.value;

  if (!token) {
    await logoutAction();
    return { data: { message: t('missingToken') }, status: 401 };
  }

  //! Server 端驗證：姓名必填、頭像有效、若有輸入密碼需符合強度規則
  const parsed = updateUserServerSchema.safeParse({ name, avatar, password });
  if (!parsed.success) {
    console.error('❗️Update user validation failed');
    return { data: { message: t('missing') }, status: 400 };
  }

  const updateData: updateData = { name: name.trim(), avatar };

  if (password.trim()) {
    // 如果有輸入密碼，就加密密碼並存入使用者資料
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    updateData.password = hashedPassword;
  }

  try {
    //! 從 token 取出身分，只允許更新自己的資料（不信任前端傳來的 email）
    const decoded = verifyToken(token) as { userId: string };
    const userId = decoded.userId;

    // 用 token 的 userId 更新 name/avatar/password 欄位
    await prisma.user.update({
      where: { id: userId },
      data: { ...updateData },
    });

    // 返回成功訊息和狀態碼
    console.log('✅Update info successful');

    return { data: { message: t('success') }, status: 200 };
  } catch (error) {
    if (error instanceof Error) {
      const name = error.name;
      if (name === 'TokenExpiredError' || name === 'JsonWebTokenError') {
        console.warn('❗️JWT 驗證失敗:', name);
        await logoutAction();
        return { data: { message: t('missingToken') }, status: 401 };
      }
    }
    console.error('Update user error:', error);
    return { data: { message: t('serverError') }, status: 500 };
  }
}
