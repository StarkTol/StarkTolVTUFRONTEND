# Authentication Fixes - Punch List

## 🚨 CRITICAL FIXES (BREAKS AUTHENTICATION)

### Fix #1: Token Storage Key Mismatch
**File**: `lib/api.ts`  
**Issue**: Primary API client reads different keys than AuthContext stores  
**Impact**: Authentication fails completely - users cannot access protected routes

```typescript
// Line 38 - Change from:
let token = localStorage.getItem('accessToken')
// To:
let token = localStorage.getItem('access_token')

// Line 98 - Change from:
const refreshToken = localStorage.getItem('refreshToken')
// To:
const refreshToken = localStorage.getItem('refresh_token')
```

### Fix #2: Development Auth Key Consistency
**File**: `lib/dev-auth.ts`  
**Issue**: Dev auth uses camelCase but production expects snake_case  
**Impact**: Development authentication won't work with production API clients

```typescript
// Lines 30, 36, 37, 50, 58, 59 - Change all instances:
// From: 'accessToken' → To: 'access_token'
// From: 'refreshToken' → To: 'refresh_token'

// Example changes:
localStorage.setItem('access_token', DEV_TOKENS.accessToken)
localStorage.setItem('refresh_token', DEV_TOKENS.refreshToken)
const token = localStorage.getItem('access_token')
```

## 🔶 HIGH PRIORITY FIXES (IMPROVE RELIABILITY)

### Fix #3: Base URL Configuration Conflict
**Files**: `.env.local`, all API clients  
**Issue**: Two different environment variables for same purpose  
**Impact**: API calls may go to wrong endpoints

**Option A** (Recommended): Standardize on `NEXT_PUBLIC_API_BASE`
```bash
# In .env.local - remove NEXT_PUBLIC_BASE_URL, keep only:
NEXT_PUBLIC_API_BASE=https://backend-066c.onrender.com/api/v1
```

**Option B**: Standardize on `NEXT_PUBLIC_BASE_URL`
```bash
# In .env.local - remove NEXT_PUBLIC_API_BASE, rename to:
NEXT_PUBLIC_BASE_URL=https://backend-066c.onrender.com/api/v1
```

Then update all API clients to use the same variable consistently.

### Fix #4: API Client Header Standardization
**Files**: `lib/api.ts`, `src/api/httpClient.ts`  
**Issue**: Different header naming patterns  
**Impact**: Inconsistent request formatting

```typescript
// Ensure all clients use:
config.headers['Authorization'] = `Bearer ${token}`
config.headers['X-User-ID'] = userData.id
```

## 🔵 MEDIUM PRIORITY FIXES (QUALITY OF LIFE)

### Fix #5: User ID Field Mapping
**File**: `context/UserDataContext.tsx`  
**Issue**: Multiple possible user ID field names cause validation issues  
**Impact**: User validation may fail

```typescript
// Create utility function:
const getUserId = (userObj: any): string => {
  return userObj?.id || userObj?.user_id || userObj?.userId
}
```

### Fix #6: Missing Token Validation
**Files**: All API clients  
**Issue**: No validation that tokens exist before protected API calls

```typescript
// Add before protected API calls:
if (!token && isProtectedRoute(config.url)) {
  throw new Error('Authentication token required')
}
```

## 📋 VERIFICATION CHECKLIST

After implementing fixes, test in this order:

### Development Testing
- [ ] Clear localStorage/sessionStorage completely
- [ ] Register new user → Should redirect to login
- [ ] Login with credentials → Should store correct token keys
- [ ] Check localStorage keys: `access_token`, `refresh_token`, `user`
- [ ] Dashboard should load with user data
- [ ] Refresh page → Should stay authenticated
- [ ] Logout → Should clear all storage and redirect to login

### Production Testing  
- [ ] Deploy fixes to staging environment
- [ ] Test full registration → login → dashboard flow
- [ ] Verify API calls go to correct backend
- [ ] Test token refresh on expiration
- [ ] Verify CORS allows frontend domain

## 🎯 SUCCESS CRITERIA

Authentication audit complete when:

1. ✅ Users can register and login successfully
2. ✅ Tokens are stored and retrieved with consistent keys  
3. ✅ Dashboard loads user and wallet data
4. ✅ Authentication persists across page refreshes
5. ✅ Token refresh works automatically
6. ✅ Development auth works when backend unavailable
7. ✅ All API clients use the same base URL configuration
8. ✅ No console errors related to authentication

## 🚀 Implementation Order

1. **Fix #1** - Token key mismatch (CRITICAL)
2. **Fix #2** - Dev auth consistency (CRITICAL)  
3. **Test** - Verify authentication works end-to-end
4. **Fix #3** - Base URL standardization (HIGH)
5. **Fix #4** - Header standardization (HIGH)
6. **Test** - Verify all API endpoints accessible
7. **Fixes #5-6** - Quality of life improvements (MEDIUM)
8. **Final Testing** - Complete verification checklist

---

**Estimated Time**: 2-3 hours for critical fixes, 1-2 hours for testing  
**Risk Level**: High (authentication system currently broken)  
**Dependencies**: None - can be implemented immediately

**Team Reference**: See `AUTHENTICATION_AUDIT_REPORT.md` for complete technical details and `AUTHENTICATION_ARCHITECTURE_DIAGRAM.md` for visual flow diagrams.
