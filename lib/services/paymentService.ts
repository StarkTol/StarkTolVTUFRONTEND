import api from '@/lib/api'
import { supabase } from '@/lib/supabaseClient'
import { RealtimeChannel } from '@supabase/supabase-js'
import { ApiErrorHandler, ApiResponse, ApiError } from '@/lib/api/error-handler'

export interface PaymentInitiateRequest {
  amount: number
  userId?: string
  metadata?: {
    description?: string
    email?: string
    name?: string
    phoneNumber?: string
    redirectUrl?: string
    [key: string]: any
  }
}

export interface PaymentInitiateResponse {
  success: boolean
  message: string
  data?: {
    paymentLink: string
    txRef: string
    transactionId?: string
    reference?: string
    amount: number
    status: 'pending' | 'processing' | 'successful' | 'failed'
    createdAt: string
  }
}

export interface PaymentStatusResponse {
  success: boolean
  message: string
  data?: {
    txRef: string
    status: 'pending' | 'processing' | 'successful' | 'failed'
    amount: number
    reference?: string
    transactionId?: string
    paymentMethod?: string
    paidAt?: string
    createdAt: string
    updatedAt: string
    metadata?: any
  }
}

export interface WalletBalance {
  balance: number
  currency: string
  formatted: string
}

export interface PaymentChannelConfig {
  userId: string
  onPaymentUpdate?: (payload: any) => void
  onWalletUpdate?: (payload: any) => void
  onTransactionUpdate?: (payload: any) => void
}

class PaymentService {
  private channels: Map<string, RealtimeChannel> = new Map()

  /**
   * Initiate a payment transaction
   */
async initiatePayment(request: PaymentInitiateRequest): Promise<ApiResponse<{ paymentLink: string; txRef: string }>> {
    try {
      const response = await api.post<{ paymentLink: string; txRef: string }>('/api/payment/initiate', {
        amount: request.amount,
        metadata: request.metadata
      })

      // The Next.js API route returns { paymentLink, txRef } directly on success
      const { paymentLink, txRef } = response.data

      if (!paymentLink || !txRef) {
        return ApiErrorHandler.createResponse(false, 'Invalid payment response: missing payment link or transaction reference', undefined, {
          message: 'Invalid payment response',
          status: 502
        })
      }

      return ApiErrorHandler.createResponse(true, 'Payment initiated successfully', { paymentLink, txRef })

    } catch (error: any) {
      console.error('Payment initiation failed:', error)
      
      // Check if this is a backend connectivity issue (404/500 errors)
      const isBackendDown = error.response?.status === 404 || error.response?.status >= 500 || error.code === 'ECONNREFUSED'
      
      if (isBackendDown && process.env.NODE_ENV === 'development') {
        console.warn('🚨 Backend appears to be down. Using development fallback...')
        
        // Generate a mock payment link for development
        const mockTxRef = `DEV_TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const mockPaymentLink = `https://checkout.flutterwave.com/v3/hosted/pay/${mockTxRef}?amount=${request.amount}`
        
        return ApiErrorHandler.createResponse(true, 'Development mode: Mock payment initiated', {
          paymentLink: mockPaymentLink,
          txRef: mockTxRef
        })
      }
      
      // Handle different error types from the Next.js API route
      let errorMessage = 'Payment initiation failed. Please try again.'
      
      if (error.response?.data) {
        // Next.js API route error response: { error, message, status }
        errorMessage = error.response.data.message || error.response.data.error || errorMessage
      } else if (error.message) {
        errorMessage = error.message
      }
      
      const apiError: ApiError = {
        message: errorMessage,
        status: error.response?.status || 500,
        code: error.code,
        details: error.response?.data || error
      }
      
      return ApiErrorHandler.createResponse(false, apiError.message, undefined, apiError)
    }
  }

  /**
   * Alias for initiatePayment - matches the task requirement naming
   */
  async initiate(request: PaymentInitiateRequest): Promise<ApiResponse<{ paymentLink: string; txRef: string }>> {
    return this.initiatePayment(request)
  }

