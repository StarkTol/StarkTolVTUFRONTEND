/**
 * Environment Configuration Utility
 * 
 * Provides dynamic environment configuration that works with both
 * local development and production environments.
 */

export interface EnvironmentConfig {
  apiBase: string
  baseUrl: string
  frontendUrl: string
  supabaseUrl: string
  supabaseAnonKey: string
  flutterwavePublicKey: string
  isProduction: boolean
  isDevelopment: boolean
  debugMode: boolean
  allowedOrigins: string[]
}

/**
 * Get the current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const isProduction = process.env.NODE_ENV === 'production'
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Check if we should use local backend (for development)
  const useLocalBackend = process.env.USE_LOCAL_BACKEND === 'true' || 
                          (isDevelopment && !process.env.NEXT_PUBLIC_API_BASE?.includes('backend-066c.onrender.com'))

  // Determine API base URL
  let apiBase: string
  let baseUrl: string
  
  if (useLocalBackend && isDevelopment) {
    apiBase = process.env.LOCAL_API_BASE || 'http://localhost:8000'
    baseUrl = process.env.LOCAL_BASE_URL || 'http://localhost:8000'
  } else {
    apiBase = process.env.PRODUCTION_API_BASE || 'https://backend-066c.onrender.com'
    baseUrl = process.env.PRODUCTION_BASE_URL || 'https://backend-066c.onrender.com/api/v1'
  }

  // Override with explicit environment variables if set
  if (process.env.NEXT_PUBLIC_API_BASE) {
    apiBase = process.env.NEXT_PUBLIC_API_BASE
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  }

  // Frontend URL
  const frontendUrl = isProduction 
    ? (process.env.NEXT_PUBLIC_APP_URL || 'https://starktolvtu.onrender.com')
    : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')

  // Parse allowed origins
  const allowedOriginsStr = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || 
    (isProduction ? 'https://starktolvtu.onrender.com' : 'http://localhost:3000')
  const allowedOrigins = allowedOriginsStr.split(',').map(origin => origin.trim())

  return {
    apiBase,
    baseUrl,
    frontendUrl,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    flutterwavePublicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
    isProduction,
    isDevelopment,
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' || isDevelopment,
    allowedOrigins
  }
}

/**
 * Get API endpoint URL
 */
export function getApiUrl(endpoint: string = ''): string {
  const config = getEnvironmentConfig()
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  const cleanBaseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl
  
  return cleanEndpoint ? `${cleanBaseUrl}/${cleanEndpoint}` : cleanBaseUrl
}

/**
 * Get full API base URL
 */
export function getApiBaseUrl(): string {
  return getEnvironmentConfig().apiBase
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return getEnvironmentConfig().isDevelopment
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return getEnvironmentConfig().isProduction
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return getEnvironmentConfig().debugMode
}

/**
 * Get frontend URL
 */
export function getFrontendUrl(): string {
  return getEnvironmentConfig().frontendUrl
}

/**
 * Log environment configuration (for debugging)
 */
export function logEnvironmentConfig(): void {
  if (!isDevelopment()) return

  const config = getEnvironmentConfig()
  console.log('🔧 [Environment] Configuration:', {
    apiBase: config.apiBase,
    baseUrl: config.baseUrl,
    frontendUrl: config.frontendUrl,
    isProduction: config.isProduction,
    isDevelopment: config.isDevelopment,
    debugMode: config.debugMode,
    hasSupabaseConfig: !!(config.supabaseUrl && config.supabaseAnonKey),
    hasFlutterwaveConfig: !!config.flutterwavePublicKey,
    allowedOrigins: config.allowedOrigins
  })
}

/**
 * Validate environment configuration
 */
export function validateEnvironmentConfig(): { isValid: boolean; errors: string[] } {
  const config = getEnvironmentConfig()
  const errors: string[] = []

  // Check required configuration
  if (!config.apiBase) {
    errors.push('API base URL is not configured')
  }

  if (!config.baseUrl) {
    errors.push('Base URL is not configured')
  }

  if (!config.frontendUrl) {
    errors.push('Frontend URL is not configured')
  }

  // Check Supabase configuration (optional but recommended for real-time features)
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    console.warn('⚠️ [Environment] Supabase configuration missing - real-time features will be disabled')
  }

  // Check Flutterwave configuration (optional)
  if (!config.flutterwavePublicKey) {
    console.warn('⚠️ [Environment] Flutterwave configuration missing - payment features will be disabled')
  }

  // Validate URL formats
  try {
    new URL(config.apiBase)
  } catch {
    errors.push('Invalid API base URL format')
  }

  try {
    new URL(config.baseUrl)
  } catch {
    errors.push('Invalid base URL format')
  }

  try {
    new URL(config.frontendUrl)
  } catch {
    errors.push('Invalid frontend URL format')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Auto-log configuration in development
if (typeof window !== 'undefined' && isDevelopment()) {
  logEnvironmentConfig()
}
