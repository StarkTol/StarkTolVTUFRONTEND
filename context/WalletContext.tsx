"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { paymentService } from '@/lib/services/paymentService';
import { supabase } from '@/lib/supabaseClient';
import { useUserData } from './UserDataContext';
import { toast } from 'sonner';

interface WalletBalance {
  balance: number;
  currency: string;
  formatted: string;
}

interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'pending' | 'successful' | 'failed';
  reference: string;
  createdAt: string;
  updatedAt: string;
}

interface WalletContextType {
  balance: WalletBalance;
  transactions: WalletTransaction[];
  loading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  fundWallet: (amount: number) => Promise<{ paymentLink: string; txRef: string }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useUserData();
  const [balance, setBalance] = useState<WalletBalance>({
    balance: 0,
    currency: 'NGN',
    formatted: '₦0.00'
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format balance for display
  const formatBalance = useCallback((amount: number, currency: string = 'NGN') => {
    const symbol = currency === 'NGN' ? '₦' : currency;
    return `${symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }, []);

  // Fetch wallet balance
  const refreshBalance = useCallback(async () => {
    try {
      setError(null);
      const balanceData = await paymentService.getWalletBalance();
      
      const newBalance = {
        balance: balanceData.balance,
        currency: balanceData.currency,
        formatted: formatBalance(balanceData.balance, balanceData.currency)
      };
      
      setBalance(newBalance);
      console.log('💰 Wallet balance updated:', newBalance);
    } catch (err: any) {
      console.error('❌ Failed to refresh balance:', err);
      setError(err.message);
    }
  }, [formatBalance]);

  // Fetch wallet transactions
  const refreshTransactions = useCallback(async () => {
    try {
      // This would call your transactions API
      // For now, keeping the existing transaction logic
      console.log('📊 Refreshing transactions...');
    } catch (err: any) {
      console.error('❌ Failed to refresh transactions:', err);
    }
  }, []);

  // Fund wallet function
  const fundWallet = useCallback(async (amount: number) => {
    if (!profile?.id) {
      throw new Error('User not authenticated');
    }

      try {
      setError(null);
      const response = await paymentService.initiatePayment({
        amount,
        userId: profile.id
      });

      console.log('💳 Payment initiated:', response);

      if (!response.success) {
        throw new Error(response.message || 'Payment initiation failed');
      }

      if (!response.data) {
        throw new Error('Payment initiation response missing data');
      }

      return response.data;
    } catch (err: any) {
      console.error('❌ Failed to initiate payment:', err);
      setError(err.message);
      throw err;
    }
  }, [profile?.id]);

  // Set up real-time wallet updates using Supabase
  useEffect(() => {
    if (!profile?.id) return;

    console.log('🔄 Setting up real-time wallet updates for user:', profile.id);

    // Subscribe to wallet updates channel
    const channel = supabase
      .channel('wallet_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          console.log('💰 Real-time wallet update received:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            const newBalance = {
              balance: payload.new.balance || 0,
              currency: payload.new.currency || 'NGN',
              formatted: formatBalance(payload.new.balance || 0, payload.new.currency || 'NGN')
            };
            
            setBalance(newBalance);
            
            // Show toast notification for balance updates
            if (payload.new.balance > balance.balance) {
              toast.success(`Wallet credited with ${formatBalance(payload.new.balance - balance.balance)}`);
            } else if (payload.new.balance < balance.balance) {
              toast.info(`Wallet debited: ${formatBalance(balance.balance - payload.new.balance)}`);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('🔔 Wallet subscription status:', status);
      });

    // Subscribe to transaction updates
    const transactionChannel = supabase
      .channel('transaction_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          console.log('📊 Real-time transaction update received:', payload);
          
          if (payload.eventType === 'INSERT' && payload.new) {
            const newTransaction: WalletTransaction = {
              id: payload.new.id,
              type: payload.new.type,
              amount: payload.new.amount,
              description: payload.new.description,
              status: payload.new.status,
              reference: payload.new.reference,
              createdAt: payload.new.created_at,
              updatedAt: payload.new.updated_at
            };
            
            setTransactions(prev => [newTransaction, ...prev]);
            
            // Show notification for new transactions
            if (payload.new.type === 'credit') {
              toast.success(`Payment received: ${formatBalance(payload.new.amount)}`);
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setTransactions(prev => 
              prev.map(tx => 
                tx.id === payload.new.id 
                  ? { ...tx, status: payload.new.status, updatedAt: payload.new.updated_at }
                  : tx
              )
            );

            // Show notification for transaction status updates
            if (payload.new.status === 'successful') {
              toast.success(`Transaction completed: ${payload.new.description}`);
            } else if (payload.new.status === 'failed') {
              toast.error(`Transaction failed: ${payload.new.description}`);
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      console.log('🧹 Cleaning up wallet subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(transactionChannel);
    };
  }, [profile?.id, balance.balance, formatBalance]);

  // Initial data load
  useEffect(() => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          refreshBalance(),
          refreshTransactions()
        ]);
      } catch (err) {
        console.error('❌ Failed to load initial wallet data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [profile?.id, refreshBalance, refreshTransactions]);

  const value: WalletContextType = {
    balance,
    transactions,
    loading,
    error,
    refreshBalance,
    refreshTransactions,
    fundWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}
