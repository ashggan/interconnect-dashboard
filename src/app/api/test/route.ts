import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the request body as JSON
    const body = await request.json();

    // Extract email from the body object
    const email = body.email;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove sensitive data before returning
    const { password, ...userData } = user;

    return NextResponse.json({
      userId: userData.id
    });
  } catch (error) {
    console.error('Error in /api/test:', error);
    return NextResponse.json(
      { error: 'Invalid request format or server error' },
      { status: 500 }
    );
  }
}
