import { useState, useEffect, useCallback, useMemo } from 'react';
import { electricityService, type ElectricityTransaction } from '@/lib/services/electricityService';

interface UseElectricityTransactionsReturn {
  transactions: ElectricityTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getTransactionById: (id: string) => Promise<ElectricityTransaction | null>;
  checkTransactionStatus: (reference: string) => Promise<{ status: string; message?: string } | null>;
  getReceipt: (transactionId: string) => Promise<any>;
}

/**
 * Hook for managing electricity transactions
 * Provides comprehensive transaction management with status checking and receipts
 */
export const useElectricityTransactions = (limit: number = 10): UseElectricityTransactionsReturn => {
  const [transactions, setTransactions] = useState<ElectricityTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await electricityService.getRecentTransactions(limit);
      setTransactions(data);
    } catch (err: any) {
      console.error('Error fetching electricity transactions:', err);
      setError(err?.message || 'Failed to fetch electricity transactions');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const getTransactionById = useCallback(async (id: string): Promise<ElectricityTransaction | null> => {
    try {
      return await electricityService.getTransactionById(id);
    } catch (err: any) {
      console.error(`Error fetching transaction ${id}:`, err);
      return null;
    }
  }, []);

  const checkTransactionStatus = useCallback(async (reference: string) => {
    try {
      return await electricityService.checkTransactionStatus(reference);
    } catch (err: any) {
      console.error(`Error checking status for ${reference}:`, err);
      return null;
    }
  }, []);

  const getReceipt = useCallback(async (transactionId: string) => {
    try {
      return await electricityService.getReceipt(transactionId);
    } catch (err: any) {
      console.error(`Error fetching receipt for ${transactionId}:`, err);
      return null;
    }
  }, []);

  const refetch = useCallback(() => fetchTransactions(), [fetchTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    transactions,
    loading,
    error,
    refetch,
    getTransactionById,
    checkTransactionStatus,
    getReceipt
  }), [transactions, loading, error, refetch, getTransactionById, checkTransactionStatus, getReceipt]);
};

export default useElectricityTransactions;
