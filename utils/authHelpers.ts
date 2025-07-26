/**
 * Authentication Helper Utilities
 * 
 * Provides helper functions for authentication validation, 
 * user data management, and error handling.
 */

import { getUser, getAccessToken, getRefreshToken } from './authStorageMigation'

export interface AuthUser {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  fullName?: string
  phone?: string
  role?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export interface AuthValidationResult {
  isValid: boolean
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  errors: string[]
}

/**
 * Validates current authentication state
 */
export function validateAuthState(): AuthValidationResult {
  const errors: string[] = []
  
  // Get stored auth data
  const user = getUser()
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  
  // Validate user data
  if (!user) {
    errors.push('No user data found')
  } else {
    if (!user.id) {
      errors.push('User ID is missing')
    }
    if (!user.email) {
      errors.push('User email is missing')
    }
  }
  
  // Validate access token
  if (!accessToken) {
    errors.push('Access token is missing')
  } else {
    // Basic JWT format validation (should have 3 parts separated by dots)
    const tokenParts = accessToken.split('.')
    if (tokenParts.length !== 3) {
      errors.push('Access token format is invalid')
    }
  }
  
  // Refresh token is optional but should be present for better UX
  if (!refreshToken) {
    console.warn('🔄 [AuthHelpers] Refresh token is missing - user will need to re-login when access token expires')
  }
  
  const isValid = errors.length === 0
  
  return {
    isValid,
    user: isValid ? user : null,
    accessToken: isValid ? accessToken : null,
    refreshToken,
    errors
  }
}

/**
 * Validates if user data matches expected structure
 */
export function validateUserData(userData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!userData) {
    errors.push('User data is null or undefined')
    return { isValid: false, errors }
  }
  
  // Required fields
  const requiredFields = ['id', 'email']
  requiredFields.forEach(field => {
    if (!userData[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  })
  
  // Email format validation
  if (userData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      errors.push('Invalid email format')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Normalizes user data from different API response formats
 */
export function normalizeUserData(rawUserData: any): AuthUser | null {
  if (!rawUserData) return null
  
  const normalized: AuthUser = {
    id: rawUserData.id || rawUserData.user_id || rawUserData.userId,
    email: rawUserData.email,
    name: rawUserData.name || rawUserData.full_name || rawUserData.fullName,
    firstName: rawUserData.first_name || rawUserData.firstName,
    lastName: rawUserData.last_name || rawUserData.lastName,
    phone: rawUserData.phone || rawUserData.phone_number || rawUserData.phoneNumber,
    role: rawUserData.role,
    createdAt: rawUserData.created_at || rawUserData.createdAt,
    updatedAt: rawUserData.updated_at || rawUserData.updatedAt
  }
  
  // Create full name if not provided
  if (!normalized.name && normalized.firstName && normalized.lastName) {
    normalized.name = `${normalized.firstName} ${normalized.lastName}`
    normalized.fullName = normalized.name
  }
  
  // Remove undefined values
  Object.keys(normalized).forEach(key => {
    if (normalized[key] === undefined) {
      delete normalized[key]
    }
  })
  
  return normalized
}

/**
 * Validates if two user objects represent the same user
 */
export function validateUserMatch(user1: any, user2: any): boolean {
  if (!user1 || !user2) return false
  
  // Check ID match (try different possible field names)
  const id1 = user1.id || user1.user_id || user1.userId
  const id2 = user2.id || user2.user_id || user2.userId
  
  if (id1 && id2) {
    return id1.toString() === id2.toString()
  }
  
  // Fallback to email match
  if (user1.email && user2.email) {
    return user1.email.toLowerCase() === user2.email.toLowerCase()
  }
  
  return false
}

/**
 * Generates a user-friendly error message from auth errors
 */
export function getAuthErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred'
  
  // Handle network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to server. Please check your internet connection.'
  }
  
  // Handle HTTP errors
  if (error.response) {
    const status = error.response.status
    const errorData = error.response.data
    
    switch (status) {
      case 400:
        return errorData?.message || 'Invalid request. Please check your input.'
      case 401:
        return 'Invalid credentials. Please check your email and password.'
      case 403:
        return 'Access denied. Please contact support if this continues.'
      case 404:
        return 'User not found. Please check your email address.'
      case 409:
        return 'User already exists with this email address.'
      case 422:
        return errorData?.message || 'Invalid data format. Please check your input.'
      case 429:
        return 'Too many attempts. Please try again later.'
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later.'
      default:
        return errorData?.message || `Server error (${status}). Please try again.`
    }
  }
  
  // Handle custom error messages
  if (error.message) {
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Checks if a JWT token is expired (without verifying signature)
 */
export function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.')
    const decoded = JSON.parse(atob(payload))
    const currentTime = Math.floor(Date.now() / 1000)
    
    return decoded.exp < currentTime
  } catch {
    // If we can't decode the token, consider it expired
    return true
  }
}

/**
 * Gets the expiration time of a JWT token
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const [, payload] = token.split('.')
    const decoded = JSON.parse(atob(payload))
    
    if (decoded.exp) {
      return new Date(decoded.exp * 1000)
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Calculates how much time is left before token expiration
 */
export function getTimeUntilExpiration(token: string): number {
  const expiration = getTokenExpiration(token)
  if (!expiration) return 0
  
  return Math.max(0, expiration.getTime() - Date.now())
}

/**
 * Checks if authentication state is healthy
 */
export function isAuthHealthy(): boolean {
  const validation = validateAuthState()
  
  if (!validation.isValid) {
    return false
  }
  
  // Check if token is expired
  if (validation.accessToken && isTokenExpired(validation.accessToken)) {
    console.warn('🔑 [AuthHelpers] Access token is expired')
    return false
  }
  
  return true
}
