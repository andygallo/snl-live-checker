'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SNLStatus, SNLEpisode, SNLHost, SNLMusicalGuest, SNLSchedule } from '../types/snl';

// Action types for state management
export type SNLActionType =
  | 'SET_LOADING'
  | 'SET_ERROR'
  | 'SET_SNL_DATA'
  | 'SET_EPISODE'
  | 'SET_HOST'
  | 'SET_MUSICAL_GUEST'
  | 'SET_SCHEDULE'
  | 'CLEAR_ERROR'
  | 'REFRESH_DATA';

// Action interface
export interface SNLAction {
  type: SNLActionType;
  payload?: any;
}

// Global state interface
export interface SNLState {
  // Data
  snlData: SNLStatus | null;
  episode: SNLEpisode | null;
  host: SNLHost | null;
  musicalGuest: SNLMusicalGuest | null;
  schedule: SNLSchedule | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Meta
  lastUpdated: string | null;
  isOnline: boolean;
}

// Context interface
export interface SNLContextType {
  state: SNLState;
  dispatch: React.Dispatch<SNLAction>;
  
  // Helper functions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSNLData: (data: SNLStatus) => void;
  setEpisode: (episode: SNLEpisode) => void;
  setHost: (host: SNLHost) => void;
  setMusicalGuest: (guest: SNLMusicalGuest) => void;
  setSchedule: (schedule: SNLSchedule) => void;
  clearError: () => void;
  refreshData: () => void;
}

// Initial state
const initialState: SNLState = {
  snlData: null,
  episode: null,
  host: null,
  musicalGuest: null,
  schedule: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
};

// State reducer
const snlReducer = (state: SNLState, action: SNLAction): SNLState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
      
    case 'SET_SNL_DATA':
      return {
        ...state,
        snlData: action.payload,
        episode: action.payload?.episode || null,
        schedule: action.payload?.schedule || null,
        lastUpdated: new Date().toISOString(),
        isLoading: false,
        error: null,
      };
      
    case 'SET_EPISODE':
      return {
        ...state,
        episode: action.payload,
        lastUpdated: new Date().toISOString(),
      };
      
    case 'SET_HOST':
      return {
        ...state,
        host: action.payload,
        lastUpdated: new Date().toISOString(),
      };
      
    case 'SET_MUSICAL_GUEST':
      return {
        ...state,
        musicalGuest: action.payload,
        lastUpdated: new Date().toISOString(),
      };
      
    case 'SET_SCHEDULE':
      return {
        ...state,
        schedule: action.payload,
        lastUpdated: new Date().toISOString(),
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    case 'REFRESH_DATA':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    default:
      return state;
  }
};

// Create context
const SNLContext = createContext<SNLContextType | undefined>(undefined);

// Provider props interface
interface SNLProviderProps {
  children: ReactNode;
}

// Provider component
export const SNLProvider: React.FC<SNLProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(snlReducer, initialState);

  // Helper functions
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setSNLData = (data: SNLStatus) => {
    dispatch({ type: 'SET_SNL_DATA', payload: data });
  };

  const setEpisode = (episode: SNLEpisode) => {
    dispatch({ type: 'SET_EPISODE', payload: episode });
  };

  const setHost = (host: SNLHost) => {
    dispatch({ type: 'SET_HOST', payload: host });
  };

  const setMusicalGuest = (guest: SNLMusicalGuest) => {
    dispatch({ type: 'SET_MUSICAL_GUEST', payload: guest });
  };

  const setSchedule = (schedule: SNLSchedule) => {
    dispatch({ type: 'SET_SCHEDULE', payload: schedule });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const refreshData = () => {
    dispatch({ type: 'REFRESH_DATA' });
  };

  // Online/offline detection
  React.useEffect(() => {
    const handleOnline = () => {
      // Could dispatch an action to update online status
    };

    const handleOffline = () => {
      // Could dispatch an action to update online status
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const contextValue: SNLContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setSNLData,
    setEpisode,
    setHost,
    setMusicalGuest,
    setSchedule,
    clearError,
    refreshData,
  };

  return (
    <SNLContext.Provider value={contextValue}>
      {children}
    </SNLContext.Provider>
  );
};

// Custom hook to use SNL context
export const useSNLContext = (): SNLContextType => {
  const context = useContext(SNLContext);
  
  if (context === undefined) {
    throw new Error('useSNLContext must be used within a SNLProvider');
  }
  
  return context;
};

// Export context for testing purposes
export { SNLContext }; 