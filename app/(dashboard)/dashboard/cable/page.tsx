"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProviderSelector } from "@/components/dashboard/provider-selector"
import { Loader2, CheckCircle2, Tv } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CablePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    smartCardNumber: "",
    package: "",
    phoneNumber: "",
    paymentMethod: "wallet",
  })
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    currentPackage: "",
  })

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      provider: "DSTV",
      smartCardNumber: "12345678901",
      package: "DSTV Premium",
      amount: "₦24,500",
      date: "Today, 10:30 AM",
      status: "success",
    },
    {
      id: 2,
      provider: "GOTV",
      smartCardNumber: "98765432109",
      package: "GOTV Max",
      amount: "₦4,850",
      date: "Yesterday, 3:15 PM",
      status: "success",
    },
    {
      id: 3,
      provider: "Startimes",
      smartCardNumber: "45678901234",
      package: "Startimes Super",
      amount: "₦4,900",
      date: "23/04/2023, 9:00 AM",
      status: "failed",
    },
    {
      id: 4,
      provider: "DSTV",
      smartCardNumber: "56789012345",
      package: "DSTV Compact Plus",
      amount: "₦18,600",
      date: "20/04/2023, 11:45 AM",
      status: "success",
    },
  ]

  // Mock data for providers
  const providers = [
    { id: "dstv", name: "DSTV", logo: "/dstv.logo.jpg?height=60&width=60" },
    { id: "gotv", name: "GOTV", logo: "/gotv.logo.jpg?height=60&width=60" },
    { id: "startimes", name: "Startimes", logo: "/startime.logo.jpg?height=60&width=60" },
    { id: "showmax", name: "Showmax", logo: "/Showmax.jpg?height=60&width=60" },
  ]

  // Mock data for packages
  const packages = {
    dstv: [
      { id: "dstv-premium", name: "DSTV Premium", price: "₦24,500" },
      { id: "dstv-compact-plus", name: "DSTV Compact Plus", price: "₦18,600" },
      { id: "dstv-compact", name: "DSTV Compact", price: "₦10,500" },
      { id: "dstv-confam", name: "DSTV Confam", price: "₦7,100" },
      { id: "dstv-yanga", name: "DSTV Yanga", price: "₦4,200" },
    ],
    gotv: [
      { id: "gotv-max", name: "GOTV Max", price: "₦4,850" },
      { id: "gotv-jolli", name: "GOTV Jolli", price: "₦3,950" },
      { id: "gotv-jinja", name: "GOTV Jinja", price: "₦2,250" },
      { id: "gotv-smallie", name: "GOTV Smallie", price: "₦1,100" },
    ],
    startimes: [
      { id: "startimes-super", name: "Startimes Super", price: "₦4,900" },
      { id: "startimes-classic", name: "Startimes Classic", price: "₦2,800" },
      { id: "startimes-basic", name: "Startimes Basic", price: "₦1,850" },
      { id: "startimes-nova", name: "Startimes Nova", price: "₦1,200" },
    ],
    showmax: [
      { id: "showmax-premium", name: "Showmax Premium", price: "₦5,500" },
      { id: "showmax-standard", name: "Showmax Standard", price: "₦3,200" },
      { id: "showmax-mobile", name: "Showmax Mobile", price: "₦1,500" },
    ],
  }

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setIsVerified(false)
    setCustomerInfo({ name: "", currentPackage: "" })
    setFormData((prev) => ({ ...prev, package: "" }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "smartCardNumber") {
      setIsVerified(false)
      setCustomerInfo({ name: "", currentPackage: "" })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleVerify = () => {
    if (!selectedProvider || !formData.smartCardNumber) return

    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
      setCustomerInfo({
        name: "John Doe",
        currentPackage:
          selectedProvider === "dstv"
            ? "DSTV Compact"
            : selectedProvider === "gotv"
              ? "GOTV Jolli"
              : selectedProvider === "startimes"
                ? "Startimes Classic"
                : "Showmax Standard",
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
        setCustomerInfo({ name: "", currentPackage: "" })
        setFormData({
          smartCardNumber: "",
          package: "",
          phoneNumber: "",
          paymentMethod: "wallet",
        })
      }, 5000)
    }, 1500)
  }

  // Get the selected package details
  const getSelectedPackageDetails = () => {
    if (!selectedProvider || !formData.package) return null
    const pkgs = packages[selectedProvider as keyof typeof packages]
    return pkgs.find((pkg) => pkg.id === formData.package)
  }

  const selectedPackage = getSelectedPackageDetails()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cable TV Subscription</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pay Cable TV Subscription</CardTitle>
              <CardDescription>Subscribe to your favorite TV packages</CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">Transaction Successful!</h3>
                  <p className="mb-2 text-muted-foreground">
                    You have successfully subscribed to {selectedPackage?.name} for SmartCard {formData.smartCardNumber}
                    .
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Transaction Reference: BVTU{Math.floor(Math.random() * 1000000000)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Select Cable TV Provider</Label>
                      <ProviderSelector
                        providers={providers}
                        selectedProvider={selectedProvider}
                        onSelect={handleProviderSelect}
                      />
                    </div>

                    <div>
                      <Label htmlFor="smartCardNumber">SmartCard/IUC Number</Label>
                      <Input
                        id="smartCardNumber"
                        name="smartCardNumber"
                        placeholder="Enter your SmartCard/IUC number"
                        required
                        value={formData.smartCardNumber}
                        onChange={handleChange}
                      />
                    </div>

                    {!isVerified && selectedProvider && formData.smartCardNumber && (
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
                          "Verify SmartCard"
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
                          <span className="text-muted-foreground">Current Package:</span> {customerInfo.currentPackage}
                        </p>
                      </div>
                    )}

                    {isVerified && (
                      <>
                        <div>
                          <Label htmlFor="package">Select Package</Label>
                          <Select
                            onValueChange={(value) => handleSelectChange("package", value)}
                            value={formData.package}
                          >
                            <SelectTrigger id="package">
                              <SelectValue placeholder="Select a package" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProvider &&
                                packages[selectedProvider as keyof typeof packages].map((pkg) => (
                                  <SelectItem key={pkg.id} value={pkg.id}>
                                    {pkg.name} - {pkg.price}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Enter phone number to receive confirmation"
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

                  <Button type="submit" className="w-full" disabled={!isVerified || !formData.package || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Pay Now"
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
              <CardDescription>Your recent Cable TV subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        <Tv className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.provider}</div>
                        <div className="text-xs text-muted-foreground">{transaction.package}</div>
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
          <CardTitle>Popular Packages</CardTitle>
          <CardDescription>Most subscribed packages by our users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden">
              <div className="bg-primary p-4 text-primary-foreground">
                <h3 className="font-bold">DSTV Premium</h3>
                <p className="text-sm opacity-90">All channels + Premium Sports</p>
              </div>
              <CardContent className="p-4">
                <p className="mb-4 text-2xl font-bold">₦24,500</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedProvider("dstv")
                    setFormData((prev) => ({ ...prev, package: "dstv-premium" }))
                  }}
                >
                  Select
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="bg-primary p-4 text-primary-foreground">
                <h3 className="font-bold">GOTV Max</h3>
                <p className="text-sm opacity-90">60+ channels + Sports</p>
              </div>
              <CardContent className="p-4">
                <p className="mb-4 text-2xl font-bold">₦4,850</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedProvider("gotv")
                    setFormData((prev) => ({ ...prev, package: "gotv-max" }))
                  }}
                >
                  Select
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="bg-primary p-4 text-primary-foreground">
                <h3 className="font-bold">Startimes Super</h3>
                <p className="text-sm opacity-90">80+ channels + Sports</p>
              </div>
              <CardContent className="p-4">
                <p className="mb-4 text-2xl font-bold">₦4,900</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedProvider("startimes")
                    setFormData((prev) => ({ ...prev, package: "startimes-super" }))
                  }}
                >
                  Select
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="bg-primary p-4 text-primary-foreground">
                <h3 className="font-bold">Showmax Premium</h3>
                <p className="text-sm opacity-90">Movies + Sports</p>
              </div>
              <CardContent className="p-4">
                <p className="mb-4 text-2xl font-bold">₦5,500</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedProvider("showmax")
                    setFormData((prev) => ({ ...prev, package: "showmax-premium" }))
                  }}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
