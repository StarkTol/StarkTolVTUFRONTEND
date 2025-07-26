/**
 * Centralized HTTP Client
 * 
 * Features:
 * - Authentication with automatic token refresh
 * - Request/Response interceptors
 * - Automatic retry with exponential backoff
 * - Error normalization and handling
 * - TypeScript generics for type safety
 * - Request timeout and abort controller support
 */

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'

// Types for our HTTP client
export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
  isNetworkError?: boolean
  isRetriable?: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: ApiError
}

export interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  retryCondition?: (error: AxiosError) => boolean
}

export interface HttpClientConfig extends AxiosRequestConfig {
  retry?: Partial<RetryConfig>
  skipAuthRefresh?: boolean
  skipErrorNormalization?: boolean
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status <= 599)
  }
}

class HttpClient {
  private axiosInstance: AxiosInstance
  private isRefreshing: boolean = false
  private refreshPromise: Promise<string> | null = null
  private failedQueue: Array<{
    resolve: (value: string | null) => void
    reject: (error: any) => void
  }> = []
  private refreshAttempts: number = 0
  private readonly MAX_REFRESH_ATTEMPTS = 3

  constructor(baseURL?: string, config?: AxiosRequestConfig) {
    // Use smart API configuration with auto-detection
    const getSmartApiConfig = async () => {
      try {
        const { getApiBase } = await import('../../lib/api-config')
        return await getApiBase()
      } catch {
        // Fallback to centralized BASE_URL
        const { BASE_URL } = await import('../../lib/config/base-url')
        return BASE_URL
      }
    }

    this.axiosInstance = axios.create({
      baseURL: baseURL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
      ...config
    })

    // Update base URL dynamically after initialization
    if (!baseURL) {
      getSmartApiConfig().then(url => {
        if (url && this.axiosInstance.defaults.baseURL !== url) {
          this.axiosInstance.defaults.baseURL = url
          console.log('🔧 [HttpClient] Updated base URL to:', url)
        }
      }).catch(() => {
        // Silent fail - use default
      })
    }

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      this.handleRequest.bind(this),
      (error) => Promise.reject(this.normalizeError(error))
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    )
  }

  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    // Add authentication token
    if (typeof window !== 'undefined' && !config.skipAuthRefresh) {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add user context
      const user = this.getUserFromStorage()
      if (user?.id) {
        config.headers['X-User-ID'] = user.id
      }
    }

    // Add request timestamp for debugging
    config.metadata = {
      ...config.metadata,
      requestStartTime: Date.now()
    }

    return config
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    // Calculate request duration for monitoring
    const duration = Date.now() - (response.config.metadata?.requestStartTime || 0)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`)
    }

    return response
  }

  private async handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number }

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuthRefresh) {
      return this.handleAuthError(error, originalRequest)
    }

    // Handle retryable errors
    if (this.shouldRetry(error, originalRequest)) {
      return this.retryRequest(error, originalRequest)
    }

    // Normalize and reject the error
    return Promise.reject(this.normalizeError(error))
  }

private async refreshToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    // Check for infinite loop protection
    if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
      throw new Error('Maximum refresh attempts exceeded')
    }

    this.isRefreshing = true
    this.refreshAttempts += 1

    // Create the refresh promise
    this.refreshPromise = this.performTokenRefresh()

    try {
      const token = await this.refreshPromise
      this.refreshAttempts = 0 // Reset on success
      this.processFailedQueue(null, token)
      return token
    } catch (error) {
      this.processFailedQueue(error, null)
      throw error
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await axios.post(
      `${this.axiosInstance.defaults.baseURL}/auth/refresh`,
      { refresh_token: refreshToken },
      { skipAuthRefresh: true } as any
    )

    const { access_token, refresh_token: newRefreshToken } = response.data

    if (!access_token) {
      throw new Error('No access token received from refresh endpoint')
    }

    localStorage.setItem('access_token', access_token)
    if (newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken)
    }

    return access_token
  }

  private async handleAuthError(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
  ): Promise<any> {
    // Mark request as being retried to prevent infinite loops
    originalRequest._retry = true

    try {
      const token = await this.refreshToken()
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`
      }
      return this.axiosInstance(originalRequest)
    } catch (refreshError) {
      this.clearAuthData()
      this.refreshAttempts = 0 // Reset on logout
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(this.normalizeError(refreshError as AxiosError))
    }
  }

  private shouldRetry(error: AxiosError, config?: InternalAxiosRequestConfig): boolean {
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...(config as any)?.retry }
    const retryCount = (config as any)?._retryCount || 0
    
    return (
      retryCount < retryConfig.maxRetries &&
      retryConfig.retryCondition!(error)
    )
  }

  private async retryRequest(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig & { _retryCount?: number }
  ): Promise<any> {
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...(originalRequest as any).retry }
    const retryCount = originalRequest._retryCount || 0
    
    originalRequest._retryCount = retryCount + 1
    
    // Calculate delay with exponential backoff and jitter
    const delay = Math.min(
      retryConfig.baseDelay * Math.pow(2, retryCount) + Math.random() * 1000,
      retryConfig.maxDelay
    )

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 [API] Retrying request (attempt ${retryCount + 1}/${retryConfig.maxRetries}) after ${delay}ms`)
    }

    await new Promise(resolve => setTimeout(resolve, delay))
    return this.axiosInstance(originalRequest)
  }

  private processFailedQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })
    this.failedQueue = []
  }

  private normalizeError(error: any): ApiError {
    const isAxiosError = error.isAxiosError || error.response
    
    let normalizedError: ApiError = {
      message: 'An unexpected error occurred',
      isRetriable: false,
      isNetworkError: !isAxiosError
    }

    if (isAxiosError) {
      const axiosError = error as AxiosError
      normalizedError = {
        message: axiosError.response?.data?.message || axiosError.message || 'Request failed',
        status: axiosError.response?.status,
        code: axiosError.code,
        details: axiosError.response?.data,
        isNetworkError: !axiosError.response,
        isRetriable: this.isRetriableError(axiosError)
      }
    } else if (error.message) {
      normalizedError.message = error.message
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 [API] Error:', normalizedError)
    }

    return normalizedError
  }

  private isRetriableError(error: AxiosError): boolean {
    return (
      !error.response || // Network errors
      error.response.status >= 500 || // Server errors
      error.response.status === 429 // Rate limiting
    )
  }

  private getUserFromStorage(): any {
    if (typeof window === 'undefined') return null
    
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  }

  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  }

  // Public API methods with generic type support

  async get<T = any>(url: string, config?: HttpClientConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, config)
      return this.normalizeResponse(response)
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  async post<T = any, D = any>(url: string, data?: D, config?: HttpClientConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config)
      return this.normalizeResponse(response)
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  async put<T = any, D = any>(url: string, data?: D, config?: HttpClientConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config)
      return this.normalizeResponse(response)
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  async patch<T = any, D = any>(url: string, data?: D, config?: HttpClientConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config)
      return this.normalizeResponse(response)
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  async delete<T = any>(url: string, config?: HttpClientConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config)
      return this.normalizeResponse(response)
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  private normalizeResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      success: true,
      message: (response.data as any)?.message || 'Request successful',
      data: (response.data as any)?.data || response.data
    }
  }

  private handleError<T>(error: any): ApiResponse<T> {
    const normalizedError = this.normalizeError(error)
    return {
      success: false,
      message: normalizedError.message,
      error: normalizedError
    }
  }

  // Utility methods
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }

  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL
  }

  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization']
  }
}

// Create and export the default instance
export const httpClient = new HttpClient()

// Export the class for custom instances
export default HttpClient
