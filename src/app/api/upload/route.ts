import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

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

// POST endpoint to upload a file
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const name = formData.get('name') as string | null;
  const userId = formData.get('userId') as string | null;

  // Validation checks
  if (!file || !name || !userId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Check file type
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

  // Check file size (10MB max)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: 'File size exceeds the 100MB limit' },
      { status: 400 }
    );
  }

  try {
    const uploadsDir = path.join(process.cwd(), 'public/uploads');

    // Ensure the uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Create a unique filename to prevent collisions
    const timestamp = new Date().getTime();
    const originalName = file.name;
    const fileExtension = path.extname(originalName);
    const fileName = `${timestamp}-${name.replace(/\s+/g, '_')}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Convert relative path to URL path for storage
    const publicPath = `/uploads/${fileName}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Write the file to the uploads directory
    // await fs.writeFile(filePath, fileBuffer);

    const fileData = {
      name: fileName,
      userId: parseInt(userId, 10), // Convert string to integer
      path: publicPath
    };
    console.log('File data:', fileData);

    // Save file information to the database using the correct schema
    const data = await prisma.fileUpload.create({
      data: {
        userId: parseInt(userId, 10), // Convert string to integer
        path: publicPath,
        name: name
      }
    });

    console.log('Upload data saved to database:', data);

    return NextResponse.json(
      {
        message: 'Upload successful',
        file: {
          id: data.id,
          name: data.name,
          path: data.path
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
