# Referrals Service QA Testing Guide

This guide provides comprehensive manual testing scenarios for the ReferralsService integration, covering all endpoints, error states, and user flows.

## Test Environment Setup

### Prerequisites
- Access to StarkTol VTU Platform (localhost or staging)
- Test user account with referral capabilities
- Browser developer tools access
- Network throttling capabilities for testing slow connections

### Test Data Requirements
- Valid referral codes
- Bank account details for withdrawal testing
- Transaction PIN for secure operations
- Multiple test user accounts for referral testing

## 1. Referral Statistics Testing

### Test Case 1.1: Success Path - Get Referral Stats
**Objective**: Verify referral stats endpoint returns correct data structure

**Steps**:
1. Navigate to `/dashboard/referrals`
2. Verify stats cards display properly
3. Check network tab for API call to `/user/referral/stats`
4. Verify response contains all required fields:
   - `totalReferrals` (number)
   - `activeReferrals` (number)
   - `totalEarnings` (number, formatted as currency)
   - `availableBalance` (number, formatted as currency)
   - `pendingWithdrawals` (number)
   - `thisMonthEarnings` (number, formatted as currency)
   - `thisMonthReferrals` (number)
   - `conversionRate` (number, displayed as percentage)
   - `referralCode` (string)
   - `referralUrl` (string, valid URL)

**Expected Results**:
- ✅ All stats display with proper formatting
- ✅ Currency values show ₦ symbol and proper decimals
- ✅ Percentages display with % symbol
- ✅ No loading states persist
- ✅ Data updates when page refreshes

### Test Case 1.2: Empty State - No Referral Activity
**Objective**: Test display when user has no referral activity

**Steps**:
1. Use account with no referrals
2. Navigate to referrals page
3. Verify empty state handling

**Expected Results**:
- ✅ Zero values display as "₦0.00" for currency fields
- ✅ Zero counts display as "0"
- ✅ Appropriate empty state messaging
- ✅ Call-to-action to share referral link

### Test Case 1.3: Error State - API Failure
**Objective**: Test error handling when stats API fails

**Steps**:
1. Block `/user/referral/stats` in network tab
2. Navigate to referrals page
3. Verify error handling

**Expected Results**:
- ✅ Error message displays to user
- ✅ Retry option available
- ✅ Page doesn't crash or show broken UI
- ✅ Other page elements still functional

## 2. Referral History Testing

### Test Case 2.1: Success Path - Paginated History
**Objective**: Verify referral history loads with pagination

**Steps**:
1. Navigate to referral history section
2. Verify initial load (page 1, limit 20)
3. Test pagination controls
4. Verify data structure for each referral record:
   - `id` (string)
   - `referredUserName` (string)
   - `referredUserEmail` (string, valid email format)
   - `joinedAt` (string, formatted date)
   - `status` ('pending' | 'active' | 'inactive')
   - `totalTransactions` (number)
   - `totalSpent` (number, formatted as currency)
   - `commissionEarned` (number, formatted as currency)
   - `lastActivity` (string, relative time or null)

**Expected Results**:
- ✅ History loads with correct pagination
- ✅ Status badges display with appropriate colors
- ✅ Dates format correctly (relative time)
- ✅ Currency values format correctly
- ✅ Pagination controls work properly
- ✅ Loading states during navigation

### Test Case 2.2: Empty State - No Referrals
**Objective**: Test empty referral history

**Steps**:
1. Use account with no referrals
2. Navigate to history section

**Expected Results**:
- ✅ Empty state message displays
- ✅ Encouragement to share referral link
- ✅ No broken table or list UI

### Test Case 2.3: Search and Filter
**Objective**: Test referral history search/filter functionality

**Steps**:
1. Enter search term in referral history
2. Test status filter (active, pending, inactive)
3. Test date range filtering
4. Clear filters and verify reset

**Expected Results**:
- ✅ Search filters results correctly
- ✅ Status filters work properly
- ✅ Date filters function correctly
- ✅ Clear filters resets to full list
- ✅ "No results" message when appropriate

## 3. Withdrawal History Testing

### Test Case 3.1: Success Path - Withdrawal History
**Objective**: Verify withdrawal history displays correctly

**Steps**:
1. Navigate to withdrawal history section
2. Verify data structure for each withdrawal:
   - `id` (string)
   - `amount` (number, formatted as currency)
   - `status` ('pending' | 'processing' | 'completed' | 'failed' | 'cancelled')
   - `method` ('wallet' | 'bank_transfer')
   - `requestedAt` (string, formatted date)
   - `reference` (string)
   - `bankDetails` (object, if bank_transfer)
   - `failureReason` (string, if failed)

**Expected Results**:
- ✅ All withdrawals display with correct formatting
- ✅ Status badges show appropriate colors
- ✅ Bank details show for bank transfers
- ✅ Failure reasons display for failed withdrawals
- ✅ Reference numbers are clickable/copyable

### Test Case 3.2: Status-Specific Testing
**Objective**: Verify different withdrawal statuses display correctly

