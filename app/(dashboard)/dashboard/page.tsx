"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Wallet,
  Phone,
  Wifi,
  Tv,
  Zap,
  CreditCard,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type UsagePeriod = "weekly" | "monthly" | "yearly"

type Transaction = {
  id: string
  type: string
  provider: string
  amount: number
  date: string
  status: "success" | "pending" | "failed"
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  
  const quickServices = [
    { id: 1, name: "Airtime", icon: Phone, color: "bg-blue-500", path: "/dashboard/airtime" },
    { id: 2, name: "Data", icon: Wifi, color: "bg-green-500", path: "/dashboard/data" },
    { id: 3, name: "Cable TV", icon: Tv, color: "bg-purple-500", path: "/dashboard/cable" },
    { id: 4, name: "Electricity", icon: Zap, color: "bg-yellow-500", path: "/dashboard/electricity" },
    { id: 5, name: "Fund Wallet", icon: Wallet, color: "bg-red-500", path: "/dashboard/wallet" },
    { id: 6, name: "Recharge Card", icon: CreditCard, color: "bg-indigo-500", path: "/dashboard/recharge-card" },
  ]
  
  useEffect(() => {
    // Simulate loading and set some mock data
    const timer = setTimeout(() => {
      setProfile({
        wallet_balance: 25000,
        total_spent: 12500,
        referral_bonus: 2000
      })
      setTransactions([
        {
          id: '1',
          type: 'Airtime',
          provider: 'MTN',
          amount: 500,
          date: 'Today 2:30 PM',
          status: 'success'
        },
        {
          id: '2',
          type: 'Data',
          provider: 'Airtel',
          amount: 1000,
          date: 'Yesterday 4:15 PM',
          status: 'success'
        },
        {
          id: '3',
          type: 'Cable TV',
          provider: 'DSTV',
          amount: 4000,
          date: '2 days ago',
          status: 'pending'
        }
      ])
      setLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }


  // Calculate display values from secure user data
  const walletBalance = `₦${(profile?.wallet_balance || 0).toLocaleString()}`
  const totalSpent = profile?.total_spent || 0
  const referralBonus = profile?.referral_bonus || 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button size="sm">Fund Wallet</Button>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{walletBalance}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦{totalSpent.toLocaleString()}</div>
            <div className="mt-1 text-xs text-muted-foreground">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{transactions.length}</div>
            <div className="mt-1 text-xs text-muted-foreground">Recent</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Referral Bonus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦{referralBonus.toLocaleString()}</div>
            <div className="mt-1 text-xs text-muted-foreground">Available for withdrawal</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Services */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Quick Services</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {quickServices.map((service) => (
            <Link key={service.id} href={service.path}>
              <Card className="h-full cursor-pointer hover:border-primary hover:shadow-md transition-all">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${service.color}`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-center font-medium">{service.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest activities on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      tx.type === "Airtime" ? "bg-blue-100 text-blue-600"
                      : tx.type === "Data" ? "bg-green-100 text-green-600"
                      : tx.type === "Cable TV" ? "bg-purple-100 text-purple-600"
                      : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {tx.type === "Airtime" && <Phone className="h-5 w-5" />}
                      {tx.type === "Data" && <Wifi className="h-5 w-5" />}
                      {tx.type === "Cable TV" && <Tv className="h-5 w-5" />}
                      {tx.type === "Electricity" && <Zap className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-medium">{tx.type} - {tx.provider}</div>
                      <div className="text-sm text-muted-foreground">{tx.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₦{tx.amount.toLocaleString()}</div>
                    <div className={`text-sm ${
                      tx.status === "success" ? "text-green-600"
                      : tx.status === "pending" ? "text-yellow-600"
                      : "text-red-600"
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" className="gap-1">
                View All Transactions <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>Your spending pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly">
              <TabsList className="mb-4 grid w-full grid-cols-3">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Airtime</div>
                    <div className="text-lg font-bold">₦2,500</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Data</div>
                    <div className="text-lg font-bold">₦4,200</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="monthly" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Airtime</div>
                    <div className="text-lg font-bold">₦8,500</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Data</div>
                    <div className="text-lg font-bold">₦12,200</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="yearly" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Airtime</div>
                    <div className="text-lg font-bold">₦85,500</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Data</div>
                    <div className="text-lg font-bold">₦124,200</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
