'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

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
        width={!isLangHome ? 40 : isHeaderFixed ? 40 : 80}
        height={40}
        className="transition-all duration-300 ease-in-out"
      />
      <span
        className={clsx(
          'font-bold text-[#0178a8;] transition-all duration-300 ease-in-out',
          !isLangHome ? 'text-base' : isHeaderFixed ? 'text-base' : 'text-xl'
        )}
      >
        Coffee Map
      </span>
    </Link>
  );
}
