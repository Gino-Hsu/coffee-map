import { getTranslations } from 'next-intl/server';
import LoginPage from '@/components/loginPage';

export default async function Login(params: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params.params;
  const t = await getTranslations('LoginPage');

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <h1 className="text-2xl font-bold pb-4 text-[#5a3d1b]">{t('title')}</h1>
      <LoginPage lang={lang} />
    </div>
  );
}
