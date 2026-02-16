import MemberCenterPage from '@/components/memberCenterPage';
import { getTranslations } from 'next-intl/server';

export default async function MemberCenter(params: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params.params;
  const t = await getTranslations('MemberCenterPage');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#f8f6ed]">
      <h1 className="text-2xl font-bold pb-4 text-[#1285c5]">{t('title')}</h1>
      <MemberCenterPage lang={lang} />
    </div>
  );
}
