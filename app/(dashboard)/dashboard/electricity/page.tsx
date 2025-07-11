"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProviderSelector } from "@/components/dashboard/provider-selector"
import { Loader2, CheckCircle2, Zap, Receipt } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ElectricityPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    meterNumber: "",
    meterType: "",
    amount: "",
    phoneNumber: "",
    paymentMethod: "wallet",
  })
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
  })

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      provider: "EKEDC",
      meterNumber: "12345678901",
      amount: "₦10,000",
      date: "Today, 10:30 AM",
      status: "success",
      token: "1234-5678-9012-3456-7890",
    },
    {
      id: 2,
      provider: "IKEDC",
      meterNumber: "98765432109",
      amount: "₦5,000",
      date: "Yesterday, 3:15 PM",
      status: "success",
      token: "0987-6543-2109-8765-4321",
    },
    {
      id: 3,
      provider: "AEDC",
      meterNumber: "45678901234",
      amount: "₦7,500",
      date: "23/04/2023, 9:00 AM",
      status: "failed",
      token: "",
    },
    {
      id: 4,
      provider: "PHEDC",
      meterNumber: "56789012345",
      amount: "₦15,000",
      date: "20/04/2023, 11:45 AM",
      status: "success",
      token: "5678-9012-3456-7890-1234",
    },
  ]

  // Mock data for providers
  const providers = [
    { id: "ekedc", name: "EKEDC", logo: "/placeholder.svg?height=60&width=60" },
    { id: "ikedc", name: "IKEDC", logo: "/placeholder.svg?height=60&width=60" },
    { id: "aedc", name: "AEDC", logo: "/placeholder.svg?height=60&width=60" },
    { id: "phedc", name: "PHEDC", logo: "/placeholder.svg?height=60&width=60" },
    { id: "ibedc", name: "IBEDC", logo: "/placeholder.svg?height=60&width=60" },
    { id: "eedc", name: "EEDC", logo: "/placeholder.svg?height=60&width=60" },
  ]

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setIsVerified(false)
    setCustomerInfo({ name: "", address: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "meterNumber") {
      setIsVerified(false)
      setCustomerInfo({ name: "", address: "" })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "meterType") {
      setIsVerified(false)
      setCustomerInfo({ name: "", address: "" })
    }
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleVerify = () => {
    if (!selectedProvider || !formData.meterNumber || !formData.meterType) return

    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
      setCustomerInfo({
        name: "John Doe",
        address: "123 Example Street, Lagos, Nigeria",
      })
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate transaction processing
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setSelectedProvider(null)
        setIsVerified(false)
        setCustomerInfo({ name: "", address: "" })
        setFormData({
          meterNumber: "",
          meterType: "",
          amount: "",
          phoneNumber: "",
          paymentMethod: "wallet",
        })
      }, 5000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pay Electricity Bill</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Electricity Token</CardTitle>
              <CardDescription>Pay your electricity bill and get token instantly</CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">Transaction Successful!</h3>
                  <p className="mb-2 text-muted-foreground">
                    You have successfully purchased ₦{formData.amount} electricity token for meter{" "}
                    {formData.meterNumber}.
                  </p>
                  <div className="my-4 w-full max-w-md rounded-md bg-muted p-4">
                    <p className="mb-2 font-semibold">Your Token:</p>
                    <p className="text-xl font-mono font-bold tracking-wider">1234-5678-9012-3456-7890</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Transaction Reference: BVTU{Math.floor(Math.random() * 1000000000)}
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => window.print()}>
                    <Receipt className="mr-2 h-4 w-4" /> Print Receipt
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Select Electricity Provider</Label>
                      <ProviderSelector
                        providers={providers}
                        selectedProvider={selectedProvider}
                        onSelect={handleProviderSelect}
                      />
                    </div>

                    <div>
                      <Label htmlFor="meterType">Meter Type</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("meterType", value)}
                        value={formData.meterType}
                      >
                        <SelectTrigger id="meterType">
                          <SelectValue placeholder="Select meter type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prepaid">Prepaid</SelectItem>
                          <SelectItem value="postpaid">Postpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="meterNumber">Meter Number</Label>
                      <Input
                        id="meterNumber"
                        name="meterNumber"
                        placeholder="Enter your meter number"
                        required
                        value={formData.meterNumber}
                        onChange={handleChange}
                      />
                    </div>

                    {!isVerified && selectedProvider && formData.meterNumber && formData.meterType && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleVerify}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                          </>
                        ) : (
                          "Verify Meter"
                        )}
                      </Button>
                    )}

                    {isVerified && (
                      <div className="rounded-md border p-4">
                        <h3 className="mb-2 font-semibold">Customer Information</h3>
                        <p className="mb-1">
                          <span className="text-muted-foreground">Name:</span> {customerInfo.name}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Address:</span> {customerInfo.address}
                        </p>
                      </div>
                    )}

                    {isVerified && (
                      <>
                        <div>
                          <Label htmlFor="amount">Amount (₦)</Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            placeholder="Enter amount"
                            required
                            min="500"
                            max="50000"
                            value={formData.amount}
                            onChange={handleChange}
                          />
                        </div>

                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Enter phone number to receive token"
                            required
                            value={formData.phoneNumber}
                            onChange={handleChange}
                          />
                        </div>

                        <div>
                          <Label>Payment Method</Label>
                          <RadioGroup
                            value={formData.paymentMethod}
                            onValueChange={handlePaymentMethodChange}
                            className="mt-2 flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                              <RadioGroupItem value="wallet" id="wallet" />
                              <Label htmlFor="wallet" className="flex-1 cursor-pointer font-normal">
                                Wallet Balance (₦125,000.00)
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={!isVerified || !formData.amount || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Buy Electricity Token"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent electricity purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.provider}</div>
                        <div className="text-xs text-muted-foreground">{transaction.meterNumber}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{transaction.amount}</div>
                      <div
                        className={`text-xs ${transaction.status === "success" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.status === "success" ? "Successful" : "Failed"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Electricity Payment Guide</CardTitle>
          <CardDescription>How to pay your electricity bill on Babs VTU</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="mb-2 font-semibold">Select Provider</h3>
              <p className="text-sm text-muted-foreground">
                Choose your electricity distribution company from the list of available providers.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="mb-2 font-semibold">Enter Meter Details</h3>
              <p className="text-sm text-muted-foreground">
                Input your meter number and select the meter type (prepaid or postpaid).
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="mb-2 font-semibold">Make Payment</h3>
              <p className="text-sm text-muted-foreground">
                Enter the amount you want to pay and complete the transaction to receive your token instantly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
