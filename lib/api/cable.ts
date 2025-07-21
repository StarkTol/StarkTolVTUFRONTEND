import api from '@/lib/api'
import { executeApiRequest } from './error-handler'
import { 
  CableProvider,
  CablePlan,
  CablePurchaseRequest,
  CablePurchaseResponse,
  BaseTransaction,
  ValidationResponse,
  ServiceResponse
} from './types'

/**
 * Cable API Service
 * Thin wrapper around the axios instance with typed responses
 */
export class CableApiService {
  /**
   * Get all available cable providers
   */
  static async getCableProviders(): Promise<ServiceResponse<CableProvider[]>> {
    return executeApiRequest<CableProvider[]>(
      () => api.get('/services/cable/providers'),
      'Cable providers loaded successfully',
      'Failed to load cable providers'
    )
  }

  /**
   * Get cable plans for a specific provider
   */
  static async getCablePlans(providerId: string): Promise<ServiceResponse<CablePlan[]>> {
    return executeApiRequest<CablePlan[]>(
      () => api.get(`/services/cable/plans?provider=${providerId}`),
      `Cable plans loaded for ${providerId}`,
      'Failed to load cable plans'
    )
  }

  /**
   * Purchase cable subscription
   */
  static async buyCableSubscription(payload: CablePurchaseRequest): Promise<ServiceResponse<CablePurchaseResponse['data']>> {
    return executeApiRequest<CablePurchaseResponse['data']>(
      () => api.post('/services/cable/purchase', {
        provider: payload.provider,
        smart_card_number: payload.smartCardNumber,
        plan_id: payload.planId,
        payment_method: payload.paymentMethod
      }),
      'Cable subscription purchased successfully',
      'Failed to purchase cable subscription',
      true // Show success toast
    )
  }

  /**
   * Get recent cable transactions
   */
  static async getRecentCableTransactions(limit: number = 10): Promise<ServiceResponse<BaseTransaction[]>> {
    return executeApiRequest<BaseTransaction[]>(
      () => api.get(`/transactions?type=cable&limit=${limit}`),
      'Recent cable transactions retrieved',
      'Failed to load recent transactions'
    )
  }

  /**
   * Validate smart card number
   */
  static async validateSmartCard(smartCardNumber: string, provider: string): Promise<ServiceResponse<ValidationResponse>> {
    return executeApiRequest<ValidationResponse>(
      () => api.post('/services/cable/validate', {
        smart_card_number: smartCardNumber,
        provider: provider
      }),
      'Smart card validated successfully',
      'Smart card validation failed'
    )
  }

  /**
   * Get cable plan details by ID
   */
  static async getCablePlanDetails(planId: string): Promise<ServiceResponse<CablePlan>> {
    return executeApiRequest<CablePlan>(
      () => api.get(`/services/cable/plans/${planId}`),
      'Plan details retrieved',
      'Failed to load plan details'
    )
  }

  /**
   * Get cable transaction details by reference
   */
  static async getCableTransaction(reference: string): Promise<ServiceResponse<BaseTransaction>> {
    return executeApiRequest<BaseTransaction>(
      () => api.get(`/transactions/cable/${reference}`),
      'Transaction details retrieved',
      'Failed to load transaction details'
    )
  }

  /**
   * Get customer details by smart card number
   */
  static async getCustomerDetails(smartCardNumber: string, provider: string): Promise<ServiceResponse<ValidationResponse['customer']>> {
    return executeApiRequest<ValidationResponse['customer']>(
      () => api.post('/services/cable/customer', {
        smart_card_number: smartCardNumber,
        provider: provider
      }),
      'Customer details retrieved',
      'Failed to load customer details'
    )
  }
}

// Export individual functions for convenience
export const getCableProviders = CableApiService.getCableProviders
export const getCablePlans = CableApiService.getCablePlans
export const buyCableSubscription = CableApiService.buyCableSubscription
export const getRecentCableTransactions = CableApiService.getRecentCableTransactions
export const validateSmartCard = CableApiService.validateSmartCard
export const getCablePlanDetails = CableApiService.getCablePlanDetails
export const getCableTransaction = CableApiService.getCableTransaction
export const getCustomerDetails = CableApiService.getCustomerDetails

// Export service instance
export default CableApiService
