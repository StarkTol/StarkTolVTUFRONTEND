/**
 * VTU (Value Transfer Unit) API Endpoints
 * 
 * This module provides a unified API layer for all VTU services including:
 * - Airtime purchases
 * - Data bundle purchases  
 * - Cable TV subscriptions
 * - Electricity bill payments
 */

import { BaseEndpoint, ENDPOINTS, validateRequired } from './base'
import type { 
  // Network/Provider types
  AirtimeProvider,
  DataProvider,
  CableProvider,
  ElectricityProvider,
  
  // Data plan types
  DataPlan,
  CablePlan,
  
  // Purchase request types
  AirtimePurchaseRequest,
  AirtimePurchaseResponse,
  DataPurchaseRequest,
  DataPurchaseResponse,
  CablePurchaseRequest,
  CablePurchaseResponse,
  ElectricityPurchaseRequest,
  ElectricityPurchaseResponse,
  
  // Validation types
  CableValidationRequest,
  CableValidationResponse,
  ElectricityValidationRequest,
  ElectricityValidationResponse,
  
  // Common types
  ServiceProvider,
  PaginatedResponse,
  ListRequest
} from '../types'
import type { ApiResponse } from '../httpClient'

export class VTUEndpoints extends BaseEndpoint {
  constructor() {
    super('') // No base URL prefix
  }

  // ===== Network Provider Methods =====

  /**
   * Get all available networks/providers across all services
   */
  async getNetworks(): Promise<ApiResponse<ServiceProvider[]>> {
    // Fetch all providers from different services
    const [airtimeProviders, dataProviders, cableProviders, electricityProviders] = await Promise.all([
      this.get<AirtimeProvider[]>(ENDPOINTS.SERVICES.AIRTIME.PROVIDERS),
      this.get<DataProvider[]>(ENDPOINTS.SERVICES.DATA.PROVIDERS),
      this.get<CableProvider[]>(ENDPOINTS.SERVICES.CABLE.PROVIDERS),
      this.get<ElectricityProvider[]>(ENDPOINTS.SERVICES.ELECTRICITY.PROVIDERS)
    ])

    // Combine all providers
    const allNetworks: ServiceProvider[] = [
      ...(airtimeProviders.data || []),
      ...(dataProviders.data || []),
      ...(cableProviders.data || []),
      ...(electricityProviders.data || [])
    ]

    return {
      success: true,
      data: allNetworks,
      message: 'Networks retrieved successfully'
    }
  }

  /**
   * Get airtime providers/networks
   */
  async getAirtimeProviders(): Promise<ApiResponse<AirtimeProvider[]>> {
    return this.get<AirtimeProvider[]>(ENDPOINTS.SERVICES.AIRTIME.PROVIDERS)
  }

  /**
   * Get data providers/networks
   */
  async getDataProviders(): Promise<ApiResponse<DataProvider[]>> {
    return this.get<DataProvider[]>(ENDPOINTS.SERVICES.DATA.PROVIDERS)
  }

  // ===== Data Plan Methods =====

  /**
   * Get data plans for a specific network provider
   */
  async getDataPlans(networkId: string): Promise<ApiResponse<DataPlan[]>> {
    validateRequired({ networkId }, ['networkId'])
    
    return this.get<DataPlan[]>(`${ENDPOINTS.SERVICES.DATA.PLANS}?provider_id=${networkId}`)
  }

  /**
   * Get a specific data plan by ID
   */
  async getDataPlan(planId: string): Promise<ApiResponse<DataPlan>> {
    validateRequired({ planId }, ['planId'])
    
    return this.getById<DataPlan>(ENDPOINTS.SERVICES.DATA.PLANS, planId)
  }

  // ===== Cable Provider Methods =====

  /**
   * Get all cable TV providers
   */
  async getCableProviders(): Promise<ApiResponse<CableProvider[]>> {
    return this.get<CableProvider[]>(ENDPOINTS.SERVICES.CABLE.PROVIDERS)
  }

  /**
   * Get cable packages/plans for a specific provider
   */
  async getCablePackages(providerId: string): Promise<ApiResponse<CablePlan[]>> {
    validateRequired({ providerId }, ['providerId'])
    
    return this.get<CablePlan[]>(`${ENDPOINTS.SERVICES.CABLE.PLANS}?provider_id=${providerId}`)
  }

  /**
   * Get a specific cable package by ID
   */
  async getCablePackage(packageId: string): Promise<ApiResponse<CablePlan>> {
    validateRequired({ packageId }, ['packageId'])
    
    return this.getById<CablePlan>(ENDPOINTS.SERVICES.CABLE.PLANS, packageId)
  }

  /**
   * Validate cable smart card number
   */
  async validateCableCard(request: CableValidationRequest): Promise<ApiResponse<CableValidationResponse>> {
    validateRequired(request, ['providerId', 'smartCardNumber'])
    
    return this.post<CableValidationResponse>(ENDPOINTS.SERVICES.CABLE.VALIDATE, {
      provider_id: request.providerId,
      smart_card_number: request.smartCardNumber
    })
  }

  // ===== Electricity Provider Methods =====

