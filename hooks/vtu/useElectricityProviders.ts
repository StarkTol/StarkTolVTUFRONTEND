import { useState, useEffect, useCallback, useMemo } from 'react';
import { vtuApi } from '@/src/api/endpoints/vtu';
import type { ElectricityProvider } from '@/src/api/types';

interface UseElectricityProvidersReturn {
  data: ElectricityProvider[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Simple cache for electricity providers
let electricityProvidersCache: { data: ElectricityProvider[]; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (providers don't change often)

/**
 * Hook for fetching electricity providers
 * Includes caching since providers don't change frequently
 */
export const useElectricityProviders = (): UseElectricityProvidersReturn => {
  const [data, setData] = useState<ElectricityProvider[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElectricityProviders = useCallback(async (force = false) => {
    // Check cache first
    const now = Date.now();
    
    if (!force && electricityProvidersCache && (now - electricityProvidersCache.timestamp) < CACHE_DURATION) {
      setData(electricityProvidersCache.data);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await vtuApi.getElectricityProviders();
      
      if (response.success && response.data) {
        setData(response.data);
        // Cache the result
        electricityProvidersCache = {
          data: response.data,
          timestamp: now
        };
      } else {
        setError(response.message || 'Failed to fetch electricity providers');
      }
    } catch (err: any) {
      console.error('Error fetching electricity providers:', err);
      const errorMessage = err.message || 'Failed to fetch electricity providers due to connection issues';
      
      // Check if we should use mock data as fallback
      const shouldUseMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || 
                           err.name === 'NetworkError' ||
                           err.code === 'NETWORK_ERROR' ||
                           err.message?.includes('fetch') ||
                           err.message?.includes('network') ||
                           !navigator.onLine;
      
      if (shouldUseMock) {
        try {
          console.log('🔄 Attempting to load mock electricity providers...');
          const mockResponse = await fetch('/__mock/electricity-providers.json');
          
          if (mockResponse.ok) {
            const mockData = await mockResponse.json();
            if (mockData.success && mockData.data) {
              setData(mockData.data);
              // Cache the result
              electricityProvidersCache = {
                data: mockData.data,
                timestamp: Date.now()
              };
              console.log('✅ Mock electricity providers loaded successfully');
              return; // Success with mock data, don't set error
            }
          }
        } catch (mockError) {
          console.error('❌ Failed to load mock electricity providers:', mockError);
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
    if (!electricityProvidersCache || !data) {
      fetchElectricityProviders();
    }
  }, [data, fetchElectricityProviders]);

  // Memoized refetch function that forces cache refresh
  const refetch = useCallback(() => fetchElectricityProviders(true), [fetchElectricityProviders]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    data,
    loading,
    error,
    refetch
  }), [data, loading, error, refetch]);
};

export default useElectricityProviders;
