# Authentication Architecture Visual Guide

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            STARKTOL VTU AUTHENTICATION SYSTEM                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐
│   REGISTRATION  │    │      LOGIN      │    │         DASHBOARD           │
│                 │    │                 │    │                             │
│ /register       │───▶│ /login          │───▶│ /dashboard/*                │
│                 │    │                 │    │                             │
│ • Form Valid.   │    │ • Credentials   │    │ • Route Protection          │
│ • POST /auth/   │    │ • POST /auth/   │    │ • Data Contexts             │
│   register      │    │   login         │    │ • API Calls                 │
│ • Redirect      │    │ • Token Storage │    │ • Real-time Updates         │
└─────────────────┘    └─────────────────┘    └─────────────────────────────┘
```

## Detailed Authentication Flow

```
USER REGISTRATION FLOW
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  [User Input] ──▶ [Client Validation] ──▶ [API Call] ──▶ [Success/Redirect]    │
│       │                    │                   │                    │          │
│   • Full Name         • Email Format     POST /auth/register   router.push()   │
│   • Email             • Phone Pattern    {                    "/login"         │
│   • Phone             • Password Len       full_name,                          │
│   • Password          • Terms Accept       email,                              │
│   • Accept Terms      • Form Complete      phone,                              │
│                                           password                             │
│                                         }                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

USER LOGIN FLOW  
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  [Credentials] ──▶ [API Call] ──▶ [Response] ──▶ [AuthContext] ──▶ [Storage]   │
│       │                │              │              │                │        │
│   • Email         POST /auth/login  {success,    login(user,     localStorage   │
│   • Password      {                  data: {      accessToken,   setItem()     │
│   • Remember        email,            user,        refreshToken)                │
│                     password          accessToken,                             │
│                   }                   refreshToken                             │
│                                      }}                                        │
│                                                                                 │
│  [Storage Keys] ──▶ [Context State] ──▶ [Redirect Logic] ──▶ [Dashboard]       │
│       │                    │                   │                    │          │
│   ❌ access_token      setUser()      sessionStorage      router.replace()     │
│   ❌ refresh_token     setAccessToken() .getItem()       destination           │  
│   ✅ user             setRefreshToken() 'redirectUrl'                          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

API CLIENT TOKEN RESOLUTION
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                         🚨 CRITICAL MISMATCH IDENTIFIED 🚨                     │
│                                                                                 │
│  AuthContext Stores:           Primary API Client Reads:                       │
│  ┌─────────────────────┐      ┌─────────────────────┐                         │
│  │ "access_token"      │  ❌  │ "accessToken"       │                         │  
│  │ "refresh_token"     │  ❌  │ "refreshToken"      │                         │
│  │ "user"              │  ✅  │ "user"              │                         │
│  └─────────────────────┘      └─────────────────────┘                         │
│                                                                                 │
│  HTTP Client Reads:            Dev Auth Stores:                                │
│  ┌─────────────────────┐      ┌─────────────────────┐                         │
│  │ "access_token"      │  ✅  │ "accessToken"       │  ❌ (Inconsistent)      │
│  │ "refresh_token"     │  ✅  │ "refreshToken"      │  ❌ (Inconsistent)      │
│  │ "user"              │  ✅  │ "user"              │  ✅                      │
│  └─────────────────────┘      └─────────────────────┘                         │
│                                                                                 │
│  RESULT: Primary API client cannot authenticate users!                         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Route Protection & Data Loading

```
DASHBOARD ACCESS CONTROL
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  [Route Access] ──▶ [AuthGuard] ──▶ [Authentication Check] ──▶ [Data Providers] │
│                                                                                 │
│  /dashboard/*    ┌─────────────────┐   ┌─────────────────┐   ┌───────────────┐ │
│  (Protected)     │ • Check loading │   │ isAuthenticated │   │ UserDataProvider│ │
│                  │ • Check user    │──▶│ = !!user &&     │──▶│ • /user/profile│ │
│                  │ • Store redirect│   │   !!accessToken │   │ • /transactions│ │
│                  │   URL if needed │   │                 │   │ • /stats/usage │ │
│                  └─────────────────┘   └─────────────────┘   └───────────────┘ │
│                           │                      │                    │        │
│                    [If Not Auth]          [If Authenticated]   [Wallet Data]    │
│                           │                      │                    │        │
│                  ┌─────────────────┐   ┌─────────────────┐   ┌───────────────┐ │
│                  │ sessionStorage  │   │ Render Dashboard│   │WalletDataProvider│ │
│                  │ .setItem(       │   │ with Contexts   │   │ • /wallet/bal. │ │
│                  │ 'redirectUrl')  │   │                 │   │ • /wallet/txns │ │
│                  │ router.replace  │   │                 │   │               │ │
│                  │ ("/login")      │   │                 │   │               │ │
│                  └─────────────────┘   └─────────────────┘   └───────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Environment & Configuration Issues

```
ENVIRONMENT VARIABLE CONFLICTS
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  .env.local Configuration:                                                      │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ NEXT_PUBLIC_API_BASE=http://localhost:8000                    (Development)│ │
│  │ NEXT_PUBLIC_BASE_URL=https://backend-066c.onrender.com/api/v1 (Production)│ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  API Client Base URL Resolution:                                                │
│  ┌─────────────────────────────────────────────────────────────┐               │
│  │ Primary API:  NEXT_PUBLIC_API_BASE || NEXT_PUBLIC_BASE_URL  │               │
│  │ HTTP Client:  NEXT_PUBLIC_API_BASE || fallback             │               │
│  │ API Client:   NEXT_PUBLIC_API_BASE || fallback             │               │
│  └─────────────────────────────────────────────────────────────┘               │
│                                                                                 │
│  ❌ PROBLEM: Different values may cause API calls to wrong endpoints           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

API REQUEST FLOW WITH AUTHENTICATION
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  [API Request] ──▶ [Token Injection] ──▶ [Request Sent] ──▶ [Response/Error]   │
│                                                                                 │
│  Component calls     Interceptor          HTTP Request        Success/401/Err  │
│  api.get('/path')    ┌─────────────────┐   ┌─────────────┐    ┌─────────────┐   │
│                      │ Get token from  │   │ Authorization│    │ Return data │   │
│                  ───▶│ localStorage    │──▶│ Bearer ${token}│──▶│ or handle   │   │
│                      │ Add headers     │   │ X-User-ID    │    │ error       │   │
│                      └─────────────────┘   └─────────────┘    └─────────────┘   │
│                                                   │                   │         │
│                                            [If 401 Error]    [Token Refresh]    │
│                                                   │                   │         │
│                                          ┌─────────────────┐ ┌───────────────┐  │
│                                          │ Check refresh   │ │ POST /auth/   │  │
│                                          │ token available │ │ refresh       │  │
│                                          │ Queue requests  │ │ Update tokens │  │
│                                          │ if refreshing   │ │ Retry request │  │
│                                          └─────────────────┘ └───────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Critical Fix Requirements

```
IMMEDIATE ACTION REQUIRED
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  🚨 PRIORITY 1: Fix Token Key Mismatches                                       │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ File: lib/api.ts                                                         │ │
│  │                                                                           │ │
│  │ Line 38:  let token = localStorage.getItem('accessToken')                │ │
│  │ Fix to:   let token = localStorage.getItem('access_token')               │ │
│  │                                                                           │ │
│  │ Line 98:  const refreshToken = localStorage.getItem('refreshToken')      │ │
│  │ Fix to:   const refreshToken = localStorage.getItem('refresh_token')     │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  🚨 PRIORITY 2: Fix Development Auth Keys                                       │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ File: lib/dev-auth.ts                                                    │ │
│  │                                                                           │ │
│  │ Change all 'accessToken' to 'access_token'                               │ │
│  │ Change all 'refreshToken' to 'refresh_token'                             │ │
│  │ Lines: 30, 36, 37, 50, 58, 59                                            │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  🔶 PRIORITY 3: Standardize Environment Variables                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ Choose ONE environment variable for API base URL:                        │ │
│  │                                                                           │ │
│  │ Option A: Use NEXT_PUBLIC_API_BASE for all environments                  │ │
│  │ Option B: Use NEXT_PUBLIC_BASE_URL for all environments                  │ │
│  │                                                                           │ │
│  │ Update all 3 API clients to use the same variable                        │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

TESTING VERIFICATION CHECKLIST
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  After implementing fixes, verify:                                             │
│                                                                                 │
│  ✅ 1. User can register successfully                                           │
│  ✅ 2. Registration redirects to login                                          │
│  ✅ 3. User can login with correct credentials                                  │
│  ✅ 4. Login stores tokens with correct keys                                    │
│  ✅ 5. Login redirects to dashboard                                             │
│  ✅ 6. Dashboard loads user profile data                                        │
│  ✅ 7. Dashboard loads wallet data                                              │
│  ✅ 8. Authentication persists on page refresh                                  │
│  ✅ 9. Token refresh works on expiration                                        │
│  ✅ 10. Logout clears all stored data                                           │
│                                                                                 │
│  Development Environment:                                                       │
│  ✅ 11. Dev auth works when backend unavailable                                 │
│  ✅ 12. Production keys work in development                                     │
│                                                                                 │
│  Production Environment:                                                        │
│  ✅ 13. Production backend receives requests                                    │
│  ✅ 14. CORS allows frontend domain                                             │
│  ✅ 15. SSL certificates valid                                                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## System Dependencies Map

```
AUTHENTICATION SYSTEM DEPENDENCIES
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  External Services:                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Backend API   │  │    Supabase     │  │  Flutterwave    │                │
│  │                 │  │                 │  │                 │                │
│  │ • User Auth     │  │ • Real-time     │  │ • Payment       │                │
│  │ • Profile Data  │  │ • Notifications │  │ • Webhooks      │                │
│  │ • Transactions  │  │ • Subscriptions │  │ • Verification  │                │
│  │ • Wallet Ops    │  │                 │  │                 │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│         │                       │                       │                     │
│         ▼                       ▼                       ▼                     │
│  ┌─────────────────────────────────────────────────────────────┐               │
│  │                    FRONTEND APPLICATION                    │               │
│  │                                                             │               │
│  │  Contexts:           Components:         API Clients:      │               │
│  │  • AuthContext      • AuthGuard         • Primary API     │               │
│  │  • UserDataContext  • Login/Register    • HTTP Client     │               │
│  │  • WalletContext    • Dashboard         • API Client      │               │
│  │                     • Providers         • Dev Auth        │               │
│  └─────────────────────────────────────────────────────────────┘               │
│                                                                                 │
│  Storage:                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐                                     │
│  │  localStorage   │  │ sessionStorage  │                                     │
│  │                 │  │                 │                                     │
│  │ • user          │  │ • redirectUrl   │                                     │
│  │ • access_token  │  │                 │                                     │
│  │ • refresh_token │  │                 │                                     │
│  └─────────────────┘  └─────────────────┘                                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

This visual guide provides a comprehensive overview of the authentication system architecture, highlighting the critical inconsistencies that need immediate attention. The diagrams show the complete flow from registration through dashboard access, making it easy for the development team to understand both the intended flow and the specific points where fixes are needed.
