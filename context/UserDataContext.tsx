"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from "react"
import { useAuth } from "./authContext"
import api from "@/lib/api"
import { supabase } from "@/lib/supabaseClient"

interface UserData {
  profile: {
    id: string
    email: string
    full_name: string
    phone: string
    wallet_balance: number
    total_spent: number
    referral_bonus: number
    created_at: string
    updated_at: string
  } | null
  transactions: any[]
  usageStats: {
    weekly: { airtime: number; data: number }
    monthly: { airtime: number; data: number }
    yearly: { airtime: number; data: number }
  }
  loading: boolean
  error: string | null
}

interface UserDataContextType extends UserData {
  refreshUserData: () => Promise<void>
  refreshTransactions: () => Promise<void>
  updateWalletBalance: (newBalance: number) => void
  isBalanceLoading: boolean
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<UserData['profile']>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [usageStats, setUsageStats] = useState<UserData['usageStats']>({
    weekly: { airtime: 0, data: 0 },
    monthly: { airtime: 0, data: 0 },
    yearly: { airtime: 0, data: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const refreshUserData = async () => {
    if (!isAuthenticated || !user) {
      setProfile(null)
      setTransactions([])
      setUsageStats({
        weekly: { airtime: 0, data: 0 },
        monthly: { airtime: 0, data: 0 },
        yearly: { airtime: 0, data: 0 },
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log("🔄 [UserData] Fetching user data for:", user.email)
      console.log("🔄 [UserData] Current auth state:", {
        userId: user.id,
        email: user.email,
        hasAccessToken: !!localStorage.getItem('access_token'),
        hasRefreshToken: !!localStorage.getItem('refresh_token')
      })

      // Fetch profile data first (most critical)
      let profileData = null
      try {
        console.log("🔄 [UserData] Making API call to /user/profile...");
        const profileRes = await api.get("/user/profile")
        profileData = profileRes.data?.data || profileRes.data
        console.log("✅ [UserData] Profile data loaded:", profileData)
      } catch (profileErr: any) {
        console.error("❌ [UserData] Profile API call failed:")
        console.error("❌ [UserData] Error details:", profileErr)
        console.error("❌ [UserData] Error message:", profileErr.message)
        throw new Error(`Failed to load profile data: ${profileErr.message}`)
      }

      // Validate that the profile belongs to the current user
      console.log("🔍 [UserData] Validating user data:", {
        authUserId: user.id,
        profileId: profileData?.id,
        authUserEmail: user.email,
        profileEmail: profileData?.email
      })
      
      // Check if user IDs match (try multiple possible fields)
      const profileUserId = profileData?.id || profileData?.user_id || profileData?.userId
      const authUserId = user.id || user.user_id || user.userId
      
      // Validate user ownership - check both ID and email
      const userMatches = (
        (profileUserId && authUserId && profileUserId.toString() === authUserId.toString()) ||
        (profileData?.email && user.email && profileData.email.toLowerCase() === user.email.toLowerCase())
      )
      
      if (!userMatches && profileData) {
        console.warn("🚨 [UserData] Profile data doesn't match authenticated user!", {
          expectedUserId: authUserId,
          receivedUserId: profileUserId,
          expectedEmail: user.email,
          receivedEmail: profileData.email
        })
        
        // In development, log but continue; in production, this should be an error
        if (process.env.NODE_ENV === 'production') {
          throw new Error('User data validation failed: Profile data does not belong to authenticated user')
        }
      }
      
      console.log("✅ [UserData] User validation passed")

      // Fetch transactions (optional)
      let transactionsList = []
      try {
        const transactionsRes = await api.get("/transactions?limit=5")
        transactionsList = transactionsRes.data?.transactions || transactionsRes.data?.data || []
        console.log("✅ [UserData] Transactions loaded:", transactionsList.length, "items")
      } catch (transErr: any) {
        console.warn("⚠️ [UserData] Failed to load transactions:", transErr.response?.status, transErr.message)
      }

      // Fetch usage stats (optional)
      let stats: UserData['usageStats'] = {
        weekly: { airtime: 0, data: 0 },
        monthly: { airtime: 0, data: 0 },
        yearly: { airtime: 0, data: 0 },
      }
      try {
        const statsRes = await api.get("/stats/usage")
        const apiStats = statsRes.data?.data || {}
        stats = {
          weekly: apiStats.weekly || { airtime: 0, data: 0 },
          monthly: apiStats.monthly || { airtime: 0, data: 0 },
          yearly: apiStats.yearly || { airtime: 0, data: 0 },
        }
        console.log("✅ [UserData] Usage stats loaded:", stats)
      } catch (statsErr: any) {
        console.warn("⚠️ [UserData] Failed to load usage stats:", statsErr.response?.status, statsErr.message)
      }

      setProfile(profileData)
      setTransactions(transactionsList)
      setUsageStats({
        weekly: stats.weekly || { airtime: 0, data: 0 },
        monthly: stats.monthly || { airtime: 0, data: 0 },
        yearly: stats.yearly || { airtime: 0, data: 0 },
      })

      console.log("🎉 [UserData] All user data loaded successfully")

    } catch (err: any) {
      console.error("❌ [UserData] Critical error:", err)
      setError(err.message || "Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  const refreshTransactions = async () => {
    if (!isAuthenticated || !user) return

    try {
      const response = await api.get("/transactions?limit=10")
      const transactionsList = response.data?.transactions || response.data?.data || []
      setTransactions(transactionsList)
    } catch (err: any) {
      console.error("Failed to refresh transactions:", err)
    }
  }

  // Function to update wallet balance in profile
  const updateWalletBalance = (newBalance: number) => {
    setProfile(prev => {
      if (!prev) return prev
      return {
        ...prev,
        wallet_balance: newBalance
      }
    })
    console.log("💰 [UserData] Wallet balance updated:", newBalance)
  }

  // Function to fetch wallet balance from API
  const fetchWalletBalance = async () => {
    if (!isAuthenticated || !user) return

    try {
      setIsBalanceLoading(true)
      console.log("🔄 [UserData] Fetching wallet balance...")
      const response = await api.get("/wallet/balance")
      const balance = response.data?.balance || response.data?.data?.balance || 0
      updateWalletBalance(balance)
      console.log("✅ [UserData] Balance fetched:", balance)
    } catch (err: any) {
      console.warn("⚠️ [UserData] Failed to fetch wallet balance:", err.message)
    } finally {
      setIsBalanceLoading(false)
    }
  }

  // Setup polling fallback if realtime subscription fails
  const setupBalancePolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
    
    console.log("⚡ [UserData] Setting up wallet balance polling (10s interval)")
    pollingIntervalRef.current = setInterval(() => {
      fetchWalletBalance()
    }, 10000) // Poll every 10 seconds
  }

  // Cleanup polling
  const cleanupBalancePolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      console.log("🛑 [UserData] Wallet balance polling stopped")
    }
  }

  useEffect(() => {
    refreshUserData();

    if (!user || !isAuthenticated) return;

    // Subscribe to wallet balance changes for this user
    const walletSub = supabase
      .channel('wallet-balance')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Refresh user data when wallet changes
          refreshUserData();
        }
      )
      .subscribe();

    // Subscribe to new notifications for this user
    const notifSub = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Optionally, you can refresh notifications or show a toast here
          refreshUserData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(walletSub);
      supabase.removeChannel(notifSub);
    };
  }, [user, isAuthenticated]);

  return (
    <UserDataContext.Provider
      value={{
        profile,
        transactions,
        usageStats,
        loading,
        error,
        refreshUserData,
        refreshTransactions,
        updateWalletBalance,
        isBalanceLoading,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export const useUserData = () => {
  const context = useContext(UserDataContext)
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider")
  }
  return context
}
