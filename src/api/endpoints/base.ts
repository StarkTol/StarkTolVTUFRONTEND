/**
 * Base API Endpoint Helpers
 * 
 * This file contains common functionality and base classes for all API endpoints.
 */

import { httpClient, ApiResponse, HttpClientConfig } from '../httpClient'
import type { 
  BaseApiResponse, 
  PaginatedResponse, 
  ListRequest,
  ErrorResponse 
} from '../types'

/**
 * Base class for all API endpoint services
 */
export abstract class BaseEndpoint {
  protected baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * GET request with generic typing
   */
  protected async get<T>(
    endpoint: string, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    return httpClient.get<T>(url, config)
  }

  /**
   * POST request with generic typing
   */
  protected async post<T, D = any>(
    endpoint: string, 
    data?: D, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    return httpClient.post<T, D>(url, data, config)
  }

  /**
   * PUT request with generic typing
   */
  protected async put<T, D = any>(
    endpoint: string, 
    data?: D, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    return httpClient.put<T, D>(url, data, config)
  }

  /**
   * PATCH request with generic typing
   */
  protected async patch<T, D = any>(
    endpoint: string, 
    data?: D, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    return httpClient.patch<T, D>(url, data, config)
  }

  /**
   * DELETE request with generic typing
   */
  protected async delete<T>(
    endpoint: string, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    return httpClient.delete<T>(url, config)
  }

  /**
   * Build query string from parameters
   */
  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)))
        } else {
          searchParams.set(key, String(value))
        }
      }
    })
    
    const query = searchParams.toString()
    return query ? `?${query}` : ''
  }

  /**
   * Get a paginated list with optional filters
   */
  protected async getList<T>(
    endpoint: string,
    params: ListRequest = {},
    config?: HttpClientConfig
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const queryString = this.buildQueryString(params)
    return this.get<PaginatedResponse<T>>(`${endpoint}${queryString}`, config)
  }

  /**
   * Get a single item by ID
   */
  protected async getById<T>(
    endpoint: string,
    id: string,
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return this.get<T>(`${endpoint}/${id}`, config)
  }

  /**
   * Create a new item
   */
  protected async create<T, D = any>(
    endpoint: string,
    data: D,
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return this.post<T, D>(endpoint, data, config)
  }

  /**
   * Update an existing item
   */
  protected async update<T, D = any>(
    endpoint: string,
    id: string,
    data: D,
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return this.put<T, D>(`${endpoint}/${id}`, data, config)
  }

  /**
   * Partially update an existing item
   */
  protected async partialUpdate<T, D = any>(
    endpoint: string,
    id: string,
    data: D,
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return this.patch<T, D>(`${endpoint}/${id}`, data, config)
  }

  /**
   * Delete an item by ID
   */
  protected async deleteById<T>(
    endpoint: string,
    id: string,
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return this.delete<T>(`${endpoint}/${id}`, config)
  }
}

/**
 * Common endpoint patterns
 */
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification'
  },

  // User management
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    SETTINGS: '/users/settings',
    AVATAR: '/users/avatar'
  },

  // Wallet
  WALLET: {
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
    FUND: '/wallet/fund',
    TRANSFER: '/wallet/transfer',
    VERIFY_TRANSFER: '/wallet/verify-transfer'
  },

  // Services
  SERVICES: {
    AIRTIME: {
      PROVIDERS: '/services/airtime/providers',
      PURCHASE: '/services/airtime/purchase',
      VALIDATE: '/services/airtime/validate'
    },
    DATA: {
      PROVIDERS: '/services/data/providers',
      PLANS: '/services/data/plans',
      PURCHASE: '/services/data/purchase',
      VALIDATE: '/services/data/validate'
    },
    CABLE: {
      PROVIDERS: '/services/cable/providers',
      PLANS: '/services/cable/plans',
      PURCHASE: '/services/cable/purchase',
      VALIDATE: '/services/cable/validate'
    },
    ELECTRICITY: {
      PROVIDERS: '/services/electricity/providers',
      PURCHASE: '/services/electricity/purchase',
      VALIDATE: '/services/electricity/validate'
    },
    EXAM_CARDS: {
      PROVIDERS: '/services/exam-cards/providers',
      PRODUCTS: '/services/exam-cards/products',
      PURCHASE: '/services/exam-cards/purchase'
    },
    RECHARGE_CARDS: {
      PROVIDERS: '/services/recharge-cards/providers',
      PURCHASE: '/services/recharge-cards/purchase'
    }
  },

  // Transactions
  TRANSACTIONS: {
    LIST: '/transactions',
    BY_ID: '/transactions/:id',
    RETRY: '/transactions/:id/retry',
    CANCEL: '/transactions/:id/cancel'
  },

  // Beneficiaries
  BENEFICIARIES: {
    LIST: '/beneficiaries',
    CREATE: '/beneficiaries',
    UPDATE: '/beneficiaries/:id',
    DELETE: '/beneficiaries/:id'
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_TRANSACTIONS: '/dashboard/recent-transactions'
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/mark-all-read'
  }
} as const

/**
 * Helper to replace URL parameters
 * Example: replaceUrlParams('/users/:id/posts/:postId', { id: '123', postId: '456' })
 * Result: '/users/123/posts/456'
 */
export function replaceUrlParams(
  url: string, 
  params: Record<string, string | number>
): string {
  let result = url
  
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value))
  })
  
  return result
}

/**
 * Error handling utilities
 */
export class ApiError extends Error {
  public status?: number
  public code?: string
  public details?: any

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  static fromResponse(error: any): ApiError {
    if (error.response) {
      return new ApiError(
        error.response.data?.message || error.message,
        error.response.status,
        error.response.data?.code,
        error.response.data
      )
    }
    
    return new ApiError(error.message || 'Unknown error occurred')
  }
}

/**
 * Helper to handle API responses consistently
 */
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success || response.error) {
    throw new ApiError(
      response.message,
      response.error?.status,
      response.error?.code,
      response.error?.details
    )
  }
  
  if (response.data === undefined) {
    throw new ApiError('No data received from API')
  }
  
  return response.data
}

/**
 * Helper to validate required fields
 */
export function validateRequired(
  data: Record<string, any>, 
  requiredFields: string[]
): void {
  const missing = requiredFields.filter(field => 
    data[field] === undefined || 
    data[field] === null || 
    data[field] === ''
  )
  
  if (missing.length > 0) {
    throw new ApiError(`Missing required fields: ${missing.join(', ')}`)
  }
}
