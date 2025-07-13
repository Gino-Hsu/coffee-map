'use client';
import { useRef, useState, useTransition } from 'react';
import { useUserContext } from '@/lib/context/userContext';
import Link from 'next/link';
import { FormControl, TextField, Button } from '@mui/material';
import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { createLoginSchema } from '@/lib/formValidation';
import { loginAction } from '@/app/actions/user/login';
import { getUserAction } from '@/app/actions/user/getUser';
import { useRouter } from 'next/navigation';
export default function LoginPage({ lang }: { lang: string }) {
  const formDataRef = useRef<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof typeLoginForm, string>>
  >({});
  const [isPending, startTransition] = useTransition(); // 用於處理異步操作
  const { setUser } = useUserContext();

  const t = useTranslations('LoginPage');
  const loginSchema = createLoginSchema(t);
  type typeLoginForm = z.infer<typeof loginSchema>;
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeLoginForm
  ) => {
    const cleanedValue = e.target.value.replace(/[\s\u3000]/g, '');
    formDataRef.current[field] = cleanedValue;
    setErrorMSGs({ ...errorMSGs, [field]: '' });
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formDataRef.current);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeLoginForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof typeLoginForm;
        fieldErrors[key] = issue.message;
      }
      setErrorMSGs(fieldErrors);
      return;
    }

    // 送出登入資料的api(server action)
    startTransition(async () => {
      const res = await loginAction({
        email: formDataRef.current.email,
        password: formDataRef.current.password,
        locale: lang,
      });

      if (res.status !== 200) {
        formDataRef.current = {
          email: formDataRef.current.email,
          password: '',
        }; // 清空表單密碼
        setErrorMSGs({}); // 清除錯誤訊息
        console.log('登入失敗:', res?.data?.message);
        return;
      } else {
        // 登入成功後的處理
        if (res?.data?.isLogin) {
          const userRes = await getUserAction(lang);
          const userData = userRes.data.resData;
          if (userData) setUser(userRes.data.resData);
          router.replace(`/${lang}`);
        }
      }
    });
  };

  const handleClickForgetPassword = () => {
    console.log('forget password clicked，準備開光箱');
  };

  return (
    <form onSubmit={handleSubmitLogin}>
      <FormControl className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-3">
          <TextField
            id="email"
            label={t('emailLabel')}
            variant="outlined"
            value={formDataRef.current.email}
            error={!!errorMSGs.email}
            helperText={errorMSGs.email}
            onChange={e => handleChange(e, 'email')}
            disabled={isPending}
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
            disabled={isPending}
          />
        </div>
        <div className="flex justify-end gap-1">
          <Link
            href={'/register'}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            {t('navigateRegisterPage')}
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
          disabled={isPending}
        >
          {t('loginButton')}
        </Button>
      </FormControl>
    </form>
  );
}
