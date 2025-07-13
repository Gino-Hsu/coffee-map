import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rawShopData = [
  {
    name: 'Sugar man cafe',
    lat: 25.02739357157063,
    lng: 121.52571664106625,
    address: '台北市大安區和平東路一段87-1號',
    city: '',
  },
  {
    name: 'Tamed Fox 信義店',
    lat: 25.03731912935143,
    lng: 121.56958405455848,
    address: '台北市信義區松仁路91號B1',
    city: 'taipei',
  },
];

export async function main() {
  for (const shop of rawShopData) {
    await prisma.shopList.upsert({
      where: { name: shop.name },
      update: { ...shop, city: shop.city || 'taipei' },
      create: { ...shop, city: shop.city || 'taipei' },
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