  /**
   * Poll payment status by transaction reference
   */
  async pollPaymentStatus(txRef: string): Promise<PaymentStatusResponse> {
    try {
      const response = await api.get(`/payment/status/${txRef}`)

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Status retrieved successfully',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Payment status polling failed:', error)
      
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to retrieve payment status'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Get wallet balance (used by WalletContext)
   */
  async getWalletBalance(): Promise<WalletBalance> {
    try {
      const response = await api.get('/wallet/balance')
      const balance = response.data?.balance || response.data?.data?.balance || 0
      
      return {
        balance: balance,
        currency: 'NGN',
        formatted: `₦${balance.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`
      }
    } catch (error: any) {
      console.error('Failed to fetch wallet balance:', error)
      
      // Check if this is a backend connectivity issue
      const isBackendDown = error.response?.status === 404 || error.response?.status >= 500 || error.code === 'ECONNREFUSED'
      
      if (isBackendDown && process.env.NODE_ENV === 'development') {
        console.warn('🚨 Backend appears to be down. Using development fallback for wallet balance...')
        
        // Return a mock balance for development
        const mockBalance = 0
        return {
          balance: mockBalance,
          currency: 'NGN',
          formatted: `₦${mockBalance.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}`
        }
      }
      
      throw new Error('Failed to load wallet balance')
    }
  }

  /**
   * Set up Supabase channel for real-time payment updates
   */
  setupPaymentChannel(config: PaymentChannelConfig): RealtimeChannel {
    const channelId = `payment_updates_${config.userId}`
    
    // Remove existing channel if it exists
    this.removeChannel(channelId)

    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `user_id=eq.${config.userId}`
        },
        (payload) => {
          console.log('💳 Real-time payment update received:', payload)
          
          if (config.onPaymentUpdate) {
            config.onPaymentUpdate(payload)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${config.userId}`
        },
        (payload) => {
          console.log('💰 Real-time wallet update received:', payload)
          
          if (config.onWalletUpdate) {
            config.onWalletUpdate(payload)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${config.userId}`
        },
        (payload) => {
          console.log('📊 Real-time transaction update received:', payload)
          
          if (config.onTransactionUpdate) {
            config.onTransactionUpdate(payload)
          }
        }
      )
      .subscribe((status) => {
        console.log(`🔔 Payment channel subscription status for ${channelId}:`, status)
      })

    // Store channel for cleanup
    this.channels.set(channelId, channel)
    
    return channel
  }

  /**
   * Set up Supabase channel for wallet-specific updates
   */
  setupWalletChannel(userId: string, onUpdate: (payload: any) => void): RealtimeChannel {
    const channelId = `wallet_updates_${userId}`
    
    // Remove existing channel if it exists
    this.removeChannel(channelId)

    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`
        },
        onUpdate
      )
      .subscribe((status) => {
        console.log(`🔔 Wallet channel subscription status for ${channelId}:`, status)
      })

    // Store channel for cleanup
    this.channels.set(channelId, channel)
    
    return channel
  }

  /**
   * Set up Supabase channel for transaction-specific updates
   */
  setupTransactionChannel(userId: string, onUpdate: (payload: any) => void): RealtimeChannel {
    const channelId = `transaction_updates_${userId}`
    
    // Remove existing channel if it exists
    this.removeChannel(channelId)

    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`
        },
        onUpdate
      )
      .subscribe((status) => {
        console.log(`🔔 Transaction channel subscription status for ${channelId}:`, status)
      })

    // Store channel for cleanup
    this.channels.set(channelId, channel)
    
    return channel
  }

  /**
   * Remove a specific channel by ID
   */
  removeChannel(channelId: string): void {
    const channel = this.channels.get(channelId)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelId)
      console.log(`🧹 Removed channel: ${channelId}`)
    }
  }

  /**
   * Remove all channels (useful for cleanup)
   */
  removeAllChannels(): void {
    this.channels.forEach((channel, channelId) => {
      supabase.removeChannel(channel)
      console.log(`🧹 Removed channel: ${channelId}`)
    })
    this.channels.clear()
  }

  /**
   * Get active channel count
   */
  getActiveChannelCount(): number {
    return this.channels.size
  }

  /**
   * Poll payment status with retry logic
   */
  async pollPaymentStatusWithRetry(
    txRef: string, 
    maxRetries: number = 10, 
    intervalMs: number = 3000
  ): Promise<PaymentStatusResponse> {
    let retries = 0
    
    const poll = async (): Promise<PaymentStatusResponse> => {
      const result = await this.pollPaymentStatus(txRef)
      
      // If successful or failed, return immediately
      if (result.data?.status === 'successful' || result.data?.status === 'failed') {
        return result
      }
      
      // If still pending/processing and we have retries left, wait and retry
      if (retries < maxRetries && (result.data?.status === 'pending' || result.data?.status === 'processing')) {
        retries++
        console.log(`🔄 Payment still processing. Retry ${retries}/${maxRetries} in ${intervalMs}ms...`)
        
        await new Promise(resolve => setTimeout(resolve, intervalMs))
        return poll()
      }
      
      // Max retries reached or unknown status
      return result
    }
    
    return poll()
  }
}

export const paymentService = new PaymentService()
