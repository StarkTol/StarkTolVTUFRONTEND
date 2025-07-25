"use client";

import { useEffect, useCallback } from 'react';
import { useWalletContext } from '@/context/WalletContext';
import { paymentService } from '@/lib/services/paymentService';
import { toast } from 'sonner';

interface PaymentNotificationHookProps {
  txRef?: string;
  onPaymentUpdate?: (status: 'pending' | 'successful' | 'failed', data?: any) => void;
}

export function usePaymentNotifications({ 
  txRef, 
  onPaymentUpdate 
}: PaymentNotificationHookProps = {}) {
  const { refreshBalance } = useWalletContext();

  // Poll payment status for pending transactions
  const pollPaymentStatus = useCallback(async (transactionRef: string) => {
    try {
      const result = await paymentService.pollPaymentStatus(transactionRef);
      
      if (result.success && result.data) {
        const status = result.data.status;
        
        if (status === 'successful') {
          toast.success(`Payment successful! Wallet funded with ₦${result.data.amount}`);
          await refreshBalance();
          onPaymentUpdate?.('successful', result.data);
          return true; // Stop polling
        } else if (status === 'failed') {
          toast.error(`Payment failed: ${result.message}`);
          onPaymentUpdate?.('failed', result.data);
          return true; // Stop polling
        } else {
          // Still pending/processing, continue polling
          onPaymentUpdate?.('pending', result.data);
          return false;
        }
      } else {
        // API call failed, continue polling
        console.log('❌ Payment status check failed, continuing polling...');
        return false;
      }
    } catch (error) {
      console.error('❌ Error polling payment status:', error);
      return false;
    }
  }, [refreshBalance, onPaymentUpdate]);

  // Set up polling for a specific transaction
  useEffect(() => {
    if (!txRef) return;

    let pollCount = 0;
    const maxPolls = 60; // Poll for max 5 minutes (60 * 5 seconds)
    let pollInterval: NodeJS.Timeout;

    const startPolling = () => {
      pollInterval = setInterval(async () => {
        pollCount++;
        
        if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
          toast.error('Payment verification timeout. Please check your transaction history.');
          onPaymentUpdate?.('failed', { message: 'Verification timeout' });
          return;
        }

        const shouldStop = await pollPaymentStatus(txRef);
        if (shouldStop) {
          clearInterval(pollInterval);
        }
      }, 5000); // Poll every 5 seconds
    };

    // Start polling after a short delay
    setTimeout(startPolling, 2000);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [txRef, pollPaymentStatus, onPaymentUpdate]);

  // Show different types of payment notifications
  const showPaymentNotification = useCallback((
    type: 'initiated' | 'processing' | 'successful' | 'failed' | 'cancelled',
    data?: any
  ) => {
    switch (type) {
      case 'initiated':
        toast.loading('Redirecting to payment page...', { id: 'payment-process' });
        break;
      case 'processing':
        toast.loading('Processing payment...', { id: 'payment-process' });
        break;
      case 'successful':
        toast.dismiss('payment-process');
        toast.success(
          `Payment successful! Wallet funded with ₦${data?.amount || 'N/A'}`,
          { duration: 5000 }
        );
        break;
      case 'failed':
        toast.dismiss('payment-process');
        toast.error(
          data?.message || 'Payment failed. Please try again.',
          { duration: 5000 }
        );
        break;
      case 'cancelled':
        toast.dismiss('payment-process');
        toast.error('Payment was cancelled');
        break;
      default:
        break;
    }
  }, []);

  return {
    pollPaymentStatus,
    showPaymentNotification
  };
}
