"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function WalletTransactionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [transactionType, setTransactionType] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)

  // Mock transaction data
  const transactions = [
    {
      id: "TRX123456789",
      type: "credit",
      description: "Wallet Funding",
      amount: "₦50,000",
      rawAmount: 50000,
      date: "May 5, 2023, 10:30 AM",
      status: "success",
      method: "Bank Transfer",
      reference: "REF123456789",
      fee: "₦0",
      balance: "₦125,000",
      details: {
        senderName: "John Doe",
        senderBank: "GTBank",
        senderAccount: "0123456789",
        narration: "Wallet funding",
      },
    },
    {
      id: "TRX123456788",
      type: "debit",
      description: "MTN Airtime Purchase",
      amount: "₦1,000",
      rawAmount: 1000,
      date: "May 4, 2023, 3:15 PM",
      status: "success",
      method: "Wallet",
      reference: "REF123456788",
      fee: "₦0",
      balance: "₦75,000",
      details: {
        phoneNumber: "08012345678",
        network: "MTN",
        plan: "Airtime",
      },
    },
    {
      id: "TRX123456787",
      type: "debit",
      description: "DSTV Subscription",
      amount: "₦24,500",
      rawAmount: 24500,
      date: "May 3, 2023, 9:00 AM",
      status: "success",
      method: "Wallet",
      reference: "REF123456787",
      fee: "₦0",
      balance: "₦76,000",
      details: {
        smartCardNumber: "1234567890",
        package: "Premium",
        duration: "1 Month",
      },
    },
    {
      id: "TRX123456786",
      type: "credit",
      description: "Referral Bonus",
      amount: "₦5,000",
      rawAmount: 5000,
      date: "May 2, 2023, 11:45 AM",
      status: "success",
      method: "System",
      reference: "REF123456786",
      fee: "₦0",
      balance: "₦100,500",
      details: {
        referredUser: "sarah@example.com",
        bonusType: "First Transaction",
      },
    },
    {
      id: "TRX123456785",
      type: "debit",
      description: "Wallet Transfer",
      amount: "₦10,000",
      rawAmount: 10000,
      date: "May 1, 2023, 2:30 PM",
      status: "success",
      method: "Wallet",
      reference: "REF123456785",
      fee: "₦0",
      balance: "₦95,500",
      details: {
        recipientName: "Jane Smith",
        recipientEmail: "jane@example.com",
        narration: "Monthly allowance",
      },
    },
    {
      id: "TRX123456784",
      type: "debit",
      description: "Airtel Data Purchase",
      amount: "₦2,500",
      rawAmount: 2500,
      date: "April 30, 2023, 5:20 PM",
      status: "success",
      method: "Wallet",
      reference: "REF123456784",
      fee: "₦0",
      balance: "₦105,500",
      details: {
        phoneNumber: "09087654321",
        network: "Airtel",
        plan: "2GB - 30 Days",
      },
    },
    {
      id: "TRX123456783",
      type: "credit",
      description: "Cashback Reward",
      amount: "₦1,500",
      rawAmount: 1500,
      date: "April 29, 2023, 9:15 AM",
      status: "success",
      method: "System",
      reference: "REF123456783",
      fee: "₦0",
      balance: "₦108,000",
      details: {
        rewardType: "Monthly Cashback",
        eligibleTransactions: "15",
      },
    },
    {
      id: "TRX123456782",
      type: "debit",
      description: "EKEDC Electricity",
      amount: "₦10,000",
      rawAmount: 10000,
      date: "April 28, 2023, 4:45 PM",
      status: "success",
      method: "Wallet",
      reference: "REF123456782",
      fee: "₦0",
      balance: "₦106,500",
      details: {
        meterNumber: "12345678901",
        disco: "EKEDC",
        meterType: "Prepaid",
        units: "42.5 kWh",
      },
    },
  ]

  // Filter transactions based on search query and transaction type
  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch =
      searchQuery === "" ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())

    const typeMatch =
      transactionType === "all" ||
      (transactionType === "credit" && transaction.type === "credit") ||
      (transactionType === "debit" && transaction.type === "debit")

    const dateMatch = !date || transaction.date.includes(format(date, "MMMM d, yyyy"))

    return searchMatch && typeMatch && dateMatch
  })

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction)
  }

  const handleExportTransactions = () => {
    // In a real application, this would generate a CSV or PDF file
    alert("Transactions exported successfully!")
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Wallet Transactions</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/wallet")}>
          Back to Wallet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all your wallet transactions</CardDescription>
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
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="credit">Credits Only</SelectItem>
                <SelectItem value="debit">Debits Only</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Button variant="outline" onClick={handleExportTransactions}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`mr-2 flex h-6 w-6 items-center justify-center rounded-full ${
                              transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {transaction.type === "credit" ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownLeft className="h-3 w-3" />
                            )}
                          </div>
                          <span className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                            {transaction.type === "credit" ? "+" : "-"}
                            {transaction.amount}
                          </span>
                        </div>
                      </TableCell>
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
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewTransaction(transaction)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Transaction ID: {selectedTransaction?.id}</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex justify-between rounded-lg bg-muted p-3">
                <span className="text-sm font-medium">Amount</span>
                <span
                  className={`font-bold ${selectedTransaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                >
                  {selectedTransaction.type === "credit" ? "+" : "-"}
                  {selectedTransaction.amount}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <span className="text-sm font-medium">{selectedTransaction.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <span className="text-sm font-medium">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span
                    className={`text-sm font-medium ${
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
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="text-sm font-medium">{selectedTransaction.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reference</span>
                  <span className="text-sm font-mono">{selectedTransaction.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fee</span>
                  <span className="text-sm font-medium">{selectedTransaction.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Balance After</span>
                  <span className="text-sm font-medium">{selectedTransaction.balance}</span>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="mb-2 text-sm font-medium">Transaction Details</h4>
                {selectedTransaction.type === "credit" && selectedTransaction.description === "Wallet Funding" && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sender Name</span>
                      <span className="text-sm font-medium">{selectedTransaction.details.senderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sender Bank</span>
                      <span className="text-sm font-medium">{selectedTransaction.details.senderBank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sender Account</span>
                      <span className="text-sm font-medium">{selectedTransaction.details.senderAccount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Narration</span>
                      <span className="text-sm font-medium">{selectedTransaction.details.narration}</span>
                    </div>
                  </div>
                )}
                {selectedTransaction.description === "MTN Airtime Purchase" ||
                  (selectedTransaction.description === "Airtel Data Purchase" && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone Number</span>
                        <span className="text-sm font-medium">{selectedTransaction.details.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Network</span>
                        <span className="text-sm font-medium">{selectedTransaction.details.network}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Plan</span>
                        <span className="text-sm font-medium">{selectedTransaction.details.plan}</span>
                      </div>
                    </div>
                  ))}
                {selectedTransaction.description === "DSTV Subscription" && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Smart Card Number</span>
                      <span className="text-sm font-medium">{selectedTransaction.details.smartCardNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Package</span>
                      <span className="text-sm font-medium">{selectedTransaction.details.package}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="text-sm font-medium">{selectedTransaction.details.duration}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
