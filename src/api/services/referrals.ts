/**
 * Referrals API Service
 * 
 * Handles referral statistics, history, and withdrawals
 */

import { BaseEndpoint } from '../endpoints/base'
import type { 
  ApiResponse,
  ListRequest,
  PaginatedResponse
} from '../types'

// Define referral-related types since they may be missing from main types
export interface ReferralStats {
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  availableBalance: number
  pendingWithdrawals: number
  thisMonthEarnings: number
  thisMonthReferrals: number
  conversionRate: number
  referralCode: string
  referralUrl: string
}

export interface ReferralRecord {
  id: string
  referredUserId: string
  referredUserName: string
  referredUserEmail: string
  joinedAt: string
  status: 'pending' | 'active' | 'inactive'
  totalTransactions: number
  totalSpent: number
  commissionEarned: number
  lastActivity?: string
}

export interface WithdrawalRecord {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  method: 'wallet' | 'bank_transfer'
  requestedAt: string
  processedAt?: string
  completedAt?: string
  reference: string
  bankDetails?: {
    accountName: string
    accountNumber: string
    bankName: string
  }
  failureReason?: string
}

export interface CreateWithdrawalRequest {
  amount: number
  method: 'wallet' | 'bank_transfer'
  bankDetails?: {
    accountNumber: string
    bankCode: string
  }
  pin: string
}

export class ReferralsService extends BaseEndpoint {
  constructor() {
    super('') // Base URL is handled by httpClient
  }

  /**
   * Get referral statistics
   */
  async getReferralStats(): Promise<ApiResponse<ReferralStats>> {
    return this.get<ReferralStats>('/user/referral/stats')
  }

  /**
   * Get referral history with pagination
   */
  async getReferralHistory(
    params: ListRequest = {}
  ): Promise<ApiResponse<PaginatedResponse<ReferralRecord>>> {
    return this.getList<ReferralRecord>('/user/referral/history', params)
  }

  /**
   * Get all referrals (for backward compatibility)
   */
  async getAllReferrals(): Promise<ApiResponse<ReferralRecord[]>> {
    return this.get<ReferralRecord[]>('/user/referral/history?limit=1000')
  }

  /**
   * Get withdrawal history with pagination
   */
  async getWithdrawalHistory(
    params: ListRequest = {}
  ): Promise<ApiResponse<PaginatedResponse<WithdrawalRecord>>> {
    return this.getList<WithdrawalRecord>('/user/referral/withdrawals', params)
  }

  /**
   * Get all withdrawals (for backward compatibility)
   */
  async getAllWithdrawals(): Promise<ApiResponse<WithdrawalRecord[]>> {
    return this.get<WithdrawalRecord[]>('/user/referral/withdrawals?limit=1000')
  }

  /**
   * Get detailed referral information by ID
   */
  async getReferralDetails(referralId: string): Promise<ApiResponse<ReferralRecord & {
    transactionHistory: Array<{
      id: string
      type: string
      amount: number
      commission: number
      date: string
    }>
    monthlyBreakdown: Array<{
      month: string
      transactions: number
      commission: number
    }>
  }>> {
    return this.get<ReferralRecord & {
      transactionHistory: Array<{
        id: string
        type: string
        amount: number
        commission: number
        date: string
      }>
      monthlyBreakdown: Array<{
        month: string
        transactions: number
        commission: number
      }>
    }>(`/user/referral/details/${referralId}`)
  }

  /**
   * Request withdrawal of referral earnings
   */
  async requestWithdrawal(request: CreateWithdrawalRequest): Promise<ApiResponse<{
    withdrawalId: string
    reference: string
    status: string
    estimatedCompletionTime?: string
  }>> {
    return this.post<{
      withdrawalId: string
      reference: string
      status: string
      estimatedCompletionTime?: string
    }>('/user/referral/withdraw', request)
  }

  /**
   * Cancel pending withdrawal
   */
  async cancelWithdrawal(withdrawalId: string): Promise<ApiResponse<{
    status: string
    message: string
    refundedAmount: number
  }>> {
    return this.post<{
      status: string
      message: string
      refundedAmount: number
    }>(`/user/referral/withdrawals/${withdrawalId}/cancel`, {})
  }

  /**
   * Get referral commission rates and settings
   */
  async getCommissionSettings(): Promise<ApiResponse<{
    rates: {
      directReferral: number
      indirectReferral: number
      transactionCommission: number
    }
    minimumWithdrawal: number
    withdrawalFee: number
    payoutSchedule: string
    terms: string[]
  }>> {
    return this.get<{
      rates: {
        directReferral: number
        indirectReferral: number
        transactionCommission: number
      }
      minimumWithdrawal: number
      withdrawalFee: number
      payoutSchedule: string
      terms: string[]
    }>('/user/referral/settings')
  }

  /**
   * Generate new referral code
   */
  async generateReferralCode(customCode?: string): Promise<ApiResponse<{
    referralCode: string
    referralUrl: string
    qrCodeUrl: string
  }>> {
    return this.post<{
      referralCode: string
      referralUrl: string
      qrCodeUrl: string
    }>('/user/referral/generate-code', {
      custom_code: customCode
    })
  }

  /**
   * Get referral leaderboard
   */
  async getReferralLeaderboard(
    period: 'week' | 'month' | 'year' = 'month',
    limit: number = 10
  ): Promise<ApiResponse<Array<{
    rank: number
    userId: string
    userName: string
    totalReferrals: number
    totalEarnings: number
    badge?: string
  }>>> {
    return this.get<Array<{
      rank: number
      userId: string
      userName: string
      totalReferrals: number
      totalEarnings: number
      badge?: string
    }>>(`/user/referral/leaderboard?period=${period}&limit=${limit}`)
  }

  /**
   * Get referral analytics for a specific period
   */
  async getReferralAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<{
    totalEarnings: number
    totalReferrals: number
    conversionRate: number
    averageEarningsPerReferral: number
    dailyBreakdown: Array<{
      date: string
      referrals: number
      earnings: number
    }>
    topPerformingChannels: Array<{
      channel: string
      referrals: number
      conversionRate: number
    }>
  }>> {
    const params: any = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    
    const queryString = this.buildQueryString(params)
    return this.get<{
      totalEarnings: number
      totalReferrals: number
      conversionRate: number
      averageEarningsPerReferral: number
      dailyBreakdown: Array<{
        date: string
        referrals: number
        earnings: number
      }>
      topPerformingChannels: Array<{
        channel: string
        referrals: number
        conversionRate: number
      }>
    }>(`/user/referral/analytics${queryString}`)
  }
}

// Export singleton instance
export const referralsService = new ReferralsService()

