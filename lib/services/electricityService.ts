import api from '@/lib/api'

export interface ElectricityProvider {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive'
}

export interface ElectricityPurchaseRequest {
  provider: string
  meterNumber: string
  amount: number
  meterType: 'prepaid' | 'postpaid'
  paymentMethod: 'wallet' | 'card'
}

export interface ElectricityPurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    token?: string
    units?: number
    customerName?: string
    meterNumber: string
    amount: number
  }
}

class ElectricityService {
  /**
   * Get all available electricity providers
   */
  async getProviders(): Promise<ElectricityProvider[]> {
    try {
      const response = await api.get('/services/electricity/providers')
      return response.data?.providers || response.data || []
    } catch (error) {
      console.error('Failed to fetch electricity providers:', error)
      throw new Error('Failed to load electricity providers')
    }
  }

  /**
   * Purchase electricity units
   */
  async purchaseElectricity(request: ElectricityPurchaseRequest): Promise<ElectricityPurchaseResponse> {
    try {
      const response = await api.post('/services/electricity/purchase', {
        provider: request.provider,
        meter_number: request.meterNumber,
        amount: request.amount,
        meter_type: request.meterType,
        payment_method: request.paymentMethod
      })

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Electricity purchase successful',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Electricity purchase failed:', error)
      
      const errorMessage = error?.response?.data?.message || 'Electricity purchase failed. Please try again.'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Validate meter number
   */
  async validateMeter(meterNumber: string, provider: string, meterType: 'prepaid' | 'postpaid'): Promise<any> {
    try {
      const response = await api.post('/services/electricity/validate', {
        meter_number: meterNumber,
        provider: provider,
        meter_type: meterType
      })
      return response.data?.customer || response.data?.data || null
    } catch (error) {
      console.error('Meter validation failed:', error)
      return null
    }
  }

  /**
   * Get recent electricity transactions
   */
  async getRecentTransactions(limit: number = 5): Promise<any[]> {
    try {
      const response = await api.get(`/transactions?type=electricity&limit=${limit}`)
      return response.data?.transactions || response.data || []
    } catch (error) {
      console.error('Failed to fetch recent electricity transactions:', error)
      return []
    }
  }
}

export const electricityService = new ElectricityService()
