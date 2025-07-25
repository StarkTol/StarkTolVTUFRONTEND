// Flutterwave Transaction Verification Utility
// This file contains utilities for verifying Flutterwave transactions on the backend

import axios from 'axios'

/**
 * Interface for Flutterwave verification response
 */
export interface FlutterwaveVerificationResponse {
  status: 'successful' | 'failed' | 'pending' | 'error'
  message: string
  data?: {
    id: number
    tx_ref: string
    flw_ref: string
    device_fingerprint: string
    amount: number
    currency: string
    charged_amount: number
    app_fee: number
    merchant_fee: number
    processor_response: string
    auth_model: string
    ip: string
    narration: string
    status: string
    payment_type: string
    created_at: string
    account_id: number
    customer: {
      id: number
      name: string
      phone_number: string
      email: string
      created_at: string
    }
    card?: {
      first_6digits: string
      last_4digits: string
      issuer: string
      country: string
      type: string
      expiry: string
    }
  }
}

/**
 * Verify a Flutterwave transaction using transaction ID
 * This should be called from your backend API
 */
export async function verifyFlutterwaveTransaction(
  transactionId: string | number,
  secretKey: string
): Promise<FlutterwaveVerificationResponse> {
  try {
    console.log('🔍 Verifying Flutterwave transaction:', transactionId)
    
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const { data } = response.data

    if (data && data.status === 'successful') {
      console.log('✅ Flutterwave transaction verified successfully:', data.tx_ref)
      return {
        status: 'successful',
        message: 'Transaction verified successfully',
        data: data
      }
    } else {
      console.log('❌ Flutterwave transaction verification failed:', data?.status)
      return {
        status: 'failed',
        message: `Transaction verification failed: ${data?.processor_response || 'Unknown error'}`
      }
    }
  } catch (error: any) {
    console.error('❌ Flutterwave verification error:', error.message)
    
    if (error.response) {
      console.error('❌ Error response:', error.response.data)
      return {
        status: 'error',
        message: error.response.data?.message || 'Verification request failed'
      }
    }
    
    return {
      status: 'error',
      message: 'Network error during verification'
    }
  }
}

/**
 * Verify transaction using tx_ref (transaction reference)
 * Alternative verification method
 */
export async function verifyFlutterwaveTransactionByRef(
  txRef: string,
  secretKey: string
): Promise<FlutterwaveVerificationResponse> {
  try {
    console.log('🔍 Verifying Flutterwave transaction by ref:', txRef)
    
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`,
      {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const { data } = response.data

    if (data && data.status === 'successful') {
      console.log('✅ Flutterwave transaction verified by ref:', txRef)
      return {
        status: 'successful',
        message: 'Transaction verified successfully',
        data: data
      }
    } else {
      console.log('❌ Flutterwave transaction verification by ref failed:', data?.status)
      return {
        status: 'failed',
        message: `Transaction verification failed: ${data?.processor_response || 'Unknown error'}`
      }
    }
  } catch (error: any) {
    console.error('❌ Flutterwave verification by ref error:', error.message)
    
    if (error.response) {
      console.error('❌ Error response:', error.response.data)
      return {
        status: 'error',
        message: error.response.data?.message || 'Verification request failed'
      }
    }
    
    return {
      status: 'error',
      message: 'Network error during verification'
    }
  }
}

/**
 * Validate webhook signature
 * Use this to verify that webhooks are actually from Flutterwave
 */
export function validateFlutterwaveWebhook(
  payload: string,
  signature: string,
  webhookHash: string
): boolean {
  const crypto = require('crypto')
  
  const expectedSignature = crypto
    .createHmac('sha256', webhookHash)
    .update(payload)
    .digest('hex')
    
  return expectedSignature === signature
}

/**
 * Format amount for Flutterwave (ensure 2 decimal places)
 */
export function formatFlutterwaveAmount(amount: number): number {
  return Math.round(amount * 100) / 100
}

/**
 * Generate unique transaction reference
 */
export function generateTransactionReference(prefix: string = 'starktol'): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `${prefix}_${timestamp}_${random}`
}

/**
 * Example backend implementation for Express.js
 * Copy this to your backend API route handler
 */
export const exampleBackendImplementation = `
// Example Express.js route handler
app.post('/api/wallet/fund', async (req, res) => {
  try {
    const { amount, payment_method, metadata } = req.body
    const userId = req.user.id // Assuming you have auth middleware
    
    if (payment_method === 'flutterwave') {
      // Verify the Flutterwave transaction
      const verification = await verifyFlutterwaveTransaction(
        metadata.transactionId,
        process.env.FLUTTERWAVE_SECRET_KEY
      )
      
      if (verification.status === 'successful') {
        // Verify amount matches
        if (verification.data.amount !== amount) {
          return res.status(400).json({
            success: false,
            message: 'Amount mismatch'
          })
        }
        
        // Verify transaction reference matches
        if (verification.data.tx_ref !== metadata.txRef) {
          return res.status(400).json({
            success: false,
            message: 'Transaction reference mismatch'
          })
        }
        
        // Check if transaction was already processed
        const existingTransaction = await Transaction.findOne({
          reference: metadata.txRef
        })
        
        if (existingTransaction) {
          return res.status(400).json({
            success: false,
            message: 'Transaction already processed'
          })
        }
        
        // Credit user's wallet
        await User.findByIdAndUpdate(userId, {
          $inc: { wallet_balance: amount }
        })
        
        // Create transaction record
        await Transaction.create({
          user_id: userId,
          type: 'credit',
          amount: amount,
          description: 'Wallet funding via Flutterwave',
          reference: metadata.txRef,
          status: 'success',
          payment_method: 'flutterwave',
          metadata: {
            flw_ref: verification.data.flw_ref,
            payment_type: verification.data.payment_type,
            customer_email: verification.data.customer.email
          }
        })
        
        res.json({
          success: true,
          message: 'Wallet funded successfully',
          data: {
            transactionId: verification.data.id,
            reference: metadata.txRef,
            status: 'success'
          }
        })
      } else {
        res.status(400).json({
          success: false,
          message: verification.message
        })
      }
    } else {
      // Handle other payment methods...
    }
  } catch (error) {
    console.error('Wallet funding error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Webhook handler
app.post('/api/webhooks/flutterwave', (req, res) => {
  const signature = req.headers['verif-hash']
  const payload = JSON.stringify(req.body)
  
  if (!validateFlutterwaveWebhook(payload, signature, process.env.FLUTTERWAVE_WEBHOOK_HASH)) {
    return res.status(401).json({ message: 'Invalid signature' })
  }
  
  const { event, data } = req.body
  
  if (event === 'charge.completed' && data.status === 'successful') {
    // Process the completed charge
    // Update transaction status, send notifications, etc.
  }
  
  res.status(200).json({ status: 'ok' })
})
`
