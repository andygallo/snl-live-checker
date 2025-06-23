import useSWR from 'swr';
import { Host, UseHostDataResult } from '../types/snl';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
});

/**
 * Custom hook for fetching host data
 * @param hostId - Optional host ID to fetch specific host
 * @returns SWR result with host data, loading state, and error handling
 */
export const useHostData = (hostId?: string): UseHostDataResult => {
  const url = hostId ? `/api/hosts/${hostId}` : '/api/hosts/current';
  
  const { data, error, isLoading, isValidating, mutate } = useSWR<Host>(
    url,
    fetcher,
    {
      refreshInterval: 60 * 60 * 1000, // 1 hour (host data changes less frequently)
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 30 * 60 * 1000, // 30 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      shouldRetryOnError: (error) => {
        return error.status >= 500;
      },
    }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}; 