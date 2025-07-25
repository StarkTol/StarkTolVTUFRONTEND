import { toast } from 'sonner'

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: ApiError
}

/**
 * Centralized error handling with toast notifications
 */
export class ApiErrorHandler {
  /**
   * Handle API errors and show appropriate toast messages
   */
  static handleError(error: any, customMessage?: string): ApiError {
    console.error('API Error:', error)
    
    let apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
      details: error.response?.data || error
    }

    // Extract meaningful error message
    if (error.response?.data?.message) {
      apiError.message = error.response.data.message
    } else if (error.message) {
      apiError.message = error.message
    } else if (customMessage) {
      apiError.message = customMessage
    }

    // Show toast notification
    this.showErrorToast(apiError, customMessage)
    
    return apiError
  }

  /**
   * Show error toast with appropriate styling
   */
  private static showErrorToast(error: ApiError, customMessage?: string) {
    const description = customMessage || error.message
    toast.error(description)
  }

  /**
   * Show success toast
   */
  static showSuccess(message: string, title: string = 'Success') {
    toast.success(message)
  }

  /**
   * Get appropriate error title based on status code
   */
  private static getErrorTitle(status?: number): string {
    switch (status) {
      case 400:
        return 'Invalid Request'
      case 401:
        return 'Authentication Required'
      case 403:
        return 'Access Denied'
      case 404:
        return 'Not Found'
      case 422:
        return 'Validation Error'
      case 500:
        return 'Server Error'
      case 503:
        return 'Service Unavailable'
      default:
        return 'Request Failed'
    }
  }

  /**
   * Create a standardized API response
   */
  static createResponse<T>(
    success: boolean,
    message: string,
    data?: T,
    error?: ApiError
  ): ApiResponse<T> {
    return {
      success,
      message,
      data,
      error
    }
  }

  /**
   * Handle successful API responses with optional toast
   */
  static handleSuccess<T>(
    data: T,
    message: string = 'Operation completed successfully',
    showToast: boolean = false,
    toastTitle?: string
  ): ApiResponse<T> {
    if (showToast) {
      this.showSuccess(message, toastTitle)
    }
    
    return this.createResponse(true, message, data)
  }

  /**
   * Wrapper for async API calls with error handling
   */
  static async executeRequest<T>(
    request: () => Promise<any>,
    successMessage?: string,
    errorMessage?: string,
    showSuccessToast: boolean = false
  ): Promise<ApiResponse<T>> {
    try {
      const response = await request()
      const data = response.data?.data || response.data
      const message = response.data?.message || successMessage || 'Operation successful'
      
      return this.handleSuccess<T>(data, message, showSuccessToast)
    } catch (error) {
      const apiError = this.handleError(error, errorMessage)
      return this.createResponse<T>(false, apiError.message, undefined, apiError)
    }
  }
}

// Export convenience functions
export const handleApiError = ApiErrorHandler.handleError
export const showSuccessToast = ApiErrorHandler.showSuccess
export const executeApiRequest = ApiErrorHandler.executeRequest
