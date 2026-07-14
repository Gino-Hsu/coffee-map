import { notFound } from "next/navigation";
import { getShopsAction } from "@/app/actions/shop/getShops";
import { coffeeShop } from "@/type/shopsType";
import LazyCoffeeMap from "./LazyCoffeeMap";

export default async function MapPage({ city }: { city: string }) {
  const getShop = await getShopsAction({ city });
  if (getShop.status !== 200) {
    console.error("Error fetching shops:", getShop.data.message);
    notFound();
  }
  const shopsData: coffeeShop[] = getShop.data.resData
    ? getShop.data.resData
    : [];

  return <LazyCoffeeMap shops={shopsData} />;
}
