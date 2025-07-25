# Flutterwave Integration Setup Guide

This guide will help you set up Flutterwave payment integration for your VTU platform.

## 🚀 Quick Setup

### 1. Get Your Flutterwave API Keys

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Login or create an account
3. Navigate to **Settings** → **API Keys**
4. Copy your **Public Key** and **Secret Key**

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Flutterwave keys to `.env.local`:
   ```env
   NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-your-actual-public-key-here
   FLUTTERWAVE_SECRET_KEY=FLWSECK-your-actual-secret-key-here
   ```

### 3. Update Your Backend API

Your backend needs to handle Flutterwave verification. Update your wallet service to handle the `'flutterwave'` method:

```typescript
// In your backend API endpoint for wallet funding
if (method === 'flutterwave') {
  // Verify the transaction with Flutterwave
  const verification = await verifyFlutterwaveTransaction(
    metadata.flwRef, 
    metadata.txRef
  )
  
  if (verification.status === 'successful') {
    // Credit user's wallet
    // Save transaction record
    // Return success response
  }
}
```

### 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/dashboard/wallet/fund`
3. Select "Flutterwave" as payment method
4. Enter an amount (minimum ₦100)
5. Click the payment button to test

## 🎯 Features Available

### Payment Methods
The Flutterwave integration supports all these payment methods:
- 💳 **Cards** - Visa, Mastercard, Verve
- 🏦 **Bank Transfer** - Direct bank transfers
- 📱 **USSD** - All major Nigerian banks
- 🏧 **Bank Account** - Pay directly from bank account
- 📱 **Mobile Money** - Mobile money payments
- 🔄 **Barter** - Flutterwave's virtual cards
- 📱 **QR Code** - QR code payments

### Security Features
- ✅ Transaction verification with Flutterwave
- ✅ Secure API key management
- ✅ Real-time payment status updates
- ✅ Error handling and user feedback
- ✅ Transaction reference tracking

## 🔧 Backend Implementation Guide

### Verify Flutterwave Transaction

Create this function in your backend:

```javascript
const axios = require('axios')

async function verifyFlutterwaveTransaction(transactionId, txRef) {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
        }
      }
    )
    
    const { data } = response.data
    
    if (data.status === 'successful' && data.tx_ref === txRef) {
      return {
        status: 'successful',
        amount: data.amount,
        currency: data.currency,
        customer: data.customer,
        reference: data.tx_ref
      }
    }
    
    return { status: 'failed', message: 'Transaction verification failed' }
  } catch (error) {
    console.error('Flutterwave verification error:', error)
    return { status: 'error', message: 'Verification failed' }
  }
}
```

### Webhook Setup (Optional but Recommended)

Set up webhooks for real-time payment notifications:

1. In Flutterwave Dashboard → **Settings** → **Webhooks**
2. Add your webhook URL: `https://yourdomain.com/api/webhooks/flutterwave`
3. Select events: `charge.completed`

## 🛠️ Customization Options

### Payment Methods Configuration

You can customize which payment methods to show by editing:
```typescript
// lib/config/flutterwave.ts
export const FLUTTERWAVE_PAYMENT_OPTIONS = [
  'card',           // Remove if you don't want card payments
  'banktransfer',   // Remove if you don't want bank transfers
  'ussd',           // Remove if you don't want USSD
  // ... other options
]
```

### Styling and Branding

Update the Flutterwave configuration in `lib/config/flutterwave.ts`:
```typescript
customizations: {
  title: 'Your VTU Platform Name',
  description: 'Fund your wallet',
  logo: '/your-logo.png',
}
```

## 🚨 Important Security Notes

1. **Never expose your Secret Key** - Only use it on the backend
2. **Always verify transactions** - Don't trust frontend responses alone
3. **Use HTTPS in production** - Flutterwave requires secure connections
4. **Set up webhooks** - For reliable payment notifications
5. **Test thoroughly** - Use test keys before going live

## 📝 Testing

### Test Cards (Sandbox Mode)
- **Successful Payment**: 4187427415564246
- **Insufficient Funds**: 4187427415564246 (amount > 10000)
- **Failed Payment**: 4000000000000119

### Test Bank Accounts
- **GTBank**: 0690000031
- **Access Bank**: 0690000032

## 🆘 Troubleshooting

### Common Issues

1. **"Public key is required"**
   - Check your `.env.local` file
   - Ensure `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` is set

2. **"Payment verification failed"**
   - Check your backend verification implementation
   - Ensure secret key is correct

3. **"User information incomplete"**
   - User must have email and name in their profile
   - Update user context to include required fields

4. **Payment modal not opening**
   - Check browser console for errors
   - Ensure all required fields are filled

### Getting Help

- 📚 [Flutterwave Documentation](https://developer.flutterwave.com/docs)
- 💬 [Flutterwave Support](https://support.flutterwave.com)
- 🐛 Check browser console for error messages

## 🎉 You're All Set!

Your Flutterwave integration is now ready! Users can fund their wallets using multiple payment methods with a seamless checkout experience.

Remember to:
- Test thoroughly before going live
- Switch to live API keys in production
- Monitor transactions in your Flutterwave dashboard
- Set up proper error logging and monitoring
