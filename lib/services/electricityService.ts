import api from '@/lib/api'

export interface ElectricityProvider {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive'
  minAmount?: number
  maxAmount?: number
  description?: string
  supportedMeterTypes?: ('prepaid' | 'postpaid')[]
}

export interface ElectricityTariff {
  id: string
  name: string
  providerId: string
  rate: number
  description?: string
  meterType: 'prepaid' | 'postpaid'
}

export interface CustomerInfo {
  name: string
  address?: string
  meterNumber: string
  customerNumber?: string
  meterType: 'prepaid' | 'postpaid'
  provider: string
  lastRecharge?: {
    amount: number
    date: string
    units?: number
  }
  outstandingBalance?: number
}

export interface ElectricityPurchaseRequest {
  provider: string
  meterNumber: string
  amount: number
  meterType: 'prepaid' | 'postpaid'
  paymentMethod: 'wallet' | 'card'
  customerName?: string
  customerPhone?: string
}

export interface ElectricityPurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    token?: string
    units?: number
    customerName?: string
    meterNumber: string
    amount: number
    vatAmount?: number
    fee?: number
    totalAmount?: number
    receiptNumber?: string
    provider: string
    purchaseDate: string
  }
}

export interface ElectricityTransaction {
  id: string
  provider: string
  meterNumber: string
  customerName?: string
  amount: number
  units?: number
  token?: string
  date: string
  status: 'success' | 'pending' | 'failed'
  reference: string
  meterType: 'prepaid' | 'postpaid'
  receiptNumber?: string
}

export interface MeterValidationResult {
  valid: boolean
  customer?: CustomerInfo
  error?: string
}

class ElectricityService {
  /**
   * Get all available electricity providers
   */
  async getProviders(): Promise<ElectricityProvider[]> {
    try {
      const response = await api.get('/services/electricity/providers')
      return response.data?.providers || response.data || []
    } catch (error) {
      console.error('Failed to fetch electricity providers:', error)
      throw new Error('Failed to load electricity providers')
    }
  }

  /**
   * Get electricity provider by ID
   */
  async getProviderById(providerId: string): Promise<ElectricityProvider | null> {
    try {
      const response = await api.get(`/services/electricity/providers/${providerId}`)
      return response.data?.provider || response.data || null
    } catch (error) {
      console.error(`Failed to fetch provider ${providerId}:`, error)
      return null
    }
  }

  /**
   * Get available tariffs for a provider
   */
  async getTariffs(providerId: string): Promise<ElectricityTariff[]> {
    try {
      const response = await api.get(`/services/electricity/providers/${providerId}/tariffs`)
      return response.data?.tariffs || response.data || []
    } catch (error) {
      console.error(`Failed to fetch tariffs for ${providerId}:`, error)
      return []
    }
  }

  /**
   * Purchase electricity units
   */
  async purchaseElectricity(request: ElectricityPurchaseRequest): Promise<ElectricityPurchaseResponse> {
    try {
      const response = await api.post('/services/electricity/purchase', {
        provider: request.provider,
        meter_number: request.meterNumber,
        amount: request.amount,
        meter_type: request.meterType,
        payment_method: request.paymentMethod,
        customer_name: request.customerName,
        customer_phone: request.customerPhone
      })

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Electricity purchase successful',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Electricity purchase failed:', error)
      
      const errorMessage = error?.response?.data?.message || 'Electricity purchase failed. Please try again.'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Validate meter number with enhanced response
   */
  async validateMeter(meterNumber: string, provider: string, meterType: 'prepaid' | 'postpaid'): Promise<MeterValidationResult> {
    try {
      const response = await api.post('/services/electricity/validate', {
        meter_number: meterNumber,
        provider: provider,
        meter_type: meterType
      })
      
      if (response.data?.valid) {
        return {
          valid: true,
          customer: response.data.customer || response.data.data
        }
      } else {
        return {
          valid: false,
          error: response.data?.message || 'Invalid meter number'
        }
      }
    } catch (error: any) {
      console.error('Meter validation failed:', error)
      return {
        valid: false,
        error: error?.response?.data?.message || 'Meter validation failed'
      }
    }
  }

  /**
   * Get recent electricity transactions with proper typing
   */
  async getRecentTransactions(limit: number = 5): Promise<ElectricityTransaction[]> {
    try {
      const response = await api.get(`/transactions?type=electricity&limit=${limit}`)
      return response.data?.transactions || response.data || []
    } catch (error) {
      console.error('Failed to fetch recent electricity transactions:', error)
      return []
    }
  }

  /**
   * Get electricity transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<ElectricityTransaction | null> {
    try {
      const response = await api.get(`/transactions/electricity/${transactionId}`)
      return response.data?.transaction || response.data || null
    } catch (error) {
      console.error(`Failed to fetch transaction ${transactionId}:`, error)
      return null
    }
  }

  /**
   * Get customer information by meter number
   */
  async getCustomerInfo(meterNumber: string, provider: string): Promise<CustomerInfo | null> {
    try {
      const response = await api.get(`/services/electricity/customer?meter=${meterNumber}&provider=${provider}`)
      return response.data?.customer || response.data || null
    } catch (error) {
      console.error('Failed to fetch customer info:', error)
      return null
    }
  }

  /**
   * Calculate estimated units for amount
   */
  async calculateUnits(amount: number, provider: string, meterType: 'prepaid' | 'postpaid'): Promise<{ units: number; rate: number } | null> {
    try {
      const response = await api.post('/services/electricity/calculate', {
        amount,
        provider,
        meter_type: meterType
      })
      return response.data || null
    } catch (error) {
      console.error('Failed to calculate units:', error)
      return null
    }
  }

  /**
   * Get transaction receipt data
   */
  async getReceipt(transactionId: string): Promise<any> {
    try {
      const response = await api.get(`/transactions/electricity/${transactionId}/receipt`)
      return response.data || null
    } catch (error) {
      console.error('Failed to fetch receipt:', error)
      return null
    }
  }

  /**
   * Check transaction status
   */
  async checkTransactionStatus(reference: string): Promise<{ status: string; message?: string } | null> {
    try {
      const response = await api.get(`/transactions/status?reference=${reference}`)
      return response.data || null
    } catch (error) {
      console.error('Failed to check transaction status:', error)
      return null
    }
  }

  /**
   * Get electricity consumption history for a meter
   */
  async getConsumptionHistory(meterNumber: string, provider: string, months: number = 6): Promise<any[]> {
    try {
      const response = await api.get(`/services/electricity/consumption?meter=${meterNumber}&provider=${provider}&months=${months}`)
      return response.data?.history || response.data || []
    } catch (error) {
      console.error('Failed to fetch consumption history:', error)
      return []
    }
  }
}

export const electricityService = new ElectricityService()
