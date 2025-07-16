"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import {
  BarChart3,
  Wallet,
  ArrowUpRight,
  Phone,
  Wifi,
  Tv,
  Zap,
  CreditCard,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [walletBalance, setWalletBalance] = useState("₦0.00")
  const [transactions, setTransactions] = useState([])
  const [usageStats, setUsageStats] = useState({
    weekly: { airtime: 0, data: 0 },
    monthly: { airtime: 0, data: 0 },
    yearly: { airtime: 0, data: 0 },
  })
  const [totalSpent, setTotalSpent] = useState(0)
  const [referralBonus, setReferralBonus] = useState(0)
  const [loading, setLoading] = useState(true)

  const quickServices = [
    { id: 1, name: "Airtime", icon: Phone, color: "bg-blue-500", path: "/dashboard/airtime" },
    { id: 2, name: "Data", icon: Wifi, color: "bg-green-500", path: "/dashboard/data" },
    { id: 3, name: "Cable TV", icon: Tv, color: "bg-purple-500", path: "/dashboard/cable" },
    { id: 4, name: "Electricity", icon: Zap, color: "bg-yellow-500", path: "/dashboard/electricity" },
    { id: 5, name: "Fund Wallet", icon: Wallet, color: "bg-red-500", path: "/dashboard/wallet" },
    { id: 6, name: "Recharge Card", icon: CreditCard, color: "bg-indigo-500", path: "/dashboard/recharge-card" },
  ]

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const headers = { Authorization: `Bearer ${token}` }

        const [profileRes, transactionsRes, statsRes] = await Promise.all([
          axios.get("https://backend-066c.onrender.com/api/v1/user/profile", { headers }),
          axios.get("https://backend-066c.onrender.com/api/v1/transactions?limit=5", { headers }),
          axios.get("https://backend-066c.onrender.com/api/v1/stats/usage", { headers }),
        ])

        const profile = profileRes.data
        setWalletBalance(`₦${profile.wallet_balance.toLocaleString()}`)
        setTotalSpent(profile.total_spent || 0)
        setReferralBonus(profile.referral_bonus || 0)

        setTransactions(transactionsRes.data.transactions || [])
        setUsageStats(statsRes.data || usageStats)
      } catch (err) {
        console.error("Error loading dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
              {transactions.map((tx: any) => (
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

        {/* Usage Stats */}
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

              {["weekly", "monthly", "yearly"].map((period) => (
                <TabsContent value={period} key={period} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md border p-3">
                      <div className="text-sm text-muted-foreground">Airtime</div>
                      <div className="text-lg font-bold">₦{usageStats[period].airtime.toLocaleString()}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-sm text-muted-foreground">Data</div>
                      <div className="text-lg font-bold">₦{usageStats[period].data.toLocaleString()}</div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
