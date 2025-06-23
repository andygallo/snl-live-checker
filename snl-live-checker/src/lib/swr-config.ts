'use client';

import { SWRConfiguration } from 'swr';

// Default fetcher function for SWR
export const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    (error as Error & { info?: unknown; status?: number }).info = await response.json();
    (error as Error & { info?: unknown; status?: number }).status = response.status;
    throw error;
  }
  
  return response.json();
};

// SWR Global Configuration for SNL Live Checker
export const swrConfig: SWRConfiguration = {
  // Use our custom fetcher
  fetcher,
  
  // Refresh interval - check for updates every 30 minutes during the day
  // SNL data doesn't change frequently, so this is reasonable
  refreshInterval: 30 * 60 * 1000, // 30 minutes in milliseconds
  
  // Dedupe requests within 5 minutes
  dedupingInterval: 5 * 60 * 1000, // 5 minutes
  
  // Disable retries to prevent concurrent rendering conflicts
  errorRetryCount: 0,
  
  // Exponential backoff for retries
  errorRetryInterval: 5000, // 5 seconds
  
  // Disable all focus/reconnect revalidation to prevent sync issues
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  
  // Don't revalidate if data is less than 10 minutes old
  revalidateIfStale: false,
  
  // Keep previous data while fetching new data (important for UX)
  keepPreviousData: true,
  
  // Load fresh data when component mounts
  revalidateOnMount: false,
  
  // SNL-specific configuration
  // Fallback data for offline scenarios
  fallbackData: {
    isLive: false,
    showDate: null,
    host: null,
    musicalGuest: null,
    lastUpdated: null,
  },
  
  // Disable error callbacks to prevent concurrent rendering issues
  onError: undefined,
  
  // Loading timeout (30 seconds)
  loadingTimeout: 30000,
  
  // Use default comparison to prevent sync issues
  // compare: undefined, // Let SWR use default comparison
};

// Helper function to create cache keys
export const createCacheKey = (endpoint: string, params?: Record<string, string>) => {
  if (!params) return `/api/${endpoint}`;
  
  const searchParams = new URLSearchParams(params).toString();
  return `/api/${endpoint}?${searchParams}`;
};

// Cache key constants for consistency
export const CACHE_KEYS = {
  SNL_DATA: '/api/snl',
  TVMAZE_DATA: '/api/tvmaze',
  TMDB_DATA: '/api/tmdb',
  SCHEDULE_DATA: '/api/schedule',
  HOST_DATA: '/api/host',
  MUSICAL_GUEST_DATA: '/api/musical-guest',
} as const;

// Time constants
export const TIME_CONSTANTS = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const; 