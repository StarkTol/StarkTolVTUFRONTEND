/**
 * Unit tests for HttpClient token refresh functionality
 * Focuses on the core refresh logic and 401 retry patterns
 */

// Mock axios module
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      defaults: { baseURL: 'http://localhost:8000' },
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      request: jest.fn()
    })),
    post: jest.fn()
  },
  post: jest.fn()
}))

import HttpClient from '../api/httpClient'
import axios from 'axios'

// Mock window.location
const mockLocationAssign = jest.fn()
Object.defineProperty(window, 'location', {
  value: { href: '', assign: mockLocationAssign },
  configurable: true
})

describe('HttpClient Token Refresh Logic', () => {
  let httpClient: HttpClient

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    
    // Create new instance
    httpClient = new HttpClient()
    
    // Reset location mock
    ;(window.location as any).href = ''
  })

  describe('Successful Token Refresh (401→200 path)', () => {
    test('should refresh token and retry request on 401', async () => {
      const refreshToken = 'valid-refresh-token'
      const newAccessToken = 'new-access-token'
      
      localStorage.setItem('refresh_token', refreshToken)

      // Mock the interceptor behavior manually
      const mockRequest = {
        url: '/protected',
        method: 'get',
        headers: {},
        skipAuthRefresh: false
      }

      // Simulate 401 response
      const mockError = {
        isAxiosError: true,
        response: { status: 401, data: { message: 'Unauthorized' } },
        config: mockRequest
      }

      // Mock refresh request success
      ;(axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          access_token: newAccessToken,
          refresh_token: 'new-refresh-token'
        }
      })

      // Mock retry request success  
      const axiosInstance = httpClient.getAxiosInstance()
      ;(axiosInstance.request as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: { data: 'protected-data' }
      })

      // Test the httpClient's internal refresh logic by simulating the error handler
      const httpClientInternal = httpClient as any
      
      try {
        await httpClientInternal.handleAuthError(mockError, mockRequest)
      } catch (error) {
        // Should not throw
      }

      // Verify refresh was called
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8000/auth/refresh',
        { refresh_token: refreshToken },
        { skipAuthRefresh: true }
      )

      // Verify tokens were updated
      expect(localStorage.getItem('access_token')).toBe(newAccessToken)
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token')
    })

    test('should handle concurrent 401 requests with single refresh', async () => {
      const refreshToken = 'valid-refresh-token'
      const newAccessToken = 'new-access-token'
      
      localStorage.setItem('refresh_token', refreshToken)

      // Mock refresh request with delay
      ;(axios.post as jest.Mock).mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            data: { access_token: newAccessToken }
          }), 50)
        )
      )

      const httpClientInternal = httpClient as any

      // Simulate multiple concurrent refresh attempts
      const promises: Promise<any>[] = []
      
      for (let i = 0; i < 3; i++) {
        promises.push(httpClientInternal.refreshToken())
      }

      const results = await Promise.all(promises)

      // All should resolve to the same token
      results.forEach(token => {
        expect(token).toBe(newAccessToken)
      })

      // Only one refresh request should have been made
      expect((axios.post as jest.Mock)).toHaveBeenCalledTimes(1)
    })
  })

  describe('Failed Token Refresh (401→401 logout path)', () => {
    test('should logout user when refresh token is invalid', async () => {
      const invalidRefreshToken = 'invalid-refresh-token'
      localStorage.setItem('refresh_token', invalidRefreshToken)
      localStorage.setItem('access_token', 'old-token')
      localStorage.setItem('user', JSON.stringify({ id: '123' }))

      // Mock refresh request failure
      (axios.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: { status: 401, data: { message: 'Invalid refresh token' } }
      })

      const httpClientInternal = httpClient as any

      try {
        await httpClientInternal.refreshToken()
      } catch (error) {
        // Expected to throw
      }

      // Verify auth data is cleared
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      
      // Verify redirect to login
      expect((window.location as any).href).toBe('/login')
    })

    test('should handle missing refresh token', async () => {
      // No refresh token in localStorage
      localStorage.setItem('access_token', 'old-token')

      const httpClientInternal = httpClient as any

      try {
        await httpClientInternal.refreshToken()
        fail('Should have thrown error')
      } catch (error) {
        expect(error.message).toBe('No refresh token available')
      }
    })
  })

  describe('Infinite Loop Protection', () => {
    test('should limit refresh attempts to prevent infinite loops', async () => {
      const refreshToken = 'problematic-token'
      localStorage.setItem('refresh_token', refreshToken)

      // Mock refresh to always fail
      (axios.post as jest.Mock).mockRejectedValue({
        isAxiosError: true,
        response: { status: 401 }
      })

      const httpClientInternal = httpClient as any

      // Make multiple refresh attempts
      let attempts = 0
      while (attempts < 5) {
        try {
          await httpClientInternal.refreshToken()
        } catch (error) {
          // Expected to fail
        }
        attempts++
      }

      // Should not exceed max attempts
      expect((axios.post as jest.Mock)).toHaveBeenCalledTimes(3) // MAX_REFRESH_ATTEMPTS
    })

    test('should reset attempts counter on successful refresh', async () => {
      const refreshToken = 'valid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      const httpClientInternal = httpClient as any

      // First successful refresh
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: { access_token: 'token1' }
      })

      await httpClientInternal.refreshToken()
      expect(httpClientInternal.refreshAttempts).toBe(0)

      // Second refresh should work (counter was reset)
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: { access_token: 'token2' }
      })

      await httpClientInternal.refreshToken()
      expect(httpClientInternal.refreshAttempts).toBe(0)
    })
  })

  describe('Error Handling', () => {
    test('should handle network errors during refresh', async () => {
      const refreshToken = 'valid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      // Mock network error
      (axios.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        code: 'NETWORK_ERROR',
        message: 'Network Error'
      })

      const httpClientInternal = httpClient as any

      try {
        await httpClientInternal.refreshToken()
        fail('Should have thrown error')
      } catch (error) {
        expect(error.message).toBe('Network Error')
      }
    })

    test('should handle malformed refresh response', async () => {
      const refreshToken = 'valid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      // Mock response without access_token
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: { message: 'Refreshed' } // Missing access_token
      })

      const httpClientInternal = httpClient as any

      try {
        await httpClientInternal.refreshToken()
        fail('Should have thrown error')
      } catch (error) {
        expect(error.message).toBe('No access token received from refresh endpoint')
      }
    })
  })

  describe('Queue Management', () => {
    test('should queue and resolve waiting promises on successful refresh', async () => {
      const refreshToken = 'valid-refresh-token'
      const newAccessToken = 'new-access-token'
      
      localStorage.setItem('refresh_token', refreshToken)

      const httpClientInternal = httpClient as any

      // Mock delayed refresh
      (axios.post as jest.Mock).mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            data: { access_token: newAccessToken }
          }), 100)
        )
      )

      // Start multiple refresh calls simultaneously
      const promise1 = httpClientInternal.refreshToken()
      const promise2 = httpClientInternal.refreshToken()
      const promise3 = httpClientInternal.refreshToken()

      const [token1, token2, token3] = await Promise.all([promise1, promise2, promise3])

      // All should get the same token
      expect(token1).toBe(newAccessToken)
      expect(token2).toBe(newAccessToken)
      expect(token3).toBe(newAccessToken)

      // Only one actual refresh call
      expect((axios.post as jest.Mock)).toHaveBeenCalledTimes(1)
    })

    test('should reject all queued promises on refresh failure', async () => {
      const refreshToken = 'invalid-refresh-token'
      localStorage.setItem('refresh_token', refreshToken)

      const httpClientInternal = httpClient as any

      // Mock refresh failure
      const refreshError = new Error('Refresh failed')
      (axios.post as jest.Mock).mockRejectedValueOnce(refreshError)

      // Start multiple refresh calls
      const promise1 = httpClientInternal.refreshToken()
      const promise2 = httpClientInternal.refreshToken()
      const promise3 = httpClientInternal.refreshToken()

      // All should reject with the same error
      await expect(promise1).rejects.toThrow('Refresh failed')
      await expect(promise2).rejects.toThrow('Refresh failed')
      await expect(promise3).rejects.toThrow('Refresh failed')
    })
  })
})
