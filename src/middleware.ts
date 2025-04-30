import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: Request) {
  const session = await auth();

  if (!session) {
    const requestedPage = new URL(request.url);
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('callbackUrl', requestedPage.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
