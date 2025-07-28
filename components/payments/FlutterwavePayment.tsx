"use client";

import { useState } from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useUserData } from "@/context/UserDataContext";
import { walletService } from "@/lib/services/walletService";
import { generateTxRef } from "@/lib/config/flutterwave";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FlutterwavePaymentProps {
  amount: number;
  disabled?: boolean;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export default function FlutterwavePayment({ amount, disabled, onSuccess, onError }: FlutterwavePaymentProps) {
  const { profile } = useUserData();
  const [isVerifying, setIsVerifying] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "";
  const txRef = generateTxRef();
  
  const config = {
    public_key: publicKey,
    tx_ref: txRef,
    amount: Number(amount),
    currency: "NGN",
    payment_options: "card,banktransfer,ussd,account,barter,mobilemoney,qr",
    customer: {
      email: profile?.email || "test@example.com",
      phone_number: profile?.phone || "",
      name: profile?.full_name || "User",
    },
    customizations: {
      title: "StarkTol VTU - Wallet Funding",
      description: "Fund your wallet securely",
      logo: "/logo.png",
    },
    meta: {
      source: "wallet_funding",
      platform: "web",
      user_id: profile?.id || "unknown"
    }
  };

  if (!publicKey) {
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4 text-center my-4">
        Flutterwave public key is missing. Please set <b>NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY</b> in your environment variables and restart the app.
      </div>
    );
  }

  if (amount < 100) {
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4 text-center my-4">
        Minimum funding amount is ₦100. Please enter a higher amount to proceed.
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-4 text-center my-4">
        Payment is currently disabled. Please check your account status or try again later.
      </div>
    );
  }

  const handlePaymentSuccess = async (response: any) => {
    setIsVerifying(true);
    
    try {
      // Verify payment with backend
      const verificationResult = await walletService.fundWallet({
        amount: amount,
        method: 'flutterwave',
        metadata: {
          email: profile?.email,
          name: profile?.full_name || "User",
          flwRef: response.flw_ref,
          txRef: response.tx_ref,
          transactionId: response.transaction_id,
          paymentType: response.payment_type,
        }
      });

      if (verificationResult.success) {
        onSuccess && onSuccess({
          ...response,
          verified: true,
          reference: response.tx_ref
        });
      } else {
        onError && onError({ 
          message: verificationResult.message || "Payment verification failed" 
        });
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      onError && onError({ 
        message: "Payment verification failed. Please contact support if amount was deducted." 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span className="text-blue-700">Verifying payment...</span>
      </div>
    );
  }

  return (
    <FlutterWaveButton
      {...config}
      text="Fund Wallet with Flutterwave"
      disabled={disabled || isVerifying}
      callback={async (response) => {
        closePaymentModal();
        if (response.status === "successful") {
          await handlePaymentSuccess(response);
        } else {
          onError && onError({ 
            message: "Payment was not successful or was cancelled." 
          });
        }
      }}
      onClose={() => {
        if (!isVerifying) {
          onError && onError({ message: "Payment modal closed by user." });
        }
      }}
    />
  );
}
