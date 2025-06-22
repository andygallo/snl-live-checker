'use client';

import React, { useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useSNLContext } from './SNLContext';
import { useSNLData } from '../hooks';

interface SNLDataProviderProps {
  children: ReactNode;
}

/**
 * Enhanced provider that integrates SWR data fetching with React Context
 * Handles automatic data synchronization and error management
 */
export const SNLDataProvider: React.FC<SNLDataProviderProps> = ({ children }) => {
  const {
    state,
    setSNLData,
    setLoading,
    setError,
    clearError,
  } = useSNLContext();

  // Use the main SWR hook for data fetching
  const {
    data: snlData,
    error: swrError,
    isLoading: swrLoading,
    isValidating,
    mutate,
    revalidateAll,
  } = useSNLData();

  // Sync SWR data with Context state
  useEffect(() => {
    if (snlData) {
      // Transform SWR data to match our context state structure
      const contextData = {
        isLive: snlData.isLive || false,
        showDate: snlData.episode?.airDate || null,
        host: snlData.episode?.host || null,
        musicalGuest: snlData.episode?.musicalGuest || null,
        lastUpdated: snlData.lastUpdated || new Date().toISOString(),
        confidence: 1, // Since we have data
        sources: [snlData.source || 'api'],
      };
      
      setSNLData(contextData);
      clearError();
    }
  }, [snlData, setSNLData, clearError]);

  // Sync loading state
  useEffect(() => {
    setLoading(swrLoading || isValidating);
  }, [swrLoading, isValidating, setLoading]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (swrError) {
      const errorMessage = swrError.message || 'Failed to fetch SNL data';
      setError(errorMessage);
      
      // Show toast notification for errors
      toast.error(`SNL Data Error: ${errorMessage}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [swrError, setError]);

  // Auto-retry logic for failed requests
  useEffect(() => {
    if (swrError && !swrLoading) {
      const retryTimeout = setTimeout(() => {
        console.log('Auto-retrying SNL data fetch...');
        mutate();
      }, 30000); // Retry after 30 seconds

      return () => clearTimeout(retryTimeout);
    }
  }, [swrError, swrLoading, mutate]);

  // Provide enhanced context value with SWR integration
  const enhancedContextValue = {
    ...state,
    // Additional SWR-specific properties
    isValidating,
    revalidate: mutate,
    revalidateAll,
    lastFetchAttempt: new Date().toISOString(),
  };

  return (
    <>
      {children}
      {/* You could add loading overlays, error boundaries, etc. here */}
    </>
  );
}; 