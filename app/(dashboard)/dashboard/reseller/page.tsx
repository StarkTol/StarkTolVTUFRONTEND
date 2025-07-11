"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Globe, Tag, ArrowUpRight, Download, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ResellerDashboardPage() {
  const [dateRange, setDateRange] = useState("week")

  // Mock data for reseller dashboard
  const resellerData = {
    totalSales: "₦1,250,000",
    totalProfit: "₦125,000",
    totalCustomers: 48,
    totalTransactions: 245,
    salesGrowth: "+15.2%",
    profitGrowth: "+12.5%",
    customerGrowth: "+8.7%",
    transactionGrowth: "+20.3%",
    tier: {
      name: "Silver",
      progress: 72,
      nextTier: "Gold",
      remaining: "₦250,000",
    },
    topProducts: [
      { name: "MTN Data", sales: "₦450,000", percentage: 36 },
      { name: "Airtel Airtime", sales: "₦320,000", percentage: 25.6 },
      { name: "DSTV Subscription", sales: "₦180,000", percentage: 14.4 },
      { name: "EKEDC Electricity", sales: "₦150,000", percentage: 12 },
      { name: "Glo Data", sales: "₦100,000", percentage: 8 },
    ],
    recentTransactions: [
      {
        id: 1,
        customer: "John Doe",
        service: "MTN Data - 10GB",
        amount: "₦8,000",
        date: "Today, 10:30 AM",
        profit: "₦800",
      },
      {
        id: 2,
        customer: "Sarah Johnson",
        service: "DSTV Premium",
        amount: "₦24,500",
        date: "Today, 9:15 AM",
        profit: "₦1,225",
      },
      {
        id: 3,
        customer: "Michael Brown",
        service: "Airtel Airtime",
        amount: "₦5,000",
        date: "Yesterday, 3:45 PM",
        profit: "₦500",
      },
      {
        id: 4,
        customer: "Emily Wilson",
        service: "EKEDC Electricity",
        amount: "₦10,000",
        date: "Yesterday, 1:20 PM",
        profit: "₦500",
      },
      {
        id: 5,
        customer: "David Clark",
        service: "Glo Data - 5GB",
        amount: "₦3,500",
        date: "May 1, 2023",
        profit: "₦350",
      },
    ],
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reseller Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellerData.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{resellerData.salesGrowth}</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellerData.totalProfit}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{resellerData.profitGrowth}</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellerData.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{resellerData.customerGrowth}</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellerData.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{resellerData.transactionGrowth}</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Your sales performance over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="flex h-full items-center justify-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground" />
              <span className="ml-4 text-muted-foreground">Sales chart visualization would appear here</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Reseller Tier</CardTitle>
            <CardDescription>Your current tier and benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Tier</p>
                <h3 className="text-2xl font-bold">{resellerData.tier.name}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Tag className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {resellerData.tier.nextTier}</span>
                <span>{resellerData.tier.progress}%</span>
              </div>
              <Progress value={resellerData.tier.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {resellerData.tier.remaining} more in sales to reach {resellerData.tier.nextTier}
              </p>
            </div>

            <div className="rounded-md border p-3">
              <h4 className="mb-2 font-semibold">Your Benefits</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>10% commission on all services</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Custom branded website</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Priority customer support</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Your best performing services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resellerData.topProducts.map((product, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{product.name}</span>
                      <span className="font-medium">{product.sales}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={product.percentage} className="h-2" />
                      <span className="w-12 text-right text-sm text-muted-foreground">{product.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Products
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest customer transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resellerData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">{transaction.customer}</div>
                      <div className="text-sm text-muted-foreground">{transaction.service}</div>
                      <div className="text-xs text-muted-foreground">{transaction.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{transaction.amount}</div>
                      <div className="text-xs text-green-600">Profit: {transaction.profit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your reseller business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Globe className="mr-2 h-4 w-4" /> Manage Website
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Tag className="mr-2 h-4 w-4" /> Update Pricing
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" /> Manage Sub-resellers
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" /> View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>Your API integration statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total API Calls</p>
                <h3 className="text-2xl font-bold">12,543</h3>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <h3 className="text-2xl font-bold">99.8%</h3>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Usage Limit</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground">55,000 / 100,000 calls remaining this month</p>
            </div>

            <Button variant="outline" className="w-full">
              View API Documentation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
