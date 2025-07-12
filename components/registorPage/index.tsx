'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { FormControl, TextField, Button } from '@mui/material';
import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { createRegisterSchema } from '@/lib/formValidation';

export default function RegisterPage() {
  const formDataRef = useRef<{
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  }>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof typeRegisterForm, string>>
  >({});
  const t = useTranslations('RegisterPage');
  const registerSchema = createRegisterSchema(t);
  type typeRegisterForm = z.infer<typeof registerSchema>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeRegisterForm
  ) => {
    formDataRef.current[field] = e.target.value;
    setErrorMSGs({ ...errorMSGs, [field]: '' });
  };

  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formDataRef.current);

    console.log('Register form data:', result?.error?.issues);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeRegisterForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof typeRegisterForm;
        fieldErrors[key] = issue.message;
      }

      console.log('Validation errors:', fieldErrors);
      setErrorMSGs(fieldErrors);
      return;
    }

    //TODO 送出註冊資料的api(server action)
  };

  const handleClickForgetPassword = () => {
    console.log('forget password clicked，準備開光箱');
  };

  return (
    <form onSubmit={handleSubmitRegister}>
      <FormControl className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-3">
          <TextField
            id="account"
            label={t('accountLabel')}
            variant="outlined"
            value={formDataRef.current.email}
            error={!!errorMSGs.email}
            helperText={errorMSGs.email}
            onChange={e => handleChange(e, 'email')}
          />
          <TextField
            id="name"
            label={t('nameLabel')}
            variant="outlined"
            value={formDataRef.current.name}
            error={!!errorMSGs.name}
            helperText={errorMSGs.name}
            onChange={e => handleChange(e, 'name')}
          />
          <TextField
            id="password"
            label={t('passwordLabel')}
            type="password"
            variant="outlined"
            value={formDataRef.current.password}
            error={!!errorMSGs.password}
            helperText={errorMSGs.password}
            onChange={e => handleChange(e, 'password')}
          />
          <TextField
            id="confirmPassword"
            label={t('confirmPasswordLabel')}
            type="password"
            variant="outlined"
            value={formDataRef.current.confirmPassword}
            error={!!errorMSGs.confirmPassword}
            helperText={errorMSGs.confirmPassword}
            onChange={e => handleChange(e, 'confirmPassword')}
          />
        </div>
        <div className="flex justify-end gap-1">
          <Link
            href={'/login'}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            {t('navigateLoginPage')}
          </Link>
          <p className="text-xs text-gray-500">/</p>
          <p
            onClick={handleClickForgetPassword}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            {t('forgetPassword')}
          </p>
        </div>
        <Button
          type="submit"
          size="small"
          variant="contained"
          color="secondary"
        >
          {t('registerButton')}
        </Button>
      </FormControl>
    </form>
  );
}
