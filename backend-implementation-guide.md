# Backend Implementation Guide: StarkTol VTU Flutterwave Integration

## Overview
This guide provides detailed instructions for implementing the Flutterwave wallet funding system using Express.js and Supabase.

## Environment Variables
Add these to your `.env` file:

```bash
# Flutterwave Configuration
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_ENCRYPTION_KEY=your_flutterwave_encryption_key

# Webhook Configuration
FLW_WEBHOOK_SECRET=your_webhook_secret_hash

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3000

# Supabase Configuration (if not already set)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## Dependencies Installation

```bash
npm install flutterwave-node-v3 crypto @supabase/supabase-js
```

## Database Schema (Supabase)

### Wallets Table
```sql
CREATE TABLE wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(15,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'NGN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own wallet" ON wallets FOR UPDATE USING (user_id = auth.uid());
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed')),
  reference VARCHAR(100) UNIQUE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS  
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());
```

### Payment Logs Table
```sql
CREATE TABLE payment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tx_ref VARCHAR(100) NOT NULL,
  flw_ref VARCHAR(100),
  amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_data JSONB DEFAULT '{}',
  webhook_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;
```

## Backend Implementation

### 1. Flutterwave Service (`services/flutterwaveService.js`)

```javascript
const Flutterwave = require('flutterwave-node-v3');
const crypto = require('crypto');

class FlutterwaveService {
  constructor() {
    this.flw = new Flutterwave(
      process.env.FLW_PUBLIC_KEY,
      process.env.FLW_SECRET_KEY
    );
  }

  // Generate transaction reference
  generateTxRef(userId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `starktol_${userId}_${timestamp}_${random}`;
  }

  // Create payment link
  async createPaymentLink(amount, userId, userEmail, userName, userPhone) {
    try {
      const txRef = this.generateTxRef(userId);
      
      const payload = {
        tx_ref: txRef,
        amount: parseFloat(amount),
        currency: 'NGN',
        redirect_url: `${process.env.FRONTEND_URL}/dashboard/wallet/fund/success`,
        payment_options: 'card,banktransfer,ussd,account,mobilemoney',
        customer: {
          email: userEmail,
          phone_number: userPhone || '',
          name: userName || 'Customer'
        },
        customizations: {
          title: 'StarkTol VTU - Wallet Funding',
          description: 'Fund your wallet securely',
          logo: `${process.env.FRONTEND_URL}/logo.png`
        },
        meta: {
          source: 'wallet_funding',
          platform: 'web',
          user_id: userId
        }
      };

      console.log('🚀 Creating payment link:', payload);

      const response = await this.flw.Charge.card(payload);
      
      if (response.status === 'success') {
        return {
          success: true,
          paymentLink: response.data.link,
          txRef: txRef,
          data: response.data
        };
      } else {
        throw new Error(response.message || 'Failed to create payment link');
      }
    } catch (error) {
      console.error('❌ Flutterwave payment creation failed:', error);
      throw error;
    }
  }

