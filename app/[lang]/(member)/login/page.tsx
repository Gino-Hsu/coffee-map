import { useTranslations } from 'next-intl';
import LoginPage from '@/components/loginPage';

export default function Login() {
  const t = useTranslations('LoginPage');

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <h1 className="text-2xl font-bold pb-4 text-[#5a3d1b]">{t('title')}</h1>
      <LoginPage />
    </div>
  );
}
