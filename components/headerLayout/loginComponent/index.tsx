'use client';
import { useContext } from 'react';
import { UserContext } from '@/lib/context/userContext';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/user/logout';

export default function LoginComponent() {
  const params = useParams();
  const lang = params.lang || 'zh';
  const t = useTranslations('HeaderLayout');
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
  };

  return (
    <>
      {!!user ? (
        <div className="cursor-pointer" onClick={handleLogout}>
          {t('logout')}
        </div>
      ) : (
        <Link className="cursor-pointer" href={`/${lang}/login`}>
          {t('login')}
        </Link>
      )}
    </>
  );
}
