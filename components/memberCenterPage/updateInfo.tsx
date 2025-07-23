'use client';
import { useRef, useState, useTransition } from 'react';
import { useContext } from 'react';
import { UserContext } from '@/lib/context/userContext';
import { FormControl, TextField, Button } from '@mui/material';
import { z } from 'zod/v4';
import { useTranslations } from 'next-intl';
import { createUpdateInfoSchema } from '@/lib/formValidation';
import { getUserAction } from '@/app/actions/user/getUser';
import { updateInfoAction } from '@/app/actions/user/updateInfo';
import AvatarSelector from '@/components/common/avatarSelector';

export default function UpdateInfo() {
  const t = useTranslations('UpdateInfo');
  const { user, setUser } = useContext(UserContext);
  const { email } = user;
  console.log('current user: ', user);

  const formDataRef = useRef<{
    name: string;
    avatar: number;
  }>({
    name: '',
    avatar: 1,
  });
  const [errorMSGs, setErrorMSGs] = useState<
    Partial<Record<keyof typeLoginForm, string>>
  >({});
  const [isPending, startTransition] = useTransition(); // 用於處理異步操作

  const updateInfoSchema = createUpdateInfoSchema(t);
  type typeLoginForm = z.infer<typeof updateInfoSchema>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeLoginForm
  ) => {
    const cleanedValue = e.target.value.replace(/[\s\u3000]/g, '');
    formDataRef.current[field] = cleanedValue;
    setErrorMSGs({ ...errorMSGs, [field]: '' });
  };

  const handleSubmitUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = updateInfoSchema.safeParse(formDataRef.current);
    console.log('UpdateInfo form data:', result?.error?.issues);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeLoginForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof typeLoginForm;
        fieldErrors[key] = issue.message;
      }

      console.log('Validation errors:', fieldErrors);
      setErrorMSGs(fieldErrors);
      return;
    }

    // 把新的info寫進資料庫裡
    startTransition(async () => {
      //使用getUser驗證當前token
      const currentUser = await getUserAction('zh');
      console.log('user in updateInfo: ', currentUser);
      if (!currentUser) {
        //TODO: 登出
      }

      //成功的話繼續打 updateInfoAction
      const { name, avatar } = formDataRef.current;
      const res = await updateInfoAction({ email, name, avatar, locale: 'zh' });

      // 失敗處理
      if (res.status !== 200) {
        setErrorMSGs(prev => ({
          ...prev,
          name: res?.data.message || t('updateFailed'), // 顯示錯誤訊息
        }));
        return;
      }
      // 成功的話才去setUser
      setUser(prev => ({
        ...prev,
        name,
        avatar,
      }));
    });
  };

  return (
    <>
      <form onSubmit={handleSubmitUpdateInfo}>
        <FormControl className="flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-3">
            <TextField
              id="name"
              label={'nameLabel'}
              variant="outlined"
              value={formDataRef.current.name}
              error={!!errorMSGs.name}
              // error={false}
              helperText={errorMSGs.name}
              onChange={e => handleChange(e, 'name')}
              disabled={isPending}
            />
            <AvatarSelector formData={formDataRef.current} />
          </div>
          <Button
            type="submit"
            size="medium"
            variant="contained"
            color="secondary"
            // disabled={isPending}
          >
            {'updateInfoButton'}
          </Button>
        </FormControl>
      </form>
    </>
  );
}
