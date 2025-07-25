/**
 * DataTab Component
 * 
 * Handles the Data Bundle purchase functionality for VTU
 */

import React, { useState } from 'react'
import { useNetworks } from '@/hooks/vtu/useNetworks'
import { useDataPlans } from '@/hooks/vtu/useDataPlans'
import { ErrorDisplay } from '@/components/ui/error-display'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DataTab() {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const { data: networks, loading: networksLoading, error: networksError, refetch: refetchNetworks } = useNetworks();
  const { data: dataPlans, loading: plansLoading, error: plansError, refetch: refetchPlans } = useDataPlans(selectedNetwork);

  if (networksLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Data Bundle Purchase</h2>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (networksError) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Data Bundle Purchase</h2>
        <ErrorDisplay
          title="Failed to Load Networks"
          message={networksError}
          onRetry={refetchNetworks}
          retryText="Retry Loading Networks"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Data Bundle Purchase</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Network</label>
        <Select value={selectedNetwork || ""} onValueChange={setSelectedNetwork}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a network provider" />
          </SelectTrigger>
          <SelectContent>
            {networks?.map((network) => (
              <SelectItem key={network.id} value={network.id}>
                {network.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedNetwork && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Data Plan</label>
          {plansLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : plansError ? (
            <ErrorDisplay
              title="Failed to Load Data Plans"
              message={plansError}
              onRetry={refetchPlans}
              retryText="Retry Loading Plans"
            />
          ) : (
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a data plan" />
              </SelectTrigger>
              <SelectContent>
                {dataPlans?.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - ₦{plan.amount}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
      
      {/* Implement data bundle purchase functionality here */}
    </div>
  )
}
