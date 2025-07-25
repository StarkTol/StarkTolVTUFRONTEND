import api from '@/lib/api'
import { executeApiRequest } from './error-handler'
import { ServiceResponse } from './types'

export interface Notification {
  id: string
  type: 'transaction' | 'wallet' | 'system' | 'promotion' | 'security'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  metadata?: {
    transactionReference?: string
    amount?: number
    actionUrl?: string
    [key: string]: any
  }
}

/**
 * Notifications API Service
 * Handles all notification-related API calls
 */
export class NotificationsApiService {
  /**
   * Get all notifications for the user
   */
  static async getNotifications(
    limit: number = 20,
    offset: number = 0,
    unreadOnly: boolean = false
  ): Promise<ServiceResponse<{
    notifications: Notification[];
    unreadCount: number;
    totalCount: number;
  }>> {
    return executeApiRequest<{
      notifications: Notification[];
      unreadCount: number;
      totalCount: number;
    }>(
      () => {
        let url = `/notifications?limit=${limit}&offset=${offset}`
        if (unreadOnly) url += '&unread_only=true'
        return api.get(url)
      },
      'Notifications retrieved successfully',
      'Failed to load notifications'
    )
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(): Promise<ServiceResponse<{ count: number }>> {
    return executeApiRequest<{ count: number }>(
      () => api.get('/notifications/unread-count'),
      'Unread count retrieved',
      'Failed to get unread count'
    )
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<ServiceResponse<{ success: boolean }>> {
    return executeApiRequest<{ success: boolean }>(
      () => api.patch(`/notifications/${notificationId}/read`),
      'Notification marked as read',
      'Failed to mark notification as read'
    )
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<ServiceResponse<{ success: boolean }>> {
    return executeApiRequest<{ success: boolean }>(
      () => api.patch('/notifications/mark-all-read'),
      'All notifications marked as read',
      'Failed to mark all notifications as read'
    )
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<ServiceResponse<{ success: boolean }>> {
    return executeApiRequest<{ success: boolean }>(
      () => api.delete(`/notifications/${notificationId}`),
      'Notification deleted successfully',
      'Failed to delete notification'
    )
  }

  /**
   * Clear all notifications
   */
  static async clearAllNotifications(): Promise<ServiceResponse<{ success: boolean }>> {
    return executeApiRequest<{ success: boolean }>(
      () => api.delete('/notifications/clear-all'),
      'All notifications cleared',
      'Failed to clear notifications'
    )
  }

  /**
   * Update notification preferences
   */
  static async updatePreferences(preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    transactionAlerts: boolean;
    promotionalOffers: boolean;
    securityAlerts: boolean;
  }): Promise<ServiceResponse<{ success: boolean }>> {
    return executeApiRequest<{ success: boolean }>(
      () => api.patch('/notifications/preferences', preferences),
      'Notification preferences updated',
      'Failed to update preferences'
    )
  }

  /**
   * Get notification preferences
   */
  static async getPreferences(): Promise<ServiceResponse<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    transactionAlerts: boolean;
    promotionalOffers: boolean;
    securityAlerts: boolean;
  }>> {
    return executeApiRequest<{
      emailNotifications: boolean;
      pushNotifications: boolean;
      smsNotifications: boolean;
      transactionAlerts: boolean;
      promotionalOffers: boolean;
      securityAlerts: boolean;
    }>(
      () => api.get('/notifications/preferences'),
      'Notification preferences retrieved',
      'Failed to load notification preferences'
    )
  }
}

// Export individual functions for convenience
export const getNotifications = NotificationsApiService.getNotifications
export const getUnreadNotificationsCount = NotificationsApiService.getUnreadCount
export const markNotificationAsRead = NotificationsApiService.markAsRead
export const markAllNotificationsAsRead = NotificationsApiService.markAllAsRead
export const deleteNotification = NotificationsApiService.deleteNotification
export const clearAllNotifications = NotificationsApiService.clearAllNotifications
export const updateNotificationPreferences = NotificationsApiService.updatePreferences
export const getNotificationPreferences = NotificationsApiService.getPreferences

// Export service instance
export default NotificationsApiService
