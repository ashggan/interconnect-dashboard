// src/app/api/trunk/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Include the related partner data for each trunk
    const trunks = await prisma.trunk.findMany({
      include: {
        partner: true
      }
    });

    return NextResponse.json({
      trunks,
      status: 200
    });
  } catch (error) {
    console.error('Error fetching trunks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trunks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Trunk name is required' },
        { status: 400 }
      );
    }

    if (!body.partnerId) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    // Check if the partner exists
    const partnerExists = await prisma.partner.findUnique({
      where: {
        id: body.partnerId
      }
    });

    if (!partnerExists) {
      return NextResponse.json(
        { error: 'The specified partner does not exist' },
        { status: 404 }
      );
    }

    // Create new trunk using prisma
    const newTrunk = await prisma.trunk.create({
      data: {
        name: body.name,
        description: body.description || '',
        partnerId: body.partnerId
      }
    });

    return NextResponse.json({
      message: 'Trunk created successfully',
      trunk: newTrunk,
      status: 201
    });
  } catch (error) {
    console.error('Error creating trunk:', error);
    return NextResponse.json(
      { error: 'Failed to create trunk' },
      { status: 500 }
    );
  }
}
