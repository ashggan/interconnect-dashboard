import { hashPassword } from '@/lib/auth';
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Validate URL ID
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();

    console.log('Request body:', body);

    const { name, email, password, role, isBlocked } = body;
    // const { ...data } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'User name is required' },
        { status: 400 }
      );
    }

    let hashedPassword: string | undefined;
    // Handle password updates if present
    if (password) {
      // Hash password here if needed
      hashedPassword = await hashPassword(password);
    }

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: { id },

      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isBlocked
      }
    });

    // // Filter sensitive data before returning
    const { password: _, ...userResponse } = updatedUser;

    return NextResponse.json({
      user: userResponse,
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

// DELETE endpoint to delete a user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Validate URL ID
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Delete user from the database
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'User deleted successfully',
      status: 200
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
