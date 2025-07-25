/**
 * Auto Refill API Service
 * 
 * Manages auto refill schedules for services
 */

import { BaseEndpoint } from '../endpoints/base'
import type { 
  ApiResponse,
  AutoRefillSchedule,
  CreateAutoRefillRequest,
  UpdateAutoRefillRequest
} from '../types'

export class AutoRefillService extends BaseEndpoint {
  constructor() {
    super('')
  }

  /**
   * Get active auto refill schedules
   */
  async getAutoRefillSchedules(): Promise<ApiResponse<AutoRefillSchedule[]>> {
    return this.get<AutoRefillSchedule[]>('/auto-refill/schedules')
  }

  /**
   * Create new auto refill schedule
   */
  async createAutoRefill(request: CreateAutoRefillRequest): Promise<ApiResponse<AutoRefillSchedule>> {
    return this.post<AutoRefillSchedule>('/auto-refill/schedules', request)
  }

  /**
   * Update existing auto refill schedule
   */
  async updateAutoRefill(scheduleId: string, request: UpdateAutoRefillRequest): Promise<ApiResponse<AutoRefillSchedule>> {
    return this.put<AutoRefillSchedule>(`/auto-refill/schedules/${scheduleId}`, request)
  }

  /**
   * Delete an auto refill schedule
   */
  async deleteAutoRefill(scheduleId: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/auto-refill/schedules/${scheduleId}`)
  }

  /**
   * Pause an auto refill schedule
   */
  async pauseAutoRefill(scheduleId: string): Promise<ApiResponse<AutoRefillSchedule>> {
    return this.post<AutoRefillSchedule>(`/auto-refill/schedules/${scheduleId}/pause`, {})
  }

  /**
   * Resume a paused auto refill schedule
   */
  async resumeAutoRefill(scheduleId: string): Promise<ApiResponse<AutoRefillSchedule>> {
    return this.post<AutoRefillSchedule>(`/auto-refill/schedules/${scheduleId}/resume`, {})
  }
}

// Export singleton instance
export const autoRefillService = new AutoRefillService()

