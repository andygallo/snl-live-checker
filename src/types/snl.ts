// Basic SNL data interfaces
export interface Host {
  id?: string;
  name: string;
  image?: string;
  bio?: string;
  timesHosted?: number;
  lastHosted?: string;
  notable_work?: string[];
}

export interface MusicalGuest {
  id?: string;
  name: string;
  image?: string;
  bio?: string;
  timesPerformed?: number;
  lastPerformed?: string;
  genre?: string;
  albums?: string[];
}

export interface Episode {
  id?: string;
  season: number;
  episode: number;
  airDate: string;
  host: Host;
  musicalGuest: MusicalGuest;
  isLive: boolean;
  isRerun: boolean;
  description?: string;
  sketches?: string[];
  rating?: number;
}

export interface Schedule {
  currentEpisode?: Episode;
  nextEpisode?: Episode;
  isLiveTonight: boolean;
  nextLiveDate?: string;
  timeUntilNext?: number; // milliseconds
}

export interface SNLData {
  isLive: boolean;
  episode?: Episode;
  schedule: Schedule;
  lastUpdated: string;
  source: string;
}

// API Response types
export interface TVMazeResponse {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number;
  image?: {
    medium: string;
    original: string;
  };
  summary?: string;
  _links?: {
    show: {
      href: string;
    };
  };
}

export interface TMDBResponse {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  last_air_date: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  seasons: Array<{
    id: number;
    season_number: number;
    episode_count: number;
    air_date: string;
  }>;
}

export interface ScheduleResponse {
  isLive: boolean;
  nextShow?: {
    date: string;
    time: string;
    timestamp: number;
  };
  currentShow?: {
    date: string;
    time: string;
    isLive: boolean;
  };
}

// Theme and UI types
export interface SNLJoke {
  text: string;
  character?: string;
  sketch?: string;
  season?: number;
}

export interface HostTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  catchphrase?: string;
  movieOrShow?: string;
  funFact?: string;
  emoji: string;
}

export interface SNLThemeData {
  reruns: SNLJoke[];
  hostThemes: Record<string, HostTheme>;
  defaultLiveTheme: HostTheme;
}

// Hook return types
export interface UseSWRResult<T> {
  data: T | undefined;
  error: any;
  isLoading: boolean;
  isValidating: boolean;
  mutate: (data?: T | Promise<T>, shouldRevalidate?: boolean) => Promise<T | undefined>;
}

export interface UseEpisodeDataResult extends UseSWRResult<Episode> {}
export interface UseHostDataResult extends UseSWRResult<Host> {}
export interface UseMusicalGuestDataResult extends UseSWRResult<MusicalGuest> {}
export interface UseScheduleDataResult extends UseSWRResult<Schedule> {}
export interface UseSNLDataResult extends UseSWRResult<SNLData> {} 