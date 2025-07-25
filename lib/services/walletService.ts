import api from '@/lib/api'

export interface WalletBalance {
  balance: number
  currency: string
  formatted: string
}

export interface WalletFundRequest {
  amount: number
  method: 'bank_transfer' | 'card' | 'ussd' | 'flutterwave'
  metadata?: {
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    cardName?: string
    phoneNumber?: string
    bankCode?: string
    // Flutterwave specific metadata
    email?: string
    name?: string
    flwRef?: string
    txRef?: string
    transactionId?: string
    paymentType?: string
  }
}

export interface WalletTransferRequest {
  recipient: string // email or username
  amount: number
  description?: string
}

export interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
  status: 'success' | 'pending' | 'failed'
  reference: string
  recipient?: string
  metadata?: any
}

export interface WalletFundResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    paymentUrl?: string // For card payments
    ussdCode?: string // For USSD payments
    accountDetails?: {
      accountNumber: string
      accountName: string
      bankName: string
    }
    // Flutterwave specific response data
    flutterwaveRef?: string
    txRef?: string
  }
}

export interface WalletTransferResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    recipient: {
      name: string
      email: string
    }
    amount: number
  }
}

class WalletService {
  /**
   * Get wallet balance
   */
  async getBalance(): Promise<WalletBalance> {
    try {
      const response = await api.get('/wallet/balance')
      const balance = response.data?.balance || response.data?.data?.balance || 0
      
      return {
        balance: balance,
        currency: 'NGN',
        formatted: `₦${balance.toLocaleString()}`
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error)
      throw new Error('Failed to load wallet balance')
    }
  }

  /**
   * Get wallet transactions
   */
  async getTransactions(limit: number = 20, offset: number = 0): Promise<WalletTransaction[]> {
    try {
      const response = await api.get(`/wallet/transactions?limit=${limit}&offset=${offset}`)
      return response.data?.transactions || response.data?.data || []
    } catch (error) {
      console.error('Failed to fetch wallet transactions:', error)
      return []
    }
  }

  /**
   * Fund wallet
   */
  async fundWallet(request: WalletFundRequest): Promise<WalletFundResponse> {
    try {
      const response = await api.post('/wallet/fund', {
        amount: request.amount,
        payment_method: request.method,
        metadata: request.metadata
      })

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Funding request processed',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Wallet funding failed:', error)
      
      const errorMessage = error?.response?.data?.message || 'Wallet funding failed. Please try again.'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Transfer funds to another user
   */
  async transferFunds(request: WalletTransferRequest): Promise<WalletTransferResponse> {
    try {
      const response = await api.post('/wallet/transfer', {
        recipient: request.recipient,
        amount: request.amount,
        description: request.description
      })

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Transfer completed successfully',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Wallet transfer failed:', error)
      
      const errorMessage = error?.response?.data?.message || 'Transfer failed. Please try again.'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Search for user by username or email
   */
  async searchUser(query: string): Promise<any> {
    try {
      const response = await api.post('/wallet/search-user', {
        query: query
      })
      
      return response.data?.user || response.data?.data || null
    } catch (error) {
      console.error('User search failed:', error)
      return null
    }
  }

  /**
   * Get wallet account details for bank transfer
   */
  async getAccountDetails(): Promise<any> {
    try {
      const response = await api.get('/wallet/account-details')
      return response.data?.account || response.data?.data || null
    } catch (error) {
      console.error('Failed to fetch account details:', error)
      throw new Error('Failed to load account details')
    }
  }

  /**
   * Verify bank transfer
   */
  async verifyBankTransfer(reference: string): Promise<boolean> {
    try {
      const response = await api.post('/wallet/verify-transfer', {
        reference: reference
      })
      return response.data?.verified || false
    } catch (error) {
      console.error('Bank transfer verification failed:', error)
      return false
    }
  }
}

export const walletService = new WalletService()
