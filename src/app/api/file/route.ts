import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { url } = await put('articles/blob.txt', 'Hello World!', {
    access: 'public'
  });
  return NextResponse.json({ url });
}
