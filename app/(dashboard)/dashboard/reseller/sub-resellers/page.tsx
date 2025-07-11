"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, UserPlus, Loader2, Check, UserX, UserCheck, Mail } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function SubResellersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    commission: "5",
  })

  // Mock data for sub-resellers
  const subResellers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "08012345678",
      status: "active",
      commission: "5%",
      sales: "₦450,000",
      profit: "₦22,500",
      customers: 12,
      joinDate: "April 15, 2023",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "09087654321",
      status: "active",
      commission: "7%",
      sales: "₦850,000",
      profit: "₦59,500",
      customers: 24,
      joinDate: "March 10, 2023",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "08034567890",
      status: "inactive",
      commission: "5%",
      sales: "₦120,000",
      profit: "₦6,000",
      customers: 5,
      joinDate: "February 20, 2023",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily@example.com",
      phone: "09076543210",
      status: "pending",
      commission: "5%",
      sales: "₦0",
      profit: "₦0",
      customers: 0,
      joinDate: "May 1, 2023",
    },
    {
      id: 5,
      name: "David Clark",
      email: "david@example.com",
      phone: "08023456789",
      status: "active",
      commission: "10%",
      sales: "₦1,250,000",
      profit: "₦125,000",
      customers: 35,
      joinDate: "January 5, 2023",
    },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      setIsDialogOpen(false)

      // Reset form and success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          commission: "5",
        })
      }, 3000)
    }, 1500)
  }

  // Filter sub-resellers based on search query and active tab
  const filteredResellers = subResellers.filter((reseller) => {
    const searchMatch =
      searchQuery === "" ||
      reseller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.phone.includes(searchQuery)

    const statusMatch = activeTab === "all" || reseller.status === activeTab

    return searchMatch && statusMatch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        )
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sub-Resellers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Add Sub-Reseller
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Sub-Reseller</DialogTitle>
              <DialogDescription>Create a new sub-reseller account under your reseller profile.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter full name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission Rate (%)</Label>
                  <Select
                    value={formData.commission}
                    onValueChange={(value) => handleSelectChange("commission", value)}
                  >
                    <SelectTrigger id="commission">
                      <SelectValue placeholder="Select commission rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="7">7%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Sub-Reseller"
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
            <Check className="h-5 w-5" />
            <p>Sub-reseller has been successfully added!</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage Sub-Resellers</CardTitle>
          <CardDescription>View and manage your sub-reseller network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sub-resellers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="text-xs sm:text-sm">
                  Active
                </TabsTrigger>
                <TabsTrigger value="inactive" className="text-xs sm:text-sm">
                  Inactive
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs sm:text-sm">
                  Pending
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResellers.length > 0 ? (
                  filteredResellers.map((reseller) => (
                    <TableRow key={reseller.id}>
                      <TableCell>
                        <div className="font-medium">{reseller.name}</div>
                        <div className="text-xs text-muted-foreground">Since {reseller.joinDate}</div>
                      </TableCell>
                      <TableCell>
                        <div>{reseller.email}</div>
                        <div className="text-xs text-muted-foreground">{reseller.phone}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reseller.status)}</TableCell>
                      <TableCell>{reseller.commission}</TableCell>
                      <TableCell>{reseller.sales}</TableCell>
                      <TableCell>{reseller.profit}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </Button>
                          {reseller.status === "pending" ? (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                              <UserCheck className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                          ) : reseller.status === "active" ? (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600">
                              <UserX className="h-4 w-4" />
                              <span className="sr-only">Deactivate</span>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                              <UserCheck className="h-4 w-4" />
                              <span className="sr-only">Activate</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No sub-resellers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sub-Resellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> new sub-resellers this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sub-Reseller Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦2,670,000</div>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦213,000</div>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="text-green-600">+12.8%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
