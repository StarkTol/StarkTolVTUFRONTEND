import { useState, useCallback } from 'react';
import { vtuApi } from '@/src/api/endpoints/vtu';
import { useWalletData } from '@/context/WalletDataContext';
import { toast } from '@/hooks/use-toast';
import type { AirtimePurchaseRequest, AirtimePurchaseResponse } from '@/src/api/types';

interface UsePurchaseAirtimeReturn {
  mutate: (payload: AirtimePurchaseRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  data: AirtimePurchaseResponse | null;
}

/**
 * Hook for purchasing airtime
 * Provides mutate function that handles success/error states, wallet updates, and toast notifications
 */
export const usePurchaseAirtime = (): UsePurchaseAirtimeReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<AirtimePurchaseResponse | null>(null);
  
  const { refreshWalletData } = useWalletData();

  const mutate = useCallback(async (payload: AirtimePurchaseRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setData(null);

      console.log('🔄 [usePurchaseAirtime] Processing airtime purchase...', payload);

      const response = await vtuApi.purchaseAirtime(payload);

      if (response.success && response.data) {
        setSuccess(true);
        setData(response.data);
        
        // Update wallet context with new balance
        await refreshWalletData();
        
        // Show success toast
        toast({
          title: "Purchase Successful",
          description: `Airtime of ₦${payload.amount.toLocaleString()} has been sent to ${payload.phoneNumber}`,
          variant: "default",
        });

        console.log('✅ [usePurchaseAirtime] Airtime purchase successful:', response.data);
      } else {
        const errorMessage = response.message || 'Failed to purchase airtime';
        setError(errorMessage);
        
        // Show error toast with detailed message
        toast({
          title: "Purchase Failed",
          description: errorMessage,
          variant: "destructive",
        });

        console.error('❌ [usePurchaseAirtime] Airtime purchase failed:', errorMessage);
      }
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred during airtime purchase';
      
      // Determine error type and provide descriptive message
      if (err.name === 'NetworkError' || err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.message?.includes('insufficient')) {
        errorMessage = 'Insufficient wallet balance. Please fund your wallet and try again.';
      } else if (err.message?.includes('invalid')) {
        errorMessage = 'Invalid phone number or amount. Please check your details and try again.';
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

      console.error('❌ [usePurchaseAirtime] Airtime purchase error:', err);
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

export default usePurchaseAirtime;
