import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'edge'; // Specify Edge runtime for better performance

// GET handler for fetching votes for an application
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('applicationId');
  
  if (!applicationId) {
    return NextResponse.json(
      { error: 'Application ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const { rows } = await sql`
      SELECT * FROM grace_applications_votes 
      WHERE application_id = ${applicationId} 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}

// POST handler for adding a new vote
export async function POST(request) {
  try {
    const { applicationId, fid } = await request.json();
    
    if (!applicationId || !fid) {
      return NextResponse.json(
        { error: 'Application ID and FID are required' },
        { status: 400 }
      );
    }
    
    // Validate that the application exists
    const appCheck = await sql`
      SELECT id FROM grace_applications WHERE id = ${applicationId}
    `;
    
    if (appCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    // Check if this user already voted for this application
    const voteCheck = await sql`
      SELECT id FROM grace_applications_votes 
      WHERE application_id = ${applicationId} AND fid = ${fid}
    `;
    
    if (voteCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'You have already voted for this application' },
        { status: 409 }
      );
    }
    
    // Add the vote - only store application_id and fid
    const { rows } = await sql`
      INSERT INTO grace_applications_votes (application_id, fid) 
      VALUES (${applicationId}, ${fid}) 
      RETURNING *
    `;
    
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error adding vote:', error);
    return NextResponse.json(
      { error: 'Failed to add vote' },
      { status: 500 }
    );
  }
} 