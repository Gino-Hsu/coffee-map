"use client";

import InfoIcon from "@mui/icons-material/Info";
import Link from "next/link";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import { enumCity } from "@/type/shopsType";
import { useTranslations } from "next-intl";

export default function CityCard({ city }: { city: enumCity }) {
  const t = useTranslations("HomePage");
  const city_t = useTranslations("City");

  return (
    <div className="flex flex-col items-center gap-3 rounded border border-custom-borderColor bg-white px-4 py-2 text-custom-fontColor transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
      <p className="text-lg font-bold">{city_t(`${city}`)}</p>
      <div className="flex gap-3">
        <Link
          className="flex cursor-pointer items-center gap-1 rounded border border-custom-borderColor px-2 py-1 transition-all duration-300 ease-in-out hover:border-white hover:bg-custom-bgColor-hover hover:text-white"
          href={`/${city}/information`}
        >
          <InfoIcon fontSize="small" />
          {t("cityCard.shopInfo")}
        </Link>
        <Link
          className="flex cursor-pointer items-center gap-1 rounded border border-custom-borderColor px-2 py-1 transition-all duration-300 ease-in-out hover:border-white hover:bg-custom-bgColor-hover hover:text-white"
          href={`/${city}/map`}
        >
          <FmdGoodIcon fontSize="small" />
          {t("cityCard.mapInfo")}
        </Link>
      </div>
    </div>
  );
}
