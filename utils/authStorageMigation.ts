/**
 * Authentication Storage Migration Utility
 * 
 * This utility handles the migration from old localStorage keys to the canonical key set:
 * - access_token
 * - refresh_token  
 * - user
 */

// Canonical key set
export const CANONICAL_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
} as const

// Legacy key mappings that need to be migrated
const LEGACY_KEY_MAPPINGS = {
  // Old key -> Canonical key
  'accessToken': CANONICAL_KEYS.ACCESS_TOKEN,
  'refreshToken': CANONICAL_KEYS.REFRESH_TOKEN,
  // 'user' is already canonical
} as const

/**
 * Migrates old localStorage keys to canonical format
 * Reads old keys once, writes to canonical keys, then removes old keys
 */
export function migrateAuthStorageKeys(): void {
  if (typeof window === 'undefined') return

  console.log('🔄 [AuthMigration] Starting authentication storage migration...')

  let migrationPerformed = false

  // Migrate each legacy key to canonical format
  Object.entries(LEGACY_KEY_MAPPINGS).forEach(([oldKey, canonicalKey]) => {
    const oldValue = localStorage.getItem(oldKey)
    
    if (oldValue !== null) {
      console.log(`🔄 [AuthMigration] Migrating ${oldKey} -> ${canonicalKey}`)
      
      // Set canonical key
      localStorage.setItem(canonicalKey, oldValue)
      
      // Remove old key
      localStorage.removeItem(oldKey)
      
      migrationPerformed = true
    }
  })

  if (migrationPerformed) {
    console.log('✅ [AuthMigration] Authentication storage migration completed')
  } else {
    console.log('✅ [AuthMigration] No migration needed - already using canonical keys')
  }
}

/**
 * Gets access token using canonical key
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(CANONICAL_KEYS.ACCESS_TOKEN)
}

/**
 * Gets refresh token using canonical key
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(CANONICAL_KEYS.REFRESH_TOKEN)
}

/**
 * Gets user data using canonical key
 */
export function getUser(): any | null {
  const userJson = localStorage.getItem(CANONICAL_KEYS.USER)
  if (userJson) {
    try {
      return JSON.parse(userJson)
    } catch (e) {
      console.error('Failed to parse user data from localStorage:', e)
      return null
    }
  }
  return null
}

/**
 * Sets access token using canonical key
 */
export function setAccessToken(token: string): void {
  localStorage.setItem(CANONICAL_KEYS.ACCESS_TOKEN, token)
}

/**
 * Sets refresh token using canonical key
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem(CANONICAL_KEYS.REFRESH_TOKEN, token)
}

/**
 * Sets user data using canonical key
 */
export function setUser(user: any): void {
  localStorage.setItem(CANONICAL_KEYS.USER, JSON.stringify(user))
}

/**
 * Clears all authentication data using canonical keys
 */
export function clearAuthData(): void {
  localStorage.removeItem(CANONICAL_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(CANONICAL_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(CANONICAL_KEYS.USER)
}

/**
 * Checks if user is authenticated using canonical keys
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken()
  const user = getUser()
  return !!(token && user)
}
