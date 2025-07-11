"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProviderSelector } from "@/components/dashboard/provider-selector"
import { Loader2, CheckCircle2, Phone } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AirtimePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    phoneNumber: "",
    amount: "",
    paymentMethod: "wallet",
  })

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      provider: "MTN",
      phoneNumber: "08012345678",
      amount: "₦1,000",
      date: "Today, 10:30 AM",
      status: "success",
    },
    {
      id: 2,
      provider: "Airtel",
      phoneNumber: "09087654321",
      amount: "₦500",
      date: "Yesterday, 3:15 PM",
      status: "success",
    },
    {
      id: 3,
      provider: "Glo",
      phoneNumber: "08034567890",
      amount: "₦200",
      date: "23/04/2023, 9:00 AM",
      status: "failed",
    },
    {
      id: 4,
      provider: "9mobile",
      phoneNumber: "09076543210",
      amount: "₦1,500",
      date: "20/04/2023, 11:45 AM",
      status: "success",
    },
  ]

  // Mock data for providers
  const providers = [
    { id: "mtn", name: "MTN", logo: "/placeholder.svg?height=60&width=60" },
    { id: "airtel", name: "Airtel", logo: "/placeholder.svg?height=60&width=60" },
    { id: "glo", name: "Glo", logo: "/placeholder.svg?height=60&width=60" },
    { id: "9mobile", name: "9mobile", logo: "/placeholder.svg?height=60&width=60" },
  ]

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate transaction processing
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setSelectedProvider(null)
        setFormData({
          phoneNumber: "",
          amount: "",
          paymentMethod: "wallet",
        })
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Buy Airtime</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Airtime</CardTitle>
              <CardDescription>Buy airtime for any network in Nigeria</CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">Transaction Successful!</h3>
                  <p className="mb-2 text-muted-foreground">
                    You have successfully purchased ₦{formData.amount} airtime for {formData.phoneNumber}.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Transaction Reference: BVTU{Math.floor(Math.random() * 1000000000)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Select Network Provider</Label>
                      <ProviderSelector
                        providers={providers}
                        selectedProvider={selectedProvider}
                        onSelect={handleProviderSelect}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter recipient's phone number"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="amount">Amount (₦)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="Enter amount"
                        required
                        min="50"
                        max="50000"
                        value={formData.amount}
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
                  </div>

                  <Button type="submit" className="w-full" disabled={!selectedProvider || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Buy Airtime"
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
              <CardDescription>Your recent airtime purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.provider}</div>
                        <div className="text-xs text-muted-foreground">{transaction.phoneNumber}</div>
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
          <CardTitle>Airtime Bundles</CardTitle>
          <CardDescription>Quick select from common airtime amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mtn">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="mtn">MTN</TabsTrigger>
              <TabsTrigger value="airtel">Airtel</TabsTrigger>
              <TabsTrigger value="glo">Glo</TabsTrigger>
              <TabsTrigger value="9mobile">9mobile</TabsTrigger>
            </TabsList>
            <TabsContent value="mtn" className="mt-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[100, 200, 500, 1000, 2000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="h-auto py-6"
                    onClick={() => {
                      setSelectedProvider("mtn")
                      setFormData((prev) => ({ ...prev, amount: amount.toString() }))
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">₦{amount}</span>
                      <span className="text-xs text-muted-foreground">MTN Airtime</span>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="airtel" className="mt-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[100, 200, 500, 1000, 2000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="h-auto py-6"
                    onClick={() => {
                      setSelectedProvider("airtel")
                      setFormData((prev) => ({ ...prev, amount: amount.toString() }))
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">₦{amount}</span>
                      <span className="text-xs text-muted-foreground">Airtel Airtime</span>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="glo" className="mt-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[100, 200, 500, 1000, 2000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="h-auto py-6"
                    onClick={() => {
                      setSelectedProvider("glo")
                      setFormData((prev) => ({ ...prev, amount: amount.toString() }))
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">₦{amount}</span>
                      <span className="text-xs text-muted-foreground">Glo Airtime</span>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="9mobile" className="mt-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[100, 200, 500, 1000, 2000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="h-auto py-6"
                    onClick={() => {
                      setSelectedProvider("9mobile")
                      setFormData((prev) => ({ ...prev, amount: amount.toString() }))
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">₦{amount}</span>
                      <span className="text-xs text-muted-foreground">9mobile Airtime</span>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
