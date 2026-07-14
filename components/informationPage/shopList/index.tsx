import Link from "next/link";
import PlaceIcon from "@mui/icons-material/Place";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MapIcon from "@mui/icons-material/Map";
import { notFound } from "next/navigation";
import { getShopsAction } from "@/app/actions/shop/getShops";
import { coffeeShop } from "@/type/shopsType";
import { getTranslations } from "next-intl/server";

// 空值時顯示的佔位符
function Empty() {
  return <span className="text-gray-300">—</span>;
}

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

  if (shopsData.length === 0) {
    return (
      <div className="rounded-xl border border-custom-borderColor bg-white/60 py-16 text-center text-gray-400">
        {t("shopList.emptyList")}
      </div>
    );
  }

  return (
    <div>
      {/* 店家數量 */}
      <p className="mb-3 pl-1 text-sm font-medium text-custom-fontColor/70">
        {t("shopList.shopCount", { count: shopsData.length })}
      </p>

      {/* 橫向可捲動容器，避免窄螢幕被擠壓 */}
      <div className="overflow-x-auto rounded-xl border border-custom-borderColor shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-custom-bgColor-dark text-white">
              <th className="px-4 py-3 text-left font-semibold">
                {t("shopList.name")}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t("shopList.address")}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t("shopList.phone")}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t("shopList.openingHours")}
              </th>
              <th className="px-4 py-3 text-center font-semibold">Coffee Map</th>
              <th className="px-4 py-3 text-center font-semibold">Google Map</th>
            </tr>
          </thead>
          <tbody>
            {shopsData.map((shop, i) => (
              <tr
                key={shop.id}
                className={`border-t border-gray-100 transition-colors hover:bg-custom-table-bgColor-hover ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                }`}
              >
                {/* 店名 */}
                <td className="whitespace-nowrap px-4 py-3 font-medium text-custom-fontColor">
                  {shop.name}
                </td>

                {/* 地址 */}
                <td className="px-4 py-3 text-gray-600">
                  {shop.address ? shop.address : <Empty />}
                </td>

                {/* 電話 */}
                <td className="whitespace-nowrap px-4 py-3">
                  {shop.phone ? (
                    <a
                      href={`tel:${shop.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-custom-fontColor-hover"
                    >
                      <LocalPhoneIcon sx={{ fontSize: 16 }} />
                      {shop.phone}
                    </a>
                  ) : (
                    <Empty />
                  )}
                </td>

                {/* 營業時間 */}
                <td className="px-4 py-3 text-gray-600">
                  {shop.openingHours ? (
                    <span
                      className="inline-flex max-w-[220px] items-center gap-1"
                      title={shop.openingHours}
                    >
                      <AccessTimeIcon
                        sx={{ fontSize: 16 }}
                        className="shrink-0"
                      />
                      <span className="truncate">{shop.openingHours}</span>
                    </span>
                  ) : (
                    <Empty />
                  )}
                </td>

                {/* Coffee Map */}
                <td className="px-4 py-3 text-center">
                  <Link
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-custom-borderColor px-3 py-1.5 text-custom-fontColor transition-all hover:border-transparent hover:bg-custom-bgColor-hover hover:text-white"
                    href={`/${city}/map?shop_id=${shop.id}`}
                  >
                    <PlaceIcon sx={{ fontSize: 18 }} />
                    <span className="whitespace-nowrap">
                      {t("shopList.goCoffeeMap")}
                    </span>
                  </Link>
                </td>

                {/* Google Map */}
                <td className="px-4 py-3 text-center">
                  <Link
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-custom-borderColor px-3 py-1.5 text-custom-fontColor transition-all hover:border-transparent hover:bg-custom-bgColor-hover hover:text-white"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${shop.name} ${shop.address ?? ""}`.trim(),
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapIcon sx={{ fontSize: 18 }} />
                    <span className="whitespace-nowrap">
                      {t("shopList.goGoogleMap")}
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
