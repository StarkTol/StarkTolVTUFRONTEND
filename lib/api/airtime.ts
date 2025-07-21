import api from '@/lib/api'
import { executeApiRequest, ApiResponse } from './error-handler'
import { 
  AirtimeProvider,
  AirtimePurchaseRequest,
  AirtimePurchaseResponse,
  BaseTransaction,
  ValidationResponse,
  ServiceResponse
} from './types'

/**
 * Airtime API Service
 * Thin wrapper around the axios instance with typed responses
 */
export class AirtimeApiService {
  /**
   * Get all available airtime providers
   */
  static async getAirtimeProviders(): Promise<ServiceResponse<AirtimeProvider[]>> {
    return executeApiRequest<AirtimeProvider[]>(
      () => api.get('/services/airtime/providers'),
      'Airtime providers loaded successfully',
      'Failed to load airtime providers'
    )
  }

  /**
   * Purchase airtime
   */
  static async buyAirtime(payload: AirtimePurchaseRequest): Promise<ServiceResponse<AirtimePurchaseResponse['data']>> {
    return executeApiRequest<AirtimePurchaseResponse['data']>(
      () => api.post('/services/airtime/purchase', {
        provider: payload.provider,
        phone_number: payload.phoneNumber,
        amount: payload.amount,
        payment_method: payload.paymentMethod
      }),
      'Airtime purchase completed successfully',
      'Failed to purchase airtime',
      true // Show success toast
    )
  }

  /**
   * Get recent airtime transactions
   */
  static async getRecentAirtimeTransactions(limit: number = 10): Promise<ServiceResponse<BaseTransaction[]>> {
    return executeApiRequest<BaseTransaction[]>(
      () => api.get(`/transactions?type=airtime&limit=${limit}`),
      'Recent airtime transactions retrieved',
      'Failed to load recent transactions'
    )
  }

  /**
   * Validate phone number for airtime purchase
   */
  static async validatePhoneNumber(phoneNumber: string, provider: string): Promise<ServiceResponse<ValidationResponse>> {
    return executeApiRequest<ValidationResponse>(
      () => api.post('/services/airtime/validate', {
        phone_number: phoneNumber,
        provider: provider
      }),
      'Phone number validated successfully',
      'Phone number validation failed'
    )
  }

  /**
   * Get airtime transaction details by reference
   */
  static async getAirtimeTransaction(reference: string): Promise<ServiceResponse<BaseTransaction>> {
    return executeApiRequest<BaseTransaction>(
      () => api.get(`/transactions/airtime/${reference}`),
      'Transaction details retrieved',
      'Failed to load transaction details'
    )
  }
}

// Export individual functions for convenience
export const getAirtimeProviders = AirtimeApiService.getAirtimeProviders
export const buyAirtime = AirtimeApiService.buyAirtime
export const getRecentAirtimeTransactions = AirtimeApiService.getRecentAirtimeTransactions
export const validateAirtimePhoneNumber = AirtimeApiService.validatePhoneNumber
export const getAirtimeTransaction = AirtimeApiService.getAirtimeTransaction

// Export service instance
export default AirtimeApiService
