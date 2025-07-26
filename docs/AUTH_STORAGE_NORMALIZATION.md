# Authentication Storage Normalization

This document describes the refactoring performed to normalize token & user storage across the application to use a single canonical key set.

## Overview

Previously, the application used inconsistent localStorage keys for authentication data across different components:

- **AuthContext**: `access_token`, `refresh_token`, `user` ✅
- **lib/api.ts**: `accessToken`, `refreshToken`, `user` ❌  
- **lib/dev-auth.ts**: `accessToken`, `refreshToken`, `user` ❌
- **utils/auth.ts**: `access_token`, `refresh_token`, `user` ✅

## Canonical Key Set

After refactoring, all components now use the following canonical keys:

```typescript
localStorage.setItem('access_token', token)
localStorage.setItem('refresh_token', token) 
localStorage.setItem('user', JSON.stringify(user))
```

## Changes Made

### 1. Migration Utility (`utils/authStorageMigation.ts`)

Created a comprehensive migration utility that:

- Defines canonical keys (`CANONICAL_KEYS`)
- Provides migration function (`migrateAuthStorageKeys()`)
- Includes getter/setter helpers that use canonical keys
- Handles legacy key migration automatically

### 2. Updated Components

#### AuthContext (`context/authContext.tsx`)
- Now imports and uses canonical storage helpers
- Runs migration on initialization to handle legacy keys
- Uses helper functions for all localStorage operations

#### API Client (`lib/api.ts`)
- Updated request/response interceptors to use canonical helpers
- Token refresh logic now uses canonical storage
- Helper functions updated to use canonical getters

#### Dev Auth (`lib/dev-auth.ts`)
- Updated to use canonical storage helpers
- Maintains development authentication functionality
- Uses canonical helpers for token checking

#### Utils Auth (`utils/auth.ts`)
- Marked as deprecated with clear migration path
- Updated to proxy calls to canonical helpers
- Maintains backward compatibility during transition

### 3. Migration Strategy

The migration is handled automatically when the application loads:

1. `migrateAuthStorageKeys()` runs in AuthContext initialization
2. Checks for legacy keys (`accessToken`, `refreshToken`)
3. Copies values to canonical keys (`access_token`, `refresh_token`)
4. Removes legacy keys to prevent confusion
5. Logs migration status for debugging

### 4. Unit Tests

Comprehensive test suite (`__tests__/authStorageMigration.test.ts`) covers:

- Migration functionality
- Getter/setter operations 
- Error handling (invalid JSON, missing data)
- Server-side rendering compatibility
- Edge cases and partial migrations

## Usage

### Recommended Approach

```typescript
import {
  getAccessToken,
  getRefreshToken, 
  getUser,
  setAccessToken,
  setRefreshToken,
  setUser,
  clearAuthData,
  isAuthenticated
} from '@/utils/authStorageMigation'

// Getting data
const token = getAccessToken()
const user = getUser()

// Setting data  
setAccessToken('new-token')
setUser({ id: '123', email: 'user@example.com' })

// Clearing all auth data
clearAuthData()

// Checking authentication status
if (isAuthenticated()) {
  // User is logged in
}
```

### Legacy Support

For existing code using `utils/auth.ts`, the functions continue to work but are deprecated:

```typescript
// This still works but is deprecated
import { getAccessToken } from '@/utils/auth'

// Preferred approach
import { getAccessToken } from '@/utils/authStorageMigation'
```

## Benefits

1. **Consistency**: Single source of truth for localStorage keys
2. **Maintainability**: Centralized storage logic
3. **Migration Path**: Automatic handling of legacy keys
4. **Type Safety**: TypeScript definitions for all helpers
5. **Testing**: Comprehensive test coverage
6. **Documentation**: Clear migration path and usage examples

## Future Considerations

- Consider migrating away from localStorage to more secure storage
- Implement token encryption for sensitive data
- Add storage quotas and cleanup mechanisms
- Consider using a state management library for auth state

## Files Modified

- `utils/authStorageMigation.ts` (new)
- `context/authContext.tsx` 
- `lib/api.ts`
- `lib/dev-auth.ts`
- `utils/auth.ts` (deprecated)
- `__tests__/authStorageMigration.test.ts` (new)
- `docs/AUTH_STORAGE_NORMALIZATION.md` (new)

## Testing

Run the test suite to verify functionality:

```bash
npm test __tests__/authStorageMigration.test.ts
```

All 20 tests should pass, covering migration scenarios and edge cases.
