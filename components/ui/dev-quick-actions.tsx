"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, DollarSign, CreditCard, Check } from "lucide-react"
import { toast } from "sonner"

interface DevQuickActionsProps {
  onAmountSelect?: (amount: number) => void
}

export function DevQuickActions({ onAmountSelect }: DevQuickActionsProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000]

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount)
    onAmountSelect?.(amount)
    toast.success(`Amount set to ₦${amount.toLocaleString()}`)
  }

  const handleMockPayment = () => {
    if (!selectedAmount) {
      toast.error("Please select an amount first")
      return
    }

    toast.loading("Simulating payment process...")
    
    setTimeout(() => {
      toast.dismiss()
      toast.success("Mock payment completed! (Development mode)")
      
      // In a real scenario, this would trigger wallet balance update
      localStorage.setItem('mock-payment-completed', JSON.stringify({
        amount: selectedAmount,
        timestamp: Date.now(),
        reference: `DEV_${Date.now()}`
      }))
    }, 2000)
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800">Development Quick Actions</CardTitle>
        </div>
        <CardDescription className="text-amber-700">
          Quick tools for testing payment functionality in development mode
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2 text-amber-800">Quick Amount Selection:</p>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() => handleAmountClick(amount)}
                className="text-xs"
              >
                {selectedAmount === amount && <Check className="h-3 w-3 mr-1" />}
                ₦{amount.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>

        {selectedAmount && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Selected: ₦{selectedAmount.toLocaleString()}
              </span>
            </div>
            
            <Button
              onClick={handleMockPayment}
              variant="default"
              size="sm"
              className="w-full"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Simulate Payment Success
            </Button>
          </div>
        )}

        <div className="pt-2 border-t border-amber-200">
          <p className="text-xs text-amber-600">
            💡 These actions only work in development mode and simulate successful payments without real transactions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
