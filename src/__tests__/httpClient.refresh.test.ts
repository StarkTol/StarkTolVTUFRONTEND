import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import HttpClient from '../api/httpClient'

// Mock window.location
const mockLocation = {
  href: ''
}

// Mock window.location assignment
Object.defineProperty(window, 'location', {
  value: mockLocation,
  configurable: true
})

// Mock axios to avoid CORS issues
jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  create: jest.fn(() => ({
    ...jest.requireActual('axios'),
    defaults: { baseURL: 'http://localhost:8000' },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}))

describe('HttpClient Token Refresh & 401 Retry Logic', () => {
  let httpClient: HttpClient
  let mock: AxiosMockAdapter

  beforeEach(() => {
    // Create a new instance for each test to ensure clean state
    httpClient = new HttpClient('http://localhost:8000')
    mock = new AxiosMockAdapter(axios)
    
    // Clear localStorage before each test
    localStorage.clear()
    
    // Reset mock location
    mockLocation.href = ''
  })

  afterEach(() => {
    mock.reset()
    localStorage.clear()
  })

  afterAll(() => {
    mock.restore()
  })

  describe('Successful Token Refresh (401→200 path)', () => {
    it('should refresh token on 401 and retry original request successfully', async () => {
      const refreshToken = 'valid-refresh-token'
      const newAccessToken = 'new-access-token'
      const newRefreshToken = 'new-refresh-token'
      
      localStorage.setItem('refresh_token', refreshToken)

      // First request returns 401
      mock.onGet('/protected-resource').replyOnce(401, { message: 'Unauthorized' })
      
      // Refresh token request succeeds
      mock.onPost('/auth/refresh', { refresh_token: refreshToken })
        .reply(200, {
          access_token: newAccessToken,
          refresh_token: newRefreshToken
        })
      
      // Retry of original request succeeds
      mock.onGet('/protected-resource').reply(200, { data: 'protected-data' })

      const response = await httpClient.get('/protected-resource')

      expect(response.success).toBe(true)
      expect(response.data).toEqual({ data: 'protected-data' })
      expect(localStorage.getItem('access_token')).toBe(newAccessToken)
      expect(localStorage.getItem('refresh_token')).toBe(newRefreshToken)
    })

    it('should queue concurrent requests during token refresh', async () => {
      const refreshToken = 'valid-refresh-token'
      const newAccessToken = 'new-access-token'
      
      localStorage.setItem('refresh_token', refreshToken)

      // All requests return 401 initially
      mock.onGet('/resource1').replyOnce(401)
      mock.onGet('/resource2').replyOnce(401)
      mock.onGet('/resource3').replyOnce(401)
      
      // Refresh token request succeeds (with delay to simulate network)
      mock.onPost('/auth/refresh').reply(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([200, { access_token: newAccessToken }])
          }, 100)
        })
      })
      
      // Retry requests succeed
      mock.onGet('/resource1').reply(200, { data: 'data1' })
      mock.onGet('/resource2').reply(200, { data: 'data2' })
      mock.onGet('/resource3').reply(200, { data: 'data3' })

      // Make concurrent requests
      const [response1, response2, response3] = await Promise.all([
        httpClient.get('/resource1'),
        httpClient.get('/resource2'),
        httpClient.get('/resource3')
      ])

      expect(response1.success).toBe(true)
      expect(response2.success).toBe(true)
      expect(response3.success).toBe(true)
      expect(response1.data).toEqual({ data: 'data1' })
      expect(response2.data).toEqual({ data: 'data2' })
      expect(response3.data).toEqual({ data: 'data3' })
      
      // Verify only one refresh token request was made
      const refreshCalls = mock.history.post.filter(call => call.url === '/auth/refresh')
      expect(refreshCalls).toHaveLength(1)
    })

    it('should handle refresh without new refresh token', async () => {
      const refreshToken = 'valid-refresh-token'
      const newAccessToken = 'new-access-token'
      
      localStorage.setItem('refresh_token', refreshToken)

      mock.onGet('/protected').replyOnce(401)
      mock.onPost('/auth/refresh').reply(200, {
        access_token: newAccessToken
        // No new refresh token provided
      })
      mock.onGet('/protected').reply(200, { data: 'success' })

      const response = await httpClient.get('/protected')

      expect(response.success).toBe(true)
      expect(localStorage.getItem('access_token')).toBe(newAccessToken)
      expect(localStorage.getItem('refresh_token')).toBe(refreshToken) // Unchanged
    })
  })

  describe('Failed Token Refresh (401→401 logout path)', () => {
    it('should logout user when refresh token is invalid', async () => {
      const invalidRefreshToken = 'invalid-refresh-token'
      localStorage.setItem('refresh_token', invalidRefreshToken)
      localStorage.setItem('access_token', 'old-access-token')
      localStorage.setItem('user', JSON.stringify({ id: '123', name: 'Test User' }))

      mock.onGet('/protected').replyOnce(401)
      mock.onPost('/auth/refresh').reply(401, { message: 'Invalid refresh token' })

      const response = await httpClient.get('/protected')

      expect(response.success).toBe(false)
      expect(response.error?.status).toBe(401)
      
      // Verify auth data is cleared
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      
      // Verify redirect to login
      expect(mockLocation.href).toBe('/login')
    })

    it('should logout when no refresh token is available', async () => {
      // No refresh token in localStorage
      localStorage.setItem('access_token', 'old-access-token')

      mock.onGet('/protected').replyOnce(401)

      const response = await httpClient.get('/protected')

      expect(response.success).toBe(false)
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(mockLocation.href).toBe('/login')
    })

    it('should fail all queued requests when refresh fails', async () => {
      const invalidRefreshToken = 'invalid-refresh-token'
      localStorage.setItem('refresh_token', invalidRefreshToken)

      // All requests return 401
      mock.onGet('/resource1').replyOnce(401)
      mock.onGet('/resource2').replyOnce(401)
      mock.onGet('/resource3').replyOnce(401)
      
      // Refresh fails
      mock.onPost('/auth/refresh').reply(401, { message: 'Invalid refresh token' })

      const [response1, response2, response3] = await Promise.all([
        httpClient.get('/resource1'),
        httpClient.get('/resource2'),
        httpClient.get('/resource3')
      ])

      expect(response1.success).toBe(false)
      expect(response2.success).toBe(false)
      expect(response3.success).toBe(false)
      
      expect(response1.error?.status).toBe(401)
      expect(response2.error?.status).toBe(401)
      expect(response3.error?.status).toBe(401)
    })
  })

  describe('Infinite Loop Protection', () => {
    it('should prevent infinite refresh loops with max attempts', async () => {
      const refreshToken = 'valid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      // Mock refresh to always return 401 to simulate a problematic scenario
      mock.onGet('/protected').reply(401)
      mock.onPost('/auth/refresh').reply(401)

      // Make multiple requests that will trigger refresh attempts
      const response1 = await httpClient.get('/protected')
      const response2 = await httpClient.get('/protected')
      const response3 = await httpClient.get('/protected')
      const response4 = await httpClient.get('/protected')

      // All should fail with 401
      expect(response1.success).toBe(false)
      expect(response2.success).toBe(false)
      expect(response3.success).toBe(false)
      expect(response4.success).toBe(false)

      // Verify maximum attempts were made (should be limited)
      const refreshCalls = mock.history.post.filter(call => call.url === '/auth/refresh')
      expect(refreshCalls.length).toBeLessThanOrEqual(3) // MAX_REFRESH_ATTEMPTS
    })

    it('should reset refresh attempts counter on successful refresh', async () => {
      const refreshToken = 'valid-refresh-token'
      const newAccessToken = 'new-access-token'
      
      localStorage.setItem('refresh_token', refreshToken)

      // First 401 and successful refresh
      mock.onGet('/protected').replyOnce(401)
      mock.onPost('/auth/refresh').replyOnce(200, { access_token: newAccessToken })
      mock.onGet('/protected').replyOnce(200, { data: 'success' })

      const response1 = await httpClient.get('/protected')
      expect(response1.success).toBe(true)

      // Second 401 (should work since counter was reset)
      mock.onGet('/another-protected').replyOnce(401)
      mock.onPost('/auth/refresh').replyOnce(200, { access_token: 'newer-access-token' })
      mock.onGet('/another-protected').replyOnce(200, { data: 'success2' })

      const response2 = await httpClient.get('/another-protected')
      expect(response2.success).toBe(true)
    })

    it('should not trigger refresh on requests with skipAuthRefresh flag', async () => {
      mock.onGet('/public').reply(401) // Should not trigger refresh

      const response = await httpClient.get('/public', { skipAuthRefresh: true })

      expect(response.success).toBe(false)
      expect(response.error?.status).toBe(401)
      
      // Verify no refresh was attempted
      const refreshCalls = mock.history.post.filter(call => call.url === '/auth/refresh')
      expect(refreshCalls).toHaveLength(0)
    })

    it('should not retry requests that are already marked as retry', async () => {
      const refreshToken = 'valid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      // Mock the internal axios instance to simulate a retry scenario
      const axiosInstance = httpClient.getAxiosInstance()
      const originalRequest = {
        url: '/protected',
        method: 'get',
        headers: {},
        _retry: true // Already marked as retry
      }

      mock.onGet('/protected').reply(401)

      // This should not trigger another refresh attempt
      try {
        await axiosInstance.request(originalRequest)
      } catch (error) {
        expect(error.response?.status).toBe(401)
      }

      // Verify no refresh was attempted for retry-marked requests
      const refreshCalls = mock.history.post.filter(call => call.url === '/auth/refresh')
      expect(refreshCalls).toHaveLength(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors during refresh', async () => {
      const refreshToken = 'valid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      mock.onGet('/protected').replyOnce(401)
      mock.onPost('/auth/refresh').networkError()

      const response = await httpClient.get('/protected')

      expect(response.success).toBe(false)
      expect(response.error?.isNetworkError).toBe(true)
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(mockLocation.href).toBe('/login')
    })

    it('should handle refresh response without access token', async () => {
      const refreshToken = 'valid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      mock.onGet('/protected').replyOnce(401)
      mock.onPost('/auth/refresh').reply(200, {
        // Missing access_token in response
        message: 'Token refreshed'
      })

      const response = await httpClient.get('/protected')

      expect(response.success).toBe(false)
      expect(response.error?.message).toContain('No access token received')
      expect(mockLocation.href).toBe('/login')
    })

    it('should handle malformed refresh response', async () => {
      const refreshToken = 'valid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      mock.onGet('/protected').replyOnce(401)
      mock.onPost('/auth/refresh').reply(200, 'invalid-json-response')

      const response = await httpClient.get('/protected')

      expect(response.success).toBe(false)
      expect(mockLocation.href).toBe('/login')
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple rapid 401s from different endpoints', async () => {
      const refreshToken = 'valid-refresh-token'
      const newAccessToken = 'new-access-token'
      
      localStorage.setItem('refresh_token', refreshToken)

      // Multiple endpoints returning 401
      mock.onGet('/api/users').replyOnce(401)
      mock.onPost('/api/posts').replyOnce(401)
      mock.onPut('/api/settings').replyOnce(401)
      
      // Single refresh should handle all
      mock.onPost('/auth/refresh').reply(200, { access_token: newAccessToken })
      
      // Successful retries
      mock.onGet('/api/users').reply(200, { data: 'users' })
      mock.onPost('/api/posts').reply(200, { data: 'post-created' })
      mock.onPut('/api/settings').reply(200, { data: 'settings-updated' })

      const [users, posts, settings] = await Promise.all([
        httpClient.get('/api/users'),
        httpClient.post('/api/posts', { title: 'Test' }),
        httpClient.put('/api/settings', { theme: 'dark' })
      ])

      expect(users.success).toBe(true)
      expect(posts.success).toBe(true)
      expect(settings.success).toBe(true)
      
      // Only one refresh should have been called
      const refreshCalls = mock.history.post.filter(call => call.url === '/auth/refresh')
      expect(refreshCalls).toHaveLength(1)
    })

    it('should handle server-side errors during refresh gracefully', async () => {
      const refreshToken = 'valid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      mock.onGet('/protected').replyOnce(401)
      mock.onPost('/auth/refresh').reply(500, { message: 'Internal server error' })

      const response = await httpClient.get('/protected')

      expect(response.success).toBe(false)
      expect(response.error?.status).toBe(500)
      expect(mockLocation.href).toBe('/login')
    })
  })
})
