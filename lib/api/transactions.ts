import api from '@/lib/axios-instance'
import { executeApiRequest } from './error-handler'
import { BaseTransaction, ServiceResponse } from './types'

/**
 * Transactions API Service
 * Handles all transaction-related API calls
 */
export class TransactionsApiService {
  /**
   * Get all transactions with optional filters
   */
  static async getAllTransactions(
    limit: number = 20,
    offset: number = 0,
    type?: string,
    status?: 'success' | 'pending' | 'failed',
    dateFrom?: string,
    dateTo?: string
  ): Promise<ServiceResponse<BaseTransaction[]>> {
    return executeApiRequest<BaseTransaction[]>(
      () => {
        let url = `/transactions?limit=${limit}&offset=${offset}`
        if (type) url += `&type=${type}`
        if (status) url += `&status=${status}`
        if (dateFrom) url += `&date_from=${dateFrom}`
        if (dateTo) url += `&date_to=${dateTo}`
        return api.get(url)
      },
      'Transactions retrieved successfully',
      'Failed to load transactions'
    )
  }

  /**
   * Get transaction by reference
   */
  static async getTransactionByReference(reference: string): Promise<ServiceResponse<BaseTransaction>> {
    return executeApiRequest<BaseTransaction>(
      () => api.get(`/transactions/${reference}`),
      'Transaction details retrieved',
      'Failed to load transaction details'
    )
  }

  /**
   * Get recent transactions for dashboard
   */
  static async getRecentTransactions(limit: number = 10): Promise<ServiceResponse<BaseTransaction[]>> {
    return executeApiRequest<BaseTransaction[]>(
      () => api.get(`/transactions/recent?limit=${limit}`),
      'Recent transactions retrieved',
      'Failed to load recent transactions'
    )
  }

  /**
   * Get transaction statistics
   */
  static async getTransactionStats(
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<ServiceResponse<{
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    totalAmount: number;
    averageAmount: number;
    topServices: { service: string; count: number; amount: number }[];
  }>> {
    return executeApiRequest<{
      totalTransactions: number;
      successfulTransactions: number;
      failedTransactions: number;
      pendingTransactions: number;
      totalAmount: number;
      averageAmount: number;
      topServices: { service: string; count: number; amount: number }[];
    }>(
      () => api.get(`/transactions/stats?period=${period}`),
      'Transaction statistics retrieved',
      'Failed to load transaction statistics'
    )
  }

  /**
   * Download transaction receipt
   */
  static async downloadReceipt(reference: string): Promise<ServiceResponse<{ url: string }>> {
    return executeApiRequest<{ url: string }>(
      () => api.get(`/transactions/${reference}/receipt`),
      'Receipt generated successfully',
      'Failed to generate receipt'
    )
  }

  /**
   * Export transactions to CSV/Excel
   */
  static async exportTransactions(
    format: 'csv' | 'excel' = 'csv',
    filters?: {
      type?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<ServiceResponse<{ downloadUrl: string }>> {
    return executeApiRequest<{ downloadUrl: string }>(
      () => api.post('/transactions/export', { format, ...filters }),
      `Transactions exported to ${format.toUpperCase()}`,
      'Failed to export transactions'
    )
  }
}

// Export individual functions for convenience
export const getAllTransactions = TransactionsApiService.getAllTransactions
export const getTransactionByReference = TransactionsApiService.getTransactionByReference
export const getRecentTransactions = TransactionsApiService.getRecentTransactions
export const getTransactionStats = TransactionsApiService.getTransactionStats
export const downloadTransactionReceipt = TransactionsApiService.downloadReceipt
export const exportTransactions = TransactionsApiService.exportTransactions

// Export service instance
export default TransactionsApiService
