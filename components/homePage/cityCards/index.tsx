import CityCard from './cityCard';
import { cityList } from '@/lib/map/city';

export default function CityCards() {
  return (
    <div>
      <h2 className="mt-20 text-center text-custom-fontColor text-2xl font-bold">
        選擇城市，找個咖啡廳
      </h2>
      <div className="mt-16 flex justify-center gap-5 flex-wrap">
        {cityList.map(city => (
          <CityCard key={city} city={city} />
        ))}
      </div>
    </div>
  );
}
