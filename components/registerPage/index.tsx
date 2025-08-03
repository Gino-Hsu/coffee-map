'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { FormControl, TextField, Button } from '@mui/material';
import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { createRegisterSchema } from '@/lib/formValidation';
import { registerAction } from '@/app/actions/user/register';
import AvatarSelector from '@/components/common/avatarSelector';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    avatar: 1,
  });
  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof typeRegisterForm, string>>
  >({});
  const [isPending, startTransition] = useTransition(); // 用於處理異步操作
  const t = useTranslations('RegisterPage');
  const registerSchema = createRegisterSchema(t);
  type typeRegisterForm = z.infer<typeof registerSchema>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeRegisterForm
  ) => {
    const cleanedValue = e.target.value.replace(/[\s\u3000]/g, '');
    setFormData({ ...formData, [field]: cleanedValue });
    setErrorMSGs({ ...errorMSGs, [field]: '' });
  };

  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formData);

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

    //送出註冊資料的api
    startTransition(async () => {
      const res = await registerAction({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (res.status !== 200) {
        setFormData({ ...formData, password: '', confirmPassword: '' }); // 清空表單密碼;
        setErrorMSGs({}); // 清除錯誤訊息
        console.log('註冊失敗:', res?.data?.message);
        return;
      }

      // 註冊成功後的處理
      console.log('註冊成功:', res?.data?.message);
    });
  };

  return (
    <form onSubmit={handleSubmitRegister}>
      <FormControl className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-3">
          <TextField
            id="email"
            label={t('emailLabel')}
            variant="outlined"
            value={formData.email}
            error={!!errorMSGs.email}
            helperText={errorMSGs.email}
            onChange={e => handleChange(e, 'email')}
            disabled={isPending}
          />
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
            id="password"
            label={t('passwordLabel')}
            type="password"
            variant="outlined"
            value={formData.password}
            error={!!errorMSGs.password}
            helperText={errorMSGs.password}
            onChange={e => handleChange(e, 'password')}
            disabled={isPending}
          />
          <TextField
            id="confirmPassword"
            label={t('confirmPasswordLabel')}
            type="password"
            variant="outlined"
            value={formData.confirmPassword}
            error={!!errorMSGs.confirmPassword}
            helperText={errorMSGs.confirmPassword}
            onChange={e => handleChange(e, 'confirmPassword')}
            disabled={isPending}
          />
          <AvatarSelector formData={formData} />
        </div>
        <div className="flex justify-end gap-1">
          <Link
            href={'/login'}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            {t('navigateLoginPage')}
          </Link>
        </div>
        <Button
          type="submit"
          size="medium"
          variant="contained"
          color="secondary"
          disabled={isPending}
        >
          {t('registerButton')}
        </Button>
      </FormControl>
    </form>
  );
}
