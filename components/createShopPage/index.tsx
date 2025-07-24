'use client';
import { useRef, useContext, useEffect } from 'react';
import { UserContext } from '@/lib/context/userContext';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions/user/logout';
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useTranslations } from 'next-intl';

export default function CreateShopPage({ lang }: { lang: string }) {
  const formDataRef = useRef({
    name: '',
    address: '',
    city: '',
  });
  const { user, isGetUserLoading } = useContext(UserContext);
  const router = useRouter();
  const t = useTranslations('CreateShopPage');

  useEffect(() => {
    if (!isGetUserLoading && !user) {
      logoutAction();
      router.replace(`/${lang}`);
    }
  }, [user, isGetUserLoading, router, lang]);

  return (
    <form>
      <FormControl className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-3">
          <InputLabel id="city">{t('cityLabel')}</InputLabel>
          <Select
            id="city"
            name="city"
            label={t('cityLabel')}
            value={formDataRef.current.city}
            // onChange={handleLangChange}
          >
            <MenuItem value={'taipei'}>{t('cityMenu.taipei')}</MenuItem>
          </Select>
          <TextField
            id="name"
            label={t('nameLabel')}
            variant="outlined"
            value={formDataRef.current.name}
            // error={!!errorMSGs.name}
            // helperText={errorMSGs.name}
            // onChange={e => handleChange(e, 'name')}
            // disabled={isPending}
          />
          <TextField
            id="address"
            label={t('addressLabel')}
            variant="outlined"
            value={formDataRef.current.address}
            // error={!!errorMSGs.name}
            // helperText={errorMSGs.name}
            // onChange={e => handleChange(e, 'name')}
            // disabled={isPending}
          />
        </div>
        <Button
          type="submit"
          size="small"
          variant="contained"
          color="secondary"
          // disabled={isPending}
        >
          {t('registerButton')}
        </Button>
      </FormControl>
    </form>
  );
}
