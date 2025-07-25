/**
 * VTU Hooks Index
 * 
 * This file provides a centralized export for all VTU-related React hooks.
 * These hooks provide data fetching, caching, and purchase capabilities for VTU services.
 * 
 * Data Fetching Usage:
 * ```tsx
 * import { useNetworks, useDataPlans } from '@/hooks/vtu';
 * 
 * const MyComponent = () => {
 *   const { data: networks, loading, error, refetch } = useNetworks();
 *   const { data: dataPlans } = useDataPlans(selectedNetworkId);
 *   
 *   // Use the data...
 * };
 * ```
 * 
 * Purchase Hooks Usage:
 * ```tsx
 * import { usePurchaseAirtime, usePurchaseData } from '@/hooks/vtu';
 * 
 * const PurchaseComponent = () => {
 *   const { mutate: purchaseAirtime, loading, error, success } = usePurchaseAirtime();
 *   const { mutate: purchaseData } = usePurchaseData();
 *   
 *   const handlePurchase = async () => {
 *     await purchaseAirtime({ 
 *       providerId: 'mtn', 
 *       phoneNumber: '08012345678', 
 *       amount: 100 
 *     });
 *   };
 *   
 *   // Purchase hooks automatically handle:
 *   // - Success/error states
 *   // - Wallet balance updates
 *   // - Toast notifications
 * };
 * ```
 */

export { useNetworks, default as useNetworksHook } from './useNetworks';
export { useDataPlans, default as useDataPlansHook } from './useDataPlans';
export { useCableProviders, default as useCableProvidersHook } from './useCableProviders';
export { useCablePackages, default as useCablePackagesHook } from './useCablePackages';
export { useElectricityProviders, default as useElectricityProvidersHook } from './useElectricityProviders';

// Purchase hooks
export { usePurchaseAirtime, default as usePurchaseAirtimeHook } from './usePurchaseAirtime';
export { usePurchaseData, default as usePurchaseDataHook } from './usePurchaseData';
export { usePurchaseCable, default as usePurchaseCableHook } from './usePurchaseCable';
export { usePurchaseElectricity, default as usePurchaseElectricityHook } from './usePurchaseElectricity';

// Enhanced electricity hooks
export { useMeterValidation, default as useMeterValidationHook } from './useMeterValidation';
export { useElectricityTransactions, default as useElectricityTransactionsHook } from './useElectricityTransactions';
export { useElectricityCalculator, default as useElectricityCalculatorHook } from './useElectricityCalculator';

// Re-export types for convenience
export type { 
  ServiceProvider, 
  DataPlan, 
  CableProvider, 
  CablePlan, 
  ElectricityProvider,
  AirtimePurchaseRequest,
  AirtimePurchaseResponse,
  DataPurchaseRequest,
  DataPurchaseResponse,
  CablePurchaseRequest,
  CablePurchaseResponse,
  ElectricityPurchaseRequest,
  ElectricityPurchaseResponse
} from '@/src/api/types';

// Export common hook return types
export interface VTUHookReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Purchase hook return types
export interface VTUPurchaseHookReturn<T> {
  mutate: (payload: any) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  data: T | null;
}
