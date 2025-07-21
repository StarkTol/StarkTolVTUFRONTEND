/**
 * Airtime Service API Endpoints
 */

import { BaseEndpoint, ENDPOINTS, validateRequired } from './base'
import type { 
  AirtimeProvider,
  AirtimePurchaseRequest,
  AirtimePurchaseResponse,
  Transaction,
  PaginatedResponse,
  ListRequest
} from '../types'
import type { ApiResponse } from '../httpClient'

export class AirtimeEndpoints extends BaseEndpoint {
  constructor() {
    super('') // No base URL prefix
  }

  /**
   * Get all available airtime providers
   */
  async getProviders(): Promise<ApiResponse<AirtimeProvider[]>> {
    return this.get<AirtimeProvider[]>(ENDPOINTS.SERVICES.AIRTIME.PROVIDERS)
  }

  /**
   * Get a specific airtime provider by ID
   */
  async getProvider(providerId: string): Promise<ApiResponse<AirtimeProvider>> {
    validateRequired({ providerId }, ['providerId'])
    return this.getById<AirtimeProvider>(ENDPOINTS.SERVICES.AIRTIME.PROVIDERS, providerId)
  }

  /**
   * Validate phone number for a specific provider
   */
  async validatePhoneNumber(
    phoneNumber: string,
    providerId: string
  ): Promise<ApiResponse<{
    valid: boolean
    formatted?: string
    carrier?: string
    message?: string
  }>> {
    validateRequired({ phoneNumber, providerId }, ['phoneNumber', 'providerId'])
    
    // Basic phone number validation
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      throw new Error('Invalid phone number format')
    }

    return this.post<{
      valid: boolean
      formatted?: string
      carrier?: string
      message?: string
    }>(ENDPOINTS.SERVICES.AIRTIME.VALIDATE, {
      phone_number: phoneNumber,
      provider_id: providerId
    })
  }

  /**
   * Purchase airtime
   */
  async purchaseAirtime(request: AirtimePurchaseRequest): Promise<ApiResponse<AirtimePurchaseResponse>> {
    validateRequired(request, ['providerId', 'phoneNumber', 'amount'])
    
    if (request.amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    // Basic phone number validation
    const cleanPhone = request.phoneNumber.replace(/\D/g, '')
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      throw new Error('Invalid phone number format')
    }

    // Transform request to match backend format
    const payload = {
      provider_id: request.providerId,
      phone_number: request.phoneNumber,
      amount: request.amount,
      transaction_pin: request.pin,
      save_as_beneficiary: request.saveAsBeneficiary,
      beneficiary_name: request.beneficiaryName
    }

    return this.post<AirtimePurchaseResponse>(ENDPOINTS.SERVICES.AIRTIME.PURCHASE, payload)
  }

  /**
   * Get recent airtime transactions
   */
  async getTransactions(
    params: ListRequest = {}
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const queryParams = {
      ...params,
      type: 'airtime' // Filter by airtime transactions
    }
    
    return this.getList<Transaction>('/transactions', queryParams)
  }

  /**
   * Get a specific airtime transaction by ID
   */
  async getTransaction(transactionId: string): Promise<ApiResponse<Transaction>> {
    validateRequired({ transactionId }, ['transactionId'])
    return this.getById<Transaction>('/transactions', transactionId)
  }

  /**
   * Retry a failed airtime transaction
   */
  async retryTransaction(transactionId: string): Promise<ApiResponse<{
    message: string
    newTransactionId: string
    status: string
  }>> {
    validateRequired({ transactionId }, ['transactionId'])
    
    return this.post<{
      message: string
      newTransactionId: string
      status: string
    }>(`/transactions/${transactionId}/retry`)
  }

  /**
   * Get airtime purchase history with analytics
   */
  async getPurchaseHistory(
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<ApiResponse<{
    totalAmount: number
    totalTransactions: number
    successRate: number
    topProviders: Array<{
      providerId: string
      providerName: string
      amount: number
      count: number
    }>
    monthlyTrend: Array<{
      month: string
      amount: number
      count: number
    }>
  }>> {
    return this.get<{
      totalAmount: number
      totalTransactions: number
      successRate: number
      topProviders: Array<{
        providerId: string
        providerName: string
        amount: number
        count: number
      }>
      monthlyTrend: Array<{
        month: string
        amount: number
        count: number
      }>
    }>(`/services/airtime/analytics?period=${period}`)
  }

  /**
   * Get frequently used phone numbers for airtime
   */
  async getFrequentNumbers(limit: number = 10): Promise<ApiResponse<Array<{
    phoneNumber: string
    providerId: string
    providerName: string
    lastUsed: string
    useCount: number
    totalAmount: number
  }>>> {
    return this.get<Array<{
      phoneNumber: string
      providerId: string
      providerName: string
      lastUsed: string
      useCount: number
      totalAmount: number
    }>>(`/services/airtime/frequent-numbers?limit=${limit}`)
  }

  /**
   * Check if phone number qualifies for discounts
   */
  async checkDiscountEligibility(
    phoneNumber: string,
    providerId: string,
    amount: number
  ): Promise<ApiResponse<{
    eligible: boolean
    discountPercent: number
    discountAmount: number
    finalAmount: number
    reason?: string
  }>> {
    validateRequired({ phoneNumber, providerId, amount }, ['phoneNumber', 'providerId', 'amount'])
    
    return this.post<{
      eligible: boolean
      discountPercent: number
      discountAmount: number
      finalAmount: number
      reason?: string
    }>('/services/airtime/check-discount', {
      phone_number: phoneNumber,
      provider_id: providerId,
      amount
    })
  }

  /**
   * Get airtime denomination suggestions based on usage patterns
   */
  async getDenominationSuggestions(
    phoneNumber?: string,
    providerId?: string
  ): Promise<ApiResponse<Array<{
    amount: number
    frequency: number
    discount?: number
    recommended: boolean
  }>>> {
    const params: any = {}
    if (phoneNumber) params.phone_number = phoneNumber
    if (providerId) params.provider_id = providerId
    
    const queryString = Object.keys(params).length > 0 
      ? `?${new URLSearchParams(params).toString()}` 
      : ''
    
    return this.get<Array<{
      amount: number
      frequency: number
      discount?: number
      recommended: boolean
    }>>(`/services/airtime/suggestions${queryString}`)
  }

  /**
   * Schedule airtime purchase for later
   */
  async scheduleAirtime(
    request: AirtimePurchaseRequest & {
      scheduledAt: string // ISO date string
      recurring?: {
        frequency: 'daily' | 'weekly' | 'monthly'
        endDate?: string
      }
    }
  ): Promise<ApiResponse<{
    scheduleId: string
    message: string
    nextExecution: string
  }>> {
    validateRequired(request, ['providerId', 'phoneNumber', 'amount', 'scheduledAt'])
    
    return this.post<{
      scheduleId: string
      message: string
      nextExecution: string
    }>('/services/airtime/schedule', {
      provider_id: request.providerId,
      phone_number: request.phoneNumber,
      amount: request.amount,
      scheduled_at: request.scheduledAt,
      recurring: request.recurring,
      transaction_pin: request.pin
    })
  }
}

