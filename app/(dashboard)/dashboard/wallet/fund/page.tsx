"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building, CreditCard, Smartphone, Copy, CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WalletFundPage() {
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fundMethod, setFundMethod] = useState("bank")
  const [fundAmount, setFundAmount] = useState("")

  // Mock wallet data
  const walletData = {
    balance: "₦125,000.00",
    accountNumber: "1234567890",
    accountName: "John Doe",
    bankName: "Babs VTU Bank",
  }

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(walletData.accountNumber)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleFundWallet = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      // Reset after 3 seconds and redirect
      setTimeout(() => {
        setIsSuccess(false)
        setFundAmount("")
        router.push("/dashboard/wallet")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fund Wallet</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/wallet")}>
          Back to Wallet
        </Button>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Fund Your Wallet</CardTitle>
          <CardDescription>Add money to your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">Wallet Funded!</h3>
              <p className="mb-2 text-muted-foreground">Your wallet has been successfully funded with ₦{fundAmount}.</p>
              <p className="text-sm text-muted-foreground">
                Transaction Reference: BVTU{Math.floor(Math.random() * 1000000000)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleFundWallet} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Select Funding Method</Label>
                  <RadioGroup
                    value={fundMethod}
                    onValueChange={setFundMethod}
                    className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3"
                  >
                    <div className="flex flex-col items-center rounded-md border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="bank" id="bank" className="sr-only" />
                      <Label htmlFor="bank" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Building className="h-8 w-8 text-primary" />
                          <span className="font-medium">Bank Transfer</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex flex-col items-center rounded-md border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="card" id="card" className="sr-only" />
                      <Label htmlFor="card" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <CreditCard className="h-8 w-8 text-primary" />
                          <span className="font-medium">Card Payment</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex flex-col items-center rounded-md border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="ussd" id="ussd" className="sr-only" />
                      <Label htmlFor="ussd" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Smartphone className="h-8 w-8 text-primary" />
                          <span className="font-medium">USSD</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    required
                    min="100"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                  />
                </div>

                {fundMethod === "bank" && (
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 font-semibold">Bank Transfer Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Account Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{walletData.accountNumber}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyAccountNumber}>
                            {isCopied ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            <span className="sr-only">Copy account number</span>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Account Name</span>
                        <span className="font-medium">{walletData.accountName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Bank Name</span>
                        <span className="font-medium">{walletData.bankName}</span>
                      </div>
                    </div>
                  </div>
                )}

                {fundMethod === "card" && (
                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required maxLength={3} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                  </div>
                )}

                {fundMethod === "ussd" && (
                  <div className="space-y-4 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      After clicking the button below, you will receive a USSD code to dial on your phone to complete
                      the transaction.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input id="phoneNumber" placeholder="Enter your phone number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Select Bank</Label>
                      <select
                        id="bankName"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select your bank</option>
                        <option value="gtb">GTBank</option>
                        <option value="firstbank">First Bank</option>
                        <option value="zenith">Zenith Bank</option>
                        <option value="access">Access Bank</option>
                        <option value="uba">UBA</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!fundAmount || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  "Fund Wallet"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>• Minimum funding amount is ₦100</p>
            <p>• Bank transfers may take up to 5 minutes to reflect in your wallet</p>
            <p>• Card payments are processed instantly</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
