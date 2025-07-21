# Backend API Gaps & Proposed Contracts

This document identifies missing backend endpoints required to replace mock data, with proposed API contracts for the backend team to implement.

## Summary
- **Total gaps identified:** 15 endpoints
- **Priority level breakdown:** 6 High, 5 Medium, 4 Low
- **Estimated development time:** 3-4 sprints

---

## HIGH PRIORITY GAPS

### 1. Auto-Refill Management System

#### 1.1 Get Active Auto-Refill Schedules
**Endpoint:** `GET /api/v1/auto-refill/schedules`

**Purpose:** Replace mock data in `auto-refill/page.tsx` for displaying user's active auto-refill schedules.

**Request:**
```http
GET /api/v1/auto-refill/schedules?status=active&limit=20&offset=0
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `status` (optional): `active` | `paused` | `expired` | `all`
- `limit` (optional): Number, default 20
- `offset` (optional): Number, default 0

**Response:**
```json
{
  "success": true,
  "message": "Auto-refill schedules retrieved successfully",
  "data": [
    {
      "id": "ar_123456789",
      "type": "airtime" | "data",
      "provider": "mtn",
      "phoneNumber": "08012345678",
      "amount": 1000,
      "bundleId": "mtn-1gb-30days", // For data type only
      "frequency": "weekly" | "monthly" | "custom",
      "customSchedule": "0 9 * * 1", // Cron expression for custom
      "nextExecution": "2023-05-15T09:00:00Z",
      "status": "active" | "paused" | "expired",
      "createdAt": "2023-05-01T10:30:00Z",
      "totalExecutions": 4,
      "failedExecutions": 0,
      "lastExecution": {
        "date": "2023-05-08T09:00:00Z",
        "status": "success",
        "transactionId": "txn_abc123",
        "amount": 1000
      }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

#### 1.2 Create Auto-Refill Schedule
**Endpoint:** `POST /api/v1/auto-refill/schedules`

**Request:**
```json
{
  "type": "airtime" | "data",
  "provider": "mtn",
  "phoneNumber": "08012345678",
  "amount": 1000,
  "bundleId": "mtn-1gb-30days", // Required for data type
  "frequency": "weekly" | "monthly" | "custom",
  "customSchedule": "0 9 * * 1", // Required for custom frequency
  "startDate": "2023-05-15T09:00:00Z",
  "endDate": "2023-12-31T23:59:59Z" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Auto-refill schedule created successfully",
  "data": {
    "id": "ar_123456789",
    "nextExecution": "2023-05-15T09:00:00Z",
    "status": "active"
  }
}
```

#### 1.3 Manage Auto-Refill Schedule
**Endpoints:**
- `PATCH /api/v1/auto-refill/schedules/{scheduleId}` - Update schedule
- `DELETE /api/v1/auto-refill/schedules/{scheduleId}` - Delete schedule  
- `POST /api/v1/auto-refill/schedules/{scheduleId}/pause` - Pause schedule
- `POST /api/v1/auto-refill/schedules/{scheduleId}/resume` - Resume schedule

---

### 2. Referral System

#### 2.1 Get Referral Statistics
**Endpoint:** `GET /api/v1/user/referral/stats`

**Purpose:** Replace mock referral data in `referrals/page.tsx`.

**Response:**
```json
{
  "success": true,
  "message": "Referral statistics retrieved successfully",
  "data": {
    "referralCode": "BABSVTU123",
    "referralLink": "https://starktolvtu.com/ref/BABSVTU123",
    "totalReferrals": 24,
    "activeReferrals": 18,
    "totalEarnings": 45000,
    "availableBalance": 12500,
    "pendingEarnings": 2500,
    "currentTier": {
      "name": "Silver",
      "commissionRate": 5.0,
      "benefits": ["5% commission", "Priority support"]
    },
    "nextTier": {
      "name": "Gold",
      "requiredReferrals": 25,
      "progress": 96,
      "remainingReferrals": 1,
      "commissionRate": 7.5
    },
    "monthlyStats": {
      "newReferrals": 3,
      "earnings": 8500
    }
  }
}
```

#### 2.2 Get Referral History
**Endpoint:** `GET /api/v1/user/referral/history`

**Query Parameters:**
- `limit` (optional): Number, default 20
- `offset` (optional): Number, default 0
- `status` (optional): `active` | `inactive` | `all`

**Response:**
```json
{
  "success": true,
  "message": "Referral history retrieved successfully",
  "data": [
    {
      "id": "ref_123456789",
      "referredUser": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "08012345678"
      },
      "joinedAt": "2023-05-02T14:30:00Z",
      "status": "active" | "inactive",
      "totalTransactions": 12,
      "totalVolume": 45000,
      "earningsGenerated": 5000,
      "lastActivity": "2023-05-14T10:15:00Z"
    }
  ],
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

#### 2.3 Get Withdrawal History
**Endpoint:** `GET /api/v1/user/referral/withdrawals`

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal history retrieved successfully",
  "data": [
    {
      "id": "wd_123456789",
      "amount": 10000,
      "method": "wallet_transfer" | "bank_transfer",
      "status": "completed" | "pending" | "failed",
      "requestedAt": "2023-04-30T15:45:00Z",
      "processedAt": "2023-04-30T16:00:00Z",
      "reference": "REF123456789",
      "bankDetails": {
        "accountName": "John Doe",
        "accountNumber": "0123456789",
        "bankName": "GTBank"
      }
    }
  ]
}
```

#### 2.4 Request Withdrawal
**Endpoint:** `POST /api/v1/user/referral/withdraw`

**Request:**
```json
{
  "amount": 10000,
  "method": "wallet_transfer" | "bank_transfer",
  "bankDetails": { // Required for bank_transfer
    "accountName": "John Doe",
    "accountNumber": "0123456789",
    "bankCode": "058"
  },
  "pin": "1234" // User's transaction PIN
}
```

---

### 3. User Analytics & Dashboard

#### 3.1 Get Dashboard Statistics
**Endpoint:** `GET /api/v1/user/dashboard/stats`

**Purpose:** Replace mock data and provide real-time dashboard metrics.

**Query Parameters:**
- `period` (optional): `week` | `month` | `quarter` | `year`, default `month`

**Response:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "period": "month",
    "summary": {
      "totalTransactions": 45,
      "totalSpent": 125000,
      "successRate": 98.2,
      "favoriteService": "airtime"
    },
    "serviceBreakdown": [
      {
        "service": "airtime",
        "count": 18,
        "amount": 45000,
        "percentage": 36.0
      },
      {
        "service": "data",
        "count": 12,
        "amount": 35000,
        "percentage": 28.0
      }
    ],
    "recentActivity": [
      {
        "date": "2023-05-14",
        "transactions": 3,
        "amount": 8500
      }
    ],
    "goals": {
      "monthlySpending": {
        "target": 150000,
        "current": 125000,
        "progress": 83.3
      }
    }
  }
}
```

---

## MEDIUM PRIORITY GAPS

### 4. Service Menu Configuration
**Endpoint:** `GET /api/v1/services/menu`

**Purpose:** Replace hard-coded quick services in dashboard.

**Response:**
```json
{
  "success": true,
  "message": "Service menu retrieved successfully",
  "data": [
    {
      "id": "airtime",
      "name": "Airtime",
      "icon": "phone",
      "color": "blue",
      "path": "/dashboard/airtime",
      "enabled": true,
      "order": 1,
      "badge": null
    },
    {
      "id": "data",
      "name": "Data Bundle",
      "icon": "wifi",
      "color": "green", 
      "path": "/dashboard/data",
      "enabled": true,
      "order": 2,
      "badge": "popular"
    }
  ]
}
```

### 5. User Preferences
**Endpoints:**
- `GET /api/v1/user/preferences` - Get user preferences
- `PATCH /api/v1/user/preferences` - Update preferences

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "notifications": {
      "email": true,
      "sms": false,
      "push": true,
      "transactionAlerts": true,
      "promotionalEmails": false
    },
    "defaultPaymentMethod": "wallet",
    "favoriteServices": ["airtime", "data"],
    "quickNumbers": [
      {
        "label": "Personal",
        "number": "08012345678",
        "provider": "mtn"
      }
    ],
    "theme": "light",
    "language": "en",
    "currency": "NGN"
  }
}
```

### 6. Transaction Search & Filtering
**Endpoint:** `GET /api/v1/transactions/search`

**Query Parameters:**
- `query` (optional): Search term
- `type` (optional): Service type filter
- `status` (optional): Transaction status filter
- `dateFrom` (optional): Start date (ISO 8601)
- `dateTo` (optional): End date (ISO 8601)
- `amountMin` (optional): Minimum amount
- `amountMax` (optional): Maximum amount
- `provider` (optional): Provider filter
- `limit` (optional): Number, default 20
- `offset` (optional): Number, default 0

### 7. Notifications Management
**Endpoints:**
- `GET /api/v1/notifications` - Get user notifications
- `PATCH /api/v1/notifications/{id}/read` - Mark as read
- `DELETE /api/v1/notifications/{id}` - Delete notification

### 8. Service Pricing & Offers
**Endpoint:** `GET /api/v1/services/pricing`

**Purpose:** Replace hard-coded pricing in marketing pages.

---

## LOW PRIORITY GAPS

### 9. Content Management

#### 9.1 FAQ Content
**Endpoint:** `GET /api/v1/content/faq`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "general",
      "title": "General Questions",
      "description": "Basic information about StarkTol VTU",
      "order": 1,
      "faqs": [
        {
          "id": "faq_001",
          "question": "What is StarkTol VTU?",
          "answer": "StarkTol VTU is a virtual top-up platform...",
          "order": 1,
          "updatedAt": "2023-05-01T10:00:00Z"
        }
      ]
    }
  ]
}
```

#### 9.2 Team Information
**Endpoint:** `GET /api/v1/content/team`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "member_001",
      "name": "Akanni Husseni",
      "role": "Founder & CEO",
      "image": "/uploads/team/akanni-husseni.jpg",
      "bio": "Visionary entrepreneur with over 10 years of experience...",
      "social": {
        "linkedin": "https://linkedin.com/in/akanni-husseni",
        "twitter": "@akannih"
      },
      "order": 1
    }
  ]
}
```

