import { useState, useEffect, useCallback } from 'react';
import { vtuApi } from '@/src/api/endpoints/vtu';
import type { ServiceProvider } from '@/src/api/types';

interface UseNetworksReturn {
  data: ServiceProvider[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and caching networks/providers list
 * Provides unified access to all service providers across VTU services
 */
export const useNetworks = (): UseNetworksReturn => {
  const [data, setData] = useState<ServiceProvider[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await vtuApi.getNetworks();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch networks');
      }
    } catch (err: any) {
      console.error('Error fetching networks:', err);
      const errorMessage = err.message || 'Failed to fetch networks due to connection issues';
      
      // Check if we should use mock data as fallback
      const shouldUseMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || 
                           err.name === 'NetworkError' ||
                           err.code === 'NETWORK_ERROR' ||
                           err.message?.includes('fetch') ||
                           err.message?.includes('network') ||
                           !navigator.onLine;
      
      if (shouldUseMock) {
        try {
          console.log('🔄 Attempting to load mock networks data...');
          const mockResponse = await fetch('/__mock/networks.json');
          
          if (mockResponse.ok) {
            const mockData = await mockResponse.json();
            if (mockData.success && mockData.data) {
              setData(mockData.data);
              console.log('✅ Mock networks data loaded successfully');
              return; // Success with mock data, don't set error
            }
          }
        } catch (mockError) {
          console.error('❌ Failed to load mock networks data:', mockError);
        }
      }
      
      // If we reach here, both real API and mock data failed
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if we don't have data yet (simple caching)
    if (!data) {
      fetchNetworks();
    }
  }, [data, fetchNetworks]);

  return {
    data,
    loading,
    error,
    refetch: fetchNetworks
  };
};

export default useNetworks;
