/**
 * Development authentication helper
 * Provides mock authentication for development when backend is unreachable
 */

import {
  getAccessToken,
  getUser,
  setAccessToken,
  setRefreshToken,
  setUser,
  clearAuthData
} from '@/utils/authStorageMigation'

export const DEV_USER = {
  id: 'dev-user-123',
  email: 'developer@test.com',
  name: 'Development User',
  phone: '+234567890123',
  role: 'user',
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const DEV_TOKENS = {
  accessToken: 'dev-access-token-' + Date.now(),
  refreshToken: 'dev-refresh-token-' + Date.now()
}

/**
 * Set up development authentication in localStorage
 * Only runs in development mode when backend is unreachable
 */
export function setupDevAuth(): void {
  if (process.env.NODE_ENV !== 'development') return

  // Check if we already have auth tokens using canonical helpers
  const existingToken = getAccessToken()
  const existingUser = getUser()

  if (!existingToken || !existingUser) {
    console.log('🔧 [DevAuth] Setting up development authentication...')
    
    // Use canonical storage helpers
    setAccessToken(DEV_TOKENS.accessToken)
    setRefreshToken(DEV_TOKENS.refreshToken)
    setUser(DEV_USER)
    
    console.log('✅ [DevAuth] Development authentication configured')
  }
}

/**
 * Check if we're using development authentication
 */
export function isDevAuth(): boolean {
  if (process.env.NODE_ENV !== 'development') return false
  
  const token = getAccessToken()
  return token?.startsWith('dev-access-token-') || false
}

/**
 * Clear development authentication
 */
export function clearDevAuth(): void {
  clearAuthData()
  console.log('🧹 [DevAuth] Development authentication cleared')
}
