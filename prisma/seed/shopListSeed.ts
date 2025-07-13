import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rawShopData = [
  {
    name: 'Sugar man cafe',
    lat: 121.52542545148718,
    lng: 25.02825916972888,
    address: '台北市大安區和平東路一段87-1號',
    city: '',
  },
  {
    name: 'Tamed Fox 信義店',
    lat: 121.52542545148718,
    lng: 25.02825916972888,
    address: '台北市信義區松仁路91號B1',
    city: 'Taipei',
  },
];

export async function main() {
  for (const shop of rawShopData) {
    await prisma.shopList.upsert({
      where: { name: shop.name },
      update: {},
      create: { ...shop, city: shop.city || 'Taipei' },
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
