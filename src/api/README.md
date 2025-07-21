# Centralized API Client Layer

This directory contains a comprehensive, typed API client layer for the VTU platform. It provides a centralized, maintainable, and type-safe way to interact with the backend API.

## Features

- ✅ **TypeScript First**: Fully typed with interfaces that mirror backend DTOs
- ✅ **Automatic Authentication**: Token refresh and automatic retry on auth failures
- ✅ **Error Normalization**: Consistent error handling across all endpoints
- ✅ **Retry Logic**: Automatic retry with exponential backoff for failed requests
- ✅ **Request/Response Interceptors**: Centralized logging, timing, and debugging
- ✅ **Validation**: Client-side validation before API calls
- ✅ **Utility Functions**: Common helpers for formatting, validation, etc.

## Architecture

```
src/api/
├── httpClient.ts          # Core HTTP client with Axios
├── types.ts              # TypeScript interfaces and types
├── endpoints/            # API endpoint implementations
│   ├── base.ts          # Base classes and utilities
│   ├── auth.ts          # Authentication endpoints
│   ├── wallet.ts        # Wallet management
│   ├── airtime.ts       # Airtime services
│   └── [other services] # Data, Cable, Electricity, etc.
├── index.ts             # Main exports and API object
└── README.md            # This documentation
```

## Quick Start

### Basic Usage

```typescript
import { api } from '@/src/api'

// Authentication
const loginResponse = await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
})

// Wallet operations
const balance = await api.wallet.getBalance()
const transactions = await api.wallet.getTransactions({ page: 1, limit: 10 })

// Service purchases
const airtimeResponse = await api.services.airtime.purchase({
  providerId: 'mtn',
  phoneNumber: '08012345678',
  amount: 1000,
  pin: '1234'
})
```

### Using Individual Functions

```typescript
import { 
  login, 
  getWalletBalance, 
  purchaseAirtime,
  AirtimePurchaseRequest 
} from '@/src/api'

// Direct function calls
const authResult = await login({
  email: 'user@example.com',
  password: 'password'
})

const balance = await getWalletBalance()

const request: AirtimePurchaseRequest = {
  providerId: 'mtn',
  phoneNumber: '08012345678',
  amount: 1000
}
const result = await purchaseAirtime(request)
```

### Using API Classes

```typescript
import { authApi, walletApi, airtimeApi } from '@/src/api'

// Class-based approach
const user = await authApi.login({ email: '...', password: '...' })
const transactions = await walletApi.getTransactions({ limit: 20 })
const providers = await airtimeApi.getProviders()
```

## HTTP Client Features

### Automatic Token Refresh

The HTTP client automatically handles token refresh when a 401 error occurs:

```typescript
import { httpClient } from '@/src/api'

// This request will automatically retry with a new token if the current one is expired
const response = await httpClient.get('/protected-endpoint')
```

### Retry Logic

Failed requests are automatically retried with exponential backoff:

```typescript
// This will retry up to 3 times for network errors or 5xx responses
const response = await httpClient.post('/unstable-endpoint', data, {
  retry: {
    maxRetries: 5,
    baseDelay: 2000, // Start with 2 second delay
    maxDelay: 30000  // Max 30 second delay
  }
})
```

### Request Configuration

```typescript
import { httpClient } from '@/src/api'

// Custom timeout and retry settings
const response = await httpClient.get('/slow-endpoint', {
  timeout: 60000, // 1 minute timeout
  retry: {
    maxRetries: 5,
    retryCondition: (error) => error.response?.status >= 500
  }
})
```

## Type Safety

All API responses are fully typed:

```typescript
import { 
  AirtimeProvider, 
  WalletTransaction, 
  ApiResponse,
  getAirtimeProviders,
  getWalletTransactions
} from '@/src/api'

// Typed responses
const providersResponse: ApiResponse<AirtimeProvider[]> = await getAirtimeProviders()
if (providersResponse.success) {
  const providers: AirtimeProvider[] = providersResponse.data! // Type-safe access
  providers.forEach(provider => {
    console.log(provider.name) // TypeScript knows this exists
  })
}

// Paginated responses
const transactionsResponse = await getWalletTransactions({ page: 1, limit: 10 })
if (transactionsResponse.success) {
  const { data, meta } = transactionsResponse.data! // PaginatedResponse<WalletTransaction>
  console.log(`Page ${meta.page} of ${meta.totalPages}`)
  data.forEach(transaction => {
    console.log(transaction.amount) // Fully typed
  })
}
```

## Error Handling

### Consistent Error Structure

All errors are normalized to a consistent structure:

```typescript
import { api, getErrorMessage } from '@/src/api'

try {
  const result = await api.wallet.transfer({
    recipient: 'user@example.com',
    amount: 1000,
    pin: '1234'
  })
} catch (error) {
  const message = getErrorMessage(error)
  console.error('Transfer failed:', message)
  
  // Access error details
  if (error.status === 422) {
    console.log('Validation errors:', error.details)
  }
}
```

