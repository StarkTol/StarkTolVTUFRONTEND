"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CreditCard, Smartphone, Building, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWalletContext } from "@/context/WalletContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { paymentService } from "@/lib/services"
import { DevModeIndicator } from "@/components/ui/dev-mode-indicator"
import { DevAuthButton } from "@/components/ui/dev-auth-button"
import { DevQuickActions } from "@/components/ui/dev-quick-actions"

export default function WalletFundPage() {
  const router = useRouter()
  const { balance } = useWalletContext()
  
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle proceed to payment
  const handleProceedToPayment = async () => {
    if (!amount || parseFloat(amount) < 100) {
      setError('Please enter a valid amount (minimum ₦100)')
      return
    }

    setIsProcessing(true)
    setError(null)
    
    // Show toast notification
    toast.loading('Redirecting to Flutterwave...')

    try {
      console.log('💰 Payment amount:', amount);
      
      // Use the paymentService to initiate payment
      const response = await paymentService.initiate({
        amount: parseFloat(amount)
      })
      
      if (response.success && response.data?.paymentLink) {
        console.log('🚀 Redirecting to payment link:', response.data.paymentLink)
        
        // Redirect to Flutterwave payment page immediately
        window.location.href = response.data.paymentLink
      } else {
        throw new Error(response.message || 'Failed to create payment link')
      }
    } catch (err: any) {
      console.error('❌ Payment initiation failed:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to initiate payment'
      setError(errorMessage)
      toast.dismiss()
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fund Wallet</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/wallet")}> 
          Back to Wallet
        </Button>
      </div>

      {/* Current Balance Display */}
      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Current Wallet Balance</p>
            <p className="text-3xl font-bold text-primary">{balance.formatted}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Fund Your Wallet</CardTitle>
          <CardDescription>Add money to your wallet using Flutterwave</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Development Mode Indicator */}
            <DevModeIndicator />
            
            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (minimum ₦100)"
                  required
                  min="100"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setError(null) // Clear error when user types
                  }}
                  disabled={isProcessing}
                />
                {amount && parseFloat(amount) < 100 && (
                  <p className="text-xs text-red-500 mt-1">
                    Minimum amount is ₦100
                  </p>
                )}
              </div>

              {/* Payment Methods Info */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Pay with Flutterwave</h3>
                  <p className="text-sm text-blue-700">
                    You'll be redirected to Flutterwave where you can choose from multiple payment options.
                  </p>
                </div>
                
                {/* Payment Methods Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-white p-2 rounded border">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium">Cards</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded border">
                    <Building className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium">Bank Transfer</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded border">
                    <Smartphone className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium">USSD</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded border">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-medium">Mobile Money</span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600 mb-1">✅ All payment methods available on Flutterwave:</p>
                  <p className="text-xs text-gray-500">
                    💳 Cards • 🏦 Bank Transfer • 📱 USSD • 🏧 Bank Account • 📱 Mobile Money
                  </p>
                </div>
              </div>

              {/* Proceed to Payment Button */}
              <Button 
                onClick={handleProceedToPayment}
                disabled={!amount || parseFloat(amount) < 100 || isProcessing}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    {amount && parseFloat(amount) >= 100 && (
                      <span className="ml-2">₦{parseFloat(amount).toLocaleString()}</span>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Minimum funding amount is ₦100</p>
            <p>• You'll be redirected to Flutterwave secure payment page</p>
            <p>• Choose from Cards, Bank Transfer, USSD, Mobile Money, etc.</p>
            <p>• Your wallet will be updated automatically after payment</p>
          </div>
        </CardFooter>
      </Card>
      
      {/* Development Quick Actions */}
      <div className="mx-auto max-w-2xl">
        <DevQuickActions onAmountSelect={(selectedAmount) => setAmount(selectedAmount.toString())} />
      </div>
      
      {/* Development Authentication Button */}
      <DevAuthButton />
    </div>
  );
}
