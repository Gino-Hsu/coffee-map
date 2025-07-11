'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LogoComponent() {
  const params = useParams();
  const [lang, setLang] = useState('zh');

  useEffect(() => {
    if (params.lang && typeof params.lang === 'string') {
      setLang(params.lang);
    }
  }, [params.lang]);

  return (
    <Link className="flex items-center gap-1" href={`/${lang}`}>
      <Image src="/logoImg.png" alt="logo image" width={40} height={40} />
      <span className="font-bold text-[#5a3d1b]">Coffee Map</span>
    </Link>
  );
}
