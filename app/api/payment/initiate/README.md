# Payment Initiate API Route

## Overview

This API route handles payment initiation by acting as a proxy between the frontend and the backend payment service. It validates the request, extracts authentication information, and forwards the request to the backend with proper error handling.

## Endpoint

**POST** `/api/payment/initiate`

## Authentication

The route requires authentication via:
- **Authorization header**: `Bearer {access_token}`
- **X-User-ID header**: Contains the user ID (automatically set by the frontend HTTP client)

## Request Body

```json
{
  "amount": number  // Required: Positive number, minimum value 1
}
```

### Validation Rules

- `amount`: Must be a positive number ≥ 1
- Decimal amounts are supported (e.g., 99.99)

## Response Format

### Success Response (200)

```json
{
  "paymentLink": "https://payment.example.com/pay/123",
  "txRef": "tx_ref_123456"
}
```

### Error Response (4xx/5xx)

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "status": 400
}
```

## Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Validation Error | Invalid request body (missing/invalid amount) |
| 401 | Authentication Error | Missing or invalid authentication credentials |
| 405 | Method Not Allowed | Only POST method is supported |
| 500 | Backend Error | Backend service error or network issues |
| 502 | Backend Error | Invalid response from backend service |

## Usage Examples

### Frontend Usage (with existing HTTP client)

```typescript
import { httpClient } from '@/src/api/httpClient';

async function initiatePayment(amount: number) {
  try {
    const response = await fetch('/api/payment/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-User-ID': userId,
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Payment initiation failed');
    }

    const data = await response.json();
    return data; // { paymentLink, txRef }
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
}
```

### Using the existing HTTP client

```typescript
import { httpClient } from '@/src/api/httpClient';

async function initiatePayment(amount: number) {
  const response = await httpClient.post('/api/payment/initiate', { amount });
  
  if (response.success) {
    return response.data; // { paymentLink, txRef }
  } else {
    throw new Error(response.message);
  }
}
```

## Backend Integration

The route forwards requests to:
- **URL**: `${NEXT_PUBLIC_API_BASE_URL}/payment/initiate`
- **Method**: POST
- **Headers**: 
  - `Authorization: Bearer {access_token}`
  - `Content-Type: application/json`
  - `X-User-ID: {userId}`
- **Body**: `{ amount: number, userId: string }`

### Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (defaults to `https://backend-066c.onrender.com/api/v1`)

## Testing

The route includes comprehensive unit tests covering:

- ✅ Request validation (amount validation)
- ✅ Authentication handling
- ✅ Backend integration and error handling
- ✅ Network error scenarios
- ✅ Environment configuration
- ✅ Edge cases (malformed JSON, decimal amounts)

### Running Tests

```bash
npm test -- __tests__/api/payment/initiate/route.test.ts
```

## Security Features

1. **Input Validation**: Uses Zod schema validation for request body
2. **Authentication**: Requires valid access token and user ID
3. **Error Handling**: Comprehensive error handling with proper HTTP status codes
4. **Request Forwarding**: Properly forwards authentication headers to backend
5. **Response Validation**: Validates backend response structure

## Error Handling Strategy

1. **Validation Errors**: Returns 400 with detailed validation messages
2. **Authentication Errors**: Returns 401 for missing/invalid credentials
3. **Backend Errors**: Proxies backend status codes and error messages
4. **Network Errors**: Returns 500 for network/timeout issues
5. **Invalid Backend Response**: Returns 502 for malformed backend responses

## Implementation Details

- Built with Next.js 15 App Router
- Uses TypeScript for type safety
- Implements proper HTTP status codes
- Includes request/response logging in development
- Follows RESTful API conventions
- Uses `satisfies` operator for type checking
