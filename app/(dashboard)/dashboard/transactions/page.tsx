"use client"

import { useState, useEffect } from "react"
import { getAllTransactions, exportTransactions, downloadTransactionReceipt } from "@/lib/api/transactions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Download,
  Filter,
  Phone,
  Wifi,
  Tv,
  Zap,
  BookOpen,
  CreditCard,
  Gift,
  Eye,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { BaseTransaction } from "@/lib/api/types"
import { formatDistanceToNow, format } from "date-fns"

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<BaseTransaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [transactions, setTransactions] = useState<BaseTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  // Load transactions on component mount and when filters change
  useEffect(() => {
    loadTransactions()
  }, [statusFilter, typeFilter, dateFilter])

  // Removed mock transactions - using real API data only

  // Load transactions from API based on filters
  const loadTransactions = async () => {
    setLoading(true)
    try {
      console.log('🔄 Loading transactions with filters:', { status: statusFilter, type: typeFilter, date: dateFilter })
      
      // Convert filters to API parameters
      const limit = 50  // Load more transactions for better UX
      const offset = 0  // Start from beginning (add pagination later if needed)
      let type = typeFilter !== 'all' ? typeFilter : undefined
      let status = statusFilter !== 'all' ? statusFilter as 'success' | 'pending' | 'failed' : undefined
      
      // Handle date filter conversion
      let dateFrom: string | undefined
      let dateTo: string | undefined
      
      if (dateFilter !== 'all') {
        const now = new Date()
        switch (dateFilter) {
          case 'today':
            dateFrom = now.toISOString().split('T')[0]
            dateTo = now.toISOString().split('T')[0]
            break
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            dateFrom = weekAgo.toISOString().split('T')[0]
            dateTo = now.toISOString().split('T')[0]
            break
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            dateFrom = monthAgo.toISOString().split('T')[0]
            dateTo = now.toISOString().split('T')[0]
            break
        }
      }
      
      const result = await getAllTransactions(limit, offset, type, status, dateFrom, dateTo)
      
      if (result.success && result.data) {
        setTransactions(Array.isArray(result.data) ? result.data : [])
        console.log('✅ Transactions loaded:', Array.isArray(result.data) ? result.data.length : 0, 'items')
      } else {
        console.log('⚠️ No transactions found in API response:', result)
        setTransactions([])
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch transactions:', error)
      // Don't clear existing transactions on error
      if (transactions.length === 0) {
        setTransactions([])
      }
    } finally {
      setLoading(false)
    }
  }

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const searchMatch =
      searchQuery === "" ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.recipient && transaction.recipient.toLowerCase().includes(searchQuery.toLowerCase()))

    return searchMatch
  })

  const handleViewTransaction = (transaction: BaseTransaction) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "airtime":
        return <Phone className="h-5 w-5 text-blue-600" />
      case "data":
        return <Wifi className="h-5 w-5 text-green-600" />
      case "cable":
        return <Tv className="h-5 w-5 text-purple-600" />
      case "electricity":
        return <Zap className="h-5 w-5 text-yellow-600" />
      case "wallet_funding":
      case "payment":
        return <ArrowUpRight className="h-5 w-5 text-green-600" />
      case "wallet_transfer":
        return <ArrowDownLeft className="h-5 w-5 text-red-600" />
      case "exam_card":
        return <BookOpen className="h-5 w-5 text-indigo-600" />
      case "recharge_card":
        return <CreditCard className="h-5 w-5 text-red-600" />
      case "referral_bonus":
        return <Gift className="h-5 w-5 text-amber-600" />
      default:
        return <ArrowUpRight className="h-5 w-5 text-primary" />
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "airtime":
        return "Airtime"
      case "data":
        return "Data"
      case "cable":
        return "Cable TV"
      case "electricity":
        return "Electricity"
      case "wallet_funding":
        return "Wallet Funding"
      case "wallet_transfer":
        return "Wallet Transfer"
      case "exam_card":
        return "Exam Card"
      case "recharge_card":
        return "Recharge Card"
      case "referral_bonus":
        return "Referral Bonus"
      default:
        return type.replace("_", " ")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <Button variant="outline" aria-label="Export transaction data">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage your transaction history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Successful</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="airtime">Airtime</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="cable">Cable TV</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="wallet_funding">Wallet Funding</SelectItem>
                  <SelectItem value="wallet_transfer">Wallet Transfer</SelectItem>
                  <SelectItem value="exam_card">Exam Card</SelectItem>
                  <SelectItem value="recharge_card">Recharge Card</SelectItem>
                  <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" aria-label="More filters">
                <Filter className="h-4 w-4" />
                <span className="sr-only">More filters</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Reference</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Show skeleton rows while loading
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            {getTransactionTypeIcon(transaction.type)}
                          </div>
                          <span className="hidden sm:inline">{getTransactionTypeLabel(transaction.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-col">
                          <span>{transaction.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{transaction.amount}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            transaction.status === "success"
                              ? "bg-green-100 text-green-600"
                              : transaction.status === "pending"
                                ? "bg-amber-100 text-amber-600"
                                : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.status === "success"
                            ? "Successful"
                            : transaction.status === "pending"
                              ? "Pending"
                              : "Failed"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">{transaction.reference}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewTransaction(transaction)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View transaction</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Transaction reference: {selectedTransaction?.reference}</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${
                    selectedTransaction.status === "success"
                      ? "bg-green-100 text-green-600"
                      : selectedTransaction.status === "pending"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {getTransactionTypeIcon(selectedTransaction.type)}
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold">{selectedTransaction.description}</h3>
                  <p className="text-2xl font-bold">{selectedTransaction.amount}</p>
                  <p
                    className={`text-sm ${
                      selectedTransaction.status === "success"
                        ? "text-green-600"
                        : selectedTransaction.status === "pending"
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.status === "success"
                      ? "Successful"
                      : selectedTransaction.status === "pending"
                        ? "Pending"
                        : "Failed"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span>
{selectedTransaction.date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Type</span>
                    <span>{getTransactionTypeLabel(selectedTransaction.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-xs">{selectedTransaction.reference}</span>
                  </div>
                  {selectedTransaction.recipient && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipient</span>
                      <span>{selectedTransaction.recipient}</span>
                    </div>
                  )}
                  {selectedTransaction.metadata?.provider && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider</span>
                      <span>{selectedTransaction.metadata.provider}</span>
                    </div>
                  )}
                  {selectedTransaction.metadata?.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span>{selectedTransaction.metadata.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button variant="outline" aria-label="Download transaction receipt">
                  <Download className="mr-2 h-4 w-4" /> Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
