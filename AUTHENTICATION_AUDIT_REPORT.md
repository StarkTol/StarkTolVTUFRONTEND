# Authentication & Data Flow Audit Report
**Project**: StarkTol VTU Platform Frontend  
**Date**: January 2025  
**Scope**: Register → Login → Dashboard Flow Analysis  

## Executive Summary

This audit traces the complete authentication flow from user registration through login to dashboard access, identifying all storage keys, API calls, context updates, redirects, and data fetches. Multiple inconsistencies have been identified that could lead to authentication failures and data access issues.

## 1. Authentication Flow Sequence

### 1.1 Registration Flow (`/register`)

**File**: `app/(auth)/register/page.tsx`

#### API Call
```typescript
POST /auth/register
```

#### Payload Structure
```typescript
{
  full_name: string,
  email: string (toLowerCase()),
  phone: string,
  password: string
}
```

#### Storage Operations
- **No direct storage** - redirects to login on success
- **Session Storage**: Potential `redirectUrl` storage (inherited from AuthGuard)

#### Validation & Processing
- Client-side validation for all fields
- Nigerian phone number format validation: `/^(\+234|0)[789][01]\d{8}$/`
- Email format validation
- Password length >= 6 characters
- Terms acceptance requirement

#### Success Flow
```
Registration Success → router.push("/login")
```

#### Error Handling
- Network errors with detailed logging
- Server response error extraction
- HTTP status code specific messaging

---

### 1.2 Login Flow (`/login`)

**File**: `app/(auth)/login/page.tsx`

#### API Call
```typescript
POST /auth/login
```

#### Payload Structure
```typescript
{
  email: string,
  password: string
}
```

#### Response Structure Expected
```typescript
{
  success: boolean,
  data: {
    user: User,
    accessToken: string,
    refreshToken: string
  }
}
```

#### Storage Operations (AuthContext)
**File**: `context/authContext.tsx`

```typescript
// INCONSISTENCY ALERT: Mixed naming conventions
localStorage.setItem("user", JSON.stringify(user))
localStorage.setItem("access_token", accessToken)      // ❌ Snake case
localStorage.setItem("refresh_token", refreshToken)    // ❌ Snake case
```

#### Context Updates
1. `setUser(user)` - Update user state
2. `setAccessToken(accessToken)` - Update token state  
3. `setRefreshToken(refreshToken)` - Update refresh token state

#### Redirect Logic
```typescript
// Check for stored redirect URL
const redirectUrl = sessionStorage.getItem('redirectUrl')
const destination = redirectUrl && redirectUrl !== '/login' ? redirectUrl : '/dashboard'
sessionStorage.removeItem('redirectUrl')
router.replace(destination)
```

---

### 1.3 Authentication Context Loading

**File**: `context/authContext.tsx`

#### Initialization Storage Reads
```typescript
const storedUser = localStorage.getItem("user")
const storedAccessToken = localStorage.getItem("access_token")      // ❌ Snake case
const storedRefreshToken = localStorage.getItem("refresh_token")    // ❌ Snake case
```

#### State Hydration
- Parse stored user JSON
- Set access/refresh tokens
- Mark loading as complete with setTimeout(0)

---

### 1.4 Dashboard Route Protection

**File**: `app/(dashboard)/layout.tsx`

#### Protection Mechanism
```typescript
<AuthGuard>
  <WalletDataProvider>
    <WalletProvider>
      {/* Dashboard content */}
    </WalletProvider>
  </WalletDataProvider>
</AuthGuard>
```

#### AuthGuard Implementation
**File**: `components/auth/AuthGuard.tsx`

```typescript
// Redirect logic
if (!loading && !isAuthenticated) {
  sessionStorage.setItem('redirectUrl', pathname)
  router.replace("/login")
}
```

---

### 1.5 Dashboard Data Loading

**File**: `app/(dashboard)/dashboard/page.tsx`

#### Context Dependencies
- `useUserData()` - Profile and transaction data
- `useWalletData()` - Wallet balance and recent transactions

#### Data Fetching Sequence
1. **User Profile**: `GET /user/profile`
2. **Transactions**: `GET /transactions?limit=5`
3. **Usage Stats**: `GET /stats/usage`
4. **Wallet Balance**: `GET /wallet/balance`
5. **Wallet Transactions**: `GET /wallet/transactions?limit=10`
6. **Dashboard Stats**: `GET /dashboard/stats` (fallback to computed)

