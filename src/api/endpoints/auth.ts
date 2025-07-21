/**
 * Authentication API Endpoints
 */

import { BaseEndpoint, ENDPOINTS, validateRequired } from './base'
import type { 
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  User
} from '../types'
import type { ApiResponse } from '../httpClient'

export class AuthEndpoints extends BaseEndpoint {
  constructor() {
    super('') // No base URL prefix for auth endpoints
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    validateRequired(credentials, ['email', 'password'])
    
    return this.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email.toLowerCase(),
      password: credentials.password,
      remember_me: credentials.rememberMe
    })
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    validateRequired(userData, ['firstName', 'lastName', 'email', 'password', 'confirmPassword'])
    
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    return this.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email.toLowerCase(),
      password: userData.password,
      confirm_password: userData.confirmPassword,
      phone_number: userData.phoneNumber,
      referral_code: userData.referralCode
    })
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    validateRequired(request, ['refreshToken'])
    
    return this.post<AuthResponse>(ENDPOINTS.AUTH.REFRESH, {
      refresh_token: request.refreshToken
    })
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    return this.post<void>(ENDPOINTS.AUTH.LOGOUT)
  }

  /**
   * Request password reset
   */
  async forgotPassword(request: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> {
    validateRequired(request, ['email'])
    
    return this.post<{ message: string }>(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email: request.email.toLowerCase()
    })
  }

  /**
   * Confirm password reset
   */
  async resetPassword(request: PasswordResetConfirmRequest): Promise<ApiResponse<{ message: string }>> {
    validateRequired(request, ['token', 'password', 'confirmPassword'])
    
    if (request.password !== request.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    return this.post<{ message: string }>(ENDPOINTS.AUTH.RESET_PASSWORD, {
      token: request.token,
      password: request.password,
      confirm_password: request.confirmPassword
    })
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    validateRequired({ token }, ['token'])
    
    return this.post<{ message: string }>(ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    validateRequired({ email }, ['email'])
    
    return this.post<{ message: string }>(ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      email: email.toLowerCase()
    })
  }
}

// Create and export singleton instance
export const authApi = new AuthEndpoints()

// Export individual functions for convenience
export const login = (credentials: LoginRequest) => authApi.login(credentials)
export const register = (userData: RegisterRequest) => authApi.register(userData)
export const refreshToken = (request: RefreshTokenRequest) => authApi.refreshToken(request)
export const logout = () => authApi.logout()
export const forgotPassword = (request: PasswordResetRequest) => authApi.forgotPassword(request)
export const resetPassword = (request: PasswordResetConfirmRequest) => authApi.resetPassword(request)
export const verifyEmail = (token: string) => authApi.verifyEmail(token)
export const resendEmailVerification = (email: string) => authApi.resendEmailVerification(email)
