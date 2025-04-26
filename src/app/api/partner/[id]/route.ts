import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET endpoint to fetch a partner by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check if ID is valid
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid partner ID' },
        { status: 400 }
      );
    }

    // Fetch partner from database
    const partner = await prisma.partner.findUnique({
      where: { id }
    });

    // If partner not found, return 404
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Return the partner data
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    if (!data.partner_name) {
      return NextResponse.json(
        { error: 'Partner name is required' },
        { status: 400 }
      );
    }

    // Check if partner with the same name already exists
    const existingPartner = await prisma.partner.findFirst({
      where: {
        partner_name: data.partner_name,
        id: {
          not: id
        }
      }
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: 'A partner with this name already exists' },
        { status: 409 } // 409 Conflict status code
      );
    }

    // Update partner using prisma
    const updatedPartner = await prisma.partner.update({
      where: {
        id: id
      },
      data: {
        partner_name: data.partner_name,
        description: data.description || '',
        country: data.country || '',
        currency: data.currency || 'USD'
      }
    });

    return NextResponse.json({
      message: 'Partner updated successfully',
      partner: updatedPartner,
      status: 200
    });
  } catch (error) {}
}

export async function DELETE({ params }: { params: { id: string } }) {
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
    // Optionally, you can also delete related data if needed

    // return success response

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