**Test different status scenarios**:
- **Pending**: Yellow badge, shows "Pending approval"
- **Processing**: Blue badge, shows "Being processed"
- **Completed**: Green badge, shows completion date
- **Failed**: Red badge, shows failure reason
- **Cancelled**: Gray badge, shows cancellation info

**Expected Results**:
- ✅ Each status has correct color coding
- ✅ Appropriate status text displays
- ✅ Relevant additional info shows per status

## 4. Withdrawal Request Testing

### Test Case 4.1: Success Path - Wallet Withdrawal
**Objective**: Test successful wallet withdrawal request

**Steps**:
1. Navigate to withdrawal section
2. Select "Wallet" as withdrawal method
3. Enter valid amount (above minimum)
4. Enter correct transaction PIN
5. Submit request

**Expected Results**:
- ✅ Form validates input correctly
- ✅ Success message displays
- ✅ Withdrawal appears in history
- ✅ Available balance updates
- ✅ Form resets after successful submission

### Test Case 4.2: Success Path - Bank Transfer Withdrawal
**Objective**: Test successful bank transfer withdrawal

**Steps**:
1. Select "Bank Transfer" method
2. Enter valid amount
3. Provide bank details (account number, bank code)
4. Enter transaction PIN
5. Submit request

**Expected Results**:
- ✅ Bank details form appears
- ✅ Bank code validation works
- ✅ Account number validation works
- ✅ Success confirmation shows estimated processing time
- ✅ Bank details saved for future use (optional)

### Test Case 4.3: Validation Errors
**Objective**: Test form validation for withdrawal requests

**Test scenarios**:
- Amount below minimum (< ₦1,000)
- Amount exceeding available balance
- Empty amount field
- Invalid bank details
- Wrong transaction PIN
- Network timeout during submission

**Expected Results**:
- ✅ Appropriate error messages display
- ✅ Form fields highlight validation errors
- ✅ PIN attempts are limited
- ✅ Retry options available for network errors

### Test Case 4.4: Edge Cases
**Objective**: Test edge cases in withdrawal flow

**Test scenarios**:
- Withdrawal with exact available balance
- Withdrawal during insufficient balance
- Multiple rapid withdrawal attempts
- Withdrawal with special characters in bank details

**Expected Results**:
- ✅ Edge cases handled gracefully
- ✅ No crashes or broken states
- ✅ Clear error messages
- ✅ Form remains functional

## 5. Referral Link Sharing Testing

### Test Case 5.1: Copy Referral Link
**Objective**: Test copy to clipboard functionality

**Steps**:
1. Click "Copy Link" button
2. Verify clipboard content
3. Test in different browsers
4. Test on mobile devices

**Expected Results**:
- ✅ Link copies to clipboard successfully
- ✅ Success toast/notification shows
- ✅ Pasted link is valid and complete
- ✅ Works across different browsers

### Test Case 5.2: Social Media Sharing
**Objective**: Test social media share buttons generate correct URLs

**Test each platform**:
- **WhatsApp**: Test message format and link inclusion
- **Twitter/X**: Verify tweet text and character count
- **Facebook**: Test share URL functionality
- **Telegram**: Verify message format
- **LinkedIn**: Test professional sharing format

**Steps**:
1. Click each social share button
2. Verify generated URL/message
3. Test actual sharing (optional)
4. Verify referral code in shared content

**Expected Results**:
- ✅ Each platform generates correct share URL
- ✅ Messages include referral code and link
- ✅ Character limits respected (Twitter)
- ✅ Professional tone for LinkedIn
- ✅ Engaging format for casual platforms

### Test Case 5.3: QR Code Functionality
**Objective**: Test QR code generation and scanning

**Steps**:
1. Display QR code for referral link
2. Scan with mobile device
3. Verify redirect functionality
4. Test different QR code sizes

**Expected Results**:
- ✅ QR code generates correctly
- ✅ Scanning redirects to correct registration page
- ✅ Referral code preserved in URL
- ✅ QR code remains scannable at different sizes

## 6. URL and Link Testing

### Test Case 6.1: Referral URL Generation
**Objective**: Verify referral URLs generate correctly

**Steps**:
1. Test URL generation with different referral codes
2. Verify URL encoding for special characters
3. Test custom vs auto-generated codes
4. Verify URL structure and parameters

**Expected Results**:
- ✅ URLs follow correct format: `{baseUrl}/register?ref={code}`
- ✅ Special characters properly encoded
- ✅ URLs are valid and accessible
- ✅ Referral parameter preserved

### Test Case 6.2: Deep Linking
**Objective**: Test referral link handling in different contexts

**Test scenarios**:
- Direct browser navigation
- Email link clicks
- Social media link clicks
- Mobile app deep links (if applicable)

**Expected Results**:
- ✅ Links work from all contexts
- ✅ Referral code captured correctly
- ✅ User guided to registration
- ✅ Referral attribution works

## 7. Mobile Responsiveness Testing

