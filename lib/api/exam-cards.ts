import api from '@/lib/axios-instance'
import { executeApiRequest } from './error-handler'
import { 
  BaseProvider,
  BaseTransaction,
  PaymentMethod,
  ServiceResponse
} from './types'

// Exam cards specific types
export interface ExamProvider extends BaseProvider {}

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
  paymentMethod: PaymentMethod
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
    amount: number
  }
}

/**
 * Exam Cards API Service
 * Thin wrapper around the axios instance with typed responses
 */
export class ExamCardsApiService {
  /**
   * Get all available exam card providers
   */
  static async getExamProviders(): Promise<ServiceResponse<ExamProvider[]>> {
    return executeApiRequest<ExamProvider[]>(
      () => api.get('/services/exam-cards/providers'),
      'Exam providers loaded successfully',
      'Failed to load exam providers'
    )
  }

  /**
   * Get exam cards for a specific provider
   */
  static async getExamCards(providerId: string): Promise<ServiceResponse<ExamCard[]>> {
    return executeApiRequest<ExamCard[]>(
      () => api.get(`/services/exam-cards/cards?provider=${providerId}`),
      `Exam cards loaded for ${providerId}`,
      'Failed to load exam cards'
    )
  }

  /**
   * Purchase exam cards
   */
  static async buyExamCards(payload: ExamCardPurchaseRequest): Promise<ServiceResponse<ExamCardPurchaseResponse['data']>> {
    return executeApiRequest<ExamCardPurchaseResponse['data']>(
      () => api.post('/services/exam-cards/purchase', {
        provider: payload.provider,
        card_type: payload.cardType,
        quantity: payload.quantity,
        payment_method: payload.paymentMethod
      }),
      'Exam cards purchased successfully',
      'Failed to purchase exam cards',
      true // Show success toast
    )
  }

  /**
   * Get recent exam card transactions
   */
  static async getRecentExamCardTransactions(limit: number = 10): Promise<ServiceResponse<BaseTransaction[]>> {
    return executeApiRequest<BaseTransaction[]>(
      () => api.get(`/transactions?type=exam_card&limit=${limit}`),
      'Recent exam card transactions retrieved',
      'Failed to load recent transactions'
    )
  }

  /**
   * Get exam card transaction details by reference
   */
  static async getExamCardTransaction(reference: string): Promise<ServiceResponse<BaseTransaction>> {
    return executeApiRequest<BaseTransaction>(
      () => api.get(`/transactions/exam-cards/${reference}`),
      'Transaction details retrieved',
      'Failed to load transaction details'
    )
  }

  /**
   * Get exam card details by ID
   */
  static async getExamCardDetails(cardId: string): Promise<ServiceResponse<ExamCard>> {
    return executeApiRequest<ExamCard>(
      () => api.get(`/services/exam-cards/cards/${cardId}`),
      'Exam card details retrieved',
      'Failed to load exam card details'
    )
  }

  /**
   * Verify exam card pins
   */
  static async verifyExamCardPins(pins: string[]): Promise<ServiceResponse<{ valid: boolean; details: any[] }>> {
    return executeApiRequest<{ valid: boolean; details: any[] }>(
      () => api.post('/services/exam-cards/verify', { pins }),
      'Exam card pins verified',
      'Failed to verify exam card pins'
    )
  }
}

// Export individual functions for convenience
export const getExamProviders = ExamCardsApiService.getExamProviders
export const getExamCards = ExamCardsApiService.getExamCards
export const buyExamCards = ExamCardsApiService.buyExamCards
export const getRecentExamCardTransactions = ExamCardsApiService.getRecentExamCardTransactions
export const getExamCardTransaction = ExamCardsApiService.getExamCardTransaction
export const getExamCardDetails = ExamCardsApiService.getExamCardDetails
export const verifyExamCardPins = ExamCardsApiService.verifyExamCardPins

// Export service instance
export default ExamCardsApiService
