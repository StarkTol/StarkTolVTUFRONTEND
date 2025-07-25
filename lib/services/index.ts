/**
 * Services Index
 * 
 * Central export point for all service modules in lib/services
 */

// Payment Service
export { paymentService } from './paymentService'
export type {
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  PaymentStatusResponse,
  PaymentChannelConfig,
  WalletBalance
} from './paymentService'

// Wallet Service
export { walletService } from './walletService'
export type {
  WalletBalance as WalletServiceBalance,
  WalletFundRequest,
  WalletTransferRequest,
  WalletTransaction,
  WalletFundResponse,
  WalletTransferResponse
} from './walletService'

// VTU Services
export { airtimeService } from './airtimeService'
export { cableService } from './cableService'
export { dataService } from './dataService'
export { electricityService } from './electricityService'
export { examCardService } from './examCardService'
export { rechargeCardService } from './rechargeCardService'

// Re-export common types for convenience
export type ServiceResponse<T = any> = {
  success: boolean
  message: string
  data?: T
}

export type TransactionStatus = 'pending' | 'processing' | 'successful' | 'failed'

export type PaymentMethod = 'bank_transfer' | 'card' | 'ussd' | 'flutterwave'
