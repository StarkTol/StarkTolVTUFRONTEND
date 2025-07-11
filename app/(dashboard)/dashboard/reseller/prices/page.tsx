"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Loader2, Percent, Info, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ResellerPricesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("airtime")
  const [editingPrice, setEditingPrice] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data for pricing
  const [pricingData, setPricingData] = useState({
    airtime: [
      { id: 1, provider: "MTN", defaultPrice: "₦97", yourPrice: "₦98", profit: "₦1" },
      { id: 2, provider: "Airtel", defaultPrice: "₦97", yourPrice: "₦98", profit: "₦1" },
      { id: 3, provider: "Glo", defaultPrice: "₦97", yourPrice: "₦98", profit: "₦1" },
      { id: 4, provider: "9mobile", defaultPrice: "₦97", yourPrice: "₦98", profit: "₦1" },
    ],
    data: [
      { id: 1, provider: "MTN", plan: "1GB - 30 Days", defaultPrice: "₦1,000", yourPrice: "₦1,050", profit: "₦50" },
      { id: 2, provider: "MTN", plan: "2GB - 30 Days", defaultPrice: "₦2,000", yourPrice: "₦2,100", profit: "₦100" },
      { id: 3, provider: "Airtel", plan: "1GB - 30 Days", defaultPrice: "₦1,000", yourPrice: "₦1,050", profit: "₦50" },
      { id: 4, provider: "Airtel", plan: "2GB - 30 Days", defaultPrice: "₦2,000", yourPrice: "₦2,100", profit: "₦100" },
      { id: 5, provider: "Glo", plan: "1GB - 30 Days", defaultPrice: "₦1,000", yourPrice: "₦1,050", profit: "₦50" },
      { id: 6, provider: "9mobile", plan: "1GB - 30 Days", defaultPrice: "₦1,000", yourPrice: "₦1,050", profit: "₦50" },
    ],
    cable: [
      { id: 1, provider: "DSTV", plan: "Premium", defaultPrice: "₦24,500", yourPrice: "₦24,700", profit: "₦200" },
      { id: 2, provider: "DSTV", plan: "Compact Plus", defaultPrice: "₦18,600", yourPrice: "₦18,800", profit: "₦200" },
      { id: 3, provider: "GOTV", plan: "Max", defaultPrice: "₦4,850", yourPrice: "₦5,000", profit: "₦150" },
      { id: 4, provider: "Startimes", plan: "Super", defaultPrice: "₦4,900", yourPrice: "₦5,050", profit: "₦150" },
    ],
    electricity: [
      { id: 1, provider: "EKEDC", defaultPrice: "₦100", yourPrice: "₦100", profit: "₦0" },
      { id: 2, provider: "IKEDC", defaultPrice: "₦100", yourPrice: "₦100", profit: "₦0" },
      { id: 3, provider: "AEDC", defaultPrice: "₦100", yourPrice: "₦100", profit: "₦0" },
      { id: 4, provider: "PHEDC", defaultPrice: "₦100", yourPrice: "₦100", profit: "₦0" },
    ],
  })

  const handleEditPrice = (item: any) => {
    setEditingPrice(item)
    setIsDialogOpen(true)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEditingPrice((prev: any) => ({
      ...prev,
      yourPrice: value,
      profit: calculateProfit(prev.defaultPrice, value),
    }))
  }

  const calculateProfit = (defaultPrice: string, yourPrice: string) => {
    const defaultValue = Number(defaultPrice.replace(/[^\d]/g, ""))
    const yourValue = Number(yourPrice.replace(/[^\d]/g, ""))
    const profit = yourValue - defaultValue
    return `₦${profit}`
  }

  const handleSavePrice = () => {
    const { id } = editingPrice
    const category = activeTab

    setPricingData((prev) => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].map((item: any) => (item.id === id ? editingPrice : item)),
    }))

    setIsDialogOpen(false)
  }

  const handleBulkUpdate = () => {
    setIsLoading(true)

    // Simulate saving
    setTimeout(() => {
      setIsLoading(false)
      setIsSaved(true)

      // Reset saved state after 3 seconds
      setTimeout(() => {
        setIsSaved(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Price Management</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleBulkUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : isSaved ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Saved
              </>
            ) : (
              "Save All Changes"
            )}
          </Button>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Pricing Information</AlertTitle>
        <AlertDescription>
          Set your own prices for each service. The difference between the default price and your price is your profit
          margin.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="airtime">Airtime</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="cable">Cable TV</TabsTrigger>
          <TabsTrigger value="electricity">Electricity</TabsTrigger>
        </TabsList>

        <TabsContent value="airtime" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Airtime Pricing</CardTitle>
              <CardDescription>Set your airtime prices for different networks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Default Price</TableHead>
                      <TableHead>Your Price</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingData.airtime.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.provider}</TableCell>
                        <TableCell>{item.defaultPrice}</TableCell>
                        <TableCell>{item.yourPrice}</TableCell>
                        <TableCell>{item.profit}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPrice(item)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                <Info className="mr-1 inline-block h-4 w-4" />
                Prices are per ₦100 airtime value
              </div>
              <Button variant="outline">
                <Percent className="mr-2 h-4 w-4" /> Set Bulk Margin
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Bundle Pricing</CardTitle>
              <CardDescription>Set your data bundle prices for different networks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Default Price</TableHead>
                      <TableHead>Your Price</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingData.data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.provider}</TableCell>
                        <TableCell>{item.plan}</TableCell>
                        <TableCell>{item.defaultPrice}</TableCell>
                        <TableCell>{item.yourPrice}</TableCell>
                        <TableCell>{item.profit}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPrice(item)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Percent className="mr-2 h-4 w-4" /> Set Bulk Margin
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="cable" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cable TV Pricing</CardTitle>
              <CardDescription>Set your cable TV subscription prices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Default Price</TableHead>
                      <TableHead>Your Price</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingData.cable.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.provider}</TableCell>
                        <TableCell>{item.plan}</TableCell>
                        <TableCell>{item.defaultPrice}</TableCell>
                        <TableCell>{item.yourPrice}</TableCell>
                        <TableCell>{item.profit}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPrice(item)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Percent className="mr-2 h-4 w-4" /> Set Bulk Margin
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="electricity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Electricity Pricing</CardTitle>
              <CardDescription>Set your electricity bill payment prices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Default Price</TableHead>
                      <TableHead>Your Price</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingData.electricity.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.provider}</TableCell>
                        <TableCell>{item.defaultPrice}</TableCell>
                        <TableCell>{item.yourPrice}</TableCell>
                        <TableCell>{item.profit}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPrice(item)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                <Info className="mr-1 inline-block h-4 w-4" />
                Prices are per ₦100 bill value
              </div>
              <Button variant="outline">
                <Percent className="mr-2 h-4 w-4" /> Set Bulk Margin
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Price</DialogTitle>
            <DialogDescription>
              {editingPrice?.plan
                ? `Update your price for ${editingPrice?.provider} ${editingPrice?.plan}`
                : `Update your price for ${editingPrice?.provider}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="defaultPrice">Default Price</Label>
              <Input id="defaultPrice" value={editingPrice?.defaultPrice} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yourPrice">Your Price</Label>
              <Input id="yourPrice" value={editingPrice?.yourPrice} onChange={handlePriceChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profit">Your Profit</Label>
              <Input id="profit" value={editingPrice?.profit} disabled />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePrice}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
