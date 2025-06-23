import useSWR from 'swr';
import { SNLStatus } from '../types/snl';

// Fetcher function with error handling
const fetcher = async (url: string): Promise<any> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export interface UseSNLDataResult {
  data: any;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<any>;
  revalidateAll?: () => void;
  source?: string;
}

/**
 * Main hook for fetching SNL data using SWR
 * Combines data from multiple API sources
 */
export const useSNLData = (): UseSNLDataResult => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    '/api/snl',
    fetcher,
    {
      refreshInterval: 30 * 60 * 1000, // 30 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5 * 60 * 1000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors (client errors)
        // Safely check if error has status property
        const status = (error as any)?.status || (error as any)?.info?.status;
        if (typeof status === 'number') {
          return status >= 500;
        }
        // If no status available, retry for unknown errors
        return true;
      },
    }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    source: 'combined-api',
  };
};

/**
 * Hook for fetching schedule data
 */
export const useScheduleData = () => {
  return useSWR('/api/schedule', fetcher, {
    refreshInterval: 15 * 60 * 1000, // 15 minutes
    revalidateOnFocus: true,
  });
};

/**
 * Hook for fetching episode data
 */
export const useEpisodeData = () => {
  return useSWR('/api/episodes', fetcher, {
    refreshInterval: 60 * 60 * 1000, // 1 hour
  });
}; 