import api from '@/lib/api'
import { executeApiRequest } from './error-handler'
import { 
  DataProvider,
  DataBundle,
  DataPurchaseRequest,
  DataPurchaseResponse,
  BaseTransaction,
  ValidationResponse,
  ServiceResponse
} from './types'

/**
 * Data API Service
 * Thin wrapper around the axios instance with typed responses
 */
export class DataApiService {
  /**
   * Get all available data providers
   */
  static async getDataProviders(): Promise<ServiceResponse<DataProvider[]>> {
    return executeApiRequest<DataProvider[]>(
      () => api.get('/services/data/providers'),
      'Data providers loaded successfully',
      'Failed to load data providers'
    )
  }

  /**
   * Get data bundles for a specific provider
   */
  static async getDataBundles(providerId: string): Promise<ServiceResponse<DataBundle[]>> {
    return executeApiRequest<DataBundle[]>(
      () => api.get(`/services/data/bundles?provider=${providerId}`),
      `Data bundles loaded for ${providerId}`,
      'Failed to load data bundles'
    )
  }

  /**
   * Get all data bundles grouped by provider
   */
  static async getAllDataBundles(): Promise<ServiceResponse<Record<string, DataBundle[]>>> {
    return executeApiRequest<Record<string, DataBundle[]>>(
      () => api.get('/services/data/bundles/all'),
      'All data bundles loaded successfully',
      'Failed to load data bundles'
    )
  }

  /**
   * Purchase data bundle
   */
  static async buyDataBundle(payload: DataPurchaseRequest): Promise<ServiceResponse<DataPurchaseResponse['data']>> {
    return executeApiRequest<DataPurchaseResponse['data']>(
      () => api.post('/services/data/purchase', {
        provider: payload.provider,
        phone_number: payload.phoneNumber,
        bundle_id: payload.bundleId,
        payment_method: payload.paymentMethod
      }),
      'Data bundle purchased successfully',
      'Failed to purchase data bundle',
      true // Show success toast
    )
  }

  /**
   * Get recent data transactions
   */
  static async getRecentDataTransactions(limit: number = 10): Promise<ServiceResponse<BaseTransaction[]>> {
    return executeApiRequest<BaseTransaction[]>(
      () => api.get(`/transactions?type=data&limit=${limit}`),
      'Recent data transactions retrieved',
      'Failed to load recent transactions'
    )
  }

  /**
   * Validate phone number for data service
   */
  static async validatePhoneNumber(phoneNumber: string, provider: string): Promise<ServiceResponse<ValidationResponse>> {
    return executeApiRequest<ValidationResponse>(
      () => api.post('/services/data/validate', {
        phone_number: phoneNumber,
        provider: provider
      }),
      'Phone number validated successfully',
      'Phone number validation failed'
    )
  }

  /**
   * Get data bundle details by ID
   */
  static async getDataBundleDetails(bundleId: string): Promise<ServiceResponse<DataBundle>> {
    return executeApiRequest<DataBundle>(
      () => api.get(`/services/data/bundles/${bundleId}`),
      'Bundle details retrieved',
      'Failed to load bundle details'
    )
  }

  /**
   * Get data transaction details by reference
   */
  static async getDataTransaction(reference: string): Promise<ServiceResponse<BaseTransaction>> {
    return executeApiRequest<BaseTransaction>(
      () => api.get(`/transactions/data/${reference}`),
      'Transaction details retrieved',
      'Failed to load transaction details'
    )
  }
}

// Export individual functions for convenience
export const getDataProviders = DataApiService.getDataProviders
export const getDataBundles = DataApiService.getDataBundles
export const getAllDataBundles = DataApiService.getAllDataBundles
export const buyDataBundle = DataApiService.buyDataBundle
export const getRecentDataTransactions = DataApiService.getRecentDataTransactions
export const validateDataPhoneNumber = DataApiService.validatePhoneNumber
export const getDataBundleDetails = DataApiService.getDataBundleDetails
export const getDataTransaction = DataApiService.getDataTransaction

// Export service instance
export default DataApiService