  /**
   * Get all electricity providers
   */
  async getElectricityProviders(): Promise<ApiResponse<ElectricityProvider[]>> {
    return this.get<ElectricityProvider[]>(ENDPOINTS.SERVICES.ELECTRICITY.PROVIDERS)
  }

  /**
   * Get a specific electricity provider by ID
   */
  async getElectricityProvider(providerId: string): Promise<ApiResponse<ElectricityProvider>> {
    validateRequired({ providerId }, ['providerId'])
    
    return this.getById<ElectricityProvider>(ENDPOINTS.SERVICES.ELECTRICITY.PROVIDERS, providerId)
  }

  /**
   * Validate electricity meter number
   */
  async validateElectricityMeter(request: ElectricityValidationRequest): Promise<ApiResponse<ElectricityValidationResponse>> {
    validateRequired(request, ['providerId', 'meterNumber', 'meterType'])
    
    return this.post<ElectricityValidationResponse>(ENDPOINTS.SERVICES.ELECTRICITY.VALIDATE, {
      provider_id: request.providerId,
      meter_number: request.meterNumber,
      meter_type: request.meterType
    })
  }

  // ===== Purchase Methods =====

  /**
   * Purchase airtime
   */
  async purchaseAirtime(payload: AirtimePurchaseRequest): Promise<ApiResponse<AirtimePurchaseResponse>> {
    validateRequired(payload, ['providerId', 'phoneNumber', 'amount'])
    
    if (payload.amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    // Basic phone number validation
    const cleanPhone = payload.phoneNumber.replace(/\D/g, '')
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      throw new Error('Invalid phone number format')
    }

    // Transform request to match backend format
    const requestPayload = {
      provider_id: payload.providerId,
      phone_number: payload.phoneNumber,
      amount: payload.amount,
      transaction_pin: payload.pin,
      save_as_beneficiary: payload.saveAsBeneficiary,
      beneficiary_name: payload.beneficiaryName
    }

    return this.post<AirtimePurchaseResponse>(ENDPOINTS.SERVICES.AIRTIME.PURCHASE, requestPayload)
  }

  /**
   * Purchase data bundle
   */
  async purchaseData(payload: DataPurchaseRequest): Promise<ApiResponse<DataPurchaseResponse>> {
    validateRequired(payload, ['providerId', 'planId', 'phoneNumber'])
    
    // Basic phone number validation
    const cleanPhone = payload.phoneNumber.replace(/\D/g, '')
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      throw new Error('Invalid phone number format')
    }

    // Transform request to match backend format
    const requestPayload = {
      provider_id: payload.providerId,
      plan_id: payload.planId,
      phone_number: payload.phoneNumber,
      transaction_pin: payload.pin,
      save_as_beneficiary: payload.saveAsBeneficiary,
      beneficiary_name: payload.beneficiaryName
    }

