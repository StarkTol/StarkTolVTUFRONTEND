"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useWalletContext } from '@/context/WalletContext';
import { toast } from 'sonner';
import axios from 'axios';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshBalance } = useWalletContext();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [amount, setAmount] = useState<string>('');
  const [txRef, setTxRef] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const paymentStatus = searchParams.get('status');
      const transactionRef = searchParams.get('tx_ref');
      const paymentAmount = searchParams.get('amount');
      
      console.log('🔍 Payment return params:', { paymentStatus, transactionRef, paymentAmount });

      if (!transactionRef) {
        setStatus('failed');
        setMessage('No transaction reference found');
        return;
      }

      setTxRef(transactionRef);
      setAmount(paymentAmount || '0');

      if (paymentStatus === 'cancelled') {
        setStatus('failed');
        setMessage('Payment was cancelled by user');
        toast.error('Payment was cancelled');
        return;
      }
      
      if (paymentStatus === 'failed') {
        setStatus('failed');
        setMessage('Payment failed');
        toast.error('Payment failed');
        return;
      }

      // If status is successful or we have a transaction reference, verify with backend
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://backend-066c.onrender.com/api/v1';
        
        console.log('🔍 Verifying payment with backend:', transactionRef);
        
        const response = await axios.post(
          `${baseUrl}/payment/verify`,
          { tx_ref: transactionRef },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success && response.data.status === 'successful') {
          setStatus('success');
          setMessage('Payment verified successfully');
          setAmount(response.data.amount?.toString() || paymentAmount || '0');
          
          // Refresh wallet balance
          await refreshBalance();
          
          toast.success(`Payment successful! Wallet funded with ₦${response.data.amount || paymentAmount}`);
          
          // Auto redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard/wallet');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage(response.data.message || 'Payment verification failed');
          toast.error('Payment verification failed');
        }
      } catch (error: any) {
        console.error('❌ Payment verification error:', error);
        // If verification fails, still show success if Flutterwave says it's successful
        if (paymentStatus === 'successful') {
          setStatus('success');
          setMessage('Payment completed, verification pending');
          toast.success(`Payment successful! Wallet funded with ₦${paymentAmount}`);
          
          setTimeout(() => {
            router.push('/dashboard/wallet');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage('Failed to verify payment. Please contact support if amount was deducted.');
          toast.error('Payment verification failed');
        }
      }
    };

    handlePaymentReturn();
  }, [searchParams, refreshBalance, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'verifying' && (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                Verifying Payment
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Payment Successful
              </>
            )}
            {status === 'failed' && (
              <>
                <AlertCircle className="h-6 w-6 text-red-600" />
                Payment Failed
              </>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {status === 'verifying' && (
            <div>
              <p className="text-muted-foreground">
                Please wait while we verify your payment...
              </p>
              <div className="flex justify-center mt-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-semibold">
                  Wallet funded successfully with ₦{amount ? parseFloat(amount).toLocaleString() : '0'}
                </p>
                {amount && (
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    ₦{parseFloat(amount).toLocaleString()}
                  </p>
                )}
              </div>
              
              {txRef && (
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-xs text-gray-600 mb-1">Transaction Reference:</p>
                  <p className="font-mono text-sm break-all">{txRef}</p>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard in a few seconds...
              </p>
            </div>
          )}

          {status === 'failed' && (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800">{message}</p>
              </div>
              
              {txRef && (
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-xs text-gray-600 mb-1">Transaction Reference:</p>
                  <p className="font-mono text-sm break-all">{txRef}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/wallet/fund')}
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard/wallet')}
                  className="flex-1"
                >
                  Go to Wallet
                </Button>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/transactions')}
                className="flex-1"
              >
                View Transactions
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="flex-1"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
