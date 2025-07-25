/**
 * API Type Definitions
 * 
 * This file contains all TypeScript interfaces and types that mirror 
 * backend response DTOs and request payloads.
 */

// ===== Base/Common Types =====

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface BaseApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  timestamp?: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ErrorResponse {
  success: false
  message: string
  errors?: ValidationError[]
  code?: string
  statusCode?: number
}

// ===== Authentication Types =====

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber?: string
  referralCode?: string
}

export interface AuthResponse {
  user: User
  tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  password: string
  confirmPassword: string
}

// ===== User Types =====

export interface User extends BaseEntity {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  avatar?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  role: 'user' | 'reseller' | 'admin'
  status: 'active' | 'suspended' | 'pending'
  referralCode: string
  referredBy?: string
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected'
  transactionPin?: boolean // Whether user has set a transaction PIN
}

export interface UserProfile extends User {
  wallet: WalletInfo
  resellerInfo?: ResellerInfo
  stats: UserStats
}

export interface UserStats {
  totalTransactions: number
  totalSpent: number
  successfulTransactions: number
  failedTransactions: number
  monthlySpending: number
  referralCount: number
}

export interface ResellerInfo {
  businessName?: string
  businessAddress?: string
  websiteUrl?: string
  apiKey?: string
  apiKeyStatus: 'active' | 'inactive'
  commissionRate: number
  totalEarnings: number
  monthlyEarnings: number
  subResellerCount: number
}

// ===== Wallet Types =====

export interface WalletInfo extends BaseEntity {
  userId: string
  balance: number
  currency: string
  formattedBalance: string
  accountNumber?: string
  accountName?: string
  bankName?: string
}

export interface WalletTransaction extends BaseEntity {
  walletId: string
  type: 'credit' | 'debit'
  category: 'funding' | 'purchase' | 'transfer' | 'commission' | 'refund'
  amount: number
  balanceAfter: number
  description: string
  reference: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  metadata?: Record<string, any>
  relatedTransactionId?: string
}

export interface FundWalletRequest {
  amount: number
  method: 'bank_transfer' | 'card' | 'ussd'
  metadata?: {
    cardDetails?: {
      number: string
      expiryMonth: string
      expiryYear: string
      cvv: string
      holderName: string
    }
    bankDetails?: {
      code: string
      account: string
    }
  }
}

export interface FundWalletResponse {
  transactionId: string
  reference: string
  status: 'pending' | 'completed'
  paymentUrl?: string
  ussdCode?: string
  bankDetails?: {
    accountNumber: string
    accountName: string
    bankName: string
    amount: number
    reference: string
  }
}

export interface TransferRequest {
  recipient: string // email or phone or user ID
  amount: number
  description?: string
  pin: string
}

export interface TransferResponse {
  transactionId: string
  reference: string
  recipient: {
    name: string
    email: string
  }
  amount: number
  status: 'pending' | 'completed' | 'failed'
}

// ===== Service Provider Types =====

export interface ServiceProvider extends BaseEntity {
  name: string
  slug: string
  logo: string
  description?: string
  status: 'active' | 'inactive' | 'maintenance'
  category: ServiceCategory
  features: string[]
  minimumAmount?: number
  maximumAmount?: number
}

export type ServiceCategory = 
  | 'airtime' 
  | 'data' 
  | 'cable' 
  | 'electricity' 
  | 'exam_cards' 
  | 'recharge_cards'

// ===== Airtime Types =====

export interface AirtimeProvider extends ServiceProvider {
  category: 'airtime'
  supportedAmounts: number[]
  discountRate: number
}

export interface AirtimePurchaseRequest {
  providerId: string
  phoneNumber: string
  amount: number
  pin?: string
  saveAsBeneficiary?: boolean
  beneficiaryName?: string
}

export interface AirtimePurchaseResponse {
  transactionId: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
  recipient: string
  amount: number
  provider: string
  chargeAmount: number
  discount: number
  finalAmount: number
}

// ===== Data Types =====

export interface DataProvider extends ServiceProvider {
  category: 'data'
  discountRate: number
}

export interface DataPlan extends BaseEntity {
  providerId: string
  name: string
  size: string // e.g., "1GB", "5GB"
  validity: string // e.g., "30 days", "7 days"
  price: number
  discountedPrice: number
  planCode: string
  description?: string
  planType: 'sme' | 'gifting' | 'corporate' | 'direct'
  isActive: boolean
}

