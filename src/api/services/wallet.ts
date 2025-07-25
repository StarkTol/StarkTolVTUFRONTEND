/**
 * Wallet API Service
 * 
 * Handles wallet balance, transactions, funding, transfers, and account details
 */

import { BaseEndpoint, ENDPOINTS } from '../endpoints/base'
import type { 
  ApiResponse,
  WalletInfo,
  WalletTransaction,
  PaginatedResponse,
  ListRequest,
  TransactionFilter,
  FundWalletRequest,
  FundWalletResponse,
  TransferRequest,
  TransferResponse
} from '../types'
import type { ApiResponse as HttpApiResponse } from '../httpClient'

export class WalletService extends BaseEndpoint {
  constructor() {
    super('') // Base URL is handled by httpClient
  }

  /**
   * Get wallet balance and account details
   */
  async getBalance(): Promise<ApiResponse<WalletInfo>> {
    return this.get<WalletInfo>(ENDPOINTS.WALLET.BALANCE)
  }

  /**
   * Get account details (account number, name, bank)
   */
  async getAccountDetails(): Promise<ApiResponse<{
    accountNumber: string
    accountName: string
    bankName: string
  }>> {
    return this.get<{
      accountNumber: string
      accountName: string
      bankName: string
    }>('/wallet/account-details')
  }

  /**
   * Get wallet transactions with optional filtering and pagination
   */
  async getTransactions(
    params: ListRequest & Partial<TransactionFilter> = {}
  ): Promise<ApiResponse<PaginatedResponse<WalletTransaction>>> {
    return this.getList<WalletTransaction>(ENDPOINTS.WALLET.TRANSACTIONS, params)
  }

  /**
   * Get recent wallet transactions (limited to 5)
   */
  async getRecentTransactions(limit: number = 5): Promise<ApiResponse<WalletTransaction[]>> {
    const response = await this.get<WalletTransaction[]>(`${ENDPOINTS.WALLET.TRANSACTIONS}?limit=${limit}`)
    return response
  }

  /**
   * Get a specific wallet transaction by ID
   */
  async getTransaction(transactionId: string): Promise<ApiResponse<WalletTransaction>> {
    return this.getById<WalletTransaction>(ENDPOINTS.WALLET.TRANSACTIONS, transactionId)
  }

  /**
   * Fund wallet using various payment methods
   */
  async fundWallet(request: FundWalletRequest): Promise<ApiResponse<FundWalletResponse>> {
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
  async verifyTransfer(reference: string): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.post<{ status: string; message: string }>(ENDPOINTS.WALLET.VERIFY_TRANSFER, {
      reference
    })
  }

  /**
   * Get wallet statistics for a specific period
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

  /**
   * Search for users to transfer to
   */
  async searchUsers(query: string): Promise<ApiResponse<Array<{ 
    id: string
    name: string
    email: string 
  }>>> {
    return this.get<Array<{ 
      id: string
      name: string
      email: string 
    }>>(`/wallet/search-users?q=${encodeURIComponent(query)}`)
  }
}

// Export singleton instance
export const walletService = new WalletService()
