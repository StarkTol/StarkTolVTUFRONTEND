// Debug API connectivity script
// Run this in browser console to test API

const testRegistration = async () => {
  console.log('🧪 Testing API registration...')
  
  // Import BASE_URL from centralized configuration
  const { API_ENDPOINTS } = require('./lib/config/base-url')
  const baseURL = `${API_ENDPOINTS.PRODUCTION}/api/v1`
  const testData = {
    full_name: 'Test User Debug',
    email: `test${Date.now()}@example.com`,
    phone: '08012345678',
    password: 'password123'
  }
  
  try {
    console.log('📤 Sending request:', testData)
    
    const response = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
      mode: 'cors' // explicitly set CORS mode
    })
    
    console.log('📥 Response status:', response.status)
    console.log('📥 Response headers:', [...response.headers.entries()])
    
    const responseData = await response.json()
    console.log('📥 Response data:', responseData)
    
    if (response.ok) {
      console.log('✅ Registration successful!')
      return { success: true, data: responseData }
    } else {
      console.error('❌ Registration failed:', responseData)
      return { success: false, error: responseData }
    }
    
  } catch (error) {
    console.error('❌ Network or CORS error:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    
    // Check for common CORS issues
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('🚫 Likely CORS error - server may not allow requests from this origin')
    }
    
    return { success: false, error: error.message }
  }
}

// Also test a simple GET request
const testApiHealth = async () => {
  console.log('🏥 Testing API health...')
  
  try {
    // Import BASE_URL from centralized configuration
    const { API_ENDPOINTS } = require('./lib/config/base-url')
    const response = await fetch(`${API_ENDPOINTS.PRODUCTION}/api/v1/health`, {
      method: 'GET',
      mode: 'cors'
    })
    
    console.log('Health check status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API is healthy:', data)
    } else {
      console.error('❌ API health check failed:', response.statusText)
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error)
  }
}

// Run tests
console.log('🔍 Starting API diagnostic tests...')
testApiHealth()
testRegistration()
