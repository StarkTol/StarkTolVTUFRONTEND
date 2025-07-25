// lib/api.ts

import axios, { AxiosRequestConfig } from 'axios'
import { setupDevAuth, isDevAuth } from './dev-auth'
import {
  getAccessToken,
  getRefreshToken,
  getUser,
  setAccessToken,
  setRefreshToken,
  clearAuthData
} from '@/utils/authStorageMigation'

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
  withCredentials: false, // Don't send cookies for CORS
})

console.log('🔧 [API] Base URL:', api.defaults.baseURL)

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

// ✅ Enhanced error handling with token refresh
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

export default api