### Handling API Responses

```typescript
import { handleApiResponse } from '@/src/api'

// Using the response handler
try {
  const response = await api.wallet.getBalance()
  const balance = handleApiResponse(response) // Throws on error, returns data on success
  console.log('Balance:', balance.formattedBalance)
} catch (error) {
  console.error('Failed to get balance:', error.message)
}

// Manual response checking
const response = await api.wallet.getBalance()
if (response.success) {
  console.log('Balance:', response.data!.formattedBalance)
} else {
  console.error('Error:', response.message)
}
```

## Validation

### Client-side Validation

The API client includes validation for common scenarios:

```typescript
import { purchaseAirtime } from '@/src/api'

try {
  // This will throw an error before making the API call
  await purchaseAirtime({
    providerId: '', // Error: Missing required field
    phoneNumber: '123', // Error: Invalid phone format
    amount: -100 // Error: Amount must be greater than zero
  })
} catch (error) {
  console.error('Validation error:', error.message)
}
```

### Custom Validation

```typescript
import { validateRequired, isValidNigerianPhone, isValidEmail } from '@/src/api'

// Validate required fields
validateRequired({ email: '', name: 'John' }, ['email', 'name']) // Throws error

// Validate phone numbers
const isValid = isValidNigerianPhone('08012345678') // true
const isInvalid = isValidNigerianPhone('123') // false

// Validate email
const emailValid = isValidEmail('user@example.com') // true
```

## Utilities

### Formatting Helpers

```typescript
import { formatCurrency, formatPhoneNumber } from '@/src/api'

// Format currency
const formatted = formatCurrency(150000) // "₦150,000.00"
const usd = formatCurrency(100, 'USD') // "$100.00"

// Format phone numbers
const formatted = formatPhoneNumber('08012345678') // "+2348012345678"
const withCustomCode = formatPhoneNumber('1234567890', '+1') // "+11234567890"
```

### Authentication Helpers

```typescript
import { 
  isAuthenticated, 
  getCurrentUser, 
  clearAuthData 
} from '@/src/api'

// Check auth status
if (isAuthenticated()) {
  const user = getCurrentUser()
  console.log(`Welcome back, ${user.firstName}!`)
} else {
  // Redirect to login
  clearAuthData() // Clear any stale data
}
```

## Configuration

### Environment Variables

The API client respects these environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com/api/v1
NODE_ENV=development
```

### Runtime Configuration

```typescript
import { httpClient, API_CONFIG } from '@/src/api'

// Override base URL at runtime
httpClient.setBaseURL('https://staging-api.example.com')

// Access configuration
console.log('Max retries:', API_CONFIG.MAX_RETRIES)
console.log('Is development:', API_CONFIG.IS_DEVELOPMENT)
```

## Advanced Usage

### Custom HTTP Client Instance

```typescript
import { HttpClient } from '@/src/api'

// Create a custom instance for a different service
const analyticsClient = new HttpClient('https://analytics-api.example.com', {
  timeout: 60000,
  headers: {
    'X-Analytics-Key': 'your-key'
  }
})

// Use it
const data = await analyticsClient.get('/metrics')
```

### Extending Endpoints

```typescript
import { BaseEndpoint } from '@/src/api'

class CustomEndpoints extends BaseEndpoint {
  constructor() {
    super('/custom')
  }

  async getCustomData(): Promise<any> {
    return this.get('/data')
  }

  async createCustomItem(data: any): Promise<any> {
    return this.post('/items', data)
  }
}

const customApi = new CustomEndpoints()
```

## Migration from Legacy API

If you're migrating from the existing `lib/api` structure:

### Before

```typescript
import api from '@/lib/api'

const response = await api.get('/wallet/balance')
const data = response.data
```

### After

```typescript
import { getWalletBalance } from '@/src/api'

const response = await getWalletBalance()
if (response.success) {
  const data = response.data
}
```

## Best Practices

1. **Always handle errors**: Use try-catch or check `response.success`
2. **Use TypeScript types**: Import and use the provided types for better IDE support
3. **Validate inputs**: Use the validation helpers before making API calls
4. **Centralize configuration**: Use environment variables for different environments
5. **Handle loading states**: The API calls are async, show loading indicators
6. **Cache where appropriate**: Consider using React Query or SWR with these endpoints

## Troubleshooting

### Common Issues

1. **401 Errors**: Check if user is authenticated and tokens are valid
2. **Network Errors**: Check internet connection and API server status
3. **Type Errors**: Make sure to import the correct types
4. **Validation Errors**: Check the validation helpers and error messages

### Debugging

Enable development mode logging:

```typescript
// The HTTP client automatically logs requests in development mode
// Check browser console for detailed request/response information
```

## Contributing

When adding new endpoints:

1. Add types to `types.ts`
2. Create endpoint class in `endpoints/[service].ts`
3. Export functions from the endpoint file
4. Add to main `index.ts` exports
5. Update this README with examples
