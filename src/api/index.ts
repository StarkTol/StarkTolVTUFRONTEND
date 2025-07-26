/**
 * Centralized API Client - Main Index
 * 
 * This is the main entry point for the API client layer.
 * It exports all endpoints, types, utilities, and the HTTP client.
 */

// Export HTTP Client
export { httpClient, HttpClient } from './httpClient'
export type { 
  ApiError,
  ApiResponse,
  RetryConfig,
  HttpClientConfig
} from './httpClient'

// Export Centralized API Client
export { 
  apiClient, 
  ApiClient, 
  getList, 
  getOne, 
  post, 
  put, 
  patch, 
  delete as del, 
  request 
} from './client'
export type { 
  ApiClientConfig,
  QueryParams,
  ApiClientResponse,
  ApiClientListResponse
} from './client'

// Export Types
export * from './types'

// Export Base Utilities
export { 
  BaseEndpoint, 
  ENDPOINTS, 
  replaceUrlParams, 
  ApiError as BaseApiError,
  handleApiResponse,
  validateRequired
} from './endpoints/base'

// Export Authentication Endpoints
export { 
  authApi,
  login,
  register,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification
} from './endpoints/auth'

// Export Wallet Endpoints
export {
  walletApi,
  getWalletBalance,
  getWalletTransactions,
  getWalletTransaction,
  fundWallet,
  transferFunds,
  verifyBankTransfer,
  searchUsers,
  getWalletStats,
  setTransactionPin,
  changeTransactionPin,
  verifyTransactionPin,
  getSupportedBanks,
  getExchangeRates
} from './endpoints/wallet'

// Export Airtime Endpoints
export {
  airtimeApi,
  getAirtimeProviders,
  getAirtimeProvider,
  validateAirtimePhoneNumber,
  purchaseAirtime,
  getAirtimeTransactions,
  getAirtimeTransaction,
  retryAirtimeTransaction,
  getAirtimePurchaseHistory,
  getFrequentAirtimeNumbers,
  checkAirtimeDiscountEligibility,
  getAirtimeDenominationSuggestions,
  scheduleAirtime
} from './endpoints/airtime'

// Export VTU Endpoints
export {
  vtuApi,
  getNetworks,
  getDataPlans,
  getCableProviders,
  getCablePackages,
  getElectricityProviders,
  purchaseAirtime as vtuPurchaseAirtime,
  purchaseData,
  purchaseCable,
  purchaseElectricity,
  getAirtimeProviders as vtuGetAirtimeProviders,
  getDataProviders,
  getDataPlan,
  getCablePackage,
  getElectricityProvider,
  validateCableCard,
  validateElectricityMeter,
  getVTUTransactions,
  getVTUStats,
  getFrequentBeneficiaries,
  getServiceRates
} from './endpoints/vtu'

// Main API Object - For backwards compatibility and convenience
export const api = {
  // HTTP Client
  client: httpClient,
  
  // Authentication
  auth: {
    login,
    register,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendEmailVerification
  },
  
  // Wallet
  wallet: {
    getBalance: getWalletBalance,
    getTransactions: getWalletTransactions,
    getTransaction: getWalletTransaction,
    fund: fundWallet,
    transfer: transferFunds,
    verifyBankTransfer,
    searchUsers,
    getStats: getWalletStats,
    setPin: setTransactionPin,
    changePin: changeTransactionPin,
    verifyPin: verifyTransactionPin,
    getSupportedBanks,
    getExchangeRates
  },
  
  // Services
  services: {
    airtime: {
      getProviders: getAirtimeProviders,
      getProvider: getAirtimeProvider,
      validatePhoneNumber: validateAirtimePhoneNumber,
      purchase: purchaseAirtime,
      getTransactions: getAirtimeTransactions,
      getTransaction: getAirtimeTransaction,
      retry: retryAirtimeTransaction,
      getHistory: getAirtimePurchaseHistory,
      getFrequentNumbers: getFrequentAirtimeNumbers,
      checkDiscount: checkAirtimeDiscountEligibility,
      getSuggestions: getAirtimeDenominationSuggestions,
      schedule: scheduleAirtime
    }
    // Note: Additional services (data, cable, electricity, etc.) would be added here
  }
}

