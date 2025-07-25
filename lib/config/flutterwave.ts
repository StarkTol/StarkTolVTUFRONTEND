// Flutterwave configuration
import { FlutterwaveConfig } from 'flutterwave-react-v3'

// Flutterwave public key - get this from your Flutterwave dashboard
export const FLUTTERWAVE_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || ''

// Available payment methods in Flutterwave
export const FLUTTERWAVE_PAYMENT_OPTIONS = [
  'card',
  'banktransfer', 
  'ussd',
  'account',
  'barter',
  'mobilemoney',
  'qr',
  'payattitude'
] as const

// Base Flutterwave configuration
export const getFlutterwaveConfig = (
  amount: number, 
  email: string, 
  phone: string, 
  name: string,
  txRef: string
): FlutterwaveConfig => ({
  public_key: FLUTTERWAVE_PUBLIC_KEY,
  tx_ref: txRef,
  amount: amount,
  currency: 'NGN',
  country: 'NG',
  payment_options: FLUTTERWAVE_PAYMENT_OPTIONS.join(','),
  customer: {
    email: email,
    phone_number: phone,
    name: name,
  },
  customizations: {
    title: 'StarkTol VTU Platform',
    description: 'Fund your wallet',
    logo: '/logo.png', // Add your logo path here
  },
  payment_plan: undefined, // For recurring payments if needed
  subaccounts: [], // For split payments if needed
  meta: {
    source: 'wallet_funding',
    platform: 'web'
  }
})

// Generate unique transaction reference
export const generateTxRef = (): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `starktol_${timestamp}_${random}`
}

// Payment method display names
export const PAYMENT_METHOD_LABELS = {
  card: 'Debit/Credit Card',
  banktransfer: 'Bank Transfer',
  ussd: 'USSD',
  account: 'Bank Account',
  barter: 'Barter',
  mobilemoney: 'Mobile Money',
  qr: 'QR Code',
  payattitude: 'PayAttitude'
} as const

// Payment method icons (you can replace these with actual icon components)
export const PAYMENT_METHOD_ICONS = {
  card: '💳',
  banktransfer: '🏦',
  ussd: '📱',
  account: '🏧',
  barter: '🔄',
  mobilemoney: '📱',
  qr: '📱',
  payattitude: '💰'
} as const
