"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProviderSelector } from "@/components/dashboard/provider-selector"
import { Loader2, CheckCircle2, BookOpen, Receipt } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExamCardsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    quantity: "1",
    email: "",
    phoneNumber: "",
    paymentMethod: "wallet",
  })

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      provider: "WAEC",
      quantity: "1",
      amount: "₦3,500",
      date: "Today, 10:30 AM",
      status: "success",
      pin: "1234-5678-9012-3456",
    },
    {
      id: 2,
      provider: "JAMB",
      quantity: "1",
      amount: "₦4,700",
      date: "Yesterday, 3:15 PM",
      status: "success",
      pin: "9876-5432-1098-7654",
    },
    {
      id: 3,
      provider: "NECO",
      quantity: "2",
      amount: "₦7,000",
      date: "23/04/2023, 9:00 AM",
      status: "failed",
      pin: "",
    },
    {
      id: 4,
      provider: "NABTEB",
      quantity: "1",
      amount: "₦3,200",
      date: "20/04/2023, 11:45 AM",
      status: "success",
      pin: "5678-9012-3456-7890",
    },
  ]

  // Mock data for providers
  const providers = [
    { id: "waec", name: "WAEC", logo: "/waec.logo.jpg?height=60&width=60", price: "₦3,500" },
    { id: "jamb", name: "JAMB", logo: "/jamb.logo.jpg?height=60&width=60", price: "₦4,700" },
    { id: "neco", name: "NECO", logo: "/neco.jpg?height=60&width=60", price: "₦3,500" },
    { id: "nabteb", name: "NABTEB", logo: "/nabteb.jpg?height=60&width=60", price: "₦3,200" },
  ]

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
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

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setSelectedProvider(null)
        setFormData({
          quantity: "1",
          email: "",
          phoneNumber: "",
          paymentMethod: "wallet",
        })
      }, 5000)
    }, 1500)
  }

  // Get the selected provider details
  const getSelectedProviderDetails = () => {
    if (!selectedProvider) return null
    return providers.find((provider) => provider.id === selectedProvider)
  }

  const selectedProviderDetails = getSelectedProviderDetails()
  const totalAmount = selectedProviderDetails
    ? `₦${(Number.parseInt(selectedProviderDetails.price.replace(/[^\d]/g, "")) * Number.parseInt(formData.quantity || "1")) / 100}`
    : "₦0.00"

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Exam Cards</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Exam Cards</CardTitle>
              <CardDescription>Buy exam scratch cards for various educational institutions</CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">Transaction Successful!</h3>
                  <p className="mb-2 text-muted-foreground">
                    You have successfully purchased {formData.quantity} {selectedProviderDetails?.name} exam card(s).
                  </p>
                  <div className="my-4 w-full max-w-md rounded-md bg-muted p-4">
                    <p className="mb-2 font-semibold">Your PIN:</p>
                    <p className="text-xl font-mono font-bold tracking-wider">1234-5678-9012-3456</p>
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
                      <Label>Select Exam Board</Label>
                      <ProviderSelector
                        providers={providers}
                        selectedProvider={selectedProvider}
                        onSelect={handleProviderSelect}
                      />
                    </div>

                    {selectedProvider && (
                      <>
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
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email to receive PIN"
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
                              <span className="text-muted-foreground">Exam Board:</span>
                              <span className="font-medium">{selectedProviderDetails?.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Price per Card:</span>
                              <span className="font-medium">{selectedProviderDetails?.price}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Quantity:</span>
                              <span className="font-medium">{formData.quantity}</span>
                            </div>
                            <div className="border-t pt-2">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">Total Amount:</span>
                                <span className="font-bold text-primary">{totalAmount}</span>
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
                  </div>

                  <Button type="submit" className="w-full" disabled={!selectedProvider || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Purchase Exam Card"
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
              <CardDescription>Your recent exam card purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.provider}</div>
                        <div className="text-xs text-muted-foreground">Qty: {transaction.quantity}</div>
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
          <CardTitle>Exam Cards Information</CardTitle>
          <CardDescription>Important information about exam cards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Usage Instructions</h3>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Scratch cards are delivered instantly via email and SMS.</li>
                <li>Each card can only be used once for the specified examination.</li>
                <li>Verify that the exam board matches your requirements before purchase.</li>
                <li>Keep your PIN confidential and do not share with others.</li>
                <li>Contact support immediately if you encounter any issues with your PIN.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Exam Boards</h3>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium">WAEC</span> - West African Examinations Council
                </li>
                <li>
                  <span className="font-medium">JAMB</span> - Joint Admissions and Matriculation Board
                </li>
                <li>
                  <span className="font-medium">NECO</span> - National Examinations Council
                </li>
                <li>
                  <span className="font-medium">NABTEB</span> - National Business and Technical Examinations Board
                </li>
                <li>
                  <span className="font-medium">GCE</span> - General Certificate of Education
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
