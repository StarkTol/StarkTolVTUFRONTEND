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
import { Skeleton } from "@/components/ui/skeleton"
import { useUserData } from "@/context/UserDataContext"
import { useWalletData } from "@/context/WalletDataContext"
import { usePurchaseAirtime } from "@/hooks/vtu"
import { useTransactions } from "@/hooks/useTransactions"
import { vtuApi } from "@/src/api/endpoints/vtu"
import type { AirtimeProvider, AirtimePurchaseRequest } from "@/src/api/types"

export default function AirtimePage() {
  const { profile } = useUserData()
  const { balance } = useWalletData()
  const { mutate: purchaseAirtime, loading, error: purchaseError, success, data: purchaseData } = usePurchaseAirtime()
  const { data: recentTransactions, loading: transactionsLoading, error: transactionsError } = useTransactions('airtime')
  
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [providers, setProviders] = useState<AirtimeProvider[]>([])
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [formData, setFormData] = useState({
    phoneNumber: "",
    amount: "",
  })

  // Load providers on component mount
  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    try {
      setLoadingProviders(true)
      const response = await vtuApi.getAirtimeProviders()
      if (response.success && response.data) {
        setProviders(response.data)
      } else {
        // Fallback to default providers if API fails
        setProviders([
          { 
            id: "mtn", 
            name: "MTN", 
            slug: "mtn",
            logo: "/mtn.logo.jpg", 
            status: 'active',
            category: 'airtime',
            features: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            supportedAmounts: [100, 200, 500, 1000, 2000, 5000],
            discountRate: 0.02
          },
          { 
            id: "airtel", 
            name: "Airtel", 
            slug: "airtel",
            logo: "/airtel.logo.jpg", 
            status: 'active',
            category: 'airtime',
            features: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            supportedAmounts: [100, 200, 500, 1000, 2000, 5000],
            discountRate: 0.02
          },
          { 
            id: "glo", 
            name: "Glo", 
            slug: "glo",
            logo: "/glo.logo.jpg", 
            status: 'active',
            category: 'airtime',
            features: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            supportedAmounts: [100, 200, 500, 1000, 2000, 5000],
            discountRate: 0.02
          },
          { 
            id: "9mobile", 
            name: "9mobile", 
            slug: "9mobile",
            logo: "/etisalate.logo.jpg", 
            status: 'active',
            category: 'airtime',
            features: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            supportedAmounts: [100, 200, 500, 1000, 2000, 5000],
            discountRate: 0.02
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load providers:', error)
    } finally {
      setLoadingProviders(false)
    }
  }

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProvider) return

    await purchaseAirtime({
      providerId: selectedProvider,
      phoneNumber: formData.phoneNumber,
      amount: Number(formData.amount),
    })
  }

  // Reset form after successful purchase
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSelectedProvider(null)
        setFormData({
          phoneNumber: "",
          amount: "",
        })
      }, 3000)
    }
  }, [success])

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
              {purchaseError && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{purchaseError}</span>
                </div>
              )}
              
              {success ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">Transaction Successful!</h3>
                  <p className="mb-2 text-muted-foreground">
                    You have successfully purchased ₦{formData.amount} airtime for {formData.phoneNumber}.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Transaction Reference: {purchaseData?.reference || 'Processing...'}
                  </p>
                  {purchaseData?.status === 'pending' && (
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
                      <div className="mt-2 flex flex-col space-y-1">
                        <div className="flex items-center space-x-2 rounded-md border p-3">
                          <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <Label className="flex-1 cursor-pointer font-normal">
                            Wallet Balance ({balance ? `₦${balance.balance.toLocaleString()}` : '₦0.00'})
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={!selectedProvider || loading}>
                    {loading ? (
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
              {transactionsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : transactionsError ? (
                <div className="text-center py-8 text-red-600">
                  Failed to load transactions: {transactionsError}
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No airtime transactions found
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
                          <div className="font-medium">{transaction.providerName || 'Airtime'}</div>
                          <div className="text-xs text-muted-foreground">{transaction.recipient || transaction.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₦{transaction.amount.toLocaleString()}</div>
                        <div
                          className={`text-xs ${
                            transaction.status === "completed" 
                              ? "text-green-600" 
                              : transaction.status === "failed"
                              ? "text-red-600" 
                              : "text-yellow-600"
                          }`}
                        >
                          {transaction.status === "completed" 
                            ? "Successful" 
                            : transaction.status === "failed"
                            ? "Failed" 
                            : "Pending"
                          }
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
