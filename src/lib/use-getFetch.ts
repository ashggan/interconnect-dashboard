import { useState, useEffect, useCallback } from 'react';
import { baseUrl } from './constants';

/**
 * Custom hook for making API requests with CORS handling
 * @template T The expected type of the response data
 * @param {string} url - The API endpoint to fetch from
 * @param {RequestInit} options - Fetch options like method, headers, etc.
 * @param {boolean} autoFetch - Whether to fetch on component mount
 * @returns {{ data: T | null; error: string | null; loading: boolean; fetchData: () => Promise<T | null> }}
 */
const useFetch = <T = any>(
  url: string,
  options: RequestInit = {},
  autoFetch = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Define the fetchData function using useCallback to prevent unnecessary re-creation
  const fetchData = useCallback(async (): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${baseUrl}/${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Note: 'cors: no-cors' is not a valid header
          // And setting CORS headers client-side won't work for cross-origin requests
          // These headers should be set on the server instead
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = (await response.json()) as T;
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch data';

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Use useEffect to fetch data on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, error, loading, fetchData };
};

export default useFetch;
