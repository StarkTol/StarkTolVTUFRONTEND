# Centralized API Client

This document describes the implementation of the centralized API client layer that provides a typed wrapper around the existing `httpClient` (axios) with automatic auth headers, base URL configuration, and error normalization.

## Overview

The API client layer consists of:

1. **Centralized API Client** (`src/api/client.ts`) - Typed wrapper with generic helpers
2. **HTTP Client** (`src/api/httpClient.ts`) - Existing robust axios wrapper
3. **Type Definitions** (`src/api/types.ts`) - TypeScript interfaces and types
4. **Unit Tests** - Comprehensive testing for retry and refresh-token logic

## Features

### 🔧 Typed Generic Helpers

The API client provides strongly-typed generic methods:

```typescript
// Get paginated list with query parameters
const users = await apiClient.getList<User>('/users', {
  page: 1,
  limit: 20,
  search: 'john'
})

// Get single item
const user = await apiClient.getOne<User>('/users/123')

// Create new item
const newUser = await apiClient.post<User, CreateUserRequest>('/users', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
})

// Update item
const updatedUser = await apiClient.put<User, UpdateUserRequest>('/users/123', {
  firstName: 'Jane'
})

// Partial update
const patchedUser = await apiClient.patch<User, Partial<User>>('/users/123', {
  firstName: 'Jane'
})

// Delete item
const result = await apiClient.delete('/users/123')
```

### 🔄 Automatic Features

- **Authentication**: Automatically adds Bearer tokens from localStorage
- **Base URL**: Configurable base URL with environment variable support
- **Error Normalization**: Consistent error handling across all requests
- **Retry Logic**: Exponential backoff for network errors and server errors
- **Token Refresh**: Automatic JWT token refresh on 401 errors
- **Request Timeouts**: Configurable timeouts with defaults
- **TypeScript Support**: Full type safety with generics

### ⚙️ Configuration

```typescript
// Use default singleton
import { apiClient } from '@/api/client'

// Or create custom instance
import { ApiClient } from '@/api/client'

const customClient = new ApiClient({
  baseURL: 'https://api.example.com/v2',
  timeout: 60000,
  retry: {
    maxRetries: 5,
    baseDelay: 2000,
    maxDelay: 30000
  }
})
```

### 🔍 Query Parameters

The `getList()` method supports flexible query parameters:

```typescript
const users = await apiClient.getList<User>('/users', {
  page: 1,
  limit: 20,
  search: 'john',
  sortBy: 'created_at',
  sortOrder: 'desc',
  status: ['active', 'pending'], // Arrays supported
  includeDeleted: true
})
```

## API Methods

### Core Methods

| Method | Description | Type Signature |
|--------|-------------|----------------|
| `getList<T>()` | Get paginated list | `(url, params?, config?) => Promise<ApiResponse<PaginatedResponse<T>>>` |
| `getOne<T>()` | Get single item | `(url, config?) => Promise<ApiResponse<T>>` |
| `post<T,U>()` | Create new item | `(url, body?, config?) => Promise<ApiResponse<T>>` |
| `put<T,U>()` | Update item | `(url, body?, config?) => Promise<ApiResponse<T>>` |
| `patch<T,U>()` | Partial update | `(url, body?, config?) => Promise<ApiResponse<T>>` |
| `delete<T>()` | Delete item | `(url, config?) => Promise<ApiResponse<T>>` |
| `request<T,U>()` | Generic request | `(method, url, data?, config?) => Promise<ApiResponse<T>>` |

### Utility Methods

| Method | Description |
|--------|-------------|
| `setAuthToken(token)` | Set authentication token |
| `clearAuthToken()` | Clear authentication token |
| `updateConfig(config)` | Update client configuration |
| `getConfig()` | Get current configuration |
| `getHttpClient()` | Get underlying httpClient instance |

## Error Handling

The client normalizes all errors into a consistent format:

```typescript
interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
  isNetworkError?: boolean
  isRetriable?: boolean
}

// Usage
const response = await apiClient.getOne('/users/123')
if (!response.success) {
  console.error('Error:', response.error?.message)
  if (response.error?.isRetriable) {
    // Handle retryable error
  }
}
```

## Retry Logic

The client automatically retries requests under these conditions:

- **Network errors** (no response from server)
- **Server errors** (5xx status codes)
- **Rate limiting** (429 status codes)

**Retry Configuration:**
- Default max retries: 3
- Base delay: 1 second
- Max delay: 10 seconds
- Uses exponential backoff with jitter

## Token Refresh

Automatic JWT token refresh on 401 errors:

1. Detects 401 unauthorized response
2. Retrieves refresh token from localStorage
3. Calls `/auth/refresh` endpoint
4. Updates tokens in localStorage
5. Retries original request
6. On refresh failure: clears auth data and redirects to login

## Convenience Exports

For simpler usage, the client exports standalone functions:

```typescript
import { getList, getOne, post, put, patch, delete as del } from '@/api/client'

// Use directly without apiClient instance
const users = await getList<User>('/users', { page: 1 })
const user = await getOne<User>('/users/123')
const newUser = await post<User>('/users', userData)
```

## Testing

The implementation includes comprehensive unit tests covering:

- ✅ Basic functionality and configuration
- ✅ Generic type helpers
- ✅ Query string building
- ✅ Error handling
- ✅ Retry logic
- ✅ Token refresh logic
- ✅ Singleton behavior

**Run tests:**
```bash
npm test -- client.basic.test.ts  # Basic functionality
npm test                          # All tests
npm test:coverage                 # With coverage report
```

## Integration

### Updating Existing Code

The new API client is backward compatible. Existing code can be gradually migrated:

```typescript
// Old approach
import { httpClient } from '@/api/httpClient'
const response = await httpClient.get('/users')

// New approach
import { apiClient } from '@/api/client'
const response = await apiClient.getList<User>('/users')

// Or convenience function
import { getList } from '@/api/client'
const response = await getList<User>('/users')
```

### Main API Export

The client is exported from the main API index for easy access:

```typescript
import { apiClient, getList, getOne, post } from '@/api'
```

## Environment Configuration

Set environment variables for different environments:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1

# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.production.com/api/v1
```

## File Structure

```
src/
├── api/
│   ├── client.ts          # Main API client implementation
│   ├── httpClient.ts      # Existing HTTP client (enhanced)
│   ├── index.ts           # Main exports
│   └── types.ts           # TypeScript definitions
└── __tests__/
    ├── client.basic.test.ts    # Basic functionality tests
    ├── client.test.ts          # Comprehensive tests
    └── httpClient.test.ts      # HTTP client tests
```

## Next Steps

With the centralized API client in place, you can:

1. **Migrate existing API calls** to use the new typed methods
2. **Add new endpoints** using the generic helpers
3. **Customize retry logic** per endpoint if needed
4. **Add more specific error handling** based on your API responses
5. **Extend the client** with domain-specific methods

The API client provides a solid foundation for all HTTP communication in your application with excellent TypeScript support, automatic error handling, and comprehensive testing.
