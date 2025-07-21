import api from '@/lib/api'
import { executeApiRequest } from './error-handler'
import { 
  BaseProvider,
  BaseTransaction,
  PaymentMethod,
  ServiceResponse
} from './types'

// Recharge cards specific types
export interface RechargeCardProvider extends BaseProvider {}

export interface RechargeCardPurchaseRequest {
  provider: string
  denomination: number
  quantity: number
  paymentMethod: PaymentMethod
}

export interface RechargeCardPurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    cards: Array<{
      pin: string
      serial: string
      denomination: number
    }>
    provider: string
    quantity: number
    totalAmount: number
  }
}

/**
 * Recharge Cards API Service
 * Thin wrapper around the axios instance with typed responses
 */
export class RechargeCardsApiService {
  /**
   * Get all available recharge card providers
   */
  static async getRechargeCardProviders(): Promise<ServiceResponse<RechargeCardProvider[]>> {
    return executeApiRequest<RechargeCardProvider[]>(
      () => api.get('/services/recharge-cards/providers'),
      'Recharge card providers loaded successfully',
      'Failed to load recharge card providers'
    )
  }

  /**
   * Get available denominations for a provider
   */
  static async getRechargeCardDenominations(providerId: string): Promise<ServiceResponse<number[]>> {
    return executeApiRequest<number[]>(
      () => api.get(`/services/recharge-cards/denominations?provider=${providerId}`),
      `Available denominations loaded for ${providerId}`,
      'Failed to load denominations'
    )
  }

  /**
   * Purchase recharge cards
   */
  static async buyRechargeCards(payload: RechargeCardPurchaseRequest): Promise<ServiceResponse<RechargeCardPurchaseResponse['data']>> {
    return executeApiRequest<RechargeCardPurchaseResponse['data']>(
      () => api.post('/services/recharge-cards/purchase', {
        provider: payload.provider,
        denomination: payload.denomination,
        quantity: payload.quantity,
        payment_method: payload.paymentMethod
      }),
      'Recharge cards generated successfully',
      'Failed to purchase recharge cards',
      true // Show success toast
    )
  }

  /**
   * Get recent recharge card transactions
   */
  static async getRecentRechargeCardTransactions(limit: number = 10): Promise<ServiceResponse<BaseTransaction[]>> {
    return executeApiRequest<BaseTransaction[]>(
      () => api.get(`/transactions?type=recharge_card&limit=${limit}`),
      'Recent recharge card transactions retrieved',
      'Failed to load recent transactions'
    )
  }

  /**
   * Get recharge card transaction details by reference
   */
  static async getRechargeCardTransaction(reference: string): Promise<ServiceResponse<BaseTransaction>> {
    return executeApiRequest<BaseTransaction>(
      () => api.get(`/transactions/recharge-cards/${reference}`),
      'Transaction details retrieved',
      'Failed to load transaction details'
    )
  }

  /**
   * Verify recharge card pins
   */
  static async verifyRechargeCardPins(pins: string[]): Promise<ServiceResponse<{ valid: boolean; details: any[] }>> {
    return executeApiRequest<{ valid: boolean; details: any[] }>(
      () => api.post('/services/recharge-cards/verify', { pins }),
      'Recharge card pins verified',
      'Failed to verify recharge card pins'
    )
  }

  /**
   * Get recharge card statistics for a provider
   */
  static async getRechargeCardStats(providerId: string): Promise<ServiceResponse<{
    totalSold: number;
    totalAmount: number;
    availableDenominations: number[];
    popularDenomination: number;
  }>> {
    return executeApiRequest<{
      totalSold: number;
      totalAmount: number;
      availableDenominations: number[];
      popularDenomination: number;
    }>(
      () => api.get(`/services/recharge-cards/stats?provider=${providerId}`),
      'Recharge card statistics retrieved',
      'Failed to load statistics'
    )
  }
}

// Export individual functions for convenience
export const getRechargeCardProviders = RechargeCardsApiService.getRechargeCardProviders
export const getRechargeCardDenominations = RechargeCardsApiService.getRechargeCardDenominations
export const buyRechargeCards = RechargeCardsApiService.buyRechargeCards
export const getRecentRechargeCardTransactions = RechargeCardsApiService.getRecentRechargeCardTransactions
export const getRechargeCardTransaction = RechargeCardsApiService.getRechargeCardTransaction
export const verifyRechargeCardPins = RechargeCardsApiService.verifyRechargeCardPins
export const getRechargeCardStats = RechargeCardsApiService.getRechargeCardStats

// Export service instance
export default RechargeCardsApiService
