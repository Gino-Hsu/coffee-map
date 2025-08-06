'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import clsx from 'clsx';

export default function MainVisual() {
  const totalImages = 3;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInitImmediately, setIsInitImmediately] = useState(false);
  const [isInit, setIsInit] = useState(false);
  const t = useTranslations('MainVisual');

  useEffect(() => {
    const timer_imgControl = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % totalImages);
    }, 9000);

    const timer_initControl = setTimeout(() => {
      setIsInit(true);
    }, 800);

    setIsInitImmediately(true);

    return () => {
      clearInterval(timer_imgControl);
      clearTimeout(timer_initControl);
    };
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] relative flex overflow-hidden">
      <div className="flex-1">
        <h1
          className={clsx(
            'relative top-72 ml-11 font-bold text-3xl leading-relaxed text-custom-fontColor  transition-opacity duration-500 ease-in-out',
            isInit ? 'opacity-100' : 'opacity-0'
          )}
        >
          {t('title_1')}
          <br />
          {t('title_2')}
        </h1>
      </div>

      <div
        className={clsx(
          'z-10 w-[2px] bg-custom-borderColor transition-[height] duration-1000 ease-in-out',
          isInitImmediately ? 'h-full' : 'h-0'
        )}
      ></div>

      <div
        className={clsx(
          'relative flex-1 overflow-hidden transition-opacity duration-500 ease-in-out',
          isInit ? 'opacity-100' : 'opacity-0'
        )}
      >
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
              quality={80}
              fill
              sizes="(max-width: 768px) 80%, (max-width: 1200px) 50%"
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>

      <div
        className={clsx(
          'z-10 absolute bottom-0 h-[2px] w-full bg-custom-borderColor transition-transform duration-1000 ease-in-out origin-center',
          isInitImmediately ? 'scale-x-100' : 'scale-x-0'
        )}
      ></div>
    </div>
  );
}
