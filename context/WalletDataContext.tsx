"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { useUserData } from "./UserDataContext"
import { useAuth } from "./authContext"
import { WalletApiService } from "@/lib/api/wallet"
import { airtimeService } from "@/lib/services/airtimeService"
import { dataService } from "@/lib/services/dataService"
import { cableService } from "@/lib/services/cableService"
import { electricityService } from "@/lib/services/electricityService"
import type {
  WalletBalance,
  WalletTransaction,
  WalletFundRequest,
  WalletTransferRequest,
  ServiceResponse
} from "@/lib/api/types"
import type { Provider as AirtimeProviderType } from "@/lib/services/airtimeService"
import type { DataProvider, DataBundle } from "@/lib/services/dataService"
import type { CableProvider, CablePlan } from "@/lib/services/cableService"
import type { ElectricityProvider } from "@/lib/services/electricityService"

// Cache interfaces
interface ProviderCache {
  airtime: AirtimeProviderType[]
  data: DataProvider[]
  cable: CableProvider[]
  electricity: ElectricityProvider[]
  lastUpdated: Record<string, number>
}

interface PlanCache {
  dataBundles: Record<string, DataBundle[]> // keyed by provider ID
  cablePlans: Record<string, CablePlan[]> // keyed by provider ID
  lastUpdated: Record<string, number>
}

interface WalletData {
  balance: WalletBalance | null
  recentTransactions: WalletTransaction[]
  walletStats: {
    totalInflow: number
    totalOutflow: number
    transactionCount: number
    averageTransaction: number
  } | null
  loading: boolean
  error: string | null
  lastUpdated: number | null
}

interface CacheData {
  providers: ProviderCache
  plans: PlanCache
  loading: boolean
  error: string | null
}

interface WalletDataContextType extends WalletData, CacheData {
  // Wallet methods
  refreshWalletData: () => Promise<void>
  fundWallet: (request: WalletFundRequest) => Promise<ServiceResponse>
  transferWallet: (request: WalletTransferRequest) => Promise<ServiceResponse>
  
  // Provider methods
  getProviders: (service: 'airtime' | 'data' | 'cable' | 'electricity') => Promise<any[]>
  refreshProviders: (service?: 'airtime' | 'data' | 'cable' | 'electricity') => Promise<void>
  
  // Plan methods
  getDataBundles: (providerId: string) => Promise<DataBundle[]>
  getCablePlans: (providerId: string) => Promise<CablePlan[]>
  refreshPlans: (service: 'data' | 'cable', providerId?: string) => Promise<void>
  
  // Live update control
  startLiveUpdates: () => void
  stopLiveUpdates: () => void
  isLiveUpdating: boolean
}

const WalletDataContext = createContext<WalletDataContextType | undefined>(undefined)

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const LIVE_UPDATE_INTERVAL = 30 * 1000 // 30 seconds

