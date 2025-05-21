// API route to track downloads
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    // Increment download count
    await prisma.fileUpload.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 }
      }
    });

    return NextResponse.json({
      message: 'Download tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}
