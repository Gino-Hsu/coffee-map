import HeaderLayout from '@/components/headerLayout';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

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
      <body>
        <NextIntlClientProvider>
          <HeaderLayout />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
