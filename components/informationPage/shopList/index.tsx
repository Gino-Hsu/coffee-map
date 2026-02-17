import Link from "next/link";
import PlaceIcon from "@mui/icons-material/Place";
import { notFound } from "next/navigation";
import { getShopsAction } from "@/app/actions/shop/getShops";
import { coffeeShop } from "@/type/shopsType";
import { getTranslations } from "next-intl/server";

export default async function ShopList({ city }: { city: string }) {
  const t = await getTranslations("InformationPage");
  const getShop = await getShopsAction({ city });
  if (getShop.status !== 200) {
    console.error("Error fetching shops:", getShop.data.message);
    notFound();
  }
  const shopsData: coffeeShop[] = getShop.data.resData
    ? getShop.data.resData
    : [];

  return (
    <table className="w-full border-collapse overflow-hidden rounded-lg shadow-lg">
      <thead>
        <tr>
          <th className="bg-custom-bgColor-dark py-2 text-white">
            {t("shopList.name")}
          </th>
          <th className="bg-custom-bgColor-dark py-2 text-white">
            {t("shopList.address")}
          </th>
          <th className="bg-custom-bgColor-dark py-2 text-white">Coffee Map</th>
          <th className="bg-custom-bgColor-dark py-2 text-white">Google Map</th>
        </tr>
      </thead>
      <tbody>
        {shopsData.map((shop) => (
          <tr
            key={shop.id}
            className="hover:bg-custom-table-bgColor-hover border-b-2 border-gray-200 bg-white last:border-none"
          >
            <td className="p-2 text-center">{shop.name}</td>
            <td className="p-2 text-center">{shop.address}</td>
            <td className="p-2 text-center">
              <Link
                className="hover:text-custom-fontColor-hover flex cursor-pointer items-center justify-center gap-2"
                href={`/${city}/map?id=${shop.id}`}
              >
                <PlaceIcon />
                {t("shopList.goCoffeeMap")}
              </Link>
            </td>
            <td className="p-2 text-center">
              <Link
                className="hover:text-custom-fontColor-hover flex cursor-pointer items-center justify-center gap-2"
                href={`https://www.google.com/maps?q=https://www.google.com/maps/place/${shop.name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PlaceIcon />
                {t("shopList.goGoogleMap")}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
