'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { FormControl, TextField, Button } from '@mui/material';
import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { createResetPasswordMailSchema } from '@/lib/formValidation';
import { resetPasswordMailAction } from '@/app/actions/user/resetPasswordMail';
import { useRouter } from 'next/navigation';
import ModalMessage from '@/components/common/modalMessage';

export default function ResetPasswordMailPage({ lang }: { lang: string }) {
  console.log('lang for resetPasswordMailAction', lang);
  const formDataRef = useRef({ password: '', confirmPassword: '' });
  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof typeResetPasswordMailForm, string>>
  >({});
  const [modalMessageOpen, setModalMessageOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isPending, startTransition] = useTransition(); // 用於處理異步操作
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const t = useTranslations('ResetPasswordMailPage');
  const resetPasswordMailSchema = createResetPasswordMailSchema(t);
  type typeResetPasswordMailForm = z.infer<typeof resetPasswordMailSchema>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeResetPasswordMailForm
  ) => {
    const cleanedValue = e.target.value.replace(/[\s\u3000]/g, '');
    formDataRef.current[field] = cleanedValue;
    setErrorMSGs({ ...errorMSGs, [field]: '' });
  };

  const handleSubmitResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      // 網址沒有 token 導回首頁
      router.replace(`/${lang}`);
      return;
    }

    const result = resetPasswordMailSchema.safeParse(formDataRef.current);

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof typeResetPasswordMailForm, string>
      > = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof typeResetPasswordMailForm;
        fieldErrors[key] = issue.message;
      }
      setErrorMSGs(fieldErrors);
      return;
    }

    startTransition(async () => {
      const res = await resetPasswordMailAction({
        token,
        newPassword: formDataRef.current.password,
      });

      if (res.status !== 200) {
        formDataRef.current = {
          password: '',
          confirmPassword: '',
        }; // 清空表單資料
        setErrorMSGs({}); // 清除錯誤訊息
        setModalMessage(res?.data?.message ? res?.data?.message : '');
        setModalMessageOpen(true);
        setTimeout(() => {
          setModalMessageOpen(false);
          router.replace(`/${lang}`);
        }, 5000);
      } else {
        setModalMessage(res?.data?.message ? res?.data?.message : '');
        setModalMessageOpen(true);
        setTimeout(() => {
          setModalMessageOpen(false);
          router.replace(`/${lang}/login`);
        }, 5000);
      }
    });

    console.log('重設密碼');
  };

  useEffect(() => {
    if (!token) {
      // 網址沒 token 沒帶導回首頁
      router.replace(`/${lang}`);
      return;
    }
  }, [token, lang, router]);

  return (
    <>
      <form className="min-w-[300px]" onSubmit={handleSubmitResetPassword}>
        <FormControl className="flex flex-col gap-y-3" fullWidth={true}>
          <div className="flex flex-col gap-y-3">
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
            <TextField
              id="confirmPassword"
              label={t('confirmPasswordLabel')}
              type="password"
              variant="outlined"
              value={formDataRef.current.confirmPassword}
              error={!!errorMSGs.confirmPassword}
              helperText={errorMSGs.confirmPassword}
              onChange={e => handleChange(e, 'confirmPassword')}
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
            {t('resetPasswordButton')}
          </Button>
        </FormControl>
      </form>
      {/* modal here */}
      {/* 錯誤訊息 Modal */}
      <ModalMessage
        open={modalMessageOpen}
        message={`❗️ ${modalMessage}`}
        onClose={() => setModalMessageOpen(false)}
      />
    </>
  );
}
