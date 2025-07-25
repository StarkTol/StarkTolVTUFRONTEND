"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProviderSelector } from "@/components/dashboard/provider-selector"
import { Loader2, CheckCircle2, RefreshCw, Clock, Calendar, Trash2, Edit, Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWalletData } from "@/context/WalletDataContext"
import { autoRefillService } from "@/src/api/services"
import type { AutoRefillSchedule } from "@/src/api/types"

export default function AutoRefillPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("airtime")
  const [error, setError] = useState<string | null>(null)
  const [schedules, setSchedules] = useState<AutoRefillSchedule[]>([])
  const [loadingSchedules, setLoadingSchedules] = useState(true)
  const { balance, recentTransactions, walletStats, loading: walletLoading, error: walletError } = useWalletData()
  const [formData, setFormData] = useState({
    serviceType: "airtime",
    phoneNumber: "",
    amount: "",
    dataBundle: "",
    frequency: "weekly",
    dayOfWeek: "monday",
    dayOfMonth: "1",
    startDate: "",
    threshold: "",
    paymentMethod: "wallet",
    isActive: true,
  })

  // Mock data for active auto-refills
  const activeAutoRefills = [
    {
      id: 1,
      type: "airtime",
      provider: "MTN",
      phoneNumber: "08012345678",
      amount: "₦1,000",
      frequency: "Weekly (Every Monday)",
      nextRefill: "May 6, 2023",
      status: "active",
    },
    {
      id: 2,
      type: "data",
      provider: "Airtel",
      phoneNumber: "09087654321",
      plan: "2GB - 30 Days",
      frequency: "Monthly (1st day)",
      nextRefill: "May 1, 2023",
      status: "active",
    },
    {
      id: 3,
      type: "airtime",
      provider: "Glo",
      phoneNumber: "08034567890",
      amount: "₦500",
      frequency: "Balance below ₦200",
      nextRefill: "When triggered",
      status: "active",
    },
    {
      id: 4,
      type: "data",
      provider: "9mobile",
      phoneNumber: "09076543210",
      plan: "1GB - 30 Days",
      frequency: "Monthly (15th day)",
      nextRefill: "May 15, 2023",
      status: "paused",
    },
  ]

  // Mock data for providers
  const providers = [
    { id: "mtn", name: "MTN", logo: "/mtn.logo.jpg?height=60&width=60" },
    { id: "airtel", name: "Airtel", logo: "/airtel.logo.jpg?height=60&width=60" },
    { id: "glo", name: "Glo", logo: "/glo.logo.jpg?height=60&width=60" },
    { id: "9mobile", name: "9mobile", logo: "/etisalate.logo.jpg?height=60&width=60" },
  ]

  // Mock data for data bundles
  const dataBundles = {
    mtn: [
      { id: "mtn-100mb", name: "100MB - 1 Day", price: "₦100" },
      { id: "mtn-1gb", name: "1GB - 30 Days", price: "₦1,000" },
      { id: "mtn-2gb", name: "2GB - 30 Days", price: "₦2,000" },
      { id: "mtn-5gb", name: "5GB - 30 Days", price: "₦3,500" },
    ],
    airtel: [
      { id: "airtel-100mb", name: "100MB - 1 Day", price: "₦100" },
      { id: "airtel-1gb", name: "1GB - 30 Days", price: "₦1,000" },
      { id: "airtel-2gb", name: "2GB - 30 Days", price: "₦2,000" },
      { id: "airtel-5gb", name: "5GB - 30 Days", price: "₦3,500" },
    ],
    glo: [
      { id: "glo-100mb", name: "100MB - 1 Day", price: "₦100" },
      { id: "glo-1gb", name: "1GB - 30 Days", price: "₦1,000" },
      { id: "glo-2gb", name: "2GB - 30 Days", price: "₦2,000" },
      { id: "glo-5gb", name: "5GB - 30 Days", price: "₦3,500" },
    ],
    "9mobile": [
      { id: "9mobile-100mb", name: "100MB - 1 Day", price: "₦100" },
      { id: "9mobile-1gb", name: "1GB - 30 Days", price: "₦1,000" },
      { id: "9mobile-2gb", name: "2GB - 30 Days", price: "₦2,000" },
      { id: "9mobile-5gb", name: "5GB - 30 Days", price: "₦3,500" },
    ],
  }

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    if (activeTab === "data") {
      setFormData((prev) => ({ ...prev, dataBundle: "" }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setFormData((prev) => ({
      ...prev,
      serviceType: value,
      dataBundle: "",
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate transaction processing
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      setIsDialogOpen(false)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleDeleteAutoRefill = (id: number) => {
    // In a real app, this would delete the auto-refill
    console.log(`Delete auto-refill with ID: ${id}`)
  }

  const handleToggleAutoRefill = (id: number, currentStatus: string) => {
    // In a real app, this would toggle the auto-refill status
    console.log(
      `Toggle auto-refill with ID: ${id} from ${currentStatus} to ${currentStatus === "active" ? "paused" : "active"}`,
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Auto Refill</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Auto Refill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Auto Refill</DialogTitle>
              <DialogDescription>Set up automatic recharges for airtime or data.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 py-4">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="airtime">Airtime</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                  </TabsList>
                  <TabsContent value="airtime" className="space-y-4 pt-4">
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
                      </>
                    )}
                  </TabsContent>
                  <TabsContent value="data" className="space-y-4 pt-4">
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
                          <Label htmlFor="dataBundle">Select Data Bundle</Label>
                          <Select
                            onValueChange={(value) => handleSelectChange("dataBundle", value)}
                            value={formData.dataBundle}
                          >
                            <SelectTrigger id="dataBundle">
                              <SelectValue placeholder="Select a data bundle" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProvider &&
                                dataBundles[selectedProvider as keyof typeof dataBundles].map((bundle) => (
                                  <SelectItem key={bundle.id} value={bundle.id}>
                                    {bundle.name} - {bundle.price}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </TabsContent>
                </Tabs>

                {selectedProvider && (
                  <>
                    <div>
                      <Label htmlFor="frequency">Refill Frequency</Label>
                      <Select
                        onValueChange={(value) => handleSelectChange("frequency", value)}
                        value={formData.frequency}
                      >
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="threshold">Balance Threshold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.frequency === "weekly" && (
                      <div>
                        <Label htmlFor="dayOfWeek">Day of Week</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("dayOfWeek", value)}
                          value={formData.dayOfWeek}
                        >
                          <SelectTrigger id="dayOfWeek">
                            <SelectValue placeholder="Select day of week" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="tuesday">Tuesday</SelectItem>
                            <SelectItem value="wednesday">Wednesday</SelectItem>
                            <SelectItem value="thursday">Thursday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="saturday">Saturday</SelectItem>
                            <SelectItem value="sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {formData.frequency === "monthly" && (
                      <div>
                        <Label htmlFor="dayOfMonth">Day of Month</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("dayOfMonth", value)}
                          value={formData.dayOfMonth}
                        >
                          <SelectTrigger id="dayOfMonth">
                            <SelectValue placeholder="Select day of month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 28 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {formData.frequency === "threshold" && (
                      <div>
                        <Label htmlFor="threshold">Balance Threshold (₦)</Label>
                        <Input
                          id="threshold"
                          name="threshold"
                          type="number"
                          placeholder="Refill when balance is below this amount"
                          required={formData.frequency === "threshold"}
                          min="0"
                          max="1000"
                          value={formData.threshold}
                          onChange={handleChange}
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="isActive">Active</Label>
                      <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
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
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    !selectedProvider ||
                    !formData.phoneNumber ||
                    (activeTab === "airtime" && !formData.amount) ||
                    (activeTab === "data" && !formData.dataBundle) ||
                    !formData.startDate ||
                    (formData.frequency === "threshold" && !formData.threshold) ||
                    isLoading
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Create Auto Refill"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isSuccess && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
          <CardContent className="flex items-center gap-2 p-4 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <p>Auto refill has been successfully created!</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active Auto Refills</CardTitle>
          <CardDescription>Manage your scheduled automatic recharges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAutoRefills.length > 0 ? (
              activeAutoRefills.map((refill) => (
                <div key={refill.id} className="rounded-lg border p-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          refill.status === "active" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {refill.type === "airtime" ? <Phone className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {refill.provider} {refill.type === "airtime" ? "Airtime" : "Data"}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              refill.status === "active" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                            }`}
                          >
                            {refill.status === "active" ? "Active" : "Paused"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{refill.phoneNumber}</p>
                        <p className="text-sm">
                          {refill.type === "airtime" ? refill.amount : refill.plan} • {refill.frequency}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Next refill: {refill.nextRefill}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAutoRefill(refill.id, refill.status)}
                      >
                        {refill.status === "active" ? "Pause" : "Activate"}
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteAutoRefill(refill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <RefreshCw className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-bold">No Auto Refills</h3>
                <p className="mb-6 max-w-md text-muted-foreground">
                  You haven't set up any automatic recharges yet. Create your first auto refill to never run out of
                  airtime or data.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Auto Refill
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto Refill Benefits</CardTitle>
          <CardDescription>Why you should use our auto refill feature</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Never Run Out</h3>
              <p className="text-sm text-muted-foreground">
                Set up automatic recharges to ensure you never run out of airtime or data when you need it most.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Flexible Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Choose from daily, weekly, monthly, or balance-based triggers to suit your usage patterns.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">Easy Management</h3>
              <p className="text-sm text-muted-foreground">
                Pause, edit, or delete your auto refills anytime. You're always in control of your scheduled recharges.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Phone(props: React.ComponentProps<typeof RefreshCw>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function Wifi(props: React.ComponentProps<typeof RefreshCw>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13a10 10 0 0 1 14 0" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <line x1="12" x2="12.01" y1="20" y2="20" />
    </svg>
  )
}
