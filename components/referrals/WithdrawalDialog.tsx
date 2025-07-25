"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * Interface for bank details
 */
interface BankDetails {
  /** Bank account number */
  accountNumber: string
  /** Bank code/identifier */
  bankCode: string
}

/**
 * Interface for withdrawal request data
 */
interface WithdrawalRequest {
  /** Amount to withdraw */
  amount: number
  /** Withdrawal method */
  method: 'wallet' | 'bank_transfer'
  /** Transaction PIN */
  pin: string
  /** Bank details (required for bank transfer) */
  bankDetails?: BankDetails
}

/**
 * Props for the WithdrawalDialog component
 */
interface WithdrawalDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Function to handle dialog open/close state */
  onOpenChange: (open: boolean) => void
  /** Available balance for withdrawal */
  availableBalance: number
  /** Function to handle withdrawal request submission */
  onSubmit: (request: WithdrawalRequest) => Promise<void>
  /** Whether the withdrawal request is being processed */
  isProcessing?: boolean
}

/**
 * A dialog component for handling withdrawal requests with form validation
 * 
 * @param props - The component props
 * @returns A dialog with withdrawal form
 * 
 * @example
 * ```tsx
 * <WithdrawalDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   availableBalance={1000}
 *   onSubmit={handleWithdrawal}
 *   isProcessing={false}
 * />
 * ```
 */
export function WithdrawalDialog({
  open,
  onOpenChange,
  availableBalance,
  onSubmit,
  isProcessing = false
}: WithdrawalDialogProps): React.ReactElement {
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState<'wallet' | 'bank_transfer'>('wallet')
  const [accountNumber, setAccountNumber] = useState("")
  const [bankCode, setBankCode] = useState("")
  const [pin, setPin] = useState("")

  /**
   * Handles form submission
   */
  const handleSubmit = async (): Promise<void> => {
    const withdrawalRequest: WithdrawalRequest = {
      amount: parseFloat(withdrawAmount),
      method: withdrawMethod,
      pin
    }

    if (withdrawMethod === 'bank_transfer') {
      withdrawalRequest.bankDetails = {
        accountNumber,
        bankCode
      }
    }

    try {
      await onSubmit(withdrawalRequest)
      // Reset form on success
      resetForm()
      onOpenChange(false)
    } catch (error) {
      // Error handling is managed by parent component
      console.error('Withdrawal request failed:', error)
    }
  }

  /**
   * Resets the form to initial state
   */
  const resetForm = (): void => {
    setWithdrawAmount('')
    setWithdrawMethod('wallet')
    setAccountNumber('')
    setBankCode('')
    setPin('')
  }

  /**
   * Checks if the form is valid for submission
   */
  const isFormValid = (): boolean => {
    const amount = parseFloat(withdrawAmount)
    const hasValidAmount = !isNaN(amount) && amount > 0 && amount <= availableBalance
    const hasPin = pin.length > 0
    const hasBankDetails = withdrawMethod === 'wallet' || (Boolean(accountNumber) && Boolean(bankCode))
    
    return hasValidAmount && hasPin && hasBankDetails
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Earnings</DialogTitle>
          <DialogDescription>
            Withdraw your referral earnings to your preferred method.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="withdrawAmount">Amount (₦)</Label>
            <Input 
              id="withdrawAmount"
              type="number" 
              placeholder="Enter amount to withdraw"
              value={withdrawAmount} 
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min="1"
              max={availableBalance}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available: ₦{availableBalance.toLocaleString()}
            </p>
          </div>
          
          <div>
            <Label>Withdrawal Method</Label>
            <RadioGroup
              className="mt-2 grid grid-cols-2 gap-4"
              value={withdrawMethod} 
              onValueChange={(value) => setWithdrawMethod(value as 'wallet' | 'bank_transfer')}
            >
              <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50">
                <RadioGroupItem value="wallet" id="walletMethod" />
                <Label htmlFor="walletMethod" className="cursor-pointer flex-1">
                  Wallet Credit
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50">
                <RadioGroupItem value="bank_transfer" id="bankMethod" />
                <Label htmlFor="bankMethod" className="cursor-pointer flex-1">
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {withdrawMethod === 'bank_transfer' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber" 
                  placeholder="Enter account number" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <select
                  id="bankName"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  required
                >
                  <option value="">Select your bank</option>
                  <option value="gtb">GTBank</option>
                  <option value="firstbank">First Bank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="access">Access Bank</option>
                  <option value="uba">UBA</option>
                  <option value="fidelity">Fidelity Bank</option>
                  <option value="union">Union Bank</option>
                  <option value="sterling">Sterling Bank</option>
                  <option value="fcmb">FCMB</option>
                  <option value="wema">Wema Bank</option>
                </select>
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="withdrawPin">Transaction PIN</Label>
            <Input 
              type="password" 
              id="withdrawPin" 
              placeholder="Enter your PIN" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={isProcessing || !isFormValid()}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              'Submit Withdrawal'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
