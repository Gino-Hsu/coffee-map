'use client';

import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import theme from '@/lib/theme';
import CssBaseline from '@mui/material/CssBaseline';

export default function ClientThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
