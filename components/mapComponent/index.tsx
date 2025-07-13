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

export default async function MapComponent({
  lang,
  city,
}: {
  lang: string;
  city: string;
}) {
  const getShop = await getShopsAction({ city });
  if (getShop.status !== 200) {
    console.error('Error fetching shops:', getShop.data.message);
    return <div>Error loading coffee shops.</div>;
  }
  const shopsData: coffeeShop[] = getShop.data.resData
    ? getShop.data.resData
    : [];

  const dummyFavoriteLists = ['1']; // TODO 待更換成使用者資料

  return (
    <CoffeeMap shops={shopsData} favorites={dummyFavoriteLists} lang={lang} />
  );
}
