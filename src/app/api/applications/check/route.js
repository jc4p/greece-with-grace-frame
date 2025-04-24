import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'edge'; // Specify Edge runtime for better performance

// GET handler to check if a user has already applied
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');
  
  if (!fid) {
    return NextResponse.json(
      { error: 'FID is required' },
      { status: 400 }
    );
  }
  
  try {
    const { rows } = await sql`
      SELECT id FROM grace_applications 
      WHERE fid = ${fid} 
      LIMIT 1
    `;
    
    return NextResponse.json({
      exists: rows.length > 0
    });
  } catch (error) {
    console.error('Error checking application:', error);
    return NextResponse.json(
      { error: 'Failed to check application' },
      { status: 500 }
    );
  }
} 