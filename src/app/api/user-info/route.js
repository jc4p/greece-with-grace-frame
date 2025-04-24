import { NextResponse } from 'next/server';

export const runtime = 'edge';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');
  
  if (!fid) {
    return NextResponse.json(
      { error: 'FID parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, 
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
    
    // If no users found, return a 404
    if (!data.users || data.users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Extract only the fields we need
    const user = data.users[0];
    const userData = {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url
    };
    
    return NextResponse.json(userData);
    
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user information' },
      { status: 500 }
    );
  }
} 