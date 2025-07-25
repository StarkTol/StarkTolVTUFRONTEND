/**
 * Transactions API Service
 * 
 * Handles transaction search, filtering, and management across all service types
 */

import { BaseEndpoint, ENDPOINTS, replaceUrlParams } from '../endpoints/base'
import type { 
  ApiResponse,
  Transaction,
  WalletTransaction,
  PaginatedResponse,
  ListRequest,
  TransactionFilter,
  ServiceCategory,
  BulkActionRequest,
  BulkActionResponse
} from '../types'

export interface TransactionSearchParams extends ListRequest {
  type?: ServiceCategory[]
  status?: Transaction['status'][]
  category?: Transaction['category'][]
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  search?: string
  providerId?: string
  reference?: string
}

export class TransactionsService extends BaseEndpoint {
  constructor() {
    super('')
  }

  /**
   * Get all transactions with advanced filtering and search
   */
  async getTransactions(
    params: TransactionSearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return this.getList<Transaction>(ENDPOINTS.TRANSACTIONS.LIST, params)
  }

  /**
   * Get transactions by specific service type
   */
  async getTransactionsByType(
    type: ServiceCategory,
    params: ListRequest = {}
  ): Promise<ApiResponse<Transaction[]>> {
    const queryParams = {
      ...params,
      type
    }
    return this.get<Transaction[]>(`${ENDPOINTS.TRANSACTIONS.LIST}${this.buildQueryString(queryParams)}`)
  }

  /**
   * Get exam card transactions
   */
  async getExamCardTransactions(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    return this.getTransactionsByType('exam_cards', { limit })
  }

  /**
   * Get cable TV transactions
   */
  async getCableTransactions(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    return this.getTransactionsByType('cable', { limit })
  }

  /**
   * Get electricity transactions
   */
  async getElectricityTransactions(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    return this.getTransactionsByType('electricity', { limit })
  }

  /**
   * Get recharge card transactions
   */
  async getRechargeCardTransactions(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    return this.getTransactionsByType('recharge_cards', { limit })
  }

  /**
   * Get airtime transactions
   */
  async getAirtimeTransactions(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    return this.getTransactionsByType('airtime', { limit })
  }

  /**
   * Get data transactions
   */
  async getDataTransactions(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    return this.getTransactionsByType('data', { limit })
  }

  /**
   * Get a specific transaction by ID
   */
  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    const url = replaceUrlParams(ENDPOINTS.TRANSACTIONS.BY_ID, { id })
    return this.get<Transaction>(url)
  }

  /**
   * Get transaction details with full metadata
   */
  async getTransactionDetails(id: string): Promise<ApiResponse<Transaction & {
    relatedTransactions?: Transaction[]
    timeline?: Array<{
      status: string
      timestamp: string
      message: string
      metadata?: any
    }>
  }>> {
    return this.get<Transaction & {
      relatedTransactions?: Transaction[]
      timeline?: Array<{
        status: string
        timestamp: string
        message: string
        metadata?: any
      }>
    }>(`/transactions/${id}/details`)
  }

  /**
   * Retry a failed transaction
   */
  async retryTransaction(id: string): Promise<ApiResponse<{
    newTransactionId: string
    status: string
    message: string
  }>> {
    const url = replaceUrlParams(ENDPOINTS.TRANSACTIONS.RETRY, { id })
    return this.post<{
      newTransactionId: string
      status: string
      message: string
    }>(url, {})
  }

  /**
   * Cancel a pending transaction
   */
  async cancelTransaction(id: string, reason?: string): Promise<ApiResponse<{
    status: string
    message: string
    refundAmount?: number
  }>> {
    const url = replaceUrlParams(ENDPOINTS.TRANSACTIONS.CANCEL, { id })
    return this.post<{
      status: string
      message: string
      refundAmount?: number
    }>(url, { reason })
  }

  /**
   * Get transaction statistics for a user
   */
  async getTransactionStats(
    period: 'day' | 'week' | 'month' | 'year' = 'month',
    serviceType?: ServiceCategory
  ): Promise<ApiResponse<{
    totalTransactions: number
    totalAmount: number
    successfulTransactions: number
    failedTransactions: number
    pendingTransactions: number
    averageAmount: number
    topServices: Array<{
      service: ServiceCategory
      count: number
      amount: number
      percentage: number
    }>
    dailyBreakdown?: Array<{
      date: string
      count: number
      amount: number
    }>
  }>> {
    const queryParams: any = { period }
    if (serviceType) {
      queryParams.service_type = serviceType
    }
    
    return this.get<{
      totalTransactions: number
      totalAmount: number
      successfulTransactions: number
      failedTransactions: number
      pendingTransactions: number
      averageAmount: number
      topServices: Array<{
        service: ServiceCategory
        count: number
        amount: number
        percentage: number
      }>
      dailyBreakdown?: Array<{
        date: string
        count: number
        amount: number
      }>
    }>(`/transactions/stats${this.buildQueryString(queryParams)}`)
  }

  /**
   * Export transactions to CSV/Excel
   */
  async exportTransactions(
    params: TransactionSearchParams & {
      format: 'csv' | 'excel'
      fields?: string[]
    }
  ): Promise<ApiResponse<{
    downloadUrl: string
    fileName: string
    expiresAt: string
  }>> {
    return this.post<{
      downloadUrl: string
      fileName: string
      expiresAt: string
    }>('/transactions/export', params)
  }

  /**
   * Bulk update transactions
   */
  async bulkUpdateTransactions(
    request: BulkActionRequest & {
      action: 'retry' | 'cancel' | 'mark_reviewed'
    }
  ): Promise<ApiResponse<BulkActionResponse>> {
    return this.post<BulkActionResponse>('/transactions/bulk-action', request)
  }

  /**
   * Get recent transactions across all services
   */
  async getRecentTransactions(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>(`${ENDPOINTS.TRANSACTIONS.LIST}?limit=${limit}&sortBy=createdAt&sortOrder=desc`)
  }

  /**
   * Search transactions by reference, phone number, or description
   */
  async searchTransactions(
    query: string,
    filters?: Partial<TransactionSearchParams>
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const params = {
      ...filters,
      search: query
    }
    return this.getList<Transaction>(ENDPOINTS.TRANSACTIONS.LIST, params)
  }

  /**
   * Get pending transactions that need attention
   */
  async getPendingTransactions(
    limit: number = 20
  ): Promise<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>(
      `${ENDPOINTS.TRANSACTIONS.LIST}?status=pending&limit=${limit}&sortBy=createdAt&sortOrder=asc`
    )
  }

  /**
   * Get failed transactions for retry
   */
  async getFailedTransactions(
    limit: number = 20
  ): Promise<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>(
      `${ENDPOINTS.TRANSACTIONS.LIST}?status=failed&limit=${limit}&sortBy=createdAt&sortOrder=desc`
    )
  }

  /**
   * Get transactions requiring manual review
   */
  async getTransactionsForReview(
    limit: number = 20
  ): Promise<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>(
      `/transactions/review-queue?limit=${limit}`
    )
  }
}

// Export singleton instance
export const transactionsService = new TransactionsService()
