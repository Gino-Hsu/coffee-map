'use client';
import { useRef, useState, useTransition } from 'react';
import { FormControl, TextField, Button } from '@mui/material';
import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { createLoginSchema } from '@/lib/formValidation';
import { loginAction } from '@/app/actions/login';

export default function LoginPage({ lang }: { lang: string }) {
  const formDataRef = useRef<{ account: string; password: string }>({
    account: '',
    password: '',
  });
  const [isPending, startTransition] = useTransition(); // 用於處理異步操作
  const t = useTranslations('LoginPage');
  const LoginSchema = createLoginSchema(t);
  type LoginForm = z.infer<typeof LoginSchema>;

  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});

  const handleChange =
    (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      formDataRef.current[field] = e.target.value;
      setErrorMSGs({ ...errorMSGs, [field]: '' });
    };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = LoginSchema.safeParse(formDataRef.current);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LoginForm;
        fieldErrors[key] = issue.message;
      }
      setErrorMSGs(fieldErrors);
      return;
    }

    //TODO:送出登入資料的api
    startTransition(async () => {
      const res = await loginAction({
        account: formDataRef.current.account,
        password: formDataRef.current.password,
        locale: lang,
      });

      if (res.status !== 200) {
        formDataRef.current = {
          account: formDataRef.current.account,
          password: '',
        }; // 清空表單
        setErrorMSGs({}); // 清除錯誤訊息
        console.log('登入失敗:', res?.data?.message);
        return;
      } else {
        // 登入成功後的處理
        console.log('登入成功:', res?.data?.message);
      }
    });
  };

  const forgetPassword = () => {
    console.log('forget password clicked，準備開光箱');
  };

  return (
    <form onSubmit={handleSubmitLogin}>
      <FormControl className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-3">
          <TextField
            id="account"
            label={t('accountLabel')}
            variant="outlined"
            value={formDataRef.current.account}
            error={!!errorMSGs.account}
            helperText={errorMSGs.account}
            onChange={handleChange('account')}
          />
          <TextField
            id="password"
            label={t('passwordLabel')}
            type="password"
            variant="outlined"
            value={formDataRef.current.password}
            error={!!errorMSGs.password}
            helperText={errorMSGs.password}
            onChange={handleChange('password')}
          />
        </div>
        <div className="flex justify-end">
          <p
            onClick={() => forgetPassword()}
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
