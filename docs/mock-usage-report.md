# Mock Data Usage Report

This document catalogs all instances of mock or hard-coded data found in the StarkTol VTU platform codebase.

## Summary

- **Total files with mock data:** 15
- **Total mock data instances:** 47
- **Primary data types:** Transaction histories, provider lists, user data, form state data, test data

## Files with Mock Data

### 1. `debug-api.js`
**Component/Type:** Debug API testing script  
**Mock Data Shape:**
```javascript
const testData = {
  full_name: 'Test User Debug',
  email: `test${Date.now()}@example.com`,
  phone: '08012345678',
  password: 'password123'
}
```
**Consumer Logic:** Used for API connectivity testing
**Purpose:** Debug/testing

---

### 2. `app/(dashboard)/dashboard/exam-cards/page.tsx`
**Component/Type:** ExamCardsPage React component  
**Mock Data Instances:** 2

#### Recent Transactions Data
**Shape:**
```javascript
const recentTransactions = [
  {
    id: 1,
    provider: "WAEC",
    quantity: "1",
    amount: "₦3,500",
    date: "Today, 10:30 AM",
    status: "success",
    pin: "1234-5678-9012-3456"
  }
  // ... 3 more similar objects
]
```

#### Providers Data
**Shape:**
```javascript
const providers = [
  { id: "waec", name: "WAEC", logo: "/waec.logo.jpg?height=60&width=60", price: "₦3,500" }
  // ... 3 more similar objects
]
```
**Consumer Logic:** `map()` for rendering lists, `find()` for lookups
**Purpose:** UI mockup for exam card purchases

---

### 3. `app/(dashboard)/dashboard/wallet/transactions/page.tsx`
**Component/Type:** WalletTransactionsPage React component  
**Mock Data Shape:**
```javascript
const transactions = [
  {
    id: "TRX123456789",
    type: "credit",
    description: "Wallet Funding",
    amount: "₦50,000",
    rawAmount: 50000,
    date: "May 5, 2023, 10:30 AM",
    status: "success",
    method: "Bank Transfer",
    reference: "REF123456789",
    fee: "₦0",
    balance: "₦125,000",
    details: {
      senderName: "John Doe",
      senderBank: "GTBank",
      senderAccount: "0123456789",
      narration: "Wallet funding"
    }
  }
  // ... 7 more transaction objects
]
```
**Consumer Logic:** 
- `filter()` for search/type/date filtering
- `map()` for rendering transaction lists
- Complex conditional rendering based on transaction types
**Purpose:** Transaction history display and filtering

---

### 4. `app/(dashboard)/dashboard/wallet/page.tsx`
**Component/Type:** WalletPage React component  
**Mock Data Instances:** 2

#### Wallet Data
**Shape:**
```javascript
const walletData = {
  balance: "₦125,000.00",
  accountNumber: "1234567890",
  accountName: "John Doe",
  bankName: "Babs VTU Bank"
}
```

#### Transactions Data
**Shape:**
```javascript
const transactions = [
  {
    id: 1,
    type: "credit",
    description: "Wallet Funding",
    amount: "₦50,000",
    date: "Today, 10:30 AM",
    status: "success"
  }
  // ... 4 more objects
]
```
**Consumer Logic:** `map()` for rendering, conditional styling based on transaction type
**Purpose:** Wallet overview and recent transactions

---

### 5. `app/(dashboard)/dashboard/cable/page.tsx`
**Component/Type:** CablePage React component  
**Mock Data Instances:** 3

#### Recent Transactions
**Shape:**
```javascript
const recentTransactions = [
  {
    id: 1,
    provider: "DSTV",
    smartCardNumber: "12345678901",
    package: "DSTV Premium",
    amount: "₦24,500",
    date: "Today, 10:30 AM",
    status: "success"
  }
  // ... 3 more objects
]
```

#### Providers Data
**Shape:**
```javascript
const providers = [
  { id: "dstv", name: "DSTV", logo: "/dstv.logo.jpg?height=60&width=60" }
  // ... 3 more objects
]
```

#### Packages Data
**Shape:**
```javascript
const packages = {
  dstv: [
    { id: "dstv-premium", name: "DSTV Premium", price: "₦24,500" }
    // ... 4 more packages
  ],
  gotv: [
    // ... similar structure
  ]
  // ... more providers
}
```
**Consumer Logic:** 
- `map()` for rendering lists
- `find()` for package lookups
- Dynamic package filtering based on provider selection
**Purpose:** Cable TV subscription interface