### Test Case 7.1: Mobile UI/UX
**Objective**: Verify mobile experience for referrals

**Test on different screen sizes**:
- Small mobile (320px width)
- Large mobile (414px width)
- Tablet (768px width)

**Expected Results**:
- ✅ All elements scale appropriately
- ✅ Touch targets are adequate size
- ✅ Text remains readable
- ✅ Tables/lists scroll horizontally if needed
- ✅ Share buttons easily accessible

### Test Case 7.2: Mobile-Specific Features
**Objective**: Test mobile-specific sharing features

**Steps**:
1. Test native share sheet (if available)
2. Verify WhatsApp direct sharing
3. Test SMS sharing
4. Verify camera QR code scanning

**Expected Results**:
- ✅ Native features integrate properly
- ✅ Fallbacks work when native features unavailable
- ✅ Share content formats correctly for mobile

## 8. Performance Testing

### Test Case 8.1: Load Performance
**Objective**: Verify page load and API response times

**Steps**:
1. Measure initial page load time
2. Time API response for stats/history
3. Test with network throttling
4. Verify pagination performance

**Expected Results**:
- ✅ Initial load < 3 seconds
- ✅ API responses < 2 seconds
- ✅ Reasonable performance on slow networks
- ✅ Smooth pagination without delays

### Test Case 8.2: Data Volume Testing
**Objective**: Test with large datasets

**Steps**:
1. Test with account having 100+ referrals
2. Test withdrawal history with many records
3. Verify pagination with large datasets
4. Test search/filter performance

**Expected Results**:
- ✅ Large datasets don't cause UI lag
- ✅ Pagination remains smooth
- ✅ Search/filter remains responsive
- ✅ Memory usage stays reasonable

## 9. Error State Testing

### Test Case 9.1: Network Error Handling
**Objective**: Test behavior during network issues

**Test scenarios**:
- Complete network offline
- Slow network (simulate 2G)
- Intermittent connectivity
- API server errors (500, 502, 503)

**Expected Results**:
- ✅ Appropriate offline/error messages
- ✅ Retry mechanisms work
- ✅ Graceful degradation
- ✅ No data loss in forms

### Test Case 9.2: Authentication Errors
**Objective**: Test handling of auth-related errors

**Steps**:
1. Test with expired session
2. Test with invalid tokens
3. Test session timeout during operations
4. Verify login redirect functionality

**Expected Results**:
- ✅ Clear session expiry messages
- ✅ Smooth redirect to login
- ✅ Return to intended page after login
- ✅ No data loss during re-auth

## 10. Security Testing

### Test Case 10.1: Data Validation
**Objective**: Verify input validation and sanitization

**Test scenarios**:
- XSS attempts in text fields
- SQL injection attempts
- Invalid data types
- Boundary value testing

**Expected Results**:
- ✅ All inputs properly validated
- ✅ No XSS vulnerabilities
- ✅ Error messages don't expose system info
- ✅ Rate limiting on sensitive operations

### Test Case 10.2: Authentication Security
**Objective**: Test security of referral operations

**Steps**:
1. Verify PIN requirements for withdrawals
2. Test session timeout handling
3. Verify user can only access own data
4. Test CSRF protection

**Expected Results**:
- ✅ PIN required for sensitive operations
- ✅ Sessions timeout appropriately
- ✅ No unauthorized data access
- ✅ CSRF tokens properly validated

## Testing Checklist

### Before Testing
- [ ] Test environment set up and accessible
- [ ] Test accounts created with various states
- [ ] Browser developer tools ready
- [ ] Network throttling tools available
- [ ] Mobile devices/emulators ready

### During Testing
- [ ] Document all bugs with screenshots
- [ ] Note browser/device specific issues
- [ ] Record performance metrics
- [ ] Test happy path and edge cases
- [ ] Verify error message clarity

### After Testing
- [ ] Compile bug report with priorities
- [ ] Document performance benchmarks
- [ ] Note accessibility issues
- [ ] Provide improvement suggestions
- [ ] Verify fixes with retesting

## Success Criteria

The referrals functionality passes QA when:
- ✅ All API endpoints return expected data shapes
- ✅ All user flows complete successfully
- ✅ Error states display helpful messages
- ✅ Mobile experience is fully functional
- ✅ Performance meets acceptable thresholds
- ✅ Security vulnerabilities addressed
- ✅ Accessibility standards met
- ✅ Cross-browser compatibility verified

## Bug Report Template

```
**Bug Title**: [Brief description]
**Priority**: Critical/High/Medium/Low
**Browser**: [Browser and version]
**Device**: [Device type and OS]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**: [What should happen]
**Actual Result**: [What actually happens]

**Screenshots/Videos**: [Attach if applicable]
**Console Errors**: [Any console errors]
**Network Logs**: [Relevant API responses]

**Additional Notes**: [Any other relevant information]
```

This comprehensive QA guide ensures thorough testing of the referrals functionality across all user flows, error states, and edge cases.
