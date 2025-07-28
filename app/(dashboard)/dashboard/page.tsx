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
import { Skeleton } from "@/components/ui/skeleton"
import { useUserData } from "@/context/UserDataContext"
import { useWalletData } from "@/context/WalletDataContext"
import { httpClient } from "@/src/api/httpClient"

type UsagePeriod = "weekly" | "monthly" | "yearly"

type Transaction = {
  id: string
  type: string
  provider: string
  amount: number
  date: string
  status: "success" | "pending" | "failed"
}

type DashboardStats = {
  totalTransactions: number
  totalSpent: number
  monthlySpending: number
  successRate: number
  serviceBreakdown: {
    airtime: { amount: number; count: number }
    data: { amount: number; count: number }
    cable: { amount: number; count: number }
    electricity: { amount: number; count: number }
  }
}

export default function DashboardPage() {
  const { profile, loading: profileLoading } = useUserData()
  const { balance, recentTransactions, loading: walletLoading, refreshWalletData } = useWalletData()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const quickServices = [
    { id: 1, name: "Airtime", icon: Phone, color: "bg-blue-500", path: "/dashboard/airtime" },
    { id: 2, name: "Data", icon: Wifi, color: "bg-green-500", path: "/dashboard/data" },
    { id: 3, name: "Cable TV", icon: Tv, color: "bg-purple-500", path: "/dashboard/cable" },
    { id: 4, name: "Electricity", icon: Zap, color: "bg-yellow-500", path: "/dashboard/electricity" },
    { id: 5, name: "Fund Wallet", icon: Wallet, color: "bg-red-500", path: "/dashboard/wallet" },
    { id: 6, name: "Recharge Card", icon: CreditCard, color: "bg-indigo-500", path: "/dashboard/recharge-card" },
  ]
  
  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch dashboard stats, fallback to computed stats if endpoint doesn't exist
        let dashboardStats: DashboardStats | null = null
        
        try {
          const response = await httpClient.get<DashboardStats>('/dashboard/stats')
          if (response.success && response.data) {
            dashboardStats = response.data
          }
        } catch (statsError: any) {
          console.log('Dashboard stats endpoint not available, computing from transactions:', statsError.status)
          
          // Fallback: compute basic stats from wallet transactions if available
          if (recentTransactions && recentTransactions.length > 0) {
            const totalTransactions = recentTransactions.length
            const totalSpent = recentTransactions
              .filter(tx => tx.type !== 'credit' && tx.status === 'success')
              .reduce((sum, tx) => sum + tx.amount, 0)
            
            const monthlyTransactions = recentTransactions.filter(tx => {
              const txDate = new Date(tx.createdAt)
              const currentMonth = new Date()
              return txDate.getMonth() === currentMonth.getMonth() && 
                     txDate.getFullYear() === currentMonth.getFullYear()
            })
            
            const monthlySpending = monthlyTransactions
              .filter(tx => tx.type !== 'credit' && tx.status === 'success')
              .reduce((sum, tx) => sum + tx.amount, 0)
              
            const successCount = recentTransactions.filter(tx => tx.status === 'success').length
            const successRate = totalTransactions > 0 ? successCount / totalTransactions : 0
            
            // Basic service breakdown
            const serviceBreakdown = {
              airtime: { amount: 0, count: 0 },
              data: { amount: 0, count: 0 },
              cable: { amount: 0, count: 0 },
              electricity: { amount: 0, count: 0 }
            }
            
            recentTransactions.forEach(tx => {
              const service = tx.category || tx.type
              if (service && serviceBreakdown[service as keyof typeof serviceBreakdown]) {
                serviceBreakdown[service as keyof typeof serviceBreakdown].amount += tx.amount
                serviceBreakdown[service as keyof typeof serviceBreakdown].count += 1
              }
            })
            
            dashboardStats = {
              totalTransactions,
              totalSpent,
              monthlySpending,
              successRate,
              serviceBreakdown
            }
          } else {
            // No data available, use zeros
            dashboardStats = {
              totalTransactions: 0,
              totalSpent: 0,
              monthlySpending: 0,
              successRate: 0,
              serviceBreakdown: {
                airtime: { amount: 0, count: 0 },
                data: { amount: 0, count: 0 },
                cable: { amount: 0, count: 0 },
                electricity: { amount: 0, count: 0 }
              }
            }
          }
        }
        
        setStats(dashboardStats)
        console.log('✅ Dashboard stats loaded:', dashboardStats)
        
      } catch (error: any) {
        console.error('Failed to fetch dashboard stats:', error)
        setError('Failed to load dashboard statistics')
        
        // Fallback to empty stats to prevent complete failure
        setStats({
          totalTransactions: 0,
          totalSpent: 0,
          monthlySpending: 0,
          successRate: 0,
          serviceBreakdown: {
            airtime: { amount: 0, count: 0 },
            data: { amount: 0, count: 0 },
            cable: { amount: 0, count: 0 },
            electricity: { amount: 0, count: 0 }
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [recentTransactions])

  // Show loading state
if (loading || profileLoading || walletLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  // Calculate display values from real user data
  const walletBalance = balance ? `₦${balance.balance.toLocaleString()}` : '₦0.00'
  const totalSpent = stats?.totalSpent || 0
  const referralBonus = profile?.referralCode ? 0 : 0 // TODO: Add referral bonus field

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
            <div className="text-3xl font-bold">{stats?.totalTransactions || 0}</div>
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
              {recentTransactions?.length > 0 ? recentTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      tx.category === "airtime" || tx.type === "airtime" ? "bg-blue-100 text-blue-600"
                      : tx.category === "data" || tx.type === "data" ? "bg-green-100 text-green-600"
                      : tx.category === "cable" || tx.type === "cable" ? "bg-purple-100 text-purple-600"
                      : tx.category === "electricity" || tx.type === "electricity" ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {(tx.category === "airtime" || tx.type === "airtime") && <Phone className="h-5 w-5" />}
                      {(tx.category === "data" || tx.type === "data") && <Wifi className="h-5 w-5" />}
                      {(tx.category === "cable" || tx.type === "cable") && <Tv className="h-5 w-5" />}
                      {(tx.category === "electricity" || tx.type === "electricity") && <Zap className="h-5 w-5" />}
                      {(!tx.category && !tx.type) && <CreditCard className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-medium">{tx.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₦{tx.amount.toLocaleString()}</div>
                    <div className={`text-sm ${
                      tx.status === "success" ? "text-green-600"
                      : tx.status === "pending" ? "text-yellow-600"
                      : "text-red-600"
                    }`}>
                      {tx.status === "success" ? "Successful" : 
                       tx.status === "pending" ? "Pending" : "Failed"}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent transactions found
                </div>
              )}
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
                    <div className="text-lg font-bold">₦{(stats?.serviceBreakdown?.airtime?.amount || 0).toLocaleString()}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Data</div>
                    <div className="text-lg font-bold">₦{(stats?.serviceBreakdown?.data?.amount || 0).toLocaleString()}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Cable</div>
                    <div className="text-lg font-bold">₦{(stats?.serviceBreakdown?.cable?.amount || 0).toLocaleString()}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Electricity</div>
                    <div className="text-lg font-bold">₦{(stats?.serviceBreakdown?.electricity?.amount || 0).toLocaleString()}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="monthly" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                    <div className="text-lg font-bold">₦{(stats?.monthlySpending || 0).toLocaleString()}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                    <div className="text-lg font-bold">{((stats?.successRate || 0) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="yearly" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">All Time Spent</div>
                    <div className="text-lg font-bold">₦{(stats?.totalSpent || 0).toLocaleString()}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Transactions</div>
                    <div className="text-lg font-bold">{stats?.totalTransactions || 0}</div>
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
