import { useState, useCallback } from 'react';
import { vtuApi } from '@/src/api/endpoints/vtu';
import { useWalletData } from '@/context/WalletDataContext';
import { toast } from '@/hooks/use-toast';
import type { CablePurchaseRequest, CablePurchaseResponse } from '@/src/api/types';

interface UsePurchaseCableReturn {
  mutate: (payload: CablePurchaseRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  data: CablePurchaseResponse | null;
}

/**
 * Hook for purchasing cable TV subscriptions
 * Provides mutate function that handles success/error states, wallet updates, and toast notifications
 */
export const usePurchaseCable = (): UsePurchaseCableReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<CablePurchaseResponse | null>(null);
  
  const { refreshWalletData } = useWalletData();

  const mutate = useCallback(async (payload: CablePurchaseRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setData(null);

      console.log('🔄 [usePurchaseCable] Processing cable purchase...', payload);

      const response = await vtuApi.purchaseCable(payload);

      if (response.success && response.data) {
        setSuccess(true);
        setData(response.data);
        
        // Update wallet context with new balance
        await refreshWalletData();
        
        // Show success toast
        const customerInfo = response.data.customerName ? ` for ${response.data.customerName}` : '';
        toast({
          title: "Purchase Successful",
          description: `Cable subscription "${response.data.plan.name}" has been activated for smart card ${payload.smartCardNumber}${customerInfo}`,
          variant: "default",
        });

        console.log('✅ [usePurchaseCable] Cable purchase successful:', response.data);
      } else {
        const errorMessage = response.message || 'Failed to purchase cable subscription';
        setError(errorMessage);
        
        // Show error toast with detailed message
        toast({
          title: "Purchase Failed",
          description: errorMessage,
          variant: "destructive",
        });

        console.error('❌ [usePurchaseCable] Cable purchase failed:', errorMessage);
      }
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred during cable subscription';
      
      // Determine error type and provide descriptive message
      if (err.name === 'NetworkError' || err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.message?.includes('insufficient')) {
        errorMessage = 'Insufficient wallet balance. Please fund your wallet and try again.';
      } else if (err.message?.includes('invalid')) {
        errorMessage = 'Invalid smart card number or package. Please check your details and try again.';
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

      console.error('❌ [usePurchaseCable] Cable purchase error:', err);
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

export default usePurchaseCable;
