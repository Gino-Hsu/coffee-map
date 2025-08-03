'use client';
import { useState, useRef, useTransition } from 'react';
import { useContext } from 'react';
import { UserContext } from '@/lib/context/userContext';
import { FormControl, TextField, Button } from '@mui/material';
import ModalMessage from '../common/modalMessage';
import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createUpdateInfoSchema } from '@/lib/formValidation';
import { updateUserAction } from '@/app/actions/user/updateUser';
import AvatarSelector from '@/components/common/avatarSelector';
import { enumAvatarImg } from '@/type/memberType';

export default function UpdateInfo({ lang }: { lang: string }) {
  const t = useTranslations('UpdateUser');
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const email = user?.email ?? '';
  console.log('current user: ', user);

  const [formData, setFormData] = useState({
    name: '',
    avatar: 1,
  });
  const [modalMessageOpen, setModalMessageOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isPending, startTransition] = useTransition(); // 用於處理異步操作

  const updateInfoSchema = createUpdateInfoSchema(t);
  type typeLoginForm = z.infer<typeof updateInfoSchema>;

  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof typeLoginForm, string>>
  >({});

  const modalType = useRef('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: 'name' | 'avatar'
  ) => {
    const cleanedValue = e.target.value.replace(/[\s\u3000]/g, '');
    setFormData(prev => ({
      ...prev,
      [field]: cleanedValue,
    }));
    setErrorMSGs({ ...errorMSGs, [field]: '' });
  };

  const handleAvatarChange = (id: enumAvatarImg) => {
    console.log('run handleAvatarChange, id :', id);
    setFormData(prev => ({
      ...prev,
      avatar: id,
    }));
  };

  const handleSubmitUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('current formData: ', formData);

    const result = updateInfoSchema.safeParse(formData);
    console.log('UpdateUser form data:', result);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeLoginForm, string>> = {};
      for (const issue of result.error.issues) {
        console.log('issue in result: ', issue);
        const key = issue.path[0] as keyof typeLoginForm;
        fieldErrors[key] = issue.message;
      }

      console.log('Validation errors:', fieldErrors);
      setErrorMSGs(fieldErrors);
      return;
    }

    // 把新的info寫進資料庫裡
    startTransition(async () => {
      const { name, avatar } = formData;
      const res = await updateUserAction({ email, name, avatar, locale: 'zh' });

      // 失敗處理
      if (res.status !== 200) {
        setModalMessage(`❗️ ${t('errorMSG.updateFailed')}`);
        setModalMessageOpen(true);
        modalType.current = 'error';

        // 關閉提示光箱時才導回首頁
        // router.replace(`/${lang}`);
      } else {
        // 成功的話才去setUser
        setUser(prev => {
          if (!prev) return prev;
          return { ...prev, name, avatar };
        });
        setModalMessage(`${t('updateSuccess')}`);
        setModalMessageOpen(true);
        modalType.current = 'success';
      }

      setErrorMSGs({});
    });
  };

  const handleModalClose = (type: string) => {
    modalType.current = '';
    setModalMessageOpen(false);

    if (type === 'error') {
      router.replace(`/${lang}`);
    }
  };

  //TODO: 一進頁面確認登入狀態
  //TODO: 有登入就帶入預設暱稱

  return (
    <>
      <form onSubmit={handleSubmitUpdateInfo}>
        <FormControl className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-3">
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
            <AvatarSelector
              handleChange={handleAvatarChange}
              selectedAvatar={formData.avatar}
            />
          </div>
          <Button
            type="submit"
            size="medium"
            variant="contained"
            color="secondary"
            disabled={isPending}
          >
            {t('updateInfoButton')}
          </Button>
        </FormControl>
      </form>
      {/* Modal here */}
      {/* 成功訊息 Modal */}
      <ModalMessage
        open={modalMessageOpen}
        message={modalMessage}
        onClose={() => handleModalClose(modalType.current)}
      />
      {/* 錯誤訊息 Modal */}
      {/* <ModalMessage
        open={modalMessageOpen}
        message={modalMessage}
        onClose={() => setModalMessageOpen(false)}
      /> */}
    </>
  );
}
