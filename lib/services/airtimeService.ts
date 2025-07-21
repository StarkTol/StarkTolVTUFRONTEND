import api from '@/lib/api'

export interface Provider {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive'
}

export interface AirtimePurchaseRequest {
  provider: string
  phoneNumber: string
  amount: number
  paymentMethod: 'wallet' | 'card'
}

export interface AirtimePurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    amount: number
    recipient: string
  }
}

export interface RecentTransaction {
  id: string
  provider: string
  phoneNumber: string
  amount: string
  date: string
  status: 'success' | 'pending' | 'failed'
  reference: string
}

class AirtimeService {
  /**
   * Get all available airtime providers
   */
  async getProviders(): Promise<Provider[]> {
    try {
      const response = await api.get('/services/airtime/providers')
      return response.data?.providers || response.data || []
    } catch (error) {
      console.error('Failed to fetch airtime providers:', error)
      throw new Error('Failed to load providers')
    }
  }

  /**
   * Purchase airtime
   */
  async purchaseAirtime(request: AirtimePurchaseRequest): Promise<AirtimePurchaseResponse> {
    try {
      const response = await api.post('/services/airtime/purchase', {
        provider: request.provider,
        phone_number: request.phoneNumber,
        amount: request.amount,
        payment_method: request.paymentMethod
      })

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Purchase completed',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Airtime purchase failed:', error)
      
      const errorMessage = error?.response?.data?.message || 'Purchase failed. Please try again.'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Get recent airtime transactions
   */
  async getRecentTransactions(limit: number = 5): Promise<RecentTransaction[]> {
    try {
      const response = await api.get(`/transactions?type=airtime&limit=${limit}`)
      return response.data?.transactions || response.data || []
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error)
      return []
    }
  }

  /**
   * Validate phone number for specific provider
   */
  async validatePhoneNumber(phoneNumber: string, provider: string): Promise<boolean> {
    try {
      const response = await api.post('/services/airtime/validate', {
        phone_number: phoneNumber,
        provider: provider
      })
      return response.data?.valid || false
    } catch (error) {
      console.error('Phone validation failed:', error)
      return false
    }
  }
}

export const airtimeService = new AirtimeService()
