import { SNLSchedule, SNLEpisode } from '../types/snl';

export interface ScheduleEntry {
  date: Date;
  host: string;
  musicalGuest: string;
  isLive: boolean;
  isRerun?: boolean;
  originalAirDate?: Date;
  season?: number;
  episode?: number;
}

/**
 * Get the next SNL show date based on the standard schedule
 * SNL typically airs Saturdays at 11:30 PM ET
 */
export const getNextSNLDate = (currentDate: Date = new Date()): Date => {
  const now = new Date(currentDate);
  const nextSaturday = new Date(now);
  
  // Calculate days until next Saturday (6 = Saturday)
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  nextSaturday.setHours(23, 30, 0, 0); // 11:30 PM ET
  
  // If it's Saturday but past 11:30 PM, get next Saturday
  if (now.getDay() === 6 && now.getHours() >= 23 && now.getMinutes() >= 30) {
    nextSaturday.setDate(nextSaturday.getDate() + 7);
  }
  
  // If calculated date is in the past, add 7 days
  if (nextSaturday <= now) {
    nextSaturday.setDate(nextSaturday.getDate() + 7);
  }
  
  return nextSaturday;
};

/**
 * Check if SNL is currently live
 * SNL airs Saturday 11:30 PM - 1:00 AM ET (technically Sunday)
 */
export const isCurrentlyLive = (currentDate: Date = new Date()): boolean => {
  const now = new Date(currentDate);
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // Saturday 11:30 PM - 11:59 PM
  if (day === 6 && hour === 23 && minute >= 30) return true;
  
  // Sunday 12:00 AM - 1:00 AM (technically still Saturday's show)
  if (day === 0 && hour === 0) return true;
  
  return false;
};

/**
 * Get the next live show from schedule data
 */
export const getNextLiveShow = (schedule: SNLSchedule | null, currentDate: Date = new Date()): ScheduleEntry | null => {
  if (!schedule?.upcomingEpisodes) {
    // Fallback to standard schedule calculation
    const nextDate = getNextSNLDate(currentDate);
    return {
      date: nextDate,
      host: "TBA",
      musicalGuest: "TBA",
      isLive: true,
    };
  }

  const now = currentDate.getTime();
  
  // Find the next episode that's in the future
  const upcomingEpisodes = schedule.upcomingEpisodes
    .filter((episode: SNLEpisode) => {
      const episodeDate = new Date(episode.airDate);
      return episodeDate.getTime() > now && episode.isLive;
    })
    .sort((a: SNLEpisode, b: SNLEpisode) => new Date(a.airDate).getTime() - new Date(b.airDate).getTime());

  if (upcomingEpisodes.length > 0) {
    const nextEpisode = upcomingEpisodes[0];
    return {
      date: new Date(nextEpisode.airDate),
      host: nextEpisode.host?.name || "TBA",
      musicalGuest: nextEpisode.musicalGuest?.name || "TBA",
      isLive: nextEpisode.isLive,
      season: nextEpisode.seasonNumber,
      episode: nextEpisode.episodeNumber,
    };
  }

  // If no upcoming episodes found, fall back to standard calculation
  const nextDate = getNextSNLDate(currentDate);
  return {
    date: nextDate,
    host: "TBA",
    musicalGuest: "TBA",
    isLive: true,
  };
};

/**
 * Get current show information if live
 */
export const getCurrentShow = (schedule: SNLSchedule | null, currentDate: Date = new Date()): ScheduleEntry | null => {
  if (!isCurrentlyLive(currentDate)) {
    return null;
  }

  // Check current episode first
  if (schedule?.currentEpisode) {
    const currentEpisode = schedule.currentEpisode;
    return {
      date: new Date(currentEpisode.airDate),
      host: currentEpisode.host?.name || "Live Host",
      musicalGuest: currentEpisode.musicalGuest?.name || "Live Musical Guest",
      isLive: currentEpisode.isLive,
      season: currentEpisode.seasonNumber,
      episode: currentEpisode.episodeNumber,
    };
  }

  // Check upcoming episodes for today
  if (schedule?.upcomingEpisodes) {
    const todayStart = new Date(currentDate);
    todayStart.setHours(0, 0, 0, 0);
    
    // Check if there's a scheduled episode for today (Saturday)
    const todaysEpisode = schedule.upcomingEpisodes.find((episode: SNLEpisode) => {
      const episodeDate = new Date(episode.airDate);
      const episodeDateStart = new Date(episodeDate);
      episodeDateStart.setHours(0, 0, 0, 0);
      
      return episodeDateStart.getTime() === todayStart.getTime() && episode.isLive;
    });

    if (todaysEpisode) {
      return {
        date: new Date(todaysEpisode.airDate),
        host: todaysEpisode.host?.name || "Live Host",
        musicalGuest: todaysEpisode.musicalGuest?.name || "Live Musical Guest",
        isLive: todaysEpisode.isLive,
        season: todaysEpisode.seasonNumber,
        episode: todaysEpisode.episodeNumber,
      };
    }
  }

  // Fallback for live show without schedule data
  return {
    date: currentDate,
    host: "Live Host",
    musicalGuest: "Live Musical Guest",
    isLive: true,
  };
};

/**
 * Format date for display
 */
export const formatShowDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time for display
 */
export const formatShowTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
};

/**
 * Get time until next show in a human-readable format
 */
export const getTimeUntilNextShow = (nextShowDate: Date, currentDate: Date = new Date()): string => {
  const diff = nextShowDate.getTime() - currentDate.getTime();
  
  if (diff <= 0) {
    return "Show is live or has passed";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
};

/**
 * Check if a date is during SNL season (typically September to May)
 */
export const isDuringSNLSeason = (date: Date = new Date()): boolean => {
  const month = date.getMonth(); // 0-11
  
  // SNL season typically runs September (8) through May (4)
  // with breaks for holidays
  return month >= 8 || month <= 4;
};

/**
 * Get season number based on date
 */
export const getSNLSeason = (date: Date = new Date()): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // SNL season starts in September, so if it's Sept-Dec, it's the season starting that year
  // If it's Jan-Aug, it's the season that started the previous year
  if (month >= 8) {
    // Season 1 started in 1975, so season N started in year 1975 + N - 1
    return year - 1975 + 1;
  } else {
    return year - 1975;
  }
}; 