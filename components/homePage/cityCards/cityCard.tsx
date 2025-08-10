'use client';

import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { enumCity } from '@/type/shopsType';
import { useTranslations } from 'next-intl';

export default function CityCard({ city }: { city: enumCity }) {
  const t = useTranslations('HomePage');
  const city_t = useTranslations('City');

  return (
    <div className="py-2 px-4 flex flex-col items-center gap-3 border rounded border-custom-borderColor bg-white text-custom-fontColor transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
      <p className="text-lg font-bold">{city_t(`${city}`)}</p>
      <div className="flex gap-3">
        <span className="py-1 px-2 flex items-center gap-1 cursor-pointer border rounded border-custom-borderColor transition-all duration-300 ease-in-out hover:bg-custom-bgColor-hover hover:border-white hover:text-white">
          <InfoIcon fontSize="small" />
          {t('cityCard.shopInfo')}
        </span>
        <Link
          className="py-1 px-2 flex items-center gap-1 cursor-pointer border rounded border-custom-borderColor transition-all duration-300 ease-in-out hover:bg-custom-bgColor-hover hover:border-white hover:text-white"
          href={`/${city}/map`}
        >
          <FmdGoodIcon fontSize="small" />
          {t('cityCard.mapInfo')}
        </Link>
      </div>
    </div>
  );
}
