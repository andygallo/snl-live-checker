import useSWR from 'swr';
import { Episode, UseEpisodeDataResult } from '../types/snl';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
});

/**
 * Custom hook for fetching current episode data
 * @param episodeId - Optional episode ID to fetch specific episode
 * @returns SWR result with episode data, loading state, and error handling
 */
export const useEpisodeData = (episodeId?: string): UseEpisodeDataResult => {
  const url = episodeId ? `/api/episodes/${episodeId}` : '/api/episodes/current';
  
  const { data, error, isLoading, isValidating, mutate } = useSWR<Episode>(
    url,
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