import api from '@/lib/api'

export interface ExamProvider {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive'
}

export interface ExamCard {
  id: string
  name: string
  price: number
  provider: string
  description?: string
}

export interface ExamCardPurchaseRequest {
  provider: string
  cardType: string
  quantity: number
  paymentMethod: 'wallet' | 'card'
}

export interface ExamCardPurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    cards: Array<{
      pin: string
      serial: string
    }>
    provider: string
    cardType: string
    quantity: number
  }
}

class ExamCardService {
  /**
   * Get all available exam providers
   */
  async getProviders(): Promise<ExamProvider[]> {
    try {
      const response = await api.get('/services/exam-cards/providers')
      return response.data?.providers || response.data || []
    } catch (error) {
      console.error('Failed to fetch exam providers:', error)
      throw new Error('Failed to load exam providers')
    }
  }

  /**
   * Get exam cards for a specific provider
   */
  async getExamCards(providerId: string): Promise<ExamCard[]> {
    try {
      const response = await api.get(`/services/exam-cards/cards?provider=${providerId}`)
      return response.data?.cards || response.data || []
    } catch (error) {
      console.error(`Failed to fetch exam cards for ${providerId}:`, error)
      throw new Error('Failed to load exam cards')
    }
  }

  /**
   * Purchase exam cards
   */
  async purchaseExamCards(request: ExamCardPurchaseRequest): Promise<ExamCardPurchaseResponse> {
    try {
      const response = await api.post('/services/exam-cards/purchase', {
        provider: request.provider,
        card_type: request.cardType,
        quantity: request.quantity,
        payment_method: request.paymentMethod
      })

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Exam cards purchased successfully',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Exam card purchase failed:', error)
      
      const errorMessage = error?.response?.data?.message || 'Exam card purchase failed. Please try again.'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Get recent exam card transactions
   */
  async getRecentTransactions(limit: number = 5): Promise<any[]> {
    try {
      const response = await api.get(`/transactions?type=exam_card&limit=${limit}`)
      return response.data?.transactions || response.data || []
    } catch (error) {
      console.error('Failed to fetch recent exam card transactions:', error)
      return []
    }
  }
}

export const examCardService = new ExamCardService()
