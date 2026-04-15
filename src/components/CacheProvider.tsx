'use client';

import { useEffect } from 'react';
import { warmupCache } from '@/lib/api';

export function CacheProvider() {
  useEffect(() => {
    // 页面加载时预热缓存
    warmupCache().catch(console.error);
  }, []);

  return null;
}
