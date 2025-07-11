import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Wallet, ArrowUpRight, Phone, Wifi, Tv, Zap, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Mock data for recent transactions
  const recentTransactions = [
    { id: 1, type: "Airtime", provider: "MTN", amount: "₦1,000", date: "Today, 10:30 AM", status: "success" },
    { id: 2, type: "Data", provider: "Airtel", amount: "₦2,500", date: "Yesterday, 3:15 PM", status: "success" },
    { id: 3, type: "Cable TV", provider: "DSTV", amount: "₦6,500", date: "23/04/2023, 9:00 AM", status: "success" },
    {
      id: 4,
      type: "Electricity",
      provider: "EKEDC",
      amount: "₦10,000",
      date: "20/04/2023, 11:45 AM",
      status: "success",
    },
  ]

  // Mock data for quick services
  const quickServices = [
    { id: 1, name: "Airtime", icon: Phone, color: "bg-blue-500", path: "/dashboard/airtime" },
    { id: 2, name: "Data", icon: Wifi, color: "bg-green-500", path: "/dashboard/data" },
    { id: 3, name: "Cable TV", icon: Tv, color: "bg-purple-500", path: "/dashboard/cable" },
    { id: 4, name: "Electricity", icon: Zap, color: "bg-yellow-500", path: "/dashboard/electricity" },
    { id: 5, name: "Fund Wallet", icon: Wallet, color: "bg-red-500", path: "/dashboard/wallet" },
    { id: 6, name: "Recharge Card", icon: CreditCard, color: "bg-indigo-500", path: "/dashboard/recharge-card" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">Fund Wallet</Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦125,000.00</div>
            <div className="mt-4 flex items-center justify-between">
              <Button variant="secondary" size="sm" className="text-primary">
                Fund Wallet
              </Button>
              <span className="flex items-center text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +12.5%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦450,750.00</div>
            <div className="mt-1 text-xs text-muted-foreground">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">245</div>
            <div className="mt-1 text-xs text-muted-foreground">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Referral Bonus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦12,500.00</div>
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
              <Card className="h-full cursor-pointer transition-all hover:border-primary hover:shadow-md">
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

      {/* Activity and Stats */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest activities on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.type === "Airtime"
                          ? "bg-blue-100 text-blue-600"
                          : transaction.type === "Data"
                            ? "bg-green-100 text-green-600"
                            : transaction.type === "Cable TV"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {transaction.type === "Airtime" && <Phone className="h-5 w-5" />}
                      {transaction.type === "Data" && <Wifi className="h-5 w-5" />}
                      {transaction.type === "Cable TV" && <Tv className="h-5 w-5" />}
                      {transaction.type === "Electricity" && <Zap className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-medium">
                        {transaction.type} - {transaction.provider}
                      </div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{transaction.amount}</div>
                    <div
                      className={`text-sm ${
                        transaction.status === "success"
                          ? "text-green-600"
                          : transaction.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {transaction.status === "success"
                        ? "Successful"
                        : transaction.status === "pending"
                          ? "Pending"
                          : "Failed"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" className="gap-1">
                View All Transactions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

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
                <div className="h-[200px] w-full rounded-md border p-4">
                  <div className="flex h-full items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Airtime</div>
                    <div className="text-lg font-bold">₦5,200</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Data</div>
                    <div className="text-lg font-bold">₦12,500</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="monthly" className="space-y-4">
                <div className="h-[200px] w-full rounded-md border p-4">
                  <div className="flex h-full items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Airtime</div>
                    <div className="text-lg font-bold">₦22,800</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Data</div>
                    <div className="text-lg font-bold">₦45,000</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="yearly" className="space-y-4">
                <div className="h-[200px] w-full rounded-md border p-4">
                  <div className="flex h-full items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Airtime</div>
                    <div className="text-lg font-bold">₦245,600</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-sm text-muted-foreground">Data</div>
                    <div className="text-lg font-bold">₦520,000</div>
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
