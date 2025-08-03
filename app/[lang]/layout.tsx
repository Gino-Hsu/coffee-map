import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
