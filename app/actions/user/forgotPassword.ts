'use server';

import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/auth';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

interface forgotPasswordInput {
  email: string;
}

export async function forgotPasswordAction({ email }: forgotPasswordInput) {
  //! 確保 email 不為空
  if (!email) {
    console.error('❗️Email is required');
    return { data: { message: 'Email 不得為空', status: 400 } };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { data: { message: 'User not found' }, status: 404 };
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

    const headersList = await headers(); // 等待 Promise
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const resetLink = `${protocol}://${host}/reset-password?token=${token}`;

    await sendEmail(user.email, 'Password Reset', `Click here: ${resetLink}`);

    console.log('success send Email');
    return { data: { message: 'success' }, status: 200 };
  } catch (error) {
    console.error('❗️ForgotPassword error:', error);
    return { date: { message: 'server error' }, status: 500 };
  }
}
