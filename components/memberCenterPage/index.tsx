import { getTranslations } from 'next-intl/server';
import UpdateInfo from './updateInfo';

export default async function MemberCenterPage({ lang }: { lang: string }) {
  const t = await getTranslations('MemberCenterPage');

  return (
    <>
      <div className="flex gap-x-4 p-2">
        <div className="flex flex-col min-h-screen p-2 border-r-2 mr-2">
          <p className="text-xl font-bold pb-4 text-[#5a3d1b]">
            {t('updateUser')}
          </p>
        </div>
        <div>
          <UpdateInfo lang={lang} />
        </div>
      </div>
    </>
  );
}
