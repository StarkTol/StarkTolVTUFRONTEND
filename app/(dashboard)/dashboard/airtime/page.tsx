"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProviderSelector } from "@/components/dashboard/provider-selector"
import { Loader2, CheckCircle2, Phone, AlertCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { airtimeService, type Provider, type RecentTransaction } from "@/lib/services/airtimeService"
import { useUserData } from "@/context/UserDataContext"

export default function AirtimePage() {
  const { profile, refreshUserData } = useUserData()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string>('')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [transactionResult, setTransactionResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    phoneNumber: "",
    amount: "",
    paymentMethod: "wallet",
  })

  // Load providers and recent transactions on component mount
  useEffect(() => {
    loadProviders()
    loadRecentTransactions()
  }, [])

  const loadProviders = async () => {
    try {
      setLoadingProviders(true)
      const providersData = await airtimeService.getProviders()
      setProviders(providersData)
    } catch (error) {
      console.error('Failed to load providers:', error)
      // Fallback to default providers if API fails
      setProviders([
        { id: "mtn", name: "MTN", logo: "/mtn.logo.jpg?height=60&width=60", status: 'active' },
        { id: "airtel", name: "Airtel", logo: "/airtel.logo.jpg?height=60&width=60", status: 'active' },
        { id: "glo", name: "Glo", logo: "/glo.logo.jpg?height=60&width=60", status: 'active' },
        { id: "9mobile", name: "9mobile", logo: "/etisalate.logo.jpg?height=60&width=60", status: 'active' },
      ])
    } finally {
      setLoadingProviders(false)
    }
  }

  const loadRecentTransactions = async () => {
    try {
      const transactions = await airtimeService.getRecentTransactions(5)
      setRecentTransactions(transactions)
    } catch (error) {
      console.error('Failed to load recent transactions:', error)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProvider) return

    setIsLoading(true)
    setError('')

    try {
      const result = await airtimeService.purchaseAirtime({
        provider: selectedProvider,
        phoneNumber: formData.phoneNumber,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod as 'wallet' | 'card'
      })

      if (result.success) {
        setTransactionResult(result.data)
        setIsSuccess(true)
        
        // Refresh user data to update wallet balance
        await refreshUserData()
        
        // Reload recent transactions
        await loadRecentTransactions()

        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSuccess(false)
          setTransactionResult(null)
          setSelectedProvider(null)
          setFormData({
            phoneNumber: "",
            amount: "",
            paymentMethod: "wallet",
          })
        }, 5000)
      } else {
        setError(result.message)
      }
    } catch (error: any) {
      console.error('Airtime purchase failed:', error)
      setError('Failed to purchase airtime. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
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
                    Transaction Reference: {transactionResult?.reference || `BVTU${Math.floor(Math.random() * 1000000000)}`}
                  </p>
                  {transactionResult?.status === 'pending' && (
                    <p className="mt-2 text-sm text-orange-600">
                      Transaction is being processed. You'll receive a confirmation shortly.
                    </p>
                  )}
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
                            Wallet Balance ({profile ? `₦${profile.wallet_balance.toLocaleString()}` : '₦0.00'})
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
              {loadingProviders ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading recent transactions...</span>
                </div>
              ) : (
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
              )}
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
