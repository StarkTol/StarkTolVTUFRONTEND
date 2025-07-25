/**
 * Referrals Utility Helpers
 * 
 * Contains utility functions for referral-related operations including
 * URL generation, social sharing, formatting, and validation.
 */

import type { ReferralStats, ReferralRecord, WithdrawalRecord } from '../api/types'

// ===== URL Generation Utilities =====

/**
 * Generate a referral URL with the given code
 */
export function generateReferralUrl(referralCode: string, baseUrl?: string): string {
  if (!referralCode?.trim()) {
    return ''
  }
  
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://app.starktol.com')
  return `${base}/register?ref=${encodeURIComponent(referralCode.trim())}`
}

/**
 * Extract referral code from URL
 */
export function extractReferralCodeFromUrl(url: string): string | null {
  try {
    const urlObject = new URL(url)
    return urlObject.searchParams.get('ref')
  } catch {
    return null
  }
}

/**
 * Generate QR code URL for referral link
 */
export function generateQRCodeUrl(referralUrl: string, size: number = 200): string {
  if (!referralUrl?.trim()) {
    return ''
  }
  
  const encodedUrl = encodeURIComponent(referralUrl)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}`
}

// ===== Social Sharing Utilities =====

interface SocialShareOptions {
  referralUrl: string
  referralCode: string
  customMessage?: string
}

/**
 * Generate social sharing URLs for different platforms
 */
export const socialShare = {
  /**
   * Generate Twitter/X share URL
   */
  twitter: ({ referralUrl, referralCode, customMessage }: SocialShareOptions): string => {
    const message = customMessage || `Join me on StarkTol VTU Platform and enjoy seamless airtime, data, and bill payments! Use my referral code: ${referralCode}`
    const text = encodeURIComponent(`${message} ${referralUrl}`)
    return `https://twitter.com/intent/tweet?text=${text}`
  },

  /**
   * Generate Facebook share URL
   */
  facebook: ({ referralUrl }: SocialShareOptions): string => {
    const url = encodeURIComponent(referralUrl)
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`
  },

  /**
   * Generate WhatsApp share URL
   */
  whatsapp: ({ referralUrl, referralCode, customMessage }: SocialShareOptions): string => {
    const message = customMessage || `🚀 Join me on StarkTol VTU Platform! \n\n✅ Fast airtime & data purchases\n✅ Bill payments made easy\n✅ Earn from referrals\n\nUse my code: *${referralCode}*\n${referralUrl}`
    const text = encodeURIComponent(message)
    return `https://wa.me/?text=${text}`
  },

  /**
   * Generate Telegram share URL
   */
  telegram: ({ referralUrl, referralCode, customMessage }: SocialShareOptions): string => {
    const message = customMessage || `Join me on StarkTol VTU Platform! Use referral code: ${referralCode} ${referralUrl}`
    const text = encodeURIComponent(message)
    return `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${text}`
  },

  /**
   * Generate LinkedIn share URL
   */
  linkedin: ({ referralUrl }: SocialShareOptions): string => {
    const url = encodeURIComponent(referralUrl)
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
  }
}

/**
 * Copy referral link to clipboard
 */
export async function copyReferralLink(referralUrl: string): Promise<boolean> {
  if (!referralUrl?.trim()) {
    return false
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(referralUrl)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = referralUrl
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy referral link:', error)
    return false
  }
}

// ===== Formatting Utilities =====

/**
 * Format currency amounts with Nigerian Naira symbol
 */
export function formatCurrency(amount: number, options: Intl.NumberFormatOptions = {}): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₦0.00'
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(amount)
}

/**
 * Format percentage with proper symbol
 */
export function formatPercentage(value: number, decimalPlaces: number = 1): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%'
  }

  return `${(value * 100).toFixed(decimalPlaces)}%`
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatLargeNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0'
  }

  const abs = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  if (abs >= 1e9) {
    return `${sign}${(abs / 1e9).toFixed(1)}B`
  } else if (abs >= 1e6) {
    return `${sign}${(abs / 1e6).toFixed(1)}M`
  } else if (abs >= 1e3) {
    return `${sign}${(abs / 1e3).toFixed(1)}K`
  }

  return `${sign}${abs.toString()}`
}

/**
 * Format date in relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const now = new Date()
    const targetDate = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(targetDate.getTime())) {
      return 'Invalid date'
    }

    const diffMs = targetDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.ceil(diffMs / (1000 * 60))

    if (Math.abs(diffDays) >= 1) {
      return diffDays > 0 ? `in ${diffDays} day${diffDays === 1 ? '' : 's'}` : `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`
    } else if (Math.abs(diffHours) >= 1) {
      return diffHours > 0 ? `in ${diffHours} hour${diffHours === 1 ? '' : 's'}` : `${Math.abs(diffHours)} hour${Math.abs(diffHours) === 1 ? '' : 's'} ago`
    } else if (Math.abs(diffMinutes) >= 1) {
      return diffMinutes > 0 ? `in ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}` : `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) === 1 ? '' : 's'} ago`
    } else {
      return 'just now'
    }
  } catch {
    return 'Invalid date'
  }
}

// ===== Status and Badge Utilities =====

/**
 * Get status badge configuration for referral status
 */