export interface DataPurchaseRequest {
  providerId: string
  planId: string
  phoneNumber: string
  pin?: string
  saveAsBeneficiary?: boolean
  beneficiaryName?: string
}

export interface DataPurchaseResponse {
  transactionId: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
  recipient: string
  plan: DataPlan
  chargeAmount: number
  discount: number
  finalAmount: number
}

// ===== Cable TV Types =====

export interface CableProvider extends ServiceProvider {
  category: 'cable'
  discountRate: number
}

export interface CablePlan extends BaseEntity {
  providerId: string
  name: string
  price: number
  discountedPrice: number
  planCode: string
  validity: string
  description?: string
  isActive: boolean
  features?: string[]
}

export interface CableValidationRequest {
  providerId: string
  smartCardNumber: string
}

export interface CableValidationResponse {
  valid: boolean
  customerName?: string
  customerAddress?: string
  accountStatus?: string
  dueDate?: string
  lastPayment?: string
  message?: string
}

export interface CablePurchaseRequest {
  providerId: string
  planId: string
  smartCardNumber: string
  pin?: string
  saveAsBeneficiary?: boolean
  beneficiaryName?: string
}

export interface CablePurchaseResponse {
  transactionId: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
  smartCardNumber: string
  plan: CablePlan
  customerName?: string
  chargeAmount: number
  discount: number
  finalAmount: number
}

// ===== Electricity Types =====

export interface ElectricityProvider extends ServiceProvider {
  category: 'electricity'
  supportsMeterValidation: boolean
  supportsAmountValidation: boolean
  minimumAmount: number
  maximumAmount: number
}

export interface ElectricityValidationRequest {
  providerId: string
  meterNumber: string
  meterType: 'prepaid' | 'postpaid'
}

export interface ElectricityValidationResponse {
  valid: boolean
  customerName?: string
  customerAddress?: string
  accountNumber?: string
  customerType?: string
  businessUnit?: string
  minimumAmount?: number
  message?: string
}

export interface ElectricityPurchaseRequest {
  providerId: string
  meterNumber: string
  amount: number
  meterType: 'prepaid' | 'postpaid'
  customerPhone?: string
  pin?: string
  saveAsBeneficiary?: boolean
  beneficiaryName?: string
}

export interface ElectricityPurchaseResponse {
  transactionId: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
  meterNumber: string
  amount: number
  customerName?: string
  chargeAmount: number
  token?: string
  units?: number
  address?: string
  tariff?: string
  tokenValue?: number
}

// ===== Exam Cards Types =====

export interface ExamCardProvider extends ServiceProvider {
  category: 'exam_cards'
  examType: string // 'waec' | 'neco' | 'nabteb' | 'jamb'
}

export interface ExamCardProduct extends BaseEntity {
  providerId: string
  name: string
  price: number
  discountedPrice: number
  productCode: string
  description?: string
  validity?: string
  isActive: boolean
}

export interface ExamCardPurchaseRequest {
  providerId: string
  productId: string
  quantity: number
  pin?: string
}

export interface ExamCardPin {
  serial: string
  pin: string
}

export interface ExamCardPurchaseResponse {
  transactionId: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
  product: ExamCardProduct
  quantity: number
  pins?: ExamCardPin[]
  chargeAmount: number
  discount: number
  finalAmount: number
}

// ===== Recharge Card Types =====

export interface RechargeCardProvider extends ServiceProvider {
  category: 'recharge_cards'
  supportedDenominations: number[]
}

export interface RechargeCardPurchaseRequest {
  providerId: string
  amount: number
  quantity: number
  pin?: string
}

export interface RechargeCardPin {
  serial: string
  pin: string
  amount: number
}

export interface RechargeCardPurchaseResponse {
  transactionId: string
  reference: string
  status: 'pending' | 'completed' | 'failed'
  provider: string
  amount: number
  quantity: number
  pins?: RechargeCardPin[]
  chargeAmount: number
  discount: number
  finalAmount: number
}

// ===== Transaction Types =====

export interface Transaction extends BaseEntity {
  userId: string
  type: ServiceCategory
  category: 'purchase' | 'transfer' | 'funding' | 'commission'
  amount: number
  chargeAmount: number
  discount: number
  finalAmount: number
  description: string
  reference: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  providerId?: string
  providerName?: string
  recipient?: string
  metadata: Record<string, any>
  failureReason?: string
  completedAt?: string
  failedAt?: string
}

