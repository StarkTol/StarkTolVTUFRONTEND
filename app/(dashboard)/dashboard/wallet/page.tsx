"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, CheckCircle2, CreditCard, Clock, BarChart3, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import useWallet from "@/hooks/useWallet"

export default function WalletPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isCopied, setIsCopied] = useState(false)
  
  // Fetch wallet data using the hook
  const { walletData, transactions, loading, error, refetch } = useWallet()

  const handleCopyAccountNumber = () => {
    if (walletData?.accountNumber) {
      navigator.clipboard.writeText(walletData.accountNumber)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const navigateToFundWallet = () => {
    router.push("/dashboard/wallet/fund")
  }

  const navigateToTransfer = () => {
    router.push("/dashboard/wallet/transfer")
  }

  const navigateToTransactions = () => {
    router.push("/dashboard/wallet/transactions")
  }

  // Show loading state with skeleton when walletData is null and no error
  if (walletData === null && !error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-lg border p-6">
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-8 w-32 mb-4" />
              </div>
              <div className="rounded-lg border p-4">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">Error loading wallet data: {error}</p>
              <Button onClick={refetch} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Your current wallet balance and account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center justify-between rounded-lg bg-gradient-to-r from-primary to-purple-600 p-6 text-white">
              <div>
                <p className="text-sm font-medium opacity-90">Available Balance</p>
                <p className="text-3xl font-bold">{walletData?.formatted || '₦0.00'}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Wallet className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">Account Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{walletData?.accountNumber || 'Loading...'}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyAccountNumber}>
                      {isCopied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      <span className="sr-only">Copy account number</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account Name</span>
                  <span className="font-medium">{walletData?.accountName || 'Loading...'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bank Name</span>
                  <span className="font-medium">{walletData?.bankName || 'Loading...'}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <Button className="flex-1" onClick={navigateToFundWallet}>
                Fund Wallet
              </Button>
              <Button className="flex-1" variant="outline" onClick={navigateToTransfer}>
                Transfer Funds
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline" onClick={navigateToFundWallet}>
              <ArrowUpRight className="mr-2 h-4 w-4" /> Fund Wallet
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={navigateToTransfer}>
              <ArrowDownLeft className="mr-2 h-4 w-4" /> Transfer Funds
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={navigateToTransactions}>
              <Wallet className="mr-2 h-4 w-4" /> Transaction History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Summary</CardTitle>
              <CardDescription>Overview of your wallet activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Income</p>
                      <p className="text-xl font-bold">₦55,000</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <ArrowDownLeft className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spending</p>
                      <p className="text-xl font-bold">₦38,000</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-xl font-bold">₦0</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent wallet activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}
                        {transaction.amount}
                      </div>
                      <div className="text-xs text-green-600">{transaction.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={navigateToTransactions}>
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawals</CardTitle>
              <CardDescription>Manage your wallet withdrawals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ArrowDownLeft className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Bank Transfer</div>
                    <div className="text-sm text-muted-foreground">Transfer funds to your bank account</div>
                  </div>
                </div>
                <Button variant="outline" onClick={navigateToTransfer}>Transfer</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Withdrawal History</div>
                    <div className="text-sm text-muted-foreground">View your withdrawal transactions</div>
                  </div>
                </div>
                <Button variant="outline" onClick={navigateToTransactions}>View History</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
