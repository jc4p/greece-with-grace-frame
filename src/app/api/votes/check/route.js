import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'edge'; // Specify Edge runtime for better performance

// GET handler to check if a user has already voted for an application
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('applicationId');
  const fid = searchParams.get('fid');
  
  if (!applicationId || !fid) {
    return NextResponse.json(
      { error: 'Application ID and FID are required' },
      { status: 400 }
    );
  }
  
  try {
    const { rows } = await sql`
      SELECT id FROM grace_applications_votes 
      WHERE application_id = ${applicationId} AND fid = ${fid}
      LIMIT 1
    `;
    
    return NextResponse.json({
      hasVoted: rows.length > 0
    });
  } catch (error) {
    console.error('Error checking vote status:', error);
    return NextResponse.json(
      { error: 'Failed to check vote status' },
      { status: 500 }
    );
  }
} 