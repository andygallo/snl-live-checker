import { NextRequest, NextResponse } from 'next/server';
import { tvMazeService } from '@/services/tvmaze';

/**
 * GET /api/tvmaze
 * Returns SNL episode data from TVMaze API using our service layer
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'current';
    
    switch (type) {
      case 'current':
        // Get current week's episode
        const currentEpisode = await tvMazeService.getCurrentWeekEpisode();
        
        if (!currentEpisode) {
          return NextResponse.json({
            message: 'No SNL episode found for current week',
            episode: null,
            source: 'tvmaze'
          });
        }

        return NextResponse.json({
          episode: currentEpisode,
          source: 'tvmaze',
          timestamp: new Date().toISOString()
        });

      case 'upcoming':
        // Get upcoming episode
        const upcomingEpisode = await tvMazeService.getUpcomingEpisode();
        
        if (!upcomingEpisode) {
          return NextResponse.json({
            message: 'No upcoming SNL episode found',
            episode: null,
            source: 'tvmaze'
          });
        }

        return NextResponse.json({
          episode: upcomingEpisode,
          source: 'tvmaze',
          timestamp: new Date().toISOString()
        });

      case 'range':
        // Get episodes in date range
        const startDate = searchParams.get('start');
        const endDate = searchParams.get('end');
        
        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'Start and end dates required for range query' },
            { status: 400 }
          );
        }

        const rangeEpisodes = await tvMazeService.getSNLEpisodesInRange(startDate, endDate);
        
        return NextResponse.json({
          episodes: rangeEpisodes,
          count: rangeEpisodes.length,
          source: 'tvmaze',
          dateRange: { start: startDate, end: endDate },
          timestamp: new Date().toISOString()
        });

      case 'health':
        // Health check
        const healthStatus = await tvMazeService.healthCheck();
        
        return NextResponse.json({
          service: 'tvmaze',
          ...healthStatus,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter. Use: current, upcoming, range, or health' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('TVMaze API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch SNL data from TVMaze',
        details: error instanceof Error ? error.message : 'Unknown error',
        source: 'tvmaze'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tvmaze
 * Force refresh TVMaze data or perform specific operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = 'refresh' } = body;

    switch (action) {
      case 'refresh':
        // Force refresh current episode data
        const refreshedEpisode = await tvMazeService.getCurrentWeekEpisode();
        
        return NextResponse.json({
          action: 'refresh',
          episode: refreshedEpisode,
          source: 'tvmaze',
          timestamp: new Date().toISOString()
        });

      case 'health':
        // Perform health check
        const healthStatus = await tvMazeService.healthCheck();
        
        return NextResponse.json({
          action: 'health',
          service: 'tvmaze',
          ...healthStatus,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: refresh, health' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('TVMaze API POST error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process TVMaze request',
        details: error instanceof Error ? error.message : 'Unknown error',
        source: 'tvmaze'
      },
      { status: 500 }
    );
  }
} 