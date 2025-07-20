'use client';

import { useState, useRef, useTransition } from 'react';
import { FormControl, TextField, Button } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { createForgotPasswordSchema } from '@/lib/formValidation';
import { forgotPasswordAction } from '@/app/actions/user/forgotPassword';
import { useRouter } from 'next/navigation';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: 'center',
};

export default function ModalForgotPassword({
  open,
  onClose,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  lang: string;
}) {
  const formDataRef = useRef<{ email: string }>({ email: '' });
  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof forgotPassWordForm, string>>
  >({});
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('LoginPage.forgotPasswordModal');
  const forgotPasswordSchema = createForgotPasswordSchema(t);
  type forgotPassWordForm = z.infer<typeof forgotPasswordSchema>;
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof forgotPassWordForm
  ) => {
    const cleanedValue = e.target.value.replace(/[\s\u3000]/g, '');
    formDataRef.current[field] = cleanedValue;
    setErrorMSGs({ ...errorMSGs, [field]: '' });
  };

  const handleSubmitForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse(formDataRef.current);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof forgotPassWordForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof forgotPassWordForm;
        fieldErrors[key] = issue.message;
      }
      setErrorMSGs(fieldErrors);
      return;
    }
    console.log('result', result);

    startTransition(async () => {
      const res = await forgotPasswordAction({
        email: formDataRef.current.email,
      });

      if (res.status !== 200) {
        formDataRef.current = {
          email: formDataRef.current.email,
        };
        setErrorMSGs({}); // 清除錯誤訊息
        console.log('登入失敗:', res?.data?.message);
        // setModalMessage(res?.data?.message ? res?.data?.message : '');
        // setModalErrorMessageOpen(true);
        return;
      } else {
        // 登入成功後的處理
        router.replace(`/${lang}`);
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      slots={{ backdrop: Backdrop }}
    >
      <Box sx={style}>
        <h1 className="text-2xl font-bold pb-4 text-[#5a3d1b]">忘記密碼</h1>
        <form onSubmit={handleSubmitForgotPassword}>
          <FormControl className="flex flex-col gap-y-3">
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
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="secondary"
              disabled={isPending}
            >
              {'registerButton'}
            </Button>
          </FormControl>
        </form>
      </Box>
    </Modal>
  );
}
