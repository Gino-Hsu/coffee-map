'use client';
import { useState, useContext, useEffect, useTransition } from 'react';
import { UserContext } from '@/lib/context/userContext';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions/user/logout';
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Button,
} from '@mui/material';
import { z } from 'zod/v4';
import { createShopSchema } from '@/lib/formValidation';
import { useTranslations } from 'next-intl';
import { enumCity } from '@/type/shopsType';
import { createShopAction } from '@/app/actions/shop/createShop';

export default function CreateShopPage({ lang }: { lang: string }) {
  const { user, isGetUserLoading, setIsLoginSession } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: enumCity.TAIPEI,
  });
  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof typeCreateShopForm, string>>
  >({});
  const [isPending, startTransition] = useTransition(); // 用於處理異步操作
  const router = useRouter();
  const t = useTranslations('CreateShopPage');
  const shopSchema = createShopSchema(t);
  type typeCreateShopForm = z.infer<typeof shopSchema>;

  useEffect(() => {
    const handleLogout = async () => {
      if (!isGetUserLoading && !user) {
        await logoutAction();
        if (setIsLoginSession) setIsLoginSession(false);
        router.replace(`/${lang}`);
      }
    };
    handleLogout();
  }, [user, setIsLoginSession, isGetUserLoading, router, lang]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
    field: keyof typeCreateShopForm
  ) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: e.target.value.trim(),
    }));
    setErrorMSGs({ ...errorMSGs, [field]: '' });
  };

  const handleSubmitCreateShop = (e: React.FormEvent) => {
    e.preventDefault();
    const result = shopSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeCreateShopForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof typeCreateShopForm;
        fieldErrors[key] = issue.message;
      }
      setErrorMSGs(fieldErrors);
      return;
    }

    // 送出表單 api
    startTransition(async () => {
      const res = await createShopAction({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        locale: lang,
      });

      console.log('formRes', res);
    });
  };

  return (
    <form className="min-w-[300px]" onSubmit={handleSubmitCreateShop}>
      <FormControl className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-3">
          <InputLabel id="city">{t('cityLabel')}</InputLabel>
          <Select
            id="city"
            name="city"
            label={t('cityLabel')}
            value={formData.city}
            error={!!errorMSGs.city}
            onChange={e => handleChange(e, 'city')}
            disabled={isPending}
          >
            <MenuItem value={'taipei'}>{t('cityMenu.taipei')}</MenuItem>
          </Select>
          <TextField
            id="name"
            label={t('nameLabel')}
            variant="outlined"
            value={formData.name}
            error={!!errorMSGs.name}
            helperText={errorMSGs.name}
            onChange={e => handleChange(e, 'name')}
            disabled={isPending}
          />
          <TextField
            id="address"
            label={t('addressLabel')}
            variant="outlined"
            value={formData.address}
            error={!!errorMSGs.address}
            helperText={errorMSGs.address}
            onChange={e => handleChange(e, 'address')}
            disabled={isPending}
          />
        </div>
        <Button
          type="submit"
          size="small"
          variant="contained"
          color="secondary"
          disabled={isPending}
        >
          {t('submitButton')}
        </Button>
      </FormControl>
    </form>
  );
}
