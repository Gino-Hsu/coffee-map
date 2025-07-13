import { coffeeShop } from './index';
import { useTranslations } from 'next-intl';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function PopupContent({
  shop,
  isFavorite,
}: {
  shop: coffeeShop;
  isFavorite: boolean;
}) {
  const t = useTranslations('CoffeeMap');

  return (
    <div>
      <div>
        {isFavorite ? (
          <FavoriteIcon color={'error'} className="cursor-pointer" />
        ) : (
          <FavoriteBorderIcon color={'error'} className="cursor-pointer" />
        )}
      </div>
      <div className="mt-1">
        <strong>
          <span>{t('popupInfo.storeName')}：</span>
          {shop.name}
        </strong>
        <br />
        <span>{t('popupInfo.address')}：</span>
        {shop.address}
      </div>
    </div>
  );
}
