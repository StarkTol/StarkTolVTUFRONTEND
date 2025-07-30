import api from '@/lib/axios-instance'
import { executeApiRequest } from './error-handler'
import { 
  ElectricityProvider,
  ElectricityPurchaseRequest,
  ElectricityPurchaseResponse,
  BaseTransaction,
  ValidationResponse,
  ServiceResponse,
  MeterType
} from './types'

/**
 * Electricity API Service
 * Thin wrapper around the axios instance with typed responses
 */
export class ElectricityApiService {
  /**
   * Get all available electricity providers
   */
  static async getElectricityProviders(): Promise<ServiceResponse<ElectricityProvider[]>> {
    return executeApiRequest<ElectricityProvider[]>(
      () => api.get('/services/electricity/providers'),
      'Electricity providers loaded successfully',
      'Failed to load electricity providers'
    )
  }

  /**
   * Purchase electricity units
   */
  static async buyElectricity(payload: ElectricityPurchaseRequest): Promise<ServiceResponse<ElectricityPurchaseResponse['data']>> {
    return executeApiRequest<ElectricityPurchaseResponse['data']>(
      () => api.post('/services/electricity/purchase', {
        provider: payload.provider,
        meter_number: payload.meterNumber,
        amount: payload.amount,
        meter_type: payload.meterType,
        payment_method: payload.paymentMethod
      }),
      'Electricity purchased successfully',
      'Failed to purchase electricity',
      true // Show success toast
    )
  }

  /**
   * Get recent electricity transactions
   */
  static async getRecentElectricityTransactions(limit: number = 10): Promise<ServiceResponse<BaseTransaction[]>> {
    return executeApiRequest<BaseTransaction[]>(
      () => api.get(`/transactions?type=electricity&limit=${limit}`),
      'Recent electricity transactions retrieved',
      'Failed to load recent transactions'
    )
  }

  /**
   * Validate meter number
   */
  static async validateMeterNumber(
    meterNumber: string, 
    provider: string, 
    meterType: MeterType
  ): Promise<ServiceResponse<ValidationResponse>> {
    return executeApiRequest<ValidationResponse>(
      () => api.post('/services/electricity/validate', {
        meter_number: meterNumber,
        provider: provider,
        meter_type: meterType
      }),
      'Meter number validated successfully',
      'Meter number validation failed'
    )
  }

  /**
   * Get electricity transaction details by reference
   */
  static async getElectricityTransaction(reference: string): Promise<ServiceResponse<BaseTransaction>> {
    return executeApiRequest<BaseTransaction>(
      () => api.get(`/transactions/electricity/${reference}`),
      'Transaction details retrieved',
      'Failed to load transaction details'
    )
  }

  /**
   * Get customer details by meter number
   */
  static async getCustomerDetails(
    meterNumber: string, 
    provider: string, 
    meterType: MeterType
  ): Promise<ServiceResponse<ValidationResponse['customer']>> {
    return executeApiRequest<ValidationResponse['customer']>(
      () => api.post('/services/electricity/customer', {
        meter_number: meterNumber,
        provider: provider,
        meter_type: meterType
      }),
      'Customer details retrieved',
      'Failed to load customer details'
    )
  }

  /**
   * Get electricity tariff information
   */
  static async getTariffInfo(provider: string): Promise<ServiceResponse<{ rate: number; description: string }>> {
    return executeApiRequest<{ rate: number; description: string }>(
      () => api.get(`/services/electricity/tariff?provider=${provider}`),
      'Tariff information retrieved',
      'Failed to load tariff information'
    )
  }

  /**
   * Check electricity token status
   */
  static async checkTokenStatus(reference: string): Promise<ServiceResponse<{ token: string; status: string }>> {
    return executeApiRequest<{ token: string; status: string }>(
      () => api.get(`/services/electricity/token-status/${reference}`),
      'Token status retrieved',
      'Failed to check token status'
    )
  }
}

// Export individual functions for convenience
export const getElectricityProviders = ElectricityApiService.getElectricityProviders
export const buyElectricity = ElectricityApiService.buyElectricity
export const getRecentElectricityTransactions = ElectricityApiService.getRecentElectricityTransactions
export const validateMeterNumber = ElectricityApiService.validateMeterNumber
export const getElectricityTransaction = ElectricityApiService.getElectricityTransaction
export const getElectricityCustomerDetails = ElectricityApiService.getCustomerDetails
export const getElectricityTariffInfo = ElectricityApiService.getTariffInfo
export const checkElectricityTokenStatus = ElectricityApiService.checkTokenStatus

// Export service instance
export default ElectricityApiService