export function getReferralStatusBadge(status: ReferralRecord['status']) {
  const badges = {
    active: {
      label: 'Active',
      variant: 'success' as const,
      color: 'green'
    },
    pending: {
      label: 'Pending',
      variant: 'warning' as const,
      color: 'yellow'
    },
    inactive: {
      label: 'Inactive',
      variant: 'secondary' as const,
      color: 'gray'
    }
  }

  return badges[status] || badges.inactive
}

/**
 * Get status badge configuration for withdrawal status
 */
export function getWithdrawalStatusBadge(status: WithdrawalRecord['status']) {
  const badges = {
    pending: {
      label: 'Pending',
      variant: 'warning' as const,
      color: 'yellow'
    },
    processing: {
      label: 'Processing',
      variant: 'info' as const,
      color: 'blue'
    },
    completed: {
      label: 'Completed',
      variant: 'success' as const,
      color: 'green'
    },
    failed: {
      label: 'Failed',
      variant: 'destructive' as const,
      color: 'red'
    },
    cancelled: {
      label: 'Cancelled',
      variant: 'secondary' as const,
      color: 'gray'
    }
  }

  return badges[status] || badges.pending
}

// ===== Calculation Utilities =====

/**
 * Calculate referral performance metrics
 */
export function calculateReferralMetrics(stats: ReferralStats) {
  const averageEarningsPerReferral = stats.totalReferrals > 0 
    ? stats.totalEarnings / stats.totalReferrals 
    : 0

  const monthlyGrowthRate = stats.totalReferrals > 0 
    ? stats.thisMonthReferrals / stats.totalReferrals 
    : 0

  const activeReferralRate = stats.totalReferrals > 0 
    ? stats.activeReferrals / stats.totalReferrals 
    : 0

  return {
    averageEarningsPerReferral,
    monthlyGrowthRate,
    activeReferralRate,
    formattedAverageEarnings: formatCurrency(averageEarningsPerReferral),
    formattedGrowthRate: formatPercentage(monthlyGrowthRate),
    formattedActiveRate: formatPercentage(activeReferralRate)
  }
}

/**
 * Calculate withdrawal fees and net amount
 */
export function calculateWithdrawalAmount(grossAmount: number, feePercentage: number = 0.01, minimumFee: number = 100) {
  if (typeof grossAmount !== 'number' || isNaN(grossAmount) || grossAmount <= 0) {
    return {
      grossAmount: 0,
      fee: 0,
      netAmount: 0,
      formattedGross: formatCurrency(0),
      formattedFee: formatCurrency(0),
      formattedNet: formatCurrency(0)
    }
  }

  const percentageFee = grossAmount * feePercentage
  const fee = Math.max(percentageFee, minimumFee)
  const netAmount = Math.max(0, grossAmount - fee)

  return {
    grossAmount,
    fee,
    netAmount,
    formattedGross: formatCurrency(grossAmount),
    formattedFee: formatCurrency(fee),
    formattedNet: formatCurrency(netAmount)
  }
}

// ===== Validation Utilities =====

/**
 * Validate referral code format
 */
export function validateReferralCode(code: string): { isValid: boolean; error?: string } {
  if (!code?.trim()) {
    return { isValid: false, error: 'Referral code is required' }
  }

  const trimmedCode = code.trim()

  if (trimmedCode.length < 3) {
    return { isValid: false, error: 'Referral code must be at least 3 characters' }
  }

  if (trimmedCode.length > 20) {
    return { isValid: false, error: 'Referral code must be less than 20 characters' }
  }

  if (!/^[A-Za-z0-9]+$/.test(trimmedCode)) {
    return { isValid: false, error: 'Referral code can only contain letters and numbers' }
  }

  return { isValid: true }
}

/**
 * Validate withdrawal amount
 */
export function validateWithdrawalAmount(
  amount: number, 
  availableBalance: number, 
  minimumWithdrawal: number = 1000
): { isValid: boolean; error?: string } {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { isValid: false, error: 'Invalid amount' }
  }

  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than zero' }
  }

  if (amount < minimumWithdrawal) {
    return { isValid: false, error: `Minimum withdrawal amount is ${formatCurrency(minimumWithdrawal)}` }
  }

  if (amount > availableBalance) {
    return { isValid: false, error: 'Insufficient balance' }
  }

  return { isValid: true }
}

// ===== Export all utilities =====

export const referralUtils = {
  // URL utilities
  generateReferralUrl,
  extractReferralCodeFromUrl,
  generateQRCodeUrl,
  
  // Social sharing
  socialShare,
  copyReferralLink,
  
  // Formatting
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatRelativeTime,
  
  // Status badges
  getReferralStatusBadge,
  getWithdrawalStatusBadge,
  
  // Calculations
  calculateReferralMetrics,
  calculateWithdrawalAmount,
  
  // Validation
  validateReferralCode,
  validateWithdrawalAmount
}

export default referralUtils
