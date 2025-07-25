"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

/**
 * Props for the StatsCard component
 */
interface StatsCardProps {
  /** The title of the statistic */
  title: string
  /** The main value to display */
  value: string | number
  /** Optional icon to display */
  icon?: LucideIcon
  /** Optional description text below the value */
  description?: string
  /** Optional additional info for formatting (e.g., currency symbol) */
  prefix?: string
}

/**
 * A reusable statistics card component for displaying referral metrics
 * 
 * @param props - The component props
 * @returns A formatted card displaying the statistic
 * 
 * @example
 * ```tsx
 * <StatsCard
 *   title="Total Referrals"
 *   value={25}
 *   icon={Users}
 *   description="+5 this month"
 * />
 * ```
 */
export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  prefix = ""
}: StatsCardProps): React.ReactElement {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
