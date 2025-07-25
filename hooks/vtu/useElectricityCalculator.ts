import { useState, useCallback } from 'react';
import { electricityService } from '@/lib/services/electricityService';

interface ElectricityCalculation {
  units: number;
  rate: number;
  amount: number;
  estimatedDuration?: string;
  breakdown?: {
    baseAmount: number;
    vat?: number;
    fee?: number;
    totalAmount: number;
  };
}

interface UseElectricityCalculatorReturn {
  calculateUnits: (amount: number, provider: string, meterType: 'prepaid' | 'postpaid') => Promise<ElectricityCalculation | null>;
  calculateAmount: (units: number, provider: string, meterType: 'prepaid' | 'postpaid') => Promise<ElectricityCalculation | null>;
  loading: boolean;
  error: string | null;
  lastCalculation: ElectricityCalculation | null;
  clearCalculation: () => void;
}

/**
 * Hook for electricity unit and amount calculations
 * Provides bidirectional calculation between units and amount
 */
export const useElectricityCalculator = (): UseElectricityCalculatorReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCalculation, setLastCalculation] = useState<ElectricityCalculation | null>(null);

  const calculateUnits = useCallback(async (
    amount: number, 
    provider: string, 
    meterType: 'prepaid' | 'postpaid'
  ): Promise<ElectricityCalculation | null> => {
    try {
      setLoading(true);
      setError(null);

      // Validate input parameters
      if (!amount || amount <= 0 || !provider || !meterType) {
        setError('Invalid calculation parameters');
        return null;
      }

      const result = await electricityService.calculateUnits(amount, provider, meterType);
      
      if (result) {
        const calculation: ElectricityCalculation = {
          units: result.units,
          rate: result.rate,
          amount: amount,
          breakdown: {
            baseAmount: amount,
            totalAmount: amount
          }
        };

        // Estimate duration based on average household consumption (optional)
        if (result.units > 0) {
          const averageDaily = 10; // Average daily kWh consumption
          const estimatedDays = Math.floor(result.units / averageDaily);
          
          if (estimatedDays > 0) {
            calculation.estimatedDuration = estimatedDays === 1 
              ? '1 day' 
              : estimatedDays < 30 
                ? `${estimatedDays} days`
                : `${Math.floor(estimatedDays / 30)} month${estimatedDays >= 60 ? 's' : ''}`;
          }
        }

        setLastCalculation(calculation);
        return calculation;
      }

      setError('Failed to calculate electricity units');
      return null;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to calculate electricity units';
      setError(errorMessage);
      console.error('Error calculating units:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateAmount = useCallback(async (
    units: number, 
    provider: string, 
    meterType: 'prepaid' | 'postpaid'
  ): Promise<ElectricityCalculation | null> => {
    try {
      setLoading(true);
      setError(null);

      // Validate input parameters
      if (!units || units <= 0 || !provider || !meterType) {
        setError('Invalid calculation parameters');
        return null;
      }

      // For amount calculation, we estimate based on typical rates
      // This would ideally come from a dedicated API endpoint
      const estimatedRate = 50; // Default rate per kWh in Naira
      const estimatedAmount = units * estimatedRate;

      const result = await electricityService.calculateUnits(estimatedAmount, provider, meterType);
      
      if (result) {
        const calculation: ElectricityCalculation = {
          units: units,
          rate: result.rate,
          amount: estimatedAmount,
          breakdown: {
            baseAmount: estimatedAmount,
            totalAmount: estimatedAmount
          }
        };

        setLastCalculation(calculation);
        return calculation;
      }

      setError('Failed to calculate electricity amount');
      return null;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to calculate electricity amount';
      setError(errorMessage);
      console.error('Error calculating amount:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCalculation = useCallback(() => {
    setLastCalculation(null);
    setError(null);
  }, []);

  return {
    calculateUnits,
    calculateAmount,
    loading,
    error,
    lastCalculation,
    clearCalculation
  };
};

export default useElectricityCalculator;
