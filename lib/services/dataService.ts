import api from '@/lib/api'

export interface DataBundle {
  id: string
  name: string
  size: string
  validity: string
  price: number
  provider: string
  description?: string
}

export interface DataProvider {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive'
}

export interface DataPurchaseRequest {
  provider: string
  phoneNumber: string
  bundleId: string
  paymentMethod: 'wallet' | 'card'
}

export interface DataPurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    status: 'success' | 'pending' | 'failed'
    bundle: DataBundle
    recipient: string
  }
}

class DataService {
  /**
   * Get all available data providers
   */
  async getProviders(): Promise<DataProvider[]> {
    try {
      const response = await api.get('/services/data/providers')
      return response.data?.providers || response.data || []
    } catch (error) {
      console.error('Failed to fetch data providers:', error)
      throw new Error('Failed to load data providers')
    }
  }

  /**
   * Get data bundles for a specific provider
   */
  async getDataBundles(providerId: string): Promise<DataBundle[]> {
    try {
      const response = await api.get(`/services/data/bundles?provider=${providerId}`)
      return response.data?.bundles || response.data || []
    } catch (error) {
      console.error(`Failed to fetch bundles for ${providerId}:`, error)
      throw new Error('Failed to load data bundles')
    }
  }

  /**
   * Get all data bundles grouped by provider
   */
  async getAllDataBundles(): Promise<Record<string, DataBundle[]>> {
    try {
      const response = await api.get('/services/data/bundles/all')
      return response.data?.bundles || response.data || {}
    } catch (error) {
      console.error('Failed to fetch all data bundles:', error)
      throw new Error('Failed to load data bundles')
    }
  }

  /**
   * Purchase data bundle
   */
  async purchaseDataBundle(request: DataPurchaseRequest): Promise<DataPurchaseResponse> {
    try {
      const response = await api.post('/services/data/purchase', {
        provider: request.provider,
        phone_number: request.phoneNumber,
        bundle_id: request.bundleId,
        payment_method: request.paymentMethod
      })

      return {
        success: response.data?.success || false,
        message: response.data?.message || 'Data bundle purchased successfully',
        data: response.data?.data
      }
    } catch (error: any) {
      console.error('Data purchase failed:', error)
      
      const errorMessage = error?.response?.data?.message || 'Data purchase failed. Please try again.'
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  /**
   * Get recent data transactions
   */
  async getRecentTransactions(limit: number = 5): Promise<any[]> {
    try {
      const response = await api.get(`/transactions?type=data&limit=${limit}`)
      return response.data?.transactions || response.data || []
    } catch (error) {
      console.error('Failed to fetch recent data transactions:', error)
      return []
    }
  }

  /**
   * Validate phone number for data service
   */
  async validatePhoneNumber(phoneNumber: string, provider: string): Promise<boolean> {
    try {
      const response = await api.post('/services/data/validate', {
        phone_number: phoneNumber,
        provider: provider
      })
      return response.data?.valid || false
    } catch (error) {
      console.error('Phone validation failed:', error)
      return false
    }
  }

  /**
   * Get bundle details by ID
   */
  async getBundleDetails(bundleId: string): Promise<DataBundle | null> {
    try {
      const response = await api.get(`/services/data/bundles/${bundleId}`)
      return response.data?.bundle || response.data || null
    } catch (error) {
      console.error(`Failed to fetch bundle details for ${bundleId}:`, error)
      return null
    }
  }
}

export const dataService = new DataService()
