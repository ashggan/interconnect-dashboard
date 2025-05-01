// const isDev = process.env.NODE_ENV === 'development';
// export const baseUrl = isDev
//   ? process.env.BASE_URL
//   : process.env.NEXT_PUBLIC_BASE_URL || 'https://your-production-url.com';

const isDev = process.env.NODE_ENV === 'development';
export const baseUrl = isDev
  ? 'http://localhost:3000' // Local development URL
  : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` // Vercel provides this environment variable
    : ''; // Fallback empty string