---

### 6. `app/(dashboard)/dashboard/electricity/page.tsx`
**Component/Type:** ElectricityPage React component  
**Mock Data Instances:** 2

#### Recent Transactions
**Shape:**
```javascript
const recentTransactions = [
  {
    id: 1,
    provider: "EKEDC",
    meterNumber: "12345678901",
    amount: "₦10,000",
    date: "Today, 10:30 AM",
    status: "success",
    token: "1234-5678-9012-3456-7890"
  }
  // ... 3 more objects
]
```

#### Providers Data
**Shape:**
```javascript
const providers = [
  { id: "ekedc", name: "EKEDC", logo: "/ekedc.logo.jpg?height=60&width=60" }
  // ... 3 more objects
]
```
**Consumer Logic:** `map()` for rendering, conditional status styling
**Purpose:** Electricity bill payment interface

---

### 7. `app/(dashboard)/dashboard/auto-refill/page.tsx`
**Component/Type:** AutoRefillPage React component  
**Mock Data Instances:** 3

#### Active Auto Refills
**Shape:**
```javascript
const activeAutoRefills = [
  {
    id: 1,
    type: "airtime",
    provider: "MTN",
    phoneNumber: "08012345678",
    amount: "₦1,000",
    frequency: "Weekly (Every Monday)",
    nextRefill: "May 6, 2023",
    status: "active"
  }
  // ... 3 more objects
]
```

#### Providers and Data Bundles
**Shape:**
```javascript
const providers = [
  { id: "mtn", name: "MTN", logo: "/mtn.logo.jpg?height=60&width=60" }
  // ... 3 more objects
]

const dataBundles = {
  mtn: [
    { id: "mtn-100mb", name: "100MB - 1 Day", price: "₦100" }
    // ... more bundles
  ]
  // ... other providers
}
```
**Consumer Logic:** 
- `map()` for rendering lists
- Dynamic bundle filtering by provider
- Conditional rendering based on service type and status
**Purpose:** Auto-refill management interface

---

### 8. `app/(dashboard)/dashboard/page.tsx`
**Component/Type:** DashboardPage React component  
**Mock Data Shape:**
```javascript
const quickServices = [
  { id: 1, name: "Airtime", icon: Phone, color: "bg-blue-500", path: "/dashboard/airtime" }
  // ... 5 more services
]
```
**Consumer Logic:** `map()` for rendering service cards
**Purpose:** Dashboard quick services navigation
**Note:** Also uses UserDataContext for actual user data

---

### 9. `app/(dashboard)/dashboard/referrals/page.tsx`
**Component/Type:** ReferralsPage React component  
**Mock Data Instances:** 3

#### Referral Data
**Shape:**
```javascript
const referralData = {
  code: "BABSVTU123",
  link: "https://babsvtu.com/ref/BABSVTU123",
  totalReferrals: 24,
  activeReferrals: 18,
  totalEarnings: "₦45,000",
  availableBalance: "₦12,500",
  nextTier: {
    name: "Gold",
    progress: 72,
    remaining: 7
  },
  currentTier: {
    name: "Silver",
    commission: "5%"
  }
}
```

#### Referral History
**Shape:**
```javascript
const referralHistory = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    date: "May 2, 2023",
    status: "active",
    earnings: "₦5,000"
  }
  // ... 4 more objects
]
```

#### Withdrawal History
**Shape:**
```javascript
const withdrawalHistory = [
  {
    id: 1,
    amount: "₦10,000",
    date: "April 30, 2023",
    status: "completed",
    method: "Bank Transfer",
    reference: "REF123456789"
  }
  // ... 2 more objects
]
```
**Consumer Logic:** `map()` for table rendering, conditional status styling
**Purpose:** Referral program management

---

### 10. `app/(dashboard)/dashboard/recharge-card/page.tsx`
**Component/Type:** RechargeCardPage React component  
**Mock Data Instances:** 3

#### Recent Transactions
**Shape:**
```javascript
const recentTransactions = [
  {
    id: 1,
    provider: "MTN",
    denomination: "₦1,000",
    quantity: "5",
    amount: "₦5,000",
    date: "Today, 10:30 AM",
    status: "success"
  }
  // ... 3 more objects
]
```

