# StarkTol VTU Platform - Project Board Setup

## Project Board: Mock Data to Real API Integration

### Labels to Create:
- **mock-data** (Red) - Files containing mock/hard-coded data
- **api-integration** (Blue) - Files ready for API integration
- **backend-gap** (Yellow) - Missing backend API endpoints needed
- **done** (Green) - Completed migration to real data

### Cards to Create:

#### High Priority - Dashboard Core Files

1. **debug-api.js**
   - Labels: `mock-data`
   - Description: Debug API testing script with hard-coded test user data
   - Mock instances: 1 (test user data)

2. **app/(dashboard)/dashboard/exam-cards/page.tsx**
   - Labels: `mock-data`
   - Description: Exam cards page with mock transactions and providers
   - Mock instances: 2 (recent transactions, providers data)

3. **app/(dashboard)/dashboard/wallet/transactions/page.tsx**
   - Labels: `mock-data`
   - Description: Wallet transactions page with detailed mock transaction history
   - Mock instances: 1 (complex transaction objects with filtering logic)

4. **app/(dashboard)/dashboard/wallet/page.tsx**
   - Labels: `mock-data`
   - Description: Main wallet page with balance and transaction data
   - Mock instances: 2 (wallet data, transactions)

5. **app/(dashboard)/dashboard/cable/page.tsx**
   - Labels: `mock-data`
   - Description: Cable TV subscription interface
   - Mock instances: 3 (transactions, providers, packages)

6. **app/(dashboard)/dashboard/electricity/page.tsx**
   - Labels: `mock-data`
   - Description: Electricity bill payment interface
   - Mock instances: 2 (transactions, providers)

7. **app/(dashboard)/dashboard/auto-refill/page.tsx**
   - Labels: `mock-data`
   - Description: Auto-refill management interface
   - Mock instances: 3 (active refills, providers, data bundles)

8. **app/(dashboard)/dashboard/page.tsx**
   - Labels: `mock-data`
   - Description: Main dashboard with quick services navigation
   - Mock instances: 1 (quick services array)

9. **app/(dashboard)/dashboard/referrals/page.tsx**
   - Labels: `mock-data`
   - Description: Referral program management
   - Mock instances: 3 (referral data, history, withdrawals)

10. **app/(dashboard)/dashboard/recharge-card/page.tsx**
    - Labels: `mock-data`
    - Description: Recharge card generation interface
    - Mock instances: 3 (transactions, providers, denominations)

#### Medium Priority - Marketing Pages

11. **app/(marketing)/about/page.tsx**
    - Labels: `mock-data`
    - Description: About page with team member information
    - Mock instances: 1 (team members array)

12. **app/(marketing)/faq/page.tsx**
    - Labels: `mock-data`
    - Description: FAQ page with categorized questions
    - Mock instances: 1 (FAQ categories and content)

13. **app/(marketing)/services/page.tsx**
    - Labels: `mock-data`
    - Description: Services overview with features and pricing
    - Mock instances: Multiple (service descriptions, pricing)

14. **app/(marketing)/services/airtime/page.tsx**
    - Labels: `mock-data`
    - Description: Airtime service details
    - Mock instances: Multiple (provider info, pricing tiers)

15. **app/(marketing)/services/data/page.tsx**
    - Labels: `mock-data`
    - Description: Data service details
    - Mock instances: Multiple (data plans, network offerings)

### API Endpoints Needed (Backend Requirements)

Create cards for missing API endpoints:

16. **API: User Authentication**
    - Labels: `backend-gap`
    - Description: JWT-based authentication endpoints
    - Endpoints: `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`

17. **API: Wallet Management**
    - Labels: `backend-gap`
    - Description: Wallet balance and transaction endpoints
    - Endpoints: `/api/wallet/balance`, `/api/wallet/transactions`, `/api/wallet/fund`

18. **API: Service Providers**
    - Labels: `backend-gap`
    - Description: Dynamic provider and package data
    - Endpoints: `/api/providers`, `/api/providers/{id}/packages`

19. **API: Transaction Processing**
    - Labels: `backend-gap`
    - Description: Service purchase and transaction endpoints
    - Endpoints: `/api/transactions/airtime`, `/api/transactions/data`, `/api/transactions/cable`, `/api/transactions/electricity`

20. **API: User Profile**
    - Labels: `backend-gap`
    - Description: User data and profile management
    - Endpoints: `/api/user/profile`, `/api/user/referrals`

21. **API: Auto Refill Management**
    - Labels: `backend-gap`
    - Description: Scheduled refill management
    - Endpoints: `/api/autorefill`, `/api/autorefill/{id}/toggle`

### Workflow Columns

1. **To Do** - Files with mock data awaiting conversion
2. **API Design** - Designing required API endpoints
3. **Backend Development** - Implementing API endpoints
4. **Frontend Integration** - Connecting frontend to real APIs
5. **Testing** - QA and integration testing
6. **Done** - Completed real data integration

### Next Steps After Board Creation

1. Move all cards to "To Do" column initially
2. Prioritize dashboard core functionality first
3. Create corresponding backend API endpoints
4. Test each integration thoroughly
5. Update cards with progress notes and move through workflow

### Estimated Timeline

- **Phase 1** (Dashboard Core): 2-3 weeks
- **Phase 2** (API Integration): 3-4 weeks  
- **Phase 3** (Marketing Pages): 1-2 weeks
- **Phase 4** (Testing & Polish): 1-2 weeks

**Total Estimated Time: 7-11 weeks**

## Usage Instructions

1. Create a new GitHub Project in your repository
2. Add the labels listed above
3. Create cards for each item listed
4. Set up the workflow columns
5. Begin with high priority dashboard files
6. Track progress by moving cards through workflow stages
