import { NextRequest, NextResponse } from 'next/server';
import { TMDBResponse } from '@/types/snl';

// Required for static export
export const dynamic = 'force-static';
export const revalidate = 1800; // Revalidate every 30 minutes

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const SNL_SERIES_ID = 1667; // Saturday Night Live series ID on TMDB

// Note: TMDB requires an API key. For development, we'll use mock data
// In production, you would set TMDB_API_KEY in environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * Fetches SNL data from TMDB API
 */
async function fetchTMDBData(endpoint: string): Promise<Record<string, unknown>> {
  if (!TMDB_API_KEY) {
    console.warn('TMDB_API_KEY not found, using mock data');
    return getMockTMDBData();
  }

  try {
    const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SNL-Live-Checker/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDB API error:', error);
    // Fallback to mock data on error
    return getMockTMDBData();
  }
}

/**
 * Mock TMDB data for development
 */
function getMockTMDBData(): Record<string, unknown> {
  return {
    id: 1667,
    name: "Saturday Night Live",
    overview: "A late-night live television sketch comedy and variety show.",
    first_air_date: "1975-10-11",
    last_air_date: "2024-12-22",
    number_of_episodes: 950,
    number_of_seasons: 50,
    status: "Returning Series",
    networks: [
      {
        id: 6,
        name: "NBC",
        logo_path: "/nbc_logo.png"
      }
    ],
    seasons: [
      {
        id: 123456,
        season_number: 50,
        episode_count: 22,
        air_date: "2024-09-28"
      }
    ],
    last_episode_to_air: {
      id: 789012,
      name: "Timothée Chalamet / Gracie Abrams",
      overview: "Timothée Chalamet hosts with musical guest Gracie Abrams.",
      air_date: "2024-12-22",
      episode_number: 10,
      season_number: 50,
      still_path: "/episode_still.jpg",
      vote_average: 8.2,
      vote_count: 156
    }
  };
}

/**
 * Gets SNL series information from TMDB
 */
async function getSNLSeriesInfo(): Promise<Record<string, unknown>> {
  return await fetchTMDBData(`/tv/${SNL_SERIES_ID}`);
}

/**
 * Gets current season episodes from TMDB
 */
async function getCurrentSeasonEpisodes(seasonNumber: number): Promise<TMDBResponse[]> {
  try {
    const data = await fetchTMDBData(`/tv/${SNL_SERIES_ID}/season/${seasonNumber}`);
    return (data.episodes as TMDBResponse[]) || [];
  } catch (error) {
    console.error('Error getting current season episodes:', error);
    return [];
  }
}

/**
 * Gets specific episode details from TMDB
 */
async function getEpisodeDetails(seasonNumber: number, episodeNumber: number): Promise<TMDBResponse | null> {
  try {
    const data = await fetchTMDBData(`/tv/${SNL_SERIES_ID}/season/${seasonNumber}/episode/${episodeNumber}`);
    return data as TMDBResponse;
  } catch (error) {
    console.error('Error getting episode details:', error);
    return null;
  }
}

/**
 * GET /api/tmdb
 * Returns SNL data from TMDB API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'series';
    const season = searchParams.get('season');
    const episode = searchParams.get('episode');

    let data;

    switch (type) {
      case 'series':
        data = await getSNLSeriesInfo();
        break;
      case 'season':
        if (!season) {
          throw new Error('Season number required for season type');
        }
        data = await getCurrentSeasonEpisodes(parseInt(season));
        break;
      case 'episode':
        if (!season || !episode) {
          throw new Error('Season and episode numbers required for episode type');
        }
        data = await getEpisodeDetails(parseInt(season), parseInt(episode));
        break;
      default:
        data = await getSNLSeriesInfo();
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'tmdb',
      lastUpdated: new Date().toISOString(),
      hasApiKey: !!TMDB_API_KEY,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // 30 min cache, 1 hour stale
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('TMDB API route error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch TMDB data',
      message: error instanceof Error ? error.message : 'Unknown error',
      source: 'tmdb',
      lastUpdated: new Date().toISOString(),
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * POST /api/tmdb
 * Force refresh TMDB data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type = 'series', season, episode } = body;

    let data;

    switch (type) {
      case 'series':
        data = await getSNLSeriesInfo();
        break;
      case 'season':
        if (!season) {
          throw new Error('Season number required for season type');
        }
        data = await getCurrentSeasonEpisodes(season);
        break;
      case 'episode':
        if (!season || !episode) {
          throw new Error('Season and episode numbers required for episode type');
        }
        data = await getEpisodeDetails(season, episode);
        break;
      default:
        data = await getSNLSeriesInfo();
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'tmdb',
      message: 'TMDB data refreshed successfully',
      lastUpdated: new Date().toISOString(),
      hasApiKey: !!TMDB_API_KEY,
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('TMDB API refresh error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to refresh TMDB data',
      message: error instanceof Error ? error.message : 'Unknown error',
      source: 'tmdb',
    }, {
      status: 500,
    });
  }
} 