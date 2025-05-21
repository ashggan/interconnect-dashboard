import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

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
  const id = parseInt(params.id);

  const body = await request.json();
  const { name } = body;

  const upload = await prisma.fileUpload.update({
    where: { id },
    data: { name }
  });

  return NextResponse.json(upload);
}

// delete upload

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  const upload = await prisma.fileUpload.delete({
    where: { id }
  });

  return NextResponse.json(upload);
}
