// Test data and mock utilities for development
// Use this for testing the Flutterwave integration before backend is ready

/**
 * Mock user data for testing
 */
export const mockUserData = {
  id: "test-user-001",
  email: "test@starktol.com",
  name: "Test User",
  phone: "+2348123456789",
  full_name: "Test User StarkTol",
  wallet_balance: 5000,
  total_spent: 15000,
  referral_bonus: 500,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-15T12:00:00.000Z"
}

/**
 * Mock wallet balance for testing
 */
export const mockWalletBalance = {
  balance: 5000,
  currency: "NGN",
  formatted: "₦5,000",
  accountNumber: "1234567890",
  accountName: "StarkTol VTU Test Account",
  bankName: "StarkTol Bank"
}

/**
 * Mock successful wallet funding response
 */
export const mockSuccessfulFundingResponse = {
  success: true,
  message: "Wallet funded successfully",
  data: {
    transactionId: "test_tx_" + Date.now(),
    reference: "starktol_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    status: "success" as const,
    flutterwaveRef: "flw_ref_" + Date.now(),
    txRef: "tx_ref_" + Date.now()
  }
}

/**
 * Test Flutterwave configuration (using test public key)
 */
export const testFlutterwaveConfig = {
  public_key: "FLWPUBK_TEST-SANDBOX-TEST-KEY-REPLACE-WITH-ACTUAL-KEY",
  currency: "NGN",
  country: "NG",
  payment_options: "card,banktransfer,ussd,account,mobilemoney",
  customizations: {
    title: "StarkTol VTU Platform - Test Mode",
    description: "Test wallet funding",
    logo: "/logo.png"
  }
}

/**
 * Mock Flutterwave payment response for testing
 */
export const mockFlutterwaveResponse = {
  status: "successful",
  transaction_id: 1234567,
  tx_ref: "starktol_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
  flw_ref: "flw_" + Date.now(),
  device_fingerprint: "test_device_fingerprint",
  amount: 1000,
  currency: "NGN",
  charged_amount: 1000,
  app_fee: 14,
  merchant_fee: 0,
  processor_response: "Approved",
  auth_model: "PIN",
  ip: "127.0.0.1",
  narration: "Test payment",
  payment_type: "card",
  created_at: new Date().toISOString(),
  account_id: 12345,
  customer: {
    id: 67890,
    name: "Test User",
    phone_number: "+2348123456789",
    email: "test@starktol.com",
    created_at: new Date().toISOString()
  },
  card: {
    first_6digits: "418742",
    last_4digits: "4246",
    issuer: "VISA",
    country: "NG",
    type: "DEBIT",
    expiry: "12/26"
  }
}

/**
 * Development mode checker
 */
export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_ENV === 'development' ||
         !process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ||
         process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY.includes('TEST')
}

/**
 * Mock API responses for development
 */
export const mockAPIResponses = {
  walletBalance: () => Promise.resolve({
    data: {
      data: mockWalletBalance
    }
  }),
  
  walletFunding: (request: any) => {
    console.log('🧪 Mock wallet funding request:', request)
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        if (request.payment_method === 'flutterwave') {
          resolve({
            data: mockSuccessfulFundingResponse
          })
        } else {
          resolve({
            data: {
              success: true,
              message: `Wallet funding via ${request.payment_method} processed`,
              data: {
                transactionId: "mock_tx_" + Date.now(),
                reference: "mock_ref_" + Date.now(),
                status: "success"
              }
            }
          })
        }
      }, 1500) // Simulate 1.5 second delay
    })
  },
  
  userProfile: () => Promise.resolve({
    data: {
      data: mockUserData
    }
  })
}

/**
 * Console logger for test mode
 */
export const testLogger = {
  log: (message: string, data?: any) => {
    if (isDevelopmentMode()) {
      console.log(`🧪 [TEST MODE] ${message}`, data || '')
    }
  },
  
  error: (message: string, error?: any) => {
    if (isDevelopmentMode()) {
      console.error(`🧪 [TEST MODE ERROR] ${message}`, error || '')
    }
  },
  
  success: (message: string, data?: any) => {
    if (isDevelopmentMode()) {
      console.log(`🧪 [TEST MODE SUCCESS] ✅ ${message}`, data || '')
    }
  }
}

/**
 * Test card numbers for Flutterwave sandbox
 */
export const testCards = {
  successful: {
    number: "4187427415564246",
    cvv: "828",
    expiry: "09/32",
    pin: "3310"
  },
  insufficientFunds: {
    number: "4187427415564246", 
    cvv: "828",
    expiry: "09/32",
    pin: "3310",
    note: "Use amount > 10000 for insufficient funds error"
  },
  failed: {
    number: "4000000000000119",
    cvv: "828", 
    expiry: "09/32",
    pin: "3310"
  }
}

/**
 * Helper to simulate network delay in development
 */
export const simulateNetworkDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