  // Verify payment
  async verifyPayment(txRef) {
    try {
      console.log('🔍 Verifying payment:', txRef);

      const response = await this.flw.Transaction.verify({ id: txRef });
      
      if (response.status === 'success' && response.data) {
        return {
          success: true,
          status: response.data.status,
          amount: response.data.amount,
          currency: response.data.currency,
          flwRef: response.data.flw_ref,
          chargedAmount: response.data.charged_amount,
          data: response.data
        };
      } else {
        return {
          success: false,
          status: 'failed',
          message: response.message || 'Verification failed'
        };
      }
    } catch (error) {
      console.error('❌ Payment verification failed:', error);
      return {
        success: false,
        status: 'failed',
        message: error.message || 'Verification failed'
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    const hash = crypto
      .createHmac('sha256', process.env.FLW_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return hash === signature;
  }
}

module.exports = new FlutterwaveService();
```

### 2. Wallet Service (`services/walletService.js`)

```javascript
const { supabase } = require('../config/supabase');

class WalletService {
  // Get or create wallet for user
  async getOrCreateWallet(userId) {
    try {
      // Check if wallet exists
      const { data: wallet, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Create wallet if doesn't exist
      if (!wallet) {
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert([{
            user_id: userId,
            balance: 0.00,
            currency: 'NGN'
          }])
          .select()
          .single();

        if (createError) throw createError;
        return newWallet;
      }

      return wallet;
    } catch (error) {
      console.error('❌ Error getting/creating wallet:', error);
      throw error;
    }
  }

  // Credit wallet
  async creditWallet(userId, amount, txRef, description = 'Wallet funding') {
    try {
      // Start transaction
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (walletError) throw walletError;

      // Create transaction record
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert([{
          user_id: userId,
          type: 'credit',
          amount: parseFloat(amount),
          description: description,
          status: 'successful',
          reference: txRef,
          metadata: {
            payment_method: 'flutterwave',
            transaction_ref: txRef
          }
        }])
        .select()
        .single();

      if (txError) throw txError;

      console.log('✅ Wallet credited successfully:', {
        userId,
        amount,
        newBalance,
        txRef
      });

      return {
        success: true,
        newBalance: newBalance,
        transaction: transaction
      };
    } catch (error) {
      console.error('❌ Error crediting wallet:', error);
      throw error;
    }
  }

  // Get wallet balance
  async getBalance(userId) {
    try {
      const wallet = await this.getOrCreateWallet(userId);
      return {
        balance: parseFloat(wallet.balance),
        currency: wallet.currency
      };
    } catch (error) {
      console.error('❌ Error getting balance:', error);
      throw error;
    }
  }
}

module.exports = new WalletService();
```

### 3. Payment Routes (`routes/payment.js`)

```javascript
const express = require('express');
const router = express.Router();
const flutterwaveService = require('../services/flutterwaveService');
const walletService = require('../services/walletService');
const { supabase } = require('../config/supabase');
const auth = require('../middleware/auth'); // Your auth middleware

// POST /api/v1/payment/initiate
router.post('/initiate', auth, async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const user = req.user; // From auth middleware

    // Validate input
    if (!amount || !userId || parseFloat(amount) < 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Minimum is ₦100'
      });
    }

    // Ensure wallet exists
    await walletService.getOrCreateWallet(userId);

    // Create payment link
    const paymentResult = await flutterwaveService.createPaymentLink(
      amount,
      userId,
      user.email,
      user.full_name || user.first_name,
      user.phone
    );

    // Log payment initiation
    await supabase.from('payment_logs').insert([{
      user_id: userId,
      tx_ref: paymentResult.txRef,
      amount: parseFloat(amount),
      status: 'pending',
      payment_data: paymentResult.data
    }]);

    res.json({
      success: true,
      paymentLink: paymentResult.paymentLink,
      txRef: paymentResult.txRef
    });

  } catch (error) {
    console.error('❌ Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate payment'
    });
  }
});

// POST /api/v1/payment/webhook
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['verif-hash'];
    const payload = req.body;

    console.log('🔔 Webhook received:', payload);

    // Verify webhook signature
    if (!flutterwaveService.verifyWebhookSignature(payload, signature)) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    if (payload.event === 'charge.completed' && payload.data) {
      const { data } = payload;
      
      // Only process successful payments
      if (data.status === 'successful') {
        // Find payment log
        const { data: paymentLog } = await supabase
          .from('payment_logs')
          .select('*')
          .eq('tx_ref', data.tx_ref)
          .single();

        if (!paymentLog) {
          console.error('❌ Payment log not found:', data.tx_ref);
          return res.status(404).json({ message: 'Payment not found' });
        }

        // Prevent duplicate processing
        if (paymentLog.status === 'successful') {
          console.log('⚠️ Payment already processed:', data.tx_ref);
          return res.json({ status: 'success', message: 'Already processed' });
        }

        // Credit wallet
        await walletService.creditWallet(
          paymentLog.user_id,
          data.amount,
          data.tx_ref,
          `Wallet funding via ${data.payment_type}`
        );

        // Update payment log
        await supabase
          .from('payment_logs')
          .update({
            status: 'successful',
            flw_ref: data.flw_ref,
            webhook_data: payload,
            updated_at: new Date().toISOString()
          })
          .eq('tx_ref', data.tx_ref);

        console.log('✅ Webhook processed successfully:', data.tx_ref);
      }
    }

    res.json({ status: 'success', message: 'Webhook processed' });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Webhook processing failed'
    });
  }
});

