"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

/**
 * Interface for referral data
 */
interface ReferralData {
  /** Unique identifier for the referral */
  id: string
  /** Name of the referred user */
  referredUserName: string
  /** Email of the referred user */
  referredUserEmail: string
  /** Date when the user joined */
  joinedAt: string
  /** Current status of the referral */
  status: "pending" | "active" | "inactive"
  /** Total number of transactions made by the referred user */
  totalTransactions: number
  /** Commission earned from this referral */
  commissionEarned: number
}

/**
 * Props for the ReferralTable component
 */
interface ReferralTableProps {
  /** Array of referral data to display */
  referralHistory: ReferralData[]
  /** Optional title for the table */
  title?: string
  /** Optional description for the table */
  description?: string
}

/**
 * A table component for displaying referral history with status indicators
 * 
 * @param props - The component props
 * @returns A card containing a table of referral data
 * 
 * @example
 * ```tsx
 * <ReferralTable
 *   referralHistory={referrals}
 *   title="Referral History"
 *   description="View all your referrals and their activity"
 * />
 * ```
 */
export function ReferralTable({
  referralHistory,
  title = "Referral History",
  description = "View all your referrals and their activity"
}: ReferralTableProps): React.ReactElement {
  /**
   * Gets the appropriate badge variant and styling for a referral status
   * @param status - The referral status
   * @returns Badge configuration object
   */
  const getStatusBadgeConfig = (status: ReferralData['status']) => {
    switch (status) {
      case "pending":
        return {
          variant: "destructive" as const,
          className: "bg-yellow-500"
        }
      case "active":
        return {
          variant: "default" as const,
          className: "bg-green-500"
        }
      case "inactive":
        return {
          variant: "secondary" as const,
          className: "bg-gray-500"
        }
      default:
        return {
          variant: "secondary" as const,
          className: "bg-gray-500"
        }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {referralHistory.length === 0 ? (
          <CardDescription>No referrals yet.</CardDescription>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referralHistory.map((referral) => {
                const badgeConfig = getStatusBadgeConfig(referral.status)
                return (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.referredUserName}</TableCell>
                    <TableCell>{referral.referredUserEmail}</TableCell>
                    <TableCell>{new Date(referral.joinedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={badgeConfig.variant}
                        className={badgeConfig.className}
                      >
                        {referral.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{referral.totalTransactions}</TableCell>
                    <TableCell>₦{referral.commissionEarned.toLocaleString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
