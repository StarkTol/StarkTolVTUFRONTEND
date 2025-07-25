import { useState, useEffect, useCallback, useMemo } from 'react';
import { vtuApi } from '@/src/api/endpoints/vtu';
import type { CablePlan } from '@/src/api/types';

interface UseCablePackagesReturn {
  data: CablePlan[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Simple cache to store cable packages by provider ID
const cablePackagesCache = new Map<string, { data: CablePlan[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Hook for fetching cable packages/plans for a specific provider
 * Includes caching to reduce API calls for the same provider
 */
export const useCablePackages = (providerId: string | null): UseCablePackagesReturn => {
  const [data, setData] = useState<CablePlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCablePackages = useCallback(async (force = false) => {
    if (!providerId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check cache first
    const cached = cablePackagesCache.get(providerId);
    const now = Date.now();
    
    if (!force && cached && (now - cached.timestamp) < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await vtuApi.getCablePackages(providerId);
      
      if (response.success && response.data) {
        setData(response.data);
        // Cache the result
        cablePackagesCache.set(providerId, {
          data: response.data,
          timestamp: now
        });
      } else {
        setError(response.message || 'Failed to fetch cable packages');
      }
    } catch (err: any) {
      console.error('Error fetching cable packages:', err);
      const errorMessage = err.message || 'Failed to fetch cable packages due to connection issues';
      
      // Check if we should use mock data as fallback
      const shouldUseMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || 
                           err.name === 'NetworkError' ||
                           err.code === 'NETWORK_ERROR' ||
                           err.message?.includes('fetch') ||
                           err.message?.includes('network') ||
                           !navigator.onLine;
      
      if (shouldUseMock) {
        try {
          console.log('🔄 Attempting to load mock cable packages...');
          const mockResponse = await fetch('/__mock/cable-packages.json');
          
          if (mockResponse.ok) {
            const mockData = await mockResponse.json();
            if (mockData.success && mockData.data) {
              // Filter packages by providerId if provided
              const filteredPackages = providerId 
                ? mockData.data.filter((pkg: any) => pkg.providerId === providerId)
                : mockData.data;
              
              setData(filteredPackages);
              // Cache the result
              cablePackagesCache.set(providerId, {
                data: filteredPackages,
                timestamp: Date.now()
              });
              console.log('✅ Mock cable packages loaded successfully');
              return; // Success with mock data, don't set error
            }
          }
        } catch (mockError) {
          console.error('❌ Failed to load mock cable packages:', mockError);
        }
      }
      
      // If we reach here, both real API and mock data failed
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  // Reset data when providerId changes
  useEffect(() => {
    if (!providerId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    fetchCablePackages();
  }, [providerId, fetchCablePackages]);

  // Memoized refetch function that forces cache refresh
  const refetch = useCallback(() => fetchCablePackages(true), [fetchCablePackages]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    data,
    loading,
    error,
    refetch
  }), [data, loading, error, refetch]);
};

export default useCablePackages;
