"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, CheckCircle2, Gift, Users, ArrowUpRight, Share2, Facebook, Twitter, Mail } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
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
import { Textarea } from "@/components/ui/textarea"

export default function ReferralsPage() {
  const [isCopied, setIsCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawNote, setWithdrawNote] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false)

  // Mock referral data
  const referralData = {
    code: "BABSVTU123",
    link: "https://babsvtu.com/ref/BABSVTU123",
    totalReferrals: 24,
    activeReferrals: 18,
    totalEarnings: "₦45,000",
    availableBalance: "₦12,500",
    nextTier: {
      name: "Gold",
      progress: 72,
      remaining: 7,
    },
    currentTier: {
      name: "Silver",
      commission: "5%",
    },
  }

  // Mock referral history
  const referralHistory = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      date: "May 2, 2023",
      status: "active",
      earnings: "₦5,000",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      date: "April 28, 2023",
      status: "active",
      earnings: "₦7,500",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      date: "April 15, 2023",
      status: "active",
      earnings: "₦10,000",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily@example.com",
      date: "April 10, 2023",
      status: "inactive",
      earnings: "₦2,500",
    },
    {
      id: 5,
      name: "David Clark",
      email: "david@example.com",
      date: "March 25, 2023",
      status: "active",
      earnings: "₦8,000",
    },
  ]

  // Mock withdrawal history
  const withdrawalHistory = [
    {
      id: 1,
      amount: "₦10,000",
      date: "April 30, 2023",
      status: "completed",
      method: "Bank Transfer",
      reference: "REF123456789",
    },
    {
      id: 2,
      amount: "₦15,000",
      date: "March 15, 2023",
      status: "completed",
      method: "Wallet Transfer",
      reference: "REF987654321",
    },
    {
      id: 3,
      amount: "₦7,500",
      date: "February 28, 2023",
      status: "completed",
      method: "Bank Transfer",
      reference: "REF456789123",
    },
  ]

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralData.link)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralData.code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleShareReferral = (platform: string) => {
    let shareUrl = ""
    const message = `Join Babs VTU using my referral code ${referralData.code} and get a bonus on your first transaction!`

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          referralData.link,
        )}&quote=${encodeURIComponent(message)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          referralData.link,
        )}&text=${encodeURIComponent(message)}`
        break
      case "email":
        shareUrl = `mailto:?subject=Join%20Babs%20VTU&body=${encodeURIComponent(`${message}\n\n${referralData.link}`)}`
        break
      default:
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
  }

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsWithdrawing(true)

    // Simulate processing
    setTimeout(() => {
      setIsWithdrawing(false)
      setIsWithdrawSuccess(true)

      // Reset after 3 seconds
      setTimeout(() => {
        setIsWithdrawSuccess(false)
        setIsWithdrawDialogOpen(false)
        setWithdrawAmount("")
        setWithdrawNote("")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
        <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
          <DialogTrigger asChild>
            <Button>Withdraw Earnings</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Withdraw Earnings</DialogTitle>
              <DialogDescription>Available balance: {referralData.availableBalance}</DialogDescription>
            </DialogHeader>
            {isWithdrawSuccess ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Withdrawal Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Your withdrawal request for ₦{withdrawAmount} has been processed successfully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    required
                    min="1000"
                    max="100000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Minimum withdrawal: ₦1,000</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add a note to this withdrawal"
                    value={withdrawNote}
                    onChange={(e) => setWithdrawNote(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={!withdrawAmount || isWithdrawing}>
                    {isWithdrawing ? "Processing..." : "Withdraw to Wallet"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{referralData.totalReferrals}</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{referralData.activeReferrals} active referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{referralData.totalEarnings}</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {referralData.availableBalance} available for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Referral Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{referralData.currentTier.name}</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Gift className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {referralData.currentTier.commission} commission on all referrals
            </p>
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {referralData.nextTier.remaining} more to {referralData.nextTier.name}
                </span>
                <span>{referralData.nextTier.progress}%</span>
              </div>
              <Progress value={referralData.nextTier.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link with friends to earn commissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input value={referralData.link} readOnly />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={handleCopyReferralLink}
            >
              {isCopied ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">Copy referral link</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Referral Code:</span>
            <code className="rounded bg-muted px-2 py-1 text-sm">{referralData.code}</code>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyReferralCode}>
              {isCopied ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">Copy referral code</span>
            </Button>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Share via:</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleShareReferral("facebook")}
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleShareReferral("twitter")}
              >
                <Twitter className="h-5 w-5 text-blue-400" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => handleShareReferral("email")}
              >
                <Mail className="h-5 w-5 text-red-500" />
                <span className="sr-only">Share via Email</span>
              </Button>
              <Button variant="outline" className="ml-2">
                <Share2 className="mr-2 h-4 w-4" /> More Options
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Referral History</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>People you've referred to Babs VTU</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referralHistory.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">{referral.name}</TableCell>
                        <TableCell>{referral.email}</TableCell>
                        <TableCell>{referral.date}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              referral.status === "active"
                                ? "bg-green-100 text-green-600"
                                : "bg-amber-100 text-amber-600"
                            }`}
                          >
                            {referral.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{referral.earnings}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Referrals
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>Your referral earnings withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawalHistory.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium">{withdrawal.amount}</TableCell>
                        <TableCell>{withdrawal.date}</TableCell>
                        <TableCell>{withdrawal.method}</TableCell>
                        <TableCell className="font-mono text-xs">{withdrawal.reference}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              withdrawal.status === "completed"
                                ? "bg-green-100 text-green-600"
                                : withdrawal.status === "pending"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            {withdrawal.status === "completed"
                              ? "Completed"
                              : withdrawal.status === "pending"
                                ? "Pending"
                                : "Failed"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Withdrawals
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Earn money by referring friends to Babs VTU</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="mb-2 font-semibold">Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link or code with friends, family, and on social media.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="mb-2 font-semibold">Friends Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                When someone signs up using your link and makes their first transaction, they become your referral.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="mb-2 font-semibold">Earn Commissions</h3>
              <p className="text-sm text-muted-foreground">
                Earn a percentage of every transaction your referrals make on Babs VTU. The more they use, the more you
                earn!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
