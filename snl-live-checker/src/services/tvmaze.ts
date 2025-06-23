import Bottleneck from 'bottleneck';

// Rate limiter for TVMaze API (20 requests per 10 seconds)
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 500, // 500ms between requests (2 requests per second)
  reservoir: 20, // 20 requests
  reservoirRefreshAmount: 20,
  reservoirRefreshInterval: 10 * 1000, // 10 seconds
});

// TVMaze API types
interface TVMazeShow {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number;
  premiered: string;
  officialSite: string;
  schedule: {
    time: string;
    days: string[];
  };
  rating: {
    average: number;
  };
  network: {
    id: number;
    name: string;
    country: {
      name: string;
      code: string;
      timezone: string;
    };
  };
  image: {
    medium: string;
    original: string;
  };
  summary: string;
  updated: number;
}

interface TVMazeEpisode {
  id: number;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number;
  rating: {
    average: number;
  };
  image: {
    medium: string;
    original: string;
  };
  summary: string;
  show: TVMazeShow;
}

interface TVMazeSearchResult {
  show: TVMazeShow;
}

// Normalized SNL episode interface
export interface SNLEpisode {
  id: string;
  title: string;
  airDate: string;
  airTime: string;
  season: number;
  episode: number;
  host: {
    name: string;
    image?: string;
  };
  musicalGuest: {
    name: string;
    image?: string;
  };
  isLive: boolean;
  isNewEpisode: boolean;
  summary?: string;
  source: 'tvmaze';
}

class TVMazeService {
  private baseUrl = 'https://api.tvmaze.com';

  // Rate-limited fetch wrapper
  private fetchWithRateLimit = limiter.wrap(async (url: string): Promise<unknown> => {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SNL-Live-Checker/1.0 (https://snl-live-checker.vercel.app)',
        },
      });