// Create and export singleton instance
export const airtimeApi = new AirtimeEndpoints()

// Export individual functions for convenience
export const getAirtimeProviders = () => airtimeApi.getProviders()
export const getAirtimeProvider = (providerId: string) => airtimeApi.getProvider(providerId)
export const validateAirtimePhoneNumber = (phoneNumber: string, providerId: string) => 
  airtimeApi.validatePhoneNumber(phoneNumber, providerId)
export const purchaseAirtime = (request: AirtimePurchaseRequest) => airtimeApi.purchaseAirtime(request)
export const getAirtimeTransactions = (params?: ListRequest) => airtimeApi.getTransactions(params)
export const getAirtimeTransaction = (transactionId: string) => airtimeApi.getTransaction(transactionId)
export const retryAirtimeTransaction = (transactionId: string) => airtimeApi.retryTransaction(transactionId)
export const getAirtimePurchaseHistory = (period?: 'week' | 'month' | 'year') => 
  airtimeApi.getPurchaseHistory(period)
export const getFrequentAirtimeNumbers = (limit?: number) => airtimeApi.getFrequentNumbers(limit)
export const checkAirtimeDiscountEligibility = (phoneNumber: string, providerId: string, amount: number) => 
  airtimeApi.checkDiscountEligibility(phoneNumber, providerId, amount)
export const getAirtimeDenominationSuggestions = (phoneNumber?: string, providerId?: string) => 
  airtimeApi.getDenominationSuggestions(phoneNumber, providerId)
export const scheduleAirtime = (
  request: AirtimePurchaseRequest & { 
    scheduledAt: string
    recurring?: { frequency: 'daily' | 'weekly' | 'monthly'; endDate?: string }
  }
) => airtimeApi.scheduleAirtime(request)
