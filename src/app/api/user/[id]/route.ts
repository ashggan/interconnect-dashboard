import prisma from '@/lib/prisma';

import { NextResponse } from 'next/server';

// GET endpoint to fetch a user by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check if ID is valid
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id }
    });

    // If user not found, return 404
    if (!user) {
      return NextResponse.json({ error: 'user not found' }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json({
      user,
      status: 200
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!data.name) {
      return NextResponse.json(
        { error: 'User name is required' },
        { status: 400 }
      );
    }

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data
    });

    return NextResponse.json({
      user: updatedUser,
      status: 200
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
