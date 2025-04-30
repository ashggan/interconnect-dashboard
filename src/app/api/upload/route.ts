import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const name = formData.get('name') as string | null;
  const userId = formData.get('userId') as string | null;

  if (!file || !name || !userId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const uploadsDir = path.join(process.cwd(), 'public/uploads');

    // Ensure the uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Create a unique filename to prevent collisions
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);

    // Convert relative path to URL path for storage
    const publicPath = `/uploads/${fileName}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Write the file to the uploads directory
    await fs.writeFile(filePath, fileBuffer);

    // Save file information to the database
    const data = await prisma.fileUpload.create({
      data: {
        userId: parseInt(userId, 10), // Convert string to integer
        path: publicPath,
        name: name
        // createdAt and updatedAt are handled automatically by Prisma
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
