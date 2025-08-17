// lib/api.ts

import axios, { AxiosRequestConfig } from 'axios'
import { setupDevAuth, isDevAuth } from './dev-auth'
import { getApiBaseUrl, getEnvironmentConfig, validateEnvironmentConfig } from './config/environment'
import {
  getAccessToken,
  getRefreshToken,
  getUser,
  setAccessToken,
  setRefreshToken,
  clearAuthData
} from '@/utils/authStorageMigation'

// Import centralized BASE_URL configuration
import { BASE_URL, API_ENDPOINTS, buildApiUrl } from './config/base-url'

// Keep these constants for backward compatibility and alternative backend logic
const LOCAL_BACKEND = API_ENDPOINTS.LOCAL;
const PROD_BACKEND = API_ENDPOINTS.PRODUCTION;

// Validate environment configuration
const envValidation = validateEnvironmentConfig()
if (!envValidation.isValid) {
  console.error('❌ [API] Environment configuration errors:', envValidation.errors)
}

// Get environment config
const envConfig = getEnvironmentConfig()

// Create an Axios instance with auto-detected configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
  withCredentials: false, // Don't send cookies for CORS
})

// Global logging for all API requests and responses
api.interceptors.request.use(
  config => {
    console.log(`➡️ [Axios Request] ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('   [Request Body]', config.data);
    }
    return config;
  },
  error => {
    console.error('❌ [Axios Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`✅ [Axios Response] ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('   [Response Data]', response.data);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`🚫 [Axios Response Error] ${error.config.method?.toUpperCase()} ${error.config.url}`);
      console.error('   [Error Data]', error.response.data);
    } else {
      console.error('❌ [Axios Network/Error]', error);
    }
    return Promise.reject(error);
  }
);

