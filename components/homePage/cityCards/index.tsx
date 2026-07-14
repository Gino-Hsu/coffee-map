import CityCard from "./cityCard";
import { cityList } from "@/lib/map/city";
import { useTranslations } from "next-intl";

export default function CityCards() {
  const t = useTranslations("HomePage");

  return (
    <div>
      <h2 className="mt-20 text-center text-2xl font-bold text-custom-fontColor">
        {t("title")}
      </h2>
      <div className="mt-16 flex flex-wrap justify-center gap-5">
        {cityList.map((city) => (
          <CityCard key={city} city={city} />
        ))}
      </div>
    </div>
  );
}
