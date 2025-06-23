import { NextRequest, NextResponse } from 'next/server';
import { SNLStatus } from '@/types/snl';

// Remove static export configuration for development
// export const dynamic = 'force-static';
// export const revalidate = 1800; // 30 minutes

export async function GET(request: NextRequest) {
  try {
    // Mock data for development - replace with real API calls later
    const mockData: SNLStatus = {
      isLive: Math.random() > 0.5, // Random for testing
      showDate: new Date().toISOString().split('T')[0],
      host: {
        id: 'timothee-chalamet',
        name: 'Timothée Chalamet',
        photo: '/api/placeholder/host-photo.jpg',
        bio: 'Academy Award-nominated actor known for Dune, Call Me By Your Name, and Little Women.',
        previousAppearances: 2,
        isFirstTime: false,
        socialMedia: {
          twitter: '@RealChalamet',
          instagram: '@tchalamet'
        }
      },
      musicalGuest: {
        id: 'sabrina-carpenter',
        name: 'Sabrina Carpenter',
        photo: '/api/placeholder/musical-guest-photo.jpg',
        bio: 'Pop singer-songwriter known for hits like "Espresso" and "Please Please Please".',
        genre: 'Pop',
        isDebut: false,
        previousAppearances: 1,
        socialMedia: {
          twitter: '@SabrinaAnnLynn',
          instagram: '@sabrinacarpenter'
        }
      },
      lastUpdated: new Date().toISOString(),
      confidence: 0.95,
      sources: ['mock-api']
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching SNL data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SNL data' },
      { status: 500 }
    );
  }
} 