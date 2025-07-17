'use server';

import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getTranslations } from 'next-intl/server';
import redis from '@/lib/redis';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = '7d';

const MAX_ATTEMPTS = 3; // 上限次數
const BLOCK_TIME_SECONDS = 60 * 5; // 封鎖時間(分鐘)

interface loginInput {
  email: string;
  password: string;
  locale?: string;
}

export async function loginAction({
  email,
  password,
  locale = 'zh',
}: loginInput) {
  const t = await getTranslations({ locale, namespace: 'LoginServerAction' });

  console.log('loginAction called with:', { email });
  //! 確保帳號和密碼不為空
  if (!email || !password) {
    console.error('❗️Email and password are required');
    return { data: { message: t('missing') }, status: 400 };
  }
  //! 確保 JWT_SECRET 已定義
  if (!JWT_SECRET) {
    console.error('❗️JWT_SECRET is not defined');
    return { data: { message: t('serverError') }, status: 500 };
  }

  // ! 確保請求不超過上限
  const redisKey = `login:attempts:${email.toLowerCase()}`;
  const attempts = await redis.get(redisKey);
  if (attempts && parseInt(attempts) >= MAX_ATTEMPTS) {
    console.error(
      `[RateLimit] Too many login attempts for email: ${email}. Attempts: ${attempts}, Limit: ${MAX_ATTEMPTS}, Key: ${redisKey}`
    );
    return {
      data: {
        message: t('tooManyAttempts'),
      },
      status: 429,
    };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    //! 檢查使用者是否存在以及密碼是否正確
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error('❗️Invalid email or password');

      // 增加失敗次數
      await redis.incr(redisKey);
      await redis.expire(redisKey, BLOCK_TIME_SECONDS);

      return { data: { message: t('invalidCredentials') }, status: 401 };
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: EXPIRES_IN }
    );
    const cookieStore = await cookies();
    cookieStore.set('coffee_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // 登入成功，清除 login attempts
    await redis.del(redisKey);

    // 返回成功訊息和狀態碼
    console.log('✅Login successful, token set in cookies');
    return { data: { message: t('success') }, status: 200 };
  } catch (error) {
    console.error('❗️Login error:', error);
    return { date: { message: t('serverError') }, status: 500 };
  }
}