console.log('🔧 [API] Auto-detected Base URL:', api.defaults.baseURL)
console.log('🔧 [API] Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'SSR')

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// ✅ Automatically attach token from localStorage on each request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let token = getAccessToken()
      
      // Set up dev auth if needed in development
      if (!token && process.env.NODE_ENV === 'development') {
        setupDevAuth()
        token = getAccessToken()
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        // Add clear error when token is missing for protected routes
        const isAuthRequired = !config.url?.includes('/auth/') && !config.url?.includes('/public/')
        if (isAuthRequired && process.env.NODE_ENV !== 'development') {
          console.error('🚨 [API] Access token missing for protected route:', config.url)
          throw new Error('Authentication required: Access token not found in localStorage')
        }
      }
      
      // Add user ID to requests for server-side filtering (if available)
      const user = getUser()
      if (user && user.id) {
        config.headers['X-User-ID'] = user.id
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Helper function to retry with alternative backend URL
async function retryWithAlternativeBackend(originalRequest: any, error: any): Promise<any> {
  // Don't retry if this is already a retry attempt
  if (originalRequest._backendRetried) {
    return Promise.reject(error)
  }
  
  // Check if this is a network error or 5xx server error
  const isRetryableError = !error.response || (error.response.status >= 500)
  if (!isRetryableError) {
    return Promise.reject(error)
  }
  
  // Determine alternative URL
  const currentBaseURL = originalRequest.baseURL || api.defaults.baseURL
  const alternativeURL = currentBaseURL === LOCAL_BACKEND ? PROD_BACKEND : LOCAL_BACKEND
  
  console.log(`🔄 [API] Retrying with alternative backend: ${currentBaseURL} -> ${alternativeURL}`)
  
  // Mark this request as retried
  originalRequest._backendRetried = true
  originalRequest.baseURL = alternativeURL
  
  try {
    const response = await axios(originalRequest)
    console.log(`✅ [API] Alternative backend succeeded: ${alternativeURL}`)
    
    // Update the main API instance to use the working URL
    api.defaults.baseURL = alternativeURL
    
    return response
  } catch (retryError) {
    console.error(`❌ [API] Alternative backend also failed: ${alternativeURL}`, retryError)
    return Promise.reject(error) // Return original error
  }
}

// ✅ Enhanced error handling with token refresh and backend retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()
      
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refresh_token: refreshToken }
          )
          
          const { access_token, refresh_token: newRefreshToken } = response.data
          
          // Update tokens using canonical helpers
          setAccessToken(access_token)
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken)
          }
          
          // Update the authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          
          processQueue(null, access_token)
          
          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          
          // Refresh failed, redirect to login
          console.error('Token refresh failed:', refreshError)
          clearAuthData()
          
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        // No refresh token available, redirect to login
        console.warn('No refresh token available')
        clearAuthData()
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        
        return Promise.reject(error)
      }
    }

    // Try alternative backend for network errors and 5xx errors
    const shouldRetryWithAlternativeBackend = (
      !error.response || // Network error
      (error.response.status >= 500) // Server error
    ) && !originalRequest._backendRetried
    
    if (shouldRetryWithAlternativeBackend) {
      try {
        return await retryWithAlternativeBackend(originalRequest, error)
      } catch (retryError) {
        // Continue with normal error handling if retry fails
      }
    }

    // For other errors, just log and reject with comprehensive details
    console.error('🚨 [API] FULL ERROR OBJECT:', error)
    console.error('🚨 [API] ERROR RESPONSE:', error.response)
    console.error('🚨 [API] ERROR CONFIG:', error.config)
    console.error('🚨 [API] ERROR CODE:', error.code)
    console.error('🚨 [API] ERROR MESSAGE:', error.message)
    
    const errorDetails = {
      status: error.response?.status || 'No Status',
      statusText: error.response?.statusText || 'No Status Text', 
      message: error.response?.data?.message || error.message || 'No message',
      endpoint: error.config?.url || 'Unknown endpoint',
      method: error.config?.method?.toUpperCase() || 'Unknown method',
      data: error.response?.data || 'No response data',
      code: error.code || 'No error code',
      isNetworkError: !error.response,
      headers: error.config?.headers || {}
    }
    
    console.error('🚨 [API] PROCESSED ERROR DETAILS:', JSON.stringify(errorDetails, null, 2))
    
    // Create a detailed error message
    let errorMessage = 'API Request Failed'
    if (error.response) {
      errorMessage = `${errorDetails.method} ${errorDetails.endpoint} -> ${errorDetails.status} ${errorDetails.statusText}: ${errorDetails.message}`
    } else if (error.code) {
      errorMessage = `Network Error (${error.code}): ${errorDetails.message}`
    } else {
      errorMessage = `Unknown Error: ${errorDetails.message}`
    }
    
    const detailedError = new Error(errorMessage)
    
    return Promise.reject(detailedError)
  }
)

// Helper function to get current user ID
export const getCurrentUserId = (): string | null => {
  if (typeof window === 'undefined') return null
  
  const user = getUser()
  return user?.id || null
}

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const token = getAccessToken()
  const user = getUser()
  return !!(token && user)
}

// Utility function for making API calls with automatic retry
export const apiCall = async (config: AxiosRequestConfig) => {
  return await api(config)
}

// Utility function for GET requests with retry
export const apiGet = async (url: string, config?: AxiosRequestConfig) => {
  return await api.get(url, config)
}

// Utility function for POST requests with retry
export const apiPost = async (url: string, data?: any, config?: AxiosRequestConfig) => {
  return await api.post(url, data, config)
}

// Utility function for PUT requests with retry
export const apiPut = async (url: string, data?: any, config?: AxiosRequestConfig) => {
  return await api.put(url, data, config)
}

// Utility function for DELETE requests with retry
export const apiDelete = async (url: string, config?: AxiosRequestConfig) => {
  return await api.delete(url, config)
}

// Export the current base URL for reference
export { BASE_URL, LOCAL_BACKEND, PROD_BACKEND }

export default api

