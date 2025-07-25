// utils/auth.ts
// @deprecated - This file is deprecated in favor of utils/authStorageMigation.ts
// Please use the canonical storage helpers from authStorageMigation.ts instead

import {
  getAccessToken as getCanonicalAccessToken,
  getRefreshToken as getCanonicalRefreshToken,
  getUser as getCanonicalUser,
  setAccessToken,
  setRefreshToken,
  setUser,
  clearAuthData as clearCanonicalAuthData,
  isAuthenticated as isCanonicalAuthenticated
} from './authStorageMigation'

export const ACCESS_TOKEN_KEY = "access_token"
export const REFRESH_TOKEN_KEY = "refresh_token"
export const USER_KEY = "user"
export const REMEMBER_ME_KEY = "remember_me"

type User = {
  id: string
  email: string
  full_name: string
  phone: string
  // Add other fields if needed
}

// Save auth info to localStorage - now uses canonical storage
/**
 * @deprecated Use individual setters from authStorageMigation.ts instead
 */
export function saveAuthData(
  accessToken: string,
  refreshToken: string,
  user: User,
  rememberMe = false
) {
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
  setUser(user)

  if (rememberMe) {
    localStorage.setItem(REMEMBER_ME_KEY, "true")
  }
}

// Get access token - now uses canonical storage
/**
 * @deprecated Use getAccessToken from authStorageMigation.ts instead
 */
export function getAccessToken(): string | null {
  return getCanonicalAccessToken()
}

// Get refresh token - now uses canonical storage
/**
 * @deprecated Use getRefreshToken from authStorageMigation.ts instead
 */
export function getRefreshToken(): string | null {
  return getCanonicalRefreshToken()
}

// Get user - now uses canonical storage
/**
 * @deprecated Use getUser from authStorageMigation.ts instead
 */
export function getUser(): User | null {
  return getCanonicalUser()
}

// Check if user is logged in - now uses canonical storage
/**
 * @deprecated Use isAuthenticated from authStorageMigation.ts instead
 */
export function isLoggedIn(): boolean {
  return isCanonicalAuthenticated()
}

// Clear all auth data (logout) - now uses canonical storage
/**
 * @deprecated Use clearAuthData from authStorageMigation.ts instead
 */
export function clearAuthData() {
  clearCanonicalAuthData()
  // Also clear remember_me which is specific to this legacy implementation
  localStorage.removeItem(REMEMBER_ME_KEY)
}
