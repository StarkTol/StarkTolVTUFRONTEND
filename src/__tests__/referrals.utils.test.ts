/**
 * Unit Tests for Referrals Utility Helpers
 * 
 * Tests all utility functions for URL generation, social sharing,
 * formatting, validation, and calculations.
 */

import {
  generateReferralUrl,
  extractReferralCodeFromUrl,
  generateQRCodeUrl,
  socialShare,
  copyReferralLink,
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatRelativeTime,
  getReferralStatusBadge,
  getWithdrawalStatusBadge,
  calculateReferralMetrics,
  calculateWithdrawalAmount,
  validateReferralCode,
  validateWithdrawalAmount,
  referralUtils
} from '../utils/referrals'

import type { ReferralStats } from '../api/types'

// Mock window and navigator for browser APIs
const mockClipboard = {
  writeText: jest.fn()
}

const mockNavigator = {
  clipboard: mockClipboard
}

const mockWindow = {
  location: {
    origin: 'https://test.starktol.com'
  },
  isSecureContext: true
}

// @ts-ignore
global.navigator = mockNavigator
// @ts-ignore
global.window = mockWindow

describe('Referrals Utility Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('URL Generation Utilities', () => {
    describe('generateReferralUrl', () => {
      it('should generate referral URL with default base URL', () => {
        const url = generateReferralUrl('TEST123')
        expect(url).toBe('https://test.starktol.com/register?ref=TEST123')
      })

      it('should generate referral URL with custom base URL', () => {
        const url = generateReferralUrl('TEST123', 'https://custom.com')
        expect(url).toBe('https://custom.com/register?ref=TEST123')
      })

      it('should handle referral codes with special characters', () => {
        const url = generateReferralUrl('TEST 123@')
        expect(url).toBe('https://test.starktol.com/register?ref=TEST%20123%40')
      })

      it('should handle whitespace in referral code', () => {
        const url = generateReferralUrl('  TEST123  ')
        expect(url).toBe('https://test.starktol.com/register?ref=TEST123')
      })

      it('should return empty string for empty/null/undefined codes', () => {
        expect(generateReferralUrl('')).toBe('')
        expect(generateReferralUrl('   ')).toBe('')
        expect(generateReferralUrl(null as any)).toBe('')
        expect(generateReferralUrl(undefined as any)).toBe('')
      })

      it('should use fallback URL when window is not available', () => {
        const originalWindow = global.window
        // @ts-ignore
        delete global.window

        const url = generateReferralUrl('TEST123')
        expect(url).toBe('https://app.starktol.com/register?ref=TEST123')

        global.window = originalWindow
      })
    })

    describe('extractReferralCodeFromUrl', () => {
      it('should extract referral code from valid URL', () => {
        const code = extractReferralCodeFromUrl('https://app.starktol.com/register?ref=TEST123')
        expect(code).toBe('TEST123')
      })

      it('should extract referral code from URL with multiple params', () => {
        const code = extractReferralCodeFromUrl('https://app.starktol.com/register?utm_source=fb&ref=TEST123&utm_medium=social')
        expect(code).toBe('TEST123')
      })

      it('should return null for URL without ref parameter', () => {
        const code = extractReferralCodeFromUrl('https://app.starktol.com/register?utm_source=fb')
        expect(code).toBeNull()
      })

      it('should return null for invalid URL', () => {
        const code = extractReferralCodeFromUrl('not-a-url')
        expect(code).toBeNull()
      })

      it('should handle encoded referral codes', () => {
        const code = extractReferralCodeFromUrl('https://app.starktol.com/register?ref=TEST%20123')
        expect(code).toBe('TEST 123')
      })
    })

    describe('generateQRCodeUrl', () => {
      it('should generate QR code URL with default size', () => {
        const qrUrl = generateQRCodeUrl('https://app.starktol.com/register?ref=TEST123')
        expect(qrUrl).toBe('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fapp.starktol.com%2Fregister%3Fref%3DTEST123')
      })

      it('should generate QR code URL with custom size', () => {
        const qrUrl = generateQRCodeUrl('https://app.starktol.com/register?ref=TEST123', 300)
        expect(qrUrl).toBe('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fapp.starktol.com%2Fregister%3Fref%3DTEST123')
      })

      it('should return empty string for empty URL', () => {
        expect(generateQRCodeUrl('')).toBe('')
        expect(generateQRCodeUrl('   ')).toBe('')
      })
    })
  })

  describe('Social Sharing Utilities', () => {
    const shareOptions = {
      referralUrl: 'https://app.starktol.com/register?ref=TEST123',
      referralCode: 'TEST123'
    }

    describe('socialShare.twitter', () => {
      it('should generate Twitter share URL with default message', () => {
        const url = socialShare.twitter(shareOptions)
        expect(url).toContain('https://twitter.com/intent/tweet?text=')
        expect(decodeURIComponent(url)).toContain('Join me on StarkTol VTU Platform')
        expect(decodeURIComponent(url)).toContain('TEST123')
        expect(decodeURIComponent(url)).toContain(shareOptions.referralUrl)
      })

      it('should generate Twitter share URL with custom message', () => {
        const url = socialShare.twitter({
          ...shareOptions,
          customMessage: 'Custom tweet message'
        })
        expect(decodeURIComponent(url)).toContain('Custom tweet message')
      })
    })

    describe('socialShare.facebook', () => {
      it('should generate Facebook share URL', () => {
        const url = socialShare.facebook(shareOptions)
        expect(url).toBe('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fapp.starktol.com%2Fregister%3Fref%3DTEST123')
      })
    })

    describe('socialShare.whatsapp', () => {
      it('should generate WhatsApp share URL with default message', () => {
        const url = socialShare.whatsapp(shareOptions)
        expect(url).toContain('https://wa.me/?text=')
        expect(decodeURIComponent(url)).toContain('Join me on StarkTol VTU Platform')
        expect(decodeURIComponent(url)).toContain('*TEST123*')
      })

      it('should generate WhatsApp share URL with custom message', () => {
        const url = socialShare.whatsapp({
          ...shareOptions,
          customMessage: 'Custom WhatsApp message'
        })
        expect(decodeURIComponent(url)).toContain('Custom WhatsApp message')
      })
    })

    describe('socialShare.telegram', () => {
      it('should generate Telegram share URL', () => {
        const url = socialShare.telegram(shareOptions)
        expect(url).toContain('https://t.me/share/url?url=')
        expect(decodeURIComponent(url)).toContain('Join me on StarkTol VTU Platform')
        expect(decodeURIComponent(url)).toContain('TEST123')
      })
    })

    describe('socialShare.linkedin', () => {
      it('should generate LinkedIn share URL', () => {
        const url = socialShare.linkedin(shareOptions)
        expect(url).toBe('https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fapp.starktol.com%2Fregister%3Fref%3DTEST123')
      })
    })
  })

  describe('copyReferralLink', () => {
    it('should copy referral link using modern clipboard API', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined)

      const result = await copyReferralLink('https://app.starktol.com/register?ref=TEST123')

      expect(result).toBe(true)
      expect(mockClipboard.writeText).toHaveBeenCalledWith('https://app.starktol.com/register?ref=TEST123')
    })

    it('should handle clipboard API failure', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard access denied'))

      // Mock document methods for fallback
      const mockTextArea = {
        value: '',
        style: {},
        focus: jest.fn(),
        select: jest.fn()
      }
      const mockAppendChild = jest.fn()
      const mockRemoveChild = jest.fn()
      const mockExecCommand = jest.fn().mockReturnValue(true)

      document.createElement = jest.fn().mockReturnValue(mockTextArea)
      document.body.appendChild = mockAppendChild
      document.body.removeChild = mockRemoveChild
      document.execCommand = mockExecCommand

      const result = await copyReferralLink('https://app.starktol.com/register?ref=TEST123')

      expect(result).toBe(true)
      expect(mockTextArea.value).toBe('https://app.starktol.com/register?ref=TEST123')
      expect(mockAppendChild).toHaveBeenCalledWith(mockTextArea)
      expect(mockRemoveChild).toHaveBeenCalledWith(mockTextArea)
      expect(mockExecCommand).toHaveBeenCalledWith('copy')
    })

    it('should return false for empty URL', async () => {
      const result = await copyReferralLink('')
      expect(result).toBe(false)
    })
  })

  describe('Formatting Utilities', () => {
    describe('formatCurrency', () => {
      it('should format currency with Nigerian Naira', () => {
        expect(formatCurrency(1000)).toBe('₦1,000.00')
        expect(formatCurrency(1500.75)).toBe('₦1,500.75')
        expect(formatCurrency(0)).toBe('₦0.00')
      })

      it('should handle invalid numbers', () => {
        expect(formatCurrency(NaN)).toBe('₦0.00')
        expect(formatCurrency(null as any)).toBe('₦0.00')
        expect(formatCurrency(undefined as any)).toBe('₦0.00')
        expect(formatCurrency('invalid' as any)).toBe('₦0.00')
      })

      it('should respect formatting options', () => {
        const result = formatCurrency(1000, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        expect(result).toBe('₦1,000')
      })
    })

    describe('formatPercentage', () => {
      it('should format percentage correctly', () => {
        expect(formatPercentage(0.1)).toBe('10.0%')
        expect(formatPercentage(0.856)).toBe('85.6%')
        expect(formatPercentage(1)).toBe('100.0%')
        expect(formatPercentage(0)).toBe('0.0%')
      })

      it('should handle custom decimal places', () => {
        expect(formatPercentage(0.12345, 2)).toBe('12.35%')
        expect(formatPercentage(0.12345, 0)).toBe('12%')
      })

      it('should handle invalid numbers', () => {
        expect(formatPercentage(NaN)).toBe('0%')
        expect(formatPercentage(null as any)).toBe('0%')
        expect(formatPercentage(undefined as any)).toBe('0%')
      })
    })

    describe('formatLargeNumber', () => {
      it('should format numbers with K, M, B abbreviations', () => {
        expect(formatLargeNumber(500)).toBe('500')
        expect(formatLargeNumber(1500)).toBe('1.5K')
        expect(formatLargeNumber(1500000)).toBe('1.5M')
        expect(formatLargeNumber(1500000000)).toBe('1.5B')
      })

      it('should handle negative numbers', () => {
        expect(formatLargeNumber(-1500)).toBe('-1.5K')
        expect(formatLargeNumber(-1500000)).toBe('-1.5M')
      })

      it('should handle edge cases', () => {
        expect(formatLargeNumber(0)).toBe('0')
        expect(formatLargeNumber(999)).toBe('999')
        expect(formatLargeNumber(1000)).toBe('1.0K')
        expect(formatLargeNumber(1000000)).toBe('1.0M')
      })

      it('should handle invalid numbers', () => {
        expect(formatLargeNumber(NaN)).toBe('0')
        expect(formatLargeNumber(null as any)).toBe('0')
        expect(formatLargeNumber(undefined as any)).toBe('0')
      })
    })

    describe('formatRelativeTime', () => {
      it('should format past dates correctly', () => {
        const now = new Date('2024-01-15T12:00:00Z')
        jest.useFakeTimers().setSystemTime(now)

        expect(formatRelativeTime('2024-01-14T12:00:00Z')).toBe('1 day ago')
        expect(formatRelativeTime('2024-01-13T12:00:00Z')).toBe('2 days ago')
        expect(formatRelativeTime('2024-01-15T10:00:00Z')).toBe('2 hours ago')
        expect(formatRelativeTime('2024-01-15T11:30:00Z')).toBe('30 minutes ago')

        jest.useRealTimers()
      })

      it('should format future dates correctly', () => {
        const now = new Date('2024-01-15T12:00:00Z')
        jest.useFakeTimers().setSystemTime(now)

        expect(formatRelativeTime('2024-01-16T12:00:00Z')).toBe('in 1 day')
        expect(formatRelativeTime('2024-01-17T12:00:00Z')).toBe('in 2 days')
        expect(formatRelativeTime('2024-01-15T14:00:00Z')).toBe('in 2 hours')
        expect(formatRelativeTime('2024-01-15T12:30:00Z')).toBe('in 30 minutes')

        jest.useRealTimers()
      })

      it('should handle "just now" for recent times', () => {
        const now = new Date('2024-01-15T12:00:00Z')
        jest.useFakeTimers().setSystemTime(now)

        expect(formatRelativeTime('2024-01-15T12:00:30Z')).toBe('just now')
        expect(formatRelativeTime('2024-01-15T11:59:30Z')).toBe('just now')

        jest.useRealTimers()
      })

      it('should handle invalid dates', () => {
        expect(formatRelativeTime('invalid-date')).toBe('Invalid date')
        expect(formatRelativeTime(null as any)).toBe('Invalid date')
        expect(formatRelativeTime(undefined as any)).toBe('Invalid date')
      })

      it('should handle Date objects', () => {
        const now = new Date('2024-01-15T12:00:00Z')
        jest.useFakeTimers().setSystemTime(now)

        const pastDate = new Date('2024-01-14T12:00:00Z')
        expect(formatRelativeTime(pastDate)).toBe('1 day ago')

        jest.useRealTimers()
      })
    })
  })

  describe('Status Badge Utilities', () => {
    describe('getReferralStatusBadge', () => {
      it('should return correct badge for each status', () => {
        expect(getReferralStatusBadge('active')).toEqual({
          label: 'Active',
          variant: 'success',
          color: 'green'
        })

        expect(getReferralStatusBadge('pending')).toEqual({
          label: 'Pending',
          variant: 'warning',
          color: 'yellow'
        })

        expect(getReferralStatusBadge('inactive')).toEqual({
          label: 'Inactive',
          variant: 'secondary',
          color: 'gray'
        })
      })

      it('should return default badge for unknown status', () => {
        expect(getReferralStatusBadge('unknown' as any)).toEqual({
          label: 'Inactive',
          variant: 'secondary',
          color: 'gray'
        })
      })
    })

    describe('getWithdrawalStatusBadge', () => {
      it('should return correct badge for each status', () => {
        expect(getWithdrawalStatusBadge('pending')).toEqual({
          label: 'Pending',
          variant: 'warning',
          color: 'yellow'
        })

        expect(getWithdrawalStatusBadge('processing')).toEqual({
          label: 'Processing',
          variant: 'info',
          color: 'blue'
        })

        expect(getWithdrawalStatusBadge('completed')).toEqual({
          label: 'Completed',
          variant: 'success',
          color: 'green'
        })

        expect(getWithdrawalStatusBadge('failed')).toEqual({
          label: 'Failed',
          variant: 'destructive',
          color: 'red'
        })

        expect(getWithdrawalStatusBadge('cancelled')).toEqual({
          label: 'Cancelled',
          variant: 'secondary',
          color: 'gray'
        })
      })
    })
  })

  describe('Calculation Utilities', () => {
    describe('calculateReferralMetrics', () => {
      it('should calculate metrics correctly with data', () => {
        const stats: ReferralStats = {
          totalReferrals: 10,
          activeReferrals: 8,
          totalEarnings: 50000,
          availableBalance: 30000,
          pendingWithdrawals: 1,
          thisMonthEarnings: 15000,
          thisMonthReferrals: 3,
          conversionRate: 0.8,
          referralCode: 'TEST123',
          referralUrl: 'https://app.starktol.com/register?ref=TEST123'
        }

        const metrics = calculateReferralMetrics(stats)

        expect(metrics.averageEarningsPerReferral).toBe(5000)
        expect(metrics.monthlyGrowthRate).toBe(0.3)
        expect(metrics.activeReferralRate).toBe(0.8)
        expect(metrics.formattedAverageEarnings).toContain('5,000')
        expect(metrics.formattedGrowthRate).toBe('30.0%')
        expect(metrics.formattedActiveRate).toBe('80.0%')
      })

      it('should handle zero referrals gracefully', () => {
        const stats: ReferralStats = {
          totalReferrals: 0,
          activeReferrals: 0,
          totalEarnings: 0,
          availableBalance: 0,
          pendingWithdrawals: 0,
          thisMonthEarnings: 0,
          thisMonthReferrals: 0,
          conversionRate: 0,
          referralCode: 'TEST123',
          referralUrl: 'https://app.starktol.com/register?ref=TEST123'
        }

        const metrics = calculateReferralMetrics(stats)

        expect(metrics.averageEarningsPerReferral).toBe(0)
        expect(metrics.monthlyGrowthRate).toBe(0)
        expect(metrics.activeReferralRate).toBe(0)
      })
    })

    describe('calculateWithdrawalAmount', () => {
      it('should calculate withdrawal amounts correctly', () => {
        const result = calculateWithdrawalAmount(10000, 0.01, 100)

        expect(result.grossAmount).toBe(10000)
        expect(result.fee).toBe(100) // 1% of 10000 = 100, which equals minimum
        expect(result.netAmount).toBe(9900)
        expect(result.formattedGross).toContain('10,000')
        expect(result.formattedFee).toContain('100')
        expect(result.formattedNet).toContain('9,900')
      })

      it('should use minimum fee when percentage is lower', () => {
        const result = calculateWithdrawalAmount(5000, 0.01, 100)

        expect(result.fee).toBe(100) // Minimum fee applies (50 < 100)
        expect(result.netAmount).toBe(4900)
      })

      it('should use percentage fee when higher than minimum', () => {
        const result = calculateWithdrawalAmount(20000, 0.01, 100)

        expect(result.fee).toBe(200) // 1% of 20000 = 200 > 100
        expect(result.netAmount).toBe(19800)
      })

      it('should handle invalid amounts', () => {
        const result1 = calculateWithdrawalAmount(0)
        expect(result1.grossAmount).toBe(0)
        expect(result1.fee).toBe(0)
        expect(result1.netAmount).toBe(0)

        const result2 = calculateWithdrawalAmount(-1000)
        expect(result2.grossAmount).toBe(0)
        expect(result2.fee).toBe(0)
        expect(result2.netAmount).toBe(0)

        const result3 = calculateWithdrawalAmount(NaN)
        expect(result3.grossAmount).toBe(0)
        expect(result3.fee).toBe(0)
        expect(result3.netAmount).toBe(0)
      })

      it('should ensure net amount is never negative', () => {
        const result = calculateWithdrawalAmount(50, 0.01, 100)

        expect(result.grossAmount).toBe(50)
        expect(result.fee).toBe(100)
        expect(result.netAmount).toBe(0) // Max(0, 50 - 100)
      })
    })
  })

  describe('Validation Utilities', () => {
    describe('validateReferralCode', () => {
      it('should validate correct referral codes', () => {
        expect(validateReferralCode('TEST123')).toEqual({ isValid: true })
        expect(validateReferralCode('ABC')).toEqual({ isValid: true })
        expect(validateReferralCode('123456789012345')).toEqual({ isValid: true })
      })

      it('should reject empty or whitespace-only codes', () => {
        expect(validateReferralCode('')).toEqual({
          isValid: false,
          error: 'Referral code is required'
        })

        expect(validateReferralCode('   ')).toEqual({
          isValid: false,
          error: 'Referral code is required'
        })

        expect(validateReferralCode(null as any)).toEqual({
          isValid: false,
          error: 'Referral code is required'
        })
      })

      it('should reject codes that are too short', () => {
        expect(validateReferralCode('AB')).toEqual({
          isValid: false,
          error: 'Referral code must be at least 3 characters'
        })
      })

      it('should reject codes that are too long', () => {
        expect(validateReferralCode('A'.repeat(21))).toEqual({
          isValid: false,
          error: 'Referral code must be less than 20 characters'
        })
      })

      it('should reject codes with special characters', () => {
        expect(validateReferralCode('TEST@123')).toEqual({
          isValid: false,
          error: 'Referral code can only contain letters and numbers'
        })

        expect(validateReferralCode('TEST-123')).toEqual({
          isValid: false,
          error: 'Referral code can only contain letters and numbers'
        })

        expect(validateReferralCode('TEST 123')).toEqual({
          isValid: false,
          error: 'Referral code can only contain letters and numbers'
        })
      })

      it('should handle whitespace in code by trimming', () => {
        expect(validateReferralCode('  TEST123  ')).toEqual({ isValid: true })
      })
    })

    describe('validateWithdrawalAmount', () => {
      it('should validate correct amounts', () => {
        expect(validateWithdrawalAmount(5000, 10000, 1000)).toEqual({ isValid: true })
        expect(validateWithdrawalAmount(10000, 10000, 1000)).toEqual({ isValid: true })
        expect(validateWithdrawalAmount(1000, 10000, 1000)).toEqual({ isValid: true })
      })

      it('should reject invalid number types', () => {
        expect(validateWithdrawalAmount(NaN, 10000)).toEqual({
          isValid: false,
          error: 'Invalid amount'
        })

        expect(validateWithdrawalAmount(null as any, 10000)).toEqual({
          isValid: false,
          error: 'Invalid amount'
        })

        expect(validateWithdrawalAmount('1000' as any, 10000)).toEqual({
          isValid: false,
          error: 'Invalid amount'
        })
      })

      it('should reject zero or negative amounts', () => {
        expect(validateWithdrawalAmount(0, 10000)).toEqual({
          isValid: false,
          error: 'Amount must be greater than zero'
        })

        expect(validateWithdrawalAmount(-1000, 10000)).toEqual({
          isValid: false,
          error: 'Amount must be greater than zero'
        })
      })

      it('should reject amounts below minimum', () => {
        expect(validateWithdrawalAmount(500, 10000, 1000)).toEqual({
          isValid: false,
          error: 'Minimum withdrawal amount is ₦1,000.00'
        })
      })

      it('should reject amounts exceeding balance', () => {
        expect(validateWithdrawalAmount(15000, 10000, 1000)).toEqual({
          isValid: false,
          error: 'Insufficient balance'
        })
      })

      it('should use default minimum withdrawal amount', () => {
        expect(validateWithdrawalAmount(500, 10000)).toEqual({
          isValid: false,
          error: 'Minimum withdrawal amount is ₦1,000.00'
        })
      })
    })
  })

  describe('referralUtils export', () => {
    it('should export all utility functions', () => {
      expect(referralUtils.generateReferralUrl).toBe(generateReferralUrl)
      expect(referralUtils.extractReferralCodeFromUrl).toBe(extractReferralCodeFromUrl)
      expect(referralUtils.generateQRCodeUrl).toBe(generateQRCodeUrl)
      expect(referralUtils.socialShare).toBe(socialShare)
      expect(referralUtils.copyReferralLink).toBe(copyReferralLink)
      expect(referralUtils.formatCurrency).toBe(formatCurrency)
      expect(referralUtils.formatPercentage).toBe(formatPercentage)
      expect(referralUtils.formatLargeNumber).toBe(formatLargeNumber)
      expect(referralUtils.formatRelativeTime).toBe(formatRelativeTime)
      expect(referralUtils.getReferralStatusBadge).toBe(getReferralStatusBadge)
      expect(referralUtils.getWithdrawalStatusBadge).toBe(getWithdrawalStatusBadge)
      expect(referralUtils.calculateReferralMetrics).toBe(calculateReferralMetrics)
      expect(referralUtils.calculateWithdrawalAmount).toBe(calculateWithdrawalAmount)
      expect(referralUtils.validateReferralCode).toBe(validateReferralCode)
      expect(referralUtils.validateWithdrawalAmount).toBe(validateWithdrawalAmount)
    })
  })
})