export interface TransactionFilter {
  status?: Transaction['status'][]
  type?: ServiceCategory[]
  category?: Transaction['category'][]
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  search?: string
}

// ===== Beneficiary Types =====

export interface Beneficiary extends BaseEntity {
  userId: string
  name: string
  type: ServiceCategory
  providerId: string
  providerName: string
  identifier: string // phone number, smart card, meter number, etc.
  metadata?: {
    customerName?: string
    planId?: string
    meterType?: string
    [key: string]: any
  }
}

export interface CreateBeneficiaryRequest {
  name: string
  type: ServiceCategory
  providerId: string
  identifier: string
  metadata?: Record<string, any>
}

// ===== Dashboard/Analytics Types =====

export interface DashboardStats {
  wallet: {
    balance: number
    formattedBalance: string
    pendingTransactions: number
  }
  transactions: {
    total: number
    thisMonth: number
    successful: number
    pending: number
    failed: number
  }
  spending: {
    thisMonth: number
    lastMonth: number
    changePercentage: number
    topService: string
  }
  recent: {
    transactions: Transaction[]
    beneficiaries: Beneficiary[]
  }
}

export interface ServiceStats {
  totalTransactions: number
  totalAmount: number
  successRate: number
  averageAmount: number
  monthlyGrowth: number
  topProviders: Array<{
    providerId: string
    name: string
    transactionCount: number
    totalAmount: number
  }>
}

// ===== API Request/Response Helpers =====

export interface ListRequest {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface BulkActionRequest<T = string> {
  ids: T[]
  action: string
  data?: Record<string, any>
}

export interface BulkActionResponse {
  successful: string[]
  failed: Array<{
    id: string
    error: string
  }>
}

// ===== Notification Types =====

export interface Notification extends BaseEntity {
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'transaction' | 'account' | 'promotion' | 'system'
  isRead: boolean
  readAt?: string
  metadata?: Record<string, any>
  actionUrl?: string
}

// ===== Settings Types =====

export interface UserSettings {
  notifications: {
    email: {
      transactionAlerts: boolean
      promotions: boolean
      securityAlerts: boolean
      weeklyReports: boolean
    }
    sms: {
      transactionAlerts: boolean
      securityAlerts: boolean
    }
    push: {
      transactionAlerts: boolean
      promotions: boolean
    }
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    requirePinForTransactions: boolean
  }
  preferences: {
    currency: string
    language: string
    timezone: string
    theme: 'light' | 'dark' | 'system'
  }
}

export interface UpdateSettingsRequest {
  notifications?: Partial<UserSettings['notifications']>
  security?: Partial<UserSettings['security']>
  preferences?: Partial<UserSettings['preferences']>
}

// ===== Utility Types =====

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

// ===== Auto Refill Types =====

export interface AutoRefillSchedule extends BaseEntity {
  userId: string
  serviceType: ServiceCategory
  providerId: string
  providerName: string
  planId?: string
  planName?: string
  phoneNumber: string
  amount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  nextRunDate: string
  status: 'active' | 'paused' | 'cancelled' | 'failed'
  lastRunDate?: string
  successCount: number
  failureCount: number
  metadata?: Record<string, any>
}

export interface CreateAutoRefillRequest {
  serviceType: ServiceCategory
  providerId: string
  planId?: string
  phoneNumber: string
  amount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  startDate?: string
  metadata?: Record<string, any>
}

export interface UpdateAutoRefillRequest {
  providerId?: string
  planId?: string
  phoneNumber?: string
  amount?: number
  frequency?: 'daily' | 'weekly' | 'monthly'
  status?: 'active' | 'paused' | 'cancelled'
  nextRunDate?: string
  metadata?: Record<string, any>
}

// ===== Content Management Types =====

export interface FaqCategory {
  id: string
  name: string
  slug: string
  description?: string
  questions: FaqQuestion[]
  isActive: boolean
  order: number
}

export interface FaqQuestion {
  id: string
  question: string
  answer: string
  isActive: boolean
  order: number
}

export interface TeamMember {
  id: string
  name: string
  position: string
  bio?: string
  avatar?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
  }
  isActive: boolean
  order: number
}

export interface ServiceMenuItem {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  category: ServiceCategory
  route: string
  isActive: boolean
  order: number
  features?: string[]
}
