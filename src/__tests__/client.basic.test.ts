/**
 * Basic Unit Tests for Centralized API Client
 * 
 * Simple tests to demonstrate core functionality without complex mocking.
 */

import { ApiClient, apiClient } from '../api/client'

describe('API Client Basic Functionality', () => {
  describe('ApiClient Class', () => {
    it('should create an instance with default configuration', () => {
      const client = new ApiClient()
      const config = client.getConfig()

      expect(config.timeout).toBe(30000)
      expect(config.retry?.maxRetries).toBe(3)
      expect(config.retry?.baseDelay).toBe(1000)
      expect(config.retry?.maxDelay).toBe(10000)
    })

    it('should create an instance with custom configuration', () => {
      const customConfig = {
        timeout: 60000,
        retry: {
          maxRetries: 5,
          baseDelay: 2000
        }
      }
      
      const client = new ApiClient(customConfig)
      const config = client.getConfig()

      expect(config.timeout).toBe(60000)
      expect(config.retry?.maxRetries).toBe(5)
      expect(config.retry?.baseDelay).toBe(2000)
    })

    it('should update configuration', () => {
      const client = new ApiClient()
      
      client.updateConfig({
        timeout: 45000
      })

      const config = client.getConfig()
      expect(config.timeout).toBe(45000)
    })

    it('should provide access to underlying httpClient', () => {
      const client = new ApiClient()
      const httpClient = client.getHttpClient()
      
      expect(httpClient).toBeDefined()
      expect(typeof httpClient.get).toBe('function')
      expect(typeof httpClient.post).toBe('function')
      expect(typeof httpClient.put).toBe('function')
      expect(typeof httpClient.patch).toBe('function')
      expect(typeof httpClient.delete).toBe('function')
    })

    it('should have authentication methods', () => {
      const client = new ApiClient()
      
      expect(typeof client.setAuthToken).toBe('function')
      expect(typeof client.clearAuthToken).toBe('function')
    })

    it('should throw error for unsupported HTTP method in request()', async () => {
      const client = new ApiClient()
      
      await expect(
        client.request('INVALID' as any, '/test')
      ).rejects.toThrow('Unsupported HTTP method: INVALID')
    })
  })

  describe('Singleton apiClient', () => {
    it('should export singleton instance', () => {
      expect(apiClient).toBeDefined()
      expect(apiClient instanceof ApiClient).toBe(true)
    })

    it('should maintain singleton behavior', () => {
      const reference1 = apiClient
      const reference2 = apiClient
      
      expect(reference1).toBe(reference2)
    })

    it('should have all expected methods', () => {
      expect(typeof apiClient.getList).toBe('function')
      expect(typeof apiClient.getOne).toBe('function')
      expect(typeof apiClient.post).toBe('function')
      expect(typeof apiClient.put).toBe('function')
      expect(typeof apiClient.patch).toBe('function')
      expect(typeof apiClient.delete).toBe('function')
      expect(typeof apiClient.request).toBe('function')
    })
  })

  describe('Query string building', () => {
    it('should build query string from parameters', () => {
      const client = new ApiClient()
      
      // Access the private method through a test-specific approach
      // In a real implementation, we might make this method protected or create a public utility
      const buildQueryString = (client as any).buildQueryString.bind(client)
      
      const params = {
        page: 1,
        limit: 20,
        search: 'test',
        active: true
      }
      
      const queryString = buildQueryString(params)
      
      expect(queryString).toContain('page=1')
      expect(queryString).toContain('limit=20')
      expect(queryString).toContain('search=test')
      expect(queryString).toContain('active=true')
      expect(queryString.startsWith('?')).toBe(true)
    })

    it('should filter out empty parameters', () => {
      const client = new ApiClient()
      const buildQueryString = (client as any).buildQueryString.bind(client)
      
      const params = {
        page: 1,
        limit: undefined,
        search: '',
        active: null,
        valid: 'test'
      }
      
      const queryString = buildQueryString(params)
      
      expect(queryString).toContain('page=1')
      expect(queryString).toContain('valid=test')
      expect(queryString).not.toContain('limit=')
      expect(queryString).not.toContain('search=')
      expect(queryString).not.toContain('active=')
    })

    it('should handle array parameters', () => {
      const client = new ApiClient()
      const buildQueryString = (client as any).buildQueryString.bind(client)
      
      const params = {
        tags: ['javascript', 'typescript', 'react'],
        single: 'value'
      }
      
      const queryString = buildQueryString(params)
      
      expect(queryString).toContain('tags=javascript')
      expect(queryString).toContain('tags=typescript')
      expect(queryString).toContain('tags=react')
      expect(queryString).toContain('single=value')
    })
  })

  describe('Type safety', () => {
    it('should maintain TypeScript type safety', () => {
      const client = new ApiClient()
      
      // These should compile without errors (tested at compile time)
      const listPromise = client.getList<{ id: string; name: string }>('/users')
      const onePromise = client.getOne<{ id: string }>('/users/1')
      const postPromise = client.post<{ id: string }, { name: string }>('/users', { name: 'test' })
      const putPromise = client.put<{ id: string }, { name: string }>('/users/1', { name: 'updated' })
      const patchPromise = client.patch<{ id: string }, Partial<{ name: string }>>('/users/1', { name: 'patched' })
      const deletePromise = client.delete<{ success: boolean }>('/users/1')
      
      // Verify promises are returned
      expect(listPromise).toBeInstanceOf(Promise)
      expect(onePromise).toBeInstanceOf(Promise)
      expect(postPromise).toBeInstanceOf(Promise)
      expect(putPromise).toBeInstanceOf(Promise)
      expect(patchPromise).toBeInstanceOf(Promise)
      expect(deletePromise).toBeInstanceOf(Promise)
    })
  })
})
