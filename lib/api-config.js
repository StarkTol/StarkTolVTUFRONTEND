/**
 * Smart API Configuration
 * Automatically detects and switches between local and production backends
 */

let currentApiBase = null;
let isDetecting = false;

// Import centralized BASE_URL configuration
import { API_ENDPOINTS } from './config/base-url'

// API endpoints using centralized constants
const LOCAL_API = process.env.NEXT_PUBLIC_API_BASE || API_ENDPOINTS.LOCAL;
const PRODUCTION_API = process.env.NEXT_PUBLIC_FALLBACK_API_BASE || API_ENDPOINTS.PRODUCTION;
const AUTO_DETECT = process.env.NEXT_PUBLIC_AUTO_DETECT_BACKEND === 'true';

/**
 * Test if an API endpoint is reachable
 */
async function testApiEndpoint(baseUrl, timeout = 3000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log(`API test failed for ${baseUrl}:`, error.message);
    return false;
  }
}

/**
 * Detect the best available API endpoint
 */
async function detectApiEndpoint() {
  if (isDetecting) return currentApiBase;
  
  isDetecting = true;
  
  try {
    console.log('🔍 Detecting best API endpoint...');
    
    // If auto-detect is disabled, use the primary API
    if (!AUTO_DETECT) {
      currentApiBase = LOCAL_API;
      console.log('📍 Auto-detect disabled, using:', currentApiBase);
      return currentApiBase;
    }
    
    // Test local API first (faster for development)
    console.log('🏠 Testing local API...');
    const localAvailable = await testApiEndpoint(LOCAL_API, 2000);
    
    if (localAvailable) {
      currentApiBase = LOCAL_API;
      console.log('✅ Using local API:', currentApiBase);
      return currentApiBase;
    }
    
    // Fallback to production API
    console.log('🌐 Local not available, testing production API...');
    const productionAvailable = await testApiEndpoint(PRODUCTION_API, 5000);
    
    if (productionAvailable) {
      currentApiBase = PRODUCTION_API;
      console.log('✅ Using production API:', currentApiBase);
      return currentApiBase;
    }
    
    // If both fail, default to production (might be a connectivity issue)
    currentApiBase = PRODUCTION_API;
    console.log('⚠️ Both APIs unreachable, defaulting to production:', currentApiBase);
    return currentApiBase;
    
  } catch (error) {
    console.error('❌ API detection failed:', error);
    currentApiBase = PRODUCTION_API;
    return currentApiBase;
  } finally {
    isDetecting = false;
  }
}

/**
 * Get the current API base URL
 */
export async function getApiBase() {
  if (!currentApiBase) {
    await detectApiEndpoint();
  }
  return currentApiBase;
}

/**
 * Get the full API URL with version
 */
export async function getApiUrl() {
  const base = await getApiBase();
  return `${base}/api/v1`;
}

/**
 * Create an API request with automatic endpoint detection
 */
export async function apiRequest(endpoint, options = {}) {
  const apiUrl = await getApiUrl();
  const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // For cookies/sessions
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('API Request failed:', error);
    
    // If current endpoint fails, try to re-detect and retry once
    if (!isDetecting) {
      console.log('🔄 API failed, re-detecting endpoint...');
      currentApiBase = null;
      const newApiUrl = await getApiUrl();
      const newUrl = `${newApiUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      
      console.log(`🔄 Retry API Request: ${options.method || 'GET'} ${newUrl}`);
      return fetch(newUrl, finalOptions);
    }
    
    throw error;
  }
}

/**
 * Get current API status
 */
export function getApiStatus() {
  return {
    current: currentApiBase,
    local: LOCAL_API,
    production: PRODUCTION_API,
    autoDetect: AUTO_DETECT,
  };
}

/**
 * Force refresh API detection
 */
export async function refreshApiDetection() {
  currentApiBase = null;
  return await detectApiEndpoint();
}

// Initialize on load
if (typeof window !== 'undefined') {
  detectApiEndpoint();
}
