// Export all SWR data fetching hooks
export { useEpisodeData } from './useEpisodeData';
export { useHostData } from './useHostData';
export { useMusicalGuestData } from './useMusicalGuestData';
export { useScheduleData } from './useScheduleData';
export { useSNLData, getRandomJoke, getHostTheme } from './useSNLData';

// Re-export types for convenience
export type {
  UseEpisodeDataResult,
  UseHostDataResult,
  UseMusicalGuestDataResult,
  UseScheduleDataResult,
  UseSNLDataResult,
} from '../types/snl'; 