      if (!response.ok) {
        throw new Error(`TVMaze API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TVMaze API request failed:', error);
      throw error;
    }
  });

  // Get SNL show information
  async getSNLShow(): Promise<TVMazeShow | null> {
    try {
      const searchUrl = `${this.baseUrl}/search/shows?q=Saturday Night Live`;
      const searchResults = await this.fetchWithRateLimit(searchUrl) as TVMazeSearchResult[];
      
      // Find the exact SNL show (should be first result)
      const snlShow = searchResults.find((result: TVMazeSearchResult) => 
        result.show.name === 'Saturday Night Live' && 
        result.show.network?.name === 'NBC'
      );

      return snlShow?.show || null;
    } catch (error) {
      console.error('Failed to fetch SNL show info:', error);
      return null;
    }
  }

  // Get schedule for a specific date
  async getScheduleForDate(date: string): Promise<TVMazeEpisode[]> {
    try {
      const scheduleUrl = `${this.baseUrl}/schedule?country=US&date=${date}`;
      const schedule = await this.fetchWithRateLimit(scheduleUrl) as TVMazeEpisode[];
      
      // Filter for SNL episodes
      return schedule.filter((episode: TVMazeEpisode) => 
        episode.show.name === 'Saturday Night Live' ||
        episode.show.name.includes('Saturday Night Live')
      );
    } catch (error) {
      console.error(`Failed to fetch schedule for ${date}:`, error);
      return [];
    }
  }

  // Get SNL episodes for a date range
  async getSNLEpisodesInRange(startDate: string, endDate: string): Promise<SNLEpisode[]> {
    try {
      const episodes: SNLEpisode[] = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Iterate through each date in the range
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayEpisodes = await this.getScheduleForDate(dateStr);
        
        for (const episode of dayEpisodes) {
          const normalizedEpisode = this.normalizeEpisode(episode);
          if (normalizedEpisode) {
            episodes.push(normalizedEpisode);
          }
        }
      }

      return episodes;
    } catch (error) {
      console.error('Failed to fetch SNL episodes in range:', error);
      return [];
    }
  }

  // Get current week's SNL episode
  async getCurrentWeekEpisode(): Promise<SNLEpisode | null> {
    try {
      // Get the current Saturday
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
      const daysUntilSaturday = (6 - currentDay) % 7;
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + daysUntilSaturday);
      saturday.setHours(23, 30, 0, 0); // 11:30 PM ET

      // If it's Sunday through Tuesday, check last Saturday
      if (currentDay >= 0 && currentDay <= 2) {
        saturday.setDate(saturday.getDate() - 7);
      }

      const saturdayStr = saturday.toISOString().split('T')[0];
      const episodes = await this.getScheduleForDate(saturdayStr);
      
      if (episodes.length > 0) {
        return this.normalizeEpisode(episodes[0]);
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch current week episode:', error);
      return null;
    }
  }

  // Get upcoming SNL episode
  async getUpcomingEpisode(): Promise<SNLEpisode | null> {
    try {
      // Get next Saturday
      const now = new Date();
      const currentDay = now.getDay();
      const daysUntilSaturday = currentDay === 6 ? 7 : (6 - currentDay) % 7;
      const nextSaturday = new Date(now);
      nextSaturday.setDate(now.getDate() + daysUntilSaturday);
      
      const nextSaturdayStr = nextSaturday.toISOString().split('T')[0];
      const episodes = await this.getScheduleForDate(nextSaturdayStr);
      
      if (episodes.length > 0) {
        return this.normalizeEpisode(episodes[0]);
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch upcoming episode:', error);
      return null;
    }
  }

  // Normalize TVMaze episode data to our format
  private normalizeEpisode(episode: TVMazeEpisode): SNLEpisode | null {
    try {
      // Extract host and musical guest from summary or name
      const { host, musicalGuest } = this.extractHostAndGuest(episode);
      
      // Determine if it's live (within 3 hours of air time)
      const airTime = new Date(episode.airstamp);
      const now = new Date();
      const timeDiff = Math.abs(now.getTime() - airTime.getTime());
      const isLive = timeDiff <= 3 * 60 * 60 * 1000; // 3 hours

      // Determine if it's a new episode (not a rerun)
      const isNewEpisode = !episode.name?.toLowerCase().includes('rerun') &&
                          !episode.summary?.toLowerCase().includes('rerun') &&
                          episode.type !== 'rerun';

      return {
        id: `tvmaze-${episode.id}`,
        title: episode.name || `SNL S${episode.season}E${episode.number}`,
        airDate: episode.airdate,
        airTime: episode.airtime,
        season: episode.season,
        episode: episode.number,
        host,
        musicalGuest,
        isLive,
        isNewEpisode,
        summary: episode.summary,
        source: 'tvmaze',
      };
    } catch (error) {
      console.error('Failed to normalize episode:', error);
      return null;
    }
  }

  // Extract host and musical guest information from episode data
  private extractHostAndGuest(episode: TVMazeEpisode): {
    host: { name: string; image?: string };
    musicalGuest: { name: string; image?: string };
  } {
    // Default fallback values
    let host = { name: 'TBA' };
    let musicalGuest = { name: 'TBA' };

    try {
      // Try to extract from episode name
      if (episode.name) {
        const nameMatch = episode.name.match(/(.+?)\s*\/\s*(.+)/);
        if (nameMatch) {
          host = { name: nameMatch[1].trim() };
          musicalGuest = { name: nameMatch[2].trim() };
        }
      }

      // Try to extract from summary if available
      if (episode.summary && (host.name === 'TBA' || musicalGuest.name === 'TBA')) {
        const summaryText = episode.summary.replace(/<[^>]*>/g, ''); // Remove HTML tags
        
        // Look for "Host: Name" pattern
        const hostMatch = summaryText.match(/Host:\s*([^,\n.]+)/i);
        if (hostMatch) {
          host = { name: hostMatch[1].trim() };
        }

        // Look for "Musical Guest: Name" pattern
        const guestMatch = summaryText.match(/Musical Guest:\s*([^,\n.]+)/i);
        if (guestMatch) {
          musicalGuest = { name: guestMatch[1].trim() };
        }
      }
    } catch (error) {
      console.error('Error extracting host and guest:', error);
    }

    return { host, musicalGuest };
  }

  // Health check for TVMaze API
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; responseTime: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      await this.fetchWithRateLimit(`${this.baseUrl}/shows/1`); // Test with a simple request
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'unhealthy',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const tvMazeService = new TVMazeService();
export default tvMazeService; 