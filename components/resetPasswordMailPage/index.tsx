'use client';

import { FormControl, TextField, Button } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function ResetPasswordMailPage({ lang }: { lang: string }) {
  console.log('lang for resetPasswordMailAction', lang);
  const t = useTranslations('ResetPasswordMailPage');

  const handleSubmitResetPassword = () => {
    console.log('重設密碼');
  };

  return (
    <form className="min-w-[300px]" onSubmit={handleSubmitResetPassword}>
      <FormControl className="flex flex-col gap-y-3" fullWidth={true}>
        <div className="flex flex-col gap-y-3">
          <TextField
            id="password"
            label={t('passwordLabel')}
            type="password"
            variant="outlined"
            // value={formDataRef.current.password}
            // error={!!errorMSGs.password}
            // helperText={errorMSGs.password}
            // onChange={e => handleChange(e, 'password')}
            // disabled={isPending}
          />
          <TextField
            id="confirmPassword"
            label={t('confirmPasswordLabel')}
            type="password"
            variant="outlined"
            // value={formDataRef.current.confirmPassword}
            // error={!!errorMSGs.confirmPassword}
            // helperText={errorMSGs.confirmPassword}
            // onChange={e => handleChange(e, 'confirmPassword')}
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
          {t('resetPasswordButton')}
        </Button>
      </FormControl>
    </form>
  );
}