// Export default
export default api

/**
 * Utility Functions for API Usage
 */

// Helper to check if error is retryable
export function isRetryableError(error: any): boolean {
  return error?.isRetriable === true || 
         error?.status >= 500 || 
         error?.status === 429 ||
         !error?.status // Network errors
}

// Helper to format currency amounts
export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Helper to format phone numbers
export function formatPhoneNumber(phone: string, countryCode: string = '+234'): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${countryCode}${cleaned.substring(1)}`
  }
  
  if (cleaned.length === 10) {
    return `${countryCode}${cleaned}`
  }
  
  return phone // Return original if can't format
}

// Helper to validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Helper to validate Nigerian phone number
export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's 11 digits starting with 0 or 10 digits
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return true
  }
  
  if (cleaned.length === 10) {
    return true
  }
  
  return false
}

// Helper to get error message from API response
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error
  }
  
  return error?.message || 
         error?.data?.message || 
         error?.response?.data?.message ||
         'An unexpected error occurred'
}

// Helper to check authentication status
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('access_token')
  const user = localStorage.getItem('user')
  
  return !!(token && user)
}

// Helper to get current user from storage
export function getCurrentUser(): any | null {
  if (typeof window === 'undefined') return null
  
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

// Helper to clear authentication data
export function clearAuthData(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

/**
 * Smart API Configuration with Auto-Detection
 */
let apiConfig: any = null

export const getApiConfig = async () => {
  if (!apiConfig) {
    try {
      const { getApiBase, getApiUrl } = await import('../../lib/api-config')
      const baseUrl = await getApiBase()
      const apiUrl = await getApiUrl()
      
      const { API_ENDPOINTS } = await import('../../lib/config/base-url')
      
      apiConfig = {
        // Smart base URLs with auto-detection
        BASE_URL: baseUrl,
        API_URL: apiUrl,
        
        // Fallback URLs using centralized constants
        LOCAL_URL: API_ENDPOINTS.LOCAL,
        PRODUCTION_URL: API_ENDPOINTS.PRODUCTION,
        
        // Timeout settings
        DEFAULT_TIMEOUT: 30000, // 30 seconds
        
        // Retry settings
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000, // 1 second
        
        // Currency settings
        DEFAULT_CURRENCY: 'NGN',
        
        // Pagination defaults
        DEFAULT_PAGE_SIZE: 20,
        MAX_PAGE_SIZE: 100,
        
        // Validation settings
        MIN_AMOUNT: 50, // Minimum transaction amount
        MAX_AMOUNT: 1000000, // Maximum transaction amount
        
        // Phone number settings
        PHONE_COUNTRY_CODE: '+234',
        
        // Environment
        IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
        IS_PRODUCTION: process.env.NODE_ENV === 'production',
        AUTO_DETECT_ENABLED: process.env.NEXT_PUBLIC_AUTO_DETECT_BACKEND === 'true'
      } as const
      
    } catch (error) {
      // Fallback to static configuration
      apiConfig = {
        BASE_URL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
        API_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api/v1',
        LOCAL_URL: 'http://localhost:8000',
        PRODUCTION_URL: 'https://backend-066c.onrender.com',
        DEFAULT_TIMEOUT: 30000,
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
        DEFAULT_CURRENCY: 'NGN',
        DEFAULT_PAGE_SIZE: 20,
        MAX_PAGE_SIZE: 100,
        MIN_AMOUNT: 50,
        MAX_AMOUNT: 1000000,
        PHONE_COUNTRY_CODE: '+234',
        IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
        IS_PRODUCTION: process.env.NODE_ENV === 'production',
        AUTO_DETECT_ENABLED: false
      } as const
    }
  }
  return apiConfig
}

// Static API config for backwards compatibility
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
  API_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api/v1',
  DEFAULT_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  DEFAULT_CURRENCY: 'NGN',
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_AMOUNT: 50,
  MAX_AMOUNT: 1000000,
  PHONE_COUNTRY_CODE: '+234',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
} as const

/**
 * Common HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const
