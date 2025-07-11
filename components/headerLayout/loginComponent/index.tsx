'use client';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginComponent() {
  const params = useParams();
  const lang = params.lang || 'zh';
  const t = useTranslations('HeaderLayout');

  return (
    <Link className="cursor-pointer" href={`/${lang}/login`}>
      {t('login')}
    </Link>
  );
}
