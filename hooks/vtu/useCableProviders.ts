import { useState, useEffect, useCallback, useMemo } from 'react';
import { vtuApi } from '@/src/api/endpoints/vtu';
import type { CableProvider } from '@/src/api/types';

interface UseCableProvidersReturn {
  data: CableProvider[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Simple cache for cable providers
let cableProvidersCache: { data: CableProvider[]; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (providers don't change often)

/**
 * Hook for fetching cable TV providers
 * Includes caching since providers don't change frequently
 */
export const useCableProviders = (): UseCableProvidersReturn => {
  const [data, setData] = useState<CableProvider[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCableProviders = useCallback(async (force = false) => {
    // Check cache first
    const now = Date.now();
    
    if (!force && cableProvidersCache && (now - cableProvidersCache.timestamp) < CACHE_DURATION) {
      setData(cableProvidersCache.data);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await vtuApi.getCableProviders();
      
      if (response.success && response.data) {
        setData(response.data);
        // Cache the result
        cableProvidersCache = {
          data: response.data,
          timestamp: now
        };
      } else {
        setError(response.message || 'Failed to fetch cable providers');
      }
    } catch (err: any) {
      console.error('Error fetching cable providers:', err);
      const errorMessage = err.message || 'Failed to fetch cable providers due to connection issues';
      
      // Check if we should use mock data as fallback
      const shouldUseMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || 
                           err.name === 'NetworkError' ||
                           err.code === 'NETWORK_ERROR' ||
                           err.message?.includes('fetch') ||
                           err.message?.includes('network') ||
                           !navigator.onLine;
      
      if (shouldUseMock) {
        try {
          console.log('🔄 Attempting to load mock cable providers...');
          const mockResponse = await fetch('/__mock/cable-providers.json');
          
          if (mockResponse.ok) {
            const mockData = await mockResponse.json();
            if (mockData.success && mockData.data) {
              setData(mockData.data);
              // Cache the result
              cableProvidersCache = {
                data: mockData.data,
                timestamp: Date.now()
              };
              console.log('✅ Mock cable providers loaded successfully');
              return; // Success with mock data, don't set error
            }
          }
        } catch (mockError) {
          console.error('❌ Failed to load mock cable providers:', mockError);
        }
      }
      
      // If we reach here, both real API and mock data failed
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if we don't have cached data
    if (!cableProvidersCache || !data) {
      fetchCableProviders();
    }
  }, [data, fetchCableProviders]);

  // Memoized refetch function that forces cache refresh
  const refetch = useCallback(() => fetchCableProviders(true), [fetchCableProviders]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    data,
    loading,
    error,
    refetch
  }), [data, loading, error, refetch]);
};

export default useCableProviders;
