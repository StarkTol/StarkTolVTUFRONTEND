/**
 * Centralized BASE_URL Configuration
 * 
 * This file provides a single source of truth for all API base URLs
 * across the entire frontend application. All literal URLs should be
 * replaced with references to these constants.
 */

// Environment detection
const isServer = typeof window === 'undefined'
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// Base URL constants
export const API_ENDPOINTS = {
  LOCAL: 'http://localhost:8000',
  PRODUCTION: 'https://backend-066c.onrender.com',
  FRONTEND_LOCAL: 'http://localhost:3000',
  FRONTEND_PRODUCTION: 'https://starktolvtu.onrender.com'
} as const

/**
 * Get the appropriate BASE_URL based on environment
 * This function handles both client-side and server-side detection
 */
export function getBaseUrl(): string {
  // Check for explicit environment variable override
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE
  }

  // Server-side rendering fallback
  if (isServer) {
    return isDevelopment ? API_ENDPOINTS.LOCAL : API_ENDPOINTS.PRODUCTION
  }

  // Client-side detection based on hostname
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return API_ENDPOINTS.LOCAL
  }

  return API_ENDPOINTS.PRODUCTION
}

/**
 * Get the appropriate frontend URL
 */
export function getFrontendUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (isServer) {
    return isDevelopment ? API_ENDPOINTS.FRONTEND_LOCAL : API_ENDPOINTS.FRONTEND_PRODUCTION
  }

  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return API_ENDPOINTS.FRONTEND_LOCAL
  }

  return API_ENDPOINTS.FRONTEND_PRODUCTION
}

/**
 * Main BASE_URL export - use this throughout the application
 * This is the primary constant that should replace all literal URLs
 */
export const BASE_URL = getBaseUrl()

/**
 * API URL with version prefix
 */
export const API_URL = `${BASE_URL}/api/v1`

/**
 * Frontend URL
 */
export const FRONTEND_URL = getFrontendUrl()

/**
 * Helper to build API endpoints
 */
export function buildApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_URL}/${cleanEndpoint}`
}

/**
 * Helper to build full URLs with BASE_URL
 */
export function buildUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${BASE_URL}/${cleanPath}`
}

/**
 * Environment info for debugging
 */
export const ENV_INFO = {
  isDevelopment,
  isProduction,
  isServer,
  BASE_URL,
  API_URL,
  FRONTEND_URL,
  hostname: isServer ? 'server' : window.location.hostname
} as const

/**
 * Log environment configuration (development only)
 */
if (isDevelopment && !isServer) {
  console.log('🔧 [BASE_URL] Configuration:', ENV_INFO)
}

export default BASE_URL
