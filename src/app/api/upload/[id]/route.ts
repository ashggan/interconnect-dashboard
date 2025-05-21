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
