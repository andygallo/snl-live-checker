import { NextRequest, NextResponse } from 'next/server';
import { SNLStatus } from '@/types/snl';

// Required for static export
export const dynamic = 'force-static';
export const revalidate = 300; // Revalidate every 5 minutes

// Mock data for development - will be replaced with real API calls
const MOCK_SNL_DATA: SNLStatus = {
  isLive: true,
  showDate: "2024-12-22",
  host: {
    id: "timothee-chalamet",
    name: "Timothée Chalamet",
    photo: "/api/placeholder/host-photo.jpg",
    bio: "Academy Award-nominated actor known for Dune, Call Me By Your Name, and more.",
    previousAppearances: 2,
    isFirstTime: false,
    socialMedia: {
      twitter: "@RealChalamet",
      instagram: "@tchalamet"
    }
  },
  musicalGuest: {
    id: "gracie-abrams",
    name: "Gracie Abrams",
    photo: "/api/placeholder/musical-guest-photo.jpg",
    bio: "Singer-songwriter known for her indie pop sound and introspective lyrics.",
    genre: "Indie Pop",
    isDebut: true,
    previousAppearances: 0,
    socialMedia: {
      twitter: "@gracieabrams",
      instagram: "@gracieabrams",
      spotify: "https://open.spotify.com/artist/4tuJ0bMpJh08umKkEXKUI5"
    }
  },
  lastUpdated: new Date().toISOString(),
  confidence: 0.95,
  sources: ["tvmaze", "nbc-official"]
};

/**
 * Determines if SNL is live tonight based on current date and schedule
 */
function isSnlLiveTonight(): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const currentHour = now.getHours();
  
  // SNL airs on Saturday nights at 11:30 PM ET
  // Check if it's Saturday after 11:30 PM or Sunday before 1:00 AM
  if (dayOfWeek === 6 && currentHour >= 23) {
    return true; // Saturday after 11:30 PM
  }
  
  if (dayOfWeek === 0 && currentHour < 1) {
    return true; // Sunday before 1:00 AM (still Saturday night show)
  }
  
  return false;
}

/**
 * Fetches SNL data from TVMaze API
 */
async function fetchTVMazeData(): Promise<Record<string, unknown> | null> {
  try {
    // TVMaze API for Saturday Night Live
    const response = await fetch('https://api.tvmaze.com/shows/315/episodes?specials=1');
    
    if (!response.ok) {
      throw new Error(`TVMaze API error: ${response.status}`);
    }
    
    const episodes = await response.json();
    
    // Get the most recent episode
    const latestEpisode = episodes[episodes.length - 1];
    
    return {
      source: 'tvmaze',
      episode: latestEpisode,
      confidence: 0.8
    };
  } catch (error) {
    console.error('TVMaze API error:', error);
    return null;
  }
}

/**
 * Fetches SNL schedule from NBC's official API (mock for now)
 */
async function fetchNBCData(): Promise<Record<string, unknown> | null> {
  try {
    // This would be NBC's official API
    // For now, we'll use mock data
    return {
      source: 'nbc-official',
      isLive: isSnlLiveTonight(),
      confidence: 0.95
    };
  } catch (error) {
    console.error('NBC API error:', error);
    return null;
  }
}

/**
 * Aggregates data from multiple sources and determines final SNL status
 */
async function aggregateSNLData(): Promise<SNLStatus> {
  const sources = await Promise.allSettled([
    fetchTVMazeData(),
    fetchNBCData()
  ]);
  
  // For now, return mock data with real-time live detection
  const isLive = isSnlLiveTonight();
  
  return {
    ...MOCK_SNL_DATA,
    isLive,
    lastUpdated: new Date().toISOString(),
    sources: sources
      .map((result) => {
        if (result.status === 'fulfilled' && result.value) {
          return (result.value as Record<string, unknown>).source as string;
        }
        return null;
      })
      .filter(Boolean) as string[]
  };
}

/**
 * GET /api/snl
 * Returns current SNL status including live/rerun info, host, and musical guest
 */
export async function GET() {
  try {
    const snlData = await aggregateSNLData();
    
    return NextResponse.json(snlData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('SNL API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch SNL data',
        message: error instanceof Error ? error.message : 'Unknown error',
        lastUpdated: new Date().toISOString(),
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * POST /api/snl
 * Force refresh SNL data (useful for testing)
 */
export async function POST() {
  try {
    const snlData = await aggregateSNLData();
    
    return NextResponse.json({
      ...snlData,
      message: 'SNL data refreshed successfully'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('SNL API refresh error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to refresh SNL data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 