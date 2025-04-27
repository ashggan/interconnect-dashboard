// src/app/api/trunk/[id]/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET endpoint to fetch a trunk by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check if ID is valid
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid trunk ID' }, { status: 400 });
    }

    // Fetch trunk from database with partner info
    const trunk = await prisma.trunk.findUnique({
      where: { id },
      include: { partner: true }
    });

    // If trunk not found, return 404
    if (!trunk) {
      return NextResponse.json({ error: 'Trunk not found' }, { status: 404 });
    }

    // Return the trunk data
    return NextResponse.json({
      trunk,
      status: 200
    });
  } catch (error) {
    console.error('Error fetching trunk:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trunk' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a trunk
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check if ID is valid
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid trunk ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, partnerId } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Trunk name is required' },
        { status: 400 }
      );
    }

    if (!partnerId) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    // Check if the partner exists
    const partnerExists = await prisma.partner.findUnique({
      where: { id: partnerId }
    });

    if (!partnerExists) {
      return NextResponse.json(
        { error: 'The specified partner does not exist' },
        { status: 404 }
      );
    }

    // Update trunk using prisma
    const updatedTrunk = await prisma.trunk.update({
      where: { id },
      data: {
        name,
        description: description || '',
        partnerId
      }
    });

    return NextResponse.json({
      message: 'Trunk updated successfully',
      trunk: updatedTrunk,
      status: 200
    });
  } catch (error) {
    console.error('Error updating trunk:', error);
    return NextResponse.json(
      { error: 'Failed to update trunk' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a trunk
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check if ID is valid
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid trunk ID' }, { status: 400 });
    }

    // Check if trunk exists
    const existingTrunk = await prisma.trunk.findUnique({
      where: { id }
    });

    if (!existingTrunk) {
      return NextResponse.json({ error: 'Trunk not found' }, { status: 404 });
    }

    // Delete trunk using prisma
    await prisma.trunk.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Trunk deleted successfully',
      status: 200
    });
  } catch (error) {
    console.error('Error deleting trunk:', error);
    return NextResponse.json(
      { error: 'Failed to delete trunk' },
      { status: 500 }
    );
  }
}
