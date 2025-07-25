/**
 * Unit Tests for Centralized API Client
 * 
 * Tests the typed generic helpers and functionality of the apiClient wrapper.
 */

import MockAdapter from 'axios-mock-adapter'
import { apiClient, ApiClient, getList, getOne, post, put, patch, del } from '../api/client'
import { httpClient } from '../api/httpClient'
import type { User, PaginatedResponse } from '../api/types'

// Mock user type for testing
interface TestUser {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
}

describe('Centralized API Client', () => {
  let mock: MockAdapter

  beforeEach(() => {
    // Create a fresh mock adapter for each test
    mock = new MockAdapter(httpClient.getAxiosInstance())
  })

  afterEach(() => {
    mock.reset()
  })

  afterAll(() => {
    mock.restore()
  })

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
  })

  describe('getList<T> method', () => {
    it('should fetch paginated list with query parameters', async () => {
      const mockData: PaginatedResponse<TestUser> = {
        data: [
          { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
        ],
        meta: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }

      mock.onGet('/users?page=1&limit=20&search=john').reply(200, {
        success: true,
        message: 'Users fetched successfully',
        data: mockData
      })

      const response = await apiClient.getList<TestUser>('/users', {
        page: 1,
        limit: 20,
        search: 'john'
      })

      expect(response.success).toBe(true)
      expect(response.data?.data).toHaveLength(2)
      expect(response.data?.meta.total).toBe(2)
    })

    it('should handle empty query parameters', async () => {
      const mockData: PaginatedResponse<TestUser> = {
        data: [],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }

      mock.onGet('/users').reply(200, {
        success: true,
        message: 'Users fetched successfully',
        data: mockData
      })

      const response = await apiClient.getList<TestUser>('/users')

      expect(response.success).toBe(true)
      expect(response.data?.data).toHaveLength(0)
    })

    it('should filter out undefined/null/empty query parameters', async () => {
      mock.onGet('/users?page=1&search=test').reply(200, {
        success: true,
        message: 'Users fetched successfully',
        data: { data: [], meta: {} }
      })

      await apiClient.getList<TestUser>('/users', {
        page: 1,
        limit: undefined,
        search: 'test',
        sortBy: null,
        sortOrder: ''
      })

      // Verify that only non-empty parameters were included
      expect(mock.history.get[0].url).toBe('/users?page=1&search=test')
    })
  })

  describe('getOne<T> method', () => {
    it('should fetch a single item by URL', async () => {
      const mockUser: TestUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }

      mock.onGet('/users/1').reply(200, {
        success: true,
        message: 'User fetched successfully',
        data: mockUser
      })

      const response = await apiClient.getOne<TestUser>('/users/1')

      expect(response.success).toBe(true)
      expect(response.data?.id).toBe('1')
      expect(response.data?.firstName).toBe('John')
    })
  })

  describe('post<T, U> method', () => {
    it('should create a new item via POST', async () => {
      const createUserRequest: CreateUserRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }

      const createdUser: TestUser = {
        id: '1',
        ...createUserRequest
      }

      mock.onPost('/users', createUserRequest).reply(201, {
        success: true,
        message: 'User created successfully',
        data: createdUser
      })

      const response = await apiClient.post<TestUser, CreateUserRequest>('/users', createUserRequest)

      expect(response.success).toBe(true)
      expect(response.data?.id).toBe('1')
      expect(response.data?.firstName).toBe('John')
    })

    it('should handle POST requests without body', async () => {
      mock.onPost('/users/1/verify').reply(200, {
        success: true,
        message: 'User verified successfully',
        data: { verified: true }
      })

      const response = await apiClient.post('/users/1/verify')

      expect(response.success).toBe(true)
      expect(response.data?.verified).toBe(true)
    })
  })

  describe('put<T, U> method', () => {
    it('should update an item via PUT', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith'
      }

      const updatedUser: TestUser = {
        id: '1',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com'
      }

      mock.onPut('/users/1', updateData).reply(200, {
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      })

      const response = await apiClient.put<TestUser>('/users/1', updateData)

      expect(response.success).toBe(true)
      expect(response.data?.firstName).toBe('Jane')
    })
  })

  describe('patch<T, U> method', () => {
    it('should partially update an item via PATCH', async () => {
      const patchData = {
        firstName: 'Jane'
      }

      const updatedUser: TestUser = {
        id: '1',
        firstName: 'Jane',
        lastName: 'Doe', // Unchanged
        email: 'john@example.com' // Unchanged
      }

      mock.onPatch('/users/1', patchData).reply(200, {
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      })

      const response = await apiClient.patch<TestUser>('/users/1', patchData)

      expect(response.success).toBe(true)
      expect(response.data?.firstName).toBe('Jane')
      expect(response.data?.lastName).toBe('Doe') // Should remain unchanged
    })
  })

  describe('delete<T> method', () => {
    it('should delete an item via DELETE', async () => {
      mock.onDelete('/users/1').reply(200, {
        success: true,
        message: 'User deleted successfully',
        data: { deleted: true }
      })

      const response = await apiClient.delete('/users/1')

      expect(response.success).toBe(true)
      expect(response.data?.deleted).toBe(true)
    })
  })

  describe('request<T, U> method', () => {
    it('should handle GET requests', async () => {
      mock.onGet('/test').reply(200, {
        success: true,
        data: { test: true }
      })

      const response = await apiClient.request('GET', '/test')

      expect(response.success).toBe(true)
      expect(response.data?.test).toBe(true)
    })

    it('should handle POST requests with data', async () => {
      const testData = { test: 'data' }
      
      mock.onPost('/test', testData).reply(200, {
        success: true,
        data: { created: true }
      })

      const response = await apiClient.request('POST', '/test', testData)

      expect(response.success).toBe(true)
      expect(response.data?.created).toBe(true)
    })

    it('should throw error for unsupported HTTP method', async () => {
      await expect(
        apiClient.request('INVALID' as any, '/test')
      ).rejects.toThrow('Unsupported HTTP method: INVALID')
    })
  })

  describe('Authentication methods', () => {
    it('should set auth token', () => {
      const token = 'test-token'
      apiClient.setAuthToken(token)
      
      // This would need to verify that the token was set in httpClient
      // The actual verification would depend on httpClient implementation
      expect(apiClient.getHttpClient()).toBeDefined()
    })

    it('should clear auth token', () => {
      apiClient.clearAuthToken()
      
      // This would need to verify that the token was cleared from httpClient
      expect(apiClient.getHttpClient()).toBeDefined()
    })
  })

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      mock.onGet('/network-error').networkError()

      const response = await apiClient.getOne('/network-error')

      expect(response.success).toBe(false)
      expect(response.error?.isNetworkError).toBe(true)
    })

    it('should handle server errors', async () => {
      mock.onGet('/server-error').reply(500, {
        message: 'Internal server error'
      })

      const response = await apiClient.getOne('/server-error')

      expect(response.success).toBe(false)
      expect(response.error?.status).toBe(500)
    })
  })

  describe('Convenience exports', () => {
    it('should export getList function', async () => {
      mock.onGet('/users').reply(200, {
        success: true,
        data: { data: [], meta: {} }
      })

      const response = await getList<TestUser>('/users')
      expect(response.success).toBe(true)
    })

    it('should export getOne function', async () => {
      const mockUser = { id: '1', name: 'John' }
      
      mock.onGet('/users/1').reply(200, {
        success: true,
        data: mockUser
      })

      const response = await getOne('/users/1')
      expect(response.success).toBe(true)
      expect(response.data?.id).toBe('1')
    })

    it('should export post function', async () => {
      const postData = { name: 'John' }
      
      mock.onPost('/users', postData).reply(201, {
        success: true,
        data: { id: '1', ...postData }
      })

      const response = await post('/users', postData)
      expect(response.success).toBe(true)
    })

    it('should export put function', async () => {
      const updateData = { name: 'Jane' }
      
      mock.onPut('/users/1', updateData).reply(200, {
        success: true,
        data: { id: '1', ...updateData }
      })

      const response = await put('/users/1', updateData)
      expect(response.success).toBe(true)
    })

    it('should export patch function', async () => {
      const patchData = { name: 'Jane' }
      
      mock.onPatch('/users/1', patchData).reply(200, {
        success: true,
        data: { id: '1', ...patchData }
      })

      const response = await patch('/users/1', patchData)
      expect(response.success).toBe(true)
    })

    it('should export delete function', async () => {
      mock.onDelete('/users/1').reply(200, {
        success: true,
        data: { deleted: true }
      })

      const response = await del('/users/1')
      expect(response.success).toBe(true)
    })
  })

  describe('Singleton behavior', () => {
    it('should maintain state across calls', () => {
      const token = 'test-token'
      apiClient.setAuthToken(token)
      
      // Create another reference - should be the same instance
      const anotherRef = apiClient
      
      expect(anotherRef.getHttpClient()).toBe(apiClient.getHttpClient())
    })
  })
})
