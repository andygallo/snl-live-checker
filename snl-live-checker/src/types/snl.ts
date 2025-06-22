// Core SNL Data Types for the Live Checker App

export interface SNLHost {
  id: string;
  name: string;
  photo?: string;
  bio?: string;
  previousAppearances?: number;
  isFirstTime?: boolean;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
  };
}

export interface SNLMusicalGuest {
  id: string;
  name: string;
  photo?: string;
  bio?: string;
  genre?: string;
  isDebut?: boolean;
  previousAppearances?: number;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    spotify?: string;
  };
}

export interface SNLEpisode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  airDate: string; // ISO date string
  isLive: boolean;
  isRerun: boolean;
  host: SNLHost;
  musicalGuest: SNLMusicalGuest;
  title?: string;
  description?: string;
  network: 'NBC';
  duration?: number; // in minutes
}

export interface SNLSchedule {
  currentEpisode: SNLEpisode | null;
  nextEpisode: SNLEpisode | null;
  upcomingEpisodes: SNLEpisode[];
  seasonInfo: {
    currentSeason: number;
    episodeCount: number;
    premiereDate: string;
    finaleDate?: string;
  };
}

export interface SNLStatus {
  isLive: boolean;
  showDate: string | null;
  host: SNLHost | null;
  musicalGuest: SNLMusicalGuest | null;
  lastUpdated: string; // ISO timestamp
  confidence: number; // 0-1 confidence score
  sources: string[]; // Which APIs provided the data
}

// API Response Types
export interface TVMazeResponse {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  airstamp: string;
  runtime: number;
  rating: {
    average: number | null;
  };
  image: {
    medium: string;
    original: string;
  } | null;
  summary: string;
  _links: {
    show: {
      href: string;
    };
  };
}

export interface TMDBResponse {
  id: number;
  name: string;
  overview: string;
  air_date: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

// SWR Hook Return Types
export interface UseSNLDataReturn {
  data: SNLStatus | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<SNLStatus | undefined>;
}

export interface UseScheduleDataReturn {
  data: SNLSchedule | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<SNLSchedule | undefined>;
}

// Error Types
export interface APIError extends Error {
  status?: number;
  info?: unknown;
  source?: string;
}

// Configuration Types
export interface SNLConfig {
  refreshInterval: number;
  retryCount: number;
  enableNotifications: boolean;
  preferredSources: string[];
}

// Notification Types
export interface NotificationPreferences {
  enabled: boolean;
  showTime: string; // Time to send notification (e.g., "14:00")
  methods: {
    browser: boolean;
    email: boolean;
    sms: boolean;
  };
  timezone: string;
}

// Social Sharing Types
export interface ShareableContent {
  title: string;
  description: string;
  image?: string;
  url: string;
  hashtags: string[];
}

// Loading and Error State Types
export interface LoadingState {
  isLoading: boolean;
  isValidating: boolean;
  isError: boolean;
  error?: APIError;
}

// Utility Types
export type SNLDataSource = 'tvmaze' | 'tmdb' | 'tvguide' | 'justwatch';
export type EpisodeType = 'live' | 'rerun' | 'special';
export type NotificationMethod = 'browser' | 'email' | 'sms'; 