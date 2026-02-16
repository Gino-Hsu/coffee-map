import CityCard from './cityCard';
import { cityList } from '@/lib/map/city';
import { useTranslations } from 'next-intl';

export default function CityCards() {
  const t = useTranslations('HomePage');

  return (
    <div>
      <h2 className="mt-20 text-center text-custom-fontColor text-2xl font-bold">
        {t('title')}
      </h2>
      <div className="mt-16 flex justify-center gap-5 flex-wrap">
        {cityList.map(city => (
          <CityCard key={city} city={city} />
        ))}
      </div>
    </div>
  );
}
