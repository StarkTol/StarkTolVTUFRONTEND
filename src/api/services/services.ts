/**
 * Services API Service
 * 
 * Handles all VTU service providers, plans, products, and service operations
 */

import { BaseEndpoint, ENDPOINTS } from '../endpoints/base'
import type { 
  ApiResponse,
  ServiceProvider,
  ServiceCategory,
  AirtimeProvider,
  DataProvider,
  DataPlan,
  CableProvider,
  CablePlan,
  ElectricityProvider,
  ExamCardProvider,
  ExamCardProduct,
  RechargeCardProvider,
  AirtimePurchaseRequest,
  AirtimePurchaseResponse,
  DataPurchaseRequest,
  DataPurchaseResponse,
  CablePurchaseRequest,
  CablePurchaseResponse,
  CableValidationRequest,
  CableValidationResponse,
  ElectricityPurchaseRequest,
  ElectricityPurchaseResponse,
  ElectricityValidationRequest,
  ElectricityValidationResponse,
  ExamCardPurchaseRequest,
  ExamCardPurchaseResponse,
  RechargeCardPurchaseRequest,
  RechargeCardPurchaseResponse,
  ListRequest
} from '../types'

export class ServicesService extends BaseEndpoint {
  constructor() {
    super('')
  }

  // ============ AIRTIME SERVICES ============

  /**
   * Get all airtime providers
   */
  async getAirtimeProviders(): Promise<ApiResponse<AirtimeProvider[]>> {
    return this.get<AirtimeProvider[]>(ENDPOINTS.SERVICES.AIRTIME.PROVIDERS)
  }

  /**
   * Purchase airtime
   */
  async purchaseAirtime(request: AirtimePurchaseRequest): Promise<ApiResponse<AirtimePurchaseResponse>> {
    return this.post<AirtimePurchaseResponse>(ENDPOINTS.SERVICES.AIRTIME.PURCHASE, request)
  }

  /**
   * Validate phone number for airtime purchase
   */
  async validateAirtimeNumber(phoneNumber: string, providerId: string): Promise<ApiResponse<{
    valid: boolean
    network?: string
    message?: string
  }>> {
    return this.post<{
      valid: boolean
      network?: string
      message?: string
    }>(ENDPOINTS.SERVICES.AIRTIME.VALIDATE, {
      phone_number: phoneNumber,
      provider: providerId
    })
  }

  // ============ DATA SERVICES ============

  /**
   * Get all data providers
   */
  async getDataProviders(): Promise<ApiResponse<DataProvider[]>> {
    return this.get<DataProvider[]>(ENDPOINTS.SERVICES.DATA.PROVIDERS)
  }

  /**
   * Get data plans for a specific provider
   */
  async getDataPlans(providerId: string): Promise<ApiResponse<DataPlan[]>> {
    return this.get<DataPlan[]>(`${ENDPOINTS.SERVICES.DATA.PLANS}?provider=${providerId}`)
  }

  /**
   * Get data bundles for a specific provider (alternative endpoint)
   */
  async getDataBundles(providerId: string): Promise<ApiResponse<DataPlan[]>> {
    return this.get<DataPlan[]>(`/services/data/bundles?provider=${providerId}`)
  }

  /**
   * Get all data bundles for all providers
   */
  async getAllDataBundles(): Promise<ApiResponse<Record<string, DataPlan[]>>> {
    return this.get<Record<string, DataPlan[]>>('/services/data/bundles/all')
  }

  /**
   * Purchase data bundle
   */
  async purchaseData(request: DataPurchaseRequest): Promise<ApiResponse<DataPurchaseResponse>> {
    return this.post<DataPurchaseResponse>(ENDPOINTS.SERVICES.DATA.PURCHASE, request)
  }

  /**
   * Validate phone number for data purchase
   */
  async validateDataNumber(phoneNumber: string, providerId: string): Promise<ApiResponse<{
    valid: boolean
    network?: string
    message?: string
  }>> {
    return this.post<{
      valid: boolean
      network?: string
      message?: string
    }>(ENDPOINTS.SERVICES.DATA.VALIDATE, {
      phone_number: phoneNumber,
      provider: providerId
    })
  }

  // ============ CABLE TV SERVICES ============

  /**
   * Get all cable TV providers
   */
  async getCableProviders(): Promise<ApiResponse<CableProvider[]>> {
    return this.get<CableProvider[]>(ENDPOINTS.SERVICES.CABLE.PROVIDERS)
  }

  /**
   * Get cable TV plans for a specific provider
   */
  async getCablePlans(providerId: string): Promise<ApiResponse<CablePlan[]>> {
    return this.get<CablePlan[]>(`${ENDPOINTS.SERVICES.CABLE.PLANS}?provider=${providerId}`)
  }

  /**
   * Validate smart card number
   */
  async validateCableCard(request: CableValidationRequest): Promise<ApiResponse<CableValidationResponse>> {
    return this.post<CableValidationResponse>(ENDPOINTS.SERVICES.CABLE.VALIDATE, request)
  }

  /**
   * Purchase cable TV subscription
   */
  async purchaseCable(request: CablePurchaseRequest): Promise<ApiResponse<CablePurchaseResponse>> {
    return this.post<CablePurchaseResponse>(ENDPOINTS.SERVICES.CABLE.PURCHASE, request)
  }

  // ============ ELECTRICITY SERVICES ============

  /**
   * Get all electricity providers
   */
  async getElectricityProviders(): Promise<ApiResponse<ElectricityProvider[]>> {
    return this.get<ElectricityProvider[]>(ENDPOINTS.SERVICES.ELECTRICITY.PROVIDERS)
  }

