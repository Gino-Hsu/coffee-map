import MemberCenterPage from '@/components/memberCenterPage';
import { getTranslations } from 'next-intl/server';

export default async function MemberCenter(params: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params.params;
  const t = await getTranslations('MemberCenterPage');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold pb-4 text-[#5a3d1b]">{t('title')}</h1>
      <MemberCenterPage lang={lang} />
    </div>
  );
}
