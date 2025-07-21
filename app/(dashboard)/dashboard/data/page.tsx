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
import { dataService, type DataProvider, type DataBundle } from "@/lib/services/dataService"
import { useUserData } from "@/context/UserDataContext"

export default function DataPage() {
  const { profile, refreshUserData } = useUserData()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string>('')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [providers, setProviders] = useState<DataProvider[]>([])
  const [dataBundles, setDataBundles] = useState<Record<string, DataBundle[]>>({})
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [transactionResult, setTransactionResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    phoneNumber: "",
    dataBundle: "",
    paymentMethod: "wallet",
  })

  // Load providers, bundles and recent transactions on component mount
  useEffect(() => {
    loadProviders()
    loadAllDataBundles()
    loadRecentTransactions()
  }, [])

  const loadProviders = async () => {
    try {
      const providersData = await dataService.getProviders()
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
    }
  }

  const loadAllDataBundles = async () => {
    try {
      setLoadingData(true)
      const bundlesData = await dataService.getAllDataBundles()
      setDataBundles(bundlesData)
    } catch (error) {
      console.error('Failed to load data bundles:', error)
      // Fallback to default bundles if API fails
      setDataBundles({
        mtn: [
          { id: "mtn-100mb", name: "100MB", size: "100MB", validity: "1 Day", price: 100, provider: "mtn" },
          { id: "mtn-1gb", name: "1GB", size: "1GB", validity: "30 Days", price: 1000, provider: "mtn" },
          { id: "mtn-2gb", name: "2GB", size: "2GB", validity: "30 Days", price: 2000, provider: "mtn" },
          { id: "mtn-5gb", name: "5GB", size: "5GB", validity: "30 Days", price: 3500, provider: "mtn" },
        ],
        airtel: [
          { id: "airtel-100mb", name: "100MB", size: "100MB", validity: "1 Day", price: 100, provider: "airtel" },
          { id: "airtel-1gb", name: "1GB", size: "1GB", validity: "30 Days", price: 1000, provider: "airtel" },
          { id: "airtel-2gb", name: "2GB", size: "2GB", validity: "30 Days", price: 2000, provider: "airtel" },
          { id: "airtel-5gb", name: "5GB", size: "5GB", validity: "30 Days", price: 3500, provider: "airtel" },
        ],
        glo: [
          { id: "glo-100mb", name: "100MB", size: "100MB", validity: "1 Day", price: 100, provider: "glo" },
          { id: "glo-1gb", name: "1GB", size: "1GB", validity: "30 Days", price: 1000, provider: "glo" },
          { id: "glo-2gb", name: "2GB", size: "2GB", validity: "30 Days", price: 2000, provider: "glo" },
          { id: "glo-5gb", name: "5GB", size: "5GB", validity: "30 Days", price: 3500, provider: "glo" },
        ],
        "9mobile": [
          { id: "9mobile-100mb", name: "100MB", size: "100MB", validity: "1 Day", price: 100, provider: "9mobile" },
          { id: "9mobile-1gb", name: "1GB", size: "1GB", validity: "30 Days", price: 1000, provider: "9mobile" },
          { id: "9mobile-2gb", name: "2GB", size: "2GB", validity: "30 Days", price: 2000, provider: "9mobile" },
          { id: "9mobile-5gb", name: "5GB", size: "5GB", validity: "30 Days", price: 3500, provider: "9mobile" },
        ],
      })
    } finally {
      setLoadingData(false)
    }
  }

  const loadRecentTransactions = async () => {
    try {
      const transactions = await dataService.getRecentTransactions(5)
      setRecentTransactions(transactions)
    } catch (error) {
      console.error('Failed to load recent transactions:', error)
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

    setIsLoading(true)
    setError('')

    try {
      const result = await dataService.purchaseDataBundle({
        provider: selectedProvider,
        phoneNumber: formData.phoneNumber,
        bundleId: formData.dataBundle,
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
            dataBundle: "",
            paymentMethod: "wallet",
          })
        }, 5000)
      } else {
        setError(result.message)
      }
    } catch (error: any) {
      console.error('Data purchase failed:', error)
      setError('Failed to purchase data bundle. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Get the selected bundle details
  const getSelectedBundleDetails = (): DataBundle | null => {
    if (!selectedProvider || !formData.dataBundle || !dataBundles[selectedProvider]) return null
    const bundles = dataBundles[selectedProvider]
    return bundles.find((bundle) => bundle.id === formData.dataBundle) || null
  }

  const selectedBundle = getSelectedBundleDetails()

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
                    You have successfully purchased {selectedBundle?.size} {selectedBundle?.validity} data for {formData.phoneNumber}.
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

                    {selectedProvider && (
                      <div>
                        <Label htmlFor="dataBundle">Select Data Bundle</Label>
                        <Select onValueChange={handleDataBundleChange} value={formData.dataBundle}>
                          <SelectTrigger id="dataBundle">
                            <SelectValue placeholder="Select a data bundle" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataBundles[selectedProvider]?.map((bundle) => (
                              <SelectItem key={bundle.id} value={bundle.id}>
                                {bundle.size} - {bundle.validity} - ₦{bundle.price.toLocaleString()}
                              </SelectItem>
                            )) || (
                              <SelectItem value="" disabled>
                                No bundles available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
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
                            Wallet Balance ({profile ? `₦${profile.wallet_balance.toLocaleString()}` : '₦0.00'})
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedProvider || !formData.dataBundle || isLoading}
                  >
                    {isLoading ? (
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
              {loadingData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading recent transactions...</span>
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
                {dataBundles.mtn?.map((bundle) => (
                  <Button
                    key={bundle.id}
                    variant="outline"
                    className="h-auto justify-between py-6"
                    onClick={() => {
                      setSelectedProvider("mtn")
                      setFormData((prev) => ({ ...prev, dataBundle: bundle.id }))
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold">{bundle.size}</span>
                      <span className="text-sm text-muted-foreground">{bundle.validity}</span>
                    </div>
                    <span className="text-lg font-bold">₦{bundle.price.toLocaleString()}</span>
                  </Button>
                )) || <div className="text-center py-8 text-muted-foreground">No MTN bundles available</div>}
              </div>
            </TabsContent>
            <TabsContent value="airtel" className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {dataBundles.airtel?.map((bundle) => (
                  <Button
                    key={bundle.id}
                    variant="outline"
                    className="h-auto justify-between py-6"
                    onClick={() => {
                      setSelectedProvider("airtel")
                      setFormData((prev) => ({ ...prev, dataBundle: bundle.id }))
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold">{bundle.size}</span>
                      <span className="text-sm text-muted-foreground">{bundle.validity}</span>
                    </div>
                    <span className="text-lg font-bold">₦{bundle.price.toLocaleString()}</span>
                  </Button>
                )) || <div className="text-center py-8 text-muted-foreground">No Airtel bundles available</div>}
              </div>
            </TabsContent>
            <TabsContent value="glo" className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {dataBundles.glo?.map((bundle) => (
                  <Button
                    key={bundle.id}
                    variant="outline"
                    className="h-auto justify-between py-6"
                    onClick={() => {
                      setSelectedProvider("glo")
                      setFormData((prev) => ({ ...prev, dataBundle: bundle.id }))
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold">{bundle.size}</span>
                      <span className="text-sm text-muted-foreground">{bundle.validity}</span>
                    </div>
                    <span className="text-lg font-bold">₦{bundle.price.toLocaleString()}</span>
                  </Button>
                )) || <div className="text-center py-8 text-muted-foreground">No Glo bundles available</div>}
              </div>
            </TabsContent>
            <TabsContent value="9mobile" className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {dataBundles["9mobile"]?.map((bundle) => (
                  <Button
                    key={bundle.id}
                    variant="outline"
                    className="h-auto justify-between py-6"
                    onClick={() => {
                      setSelectedProvider("9mobile")
                      setFormData((prev) => ({ ...prev, dataBundle: bundle.id }))
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-bold">{bundle.size}</span>
                      <span className="text-sm text-muted-foreground">{bundle.validity}</span>
                    </div>
                    <span className="text-lg font-bold">₦{bundle.price.toLocaleString()}</span>
                  </Button>
                )) || <div className="text-center py-8 text-muted-foreground">No 9mobile bundles available</div>}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
