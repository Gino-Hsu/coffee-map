'use server';

import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import bcrypt from 'bcrypt';
import { resetPasswordServerSchema } from '@/lib/serverValidation';

interface resetPasswordMailInput {
  token: string;
  newPassword: string;
  locale?: string;
}

export async function resetPasswordMailAction({
  token,
  newPassword,
  locale = 'zh',
}: resetPasswordMailInput) {
  const t = await getTranslations({
    locale,
    namespace: 'ResetPasswordMailAction',
  });

  //! Server 端驗證：token 存在、密碼符合強度規則（前端可能被繞過）
  const parsed = resetPasswordServerSchema.safeParse({ token, newPassword });
  if (!parsed.success) {
    console.error('❗️Reset password validation failed');
    return { data: { message: t('missingFields') }, status: 400 };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() },
      },
    });

    //! 找不到使用者或token過期
    if (!user) {
      console.error('❗️invalidOrExpiredToken');
      return { data: { message: t('invalidOrExpiredToken') }, status: 400 };
    }

    // 重新設定密碼
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    console.log('✅Reset password success by email');
    return { data: { message: t('success') }, status: 200 };
  } catch (error) {
    console.error('❗️resetPasswordAction error:', error);
    return { data: { message: t('serverError') }, status: 500 };
  }
}