  /**
   * Validate meter number
   */
  async validateMeter(request: ElectricityValidationRequest): Promise<ApiResponse<ElectricityValidationResponse>> {
    return this.post<ElectricityValidationResponse>(ENDPOINTS.SERVICES.ELECTRICITY.VALIDATE, request)
  }

  /**
   * Purchase electricity units
   */
  async purchaseElectricity(request: ElectricityPurchaseRequest): Promise<ApiResponse<ElectricityPurchaseResponse>> {
    return this.post<ElectricityPurchaseResponse>(ENDPOINTS.SERVICES.ELECTRICITY.PURCHASE, request)
  }

  // ============ EXAM CARDS SERVICES ============

  /**
   * Get all exam card providers
   */
  async getExamProviders(): Promise<ApiResponse<ExamCardProvider[]>> {
    return this.get<ExamCardProvider[]>(ENDPOINTS.SERVICES.EXAM_CARDS.PROVIDERS)
  }

  /**
   * Get exam card products for a specific provider
   */
  async getExamProducts(providerId: string): Promise<ApiResponse<ExamCardProduct[]>> {
    return this.get<ExamCardProduct[]>(`${ENDPOINTS.SERVICES.EXAM_CARDS.PRODUCTS}?provider=${providerId}`)
  }

  /**
   * Purchase exam card
   */
  async purchaseExamCard(request: ExamCardPurchaseRequest): Promise<ApiResponse<ExamCardPurchaseResponse>> {
    return this.post<ExamCardPurchaseResponse>(ENDPOINTS.SERVICES.EXAM_CARDS.PURCHASE, request)
  }

  // ============ RECHARGE CARDS SERVICES ============

  /**
   * Get all recharge card providers
   */
  async getRechargeCardProviders(): Promise<ApiResponse<RechargeCardProvider[]>> {
    return this.get<RechargeCardProvider[]>(ENDPOINTS.SERVICES.RECHARGE_CARDS.PROVIDERS)
  }

  /**
   * Get supported denominations for a provider
   */
  async getRechargeCardDenominations(providerId: string): Promise<ApiResponse<number[]>> {
    return this.get<number[]>(`/services/recharge-cards/denominations?provider=${providerId}`)
  }

  /**
   * Purchase recharge card
   */
  async purchaseRechargeCard(request: RechargeCardPurchaseRequest): Promise<ApiResponse<RechargeCardPurchaseResponse>> {
    return this.post<RechargeCardPurchaseResponse>(ENDPOINTS.SERVICES.RECHARGE_CARDS.PURCHASE, request)
  }

  // ============ GENERAL SERVICE OPERATIONS ============

  /**
   * Get service menu for dashboard quick actions
   */
  async getServiceMenu(): Promise<ApiResponse<Array<{
    id: string
    name: string
    slug: string
    icon: string
    description: string
    category: ServiceCategory
    isActive: boolean
    route: string
  }>>> {
    return this.get<Array<{
      id: string
      name: string
      slug: string
      icon: string
      description: string
      category: ServiceCategory
      isActive: boolean
      route: string
    }>>('/services/menu')
  }

  /**
   * Get service pricing information
   */
  async getServicePricing(): Promise<ApiResponse<{
    discountRates: Record<ServiceCategory, number>
    minimumAmounts: Record<ServiceCategory, number>
    maximumAmounts: Record<ServiceCategory, number>
    commissionRates: Record<ServiceCategory, number>
    features: Record<ServiceCategory, string[]>
  }>> {
    return this.get<{
      discountRates: Record<ServiceCategory, number>
      minimumAmounts: Record<ServiceCategory, number>
      maximumAmounts: Record<ServiceCategory, number>
      commissionRates: Record<ServiceCategory, number>
      features: Record<ServiceCategory, string[]>
    }>('/services/pricing')
  }

  /**
   * Get all service providers by category
   */
  async getProvidersByCategory(category: ServiceCategory): Promise<ApiResponse<ServiceProvider[]>> {
    return this.get<ServiceProvider[]>(`/services/providers?category=${category}`)
  }

  /**
   * Get provider details by ID
   */
  async getProviderDetails(providerId: string): Promise<ApiResponse<ServiceProvider & {
    plans?: any[]
    products?: any[]
    supportInfo?: {
      phone?: string
      email?: string
      website?: string
    }
    statistics?: {
      totalTransactions: number
      successRate: number
      averageResponseTime: number
    }
  }>> {
    return this.get<ServiceProvider & {
      plans?: any[]
      products?: any[]
      supportInfo?: {
        phone?: string
        email?: string
        website?: string
      }
      statistics?: {
        totalTransactions: number
        successRate: number
        averageResponseTime: number
      }
    }>(`/services/providers/${providerId}`)
  }

  /**
   * Check service availability/status
   */
  async checkServiceStatus(category?: ServiceCategory): Promise<ApiResponse<{
    services: Array<{
      category: ServiceCategory
      status: 'active' | 'maintenance' | 'inactive'
      message?: string
      estimatedDowntime?: string
    }>
    lastUpdated: string
  }>> {
    const query = category ? `?category=${category}` : ''
    return this.get<{
      services: Array<{
        category: ServiceCategory
        status: 'active' | 'maintenance' | 'inactive'
        message?: string
        estimatedDowntime?: string
      }>
      lastUpdated: string
    }>(`/services/status${query}`)
  }

  /**
   * Get service features by category
   */
  async getServiceFeatures(): Promise<ApiResponse<Array<{
    category: ServiceCategory
    name: string
    description: string
    features: string[]
    benefits: string[]
    icon: string
    color: string
  }>>> {
    return this.get<Array<{
      category: ServiceCategory
      name: string
      description: string
      features: string[]
      benefits: string[]
      icon: string
      color: string
    }>>('/content/services')
  }
}

// Export singleton instance
export const servicesService = new ServicesService()
