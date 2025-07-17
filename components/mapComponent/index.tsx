import { notFound } from 'next/navigation';
import { getShopsAction } from '@/app/actions/shop/getShops';
import CoffeeMap from './coffeeMap';
interface coffeeShop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  createdAt: Date;
  createdBy: string | null;
}

export default async function MapComponent({ city }: { city: string }) {
  const getShop = await getShopsAction({ city });
  if (getShop.status !== 200) {
    console.error('Error fetching shops:', getShop.data.message);
    notFound();
  }
  const shopsData: coffeeShop[] = getShop.data.resData
    ? getShop.data.resData
    : [];

  return <CoffeeMap shops={shopsData} />;
}
