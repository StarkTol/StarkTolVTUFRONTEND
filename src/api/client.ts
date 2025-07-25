/**
 * Centralized API Client
 * 
 * This is a typed apiClient wrapper around httpClient (axios) that automatically
 * adds auth headers, base URL, and error normalization with generic helpers.
 */

import { httpClient, ApiResponse, HttpClientConfig } from './httpClient'
import type { 
  BaseApiResponse, 
  PaginatedResponse, 
  ListRequest 
} from './types'

/**
 * Generic API Client Configuration
 */
export interface ApiClientConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  retry?: {
    maxRetries?: number
    baseDelay?: number
    maxDelay?: number
  }
}

/**
 * Generic Query Parameters for List Operations
 */
export interface QueryParams extends Record<string, any> {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: any
}

/**
 * Centralized API Client Class
 * 
 * Provides typed generic helpers for common API operations:
 * - getList<T>(url, params) - Get paginated list of items
 * - getOne<T>(url) - Get single item
 * - post<T,U>(url, body) - Create new item
 * - put<T,U>(url, body) - Update item
 * - patch<T,U>(url, body) - Partial update
 * - delete<T>(url) - Delete item
 */
export class ApiClient {
  private config: ApiClientConfig

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
      timeout: config.timeout || 30000,
      headers: config.headers || {},
      retry: {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        ...config.retry
      }
    }

    // Configure the underlying httpClient if needed
    if (config.baseURL) {
      httpClient.setBaseURL(config.baseURL)
    }
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: QueryParams): string {
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
   * Get a paginated list of items with optional query parameters
   * 
   * @param url - API endpoint URL
   * @param params - Optional query parameters for filtering, pagination, sorting
   * @param config - Optional HTTP client configuration
   * @returns Promise<ApiResponse<PaginatedResponse<T>>>
   * 
   * @example
   * const users = await apiClient.getList<User>('/users', { 
   *   page: 1, 
   *   limit: 20, 
   *   search: 'john' 
   * })
   */
  async getList<T = any>(
    url: string, 
    params: QueryParams = {}, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const queryString = this.buildQueryString(params)
    const fullUrl = `${url}${queryString}`
    
    return httpClient.get<PaginatedResponse<T>>(fullUrl, config)
  }

  /**
   * Get a single item by URL
   * 
   * @param url - API endpoint URL (can include ID)
   * @param config - Optional HTTP client configuration
   * @returns Promise<ApiResponse<T>>
   * 
   * @example
   * const user = await apiClient.getOne<User>('/users/123')
   */
  async getOne<T = any>(
    url: string, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return httpClient.get<T>(url, config)
  }

  /**
   * Create a new item via POST request
   * 
   * @param url - API endpoint URL
   * @param body - Request body data
   * @param config - Optional HTTP client configuration
   * @returns Promise<ApiResponse<T>>
   * 
   * @example
   * const newUser = await apiClient.post<User, CreateUserRequest>(
   *   '/users', 
   *   { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
   * )
   */
  async post<T = any, U = any>(
    url: string, 
    body?: U, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return httpClient.post<T, U>(url, body, config)
  }

  /**
   * Update an item via PUT request
   * 
   * @param url - API endpoint URL (usually includes ID)
   * @param body - Request body data
   * @param config - Optional HTTP client configuration
   * @returns Promise<ApiResponse<T>>
   * 
   * @example
   * const updatedUser = await apiClient.put<User, UpdateUserRequest>(
   *   '/users/123', 
   *   { firstName: 'Jane', lastName: 'Smith' }
   * )
   */
  async put<T = any, U = any>(
    url: string, 
    body?: U, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return httpClient.put<T, U>(url, body, config)
  }

  /**
   * Partially update an item via PATCH request
   * 
   * @param url - API endpoint URL (usually includes ID)
   * @param body - Request body data (partial)
   * @param config - Optional HTTP client configuration
   * @returns Promise<ApiResponse<T>>
   * 
   * @example
   * const updatedUser = await apiClient.patch<User, Partial<User>>(
   *   '/users/123', 
   *   { firstName: 'Jane' }
   * )
   */
  async patch<T = any, U = any>(
    url: string, 
    body?: U, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return httpClient.patch<T, U>(url, body, config)
  }

  /**
   * Delete an item via DELETE request
   * 
   * @param url - API endpoint URL (usually includes ID)
   * @param config - Optional HTTP client configuration
   * @returns Promise<ApiResponse<T>>
   * 
   * @example
   * const result = await apiClient.delete('/users/123')
   */
  async delete<T = any>(
    url: string, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    return httpClient.delete<T>(url, config)
  }

  /**
   * Generic request method for custom HTTP methods or complex operations
   * 
   * @param method - HTTP method
   * @param url - API endpoint URL
   * @param data - Optional request data
   * @param config - Optional HTTP client configuration
   * @returns Promise<ApiResponse<T>>
   * 
   * @example
   * const result = await apiClient.request<CustomResponse>(
   *   'POST', 
   *   '/users/123/verify', 
   *   { verificationCode: '123456' }
   * )
   */
  async request<T = any, U = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', 
    url: string, 
    data?: U, 
    config?: HttpClientConfig
  ): Promise<ApiResponse<T>> {
    switch (method.toLowerCase()) {
      case 'get':
        return this.getOne<T>(url, config)
      case 'post':
        return this.post<T, U>(url, data, config)
      case 'put':
        return this.put<T, U>(url, data, config)
      case 'patch':
        return this.patch<T, U>(url, data, config)
      case 'delete':
        return this.delete<T>(url, config)
      default:
        throw new Error(`Unsupported HTTP method: ${method}`)
    }
  }

  /**
   * Convenience method to get the underlying httpClient instance
   * for advanced operations or direct access to axios features
   */
  getHttpClient() {
    return httpClient
  }

  /**
   * Update API client configuration
   */
  updateConfig(newConfig: Partial<ApiClientConfig>) {
    this.config = { ...this.config, ...newConfig }
    
    if (newConfig.baseURL) {
      httpClient.setBaseURL(newConfig.baseURL)
    }
  }

  /**
   * Get current API client configuration
   */
  getConfig(): ApiClientConfig {
    return { ...this.config }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    httpClient.setAuthToken(token)
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    httpClient.clearAuthToken()
  }
}

