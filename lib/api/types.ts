// Common types used across all API services

export interface BaseProvider {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive'
}

export interface BaseTransaction {
  id: string
  type: string
  amount: number
  description: string
  date: string
  status: 'success' | 'pending' | 'failed'
  reference: string
  recipient?: string
  metadata?: any
}

export interface BasePurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    amount?: number
    [key: string]: any
  }
}

export type PaymentMethod = 'wallet' | 'card'
export type MeterType = 'prepaid' | 'postpaid'
export type TransactionStatus = 'success' | 'pending' | 'failed'

// Airtime specific types
export interface AirtimeProvider extends BaseProvider {}

export interface AirtimePurchaseRequest {
  provider: string
  phoneNumber: string
  amount: number
  paymentMethod: PaymentMethod
}

export interface AirtimePurchaseResponse extends BasePurchaseResponse {
  data?: BasePurchaseResponse['data'] & {
    recipient: string
  }
}

// Data specific types
export interface DataProvider extends BaseProvider {}

export interface DataBundle {
  id: string
  name: string
  size: string
  validity: string
  price: number
  provider: string
  description?: string
}

export interface DataPurchaseRequest {
  provider: string
  phoneNumber: string
  bundleId: string
  paymentMethod: PaymentMethod
}

export interface DataPurchaseResponse extends BasePurchaseResponse {
  data?: BasePurchaseResponse['data'] & {
    bundle: DataBundle
    recipient: string
  }
}

// Cable specific types
export interface CableProvider extends BaseProvider {}

export interface CablePlan {
  id: string
  name: string
  price: number
  validity: string
  provider: string
  description?: string
}

export interface CablePurchaseRequest {
  provider: string
  smartCardNumber: string
  planId: string
  paymentMethod: PaymentMethod
}

export interface CablePurchaseResponse extends BasePurchaseResponse {
  data?: BasePurchaseResponse['data'] & {
    plan: CablePlan
    smartCardNumber: string
  }
}

// Electricity specific types
export interface ElectricityProvider extends BaseProvider {}

export interface ElectricityPurchaseRequest {
  provider: string
  meterNumber: string
  amount: number
  meterType: MeterType
  paymentMethod: PaymentMethod
}

export interface ElectricityPurchaseResponse extends BasePurchaseResponse {
  data?: BasePurchaseResponse['data'] & {
    token?: string
    units?: number
    customerName?: string
    meterNumber: string
  }
}

// Wallet specific types
export interface WalletBalance {
  balance: number
  currency: string
  formatted: string
}

export interface WalletTransaction extends BaseTransaction {
  type: 'credit' | 'debit'
}

export interface WalletFundRequest {
  amount: number
  method: 'bank_transfer' | 'card' | 'ussd'
  metadata?: {
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    cardName?: string
    phoneNumber?: string
    bankCode?: string
  }
}

export interface WalletTransferRequest {
  recipient: string
  amount: number
  description?: string
}

export interface WalletFundResponse extends BasePurchaseResponse {
  data?: BasePurchaseResponse['data'] & {
    paymentUrl?: string
    ussdCode?: string
    accountDetails?: {
      accountNumber: string
      accountName: string
      bankName: string
    }
  }
}

export interface WalletTransferResponse extends BasePurchaseResponse {
  data?: BasePurchaseResponse['data'] & {
    recipient: {
      name: string
      email: string
    }
  }
}

// Validation responses
export interface ValidationResponse {
  valid: boolean
  customer?: {
    name?: string
    address?: string
    accountNumber?: string
    [key: string]: any
  }
  message?: string
}

// API Service Response wrapper
export interface ServiceResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: {
    message: string
    status?: number
    code?: string
    details?: any
  }
}