export const WalletDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const { refreshUserData } = useUserData()
  
  // Wallet state
  const [walletData, setWalletData] = useState<WalletData>({
    balance: null,
    recentTransactions: [],
    walletStats: null,
    loading: true,
    error: null,
    lastUpdated: null
  })

  // Cache state
  const [cacheData, setCacheData] = useState<CacheData>({
    providers: {
      airtime: [],
      data: [],
      cable: [],
      electricity: [],
      lastUpdated: {}
    },
    plans: {
      dataBundles: {},
      cablePlans: {},
      lastUpdated: {}
    },
    loading: false,
    error: null
  })

  // Live update state
  const [isLiveUpdating, setIsLiveUpdating] = useState(false)
  const liveUpdateInterval = useRef<NodeJS.Timeout | null>(null)

  // Wallet methods
  const refreshWalletData = useCallback(async () => {
    if (!isAuthenticated) {
      setWalletData({
        balance: null,
        recentTransactions: [],
        walletStats: null,
        loading: false,
        error: null,
        lastUpdated: null
      })
      return
    }

    try {
      setWalletData(prev => ({ ...prev, loading: true, error: null }))

      console.log("🔄 [WalletData] Fetching wallet data...")

      // Fetch wallet balance
      const balanceResult = await WalletApiService.getWalletBalance()
      const balance = balanceResult.success ? balanceResult.data : null

      // Fetch recent transactions
      const transactionsResult = await WalletApiService.getWalletTransactions(10)
      const transactions = transactionsResult.success ? transactionsResult.data || [] : []

      // Fetch wallet stats
      const statsResult = await WalletApiService.getWalletStats('month')
      const stats = statsResult.success ? statsResult.data : null

      setWalletData({
        balance,
        recentTransactions: transactions,
        walletStats: stats,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      })

      console.log("✅ [WalletData] Wallet data loaded successfully")

    } catch (error: any) {
      console.error("❌ [WalletData] Failed to load wallet data:", error)
      setWalletData(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to load wallet data"
      }))
    }
  }, [isAuthenticated])

  const fundWallet = useCallback(async (request: WalletFundRequest): Promise<ServiceResponse> => {
    try {
      console.log("💰 [WalletData] Processing wallet funding...")
      const result = await WalletApiService.fundWallet(request)
      
      if (result.success) {
        // Refresh wallet data and user profile to update balance
        await Promise.all([
          refreshWalletData(),
          refreshUserData()
        ])
        console.log("✅ [WalletData] Wallet funded successfully")
      }
      
      return result
    } catch (error: any) {
      console.error("❌ [WalletData] Wallet funding failed:", error)
      return {
        success: false,
        message: error.message || "Failed to fund wallet",
        error: {
          message: error.message || "Failed to fund wallet"
        }
      }
    }
  }, [refreshWalletData, refreshUserData])

  const transferWallet = useCallback(async (request: WalletTransferRequest): Promise<ServiceResponse> => {
    try {
      console.log("📤 [WalletData] Processing wallet transfer...")
      const result = await WalletApiService.transferFunds(request)
      
      if (result.success) {
        // Refresh wallet data and user profile to update balance
        await Promise.all([
          refreshWalletData(),
          refreshUserData()
        ])
        console.log("✅ [WalletData] Transfer completed successfully")
      }
      
      return result
    } catch (error: any) {
      console.error("❌ [WalletData] Wallet transfer failed:", error)
      return {
        success: false,
        message: error.message || "Failed to transfer funds",
        error: {
          message: error.message || "Failed to transfer funds"
        }
      }
    }
  }, [refreshWalletData, refreshUserData])

  // Provider cache methods
  const isProviderCacheValid = useCallback((service: string): boolean => {
    const lastUpdated = cacheData.providers.lastUpdated[service]
    return lastUpdated && (Date.now() - lastUpdated) < CACHE_DURATION
  }, [cacheData.providers.lastUpdated])

  const getProviders = useCallback(async (service: 'airtime' | 'data' | 'cable' | 'electricity'): Promise<any[]> => {
    // Return cached data if valid
    if (isProviderCacheValid(service) && cacheData.providers[service].length > 0) {
      console.log(`📋 [WalletData] Using cached ${service} providers`)
      return cacheData.providers[service]
    }

    // Fetch fresh data
    try {
      console.log(`🔄 [WalletData] Fetching ${service} providers...`)
      let providers: any[] = []

      switch (service) {
        case 'airtime':
          providers = await airtimeService.getProviders()
          break
        case 'data':
          providers = await dataService.getProviders()
          break
        case 'cable':
          providers = await cableService.getProviders()
          break
        case 'electricity':
          providers = await electricityService.getProviders()
          break
      }

      // Update cache
      setCacheData(prev => ({
        ...prev,
        providers: {
          ...prev.providers,
          [service]: providers,
          lastUpdated: {
            ...prev.providers.lastUpdated,
            [service]: Date.now()
          }
        }
      }))

      console.log(`✅ [WalletData] ${service} providers loaded and cached`)
      return providers

    } catch (error: any) {
      console.error(`❌ [WalletData] Failed to fetch ${service} providers:`, error)
      // Return cached data if available, even if expired
      return cacheData.providers[service] || []
    }
  }, [isProviderCacheValid, cacheData.providers])

  const refreshProviders = useCallback(async (service?: 'airtime' | 'data' | 'cable' | 'electricity'): Promise<void> => {
    const services = service ? [service] : ['airtime', 'data', 'cable', 'electricity'] as const

    try {
      setCacheData(prev => ({ ...prev, loading: true, error: null }))

      const promises = services.map(async (svc) => {
        try {
          let providers: any[] = []

          switch (svc) {
            case 'airtime':
              providers = await airtimeService.getProviders()
              break
            case 'data':
              providers = await dataService.getProviders()
              break
            case 'cable':
              providers = await cableService.getProviders()
              break
            case 'electricity':
              providers = await electricityService.getProviders()
              break
          }

          return { service: svc, providers }
        } catch (error) {
          console.error(`Failed to refresh ${svc} providers:`, error)
          return { service: svc, providers: [] }
        }
      })

      const results = await Promise.all(promises)

      setCacheData(prev => ({
        ...prev,
        providers: {
          ...prev.providers,
          ...results.reduce((acc, { service: svc, providers }) => {
            acc[svc] = providers
            acc.lastUpdated[svc] = Date.now()
            return acc
          }, {} as any),
          lastUpdated: {
            ...prev.providers.lastUpdated,
            ...results.reduce((acc, { service: svc }) => {
              acc[svc] = Date.now()
              return acc
            }, {} as any)
          }
        },
        loading: false
      }))

      console.log(`✅ [WalletData] Providers refreshed for:`, services.join(', '))

    } catch (error: any) {
      console.error("❌ [WalletData] Failed to refresh providers:", error)
      setCacheData(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to refresh providers"
      }))
    }
  }, [])

  // Plan cache methods
  const isPlanCacheValid = useCallback((service: string, providerId: string): boolean => {
    const cacheKey = `${service}-${providerId}`
    const lastUpdated = cacheData.plans.lastUpdated[cacheKey]
    return lastUpdated && (Date.now() - lastUpdated) < CACHE_DURATION
  }, [cacheData.plans.lastUpdated])

  const getDataBundles = useCallback(async (providerId: string): Promise<DataBundle[]> => {
    // Return cached data if valid
    if (isPlanCacheValid('data', providerId) && cacheData.plans.dataBundles[providerId]) {
      console.log(`📋 [WalletData] Using cached data bundles for provider ${providerId}`)
      return cacheData.plans.dataBundles[providerId]
    }

    // Fetch fresh data
    try {
      console.log(`🔄 [WalletData] Fetching data bundles for provider ${providerId}...`)
      const bundles = await dataService.getDataBundles(providerId)

      // Update cache
      const cacheKey = `data-${providerId}`
      setCacheData(prev => ({
        ...prev,
        plans: {
          ...prev.plans,
          dataBundles: {
            ...prev.plans.dataBundles,
            [providerId]: bundles
          },
          lastUpdated: {
            ...prev.plans.lastUpdated,
            [cacheKey]: Date.now()
          }
        }
      }))

      console.log(`✅ [WalletData] Data bundles loaded and cached for provider ${providerId}`)
      return bundles

    } catch (error: any) {
      console.error(`❌ [WalletData] Failed to fetch data bundles for provider ${providerId}:`, error)
      // Return cached data if available, even if expired
      return cacheData.plans.dataBundles[providerId] || []
    }
  }, [isPlanCacheValid, cacheData.plans])

  const getCablePlans = useCallback(async (providerId: string): Promise<CablePlan[]> => {
    // Return cached data if valid
    if (isPlanCacheValid('cable', providerId) && cacheData.plans.cablePlans[providerId]) {
      console.log(`📋 [WalletData] Using cached cable plans for provider ${providerId}`)
      return cacheData.plans.cablePlans[providerId]
    }

    // Fetch fresh data
    try {
      console.log(`🔄 [WalletData] Fetching cable plans for provider ${providerId}...`)
      const plans = await cableService.getPlans(providerId)

      // Update cache
      const cacheKey = `cable-${providerId}`
      setCacheData(prev => ({
        ...prev,
        plans: {
          ...prev.plans,
          cablePlans: {
            ...prev.plans.cablePlans,
            [providerId]: plans
          },
          lastUpdated: {
            ...prev.plans.lastUpdated,
            [cacheKey]: Date.now()
          }
        }
      }))

      console.log(`✅ [WalletData] Cable plans loaded and cached for provider ${providerId}`)
      return plans

    } catch (error: any) {
      console.error(`❌ [WalletData] Failed to fetch cable plans for provider ${providerId}:`, error)
      // Return cached data if available, even if expired
      return cacheData.plans.cablePlans[providerId] || []
    }
  }, [isPlanCacheValid, cacheData.plans])

  const refreshPlans = useCallback(async (service: 'data' | 'cable', providerId?: string): Promise<void> => {
    try {
      setCacheData(prev => ({ ...prev, loading: true, error: null }))

      if (service === 'data') {
        if (providerId) {
          // Refresh specific provider
          const bundles = await dataService.getDataBundles(providerId)
          const cacheKey = `data-${providerId}`
          
          setCacheData(prev => ({
            ...prev,
            plans: {
              ...prev.plans,
              dataBundles: {
                ...prev.plans.dataBundles,
                [providerId]: bundles
              },
              lastUpdated: {
                ...prev.plans.lastUpdated,
                [cacheKey]: Date.now()
              }
            },
            loading: false
          }))
        } else {
          // Refresh all data providers
          const providers = await getProviders('data')
          const promises = providers.map(async (provider) => {
            try {
              const bundles = await dataService.getDataBundles(provider.id)
              return { providerId: provider.id, bundles }
            } catch (error) {
              console.error(`Failed to refresh data bundles for ${provider.id}:`, error)
              return { providerId: provider.id, bundles: [] }
            }
          })

          const results = await Promise.all(promises)
          
          setCacheData(prev => ({
            ...prev,
            plans: {
              ...prev.plans,
              dataBundles: results.reduce((acc, { providerId: pid, bundles }) => {
                acc[pid] = bundles
                return acc
              }, {} as Record<string, DataBundle[]>),
              lastUpdated: {
                ...prev.plans.lastUpdated,
                ...results.reduce((acc, { providerId: pid }) => {
                  acc[`data-${pid}`] = Date.now()
                  return acc
                }, {} as Record<string, number>)
              }
            },
            loading: false
          }))
        }
      } else if (service === 'cable') {
        if (providerId) {
          // Refresh specific provider
          const plans = await cableService.getPlans(providerId)
          const cacheKey = `cable-${providerId}`
          
          setCacheData(prev => ({
            ...prev,
            plans: {
              ...prev.plans,
              cablePlans: {
                ...prev.plans.cablePlans,
                [providerId]: plans
              },
              lastUpdated: {
                ...prev.plans.lastUpdated,
                [cacheKey]: Date.now()
              }
            },
            loading: false
          }))
        } else {
          // Refresh all cable providers
          const providers = await getProviders('cable')
          const promises = providers.map(async (provider) => {
            try {
              const plans = await cableService.getPlans(provider.id)
              return { providerId: provider.id, plans }
            } catch (error) {
              console.error(`Failed to refresh cable plans for ${provider.id}:`, error)
              return { providerId: provider.id, plans: [] }
            }
          })

          const results = await Promise.all(promises)
          
          setCacheData(prev => ({
            ...prev,
            plans: {
              ...prev.plans,
              cablePlans: results.reduce((acc, { providerId: pid, plans }) => {
                acc[pid] = plans
                return acc
              }, {} as Record<string, CablePlan[]>),
              lastUpdated: {
                ...prev.plans.lastUpdated,
                ...results.reduce((acc, { providerId: pid }) => {
                  acc[`cable-${pid}`] = Date.now()
                  return acc
                }, {} as Record<string, number>)
              }
            },
            loading: false
          }))
        }
      }

      console.log(`✅ [WalletData] ${service} plans refreshed`)

    } catch (error: any) {
      console.error(`❌ [WalletData] Failed to refresh ${service} plans:`, error)
      setCacheData(prev => ({
        ...prev,
        loading: false,
        error: error.message || `Failed to refresh ${service} plans`
      }))
    }
  }, [getProviders])

  // Live update methods
  const startLiveUpdates = useCallback(() => {
    if (liveUpdateInterval.current || !isAuthenticated) return

    console.log("🔴 [WalletData] Starting live updates...")
    setIsLiveUpdating(true)
    
    liveUpdateInterval.current = setInterval(() => {
      refreshWalletData()
    }, LIVE_UPDATE_INTERVAL)
  }, [isAuthenticated, refreshWalletData])

  const stopLiveUpdates = useCallback(() => {
    if (liveUpdateInterval.current) {
      console.log("⏹️ [WalletData] Stopping live updates...")
      clearInterval(liveUpdateInterval.current)
      liveUpdateInterval.current = null
      setIsLiveUpdating(false)
    }
  }, [])

  // Initialize wallet data when authenticated
  useEffect(() => {
    refreshWalletData()
  }, [refreshWalletData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLiveUpdates()
    }
  }, [stopLiveUpdates])

  return (
    <WalletDataContext.Provider
      value={{
        // Wallet data
        ...walletData,
        
        // Cache data
        ...cacheData,
        
        // Wallet methods
        refreshWalletData,
        fundWallet,
        transferWallet,
        
        // Provider methods
        getProviders,
        refreshProviders,
        
        // Plan methods
        getDataBundles,
        getCablePlans,
        refreshPlans,
        
        // Live update methods
        startLiveUpdates,
        stopLiveUpdates,
        isLiveUpdating
      }}
    >
      {children}
    </WalletDataContext.Provider>
  )
}

export const useWalletData = () => {
  const context = useContext(WalletDataContext)
  if (!context) {
    throw new Error("useWalletData must be used within a WalletDataProvider")
  }
  return context
}
