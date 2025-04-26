import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  const name = formData.get('name');
  const userId = formData.get('userId');

  if (
    !file ||
    typeof file !== 'object' ||
    !name ||
    typeof name !== 'string' ||
    !userId ||
    typeof userId !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Missing or invalid required fields' },
      { status: 400 }
    );
  }

  try {
    const uploadsDir = path.join(process.cwd(), 'public/uploads');

    // Ensure the uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // check if the file exist or not
    const fileExists = await fs.stat(filePath).catch(() => false);
    if (fileExists) {
      return NextResponse.json(
        { error: 'File already exists' },
        { status: 409 }
      );
    }

    // Write the file to the uploads directory
    await fs.writeFile(filePath, fileBuffer);

    // if ile upload is successful, you can save the file path to your database here

    const uploadData = {
      userId,
      path: filePath,
      name,
      createdAt: new Date().toISOString()
    };
    // Save uploadData to your database here using prisma

    const data = await prisma.fileUpload.create({
      data: uploadData
    });
    console.log('Upload data saved to database:', data);

    return NextResponse.json({ Message: 'Success', status: 200 });
  } catch (error) {
    console.log('Error occured ', error);
    return NextResponse.json({ Message: 'Failed', status: 500 });
  }
}
