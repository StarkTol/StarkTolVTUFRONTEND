/**
 * useTransactions Hook
 * 
 * Custom hook for fetching transactions by service type
 */

import { useState, useEffect } from 'react'
import { transactionsService } from '@/src/api/services/transactions'
import type { Transaction, ServiceCategory } from '@/src/api/types'

export interface UseTransactionsResult {
  data: Transaction[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTransactions(type?: ServiceCategory, limit: number = 10): UseTransactionsResult {
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      let response
      if (type) {
        // Fetch transactions by specific type
        switch (type) {
          case 'cable':
            response = await transactionsService.getCableTransactions(limit)
            break
          case 'electricity':
            response = await transactionsService.getElectricityTransactions(limit)
            break
          case 'exam_cards':
            response = await transactionsService.getExamCardTransactions(limit)
            break
          case 'recharge_cards':
            response = await transactionsService.getRechargeCardTransactions(limit)
            break
          case 'airtime':
            response = await transactionsService.getAirtimeTransactions(limit)
            break
          case 'data':
            response = await transactionsService.getDataTransactions(limit)
            break
          default:
            response = await transactionsService.getRecentTransactions(limit)
        }
      } else {
        // Fetch all recent transactions
        response = await transactionsService.getRecentTransactions(limit)
      }

      if (response.success && response.data) {
        setData(Array.isArray(response.data) ? response.data : [])
      } else {
        setError(response.message || 'Failed to fetch transactions')
        setData([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [type, limit])

  return {
    data,
    loading,
    error,
    refetch: fetchTransactions
  }
}
