'use client';

import { useContext } from 'react';
import { useParams } from 'next/navigation';
import { UserContext } from '@/lib/context/userContext';
import { coffeeShop } from './index';
import { useTranslations } from 'next-intl';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { updateFavoriteAction } from '@/app/actions/user/updateFavorite';

export default function PopupContent({
  shop,
  isFavorite,
}: {
  shop: coffeeShop;
  isFavorite: boolean;
}) {
  const params = useParams();
  const lang = params.lang || 'zh';
  const t = useTranslations('CoffeeMap');
  const { user, setUser } = useContext(UserContext);

  const handleToggleFavorite = async (shopId: string) => {
    if (!user) return;

    // 1. 先計算新的 favoriteList（樂觀更新）
    const isCurrentlyFavorite = user.favoriteList.includes(shopId);
    const updatedFavorites = isCurrentlyFavorite
      ? user.favoriteList.filter(id => id !== shopId) // 移除
      : [...user.favoriteList, shopId]; // 新增

    // 2. 先更新 UI
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      return { ...prevUser, favoriteList: updatedFavorites };
    });

    // 3. 呼叫 API
    const resToggleFavorites = await updateFavoriteAction(
      lang as string,
      shopId
    );

    if (resToggleFavorites.status !== 200) {
      console.error('更新失敗，回滾 UI');
      // 4. 回滾 UI（恢復原本狀態）
      setUser(prevUser => {
        if (!prevUser) return prevUser;
        return { ...prevUser, favoriteList: user.favoriteList };
      });
    }
  };

  return (
    <div>
      <div className="max-w-fit" onClick={() => handleToggleFavorite(shop.id)}>
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
