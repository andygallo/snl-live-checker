'use client';

import { SWRConfig } from 'swr';
import { swrConfig } from '@/lib/swr-config';

interface SWRProviderProps {
  children: React.ReactNode;
  fallback?: Record<string, unknown>;
}

/**
 * SWR Provider Component for SNL Live Checker
 * 
 * This component wraps the application and provides SWR configuration
 * including caching, revalidation, and error handling strategies.
 */
export function SWRProvider({ children, fallback = {} }: SWRProviderProps) {
  return (
    <SWRConfig 
      value={{
        ...swrConfig,
        fallback: {
          ...swrConfig.fallbackData,
          ...fallback,
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}

export default SWRProvider; 