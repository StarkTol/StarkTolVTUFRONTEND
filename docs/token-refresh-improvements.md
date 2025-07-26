# Token Refresh & 401 Retry Logic Improvements

## Overview

This document outlines the improvements made to the token refresh and 401 retry logic in the HttpClient.

## Key Improvements Made

### 1. Dedicated `refreshToken()` Helper

- **Before**: Refresh logic was embedded directly in the `handleAuthError` method
- **After**: Extracted into a dedicated `refreshToken()` method for better separation of concerns
- **Benefits**: Easier to test, maintain, and reason about

### 2. Infinite Loop Protection

- **Added**: `MAX_REFRESH_ATTEMPTS` constant (set to 3)
- **Added**: `refreshAttempts` counter to track consecutive failed attempts
- **Logic**: After 3 failed refresh attempts, subsequent requests will fail immediately
- **Reset**: Counter resets to 0 on successful refresh

### 3. Improved Request Queueing

- **Added**: `refreshPromise` to ensure only one refresh request is in flight
- **Improved**: Better promise handling for concurrent 401 errors
- **Benefits**: Multiple concurrent requests that receive 401 will share the same refresh operation

### 4. Enhanced Error Handling

- **Added**: Better validation of refresh response (checks for `access_token`)
- **Improved**: More specific error messages
- **Added**: Proper cleanup of auth data on refresh failure

### 5. Retry Flag Protection

- **Added**: `_retry` flag marking to prevent infinite retry loops
- **Logic**: Requests already marked as retry won't trigger additional refresh attempts

## Code Structure

```typescript
class HttpClient {
  private refreshPromise: Promise<string> | null = null
  private refreshAttempts: number = 0
  private readonly MAX_REFRESH_ATTEMPTS = 3

  // Main refresh method
  private async refreshToken(): Promise<string>
  
  // Separated token refresh implementation
  private async performTokenRefresh(): Promise<string>
  
  // Improved auth error handler
  private async handleAuthError(error, originalRequest): Promise<any>
}
```

## Test Coverage

Comprehensive Jest tests have been created covering:

### Successful Token Refresh (401→200 path)
- ✅ Basic token refresh and retry
- ✅ Concurrent request queueing
- ✅ Handling refresh without new refresh token

### Failed Token Refresh (401→401 logout path)
- ✅ Invalid refresh token handling
- ✅ Missing refresh token scenarios
- ✅ Queued request failure propagation

### Infinite Loop Protection
- ✅ Maximum attempts enforcement
- ✅ Attempts counter reset on success
- ✅ Skip refresh for flagged requests

### Error Handling
- ✅ Network errors during refresh
- ✅ Malformed refresh responses
- ✅ Server errors during refresh

### Queue Management
- ✅ Promise resolution for successful refresh
- ✅ Promise rejection for failed refresh

## Key Features

1. **Single Refresh Promise**: Only one refresh request at a time, with concurrent requests waiting for the same promise
2. **Attempt Limiting**: Maximum of 3 consecutive refresh attempts before giving up
3. **Proper Cleanup**: Auth data is cleared and user redirected to login on refresh failure
4. **Token Propagation**: New tokens are properly stored and propagated to waiting requests
5. **Error Resilience**: Handles various error scenarios gracefully

## Usage

The improvements are transparent to existing code. The HttpClient continues to work the same way:

```typescript
// Existing usage remains unchanged
const response = await httpClient.get('/protected-endpoint')

// If the token is expired, the client will:
// 1. Detect the 401 error
// 2. Attempt to refresh the token
// 3. Retry the original request
// 4. Return the successful response (or fail gracefully)
```

## Files Modified

- `src/api/httpClient.ts` - Main improvements
- `src/__tests__/httpClient.tokenRefresh.test.ts` - New comprehensive tests
- `src/__tests__/httpClient.test.ts` - Updated existing tests

## Benefits Achieved

1. **Reliability**: Better handling of edge cases and error scenarios
2. **Performance**: Reduced duplicate refresh requests through queueing
3. **Security**: Proper cleanup and logout on authentication failures
4. **Maintainability**: Cleaner, more testable code structure
5. **User Experience**: Seamless token refresh without multiple login prompts
