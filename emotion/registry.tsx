// /emotion/registry.tsx
'use client';

import { ReactNode } from 'react';
import { CacheProvider } from '@emotion/react';
import { emotionCache } from './cache';

export default function EmotionRegistry({ children }: { children: ReactNode }) {
  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}
