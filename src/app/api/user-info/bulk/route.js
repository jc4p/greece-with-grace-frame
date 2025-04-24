import { NextResponse } from 'next/server';

export const runtime = 'edge';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fids = searchParams.get('fids');
  
  if (!fids) {
    return NextResponse.json(
      { error: 'fids parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Neynar API supports up to 50 FIDs in a single request
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`, 
      {
        headers: {
          'x-api-key': NEYNAR_API_KEY,
          'x-neynar-experimental': 'false'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Neynar API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // If no users found, return empty array
    if (!data.users || data.users.length === 0) {
      return NextResponse.json([]);
    }
    
    // Transform to a map of fid -> user data for easier client-side usage
    const usersMap = {};
    data.users.forEach(user => {
      usersMap[user.fid] = {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfpUrl: user.pfp_url
      };
    });
    
    return NextResponse.json(usersMap);
    
  } catch (error) {
    console.error('Error fetching bulk user info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user information' },
      { status: 500 }
    );
  }
} 