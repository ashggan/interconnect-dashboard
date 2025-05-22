import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { del } from '@vercel/blob';

// get uploads from prisma by id

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  const upload = await prisma.fileUpload.findUnique({
    where: { id }
  });
  return NextResponse.json(upload);
}

// update upload

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check if the upload exists before updating
    const existingUpload = await prisma.fileUpload.findUnique({
      where: { id }
    });

    if (!existingUpload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
    }

    const upload = await prisma.fileUpload.update({
      where: { id },
      data: { name }
    });

    return NextResponse.json({
      message: 'Upload updated successfully',
      upload,
      status: 200
    });
  } catch (error) {
    console.error('Error updating upload:', error);
    return NextResponse.json(
      { error: 'Failed to update upload' },
      { status: 500 }
    );
  }
}

// delete upload

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // First get the upload to check if it exists and get the blob URL
    const existingUpload = await prisma.fileUpload.findUnique({
      where: { id }
    });

    if (!existingUpload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
    }

    // Delete from Vercel Blob storage if URL exists
    if (existingUpload.url) {
      try {
        await del(existingUpload.url);
      } catch (blobError) {
        console.error('Error deleting from blob storage:', blobError);
        // Continue with database deletion even if blob deletion fails
      }
    }

    // Delete from database
    const upload = await prisma.fileUpload.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Upload deleted successfully',
      upload,
      status: 200
    });
  } catch (error) {
    console.error('Error deleting upload:', error);
    return NextResponse.json(
      { error: 'Failed to delete upload' },
      { status: 500 }
    );
  }
}
