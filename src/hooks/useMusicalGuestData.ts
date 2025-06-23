import useSWR from 'swr';
import { MusicalGuest, UseMusicalGuestDataResult } from '../types/snl';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
});

/**
 * Custom hook for fetching musical guest data
 * @param guestId - Optional guest ID to fetch specific musical guest
 * @returns SWR result with musical guest data, loading state, and error handling
 */
export const useMusicalGuestData = (guestId?: string): UseMusicalGuestDataResult => {
  const url = guestId ? `/api/musical-guests/${guestId}` : '/api/musical-guests/current';
  
  const { data, error, isLoading, isValidating, mutate } = useSWR<MusicalGuest>(
    url,
    fetcher,
    {
      refreshInterval: 60 * 60 * 1000, // 1 hour
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