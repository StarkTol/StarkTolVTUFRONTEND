import { useState, useEffect } from 'react';
import { getWalletBalance, getWalletTransactions } from '@/src/api';
import { formatCurrency } from '@/src/api';

interface WalletData {
  balance: number;
  formatted: string;
  currency: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
}

interface Transaction {
  id: string | number;
  type: 'credit' | 'debit';
  description: string;
  amount: string;
  rawAmount: number;
  date: string;
  status: string;
  method?: string;
  reference?: string;
  fee?: string;
  balance?: string;
  details?: any;
}

interface UseWalletReturn {
  walletData: WalletData | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const useWallet = (): UseWalletReturn => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformTransaction = (transaction: any): Transaction => ({
    id: transaction.id,
    type: transaction.type,
    description: transaction.description || transaction.narration || 'Transaction',
    amount: transaction.formatted_amount || formatCurrency(Math.abs(transaction.amount || 0)),
    rawAmount: transaction.amount || 0,
    date: new Date(transaction.created_at || transaction.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    status: transaction.status || 'completed',
    method: transaction.payment_method,
    reference: transaction.reference,
    fee: transaction.fee ? formatCurrency(transaction.fee) : '₦0',
    balance: transaction.balance ? formatCurrency(transaction.balance) : undefined,
    details: transaction.details,
  });

  const transformWalletData = (data: any): WalletData => ({
    balance: data.balance || 0,
    formatted: data.formatted || formatCurrency(data.balance || 0),
    currency: data.currency || 'NGN',
    accountNumber: data.accountNumber || '1234567890',
    accountName: data.accountName || 'John Doe',
    bankName: data.bankName || 'Babs VTU Bank',
  });

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [balanceResponse, transactionsResponse] = await Promise.all([
        getWalletBalance(),
        getWalletTransactions({ limit: 5 })
      ]);

      if (balanceResponse.success) {
        setWalletData(transformWalletData(balanceResponse.data));
      }

      if (transactionsResponse.success && Array.isArray(transactionsResponse.data)) {
        setTransactions(transactionsResponse.data.map(transformTransaction));
      }
    } catch (err: any) {
      console.error('Error fetching wallet data:', err);
      setError(err.message || 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return { 
    walletData, 
    transactions, 
    loading, 
    error,
    refetch: fetchWalletData
  };
};

export default useWallet;

