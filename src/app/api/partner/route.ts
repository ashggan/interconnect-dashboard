import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({});

    return NextResponse.json({
      partners,
      status: 200
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partner' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.partner_name) {
      return NextResponse.json(
        { error: 'Partner name is required' },
        { status: 400 }
      );
    }

    // Check if partner with the same name already exists
    const existingPartner = await prisma.partner.findFirst({
      where: {
        partner_name: body.partner_name
      }
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: 'A partner with this name already exists' },
        { status: 409 } // 409 Conflict status code
      );
    }

    // Create new partner using prisma
    const newPartner = await prisma.partner.create({
      data: {
        partner_name: body.partner_name,
        description: body.description || '',
        country: body.country || '',
        currency: body.currency || 'USD'
      }
    });

    return NextResponse.json({
      message: 'Partner created successfully',
      partner: newPartner,
      status: 201
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}
