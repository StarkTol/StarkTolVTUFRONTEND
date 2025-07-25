# Electricity Service Enhancement

## Overview

The electricity service has been enhanced with comprehensive features, improved type safety, and additional utility hooks to provide a complete electricity bill payment solution for your VTU platform.

## Enhanced Features

### 1. **Improved Type Definitions**

```typescript
// Enhanced provider interface with additional metadata
interface ElectricityProvider {
  id: string
  name: string
  logo: string
  status: 'active' | 'inactive'
  minAmount?: number           // Minimum recharge amount
  maxAmount?: number           // Maximum recharge amount
  description?: string         // Provider description
  supportedMeterTypes?: ('prepaid' | 'postpaid')[]
}

// New interfaces for comprehensive functionality
interface ElectricityTariff {
  id: string
  name: string
  providerId: string
  rate: number
  description?: string
  meterType: 'prepaid' | 'postpaid'
}

interface CustomerInfo {
  name: string
  address?: string
  meterNumber: string
  customerNumber?: string
  meterType: 'prepaid' | 'postpaid'
  provider: string
  lastRecharge?: {
    amount: number
    date: string
    units?: number
  }
  outstandingBalance?: number
}
```

### 2. **Enhanced Service Methods**

The `ElectricityService` class now includes the following methods:

#### Core Methods
- `getProviders()` - Get all electricity providers
- `getProviderById(providerId)` - Get specific provider details
- `getTariffs(providerId)` - Get available tariffs for a provider
- `purchaseElectricity(request)` - Purchase electricity units
- `validateMeter(meterNumber, provider, meterType)` - Validate meter with enhanced response

#### Transaction Management
- `getRecentTransactions(limit)` - Get recent electricity transactions
- `getTransactionById(transactionId)` - Get specific transaction details
- `checkTransactionStatus(reference)` - Check transaction status
- `getReceipt(transactionId)` - Get transaction receipt

#### Customer & Utility Methods
- `getCustomerInfo(meterNumber, provider)` - Get customer information
- `calculateUnits(amount, provider, meterType)` - Calculate units for amount
- `getConsumptionHistory(meterNumber, provider, months)` - Get consumption history

### 3. **New Utility Hooks**

#### useMeterValidation
```typescript
import { useMeterValidation } from '@/hooks/vtu';

const MeterValidationComponent = () => {
  const { validateMeter, loading, error, validationResult, clearValidation } = useMeterValidation();

  const handleValidation = async () => {
    const result = await validateMeter('12345678901', 'ekedc', 'prepaid');
    if (result.valid) {
      console.log('Customer:', result.customer);
    }
  };

  return (
    <div>
      {validationResult && (
        <div>
          {validationResult.valid ? (
            <p>Valid meter for: {validationResult.customer?.name}</p>
          ) : (
            <p>Error: {validationResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
};
```

#### useElectricityTransactions
```typescript
import { useElectricityTransactions } from '@/hooks/vtu';

const TransactionsComponent = () => {
  const { 
    transactions, 
    loading, 
    error, 
    refetch, 
    getTransactionById, 
    checkTransactionStatus,
    getReceipt 
  } = useElectricityTransactions(10);

  const handleViewReceipt = async (transactionId: string) => {
    const receipt = await getReceipt(transactionId);
    // Display receipt data
  };

  return (
    <div>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <p>{transaction.customerName} - ₦{transaction.amount}</p>
          <button onClick={() => handleViewReceipt(transaction.id)}>
            View Receipt
          </button>
        </div>
      ))}
    </div>
  );
};
```

#### useElectricityCalculator
```typescript
import { useElectricityCalculator } from '@/hooks/vtu';

const CalculatorComponent = () => {
  const { 
    calculateUnits, 
    calculateAmount, 
    loading, 
    error, 
    lastCalculation,
    clearCalculation 
  } = useElectricityCalculator();

  const handleCalculateUnits = async () => {
    const result = await calculateUnits(5000, 'ekedc', 'prepaid');
    if (result) {
      console.log(`₦${result.amount} = ${result.units} units`);
      console.log(`Estimated duration: ${result.estimatedDuration}`);
    }
  };

  return (
    <div>
      {lastCalculation && (
        <div>
          <p>Amount: ₦{lastCalculation.amount}</p>
          <p>Units: {lastCalculation.units} kWh</p>
          <p>Rate: ₦{lastCalculation.rate}/kWh</p>
          {lastCalculation.estimatedDuration && (
            <p>Est. Duration: {lastCalculation.estimatedDuration}</p>
          )}
        </div>
      )}
    </div>
  );
};
```

## Usage Examples

### Basic Electricity Purchase Flow

