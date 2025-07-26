// Simple test to check if backend is running
const axios = require('axios');

// Import centralized BASE_URL configuration
const { API_ENDPOINTS } = require('./lib/config/base-url');
const BACKEND_URL = `${API_ENDPOINTS.PRODUCTION}/api/v1`;

async function testBackend() {
    console.log('🔍 Testing backend connectivity...');
    console.log('Backend URL:', BACKEND_URL);
    
    try {
        // Test basic connectivity
        console.log('\n1. Testing basic connectivity...');
        const response = await axios.get(BACKEND_URL, { timeout: 10000 });
        console.log('✅ Backend is responding:', response.status, response.statusText);
        
    } catch (error) {
        console.log('❌ Backend connectivity failed:');
        console.log('Status:', error.response?.status || 'No response');
        console.log('Error:', error.code || error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('🚨 Backend server is not running or not accessible');
        } else if (error.code === 'ENOTFOUND') {
            console.log('🚨 Backend URL is not reachable');
        } else if (error.response?.status === 404) {
            console.log('ℹ️  Backend is running but no root endpoint exists (this might be normal)');
        }
    }
    
    try {
        // Test user profile endpoint (this will likely fail without auth, but shows if route exists)
        console.log('\n2. Testing user profile endpoint...');
        const profileResponse = await axios.get(`${BACKEND_URL}/user/profile`, { 
            timeout: 10000,
            validateStatus: () => true // Don't throw on 401/403
        });
        
        console.log('Profile endpoint status:', profileResponse.status);
        if (profileResponse.status === 401) {
            console.log('✅ Profile endpoint exists (401 means auth is required - normal)');
        } else if (profileResponse.status === 404) {
            console.log('❌ Profile endpoint not found - check your backend routes');
        } else {
            console.log('Profile response:', profileResponse.data);
        }
        
    } catch (error) {
        console.log('❌ Profile endpoint test failed:', error.message);
    }
}

testBackend();
