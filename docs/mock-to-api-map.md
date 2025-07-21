# Mock Data to Backend API Mapping

This document maps each catalogued mock data instance to its corresponding backend API endpoint. For gaps where no endpoint exists, entries are added to `backend-gaps.md`.

## Summary
- **Total mock instances mapped:** 47
- **Existing backend endpoints:** 32
- **Missing backend endpoints:** 15
- **API Base URL:** `https://backend-066c.onrender.com/api/v1`

---

## 1. Debug API Testing (`debug-api.js`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Test user data | User Registration | POST | `/auth/register` | `{ full_name, email, phone, password }` | `{ success: boolean, message: string, data: { id, access_token, refresh_token } }` | ✅ **MAPPED** |

---

## 2. Exam Cards Page (`app/(dashboard)/dashboard/exam-cards/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Recent Transactions | Get Exam Card Transactions | GET | `/transactions?type=exam_card&limit=10` | None | `Array<BaseTransaction>` | ✅ **MAPPED** |
| Exam Providers | Get Exam Providers | GET | `/services/exam-cards/providers` | None | `Array<ExamProvider>` | ✅ **MAPPED** |

---

## 3. Wallet Transactions Page (`app/(dashboard)/dashboard/wallet/transactions/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Transaction History | Get Wallet Transactions | GET | `/wallet/transactions?limit=20&offset=0` | None | `Array<WalletTransaction>` | ✅ **MAPPED** |
| Filtered Transactions | Get Wallet Transactions (filtered) | GET | `/wallet/transactions?type={credit\|debit}&limit=20` | None | `Array<WalletTransaction>` | ✅ **MAPPED** |

---

## 4. Wallet Page (`app/(dashboard)/dashboard/wallet/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Wallet Balance & Account | Get Wallet Balance | GET | `/wallet/balance` | None | `{ balance: number, currency: string, formatted: string }` | ✅ **MAPPED** |
| Account Details | Get Account Details | GET | `/wallet/account-details` | None | `{ accountNumber: string, accountName: string, bankName: string }` | ✅ **MAPPED** |
| Recent Transactions | Get Wallet Transactions | GET | `/wallet/transactions?limit=5` | None | `Array<WalletTransaction>` | ✅ **MAPPED** |

---

## 5. Cable TV Page (`app/(dashboard)/dashboard/cable/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Recent Transactions | Get Cable Transactions | GET | `/transactions?type=cable&limit=10` | None | `Array<BaseTransaction>` | ✅ **MAPPED** |
| Cable Providers | Get Cable Providers | GET | `/services/cable/providers` | None | `Array<CableProvider>` | ✅ **MAPPED** |
| Cable Packages | Get Cable Plans | GET | `/services/cable/plans?provider={providerId}` | None | `Array<CablePlan>` | ✅ **MAPPED** |

---

## 6. Electricity Page (`app/(dashboard)/dashboard/electricity/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Recent Transactions | Get Electricity Transactions | GET | `/transactions?type=electricity&limit=10` | None | `Array<BaseTransaction>` | ✅ **MAPPED** |
| Electricity Providers | Get Electricity Providers | GET | `/services/electricity/providers` | None | `Array<ElectricityProvider>` | ✅ **MAPPED** |

---

## 7. Auto-Refill Page (`app/(dashboard)/dashboard/auto-refill/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Active Auto Refills | **MISSING** | GET | `/auto-refill/schedules` | None | `Array<AutoRefillSchedule>` | ❌ **GAP** |
| Network Providers | Get Airtime Providers | GET | `/services/airtime/providers` | None | `Array<AirtimeProvider>` | ✅ **MAPPED** |
| Data Bundles | Get Data Bundles | GET | `/services/data/bundles?provider={providerId}` | None | `Array<DataBundle>` | ✅ **MAPPED** |

---

## 8. Dashboard Page (`app/(dashboard)/dashboard/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Quick Services | **MISSING** | GET | `/services/menu` | None | `Array<ServiceMenuItem>` | ❌ **GAP** |
| User Data | **USING CONTEXT** | - | - | - | - | ℹ️ **CONTEXT** |

---

## 9. Referrals Page (`app/(dashboard)/dashboard/referrals/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Referral Data | **MISSING** | GET | `/user/referral/stats` | None | `ReferralStats` | ❌ **GAP** |
| Referral History | **MISSING** | GET | `/user/referral/history` | None | `Array<ReferralRecord>` | ❌ **GAP** |
| Withdrawal History | **MISSING** | GET | `/user/referral/withdrawals` | None | `Array<WithdrawalRecord>` | ❌ **GAP** |

