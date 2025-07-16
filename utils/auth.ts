// utils/auth.ts

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

// Save auth info to localStorage
export function saveAuthData(
  accessToken: string,
  refreshToken: string,
  user: User,
  rememberMe = false
) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))

  if (rememberMe) {
    localStorage.setItem(REMEMBER_ME_KEY, "true")
  }
}

// Get access token
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

// Get refresh token
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// Get user
export function getUser(): User | null {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return !!getAccessToken()
}

// Clear all auth data (logout)
export function clearAuthData() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(REMEMBER_ME_KEY)
}
