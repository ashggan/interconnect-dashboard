import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { baseUrl } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

export const getUSerId = async (email: string) => {
  const data = await fetch(`${baseUrl}/api/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  const user = await data.json();

  // console.log('user', user);
  return user;
};

// Add this to src/lib/utils.ts
export function getApiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const apiPath = path.startsWith('/') ? path.slice(1) : path;

  // For server-side
  if (typeof window === 'undefined') {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : '';

    return `${baseUrl}/api/${apiPath}`;
  }

  // For client-side
  return `/api/${apiPath}`;
}
