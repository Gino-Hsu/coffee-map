'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import clsx from 'clsx';

export default function MainVisual() {
  const totalImages = 3;
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations('MainVisual');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % totalImages);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] flex border-b border-custom-borderColor overflow-hidden">
      <div className="flex-1 border-r border-custom-borderColor">
        <h1 className="relative top-60 ml-10 font-bold text-xl text-custom-fontColor">
          {t('title_1')}
          <br />
          {t('title_2')}
        </h1>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {[...Array(totalImages)].map((_, index) => (
          <div
            key={index}
            className={clsx(
              'absolute left-1/2 top-0 h-full w-[110%] transition-all duration-1000 ease-in-out',
              'animate-subtle-move',
              {
                'opacity-100 z-10 scale-100': index === activeIndex,
                'opacity-0 z-0 scale-105': index !== activeIndex,
              }
            )}
          >
            <Image
              src={`/mainVisual/coffee${index + 1}.jpg`}
              alt={`main visual ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0} // 避免首次閃爍
            />
          </div>
        ))}
      </div>
    </div>
  );
}
