import { useState, useCallback } from 'react';
import { electricityService, type MeterValidationResult } from '@/lib/services/electricityService';

interface UseMeterValidationReturn {
  validateMeter: (meterNumber: string, provider: string, meterType: 'prepaid' | 'postpaid') => Promise<MeterValidationResult>;
  loading: boolean;
  error: string | null;
  validationResult: MeterValidationResult | null;
  clearValidation: () => void;
}

/**
 * Hook for validating electricity meter numbers
 * Provides comprehensive validation with customer information retrieval
 */
export const useMeterValidation = (): UseMeterValidationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<MeterValidationResult | null>(null);

  const validateMeter = useCallback(async (
    meterNumber: string, 
    provider: string, 
    meterType: 'prepaid' | 'postpaid'
  ): Promise<MeterValidationResult> => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate input parameters
      if (!meterNumber || !provider || !meterType) {
        const result: MeterValidationResult = {
          valid: false,
          error: 'Missing required validation parameters'
        };
        setValidationResult(result);
        return result;
      }

      // Perform meter validation
      const result = await electricityService.validateMeter(meterNumber, provider, meterType);
      
      setValidationResult(result);
      
      if (!result.valid) {
        setError(result.error || 'Meter validation failed');
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to validate meter number';
      setError(errorMessage);
      
      const result: MeterValidationResult = {
        valid: false,
        error: errorMessage
      };
      
      setValidationResult(result);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
    setError(null);
  }, []);

  return {
    validateMeter,
    loading,
    error,
    validationResult,
    clearValidation
  };
};

export default useMeterValidation;
