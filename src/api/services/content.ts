/**
 * Content API Service
 * 
 * Manages content like FAQ, team information, and service menu
 */

import { BaseEndpoint } from '../endpoints/base'
import type { 
  ApiResponse,
  FaqCategory,
  TeamMember,
  ServiceMenuItem
} from '../types'

export class ContentService extends BaseEndpoint {
  constructor() {
    super('')
  }

  /**
   * Get FAQ categories and questions
   */
  async getFaq(): Promise<ApiResponse<FaqCategory[]>> {
    return this.get<FaqCategory[]>('/content/faq')
  }

  /**
   * Get team members information
   */
  async getTeam(): Promise<ApiResponse<TeamMember[]>> {
    return this.get<TeamMember[]>('/content/team')
  }

  /**
   * Get service menu items
   */
  async getMenu(): Promise<ApiResponse<ServiceMenuItem[]>> {
    return this.get<ServiceMenuItem[]>('/services/menu')
  }
}

// Export singleton instance
export const contentService = new ContentService()