#### 9.3 Service Features
**Endpoint:** `GET /api/v1/content/services`

### 10. System Health & Status
**Endpoint:** `GET /api/v1/system/status`

**Purpose:** Service availability and status information.

---

## Implementation Notes

### Database Considerations
1. **Auto-refill schedules** need cron job management
2. **Referral system** requires tracking of referrer-referee relationships
3. **Analytics** may benefit from time-series database or caching
4. **Content management** needs versioning and publishing workflow

### Security Considerations
1. All endpoints require authentication via JWT tokens
2. Referral withdrawals need additional PIN verification
3. Auto-refill schedules need rate limiting
4. User preferences should be validated server-side

### Performance Considerations
1. Dashboard stats should be cached (Redis recommended)
2. Transaction search needs proper indexing
3. Referral calculations should be background processed
4. Content endpoints can be heavily cached

### Integration Requirements
1. Auto-refill system needs payment processor integration
2. Referral system needs wallet integration
3. Notifications need email/SMS service integration
4. Analytics may need third-party tracking integration

---

## Estimated Development Timeline

### Sprint 1 (2 weeks)
- Auto-refill management (endpoints 1.1-1.3)
- Basic referral stats (endpoint 2.1)

### Sprint 2 (2 weeks)  
- Complete referral system (endpoints 2.2-2.4)
- Dashboard analytics (endpoint 3.1)

### Sprint 3 (2 weeks)
- Service configuration & preferences (endpoints 4-5)
- Advanced transaction features (endpoint 6)

### Sprint 4 (2 weeks)
- Notifications & content management (endpoints 7-10)
- Testing & optimization

---

## Contact & Questions

For clarification on any proposed contracts or implementation details:
- **Frontend Team**: Available for API response format discussions
- **Product Team**: Available for business logic clarification
- **Backend Team**: Please confirm feasibility and provide timeline estimates

**Created:** {current_date}
**Last Updated:** {current_date}
**Status:** Pending Backend Team Review
