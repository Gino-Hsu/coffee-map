'use client';
import { useState, useTransition, useContext } from 'react';
import Link from 'next/link';
import { FormControl, TextField, Button } from '@mui/material';
import ModalMessage from '../common/modalMessage';
import ModalForgotPassword from './modalForgotPassword';
import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { createLoginSchema } from '@/lib/formValidation';
import { loginAction } from '@/app/actions/user/login';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/lib/context/userContext';

export default function LoginPage({ lang }: { lang: string }) {
  const { setIsLoginSession } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof typeLoginForm, string>>
  >({});
  const [modalMessageOpen, setModalMessageOpen] = useState(false);
  const [modalForgotPasswordOpen, setModalForgotPasswordOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isPending, startTransition] = useTransition(); // 用於處理異步操作
  const router = useRouter();

  const t = useTranslations('LoginPage');
  const loginSchema = createLoginSchema(t);
  type typeLoginForm = z.infer<typeof loginSchema>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeLoginForm
  ) => {
    const cleanedValue = e.target.value.replace(/[\s\u3000]/g, '');
    setFormData({ ...formData, [field]: cleanedValue });
    setErrorMSGs({ ...errorMSGs, [field]: '' });
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);

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
        email: formData.email,
        password: formData.password,
        locale: lang,
      });

      if (res.status !== 200) {
        setFormData({
          ...formData,
          password: '',
        }); // 清空表單密碼
        setErrorMSGs({}); // 清除錯誤訊息
        setModalMessage(res?.data?.message ? res?.data?.message : '');
        setModalMessageOpen(true);
        return;
      } else {
        // 登入成功後的處理
        if (setIsLoginSession) setIsLoginSession(true);
        router.replace(`/${lang}`);
      }
    });
  };

  const handleClickForgetPassword = () => {
    setModalForgotPasswordOpen(true);
  };

  return (
    <>
      <form className="min-w-[300px]" onSubmit={handleSubmitLogin}>
        <FormControl className="flex flex-col gap-y-3" fullWidth={true}>
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
      {/* Modal here */}
      {/* 錯誤訊息 Modal */}
      <ModalMessage
        open={modalMessageOpen}
        message={`❗️ ${modalMessage}`}
        onClose={() => setModalMessageOpen(false)}
      />
      {/* 忘記密碼 Modal */}
      <ModalForgotPassword
        open={modalForgotPasswordOpen}
        onClose={() => setModalForgotPasswordOpen(false)}
        lang={lang}
      />
    </>
  );
}