---

## 2. API Client Configuration Analysis

### 2.1 Multiple API Client Instances

#### Primary API Client (`lib/api.ts`)
```typescript
baseURL: process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'
```

#### Secondary HTTP Client (`src/api/httpClient.ts`)  
```typescript
baseURL: baseURL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
```

#### Third API Client (`src/api/client.ts`)
```typescript
baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
```

### 2.2 Token Handling Inconsistencies

#### Primary API Client Token Resolution
```typescript
// ❌ INCONSISTENCY: Uses 'accessToken' (camelCase)
let token = localStorage.getItem('accessToken')
```

#### HTTP Client Token Resolution  
```typescript
// ❌ INCONSISTENCY: Uses 'access_token' (snake_case)
const token = localStorage.getItem('access_token')
```

#### Authentication Context Storage
```typescript
// ❌ INCONSISTENCY: Stores as 'access_token' but primary client reads 'accessToken'
localStorage.setItem("access_token", accessToken)
localStorage.setItem("refresh_token", refreshToken)
```

---

## 3. Environment Variables Audit

### 3.1 Current Configuration (`.env.local`)

```bash
# ❌ INCONSISTENCY: Two different API base URL variables
NEXT_PUBLIC_API_BASE=http://localhost:8000
NEXT_PUBLIC_BASE_URL=https://backend-066c.onrender.com/api/v1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wgvowaefweylltjmbxfk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Flutterwave Configuration  
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-9ea7b1f9c84cea2fc17bd763dd34ec87-X
FLUTTERWAVE_SECRET_KEY=FLWSECK-5fbd2c7d54c12401a7e24e3cdb6ecaaa-1982f4576e4vt-X
FLUTTERWAVE_WEBHOOK_HASH=https://backend-066c.onrender.com

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2 Variable Usage Conflicts

| Variable | Used In | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_BASE` | Primary API, HTTP Client, API Client | Main API base URL |
| `NEXT_PUBLIC_BASE_URL` | Primary API fallback | Alternative API base URL |

**❌ Problem**: Two environment variables for the same purpose with different values, creating potential routing conflicts.

---

## 4. Critical Inconsistencies Identified

### 4.1 🚨 HIGH PRIORITY: Token Storage Key Mismatch

| Component | Storage Key | Read Key | Status |
|-----------|-------------|----------|---------|
| AuthContext | `access_token` | `access_token` | ✅ Consistent |
| Primary API Client | - | `accessToken` | ❌ **BROKEN** |
| HTTP Client | - | `access_token` | ✅ Consistent |
| Dev Auth | `accessToken` | `accessToken` | ❌ **INCONSISTENT** |

**Impact**: Primary API client cannot read tokens stored by AuthContext, causing authentication failures.

**Fix Required**: 
```typescript
// In lib/api.ts, line 38
let token = localStorage.getItem('access_token') // Fix: change from 'accessToken'
```

### 4.2 🚨 HIGH PRIORITY: Refresh Token Inconsistency

| Component | Storage Key | Read Key | Status |
|-----------|-------------|----------|---------|
| AuthContext | `refresh_token` | `refresh_token` | ✅ Consistent |  
| Primary API Client | - | `refreshToken` | ❌ **BROKEN** |
| HTTP Client | - | `refresh_token` | ✅ Consistent |

**Impact**: Token refresh will fail in primary API client.

**Fix Required**:
```typescript  
// In lib/api.ts, line 98
const refreshToken = localStorage.getItem('refresh_token') // Fix: change from 'refreshToken'
```

### 4.3 🔶 MEDIUM PRIORITY: Base URL Configuration

**Problem**: Conflicting base URL environment variables
- `NEXT_PUBLIC_API_BASE=http://localhost:8000` (development)
- `NEXT_PUBLIC_BASE_URL=https://backend-066c.onrender.com/api/v1` (production)

**Impact**: API clients may connect to wrong endpoints depending on fallback logic.

**Fix Required**: Standardize on one variable name and update all clients.

### 4.4 🔶 MEDIUM PRIORITY: Development Auth Conflicts

