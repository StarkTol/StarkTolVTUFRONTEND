/**
 * Wallet API Endpoints
 */

import { BaseEndpoint, ENDPOINTS, validateRequired } from './base'
import type { 
  WalletInfo,
  WalletTransaction,
  FundWalletRequest,
  FundWalletResponse,
  TransferRequest,
  TransferResponse,
  TransactionFilter,
  PaginatedResponse,
  ListRequest
} from '../types'
import type { ApiResponse } from '../httpClient'

export class WalletEndpoints extends BaseEndpoint {
  constructor() {
    super('') // No base URL prefix
  }

  /**
   * Get wallet balance and basic info
   */
  async getBalance(): Promise<ApiResponse<WalletInfo>> {
    return this.get<WalletInfo>(ENDPOINTS.WALLET.BALANCE)
  }

  /**
   * Get wallet transactions with optional filtering
   */
  async getTransactions(
    params: ListRequest & Partial<TransactionFilter> = {}
  ): Promise<ApiResponse<PaginatedResponse<WalletTransaction>>> {
    return this.getList<WalletTransaction>(ENDPOINTS.WALLET.TRANSACTIONS, params)
  }

  /**
   * Get a specific wallet transaction by ID
   */
  async getTransaction(transactionId: string): Promise<ApiResponse<WalletTransaction>> {
    validateRequired({ transactionId }, ['transactionId'])
    return this.getById<WalletTransaction>(ENDPOINTS.WALLET.TRANSACTIONS, transactionId)
  }

  /**
   * Fund wallet using various payment methods
   */
  async fundWallet(request: FundWalletRequest): Promise<ApiResponse<FundWalletResponse>> {
    validateRequired(request, ['amount', 'method'])
    
    if (request.amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    // Transform request to match backend format
    const payload: any = {
      amount: request.amount,
      method: request.method
    }

    // Add method-specific metadata
    if (request.metadata?.cardDetails) {
      payload.card_number = request.metadata.cardDetails.number
      payload.expiry_month = request.metadata.cardDetails.expiryMonth
      payload.expiry_year = request.metadata.cardDetails.expiryYear
      payload.cvv = request.metadata.cardDetails.cvv
      payload.card_name = request.metadata.cardDetails.holderName
    }

    if (request.metadata?.bankDetails) {
      payload.bank_code = request.metadata.bankDetails.code
      payload.account_number = request.metadata.bankDetails.account
    }

    return this.post<FundWalletResponse>(ENDPOINTS.WALLET.FUND, payload)
  }

  /**
   * Transfer funds to another user
   */
  async transferFunds(request: TransferRequest): Promise<ApiResponse<TransferResponse>> {
    validateRequired(request, ['recipient', 'amount', 'pin'])
    
    if (request.amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    return this.post<TransferResponse>(ENDPOINTS.WALLET.TRANSFER, {
      recipient: request.recipient,
      amount: request.amount,
      description: request.description,
      transaction_pin: request.pin
    })
  }

  /**
   * Verify bank transfer for wallet funding
   */
  async verifyBankTransfer(reference: string): Promise<ApiResponse<{ status: string; message: string }>> {
    validateRequired({ reference }, ['reference'])
    
    return this.post<{ status: string; message: string }>(ENDPOINTS.WALLET.VERIFY_TRANSFER, {
      reference
    })
  }

  /**
   * Search for users to transfer to
   */
  async searchUsers(query: string): Promise<ApiResponse<Array<{ id: string; name: string; email: string }>>> {
    validateRequired({ query }, ['query'])
    
    if (query.length < 3) {
      throw new Error('Search query must be at least 3 characters')
    }

    return this.get<Array<{ id: string; name: string; email: string }>>(
      `/wallet/search-users?q=${encodeURIComponent(query)}`
    )
  }

  /**
   * Get wallet statistics
   */
  async getWalletStats(period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    totalIncome: number
    totalExpense: number
    transactionCount: number
    averageTransaction: number
    comparison: {
      income: number
      expense: number
      percentage: number
    }
  }>> {
    return this.get<{
      totalIncome: number
      totalExpense: number
      transactionCount: number
      averageTransaction: number
      comparison: {
        income: number
        expense: number
        percentage: number
      }
    }>(`/wallet/stats?period=${period}`)
  }

  /**
   * Set or update transaction PIN
   */
  async setTransactionPin(pin: string, confirmPin: string): Promise<ApiResponse<{ message: string }>> {
    validateRequired({ pin, confirmPin }, ['pin', 'confirmPin'])
    
    if (pin !== confirmPin) {
      throw new Error('PINs do not match')
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      throw new Error('PIN must be exactly 4 digits')
    }

    return this.post<{ message: string }>('/wallet/set-pin', {
      pin,
      confirm_pin: confirmPin
    })
  }

  /**
   * Change existing transaction PIN
   */
  async changeTransactionPin(
    currentPin: string,
    newPin: string,
    confirmPin: string
  ): Promise<ApiResponse<{ message: string }>> {
    validateRequired({ currentPin, newPin, confirmPin }, ['currentPin', 'newPin', 'confirmPin'])
    
    if (newPin !== confirmPin) {
      throw new Error('New PINs do not match')
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      throw new Error('PIN must be exactly 4 digits')
    }

    return this.post<{ message: string }>('/wallet/change-pin', {
      current_pin: currentPin,
      new_pin: newPin,
      confirm_pin: confirmPin
    })
  }

  /**
   * Verify transaction PIN
   */
  async verifyTransactionPin(pin: string): Promise<ApiResponse<{ valid: boolean }>> {
    validateRequired({ pin }, ['pin'])
    
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      throw new Error('PIN must be exactly 4 digits')
    }

    return this.post<{ valid: boolean }>('/wallet/verify-pin', {
      transaction_pin: pin
    })
  }

  /**
   * Get supported banks for funding
   */
  async getSupportedBanks(): Promise<ApiResponse<Array<{
    code: string
    name: string
    logo?: string
  }>>> {
    return this.get<Array<{
      code: string
      name: string
      logo?: string
    }>>('/wallet/supported-banks')
  }

  /**
   * Get current exchange rates (if multi-currency)
   */
  async getExchangeRates(): Promise<ApiResponse<Record<string, number>>> {
    return this.get<Record<string, number>>('/wallet/exchange-rates')
  }
}

// Create and export singleton instance
export const walletApi = new WalletEndpoints()

// Export individual functions for convenience
export const getWalletBalance = () => walletApi.getBalance()
export const getWalletTransactions = (params?: ListRequest & Partial<TransactionFilter>) => 
  walletApi.getTransactions(params)
export const getWalletTransaction = (transactionId: string) => 
  walletApi.getTransaction(transactionId)
export const fundWallet = (request: FundWalletRequest) => walletApi.fundWallet(request)
export const transferFunds = (request: TransferRequest) => walletApi.transferFunds(request)
export const verifyBankTransfer = (reference: string) => walletApi.verifyBankTransfer(reference)
export const searchUsers = (query: string) => walletApi.searchUsers(query)
export const getWalletStats = (period?: 'week' | 'month' | 'year') => walletApi.getWalletStats(period)
export const setTransactionPin = (pin: string, confirmPin: string) => 
  walletApi.setTransactionPin(pin, confirmPin)
export const changeTransactionPin = (currentPin: string, newPin: string, confirmPin: string) => 
  walletApi.changeTransactionPin(currentPin, newPin, confirmPin)
export const verifyTransactionPin = (pin: string) => walletApi.verifyTransactionPin(pin)
export const getSupportedBanks = () => walletApi.getSupportedBanks()
export const getExchangeRates = () => walletApi.getExchangeRates()
