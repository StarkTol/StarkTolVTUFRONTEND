/**
 * API Services Index
 * Centralized exports for all API service modules
 */

// Error handling utilities
export * from './error-handler'

// Type definitions
export * from './types'

// Service modules
export * from './airtime'
export * from './data'
export * from './cable'
export * from './electricity'
export * from './wallet'
export * from './exam-cards'
export * from './recharge-cards'

// Service classes
export { default as AirtimeApiService } from './airtime'
export { default as DataApiService } from './data'
export { default as CableApiService } from './cable'
export { default as ElectricityApiService } from './electricity'
export { default as WalletApiService } from './wallet'
export { default as ExamCardsApiService } from './exam-cards'
export { default as RechargeCardsApiService } from './recharge-cards'

// Convenience object with all services
export const ApiServices = {
  Airtime: AirtimeApiService,
  Data: DataApiService,
  Cable: CableApiService,
  Electricity: ElectricityApiService,
  Wallet: WalletApiService,
  ExamCards: ExamCardsApiService,
  RechargeCards: RechargeCardsApiService
}

// Main API functions grouped by service
export const API = {
  // Airtime
  airtime: {
    getProviders: () => import('./airtime').then(m => m.getAirtimeProviders()),
    buy: (payload: any) => import('./airtime').then(m => m.buyAirtime(payload)),
    getTransactions: (limit?: number) => import('./airtime').then(m => m.getRecentAirtimeTransactions(limit)),
    validatePhoneNumber: (phone: string, provider: string) => 
      import('./airtime').then(m => m.validateAirtimePhoneNumber(phone, provider)),
    getTransaction: (ref: string) => import('./airtime').then(m => m.getAirtimeTransaction(ref))
  },

  // Data
  data: {
    getProviders: () => import('./data').then(m => m.getDataProviders()),
    getBundles: (providerId: string) => import('./data').then(m => m.getDataBundles(providerId)),
    getAllBundles: () => import('./data').then(m => m.getAllDataBundles()),
    buy: (payload: any) => import('./data').then(m => m.buyDataBundle(payload)),
    getTransactions: (limit?: number) => import('./data').then(m => m.getRecentDataTransactions(limit)),
    validatePhoneNumber: (phone: string, provider: string) => 
      import('./data').then(m => m.validateDataPhoneNumber(phone, provider)),
    getBundleDetails: (bundleId: string) => import('./data').then(m => m.getDataBundleDetails(bundleId)),
    getTransaction: (ref: string) => import('./data').then(m => m.getDataTransaction(ref))
  },

  // Cable
  cable: {
    getProviders: () => import('./cable').then(m => m.getCableProviders()),
    getPlans: (providerId: string) => import('./cable').then(m => m.getCablePlans(providerId)),
    buy: (payload: any) => import('./cable').then(m => m.buyCableSubscription(payload)),
    getTransactions: (limit?: number) => import('./cable').then(m => m.getRecentCableTransactions(limit)),
    validateSmartCard: (cardNumber: string, provider: string) => 
      import('./cable').then(m => m.validateSmartCard(cardNumber, provider)),
    getPlanDetails: (planId: string) => import('./cable').then(m => m.getCablePlanDetails(planId)),
    getTransaction: (ref: string) => import('./cable').then(m => m.getCableTransaction(ref)),
    getCustomerDetails: (cardNumber: string, provider: string) => 
      import('./cable').then(m => m.getCustomerDetails(cardNumber, provider))
  },

  // Electricity
  electricity: {
    getProviders: () => import('./electricity').then(m => m.getElectricityProviders()),
    buy: (payload: any) => import('./electricity').then(m => m.buyElectricity(payload)),
    getTransactions: (limit?: number) => import('./electricity').then(m => m.getRecentElectricityTransactions(limit)),
    validateMeterNumber: (meterNumber: string, provider: string, meterType: 'prepaid' | 'postpaid') => 
      import('./electricity').then(m => m.validateMeterNumber(meterNumber, provider, meterType)),
    getTransaction: (ref: string) => import('./electricity').then(m => m.getElectricityTransaction(ref)),
    getCustomerDetails: (meterNumber: string, provider: string, meterType: 'prepaid' | 'postpaid') => 
      import('./electricity').then(m => m.getElectricityCustomerDetails(meterNumber, provider, meterType)),
    getTariffInfo: (provider: string) => import('./electricity').then(m => m.getElectricityTariffInfo(provider)),
    checkTokenStatus: (ref: string) => import('./electricity').then(m => m.checkElectricityTokenStatus(ref))
  },

  // Wallet
  wallet: {
    getBalance: () => import('./wallet').then(m => m.getWalletBalance()),
    getTransactions: (limit?: number, offset?: number, type?: 'credit' | 'debit') => 
      import('./wallet').then(m => m.getWalletTransactions(limit, offset, type)),
    fund: (payload: any) => import('./wallet').then(m => m.fundWallet(payload)),
    transfer: (payload: any) => import('./wallet').then(m => m.transferFunds(payload)),
    searchUser: (query: string) => import('./wallet').then(m => m.searchUser(query)),
    getAccountDetails: () => import('./wallet').then(m => m.getWalletAccountDetails()),
    verifyBankTransfer: (ref: string) => import('./wallet').then(m => m.verifyBankTransfer(ref)),
    getTransaction: (ref: string) => import('./wallet').then(m => m.getWalletTransaction(ref)),
    getStats: (period?: 'week' | 'month' | 'year') => import('./wallet').then(m => m.getWalletStats(period)),
    setPin: (pin: string, confirmPin: string) => import('./wallet').then(m => m.setTransactionPin(pin, confirmPin)),
    verifyPin: (pin: string) => import('./wallet').then(m => m.verifyTransactionPin(pin))
  },

  // Exam Cards
  examCards: {
    getProviders: () => import('./exam-cards').then(m => m.getExamProviders()),
    getCards: (providerId: string) => import('./exam-cards').then(m => m.getExamCards(providerId)),
    buy: (payload: any) => import('./exam-cards').then(m => m.buyExamCards(payload)),
    getTransactions: (limit?: number) => import('./exam-cards').then(m => m.getRecentExamCardTransactions(limit)),
    getTransaction: (ref: string) => import('./exam-cards').then(m => m.getExamCardTransaction(ref)),
    getCardDetails: (cardId: string) => import('./exam-cards').then(m => m.getExamCardDetails(cardId)),
    verifyPins: (pins: string[]) => import('./exam-cards').then(m => m.verifyExamCardPins(pins))
  },

  // Recharge Cards
  rechargeCards: {
    getProviders: () => import('./recharge-cards').then(m => m.getRechargeCardProviders()),
    getDenominations: (providerId: string) => import('./recharge-cards').then(m => m.getRechargeCardDenominations(providerId)),
    buy: (payload: any) => import('./recharge-cards').then(m => m.buyRechargeCards(payload)),
    getTransactions: (limit?: number) => import('./recharge-cards').then(m => m.getRecentRechargeCardTransactions(limit)),
    getTransaction: (ref: string) => import('./recharge-cards').then(m => m.getRechargeCardTransaction(ref)),
    verifyPins: (pins: string[]) => import('./recharge-cards').then(m => m.verifyRechargeCardPins(pins)),
    getStats: (providerId: string) => import('./recharge-cards').then(m => m.getRechargeCardStats(providerId))
  }
}

// Default export for backwards compatibility
export default API
