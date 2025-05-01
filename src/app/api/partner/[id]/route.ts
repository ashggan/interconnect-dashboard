import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Make sure the parameter types match exactly what Next.js expects
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Rest of your code remains the same
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid partner ID' },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.findUnique({
      where: { id }
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({
      partner,
      status: 200
    });
  } catch (error) {
    console.error('Error fetching partner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partner' },
      { status: 500 }
    );
  }
}

// The PUT handler should also use the params from the route
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);

    // Validate required fields
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid partner ID' },
        { status: 400 }
      );
    }

    if (!body.partner_name) {
      return NextResponse.json(
        { error: 'Partner name is required' },
        { status: 400 }
      );
    }

    // Check if partner with the same name already exists
    const existingPartner = await prisma.partner.findFirst({
      where: {
        partner_name: body.partner_name,
        id: {
          not: id
        }
      }
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: 'A partner with this name already exists' },
        { status: 409 }
      );
    }

    // Update partner using prisma
    const updatedPartner = await prisma.partner.update({
      where: {
        id: id
      },
      data: {
        partner_name: body.partner_name,
        description: body.description || '',
        country: body.country || '',
        currency: body.currency || 'USD'
      }
    });

    return NextResponse.json({
      message: 'Partner updated successfully',
      partner: updatedPartner,
      status: 200
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: 'Failed to update partner' },
      { status: 500 }
    );
  }
}

// The DELETE handler using the consistent pattern
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Validate required fields
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid partner ID' },
        { status: 400 }
      );
    }

    // Check if partner exists
    const existingPartner = await prisma.partner.findUnique({
      where: { id }
    });
    if (!existingPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Delete partner using prisma
    await prisma.partner.delete({
      where: { id }
    });
    console.log('Partner deleted successfully:', id);

    return NextResponse.json({
      message: 'Partner deleted successfully',
      status: 200
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json(
      { error: 'Failed to delete partner' },
      { status: 500 }
    );
  }
}