**Problem**: Dev auth uses different key naming convention
```typescript
// Dev auth stores as 'accessToken' but production expects 'access_token'
localStorage.setItem('accessToken', DEV_TOKENS.accessToken)
```

**Impact**: Development mode authentication may not work with production API clients.

### 4.5 🔶 MEDIUM PRIORITY: User ID Field Mapping

**Problem**: Multiple possible user ID field names
```typescript
// In UserDataContext.tsx, lines 100-102
const profileUserId = profileData?.id || profileData?.user_id || profileData?.userId
const authUserId = user.id || user.user_id || user.userId
```

**Impact**: User validation may fail due to field name mismatches between auth and profile APIs.

---

## 5. Data Flow Architecture Diagram

```mermaid
graph TD
    A[User Registration] --> B[POST /auth/register]
    B --> C[Success: Redirect to Login]
    C --> D[User Login Form]
    
    D --> E[POST /auth/login]
    E --> F[Response: user, accessToken, refreshToken]
    F --> G[AuthContext.login()]
    
    G --> H[localStorage Storage]
    H --> I[user: JSON string]
    H --> J[access_token: string]
    H --> K[refresh_token: string]
    
    G --> L[Context State Update]
    L --> M[setUser, setAccessToken, setRefreshToken]
    
    M --> N[Redirect Check]
    N --> O[sessionStorage.getItem('redirectUrl')]
    O --> P[router.replace destination]
    
    P --> Q[Dashboard Layout]
    Q --> R[AuthGuard Check]
    R --> S{isAuthenticated?}
    
    S -->|No| T[Store redirectUrl, go to /login]
    S -->|Yes| U[Load Dashboard]
    
    U --> V[UserDataProvider]
    V --> W[GET /user/profile]
    V --> X[GET /transactions]
    V --> Y[GET /stats/usage]
    
    U --> Z[WalletDataProvider]  
    Z --> AA[GET /wallet/balance]
    Z --> BB[GET /wallet/transactions]
    
    W --> CC[Dashboard Render]
    X --> CC
    Y --> CC  
    AA --> CC
    BB --> CC
    
    style A fill:#e1f5fe
    style F fill:#c8e6c9
    style H fill:#fff3e0
    style CC fill:#f3e5f5
    style S fill:#ffebee
```

---

## 6. Recommended Fixes - Punch List

### 6.1 🚨 CRITICAL FIXES (Break Authentication)

1. **Fix Token Key Mismatch in Primary API Client**
   ```typescript
   // File: lib/api.ts
   // Line 38: Change 'accessToken' to 'access_token'
   let token = localStorage.getItem('access_token')
   
   // Line 98: Change 'refreshToken' to 'refresh_token'  
   const refreshToken = localStorage.getItem('refresh_token')
   ```

2. **Fix Development Auth Key Consistency**
   ```typescript
   // File: lib/dev-auth.ts
   // Lines 30, 36, 37, 50, 58, 59: Change all 'accessToken'/'refreshToken' to snake_case
   localStorage.setItem('access_token', DEV_TOKENS.accessToken)
   localStorage.setItem('refresh_token', DEV_TOKENS.refreshToken)
   ```

### 6.2 🔶 HIGH PRIORITY FIXES (Improve Reliability)

3. **Standardize Base URL Configuration**
   ```bash
   # Rename in .env.local
   NEXT_PUBLIC_API_BASE_URL=https://backend-066c.onrender.com/api/v1  # Production
   NEXT_PUBLIC_API_BASE_URL_DEV=http://localhost:8000                 # Development
   
   # Update all API clients to use consistent variable
   ```

4. **Fix API Client Header Inconsistencies**
   ```typescript
   // Ensure all API clients use same header format
   config.headers['Authorization'] = `Bearer ${token}`
   config.headers['X-User-ID'] = userData.id
   ```

### 6.3 🔵 MEDIUM PRIORITY FIXES (Quality of Life)

5. **Standardize User ID Field Access**
   ```typescript
   // Create utility function for consistent user ID access
   const getUserId = (userObj: any): string => {
     return userObj?.id || userObj?.user_id || userObj?.userId
   }
   ```

