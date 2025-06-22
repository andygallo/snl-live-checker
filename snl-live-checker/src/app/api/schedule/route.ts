import { NextRequest, NextResponse } from 'next/server';
import { SNLSchedule, SNLEpisode } from '@/types/snl';

// Required for static export
export const dynamic = 'force-static';
export const revalidate = 300; // Revalidate every 5 minutes

/**
 * Determines if it's currently SNL time (Saturday 11:30 PM - Sunday 1:00 AM ET)
 */
function isCurrentlySNLTime(): boolean {
  const now = new Date();
  
  // Convert to ET (UTC-5 in standard time, UTC-4 in daylight time)
  // For simplicity, we'll assume EST (UTC-5)
  const etOffset = -5;
  const etTime = new Date(now.getTime() + (etOffset * 60 * 60 * 1000));
  
  const dayOfWeek = etTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = etTime.getHours();
  const minute = etTime.getMinutes();
  
  // Saturday 11:30 PM ET or later
  if (dayOfWeek === 6 && (hour > 23 || (hour === 23 && minute >= 30))) {
    return true;
  }
  
  // Sunday before 1:00 AM ET (still Saturday night's show)
  if (dayOfWeek === 0 && hour < 1) {
    return true;
  }
  
  return false;
}

/**
 * Gets the next Saturday date
 */
function getNextSaturday(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7; // If it's Saturday, get next Saturday
  
  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  nextSaturday.setHours(23, 30, 0, 0); // 11:30 PM
  
  return nextSaturday;
}

/**
 * Gets the current Saturday (or last Saturday if it's not Saturday)
 */
function getCurrentSaturday(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  let daysSinceSaturday;
  if (dayOfWeek === 6) {
    daysSinceSaturday = 0; // It's Saturday
  } else if (dayOfWeek === 0) {
    daysSinceSaturday = 1; // It's Sunday, Saturday was yesterday
  } else {
    daysSinceSaturday = (dayOfWeek + 1) % 7; // Days since last Saturday
  }
  
  const currentSaturday = new Date(now);
  currentSaturday.setDate(now.getDate() - daysSinceSaturday);
  currentSaturday.setHours(23, 30, 0, 0); // 11:30 PM
  
  return currentSaturday;
}

/**
 * Checks if SNL is typically on hiatus (summer break, holiday break)
 */
function isTypicallyOnHiatus(date: Date): boolean {
  const month = date.getMonth(); // 0-11
  const dayOfMonth = date.getDate();
  
  // Summer hiatus: typically June through September
  if (month >= 5 && month <= 8) {
    return true;
  }
  
  // Holiday hiatus: typically mid-December through early January
  if (month === 11 && dayOfMonth > 15) {
    return true;
  }
  
  if (month === 0 && dayOfMonth < 15) {
    return true;
  }
  
  return false;
}

/**
 * Creates a mock episode for the current/next show
 */
function createMockEpisode(date: Date, isLive: boolean): SNLEpisode {
  return {
    id: `snl-${date.toISOString().split('T')[0]}`,
    seasonNumber: 50, // Current season
    episodeNumber: isLive ? 10 : 9, // Mock episode numbers
    airDate: date.toISOString(),
    isLive,
    isRerun: !isLive,
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
    title: isLive ? "Live from New York" : "Best of SNL",
    description: isLive 
      ? "Live episode featuring Timothée Chalamet and Gracie Abrams"
      : "Rerun featuring highlights from previous episodes",
    network: 'NBC',
    duration: 90
  };
}

/**
 * Generates upcoming episodes (mock data)
 */
function generateUpcomingEpisodes(count: number = 5): SNLEpisode[] {
  const episodes: SNLEpisode[] = [];
  let currentDate = getNextSaturday();
  
  for (let i = 0; i < count; i++) {
    const isOnHiatus = isTypicallyOnHiatus(currentDate);
    
    if (!isOnHiatus) {
      episodes.push(createMockEpisode(currentDate, true));
    }
    
    // Move to next Saturday
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return episodes;
}

/**
 * GET /api/schedule
 * Returns SNL schedule information
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUpcoming = searchParams.get('upcoming') === 'true';
    const upcomingCount = parseInt(searchParams.get('count') || '5');
    
    const isCurrentlyLive = isCurrentlySNLTime();
    const currentSaturday = getCurrentSaturday();
    const nextSaturday = getNextSaturday();
    
    // Determine if tonight's show is live or rerun
    const isOnHiatus = isTypicallyOnHiatus(currentSaturday);
    const isLiveTonight = !isOnHiatus && !isCurrentlyLive; // Assume live if not on hiatus
    
    const currentEpisode = createMockEpisode(currentSaturday, isLiveTonight);
    const nextEpisode = createMockEpisode(nextSaturday, true);
    
    const schedule: SNLSchedule = {
      currentEpisode: isCurrentlyLive ? currentEpisode : null,
      nextEpisode,
      upcomingEpisodes: includeUpcoming ? generateUpcomingEpisodes(upcomingCount) : [],
      seasonInfo: {
        currentSeason: 50,
        episodeCount: 22,
        premiereDate: "2024-09-28",
        finaleDate: "2025-05-17"
      }
    };
    
    return NextResponse.json({
      success: true,
      data: schedule,
      meta: {
        isCurrentlyLive,
        isOnHiatus,
        currentTime: new Date().toISOString(),
        nextShowDate: nextSaturday.toISOString(),
      },
      source: 'schedule',
      lastUpdated: new Date().toISOString(),
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Schedule API route error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch schedule data',
      message: error instanceof Error ? error.message : 'Unknown error',
      source: 'schedule',
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
 * POST /api/schedule
 * Force refresh schedule data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { includeUpcoming = true, upcomingCount = 5 } = body;
    
    const isCurrentlyLive = isCurrentlySNLTime();
    const currentSaturday = getCurrentSaturday();
    const nextSaturday = getNextSaturday();
    
    const isOnHiatus = isTypicallyOnHiatus(currentSaturday);
    const isLiveTonight = !isOnHiatus && !isCurrentlyLive;
    
    const currentEpisode = createMockEpisode(currentSaturday, isLiveTonight);
    const nextEpisode = createMockEpisode(nextSaturday, true);
    
    const schedule: SNLSchedule = {
      currentEpisode: isCurrentlyLive ? currentEpisode : null,
      nextEpisode,
      upcomingEpisodes: includeUpcoming ? generateUpcomingEpisodes(upcomingCount) : [],
      seasonInfo: {
        currentSeason: 50,
        episodeCount: 22,
        premiereDate: "2024-09-28",
        finaleDate: "2025-05-17"
      }
    };
    
    return NextResponse.json({
      success: true,
      data: schedule,
      meta: {
        isCurrentlyLive,
        isOnHiatus,
        currentTime: new Date().toISOString(),
        nextShowDate: nextSaturday.toISOString(),
      },
      source: 'schedule',
      message: 'Schedule data refreshed successfully',
      lastUpdated: new Date().toISOString(),
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Schedule API refresh error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to refresh schedule data',
      message: error instanceof Error ? error.message : 'Unknown error',
      source: 'schedule',
    }, {
      status: 500,
    });
  }
} 