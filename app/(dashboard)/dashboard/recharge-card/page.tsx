"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProviderSelector } from "@/components/dashboard/provider-selector"
import { Loader2, CheckCircle2, CreditCard, Download, Printer } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function RechargeCardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("single")
  const [formData, setFormData] = useState({
    denomination: "",
    quantity: "1",
    email: "",
    phoneNumber: "",
    paymentMethod: "wallet",
    bulkDenominations: "",
    customMessage: "",
    showLogo: true,
  })

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      provider: "MTN",
      denomination: "₦1,000",
      quantity: "5",
      amount: "₦5,000",
      date: "Today, 10:30 AM",
      status: "success",
    },
    {
      id: 2,
      provider: "Airtel",
      denomination: "₦500",
      quantity: "10",
      amount: "₦5,000",
      date: "Yesterday, 3:15 PM",
      status: "success",
    },
    {
      id: 3,
      provider: "Glo",
      denomination: "₦200",
      quantity: "20",
      amount: "₦4,000",
      date: "23/04/2023, 9:00 AM",
      status: "failed",
    },
    {
      id: 4,
      provider: "9mobile",
      denomination: "₦100",
      quantity: "50",
      amount: "₦5,000",
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

  // Mock data for denominations
  const denominations = [
    { value: "100", label: "₦100" },
    { value: "200", label: "₦200" },
    { value: "500", label: "₦500" },
    { value: "1000", label: "₦1,000" },
    { value: "2000", label: "₦2,000" },
    { value: "5000", label: "₦5,000" },
  ]

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, showLogo: checked }))
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
        setFormData({
          denomination: "",
          quantity: "1",
          email: "",
          phoneNumber: "",
          paymentMethod: "wallet",
          bulkDenominations: "",
          customMessage: "",
          showLogo: true,
        })
      }, 5000)
    }, 1500)
  }

  // Calculate total amount
  const calculateTotalAmount = () => {
    if (activeTab === "single" && formData.denomination && formData.quantity) {
      return `₦${(Number.parseInt(formData.denomination) * Number.parseInt(formData.quantity)).toLocaleString()}`
    } else if (activeTab === "bulk" && formData.bulkDenominations) {
      // Parse bulk denominations (format: "quantity x denomination, ...")
      try {
        const items = formData.bulkDenominations.split(",").map((item) => item.trim())
        let total = 0
        for (const item of items) {
          const [quantity, denomination] = item.split("x").map((part) => Number.parseInt(part.trim()))
          if (!isNaN(quantity) && !isNaN(denomination)) {
            total += quantity * denomination
          }
        }
        return `₦${total.toLocaleString()}`
      } catch (error) {
        return "₦0.00"
      }
    }
    return "₦0.00"
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Recharge Card Printing</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generate Recharge Cards</CardTitle>
              <CardDescription>Create and print customized recharge cards</CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">Cards Generated Successfully!</h3>
                  <p className="mb-6 text-muted-foreground">
                    Your recharge cards have been generated and are ready for download or printing.
                  </p>
                  <div className="flex w-full max-w-md flex-col gap-4">
                    <Button className="w-full">
                      <Printer className="mr-2 h-4 w-4" /> Print Cards
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Download as PDF
                    </Button>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Transaction Reference: BVTU{Math.floor(Math.random() * 1000000000)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="single">Single Denomination</TabsTrigger>
                      <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="single" className="space-y-4 pt-4">
                      <div>
                        <Label>Select Network Provider</Label>
                        <ProviderSelector
                          providers={providers}
                          selectedProvider={selectedProvider}
                          onSelect={handleProviderSelect}
                        />
                      </div>

                      {selectedProvider && (
                        <>
                          <div>
                            <Label htmlFor="denomination">Denomination</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("denomination", value)}
                              value={formData.denomination}
                            >
                              <SelectTrigger id="denomination">
                                <SelectValue placeholder="Select denomination" />
                              </SelectTrigger>
                              <SelectContent>
                                {denominations.map((denom) => (
                                  <SelectItem key={denom.value} value={denom.value}>
                                    {denom.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("quantity", value)}
                              value={formData.quantity}
                            >
                              <SelectTrigger id="quantity">
                                <SelectValue placeholder="Select quantity" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 5, 10, 20, 50, 100].map((qty) => (
                                  <SelectItem key={qty} value={qty.toString()}>
                                    {qty}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </TabsContent>
                    <TabsContent value="bulk" className="space-y-4 pt-4">
                      <div>
                        <Label>Select Network Provider</Label>
                        <ProviderSelector
                          providers={providers}
                          selectedProvider={selectedProvider}
                          onSelect={handleProviderSelect}
                        />
                      </div>

                      {selectedProvider && (
                        <div>
                          <Label htmlFor="bulkDenominations">Bulk Denominations</Label>
                          <Textarea
                            id="bulkDenominations"
                            name="bulkDenominations"
                            placeholder="Format: quantity x denomination, e.g., 10 x 100, 5 x 500, 2 x 1000"
                            value={formData.bulkDenominations}
                            onChange={handleChange}
                            className="h-24"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            Example: 10 x 100, 5 x 500, 2 x 1000 (This will generate 10 cards of ₦100, 5 cards of ₦500,
                            and 2 cards of ₦1,000)
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {selectedProvider && (
                    <>
                      <div className="space-y-4 rounded-md border p-4">
                        <h3 className="font-semibold">Customization Options</h3>
                        <div>
                          <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                          <Textarea
                            id="customMessage"
                            name="customMessage"
                            placeholder="Enter a custom message to appear on the cards"
                            value={formData.customMessage}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="showLogo" checked={formData.showLogo} onCheckedChange={handleCheckboxChange} />
                          <Label htmlFor="showLogo" className="text-sm font-normal">
                            Include network provider logo on cards
                          </Label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter email to receive cards"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="Enter phone number"
                          required
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="rounded-md border p-4">
                        <h3 className="mb-2 font-semibold">Order Summary</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Network:</span>
                            <span className="font-medium">
                              {selectedProvider && providers.find((p) => p.id === selectedProvider)?.name}
                            </span>
                          </div>
                          {activeTab === "single" && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Denomination:</span>
                                <span className="font-medium">
                                  ₦
                                  {formData.denomination
                                    ? Number.parseInt(formData.denomination).toLocaleString()
                                    : "0"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Quantity:</span>
                                <span className="font-medium">{formData.quantity}</span>
                              </div>
                            </>
                          )}
                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">Total Amount:</span>
                              <span className="font-bold text-primary">{calculateTotalAmount()}</span>
                            </div>
                          </div>
                        </div>
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      !selectedProvider ||
                      (activeTab === "single" && (!formData.denomination || !formData.quantity)) ||
                      (activeTab === "bulk" && !formData.bulkDenominations) ||
                      isLoading
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Generate Recharge Cards"
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
              <CardDescription>Your recent recharge card generations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.provider}</div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.denomination} x {transaction.quantity}
                        </div>
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
          <CardTitle>Recharge Card Printing Guide</CardTitle>
          <CardDescription>How to create and print recharge cards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="mb-2 font-semibold">Select Provider & Denomination</h3>
              <p className="text-sm text-muted-foreground">
                Choose your network provider and select the denomination and quantity of cards you want to generate.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="mb-2 font-semibold">Customize Your Cards</h3>
              <p className="text-sm text-muted-foreground">
                Add custom messages, logos, and branding to make your recharge cards unique and professional.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="mb-2 font-semibold">Print or Download</h3>
              <p className="text-sm text-muted-foreground">
                After payment, you can print your cards immediately or download them as a PDF for later printing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
