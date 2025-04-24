import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'edge'; // Specify Edge runtime for better performance

// GET handler for fetching all applications
export async function GET(request) {
  try {
    // Fetch applications without the votes column since it's now in a separate table
    const { rows } = await sql`
      SELECT * FROM grace_applications ORDER BY created_at DESC
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST handler for adding a new application
export async function POST(request) {
  try {
    const { 
      name, 
      age, 
      location, 
      hasPassport, 
      reasons, 
      stories, 
      interests, 
      friendDescription, 
      fid,
      username,
      profilePictureUrl
    } = await request.json();
    
    // Validate required fields
    if (!name || !age || !location || hasPassport === undefined || !reasons || !stories || !interests || !friendDescription) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Age validation
    if (parseInt(age) < 18) {
      return NextResponse.json(
        { error: 'You must be 18 or older to apply' },
        { status: 400 }
      );
    }
    
    // Insert the new application with username and profile picture
    const { rows } = await sql`
      INSERT INTO grace_applications 
      (name, age, location, has_passport, reasons, stories, interests, friend_description, fid, username, profile_picture_url) 
      VALUES (${name}, ${parseInt(age)}, ${location}, ${hasPassport}, ${reasons}, ${stories}, ${interests}, ${friendDescription}, ${fid || null}, ${username || null}, ${profilePictureUrl || null}) 
      RETURNING *
    `;
    
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
} 