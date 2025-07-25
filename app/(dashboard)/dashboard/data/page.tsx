"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProviderSelector } from "@/components/dashboard/provider-selector"
import { Loader2, CheckCircle2, Wifi, AlertCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserData } from "@/context/UserDataContext"
import { useWalletData } from "@/context/WalletDataContext"
import { usePurchaseData } from "@/hooks/vtu"
import { vtuApi } from "@/src/api/endpoints/vtu"
import type { DataProvider, DataPlan } from "@/src/api/types"

export default function DataPage() {
  const { profile } = useUserData()
  const { balance, recentTransactions } = useWalletData()
  const { mutate: purchaseData, loading, error: purchaseError, success, data: purchaseResult } = usePurchaseData()
  
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [providers, setProviders] = useState<DataProvider[]>([])
  const [dataPlans, setDataPlans] = useState<Record<string, DataPlan[]>>({})
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [formData, setFormData] = useState({
    phoneNumber: "",
    dataBundle: "",
    paymentMethod: "wallet",
  })

  // Load providers and plans on component mount
  useEffect(() => {
    loadProviders()
    loadDataPlans()
  }, [])

  const loadProviders = async () => {
    try {
      setLoadingProviders(true)
      const response = await vtuApi.getDataProviders()
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
            category: 'data',
            features: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            discountRate: 0.02
          },
          { 
            id: "airtel", 
            name: "Airtel", 
            slug: "airtel",
            logo: "/airtel.logo.jpg", 
            status: 'active',
            category: 'data',
            features: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            discountRate: 0.02
          },
          { 
            id: "glo", 
            name: "Glo", 
            slug: "glo",
            logo: "/glo.logo.jpg", 
            status: 'active',
            category: 'data',
            features: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            discountRate: 0.02
          },
          { 
            id: "9mobile", 
            name: "9mobile", 
            slug: "9mobile",
            logo: "/etisalate.logo.jpg", 
            status: 'active',
            category: 'data',
            features: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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

  const loadDataPlans = async () => {
    try {
      const response = await vtuApi.getAllDataPlans()
      if (response.success && response.data) {
        setDataPlans(response.data)
      } else {
        // Fallback to default plans if API fails
        setDataPlans({
          mtn: [
            { 
              id: "mtn-100mb", 
              providerId: "mtn",
              name: "100MB", 
              size: "100MB", 
              validity: "1 Day", 
              price: 100, 
              discountedPrice: 98,
              planCode: "MTN100MB",
              planType: 'sme',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            { 
              id: "mtn-1gb", 
              providerId: "mtn",
              name: "1GB", 
              size: "1GB", 
              validity: "30 Days", 
              price: 1000, 
              discountedPrice: 980,
              planCode: "MTN1GB",
              planType: 'sme',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          airtel: [
            { 
              id: "airtel-1gb", 
              providerId: "airtel",
              name: "1GB", 
              size: "1GB", 
              validity: "30 Days", 
              price: 1000, 
              discountedPrice: 980,
              planCode: "AIRTEL1GB",
              planType: 'sme',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          glo: [
            { 
              id: "glo-1gb", 
              providerId: "glo",
              name: "1GB", 
              size: "1GB", 
              validity: "30 Days", 
              price: 1000, 
              discountedPrice: 980,
              planCode: "GLO1GB",
              planType: 'sme',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          "9mobile": [
            { 
              id: "9mobile-1gb", 
              providerId: "9mobile",
              name: "1GB", 
              size: "1GB", 
              validity: "30 Days", 
              price: 1000, 
              discountedPrice: 980,
              planCode: "9MOBILE1GB",
              planType: 'sme',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
        })
      }
    } catch (error) {
      console.error('Failed to load data plans:', error)
    }
  }

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setFormData((prev) => ({ ...prev, dataBundle: "" }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleDataBundleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, dataBundle: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProvider || !formData.dataBundle) return

    // Use the data purchase hook with correct payload shape
    // Payload: {network, phone_number, plan_id, amount} (amount is plan price)
    await purchaseData({
      providerId: selectedProvider,
      planId: formData.dataBundle,
      phoneNumber: formData.phoneNumber,
    })
  }

  // Get the selected plan details
  const getSelectedPlanDetails = (): DataPlan | null => {
    if (!selectedProvider || !formData.dataBundle || !dataPlans[selectedProvider]) return null
    const plans = dataPlans[selectedProvider]
    return plans.find((plan) => plan.id === formData.dataBundle) || null
  }

  // Reset form after successful purchase
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSelectedProvider(null)
        setFormData({
          phoneNumber: "",
          dataBundle: "",
          paymentMethod: "wallet",
        })
      }, 3000)
    }
  }, [success])

  const selectedPlan = getSelectedPlanDetails()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Buy Data</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Data Bundle</CardTitle>
              <CardDescription>Buy data for any network in Nigeria</CardDescription>
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
                    You have successfully purchased {selectedPlan?.size} {selectedPlan?.validity} data for {formData.phoneNumber}.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Transaction Reference: {purchaseResult?.reference || 'Processing...'}
                  </p>
                  {purchaseResult?.status === 'pending' && (
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
                      {loadingProviders ? (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Skeleton className="h-16 w-full" />
                          <Skeleton className="h-16 w-full" />
                          <Skeleton className="h-16 w-full" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      ) : (
                        <ProviderSelector
                          providers={providers}
                          selectedProvider={selectedProvider}
                          onSelect={handleProviderSelect}
                        />
                      )}
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

                    {selectedProvider && (
                      <div>
                        <Label htmlFor="dataBundle">Select Data Bundle</Label>
                        {!dataPlans[selectedProvider] || dataPlans[selectedProvider].length === 0 ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Select onValueChange={handleDataBundleChange} value={formData.dataBundle}>
                            <SelectTrigger id="dataBundle">
                              <SelectValue placeholder="Select a data bundle" />
                            </SelectTrigger>
                            <SelectContent>
                              {dataPlans[selectedProvider]?.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  {plan.size} - {plan.validity} - ₦{plan.price.toLocaleString()}
                                </SelectItem>
                              )) || (
                                <SelectItem value="" disabled>
                                  No plans available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )}

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
                            Wallet Balance ({balance ? `₦${balance.balance.toLocaleString()}` : '₦0.00'})
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedProvider || !formData.dataBundle || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Buy Data"
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
              <CardDescription>Your recent data purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingProviders ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
              <div className="space-y-4">
                {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Wifi className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.provider || transaction.description}</div>
                        <div className="text-xs text-muted-foreground">{transaction.phoneNumber || transaction.recipient}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₦{transaction.amount?.toLocaleString() || transaction.amount}</div>
                      <div
                        className={`text-xs ${
                          transaction.status === "success" ? "text-green-600" : 
                          transaction.status === "pending" ? "text-orange-600" :
                          "text-red-600"
                        }`}
                      >
                        {transaction.status === "success" ? "Successful" : 
                         transaction.status === "pending" ? "Pending" : "Failed"}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent data transactions found
                  </div>
                )}
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
          <CardTitle>Popular Data Plans</CardTitle>
          <CardDescription>Quick select from popular data bundles</CardDescription>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {dataPlans.mtn?.map((plan) => (
                  <Button
                    key={plan.id}
                    variant="outline"
                    className="h-auto justify-between py-6"
                    onClick={() => {
                      setSelectedProvider("mtn")
                      setFormData((prev) => ({ ...prev, dataBundle: plan.id }))
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold">{plan.size}</span>
                      <span className="text-sm text-muted-foreground">{plan.validity}</span>
                    </div>
                    <span className="text-lg font-bold">₦{plan.price.toLocaleString()}</span>
                  </Button>
                )) || <div className="text-center py-8 text-muted-foreground">No MTN plans available</div>}
              </div>
            </TabsContent>
            <TabsContent value="airtel" className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {dataPlans.airtel?.map((plan) => (
                  <Button
                    key={plan.id}
                    variant="outline"
                    className="h-auto justify-between py-6"
                    onClick={() => {
                      setSelectedProvider("airtel")
                      setFormData((prev) => ({ ...prev, dataBundle: plan.id }))
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold">{plan.size}</span>
                      <span className="text-sm text-muted-foreground">{plan.validity}</span>
                    </div>
                    <span className="text-lg font-bold">₦{plan.price.toLocaleString()}</span>
                  </Button>
                )) || <div className="text-center py-8 text-muted-foreground">No Airtel plans available</div>}
              </div>
            </TabsContent>
            <TabsContent value="glo" className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {dataPlans.glo?.map((plan) => (
                  <Button
                    key={plan.id}
                    variant="outline"
                    className="h-auto justify-between py-6"
                    onClick={() => {
                      setSelectedProvider("glo")
                      setFormData((prev) => ({ ...prev, dataBundle: plan.id }))
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold">{plan.size}</span>
                      <span className="text-sm text-muted-foreground">{plan.validity}</span>
                    </div>
                    <span className="text-lg font-bold">₦{plan.price.toLocaleString()}</span>
                  </Button>
                )) || <div className="text-center py-8 text-muted-foreground">No Glo plans available</div>}
              </div>
            </TabsContent>
            <TabsContent value="9mobile" className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {dataPlans["9mobile"]?.map((plan) => (
                  <Button
                    key={plan.id}
                    variant="outline"
                    className="h-auto justify-between py-6"
                    onClick={() => {
                      setSelectedProvider("9mobile")
                      setFormData((prev) => ({ ...prev, dataBundle: plan.id }))
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold">{plan.size}</span>
                      <span className="text-sm text-muted-foreground">{plan.validity}</span>
                    </div>
                    <span className="text-lg font-bold">₦{plan.price.toLocaleString()}</span>
                  </Button>
                )) || <div className="text-center py-8 text-muted-foreground">No 9mobile plans available</div>}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
