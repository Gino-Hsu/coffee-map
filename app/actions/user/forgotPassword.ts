'use server';

import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/auth';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import redis from '@/lib/redis';

const prisma = new PrismaClient();

const BLOCK_TIME_SECONDS = 60 * 10; // 限制(分鐘)

interface forgotPasswordInput {
  email: string;
  locale: string;
}

export async function forgotPasswordAction({
  email,
  locale = 'zh',
}: forgotPasswordInput) {
  const t = await getTranslations({
    locale,
    namespace: 'ForgotPasswordAction',
  });

  //! 確保 email 不為空
  if (!email) {
    console.error('❗️Email is required');
    return { data: { message: t('emailRequired'), status: 400 } };
  }

  try {
    const redisKey = `forgotPassword:sent:${email.toLowerCase()}`;
    // 檢查是否在 10 分鐘限制中
    const exists = await redis.get(redisKey);
    if (exists) {
      console.warn(`[RateLimit] ForgotPassword email already sent: ${email}`);
      return {
        data: { message: t('tooFrequentRequest') }, // i18n 需新增
        status: 429,
      };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { data: { message: t('userNotFound') }, status: 404 };
    }

    // 產生隨機 token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 分鐘

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    // 建立 Rest Key
    const headersList = await headers(); // 等待 Promise
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const resetLink = `${protocol}://${host}/${locale}/reset-password-mail?token=${token}`;

    const emailSubject = t('emailSubject');
    const emailBody = t('emailBody', { link: resetLink });
    await sendEmail(user.email, emailSubject, emailBody);

    // 設置 Redis 避免重複發送
    await redis.set(redisKey, '1', 'EX', BLOCK_TIME_SECONDS);

    console.log('success send Email');
    return { data: { message: t('success') }, status: 200 };
  } catch (error) {
    console.error('❗️ForgotPassword error:', error);
    return { date: { message: t('serverError') }, status: 500 };
  }
}
