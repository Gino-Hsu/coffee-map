import { PrismaClient, Prisma } from '../app/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const rawUserData = [
  {
    name: 'YuAn',
    email: 'YuA@coffeemap.com',
    password: '123456',
    role: 'admin',
  },
  {
    name: 'Gino',
    email: 'Gino@coffeemap.com',
    password: '123456',
    role: 'admin',
  },
];

// 用 bcrypt 加密所有密碼
async function hashUserData(
  data: typeof rawUserData
): Promise<Prisma.UserCreateInput[]> {
  return Promise.all(
    data.map(async u => ({
      ...u,
      password: await bcrypt.hash(u.password, 10),
    }))
  );
}

export async function main() {
  const userData = await hashUserData(rawUserData);

  for (const u of userData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
