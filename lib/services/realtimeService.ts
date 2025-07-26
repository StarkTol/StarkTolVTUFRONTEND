/**
 * Real-time Synchronization Service
 * 
 * Manages real-time updates for user data, wallet balance, 
 * transactions, and other dynamic content using Supabase.
 */

import { supabase } from '@/lib/supabaseClient'
import { RealtimeChannel } from '@supabase/supabase-js'

export type RealtimeEventHandler = (payload: any) => void

export interface RealtimeSubscription {
  id: string
  channel: RealtimeChannel
  cleanup: () => void
}

export class RealtimeService {
  private subscriptions: Map<string, RealtimeSubscription> = new Map()
  private userId: string | null = null
  private isConnected: boolean = false

  /**
   * Initialize the service with user ID
   */
  init(userId: string) {
    this.userId = userId
    this.isConnected = true
    console.log('🔴 [Realtime] Service initialized for user:', userId)
  }

  /**
   * Cleanup all subscriptions
   */
  cleanup() {
    console.log('🧹 [Realtime] Cleaning up all subscriptions...')
    this.subscriptions.forEach(sub => sub.cleanup())
    this.subscriptions.clear()
    this.userId = null
    this.isConnected = false
  }

  /**
   * Subscribe to wallet balance changes
   */
  subscribeToWalletChanges(onWalletUpdate: RealtimeEventHandler): string {
    if (!this.userId) {
      console.error('❌ [Realtime] Cannot subscribe to wallet changes: No user ID')
      return ''
    }

    const subscriptionId = `wallet-${this.userId}`
    
    // Remove existing subscription if any
    this.unsubscribe(subscriptionId)

    console.log('🔔 [Realtime] Subscribing to wallet changes for user:', this.userId)

    const channel = supabase
      .channel(`wallet-updates-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${this.userId}`
        },
        (payload) => {
          console.log('💰 [Realtime] Wallet update received:', payload)
          onWalletUpdate(payload)
        }
      )
      .subscribe((status) => {
        console.log('🔔 [Realtime] Wallet subscription status:', status)
      })

    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      channel,
      cleanup: () => {
        console.log('🧹 [Realtime] Cleaning up wallet subscription')
        supabase.removeChannel(channel)
      }
    }

    this.subscriptions.set(subscriptionId, subscription)
    return subscriptionId
  }

  /**
   * Subscribe to transaction changes
   */
  subscribeToTransactionChanges(onTransactionUpdate: RealtimeEventHandler): string {
    if (!this.userId) {
      console.error('❌ [Realtime] Cannot subscribe to transaction changes: No user ID')
      return ''
    }

    const subscriptionId = `transactions-${this.userId}`
    
    // Remove existing subscription if any
    this.unsubscribe(subscriptionId)

    console.log('🔔 [Realtime] Subscribing to transaction changes for user:', this.userId)

    const channel = supabase
      .channel(`transaction-updates-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${this.userId}`
        },
        (payload) => {
          console.log('📊 [Realtime] Transaction update received:', payload)
          onTransactionUpdate(payload)
        }
      )
      .subscribe((status) => {
        console.log('🔔 [Realtime] Transaction subscription status:', status)
      })

    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      channel,
      cleanup: () => {
        console.log('🧹 [Realtime] Cleaning up transaction subscription')
        supabase.removeChannel(channel)
      }
    }

    this.subscriptions.set(subscriptionId, subscription)
    return subscriptionId
  }

  /**
   * Subscribe to user profile changes
   */
  subscribeToProfileChanges(onProfileUpdate: RealtimeEventHandler): string {
    if (!this.userId) {
      console.error('❌ [Realtime] Cannot subscribe to profile changes: No user ID')
      return ''
    }

    const subscriptionId = `profile-${this.userId}`
    
    // Remove existing subscription if any
    this.unsubscribe(subscriptionId)

    console.log('🔔 [Realtime] Subscribing to profile changes for user:', this.userId)

    const channel = supabase
      .channel(`profile-updates-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${this.userId}`
        },
        (payload) => {
          console.log('👤 [Realtime] Profile update received:', payload)
          onProfileUpdate(payload)
        }
      )
      .subscribe((status) => {
        console.log('🔔 [Realtime] Profile subscription status:', status)
      })

    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      channel,
      cleanup: () => {
        console.log('🧹 [Realtime] Cleaning up profile subscription')
        supabase.removeChannel(channel)
      }
    }

    this.subscriptions.set(subscriptionId, subscription)
    return subscriptionId
  }

  /**
   * Subscribe to notifications
   */
  subscribeToNotifications(onNotificationUpdate: RealtimeEventHandler): string {
    if (!this.userId) {
      console.error('❌ [Realtime] Cannot subscribe to notifications: No user ID')
      return ''
    }

    const subscriptionId = `notifications-${this.userId}`
    
    // Remove existing subscription if any
    this.unsubscribe(subscriptionId)

    console.log('🔔 [Realtime] Subscribing to notifications for user:', this.userId)

    const channel = supabase
      .channel(`notification-updates-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${this.userId}`
        },
        (payload) => {
          console.log('🔔 [Realtime] Notification update received:', payload)
          onNotificationUpdate(payload)
        }
      )
      .subscribe((status) => {
        console.log('🔔 [Realtime] Notification subscription status:', status)
      })

    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      channel,
      cleanup: () => {
        console.log('🧹 [Realtime] Cleaning up notification subscription')
        supabase.removeChannel(channel)
      }
    }

    this.subscriptions.set(subscriptionId, subscription)
    return subscriptionId
  }

  /**
   * Subscribe to service transactions (VTU purchases, etc.)
   */
  subscribeToServiceTransactions(onServiceUpdate: RealtimeEventHandler): string {
    if (!this.userId) {
      console.error('❌ [Realtime] Cannot subscribe to service transactions: No user ID')
      return ''
    }

    const subscriptionId = `services-${this.userId}`
    
    // Remove existing subscription if any
    this.unsubscribe(subscriptionId)

    console.log('🔔 [Realtime] Subscribing to service transactions for user:', this.userId)

    const channel = supabase
      .channel(`service-updates-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_transactions',
          filter: `user_id=eq.${this.userId}`
        },
        (payload) => {
          console.log('⚡ [Realtime] Service transaction update received:', payload)
          onServiceUpdate(payload)
        }
      )
      .subscribe((status) => {
        console.log('🔔 [Realtime] Service subscription status:', status)
      })

    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      channel,
      cleanup: () => {
        console.log('🧹 [Realtime] Cleaning up service subscription')
        supabase.removeChannel(channel)
      }
    }

    this.subscriptions.set(subscriptionId, subscription)
    return subscriptionId
  }

  /**
   * Unsubscribe from a specific subscription
   */
  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId)
    if (subscription) {
      subscription.cleanup()
      this.subscriptions.delete(subscriptionId)
      console.log('✅ [Realtime] Unsubscribed from:', subscriptionId)
      return true
    }
    return false
  }

  /**
   * Get current subscription status
   */
  getSubscriptionStatus(): {
    isConnected: boolean
    userId: string | null
    activeSubscriptions: string[]
  } {
    return {
      isConnected: this.isConnected,
      userId: this.userId,
      activeSubscriptions: Array.from(this.subscriptions.keys())
    }
  }

  /**
   * Setup comprehensive real-time subscriptions for user
   */
  setupUserSubscriptions(callbacks: {
    onWalletUpdate?: RealtimeEventHandler
    onTransactionUpdate?: RealtimeEventHandler
    onProfileUpdate?: RealtimeEventHandler
    onNotificationUpdate?: RealtimeEventHandler
    onServiceUpdate?: RealtimeEventHandler
  }) {
    const subscriptionIds: string[] = []

    if (callbacks.onWalletUpdate) {
      subscriptionIds.push(this.subscribeToWalletChanges(callbacks.onWalletUpdate))
    }

    if (callbacks.onTransactionUpdate) {
      subscriptionIds.push(this.subscribeToTransactionChanges(callbacks.onTransactionUpdate))
    }

    if (callbacks.onProfileUpdate) {
      subscriptionIds.push(this.subscribeToProfileChanges(callbacks.onProfileUpdate))
    }

    if (callbacks.onNotificationUpdate) {
      subscriptionIds.push(this.subscribeToNotifications(callbacks.onNotificationUpdate))
    }

    if (callbacks.onServiceUpdate) {
      subscriptionIds.push(this.subscribeToServiceTransactions(callbacks.onServiceUpdate))
    }

    console.log('✅ [Realtime] Setup complete. Active subscriptions:', subscriptionIds)
    return subscriptionIds
  }
}

// Create and export singleton instance
export const realtimeService = new RealtimeService()

// Export utility functions
export const initRealtime = (userId: string) => realtimeService.init(userId)
export const cleanupRealtime = () => realtimeService.cleanup()
export const subscribeToWallet = (handler: RealtimeEventHandler) => realtimeService.subscribeToWalletChanges(handler)
export const subscribeToTransactions = (handler: RealtimeEventHandler) => realtimeService.subscribeToTransactionChanges(handler)
export const subscribeToProfile = (handler: RealtimeEventHandler) => realtimeService.subscribeToProfileChanges(handler)
export const subscribeToNotifications = (handler: RealtimeEventHandler) => realtimeService.subscribeToNotifications(handler)
