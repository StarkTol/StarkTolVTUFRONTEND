/**
 * Unit tests for Authentication Storage Migration Utility
 */

import {
  CANONICAL_KEYS,
  migrateAuthStorageKeys,
  getAccessToken,
  getRefreshToken,
  getUser,
  setAccessToken,
  setRefreshToken,
  setUser,
  clearAuthData,
  isAuthenticated
} from '../utils/authStorageMigation'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock console.log to prevent test output noise
const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {})

describe('Authentication Storage Migration', () => {
  beforeEach(() => {
    localStorage.clear()
    consoleMock.mockClear()
  })

  afterAll(() => {
    consoleMock.mockRestore()
  })

  describe('CANONICAL_KEYS', () => {
    it('should define the correct canonical keys', () => {
      expect(CANONICAL_KEYS.ACCESS_TOKEN).toBe('access_token')
      expect(CANONICAL_KEYS.REFRESH_TOKEN).toBe('refresh_token')
      expect(CANONICAL_KEYS.USER).toBe('user')
    })
  })

  describe('migrateAuthStorageKeys', () => {
    it('should migrate legacy accessToken to canonical access_token', () => {
      // Set up legacy keys
      localStorage.setItem('accessToken', 'legacy-access-token')
      localStorage.setItem('refreshToken', 'legacy-refresh-token')

      migrateAuthStorageKeys()

      // Should have canonical keys
      expect(localStorage.getItem('access_token')).toBe('legacy-access-token')
      expect(localStorage.getItem('refresh_token')).toBe('legacy-refresh-token')

      // Should have removed legacy keys
      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
    })

    it('should not migrate if no legacy keys exist', () => {
      migrateAuthStorageKeys()

      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
      expect(consoleMock).toHaveBeenCalledWith(
        '✅ [AuthMigration] No migration needed - already using canonical keys'
      )
    })

    it('should handle partial migration', () => {
      // Only set one legacy key
      localStorage.setItem('accessToken', 'legacy-access-token')

      migrateAuthStorageKeys()

      expect(localStorage.getItem('access_token')).toBe('legacy-access-token')
      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
    })

    it('should not affect existing canonical keys', () => {
      // Set canonical keys
      localStorage.setItem('access_token', 'canonical-access-token')
      localStorage.setItem('user', JSON.stringify({ id: '123', name: 'Test' }))

      migrateAuthStorageKeys()

      // Should remain unchanged
      expect(localStorage.getItem('access_token')).toBe('canonical-access-token')
      expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: '123', name: 'Test' }))
    })
  })

  describe('Getter functions', () => {
    beforeEach(() => {
      localStorage.setItem('access_token', 'test-access-token')
      localStorage.setItem('refresh_token', 'test-refresh-token')
      localStorage.setItem('user', JSON.stringify({ id: '123', email: 'test@example.com' }))
    })

    it('should get access token using canonical key', () => {
      expect(getAccessToken()).toBe('test-access-token')
    })

    it('should get refresh token using canonical key', () => {
      expect(getRefreshToken()).toBe('test-refresh-token')
    })

    it('should get and parse user data using canonical key', () => {
      const user = getUser()
      expect(user).toEqual({ id: '123', email: 'test@example.com' })
    })

    it('should return null if tokens do not exist', () => {
      localStorage.clear()
      expect(getAccessToken()).toBeNull()
      expect(getRefreshToken()).toBeNull()
      expect(getUser()).toBeNull()
    })

    it('should handle invalid user JSON gracefully', () => {
      localStorage.setItem('user', 'invalid-json')
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(getUser()).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to parse user data from localStorage:',
        expect.any(SyntaxError)
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Setter functions', () => {
    it('should set access token using canonical key', () => {
      setAccessToken('new-access-token')
      expect(localStorage.getItem('access_token')).toBe('new-access-token')
    })

    it('should set refresh token using canonical key', () => {
      setRefreshToken('new-refresh-token')
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token')
    })

    it('should set user data using canonical key', () => {
      const user = { id: '456', email: 'new@example.com' }
      setUser(user)
      expect(localStorage.getItem('user')).toBe(JSON.stringify(user))
    })
  })

  describe('clearAuthData', () => {
    it('should clear all canonical authentication data', () => {
      localStorage.setItem('access_token', 'test-access-token')
      localStorage.setItem('refresh_token', 'test-refresh-token')
      localStorage.setItem('user', JSON.stringify({ id: '123' }))
      localStorage.setItem('other_key', 'should-remain')

      clearAuthData()

      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(localStorage.getItem('other_key')).toBe('should-remain')
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when both token and user exist', () => {
      localStorage.setItem('access_token', 'test-token')
      localStorage.setItem('user', JSON.stringify({ id: '123' }))

      expect(isAuthenticated()).toBe(true)
    })

    it('should return false when token is missing', () => {
      localStorage.setItem('user', JSON.stringify({ id: '123' }))

      expect(isAuthenticated()).toBe(false)
    })

    it('should return false when user is missing', () => {
      localStorage.setItem('access_token', 'test-token')

      expect(isAuthenticated()).toBe(false)
    })

    it('should return false when both are missing', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('should return false when user data is invalid JSON', () => {
      localStorage.setItem('access_token', 'test-token')
      localStorage.setItem('user', 'invalid-json')

      expect(isAuthenticated()).toBe(false)
    })
  })

  describe('Server-side compatibility', () => {
    const originalWindow = global.window

    beforeAll(() => {
      // @ts-ignore
      delete global.window
    })

    afterAll(() => {
      global.window = originalWindow
    })

    it('should handle server-side rendering gracefully', () => {
      expect(() => migrateAuthStorageKeys()).not.toThrow()
    })
  })
})
