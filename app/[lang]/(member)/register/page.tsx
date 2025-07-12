import RegisterPage from '@/components/registorPage';
import { getTranslations } from 'next-intl/server';

export default async function Register() {
  const t = await getTranslations('RegisterPage');

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <h1 className="text-2xl font-bold pb-4 text-[#5a3d1b]">{t('title')}</h1>
      <RegisterPage />
    </div>
  );
}
