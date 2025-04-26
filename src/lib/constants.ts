const isDev = process.env.NODE_ENV === 'development';
export const baseUrl = isDev
  ? process.env.BASE_URL
  : process.env.NEXT_PUBLIC_BASE_URL || 'https://your-production-url.com';
