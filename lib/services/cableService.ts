import api from '@/lib/api'

export interface CableProvider {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive'
}

export interface CablePlan {
  id: string
  name: string
  price: number
  validity: string
  provider: string
  description?: string
}

export interface CablePurchaseRequest {
  provider: string
  smartCardNumber: string
  planId: string
  paymentMethod: 'wallet' | 'card'
}

export interface CablePurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    plan: CablePlan
    smartCardNumber: string
  }
}

class CableService {
  /**
   * Get all available cable providers
   */
  async getProviders(): Promise<CableProvider[]> {
    try {
      const response = await api.get('/services/cable/providers')
      return response.data?.providers || response.data || []
    } catch (error) {
      console.error('Failed to fetch cable providers:', error)
      throw new Error('Failed to load cable providers')
    }
  }

  /**
   * Get cable plans for a specific provider
   */
  async getPlans(providerId: string): Promise<CablePlan[]> {
    try {
      const response = await api.get(`/services/cable/plans?provider=${providerId}`)
      return response.data?.plans || response.data || []
    } catch (error) {
      console.error(`Failed to fetch plans for ${providerId}:`, error)
      throw new Error('Failed to load cable plans')
    }
  }

  /**
   * Purchase cable subscription
   */
  async purchaseSubscription(request: CablePurchaseRequest): Promise<CablePurchaseResponse> {
    try {
      const response = await api.post('/services/cable/purchase', {
        provider: request.provider,
        smart_card_number: request.smartCardNumber,
        plan_id: request.planId,
        payment_method: request.paymentMethod
      })

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Subscription purchased successfully',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Cable purchase failed:', error)
      
      const errorMessage = error?.response?.data?.message || 'Cable subscription failed. Please try again.'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Validate smart card number
   */
  async validateSmartCard(smartCardNumber: string, provider: string): Promise<any> {
    try {
      const response = await api.post('/services/cable/validate', {
        smart_card_number: smartCardNumber,
        provider: provider
      })
      return response.data?.customer || response.data?.data || null
    } catch (error) {
      console.error('Smart card validation failed:', error)
      return null
    }
  }

  /**
   * Get recent cable transactions
   */
  async getRecentTransactions(limit: number = 5): Promise<any[]> {
    try {
      const response = await api.get(`/transactions?type=cable&limit=${limit}`)
      return response.data?.transactions || response.data || []
    } catch (error) {
      console.error('Failed to fetch recent cable transactions:', error)
      return []
    }
  }
}

export const cableService = new CableService()
