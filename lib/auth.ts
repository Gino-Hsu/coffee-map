import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET as string);
}

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true = 465, false = 587
    auth: {
      user: process.env.SMTP_USER, // 寄件人帳號
      pass: process.env.SMTP_PASS, // 寄件人密碼或 App Password
    },
  });

  // 寄信
  await transporter.sendMail({
    from: `"Coffee Map" <${process.env.SMTP_USER}>`, // 寄件人
    to, // 收件人
    subject, // 主旨
    html, // HTML 內容
  });
}