#### Providers and Denominations
**Shape:**
```javascript
const providers = [
  { id: "mtn", name: "MTN", logo: "/mtn.logo.jpg?height=60&width=60" }
  // ... 3 more objects
]

const denominations = [
  { value: "100", label: "₦100" }
  // ... 5 more denominations
]
```
**Consumer Logic:** 
- `map()` for rendering options
- Complex total calculation logic
- Bulk denomination parsing
**Purpose:** Recharge card generation interface

---

### 11. `app/(marketing)/about/page.tsx`
**Component/Type:** AboutPage React component  
**Mock Data Shape:**
```javascript
const teamMembers = [
  {
    name: "Akanni Husseni",
    role: "Founder & CEO",
    image: "/ceo.jpg?height=300&width=300",
    bio: "Visionary entrepreneur with over 10 years of experience..."
  }
  // ... 3 more team members
]
```
**Consumer Logic:** `map()` for rendering team member cards
**Purpose:** About page team display

---

### 12. `app/(marketing)/faq/page.tsx`
**Component/Type:** FAQPage React component  
**Mock Data Shape:**
```javascript
const faqCategories = [
  {
    id: "general",
    title: "General Questions",
    description: "Basic information about StarkTol VTU",
    faqs: [
      {
        question: "What is StarkTol VTU?",
        answer: "StarkTol VTU is a virtual top-up platform..."
      }
      // ... more FAQs
    ]
  }
  // ... 4 more categories
]
```
**Consumer Logic:** 
- Nested `map()` for categories and questions
- Accordion component integration
**Purpose:** FAQ page content

---

### 13. Additional Files with Minor Mock Data

#### `app/(marketing)/services/page.tsx`
- Service feature lists and descriptions
- Hard-coded service pricing and features

#### `app/(marketing)/services/airtime/page.tsx`
- Network provider information
- Pricing tiers and features

#### `app/(marketing)/services/data/page.tsx`
- Data plan information
- Network-specific offerings

## Data Patterns and Common Shapes

### 1. Transaction Objects
Most common pattern across the application:
```javascript
{
  id: number | string,
  provider: string,
  amount: string, // formatted with ₦
  date: string, // formatted date
  status: "success" | "failed" | "pending",
  // additional fields vary by service type
}
```

### 2. Provider Objects
Consistent across services:
```javascript
{
  id: string,
  name: string,
  logo: string // image path with query params
}
```

### 3. Service Packages/Plans
```javascript
{
  id: string,
  name: string,
  price: string // formatted with ₦
}
```

## Consumer Logic Patterns

### 1. Rendering Lists
- **Pattern:** `array.map((item, index) => <Component key={item.id || index} {...item} />)`
- **Usage:** Present in all dashboard pages for transaction histories, service options

### 2. Filtering Data
- **Pattern:** `array.filter(item => condition)`
- **Usage:** Transaction filtering by type, date, search terms

### 3. Finding Specific Items
- **Pattern:** `array.find(item => item.id === targetId)`
- **Usage:** Provider/package selection, form validation

### 4. Conditional Rendering
- **Pattern:** Status-based styling and content display
- **Usage:** Transaction status indicators, service availability

### 5. Data Transformation
- **Pattern:** Price calculations, string formatting, date processing
- **Usage:** Order summaries, bulk calculations

## Recommendations for Migration

### 1. High Priority (User-Facing Data)
- Transaction histories in all dashboard pages
- Wallet data and balances
- Service provider information
- Pricing data

### 2. Medium Priority (Configuration Data)
- Service packages and plans
- Provider logos and metadata
- Form validation data

### 3. Low Priority (Static Content)
- FAQ content
- About page team information
- Marketing page content

### 4. API Integration Points
Most mock data should be replaced with API calls to:
- `/api/transactions` - for transaction histories
- `/api/providers` - for service provider data
- `/api/user/wallet` - for wallet information
- `/api/services` - for service packages and pricing
- `/api/user/profile` - for user-specific data

## Notes
- All monetary values are formatted with Nigerian Naira (₦) symbol
- Dates are inconsistently formatted across components
- Image paths include query parameters for sizing
- Most components have loading and success states but use setTimeout for simulation
- Form data is managed with useState hooks, not form libraries
