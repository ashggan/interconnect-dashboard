import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

// get uploads from prisma by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check if ID is valid
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid file upload ID' },
        { status: 400 }
      );
    }

    // Find the file upload record
    const fileUpload = await prisma.fileUpload.findUnique({
      where: { id }
    });

    if (!fileUpload) {
      return NextResponse.json(
        { error: 'File upload not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fileUpload,
      status: 200
    });
  } catch (error) {
    console.error('Error fetching file upload:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file upload' },
      { status: 500 }
    );
  }
}

// update file name and path in prisma by id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { name, path } = await request.json();

    // Check if ID is valid
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid file upload ID' },
        { status: 400 }
      );
    }

    // Find the file upload record
    const fileUpload = await prisma.fileUpload.findUnique({
      where: { id }
    });

    if (!fileUpload) {
      return NextResponse.json(
        { error: 'File upload not found' },
        { status: 404 }
      );
    }

    // Update the file upload record
    const updatedFileUpload = await prisma.fileUpload.update({
      where: { id },
      data: {
        name,
        path
      }
    });

    return NextResponse.json({
      updatedFileUpload,
      status: 200
    });
  } catch (error) {
    console.error('Error updating file upload:', error);
    return NextResponse.json(
      { error: 'Failed to update file upload' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check if ID is valid
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid file upload ID' },
        { status: 400 }
      );
    }

    // Find the file upload record
    const fileUpload = await prisma.fileUpload.findUnique({
      where: { id }
    });

    if (!fileUpload) {
      return NextResponse.json(
        { error: 'File upload not found' },
        { status: 404 }
      );
    }

    // Get the file path
    const filePath = path.join(process.cwd(), 'public', fileUpload.path);

    try {
      // Delete the physical file
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting file from disk:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete the database record
    await prisma.fileUpload.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'File upload deleted successfully',
      status: 200
    });
  } catch (error) {
    console.error('Error deleting file upload:', error);
    return NextResponse.json(
      { error: 'Failed to delete file upload' },
      { status: 500 }
    );
  }
}