    return this.post<DataPurchaseResponse>(ENDPOINTS.SERVICES.DATA.PURCHASE, requestPayload)
  }

  /**
   * Purchase cable TV subscription
   */
  async purchaseCable(payload: CablePurchaseRequest): Promise<ApiResponse<CablePurchaseResponse>> {
    validateRequired(payload, ['providerId', 'planId', 'smartCardNumber'])
    
    // Basic smart card validation (usually 10-12 digits)
    const cleanCardNumber = payload.smartCardNumber.replace(/\D/g, '')
    if (cleanCardNumber.length < 10 || cleanCardNumber.length > 12) {
      throw new Error('Invalid smart card number format')
    }

    // Transform request to match backend format
    const requestPayload = {
      provider_id: payload.providerId,
      plan_id: payload.planId,
      smart_card_number: payload.smartCardNumber,
      transaction_pin: payload.pin,
      save_as_beneficiary: payload.saveAsBeneficiary,
      beneficiary_name: payload.beneficiaryName
    }

    return this.post<CablePurchaseResponse>(ENDPOINTS.SERVICES.CABLE.PURCHASE, requestPayload)
  }

  /**
   * Purchase electricity/pay electricity bill
   */
  async purchaseElectricity(payload: ElectricityPurchaseRequest): Promise<ApiResponse<ElectricityPurchaseResponse>> {
    validateRequired(payload, ['providerId', 'meterNumber', 'amount', 'meterType'])
    
    if (payload.amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    // Basic meter number validation (usually 11-13 digits)
    const cleanMeterNumber = payload.meterNumber.replace(/\D/g, '')
    if (cleanMeterNumber.length < 10 || cleanMeterNumber.length > 13) {
      throw new Error('Invalid meter number format')
    }

    // Transform request to match backend format
    const requestPayload = {
      provider_id: payload.providerId,
      meter_number: payload.meterNumber,
      amount: payload.amount,
      meter_type: payload.meterType,
      customer_phone: payload.customerPhone,
      transaction_pin: payload.pin,
      save_as_beneficiary: payload.saveAsBeneficiary,
      beneficiary_name: payload.beneficiaryName
    }

    return this.post<ElectricityPurchaseResponse>(ENDPOINTS.SERVICES.ELECTRICITY.PURCHASE, requestPayload)
  }

  // ===== Utility Methods =====

  /**
   * Get transaction history for all VTU services
   */
  async getVTUTransactions(params: ListRequest & {
    service?: 'airtime' | 'data' | 'cable' | 'electricity'
    status?: 'pending' | 'completed' | 'failed'
    dateFrom?: string
    dateTo?: string
  } = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = {
      ...params,
      category: 'vtu' // Filter by VTU category
    }
    
    return this.getList<any>('/transactions', queryParams)
  }

  /**
   * Get VTU service statistics
   */
  async getVTUStats(period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    totalAmount: number
    totalTransactions: number
    successRate: number
    serviceBreakdown: {
      airtime: { amount: number; count: number }
      data: { amount: number; count: number }
      cable: { amount: number; count: number }
      electricity: { amount: number; count: number }
    }
    topProviders: Array<{
      providerId: string
      providerName: string
      amount: number
      count: number
    }>
  }>> {
    return this.get<{
      totalAmount: number
      totalTransactions: number
      successRate: number
      serviceBreakdown: {
        airtime: { amount: number; count: number }
        data: { amount: number; count: number }
        cable: { amount: number; count: number }
        electricity: { amount: number; count: number }
      }
      topProviders: Array<{
        providerId: string
        providerName: string
        amount: number
        count: number
      }>
    }>(`/services/vtu/stats?period=${period}`)
  }

  /**
   * Get frequently used beneficiaries across all VTU services
   */
  async getFrequentBeneficiaries(service?: 'airtime' | 'data' | 'cable' | 'electricity', limit: number = 10): Promise<ApiResponse<Array<{
    id: string
    service: string
    identifier: string // phone number, smart card, meter number
    providerId: string
    providerName: string
    lastUsed: string
    useCount: number
    totalAmount: number
  }>>> {
    const params: any = { limit }
    if (service) params.service = service
    
    const queryString = Object.keys(params).length > 0 
      ? `?${new URLSearchParams(params).toString()}` 
      : ''
    
    return this.get<Array<{
      id: string
      service: string
      identifier: string
      providerId: string
      providerName: string
      lastUsed: string
      useCount: number
      totalAmount: number
    }>>(`/services/vtu/frequent-beneficiaries${queryString}`)
  }

  /**
   * Verify service availability and get current rates
   */
  async getServiceRates(): Promise<ApiResponse<{
    airtime: { discountRate: number; available: boolean }
    data: { discountRate: number; available: boolean }
    cable: { discountRate: number; available: boolean }
    electricity: { discountRate: number; available: boolean }
    lastUpdated: string
  }>> {
    return this.get<{
      airtime: { discountRate: number; available: boolean }
      data: { discountRate: number; available: boolean }
      cable: { discountRate: number; available: boolean }
      electricity: { discountRate: number; available: boolean }
      lastUpdated: string
    }>('/services/vtu/rates')
  }
}

// Create and export singleton instance
export const vtuApi = new VTUEndpoints()

// Export individual functions for convenience
export const getNetworks = () => vtuApi.getNetworks()
export const getDataPlans = (networkId: string) => vtuApi.getDataPlans(networkId)
export const getCableProviders = () => vtuApi.getCableProviders()
export const getCablePackages = (providerId: string) => vtuApi.getCablePackages(providerId)
export const getElectricityProviders = () => vtuApi.getElectricityProviders()
export const purchaseAirtime = (payload: AirtimePurchaseRequest) => vtuApi.purchaseAirtime(payload)
export const purchaseData = (payload: DataPurchaseRequest) => vtuApi.purchaseData(payload)
export const purchaseCable = (payload: CablePurchaseRequest) => vtuApi.purchaseCable(payload)
export const purchaseElectricity = (payload: ElectricityPurchaseRequest) => vtuApi.purchaseElectricity(payload)

// Additional convenience exports
export const getAirtimeProviders = () => vtuApi.getAirtimeProviders()
export const getDataProviders = () => vtuApi.getDataProviders()
export const getDataPlan = (planId: string) => vtuApi.getDataPlan(planId)
export const getCablePackage = (packageId: string) => vtuApi.getCablePackage(packageId)
export const getElectricityProvider = (providerId: string) => vtuApi.getElectricityProvider(providerId)
export const validateCableCard = (request: CableValidationRequest) => vtuApi.validateCableCard(request)
export const validateElectricityMeter = (request: ElectricityValidationRequest) => vtuApi.validateElectricityMeter(request)
export const getVTUTransactions = (params?: ListRequest & {
  service?: 'airtime' | 'data' | 'cable' | 'electricity'
  status?: 'pending' | 'completed' | 'failed'
  dateFrom?: string
  dateTo?: string
}) => vtuApi.getVTUTransactions(params)
export const getVTUStats = (period?: 'week' | 'month' | 'year') => vtuApi.getVTUStats(period)
export const getFrequentBeneficiaries = (service?: 'airtime' | 'data' | 'cable' | 'electricity', limit?: number) => 
  vtuApi.getFrequentBeneficiaries(service, limit)
export const getServiceRates = () => vtuApi.getServiceRates()
