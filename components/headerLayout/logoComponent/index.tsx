'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LogoComponent({
  isHeaderFixed,
  isLangHome,
}: {
  isHeaderFixed: boolean;
  isLangHome: boolean;
}) {
  const params = useParams();
  const [lang, setLang] = useState('zh');

  useEffect(() => {
    if (params.lang && typeof params.lang === 'string') {
      setLang(params.lang);
    }
  }, [params.lang]);

  return (
    <Link className="flex items-center gap-1" href={`/${lang}`}>
      <Image
        src="/logoImg.png"
        alt="logo image"
        width={!isLangHome ? 110 : isHeaderFixed ? 110 : 300}
        height={!isLangHome ? 56 : isHeaderFixed ? 56 : 150}
        style={{ height: 'auto' }}
        className="transition-all duration-300 ease-in-out"
        priority
      />
    </Link>
  );
}
