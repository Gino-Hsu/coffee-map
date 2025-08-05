'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MainVisual from './mainVisual';
import LanguageSelect from './languageSelect';
import LoginComponent from './loginComponent';
import LogoComponent from './logoComponent';
import MemberMenu from './memberMenu';
import clsx from 'clsx';

export default function HeaderLayout() {
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const pathname = usePathname();

  // ✅ 判斷是否為語系首頁，如 '/', '/ja', '/en'...
  const isLangHome = (() => {
    const segments = pathname.split('/').filter(Boolean); // 避免空字串
    return segments.length === 0 || segments.length === 1;
  })();

  useEffect(() => {
    const toggleIsHeaderFixed = () => {
      const windowScrollY = window.scrollY;
      const windowInnerHeight = window.innerHeight;

      if (windowScrollY > windowInnerHeight - 64) {
        setIsHeaderFixed(true);
      } else {
        setIsHeaderFixed(false);
      }
    };

    toggleIsHeaderFixed();
    window.addEventListener('scroll', toggleIsHeaderFixed);

    return () => {
      window.removeEventListener('scroll', toggleIsHeaderFixed);
    };
  }, []);

  return (
    <>
      {/* Main Visual 只在首頁出現 */}
      {isLangHome && <MainVisual />}
      {/* Header */}
      <header
        className={
          'sticky top-0 h-16 border-b border-custom-borderColor bg-custom-bgColor'
        }
      >
        <div className={clsx('h-full mx-7 flex items-center  justify-between')}>
          <div className={!isHeaderFixed && isLangHome ? 'fixed top-12' : ''}>
            <LogoComponent
              isHeaderFixed={isHeaderFixed}
              isLangHome={isLangHome}
            />
          </div>
          {isLangHome && !isHeaderFixed && <div></div>}
          <div className={'flex items-center gap-4'}>
            <LoginComponent />
            <LanguageSelect />
            <MemberMenu />
          </div>
        </div>
      </header>
    </>
  );
}
