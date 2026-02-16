import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Noto_Sans_JP, Noto_Sans_TC, Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import EmotionRegistry from '../../emotion/registry';
import HeaderLayout from '@/components/headerLayout';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { UserProvider } from '@/lib/context/userContext';
import ClientThemeProvider from '@/components/clietThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-jp',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-tc',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sc',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coffee Map',
  description: 'A map for coffee lovers, find your favorite coffee shops!',
  icons: {
    icon: '/logoImg.png',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`
    ${geistSans.variable} 
    ${geistMono.variable}
    ${notoSansJP.variable} 
    ${notoSansTC.variable} 
    ${notoSansSC.variable}
    antialiased bg-custom-bgColor
  `}
      >
        <EmotionRegistry>
          <NextIntlClientProvider>
            <ClientThemeProvider>
              <UserProvider lang={lang}>
                <HeaderLayout />
                {children}
              </UserProvider>
            </ClientThemeProvider>
          </NextIntlClientProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