/**
 * Default API Client Instance - Singleton
 * 
 * This is the main singleton instance that should be used throughout the application.
 * It automatically includes auth headers, base URL, and error normalization.
 */
export const apiClient = new ApiClient()

/**
 * Export the class for creating custom instances if needed
 */
export default ApiClient

/**
 * Utility type helpers for better TypeScript integration
 */
export type ApiClientResponse<T> = ApiResponse<T>
export type ApiClientListResponse<T> = ApiResponse<PaginatedResponse<T>>

/**
 * Common API operations using the singleton instance
 * These are convenience exports for direct use without importing apiClient
 */

/**
 * Get a paginated list of items
 */
export const getList = <T = any>(
  url: string, 
  params?: QueryParams, 
  config?: HttpClientConfig
): Promise<ApiResponse<PaginatedResponse<T>>> => {
  return apiClient.getList<T>(url, params, config)
}

/**
 * Get a single item
 */
export const getOne = <T = any>(
  url: string, 
  config?: HttpClientConfig
): Promise<ApiResponse<T>> => {
  return apiClient.getOne<T>(url, config)
}

/**
 * Create a new item
 */
export const post = <T = any, U = any>(
  url: string, 
  body?: U, 
  config?: HttpClientConfig
): Promise<ApiResponse<T>> => {
  return apiClient.post<T, U>(url, body, config)
}

/**
 * Update an item
 */
export const put = <T = any, U = any>(
  url: string, 
  body?: U, 
  config?: HttpClientConfig
): Promise<ApiResponse<T>> => {
  return apiClient.put<T, U>(url, body, config)
}

/**
 * Partially update an item
 */
export const patch = <T = any, U = any>(
  url: string, 
  body?: U, 
  config?: HttpClientConfig
): Promise<ApiResponse<T>> => {
  return apiClient.patch<T, U>(url, body, config)
}

/**
 * Delete an item
 */
export const del = <T = any>(
  url: string, 
  config?: HttpClientConfig
): Promise<ApiResponse<T>> => {
  return apiClient.delete<T>(url, config)
}

// Alias for delete (since 'delete' is a reserved keyword)
export { del as delete }

/**
 * Generic request method
 */
export const request = <T = any, U = any>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', 
  url: string, 
  data?: U, 
  config?: HttpClientConfig
): Promise<ApiResponse<T>> => {
  return apiClient.request<T, U>(method, url, data, config)
}
