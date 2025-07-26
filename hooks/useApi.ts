/**
 * React Hook for Smart API Configuration
 * Provides easy access to auto-detecting API configuration in React components
 */

import { useState, useEffect, useCallback } from 'react'
import { getApiBase, getApiUrl, getApiStatus, refreshApiDetection, apiRequest } from '../lib/api-config'

export interface ApiStatus {
  current: string | null
  local: string
  production: string
  autoDetect: boolean
  isDetecting: boolean
  lastDetected: Date | null
}

/**
 * Hook for accessing smart API configuration
 */
export function useApiConfig() {
  const [apiBase, setApiBase] = useState<string | null>(null)
  const [apiUrl, setApiUrl] = useState<string | null>(null)
  
  const [status, setStatus] = useState<ApiStatus>({
    current: null,
    local: 'http://localhost:8000',
    production: 'https://backend-066c.onrender.com',
    autoDetect: true,
    isDetecting: false,
    lastDetected: null
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load initial configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true)
        setStatus(prev => ({ ...prev, isDetecting: true }))

        const [base, url, apiStatus] = await Promise.all([
          getApiBase(),
          getApiUrl(),
          getApiStatus()
        ])

        setApiBase(base)
        setApiUrl(url)
        setStatus({
          current: apiStatus.current,
          local: apiStatus.local,
          production: apiStatus.production,
          autoDetect: apiStatus.autoDetect,
          isDetecting: false,
          lastDetected: new Date()
        })
      } catch (error) {
        console.error('Failed to load API configuration:', error)
        setStatus(prev => ({ ...prev, isDetecting: false }))
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  // Refresh API detection
  const refresh = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, isDetecting: true }))
      
      const base = await refreshApiDetection()
      const url = await getApiUrl()
      const apiStatus = getApiStatus()

      setApiBase(base)
      setApiUrl(url)
      setStatus({
        current: apiStatus.current,
        local: apiStatus.local,
        production: apiStatus.production,
        autoDetect: apiStatus.autoDetect,
        isDetecting: false,
        lastDetected: new Date()
      })

      return base
    } catch (error) {
      console.error('Failed to refresh API configuration:', error)
      setStatus(prev => ({ ...prev, isDetecting: false }))
      throw error
    }
  }, [])

  // Make API request using smart configuration
  const request = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    return apiRequest(endpoint, options)
  }, [])

  return {
    // Current configuration
    apiBase,
    apiUrl,
    status,
    isLoading,

    // Actions
    refresh,
    request,

    // Utility properties
    isLocal: status.current?.includes('localhost'),
    isProduction: status.current?.includes('onrender.com'),
    hasDetected: !!status.current,
    isAutoDetectEnabled: status.autoDetect
  }
}

/**
 * Hook for making API requests with smart endpoint detection
 */
export function useApiRequest() {
  const { request, refresh, status } = useApiConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await request(endpoint, options)
      return response
    } catch (err: any) {
      const errorMessage = err.message || 'Request failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [request])

  const retry = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    // First refresh the API detection, then retry the request
    await refresh()
    return execute(endpoint, options)
  }, [refresh, execute])

  return {
    execute,
    retry,
    isLoading,
    error,
    clearError: () => setError(null),
    status
  }
}

/**
 * Hook for checking API connectivity
 */
export function useApiHealth() {
  const { apiBase, refresh } = useApiConfig()
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkHealth = useCallback(async () => {
    if (!apiBase) return

    try {
      setIsChecking(true)
      
      const response = await fetch(`${apiBase}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      const healthy = response.ok
      setIsHealthy(healthy)
      setLastCheck(new Date())
      
      return healthy
    } catch (error) {
      setIsHealthy(false)
      setLastCheck(new Date())
      return false
    } finally {
      setIsChecking(false)
    }
  }, [apiBase])

  // Auto-check health when API base changes
  useEffect(() => {
    if (apiBase) {
      checkHealth()
    }
  }, [apiBase, checkHealth])

  const recheckWithRefresh = useCallback(async () => {
    await refresh()
    return checkHealth()
  }, [refresh, checkHealth])

  return {
    isHealthy,
    isChecking,
    lastCheck,
    checkHealth,
    recheckWithRefresh
  }
}

/**
 * Hook for displaying API status information
 */
export function useApiStatus() {
  const { status, apiBase, apiUrl, isLoading } = useApiConfig()
  const { isHealthy, isChecking, checkHealth } = useApiHealth()

  const getStatusDisplay = useCallback(() => {
    if (isLoading) return { text: 'Loading...', color: 'gray', icon: '⏳' }
    if (isChecking) return { text: 'Checking...', color: 'yellow', icon: '🔍' }
    if (!status.current) return { text: 'Not Connected', color: 'red', icon: '❌' }
    
    const isLocal = status.current.includes('localhost')
    const isHealthyStatus = isHealthy === true
    
    if (isLocal && isHealthyStatus) return { text: 'Local (Healthy)', color: 'green', icon: '🏠' }
    if (isLocal && isHealthy === false) return { text: 'Local (Unhealthy)', color: 'orange', icon: '🏠' }
    if (!isLocal && isHealthyStatus) return { text: 'Production (Healthy)', color: 'green', icon: '🌐' }
    if (!isLocal && isHealthy === false) return { text: 'Production (Unhealthy)', color: 'orange', icon: '🌐' }
    
    return { text: 'Unknown', color: 'gray', icon: '❓' }
  }, [isLoading, isChecking, status.current, isHealthy])

  return {
    ...status,
    apiBase,
    apiUrl,
    isHealthy,
    isChecking,
    display: getStatusDisplay(),
    checkHealth
  }
}

export default useApiConfig