```typescript
import { 
  useElectricityProviders, 
  useMeterValidation, 
  useElectricityCalculator,
  usePurchaseElectricity 
} from '@/hooks/vtu';

const ElectricityPurchaseForm = () => {
  const { data: providers } = useElectricityProviders();
  const { validateMeter, validationResult } = useMeterValidation();
  const { calculateUnits, lastCalculation } = useElectricityCalculator();
  const { mutate: purchaseElectricity, loading, success } = usePurchaseElectricity();

  const [formData, setFormData] = useState({
    provider: '',
    meterNumber: '',
    amount: 0,
    meterType: 'prepaid' as const,
    paymentMethod: 'wallet' as const
  });

  const handleMeterValidation = async () => {
    await validateMeter(formData.meterNumber, formData.provider, formData.meterType);
  };

  const handleCalculateUnits = async () => {
    await calculateUnits(formData.amount, formData.provider, formData.meterType);
  };

  const handlePurchase = async () => {
    await purchaseElectricity({
      provider: formData.provider,
      meterNumber: formData.meterNumber,
      amount: formData.amount,
      meterType: formData.meterType,
      paymentMethod: formData.paymentMethod,
      customerName: validationResult?.customer?.name
    });
  };

  return (
    <form>
      {/* Provider selection */}
      <select onChange={(e) => setFormData({...formData, provider: e.target.value})}>
        {providers?.map(provider => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </select>

      {/* Meter number input with validation */}
      <input
        type="text"
        placeholder="Meter Number"
        value={formData.meterNumber}
        onChange={(e) => setFormData({...formData, meterNumber: e.target.value})}
        onBlur={handleMeterValidation}
      />
      
      {validationResult && (
        <div>
          {validationResult.valid ? (
            <p>✅ Valid meter for: {validationResult.customer?.name}</p>
          ) : (
            <p>❌ {validationResult.error}</p>
          )}
        </div>
      )}

      {/* Amount input with unit calculation */}
      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => {
          const amount = Number(e.target.value);
          setFormData({...formData, amount});
          if (amount > 0) handleCalculateUnits();
        }}
      />

      {lastCalculation && (
        <div>
          <p>You will get approximately {lastCalculation.units} kWh</p>
          {lastCalculation.estimatedDuration && (
            <p>Estimated to last: {lastCalculation.estimatedDuration}</p>
          )}
        </div>
      )}

      <button 
        type="button" 
        onClick={handlePurchase}
        disabled={!validationResult?.valid || loading}
      >
        {loading ? 'Processing...' : 'Purchase Electricity'}
      </button>

      {success && <p>✅ Electricity purchase successful!</p>}
    </form>
  );
};
```

## API Endpoints

The enhanced service expects the following API endpoints:

### Core Endpoints
- `GET /services/electricity/providers` - Get all providers
- `GET /services/electricity/providers/:id` - Get provider by ID
- `GET /services/electricity/providers/:id/tariffs` - Get provider tariffs
- `POST /services/electricity/validate` - Validate meter number
- `POST /services/electricity/purchase` - Purchase electricity
- `POST /services/electricity/calculate` - Calculate units

### Transaction Endpoints
- `GET /transactions?type=electricity&limit=:limit` - Get recent transactions
- `GET /transactions/electricity/:id` - Get transaction by ID
- `GET /transactions/electricity/:id/receipt` - Get transaction receipt
- `GET /transactions/status?reference=:reference` - Check transaction status

### Customer & Utility Endpoints
- `GET /services/electricity/customer?meter=:meter&provider=:provider` - Get customer info
- `GET /services/electricity/consumption?meter=:meter&provider=:provider&months=:months` - Get consumption history

## Migration Guide

If you're upgrading from the previous electricity service:

1. **Update imports** to use the enhanced types:
   ```typescript
   // Old
   import { ElectricityProvider } from '@/lib/services/electricityService';
   
   // New - includes additional properties
   import { 
     ElectricityProvider, 
     CustomerInfo, 
     MeterValidationResult 
   } from '@/lib/services/electricityService';
   ```

2. **Update meter validation calls**:
   ```typescript
   // Old
   const customer = await electricityService.validateMeter(meter, provider, type);
   
   // New
   const result = await electricityService.validateMeter(meter, provider, type);
   if (result.valid) {
     const customer = result.customer;
   }
   ```

3. **Leverage new hooks** for enhanced functionality:
   ```typescript
   // Add to your components
   import { 
     useMeterValidation, 
     useElectricityCalculator, 
     useElectricityTransactions 
   } from '@/hooks/vtu';
   ```

4. **Update existing purchase flows** to use enhanced request parameters:
   ```typescript
   // Enhanced purchase request now supports additional fields
   await electricityService.purchaseElectricity({
     provider: 'ekedc',
     meterNumber: '12345678901',
     amount: 5000,
     meterType: 'prepaid',
     paymentMethod: 'wallet',
     customerName: 'John Doe',        // New
     customerPhone: '08012345678'     // New
   });
   ```

## Benefits

1. **Enhanced User Experience**: Real-time meter validation and unit calculations
2. **Better Error Handling**: Comprehensive error states and user-friendly messages
3. **Improved Performance**: Efficient caching and state management in hooks
4. **Type Safety**: Full TypeScript support with detailed interface definitions
5. **Extensibility**: Modular design allows for easy addition of new features
6. **Developer Experience**: Well-documented hooks with clear usage patterns

## Testing

Each hook and service method includes comprehensive error handling and loading states. Test your implementation with:

1. Valid and invalid meter numbers
2. Different providers and meter types
3. Various amount ranges
4. Network error scenarios
5. Successful and failed purchase flows

The enhanced electricity service provides a robust foundation for electricity bill payments in your VTU platform, with room for future enhancements and customizations.
