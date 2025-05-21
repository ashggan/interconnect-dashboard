import { NextResponse } from 'next/server';

export async function loggingMiddleware(request: Request) {
  const startTime = Date.now();
  const method = request.method;
  const url = request.url;

  console.log(`[${new Date().toISOString()}] ${method} ${url}`);

  const response = await NextResponse.next();

  const duration = Date.now() - startTime;
  console.log(
    `[${new Date().toISOString()}] ${method} ${url} completed in ${duration}ms with status ${response.status}`
  );

  return response;
}

export const config = {
  matcher: '/api/:path*'
};
