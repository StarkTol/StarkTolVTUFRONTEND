import { useState, useCallback } from 'react';
import { vtuApi } from '@/src/api/endpoints/vtu';
import { useWalletData } from '@/context/WalletDataContext';
import { toast } from '@/hooks/use-toast';
import type { DataPurchaseRequest, DataPurchaseResponse } from '@/src/api/types';

interface UsePurchaseDataReturn {
  mutate: (payload: DataPurchaseRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  data: DataPurchaseResponse | null;
}

/**
 * Hook for purchasing data plans
 * Provides mutate function that handles success/error states, wallet updates, and toast notifications
 */
export const usePurchaseData = (): UsePurchaseDataReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<DataPurchaseResponse | null>(null);
  
  const { refreshWalletData } = useWalletData();

  const mutate = useCallback(async (payload: DataPurchaseRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setData(null);

      console.log('🔄 [usePurchaseData] Processing data purchase...', payload);

      const response = await vtuApi.purchaseData(payload);

      if (response.success && response.data) {
        setSuccess(true);
        setData(response.data);
        
        // Update wallet context with new balance
        await refreshWalletData();
        
        // Show success toast
        toast({
          title: "Purchase Successful",
          description: `Data plan "${response.data.plan.name}" has been sent to ${payload.phoneNumber}`,
          variant: "default",
        });

        console.log('✅ [usePurchaseData] Data purchase successful:', response.data);
      } else {
        const errorMessage = response.message || 'Failed to purchase data plan';
        setError(errorMessage);
        
        // Show error toast with detailed message
        toast({
          title: "Purchase Failed",
          description: errorMessage,
          variant: "destructive",
        });

        console.error('❌ [usePurchaseData] Data purchase failed:', errorMessage);
      }
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred during data purchase';
      
      // Determine error type and provide descriptive message
      if (err.name === 'NetworkError' || err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.message?.includes('insufficient')) {
        errorMessage = 'Insufficient wallet balance. Please fund your wallet and try again.';
      } else if (err.message?.includes('invalid')) {
        errorMessage = 'Invalid phone number or data plan. Please check your details and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Show error toast with normalized error message
      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });

      console.error('❌ [usePurchaseData] Data purchase error:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshWalletData]);

  return {
    mutate,
    loading,
    error,
    success,
    data,
  };
};

export default usePurchaseData;
