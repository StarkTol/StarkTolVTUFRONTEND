"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { referralsService } from "@/src/api/services/referrals"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Gift, Users, ArrowUpRight, Download, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Import extracted components
import { StatsCard, ShareBox, ReferralTable, WithdrawalDialog } from "@/components/referrals"

export default function ReferralsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false)

  const [referralData, setReferralData] = useState<any>(null)
  const [referralHistory, setReferralHistory] = useState<any[]>([])
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const stats = await referralsService.getReferralStats();
        // Defensive: fallback to empty object if no data
        setReferralData(stats.data || {});

        const history = await referralsService.getAllReferrals();
        // Normalize referral history fields for ReferralTable
        const normalizedHistory = (history.data || []).map((r: any) => ({
          id: r.id,
          referredUserName: r.referredUserName || r.name || r.fullName || r.username || "-",
          referredUserEmail: r.referredUserEmail || r.email || r.userEmail || "-",
          joinedAt: r.joinedAt || r.date || r.createdAt || new Date().toISOString(),
          status: r.status || "inactive",
          totalTransactions: r.totalTransactions ?? r.transactions ?? 0,
          commissionEarned: r.commissionEarned ?? r.earnings ?? 0,
        }));
        setReferralHistory(normalizedHistory);

        const withdrawals = await referralsService.getAllWithdrawals();
        // Defensive: fallback for missing fields
        const normalizedWithdrawals = (withdrawals.data || []).map((w: any) => ({
          ...w,
          amount: w.amount ?? 0,
          method: w.method || "wallet",
          status: w.status || "pending",
          requestedAt: w.requestedAt || w.date || w.createdAt || new Date().toISOString(),
          processedAt: w.processedAt || w.completedAt || null,
        }));
        setWithdrawalHistory(normalizedWithdrawals);

        setApiError(null);
        // Debug log
        if (process.env.NODE_ENV !== 'production') {
          console.log("[Referrals] Stats:", stats.data);
          console.log("[Referrals] History:", normalizedHistory);
          console.log("[Referrals] Withdrawals:", normalizedWithdrawals);
        }
      } catch (err: any) {
        let message = "Unable to load referral data. Please try again later.";
        if (err && (err.message || err.statusText)) {
          message = err.message || err.statusText;
        } else if (typeof err === "string") {
          message = err;
        }
        setApiError(message);
        if (process.env.NODE_ENV !== 'production') {
          console.error("[Referrals] API error:", err);
        }
      }
    };
    fetchReferralData();
  }, []);


  // Withdrawal handlers
  const handleRequestWithdrawal = async (withdrawalRequest: any) => {
    setIsWithdrawing(true)
    try {
      await referralsService.requestWithdrawal(withdrawalRequest)
      
      // Refresh data
      const stats = await referralsService.getReferralStats()
      setReferralData(stats.data)
      const withdrawals = await referralsService.getAllWithdrawals()
      setWithdrawalHistory(withdrawals.data)
      
      setIsWithdrawSuccess(true)
      setTimeout(() => setIsWithdrawSuccess(false), 3000)
    } catch (err: any) {
      console.error('Withdrawal request failed:', err)
      // You might want to show an error message here
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleCancelWithdrawal = async (withdrawalId: string) => {
    try {
      await referralsService.cancelWithdrawal(withdrawalId)
      
      // Refresh data
      const stats = await referralsService.getReferralStats()
      setReferralData(stats.data)
      const withdrawals = await referralsService.getAllWithdrawals()
      setWithdrawalHistory(withdrawals.data)
    } catch (err: any) {
      console.error('Cancel withdrawal failed:', err)
      // You might want to show an error message here
    }
  }

  // Success notification
  if (isWithdrawSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="mb-2 text-2xl font-bold">Withdrawal Request Submitted!</h3>
          <p className="mb-2 text-muted-foreground">
            Your withdrawal request has been submitted successfully. You will be notified once it&apos;s processed.
          </p>
          <Button variant="outline" onClick={() => setIsWithdrawSuccess(false)}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded bg-red-100 text-red-700 p-4 text-center font-medium max-w-md">
          {apiError}
        </div>
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading referral data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
          <p className="text-muted-foreground">
            Earn money by referring friends to our platform
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              title="Total Referrals"
              value={referralData.totalReferrals}
              icon={Users}
              description={`+${referralData.thisMonthReferrals} this month`}
            />
            <StatsCard
              title="Total Earnings"
              value={referralData.totalEarnings}
              icon={Gift}
              prefix="₦"
              description={`+₦${referralData?.thisMonthEarnings?.toLocaleString?.() ?? "0"} this month`}
            />
            <StatsCard
              title="Available Balance"
              value={referralData.availableBalance}
              icon={ArrowUpRight}
              prefix="₦"
              description="Ready for withdrawal"
            />
            <StatsCard
              title="This Month Earnings"
              value={referralData.thisMonthEarnings}
              icon={Gift}
              prefix="₦"
              description="Current month progress"
            />
            <StatsCard
              title="Conversion Rate"
              value={`${referralData.conversionRate}%`}
              icon={ArrowUpRight}
              description="Referral success rate"
            />
            <StatsCard
              title="Active Referrals"
              value={referralData.activeReferrals}
              icon={Users}
              description="Currently active users"
            />
          </div>

          {/* Share Referral Link */}
          <ShareBox referralUrl={referralData.referralUrl || ''} />
        </TabsContent>

        <TabsContent value="history">
          <ReferralTable referralHistory={referralHistory} />
        </TabsContent>

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>
                Manage your earnings withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button onClick={() => setIsWithdrawDialogOpen(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Withdraw Earnings
                  </Button>
                </div>

                {withdrawalHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No withdrawals yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Processed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawalHistory.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell>₦{withdrawal?.amount?.toLocaleString?.() ?? "0"}</TableCell>
                          <TableCell className="capitalize">{withdrawal.method.replace('_', ' ')}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                withdrawal.status === "pending"
                                  ? "secondary"
                                  : withdrawal.status === "completed"
                                  ? "default"
                                  : withdrawal.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                withdrawal.status === "pending"
                                  ? "bg-yellow-500 text-white"
                                  : withdrawal.status === "completed"
                                  ? "bg-green-500 text-white"
                                  : withdrawal.status === "processing"
                                  ? "bg-blue-500 text-white"
                                  : withdrawal.status === "failed"
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-500 text-white"
                              }
                            >
                              {withdrawal.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(withdrawal.requestedAt).toLocaleDateString()}</TableCell>
                          <TableCell>{withdrawal.processedAt ? new Date(withdrawal.processedAt).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>
                            {withdrawal.status === "pending" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently cancel this withdrawal request and restore the amount to your available balance.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelWithdrawal(withdrawal.id)}>Continue</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Withdraw Earnings Dialog */}
              <WithdrawalDialog
                open={isWithdrawDialogOpen}
                onOpenChange={setIsWithdrawDialogOpen}
                availableBalance={referralData?.availableBalance || 0}
                onSubmit={handleRequestWithdrawal}
                isProcessing={isWithdrawing}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Analytics dashboard will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