---

## 10. Recharge Card Page (`app/(dashboard)/dashboard/recharge-card/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Recent Transactions | Get Recharge Card Transactions | GET | `/transactions?type=recharge_card&limit=10` | None | `Array<BaseTransaction>` | ✅ **MAPPED** |
| Providers | Get Recharge Card Providers | GET | `/services/recharge-cards/providers` | None | `Array<RechargeCardProvider>` | ✅ **MAPPED** |
| Denominations | Get Denominations | GET | `/services/recharge-cards/denominations?provider={providerId}` | None | `Array<number>` | ✅ **MAPPED** |

---

## 11. About Page (`app/(marketing)/about/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Team Members | **MISSING** | GET | `/content/team` | None | `Array<TeamMember>` | ❌ **GAP** |

---

## 12. FAQ Page (`app/(marketing)/faq/page.tsx`)

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| FAQ Categories | **MISSING** | GET | `/content/faq` | None | `Array<FaqCategory>` | ❌ **GAP** |

---

## 13. Marketing Service Pages

| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Service Features | **MISSING** | GET | `/content/services` | None | `Array<ServiceFeature>` | ❌ **GAP** |
| Pricing Information | **MISSING** | GET | `/services/pricing` | None | `ServicePricing` | ❌ **GAP** |

---

## Data Service Mappings

### Airtime Service
| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Providers | Get Airtime Providers | GET | `/services/airtime/providers` | None | `Array<AirtimeProvider>` | ✅ **MAPPED** |
| Purchase | Buy Airtime | POST | `/services/airtime/purchase` | `{ provider, phone_number, amount, payment_method }` | `AirtimePurchaseResponse` | ✅ **MAPPED** |
| Validation | Validate Phone Number | POST | `/services/airtime/validate` | `{ phone_number, provider }` | `ValidationResponse` | ✅ **MAPPED** |

### Data Service
| Mock Data | Backend Endpoint | Method | URL | Request Body | Response Schema | Status |
|-----------|------------------|---------|-----|---------------|-----------------|---------|
| Providers | Get Data Providers | GET | `/services/data/providers` | None | `Array<DataProvider>` | ✅ **MAPPED** |
| Bundles | Get Data Bundles | GET | `/services/data/bundles?provider={providerId}` | None | `Array<DataBundle>` | ✅ **MAPPED** |
| All Bundles | Get All Data Bundles | GET | `/services/data/bundles/all` | None | `Record<string, DataBundle[]>` | ✅ **MAPPED** |
| Purchase | Buy Data Bundle | POST | `/services/data/purchase` | `{ provider, phone_number, bundle_id, payment_method }` | `DataPurchaseResponse` | ✅ **MAPPED** |
| Validation | Validate Phone Number | POST | `/services/data/validate` | `{ phone_number, provider }` | `ValidationResponse` | ✅ **MAPPED** |

---

## API Pattern Analysis

### Consistent Patterns Found:
1. **Transactions**: All services use `/transactions?type={service}&limit={n}` pattern
2. **Providers**: All services use `/services/{service}/providers` pattern  
3. **Validation**: All services use `/services/{service}/validate` pattern
4. **Purchase**: All services use `/services/{service}/purchase` pattern

### Missing Patterns:
1. **Auto-refill management**: No endpoints for scheduling/managing recurring services
2. **Referral system**: No endpoints for referral tracking and payouts
3. **Content management**: No endpoints for static content (FAQ, team, etc.)
4. **User preferences**: No endpoints for saving user preferences and settings
5. **Analytics/reporting**: No endpoints for user-specific analytics

---

## Implementation Priority

### High Priority (Core Business Logic)
1. Auto-refill management endpoints
2. Referral system endpoints  
3. User analytics endpoints

### Medium Priority (User Experience)
1. Content management endpoints
2. User preferences endpoints
3. Advanced transaction filtering

### Low Priority (Static Content)
1. Marketing content endpoints
2. FAQ management endpoints
3. Team information endpoints

---

## Authentication & Authorization

All API endpoints require:
- **Authorization Header**: `Bearer {access_token}`
- **User Context**: `X-User-ID` header for user-specific data
- **Token Refresh**: Automatic refresh using `/auth/refresh` endpoint

---

## Notes

- Base URL is configurable via `NEXT_PUBLIC_BASE_URL` environment variable
- All monetary values are in Nigerian Naira (NGN)
- All timestamps are in ISO 8601 format
- Pagination follows `?limit={n}&offset={n}` pattern
- Error responses follow consistent `{ success, message, error }` schema
