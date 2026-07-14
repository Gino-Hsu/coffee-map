import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? '';
  const client = new PrismaClient();
  // 只有 Accelerate 連線字串 (雲端) 才套用擴充；
  // 本機直連 Postgres (postgresql://) 用一般 client，否則 Accelerate 會報錯。
  // 擴充只改變執行時行為，型別上轉回 PrismaClient 讓呼叫端一致。
  if (url.startsWith('prisma://') || url.startsWith('prisma+postgres://')) {
    return client.$extends(withAccelerate()) as unknown as PrismaClient;
  }
  return client;
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
