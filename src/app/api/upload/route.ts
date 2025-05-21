import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import path from 'path';
import { put } from '@vercel/blob';

// GET endpoint to retrieve all file uploads
export async function GET() {
  try {
    const uploads = await prisma.fileUpload.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      uploads,
      status: 200
    });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch uploads' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string | null;
    const userId = formData.get('userId') as string | null;

    // Validation checks
    if (!file || !name || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, name, or userId' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only CSV, XLS, or XLSX files are allowed' },
        { status: 400 }
      );
    }

    // Check file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds the 100MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = new Date().getTime();
    const fileExtension = path.extname(file.name);
    const fileName = `${timestamp}-${name.replace(/\s+/g, '_')}${fileExtension}`;

    // Upload file to Vercel Blob Storage
    const blob = await put(fileName, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    console.log('File uploaded to Vercel Blob:', blob.url);

    // Save file information to database (without path)
    const fileUpload = await prisma.fileUpload.create({
      data: {
        name, // User-provided name
        originalName: file.name, // Original filename
        fileName, // Generated filename
        mimeType: file.type, // MIME type
        fileSize: file.size, // File size in bytes
        url: blob.url,
        userId: parseInt(userId, 10)
      }
    });

    console.log('File metadata saved to database:', fileUpload);

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        file: {
          id: fileUpload.id,
          name: fileUpload.name,
          originalName: fileUpload.originalName,
          fileName: fileUpload.fileName,
          mimeType: fileUpload.mimeType,
          fileSize: fileUpload.fileSize,
          createdAt: fileUpload.createdAt
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json(
      {
        error: 'File upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