// POST /api/v1/payment/verify
router.post('/verify', auth, async (req, res) => {
  try {
    const { tx_ref } = req.body;

    if (!tx_ref) {
      return res.status(400).json({
        success: false,
        message: 'Transaction reference is required'
      });
    }

    // Check payment log first
    const { data: paymentLog } = await supabase
      .from('payment_logs')
      .select('*')
      .eq('tx_ref', tx_ref)
      .single();

    if (!paymentLog) {
      return res.status(404).json({
        success: false,
        status: 'failed',
        message: 'Payment not found'
      });
    }

    // If already successful, return immediately
    if (paymentLog.status === 'successful') {
      return res.json({
        success: true,
        status: 'successful',
        amount: paymentLog.amount,
        message: 'Payment verified successfully'
      });
    }

    // Verify with Flutterwave
    const verification = await flutterwaveService.verifyPayment(tx_ref);

    if (verification.success && verification.status === 'successful') {
      // Credit wallet if not already done
      await walletService.creditWallet(
        paymentLog.user_id,
        verification.amount,
        tx_ref,
        'Wallet funding (verified)'
      );

      // Update payment log
      await supabase
        .from('payment_logs')
        .update({
          status: 'successful',
          flw_ref: verification.flwRef,
          updated_at: new Date().toISOString()
        })
        .eq('tx_ref', tx_ref);
    }

    res.json({
      success: verification.success,
      status: verification.status,
      amount: verification.amount,
      message: verification.message || 'Payment verification completed'
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      status: 'failed',
      message: 'Verification failed'
    });
  }
});

module.exports = router;
```

### 4. Wallet Routes (`routes/wallet.js`)

```javascript
const express = require('express');
const router = express.Router();
const walletService = require('../services/walletService');
const auth = require('../middleware/auth');

// GET /api/v1/wallet/balance
router.get('/balance', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const balance = await walletService.getBalance(userId);
    
    res.json({
      success: true,
      balance: balance.balance,
      currency: balance.currency
    });
  } catch (error) {
    console.error('❌ Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet balance'
    });
  }
});

module.exports = router;
```

### 5. Main App Configuration (`app.js`)

```javascript
const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');
const walletRoutes = require('./routes/wallet');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/wallet', walletRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
```

### 6. Supabase Configuration (`config/supabase.js`)

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = { supabase };
```

## Security Considerations

1. **Webhook Security**: Always verify webhook signatures
2. **Duplicate Prevention**: Check payment logs before processing
3. **Amount Validation**: Validate amounts on both frontend and backend
4. **Rate Limiting**: Implement rate limiting on payment endpoints
5. **Logging**: Log all payment activities for debugging

## Testing

### Test Flutterwave Integration
```javascript
// Test payment creation
const testPayment = async () => {
  try {
    const result = await flutterwaveService.createPaymentLink(
      1000,
      'test-user-id',
      'test@example.com',
      'Test User',
      '+2348123456789'
    );
    console.log('Payment Link:', result.paymentLink);
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testPayment();
```

### Webhook Testing
Use ngrok to expose your local server for webhook testing:
```bash
ngrok http 5000
```

Then update your Flutterwave webhook URL to: `https://your-ngrok-url.ngrok.io/api/v1/payment/webhook`

## Deployment Notes

1. **Environment Variables**: Ensure all environment variables are set in production
2. **HTTPS**: Webhook endpoints must use HTTPS in production
3. **Database Backups**: Set up automated database backups
4. **Monitoring**: Implement payment monitoring and alerts
5. **Error Reporting**: Use services like Sentry for error tracking

## Frontend Integration

The frontend code is already implemented and expects these exact endpoint formats:
- `POST /api/v1/payment/initiate` - Returns `{paymentLink, txRef}`
- `GET /api/v1/wallet/balance` - Returns `{balance, currency}`
- `POST /api/v1/payment/verify` - Returns `{status, amount, message}`

The webhook will automatically update wallet balances and trigger real-time updates via Supabase.

## Real-time Updates

The frontend uses Supabase real-time subscriptions to listen for wallet and transaction updates. Ensure your Supabase project has real-time enabled for the `wallets` and `transactions` tables.

This completes the full backend implementation for the StarkTol VTU Flutterwave integration.