6. **Add API Client Validation**
   ```typescript
   // Add runtime checks for token availability before API calls
   if (!token && isProtectedRoute(config.url)) {
     throw new Error('Authentication token required')
   }
   ```

7. **Enhance Error Handling**
   ```typescript
   // Add more specific error types for different failure modes
   class AuthenticationError extends Error {
     constructor(message: string, public statusCode?: number) {
       super(message)
       this.name = 'AuthenticationError'
     }
   }
   ```

### 6.4 🔵 LOW PRIORITY IMPROVEMENTS (Future Enhancements)

8. **Add Token Expiration Handling**
   ```typescript
   // Store token expiration time and check before requests
   const tokenExpiry = localStorage.getItem('token_expiry')
   if (Date.now() > parseInt(tokenExpiry)) {
     // Trigger refresh
   }
   ```

9. **Implement Request Retry Logic**
   ```typescript
   // Add exponential backoff for failed requests
   const retryConfig = {
     maxRetries: 3,
     baseDelay: 1000,
     maxDelay: 10000
   }
   ```

10. **Add Request/Response Logging**
    ```typescript
    // Enhanced logging for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 [API] ${method} ${url}`, { payload, headers })
    }
    ```

---

## 7. Testing Recommendations

### 7.1 Manual Testing Sequence

1. **Registration Flow**
   - Clear all localStorage/sessionStorage
   - Navigate to `/register`
   - Complete registration form
   - Verify redirect to `/login`

2. **Login Flow** 
   - Complete login form
   - Check localStorage for correct token keys
   - Verify redirect to dashboard or stored URL

3. **Authentication Persistence**
   - Refresh page on dashboard
   - Verify user remains authenticated
   - Check token refresh on expiration

4. **Logout Flow**
   - Trigger logout
   - Verify localStorage cleanup
   - Confirm redirect to login

### 7.2 API Integration Testing

1. **Token Flow Testing**
   ```bash
   # Test token refresh endpoint
   curl -X POST https://backend-066c.onrender.com/api/v1/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{"refresh_token": "your-refresh-token"}'
   ```

2. **Protected Route Testing**
   ```bash
   # Test authenticated endpoint
   curl -X GET https://backend-066c.onrender.com/api/v1/user/profile \
     -H "Authorization: Bearer your-access-token"
   ```

---

## 8. Environment Verification Checklist

### 8.1 Local Development Environment
- [ ] `NEXT_PUBLIC_API_BASE` points to local backend (`http://localhost:8000`)
- [ ] Backend server running and accessible
- [ ] Database connected and migrations applied
- [ ] Supabase connection configured

### 8.2 Vercel Deployment Environment  
- [ ] `NEXT_PUBLIC_BASE_URL` points to production backend
- [ ] All environment variables properly set in Vercel dashboard
- [ ] Flutterwave keys match dashboard configuration
- [ ] CORS configured for Vercel domain

### 8.3 Render Backend Environment
- [ ] Backend deployed and running
- [ ] Database accessible from Render
- [ ] Environment variables configured
- [ ] CORS allows frontend domains
- [ ] SSL/HTTPS properly configured

---

## 9. Security Considerations

### 9.1 Token Security
- ✅ Tokens stored in localStorage (acceptable for SPA)
- ✅ HTTPS enforced in production  
- ✅ Token refresh mechanism implemented
- ❌ **Missing**: Token expiration validation
- ❌ **Missing**: Automatic token cleanup on multiple failures

### 9.2 API Security
- ✅ Bearer token authentication
- ✅ Request timeout configuration
- ✅ CORS configuration
- ❌ **Missing**: Request rate limiting
- ❌ **Missing**: Request signature validation

---

## 10. Conclusion

The authentication flow is fundamentally sound but suffers from critical inconsistencies in token storage key naming that will cause authentication failures. The primary issues are:

1. **Token key mismatch** between AuthContext storage and API client retrieval
2. **Base URL configuration conflicts** between development and production
3. **Development authentication inconsistencies** with production patterns

Implementing the recommended fixes in the punch list will resolve these issues and create a robust, consistent authentication system. Priority should be given to the critical fixes to ensure basic authentication functionality works correctly.

The architecture supports the required flow (Register → Login → Dashboard) with proper context management, route protection, and data fetching. Once the inconsistencies are resolved, the system should function reliably across all deployment environments.
