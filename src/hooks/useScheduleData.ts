import useSWR from 'swr';
import { Schedule, UseScheduleDataResult } from '../types/snl';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
});

/**
 * Custom hook for fetching SNL schedule data
 * @returns SWR result with schedule data, loading state, and error handling
 */
export const useScheduleData = (): UseScheduleDataResult => {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Schedule>(
    '/api/schedule',
    fetcher,
    {
      refreshInterval: 15 * 60 * 1000, // 15 minutes (schedule is time-sensitive)
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5 * 60 * 1000, // 5 minutes
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