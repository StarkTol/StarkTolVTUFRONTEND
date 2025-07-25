/**
 * AirtimeTab Component
 * 
 * Handles the Airtime purchase functionality for VTU
 */

import React from 'react'
import { useNetworks } from '@/hooks/vtu/useNetworks'
import { ErrorDisplay } from '@/components/ui/error-display'
import { Skeleton } from '@/components/ui/skeleton'

export default function AirtimeTab() {
  const { data: networks, loading, error, refetch } = useNetworks();

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Airtime Purchase</h2>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Airtime Purchase</h2>
        <ErrorDisplay
          title="Failed to Load Networks"
          message={error}
          onRetry={refetch}
          retryText="Retry Loading Networks"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Airtime Purchase</h2>
      <div className="text-sm text-muted-foreground">
        {networks?.length || 0} networks available
      </div>
      {/* Implement airtime purchase functionality here */}
    </div>
  )
}

