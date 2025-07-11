'use client';

import createCache from '@emotion/cache';

export const emotionCache = createCache({
  key: 'css',
  prepend: true, // 確保 Emotion 樣式先插入 head
});
