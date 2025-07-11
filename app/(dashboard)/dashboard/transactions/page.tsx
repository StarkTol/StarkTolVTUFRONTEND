"use client"

import { useState } from "react"
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

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock transaction data
  interface Transaction {
    id: number
    type: string
    description: string
    amount: string
    date: string
    time: string
    status: string
    reference: string
    recipient?: string
    provider?: string
    paymentMethod: string
  }

  const transactions: Transaction[] = [
    {
      id: 1,
      type: "airtime",
      description: "MTN Airtime Purchase",
      amount: "₦1,000",
      date: "May 2, 2023",
      time: "10:30 AM",
      status: "success",
      reference: "BVTU123456789",
      recipient: "08012345678",
      provider: "MTN",
      paymentMethod: "Wallet",
    },
    {
      id: 2,
      type: "data",
      description: "Airtel Data Bundle",
      amount: "₦2,500",
      date: "May 1, 2023",
      time: "3:15 PM",
      status: "success",
      reference: "BVTU987654321",
      recipient: "09087654321",
      provider: "Airtel",
      paymentMethod: "Wallet",
    },
    {
      id: 3,
      type: "cable",
      description: "DSTV Subscription",
      amount: "₦24,500",
      date: "April 28, 2023",
      time: "9:00 AM",
      status: "success",
      reference: "BVTU456789123",
      recipient: "12345678901",
      provider: "DSTV",
      paymentMethod: "Wallet",
    },
    {
      id: 4,
      type: "electricity",
      description: "EKEDC Electricity Token",
      amount: "₦10,000",
      date: "April 25, 2023",
      time: "11:45 AM",
      status: "success",
      reference: "BVTU789123456",
      recipient: "45678901234",
      provider: "EKEDC",
      paymentMethod: "Wallet",
    },
    {
      id: 5,
      type: "wallet_funding",
      description: "Wallet Funding",
      amount: "₦50,000",
      date: "April 20, 2023",
      time: "2:30 PM",
      status: "success",
      reference: "BVTU234567891",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 6,
      type: "wallet_transfer",
      description: "Wallet Transfer",
      amount: "₦15,000",
      date: "April 18, 2023",
      time: "5:45 PM",
      status: "success",
      reference: "BVTU345678912",
      recipient: "john@example.com",
      paymentMethod: "Wallet",
    },
    {
      id: 7,
      type: "data",
      description: "Glo Data Bundle",
      amount: "₦3,500",
      date: "April 15, 2023",
      time: "8:20 AM",
      status: "failed",
      reference: "BVTU456789123",
      recipient: "08034567890",
      provider: "Glo",
      paymentMethod: "Wallet",
    },
    {
      id: 8,
      type: "exam_card",
      description: "WAEC Exam Card",
      amount: "₦3,500",
      date: "April 10, 2023",
      time: "1:15 PM",
      status: "success",
      reference: "BVTU567891234",
      recipient: "example@gmail.com",
      provider: "WAEC",
      paymentMethod: "Wallet",
    },
    {
      id: 9,
      type: "recharge_card",
      description: "9mobile Recharge Card Printing",
      amount: "₦5,000",
      date: "April 5, 2023",
      time: "4:30 PM",
      status: "success",
      reference: "BVTU678912345",
      provider: "9mobile",
      paymentMethod: "Wallet",
    },
    {
      id: 10,
      type: "referral_bonus",
      description: "Referral Bonus",
      amount: "₦2,500",
      date: "April 1, 2023",
      time: "9:45 AM",
      status: "success",
      reference: "BVTU789123456",
      paymentMethod: "System",
    },
  ]

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const searchMatch =
      searchQuery === "" ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.recipient && transaction.recipient.toLowerCase().includes(searchQuery.toLowerCase()))

    // Status filter
    const statusMatch = statusFilter === "all" || transaction.status === statusFilter

    // Type filter
    const typeMatch = typeFilter === "all" || transaction.type === typeFilter

    // Date filter (simplified for demo)
    let dateMatch = true
    const today = new Date()
    const transactionDate = new Date(transaction.date)

    if (dateFilter === "today") {
      dateMatch = transactionDate.toDateString() === today.toDateString()
    } else if (dateFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(today.getDate() - 7)
      dateMatch = transactionDate >= weekAgo
    } else if (dateFilter === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(today.getMonth() - 1)
      dateMatch = transactionDate >= monthAgo
    }

    return searchMatch && statusMatch && typeMatch && dateMatch
  })

  const handleViewTransaction = (transaction: Transaction) => {
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
        <Button variant="outline">
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
              <Button variant="outline" size="icon">
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
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
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
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{transaction.date}</span>
                          <span className="text-xs text-muted-foreground">{transaction.time}</span>
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
                      <TableCell className="font-mono text-xs">{transaction.reference}</TableCell>
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
                      {selectedTransaction.date} at {selectedTransaction.time}
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
                  {selectedTransaction.provider && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider</span>
                      <span>{selectedTransaction.provider}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span>{selectedTransaction.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button variant="outline">
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
