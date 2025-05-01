const isDev = process.env.NODE_ENV === 'development';
export const baseUrl = isDev
  ? 'http://localhost:3000'
  : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `${process.env.VERCEL_URL}`
    : '';

// VERCEL_URL=https://interconnect-dashboard.vercel.app
// NEXT_PUBLIC_VERCEL_URL=localhost:3000
