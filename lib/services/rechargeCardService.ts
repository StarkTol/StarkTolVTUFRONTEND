import api from '@/lib/api'

export interface RechargeCardProvider {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive'
}

export interface RechargeCardPurchaseRequest {
  provider: string
  denomination: number
  quantity: number
  paymentMethod: 'wallet' | 'card'
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

class RechargeCardService {
  /**
   * Get all available recharge card providers
   */
  async getProviders(): Promise<RechargeCardProvider[]> {
    try {
      const response = await api.get('/services/recharge-cards/providers')
      return response.data?.providers || response.data || []
    } catch (error) {
      console.error('Failed to fetch recharge card providers:', error)
      throw new Error('Failed to load recharge card providers')
    }
  }

  /**
   * Get available denominations for a provider
   */
  async getDenominations(providerId: string): Promise<number[]> {
    try {
      const response = await api.get(`/services/recharge-cards/denominations?provider=${providerId}`)
      return response.data?.denominations || response.data || []
    } catch (error) {
      console.error(`Failed to fetch denominations for ${providerId}:`, error)
      throw new Error('Failed to load denominations')
    }
  }

  /**
   * Purchase recharge cards
   */
  async purchaseRechargeCards(request: RechargeCardPurchaseRequest): Promise<RechargeCardPurchaseResponse> {
    try {
      const response = await api.post('/services/recharge-cards/purchase', {
        provider: request.provider,
        denomination: request.denomination,
        quantity: request.quantity,
        payment_method: request.paymentMethod
      })

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Recharge cards generated successfully',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Recharge card purchase failed:', error)
      
      const errorMessage = error?.response?.data?.message || 'Recharge card purchase failed. Please try again.'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Get recent recharge card transactions
   */
  async getRecentTransactions(limit: number = 5): Promise<any[]> {
    try {
      const response = await api.get(`/transactions?type=recharge_card&limit=${limit}`)
      return response.data?.transactions || response.data || []
    } catch (error) {
      console.error('Failed to fetch recent recharge card transactions:', error)
      return []
    }
  }
}

export const rechargeCardService = new RechargeCardService()
