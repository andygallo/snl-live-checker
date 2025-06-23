import { NextRequest, NextResponse } from 'next/server';
import { TVMazeResponse } from '@/types/snl';

// Remove static export configuration for development
// export const dynamic = 'force-static';
// export const revalidate = 1800; // 30 minutes

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';
const SNL_SHOW_ID = 315; // Saturday Night Live show ID on TVMaze

/**
 * Fetches SNL episodes from TVMaze API
 */
async function fetchSNLEpisodes(): Promise<TVMazeResponse[]> {
  try {
    const response = await fetch(
      `${TVMAZE_BASE_URL}/shows/${SNL_SHOW_ID}/episodes?specials=1`,
      {
        headers: {
          'User-Agent': 'SNL-Live-Checker/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`TVMaze API error: ${response.status} ${response.statusText}`);
    }

    const episodes = await response.json();
    return episodes;
  } catch (error) {
    console.error('TVMaze API error:', error);
    throw error;
  }
}

/**
 * Gets the latest SNL episode from TVMaze
 */
async function getLatestEpisode(): Promise<TVMazeResponse | null> {
  try {
    const episodes = await fetchSNLEpisodes();
    
    if (!episodes || episodes.length === 0) {
      return null;
    }

    // Sort by air date and get the most recent
    const sortedEpisodes = episodes
      .filter(episode => episode.airdate) // Only episodes with air dates
      .sort((a, b) => new Date(b.airdate).getTime() - new Date(a.airdate).getTime());

    return sortedEpisodes[0] || null;
  } catch (error) {
    console.error('Error getting latest episode:', error);
    return null;
  }
}

/**
 * Gets upcoming SNL episodes from TVMaze
 */
async function getUpcomingEpisodes(limit: number = 5): Promise<TVMazeResponse[]> {
  try {
    const episodes = await fetchSNLEpisodes();
    const now = new Date();

    const upcomingEpisodes = episodes
      .filter(episode => {
        if (!episode.airdate) return false;
        const airDate = new Date(episode.airdate);
        return airDate > now;
      })
      .sort((a, b) => new Date(a.airdate).getTime() - new Date(b.airdate).getTime())
      .slice(0, limit);

    return upcomingEpisodes;
  } catch (error) {
    console.error('Error getting upcoming episodes:', error);
    return [];
  }
}

/**
 * GET /api/tvmaze
 * Returns SNL episode data from TVMaze API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showId = searchParams.get('showId') || '209'; // SNL show ID on TVMaze
    
    // Mock data for development - replace with real TVMaze API call
    const mockEpisode: TVMazeResponse = {
      id: 2584952,
      name: 'Timothée Chalamet / Boygenius',
      season: 50,
      number: 10,
      airdate: new Date().toISOString().split('T')[0],
      airstamp: new Date().toISOString(),
      runtime: 90,
      rating: { average: 8.5 },
      image: {
        medium: 'https://static.tvmaze.com/uploads/images/medium_landscape/462/1156704.jpg',
        original: 'https://static.tvmaze.com/uploads/images/original_untouched/462/1156704.jpg'
      },
      summary: '<p>Tonight\'s episode features Timothée Chalamet as host and Boygenius as the musical guest.</p>',
      _links: {
        show: { href: 'https://api.tvmaze.com/shows/209' }
      }
    };

    return NextResponse.json(mockEpisode);
  } catch (error) {
    console.error('TVMaze API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TVMaze data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tvmaze
 * Force refresh TVMaze data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type = 'latest', limit = 5 } = body;

    let data;

    switch (type) {
      case 'latest':
        data = await getLatestEpisode();
        break;
      case 'upcoming':
        data = await getUpcomingEpisodes(limit);
        break;
      case 'all':
        data = await fetchSNLEpisodes();
        break;
      default:
        data = await getLatestEpisode();
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'tvmaze',
      message: 'TVMaze data refreshed successfully',
      lastUpdated: new Date().toISOString(),
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('TVMaze API refresh error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to refresh TVMaze data',
      message: error instanceof Error ? error.message : 'Unknown error',
      source: 'tvmaze',
    }, {
      status: 500,
    });
  }
} 