# Registration Form Testing

This directory contains Cypress E2E tests for the registration form functionality.

## What's Been Implemented

### 1. Registration Form Fixes
- ✅ **Fixed payload structure**: Changed from `full_name` to `first_name` and `last_name` to match backend expectations
- ✅ **Enhanced error handling**: Better handling of 409/422 status codes with specific error messages
- ✅ **Added password confirmation**: Added confirm password field and validation
- ✅ **Real-time email checking**: Added debounced email availability check with `/auth/check-email` endpoint
- ✅ **Improved validation**: Better client-side validation with specific error messages

### 2. Registration Form Fields
The form now includes:
- First Name (required)
- Last Name (required) 
- Email (required, with real-time availability check)
- Phone (required, Nigerian format validation)
- Password (required, minimum 6 characters)
- Confirm Password (required, must match password)
- Terms & Conditions checkbox (required)

### 3. API Payload Structure
The registration now sends:
```json
{
  "first_name": "John",
  "last_name": "Doe", 
  "email": "john.doe@example.com",
  "phone_number": "08012345678",
  "password": "securepassword",
  "confirm_password": "securepassword"
}
```

### 4. Error Handling
- **409 Conflict**: "A user with this email already exists. Please use a different email."
- **422 Unprocessable Entity**: Detailed validation error messages
- **400 Bad Request**: "Invalid registration data. Please check your inputs."
- **500+ Server Errors**: "Server error. Please try again later."
- **Network Errors**: "Network error. Please check your internet connection and try again."

### 5. Email Check Feature
- Debounced API calls (800ms delay)
- Real-time feedback with loading spinner
- Green success message: "✓ Email is available"
- Red error message: "This email is already registered. Please use a different email."

## Test Files

### `registration.cy.ts`
Main registration flow tests:
- Successful registration → redirect to login
- User already exists error handling
- Client-side validation errors

### `email-check.cy.ts`
Email availability check tests:
- Loading spinner display
- Available email confirmation
- Taken email error message
- Invalid email format handling
- Debounce functionality

## Running Tests

### Prerequisites
First install Cypress (if not already installed):
```bash
npm install --save-dev cypress start-server-and-test
```

### Run Tests

1. **Open Cypress Test Runner (Interactive)**:
   ```bash
   npm run e2e:dev
   ```
   This starts the dev server and opens Cypress UI

2. **Run Tests in Headless Mode**:
   ```bash
   npm run e2e:headless
   ```
   This runs all tests in the background

3. **Manual Cypress Commands**:
   ```bash
   # Start dev server first
   npm run dev
   
   # In another terminal, run Cypress
   npm run cypress:open  # Interactive mode
   npm run cypress:run   # Headless mode
   ```

## Test Data

The tests use fixtures in `cypress/fixtures/users.json`:
- `validUser`: Complete valid user data
- `existingUser`: User data for testing "already exists" scenarios
- `invalidUsers`: Various invalid data combinations for validation testing

## Custom Commands

### `fillRegistrationForm(userdata)`
Fills out the entire registration form with provided user data.

### API Mocking Commands
- `mockRegisterSuccess()`: Mocks successful registration
- `mockRegisterUserExists()`: Mocks 409 user exists error
- `mockEmailCheckAvailable()`: Mocks email availability check (available)
- `mockEmailCheckTaken()`: Mocks email availability check (taken)

## Test ID Strategy

All form elements have `data-testid` attributes for reliable testing:
- `first_name`
- `last_name` 
- `email`
- `phone`
- `password`
- `confirm_password`
- `agree-terms`
- `submit-registration`

## Success Criteria

✅ **Registration Flow**: New user can register successfully and gets redirected to `/login`

✅ **Error Handling**: 409/422 errors are displayed inline with helpful messages

✅ **Email Check**: Real-time email availability check with debouncing

✅ **Validation**: Client-side validation prevents invalid submissions

✅ **Test Coverage**: Comprehensive E2E tests cover happy path and error scenarios
