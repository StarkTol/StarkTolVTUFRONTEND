import api from '@/lib/axios-instance'
import { executeApiRequest } from './error-handler'
import { 
  WalletBalance,
  WalletTransaction,
  WalletFundRequest,
  WalletTransferRequest,
  WalletFundResponse,
  WalletTransferResponse,
  ServiceResponse
} from './types'

/**
 * Wallet API Service
 * Thin wrapper around the axios instance with typed responses
 */
export class WalletApiService {
  /**
   * Get wallet balance
   */
  static async getWalletBalance(): Promise<ServiceResponse<WalletBalance>> {
    return executeApiRequest<WalletBalance>(
      async () => {
        const response = await api.get('/wallet/balance')
        const balance = response.data?.balance || response.data?.data?.balance || 0
        
        return {
          data: {
            balance: balance,
            currency: 'NGN',
            formatted: `₦${balance.toLocaleString()}`
          }
        }
      },
      'Wallet balance retrieved successfully',
      'Failed to load wallet balance'
    )
  }

  /**
   * Get wallet transactions
   */
  static async getWalletTransactions(
    limit: number = 20, 
    offset: number = 0,
    type?: 'credit' | 'debit'
  ): Promise<ServiceResponse<WalletTransaction[]>> {
    return executeApiRequest<WalletTransaction[]>(
      () => {
        let url = `/wallet/transactions?limit=${limit}&offset=${offset}`
        if (type) url += `&type=${type}`
        return api.get(url)
      },
      'Wallet transactions retrieved successfully',
      'Failed to load wallet transactions'
    )
  }

  /**
   * Fund wallet
   */
  static async fundWallet(payload: WalletFundRequest): Promise<ServiceResponse<WalletFundResponse['data']>> {
    return executeApiRequest<WalletFundResponse['data']>(
      () => api.post('/wallet/fund', {
        amount: payload.amount,
        payment_method: payload.method,
        metadata: payload.metadata
      }),
      'Wallet funding request processed successfully',
      'Failed to process wallet funding',
      true // Show success toast
    )
  }

  /**
   * Transfer funds to another user
   */
  static async transferFunds(payload: WalletTransferRequest): Promise<ServiceResponse<WalletTransferResponse['data']>> {
    return executeApiRequest<WalletTransferResponse['data']>(
      () => api.post('/wallet/transfer', {
        recipient: payload.recipient,
        amount: payload.amount,
        description: payload.description
      }),
      'Transfer completed successfully',
      'Failed to complete transfer',
      true // Show success toast
    )
  }

  /**
   * Search for user by username or email
   */
  static async searchUser(query: string): Promise<ServiceResponse<{ id: string; name: string; email: string }>> {
    return executeApiRequest<{ id: string; name: string; email: string }>(
      () => api.post('/wallet/search-user', { query }),
      'User found successfully',
      'User search failed'
    )
  }

  /**
   * Get wallet account details for bank transfer
   */
  static async getAccountDetails(): Promise<ServiceResponse<{
    accountNumber: string;
    accountName: string;
    bankName: string;
    reference?: string;
  }>> {
    return executeApiRequest<{
      accountNumber: string;
      accountName: string;
      bankName: string;
      reference?: string;
    }>(
      () => api.get('/wallet/account-details'),
      'Account details retrieved successfully',
      'Failed to load account details'
    )
  }

  /**
   * Verify bank transfer
   */
  static async verifyBankTransfer(reference: string): Promise<ServiceResponse<{ verified: boolean; amount?: number }>> {
    return executeApiRequest<{ verified: boolean; amount?: number }>(
      () => api.post('/wallet/verify-transfer', { reference }),
      'Bank transfer verified successfully',
      'Bank transfer verification failed'
    )
  }

  /**
   * Get wallet transaction details by reference
   */
  static async getWalletTransaction(reference: string): Promise<ServiceResponse<WalletTransaction>> {
    return executeApiRequest<WalletTransaction>(
      () => api.get(`/wallet/transactions/${reference}`),
      'Transaction details retrieved',
      'Failed to load transaction details'
    )
  }

  /**
   * Get wallet statistics
   */
  static async getWalletStats(period: 'week' | 'month' | 'year' = 'month'): Promise<ServiceResponse<{
    totalInflow: number;
    totalOutflow: number;
    transactionCount: number;
    averageTransaction: number;
  }>> {
    return executeApiRequest<{
      totalInflow: number;
      totalOutflow: number;
      transactionCount: number;
      averageTransaction: number;
    }>(
      () => api.get(`/wallet/stats?period=${period}`),
      'Wallet statistics retrieved',
      'Failed to load wallet statistics'
    )
  }

  /**
   * Set transaction PIN
   */
  static async setTransactionPin(pin: string, confirmPin: string): Promise<ServiceResponse<{ success: boolean }>> {
    return executeApiRequest<{ success: boolean }>(
      () => api.post('/wallet/set-pin', { pin, confirm_pin: confirmPin }),
      'Transaction PIN set successfully',
      'Failed to set transaction PIN',
      true // Show success toast
    )
  }

  /**
   * Verify transaction PIN
   */
  static async verifyTransactionPin(pin: string): Promise<ServiceResponse<{ valid: boolean }>> {
    return executeApiRequest<{ valid: boolean }>(
      () => api.post('/wallet/verify-pin', { pin }),
      'PIN verified successfully',
      'PIN verification failed'
    )
  }
}

// Export individual functions for convenience
export const getWalletBalance = WalletApiService.getWalletBalance
export const getWalletTransactions = WalletApiService.getWalletTransactions
export const fundWallet = WalletApiService.fundWallet
export const transferFunds = WalletApiService.transferFunds
export const searchUser = WalletApiService.searchUser
export const getWalletAccountDetails = WalletApiService.getAccountDetails
export const verifyBankTransfer = WalletApiService.verifyBankTransfer
export const getWalletTransaction = WalletApiService.getWalletTransaction
export const getWalletStats = WalletApiService.getWalletStats
export const setTransactionPin = WalletApiService.setTransactionPin
export const verifyTransactionPin = WalletApiService.verifyTransactionPin

// Export service instance
export default WalletApiService
