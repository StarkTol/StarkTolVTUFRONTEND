import { useState, useEffect, useCallback, useMemo } from 'react';
import { vtuApi } from '@/src/api/endpoints/vtu';
import type { DataPlan } from '@/src/api/types';

interface UseDataPlansReturn {
  data: DataPlan[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Simple cache to store data plans by network ID
const dataPlansCache = new Map<string, { data: DataPlan[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for fetching data plans for a specific network provider
 * Includes caching to reduce API calls for the same network
 */
export const useDataPlans = (networkId: string | null): UseDataPlansReturn => {
  const [data, setData] = useState<DataPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDataPlans = useCallback(async (force = false) => {
    if (!networkId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check cache first
    const cached = dataPlansCache.get(networkId);
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
      
      const response = await vtuApi.getDataPlans(networkId);
      
      if (response.success && response.data) {
        setData(response.data);
        // Cache the result
        dataPlansCache.set(networkId, {
          data: response.data,
          timestamp: now
        });
      } else {
        setError(response.message || 'Failed to fetch data plans');
      }
    } catch (err: any) {
      console.error('Error fetching data plans:', err);
      const errorMessage = err.message || 'Failed to fetch data plans due to connection issues';
      
      // Check if we should use mock data as fallback
      const shouldUseMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || 
                           err.name === 'NetworkError' ||
                           err.code === 'NETWORK_ERROR' ||
                           err.message?.includes('fetch') ||
                           err.message?.includes('network') ||
                           !navigator.onLine;
      
      if (shouldUseMock) {
        try {
          console.log('🔄 Attempting to load mock data plans...');
          const mockResponse = await fetch('/__mock/data-plans.json');
          
          if (mockResponse.ok) {
            const mockData = await mockResponse.json();
            if (mockData.success && mockData.data) {
              // Filter plans by networkId if provided
              const filteredPlans = networkId 
                ? mockData.data.filter((plan: any) => plan.networkId === networkId)
                : mockData.data;
              
              setData(filteredPlans);
              // Cache the result
              dataPlansCache.set(networkId, {
                data: filteredPlans,
                timestamp: Date.now()
              });
              console.log('✅ Mock data plans loaded successfully');
              return; // Success with mock data, don't set error
            }
          }
        } catch (mockError) {
          console.error('❌ Failed to load mock data plans:', mockError);
        }
      }
      
      // If we reach here, both real API and mock data failed
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [networkId]);

  // Reset data when networkId changes
  useEffect(() => {
    if (!networkId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    fetchDataPlans();
  }, [networkId, fetchDataPlans]);

  // Memoized refetch function that forces cache refresh
  const refetch = useCallback(() => fetchDataPlans(true), [fetchDataPlans]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    data,
    loading,
    error,
    refetch
  }), [data, loading, error, refetch]);
};

export default useDataPlans;
