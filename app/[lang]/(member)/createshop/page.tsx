import { getTranslations } from 'next-intl/server';
import CreateShopPage from '@/components/createShopPage';

export default async function CreateShop(params: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params.params;
  const t = await getTranslations('CreateShopPage');

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <h1 className="text-2xl font-bold pb-4 text-[#5a3d1b]">{t('title')}</h1>
      <CreateShopPage lang={lang} />
    </div>
  );
}
