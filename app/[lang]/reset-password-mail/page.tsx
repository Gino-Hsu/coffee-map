import { getTranslations } from 'next-intl/server';
import ResetPasswordMailPage from '@/components/resetPasswordMailPage';

export default async function ResetPasswordMail(params: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params.params;
  const t = await getTranslations('ResetPasswordMailPage');

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <h1 className="text-2xl font-bold pb-4 text-[#5a3d1b]">{t('title')}</h1>
      <ResetPasswordMailPage lang={lang} />
    </div>
  );
}
