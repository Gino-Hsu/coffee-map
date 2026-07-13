import { enumCity } from "@/type/shopsType";
import { useTranslations } from "next-intl";
import ShopList from "./shopList";

export default function InformationPage({ city }: { city: enumCity }) {
  const t = useTranslations("City");
  return (
    <div className="h-full w-full">
      <div className="mt-20 text-center text-2xl font-bold text-custom-fontColor">
        {t(city)}
      </div>
      <div className="mx-5 mt-10">
        <ShopList city={city} />
      </div>
    </div>
  );
}
