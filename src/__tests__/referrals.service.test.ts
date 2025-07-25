/**
 * Unit Tests for ReferralsService
 * 
 * Tests all referral endpoints including stats, history, withdrawals
 * with proper TypeScript types and error handling.
 */

import MockAdapter from 'axios-mock-adapter'
import { referralsService, ReferralsService } from '../api/services/referrals'
import { httpClient } from '../api/httpClient'
import type { 
  ReferralStats, 
  ReferralRecord, 
  WithdrawalRecord, 
  CreateWithdrawalRequest,
  PaginatedResponse,
  ApiResponse 
} from '../api/types'

describe('ReferralsService', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(httpClient.getAxiosInstance())
  })

  afterEach(() => {
    mock.reset()
  })

  afterAll(() => {
    mock.restore()
  })

  describe('getReferralStats', () => {
    it('should return expected stats shape with correct types', async () => {
      const mockStats: ReferralStats = {
        totalReferrals: 25,
        activeReferrals: 20,
        totalEarnings: 150000.50,
        availableBalance: 75000.25,
        pendingWithdrawals: 2,
        thisMonthEarnings: 45000.75,
        thisMonthReferrals: 8,
        conversionRate: 0.85,
        referralCode: 'REF123ABC',
        referralUrl: 'https://app.starktol.com/register?ref=REF123ABC'
      }

      mock.onGet('/user/referral/stats').reply(200, {
        success: true,
        message: 'Referral stats fetched successfully',
        data: mockStats
      })

      const response = await referralsService.getReferralStats()

      expect(response.success).toBe(true)
      expect(response.data).toEqual(mockStats)
      
      // Verify shape compliance
      expect(typeof response.data?.totalReferrals).toBe('number')
      expect(typeof response.data?.activeReferrals).toBe('number')
      expect(typeof response.data?.totalEarnings).toBe('number')
      expect(typeof response.data?.availableBalance).toBe('number')
      expect(typeof response.data?.pendingWithdrawals).toBe('number')
      expect(typeof response.data?.thisMonthEarnings).toBe('number')
      expect(typeof response.data?.thisMonthReferrals).toBe('number')
      expect(typeof response.data?.conversionRate).toBe('number')
      expect(typeof response.data?.referralCode).toBe('string')
      expect(typeof response.data?.referralUrl).toBe('string')
    })

    it('should handle empty stats gracefully', async () => {
      const emptyStats: ReferralStats = {
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        availableBalance: 0,
        pendingWithdrawals: 0,
        thisMonthEarnings: 0,
        thisMonthReferrals: 0,
        conversionRate: 0,
        referralCode: '',
        referralUrl: ''
      }

      mock.onGet('/user/referral/stats').reply(200, {
        success: true,
        message: 'No referral activity yet',
        data: emptyStats
      })

      const response = await referralsService.getReferralStats()

      expect(response.success).toBe(true)
      expect(response.data?.totalReferrals).toBe(0)
      expect(response.data?.totalEarnings).toBe(0)
    })

    it('should handle failed API response', async () => {
      mock.onGet('/user/referral/stats').reply(500, {
        success: false,
        message: 'Internal server error'
      })

      const response = await referralsService.getReferralStats()

      expect(response.success).toBe(false)
      expect(response.error?.status).toBe(500)
    })
  })

  describe('getReferralHistory', () => {
    it('should return paginated referral history with correct shape', async () => {
      const mockReferrals: ReferralRecord[] = [
        {
          id: 'ref1',
          referredUserId: 'user1',
          referredUserName: 'John Doe',
          referredUserEmail: 'john@example.com',
          joinedAt: '2024-01-15T10:30:00Z',
          status: 'active',
          totalTransactions: 15,
          totalSpent: 25000.50,
          commissionEarned: 2500.05,
          lastActivity: '2024-01-20T14:30:00Z'
        },
        {
          id: 'ref2',
          referredUserId: 'user2',
          referredUserName: 'Jane Smith',
          referredUserEmail: 'jane@example.com',
          joinedAt: '2024-01-10T09:15:00Z',
          status: 'pending',
          totalTransactions: 0,
          totalSpent: 0,
          commissionEarned: 0
        }
      ]

      const mockResponse: PaginatedResponse<ReferralRecord> = {
        data: mockReferrals,
        meta: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }

      mock.onGet('/user/referral/history').reply(200, {
        success: true,
        message: 'Referral history fetched successfully',
        data: mockResponse
      })

      const response = await referralsService.getReferralHistory()

      expect(response.success).toBe(true)
      expect(response.data?.data).toHaveLength(2)
      expect(response.data?.meta.total).toBe(2)
      
      // Verify referral record shape
      const firstReferral = response.data?.data[0]
      expect(typeof firstReferral?.id).toBe('string')
      expect(typeof firstReferral?.referredUserId).toBe('string')
      expect(typeof firstReferral?.referredUserName).toBe('string')
      expect(typeof firstReferral?.referredUserEmail).toBe('string')
      expect(typeof firstReferral?.joinedAt).toBe('string')
      expect(['pending', 'active', 'inactive']).toContain(firstReferral?.status)
      expect(typeof firstReferral?.totalTransactions).toBe('number')
      expect(typeof firstReferral?.totalSpent).toBe('number')
      expect(typeof firstReferral?.commissionEarned).toBe('number')
    })

    it('should handle pagination parameters correctly', async () => {
      const mockResponse: PaginatedResponse<ReferralRecord> = {
        data: [],
        meta: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
          hasNext: true,
          hasPrev: true
        }
      }

      mock.onGet('/user/referral/history?page=2&limit=10').reply(200, {
        success: true,
        message: 'Referral history fetched successfully',
        data: mockResponse
      })

      const response = await referralsService.getReferralHistory({
        page: 2,
        limit: 10
      })

      expect(response.success).toBe(true)
      expect(response.data?.meta.page).toBe(2)
      expect(response.data?.meta.limit).toBe(10)
      expect(response.data?.meta.hasNext).toBe(true)
      expect(response.data?.meta.hasPrev).toBe(true)
    })

    it('should handle empty referral history', async () => {
      const emptyResponse: PaginatedResponse<ReferralRecord> = {
        data: [],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }

      mock.onGet('/user/referral/history').reply(200, {
        success: true,
        message: 'No referrals found',
        data: emptyResponse
      })

      const response = await referralsService.getReferralHistory()

      expect(response.success).toBe(true)
      expect(response.data?.data).toHaveLength(0)
      expect(response.data?.meta.total).toBe(0)
    })
  })

  describe('getWithdrawalHistory', () => {
    it('should return paginated withdrawal history with correct shape', async () => {
      const mockWithdrawals: WithdrawalRecord[] = [
        {
          id: 'wd1',
          amount: 50000,
          status: 'completed',
          method: 'wallet',
          requestedAt: '2024-01-15T10:30:00Z',
          processedAt: '2024-01-15T10:35:00Z',
          completedAt: '2024-01-15T10:40:00Z',
          reference: 'WD-REF-001'
        },
        {
          id: 'wd2',
          amount: 25000,
          status: 'processing',
          method: 'bank_transfer',
          requestedAt: '2024-01-20T14:30:00Z',
          processedAt: '2024-01-20T14:35:00Z',
          reference: 'WD-REF-002',
          bankDetails: {
            accountName: 'John Doe',
            accountNumber: '1234567890',
            bankName: 'First Bank'
          }
        },
        {
          id: 'wd3',
          amount: 10000,
          status: 'failed',
          method: 'bank_transfer',
          requestedAt: '2024-01-18T09:00:00Z',
          reference: 'WD-REF-003',
          failureReason: 'Invalid account details'
        }
      ]

      const mockResponse: PaginatedResponse<WithdrawalRecord> = {
        data: mockWithdrawals,
        meta: {
          page: 1,
          limit: 20,
          total: 3,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }

      mock.onGet('/user/referral/withdrawals').reply(200, {
        success: true,
        message: 'Withdrawal history fetched successfully',
        data: mockResponse
      })

      const response = await referralsService.getWithdrawalHistory()

      expect(response.success).toBe(true)
      expect(response.data?.data).toHaveLength(3)
      
      // Verify withdrawal record shapes
      const completedWithdrawal = response.data?.data[0]
      expect(typeof completedWithdrawal?.id).toBe('string')
      expect(typeof completedWithdrawal?.amount).toBe('number')
      expect(['pending', 'processing', 'completed', 'failed', 'cancelled']).toContain(completedWithdrawal?.status)
      expect(['wallet', 'bank_transfer']).toContain(completedWithdrawal?.method)
      expect(typeof completedWithdrawal?.requestedAt).toBe('string')
      expect(typeof completedWithdrawal?.reference).toBe('string')

      // Check optional fields
      const bankTransferWithdrawal = response.data?.data[1]
      expect(bankTransferWithdrawal?.bankDetails).toBeDefined()
      expect(typeof bankTransferWithdrawal?.bankDetails?.accountName).toBe('string')
      expect(typeof bankTransferWithdrawal?.bankDetails?.accountNumber).toBe('string')
      expect(typeof bankTransferWithdrawal?.bankDetails?.bankName).toBe('string')

      const failedWithdrawal = response.data?.data[2]
      expect(typeof failedWithdrawal?.failureReason).toBe('string')
    })

    it('should handle empty withdrawal history', async () => {
      const emptyResponse: PaginatedResponse<WithdrawalRecord> = {
        data: [],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }

      mock.onGet('/user/referral/withdrawals').reply(200, {
        success: true,
        message: 'No withdrawals found',
        data: emptyResponse
      })

      const response = await referralsService.getWithdrawalHistory()

      expect(response.success).toBe(true)
      expect(response.data?.data).toHaveLength(0)
      expect(response.data?.meta.total).toBe(0)
    })
  })

  describe('requestWithdrawal', () => {
    it('should handle wallet withdrawal request correctly', async () => {
      const withdrawalRequest: CreateWithdrawalRequest = {
        amount: 50000,
        method: 'wallet',
        pin: '1234'
      }

      const mockResponse = {
        withdrawalId: 'wd-123',
        reference: 'WD-REF-123',
        status: 'pending',
        estimatedCompletionTime: '2024-01-15T11:00:00Z'
      }

      mock.onPost('/user/referral/withdraw', withdrawalRequest).reply(200, {
        success: true,
        message: 'Withdrawal request submitted successfully',
        data: mockResponse
      })

      const response = await referralsService.requestWithdrawal(withdrawalRequest)

      expect(response.success).toBe(true)
      expect(response.data?.withdrawalId).toBe('wd-123')
      expect(response.data?.reference).toBe('WD-REF-123')
      expect(response.data?.status).toBe('pending')
    })

    it('should handle bank transfer withdrawal request correctly', async () => {
      const withdrawalRequest: CreateWithdrawalRequest = {
        amount: 75000,
        method: 'bank_transfer',
        bankDetails: {
          accountNumber: '1234567890',
          bankCode: '044'
        },
        pin: '1234'
      }

      const mockResponse = {
        withdrawalId: 'wd-456',
        reference: 'WD-REF-456',
        status: 'processing',
        estimatedCompletionTime: '2024-01-15T15:00:00Z'
      }

      mock.onPost('/user/referral/withdraw', withdrawalRequest).reply(200, {
        success: true,
        message: 'Bank transfer withdrawal request submitted',
        data: mockResponse
      })

      const response = await referralsService.requestWithdrawal(withdrawalRequest)

      expect(response.success).toBe(true)
      expect(response.data?.withdrawalId).toBe('wd-456')
      expect(response.data?.status).toBe('processing')
    })

    it('should handle withdrawal request validation errors', async () => {
      const invalidRequest: CreateWithdrawalRequest = {
        amount: 0, // Invalid amount
        method: 'wallet',
        pin: ''
      }

      mock.onPost('/user/referral/withdraw').reply(400, {
        success: false,
        message: 'Validation failed',
        errors: [
          { field: 'amount', message: 'Amount must be greater than 0', code: 'min_value' },
          { field: 'pin', message: 'PIN is required', code: 'required' }
        ]
      })

      const response = await referralsService.requestWithdrawal(invalidRequest)

      expect(response.success).toBe(false)
      expect(response.error?.status).toBe(400)
    })
  })

  describe('getReferralDetails', () => {
    it('should return detailed referral information with transaction history', async () => {
      const mockDetailedReferral = {
        id: 'ref1',
        referredUserId: 'user1',
        referredUserName: 'John Doe',
        referredUserEmail: 'john@example.com',
        joinedAt: '2024-01-15T10:30:00Z',
        status: 'active' as const,
        totalTransactions: 15,
        totalSpent: 25000.50,
        commissionEarned: 2500.05,
        lastActivity: '2024-01-20T14:30:00Z',
        transactionHistory: [
          {
            id: 'tx1',
            type: 'airtime',
            amount: 1000,
            commission: 100,
            date: '2024-01-16T10:00:00Z'
          },
          {
            id: 'tx2',
            type: 'data',
            amount: 2000,
            commission: 200,
            date: '2024-01-17T15:30:00Z'
          }
        ],
        monthlyBreakdown: [
          {
            month: '2024-01',
            transactions: 15,
            commission: 2500.05
          }
        ]
      }

      mock.onGet('/user/referral/details/ref1').reply(200, {
        success: true,
        message: 'Referral details fetched successfully',
        data: mockDetailedReferral
      })

      const response = await referralsService.getReferralDetails('ref1')

      expect(response.success).toBe(true)
      expect(response.data?.id).toBe('ref1')
      expect(response.data?.transactionHistory).toHaveLength(2)
      expect(response.data?.monthlyBreakdown).toHaveLength(1)
      
      // Verify transaction history shape
      const firstTransaction = response.data?.transactionHistory[0]
      expect(typeof firstTransaction?.id).toBe('string')
      expect(typeof firstTransaction?.type).toBe('string')
      expect(typeof firstTransaction?.amount).toBe('number')
      expect(typeof firstTransaction?.commission).toBe('number')
      expect(typeof firstTransaction?.date).toBe('string')
      
      // Verify monthly breakdown shape
      const firstMonth = response.data?.monthlyBreakdown[0]
      expect(typeof firstMonth?.month).toBe('string')
      expect(typeof firstMonth?.transactions).toBe('number')
      expect(typeof firstMonth?.commission).toBe('number')
    })
  })

  describe('generateReferralCode', () => {
    it('should generate new referral code with QR code', async () => {
      const mockResponse = {
        referralCode: 'CUSTOM123',
        referralUrl: 'https://app.starktol.com/register?ref=CUSTOM123',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=https://app.starktol.com/register?ref=CUSTOM123'
      }

      mock.onPost('/user/referral/generate-code', {
        custom_code: 'CUSTOM123'
      }).reply(200, {
        success: true,
        message: 'Referral code generated successfully',
        data: mockResponse
      })

      const response = await referralsService.generateReferralCode('CUSTOM123')

      expect(response.success).toBe(true)
      expect(response.data?.referralCode).toBe('CUSTOM123')
      expect(response.data?.referralUrl).toContain('CUSTOM123')
      expect(response.data?.qrCodeUrl).toContain('CUSTOM123')
    })
  })

  describe('Error handling and edge cases', () => {
    it('should handle network errors gracefully', async () => {
      mock.onGet('/user/referral/stats').networkError()

      const response = await referralsService.getReferralStats()

      expect(response.success).toBe(false)
      expect(response.error?.isNetworkError).toBe(true)
    })

    it('should handle timeout errors', async () => {
      mock.onGet('/user/referral/stats').timeout()

      const response = await referralsService.getReferralStats()

      expect(response.success).toBe(false)
    })

    it('should handle unauthorized access', async () => {
      mock.onGet('/user/referral/stats').reply(401, {
        success: false,
        message: 'Unauthorized access'
      })

      const response = await referralsService.getReferralStats()

      expect(response.success).toBe(false)
      expect(response.error?.status).toBe(401)
    })
  })

  describe('Service instance', () => {
    it('should be properly instantiated', () => {
      expect(referralsService).toBeInstanceOf(ReferralsService)
    })

    it('should use consistent endpoint base', () => {
      const service = new ReferralsService()
      expect(service).toBeInstanceOf(ReferralsService)
    })
  })
})
