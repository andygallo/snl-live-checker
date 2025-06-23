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
      refreshInterval: 0, // Disable automatic refresh to prevent rendering conflicts
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true, // Only fetch on initial mount
      dedupingInterval: 30 * 60 * 1000, // 30 minutes
      errorRetryCount: 0, // Disable retries
      keepPreviousData: true,
      shouldRetryOnError: () => false,
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
    refreshInterval: 0, // Disable automatic refresh
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
    errorRetryCount: 0,
    shouldRetryOnError: () => false,
    keepPreviousData: true,
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