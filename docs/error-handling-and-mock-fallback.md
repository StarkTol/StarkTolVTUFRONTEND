# Enhanced Error Handling and Mock Data Fallback

This document outlines the implementation of robust error handling with mock data fallback for VTU services.

## Overview

The enhanced error handling system provides:

1. **Descriptive Error Messages**: Clear, user-friendly error messages based on error type
2. **Mock Data Fallback**: Automatic fallback to mock data when API fails or when explicitly enabled
3. **Red Alert Cards**: Visual error display component for when both real API and mock data fail
4. **Network Detection**: Smart detection of network-related errors

## Implementation Details

### 1. Error Handling Strategy

Each VTU hook now implements a three-tier error handling approach:

```typescript
try {
  // 1. Attempt real API call
  const response = await vtuApi.someEndpoint();
  // Handle success...
} catch (err: any) {
  // 2. Determine if mock fallback should be used
  const shouldUseMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || 
                       err.name === 'NetworkError' ||
                       err.code === 'NETWORK_ERROR' ||
                       err.message?.includes('fetch') ||
                       err.message?.includes('network') ||
                       !navigator.onLine;
  
  if (shouldUseMock) {
    try {
      // 3. Attempt mock data fallback
      const mockResponse = await fetch('/__mock/endpoint.json');
      // Handle mock success...
    } catch (mockError) {
      // 4. Both failed - show error
      setError(descriptiveErrorMessage);
    }
  }
}
```

### 2. Mock Data Files

Created comprehensive mock data files in `public/__mock/`:

- `networks.json` - Network providers for airtime/data
- `data-plans.json` - Data plans filtered by network
- `cable-providers.json` - Cable TV providers
- `cable-packages.json` - Cable packages filtered by provider  
- `electricity-providers.json` - Electricity distribution companies

### 3. Error Display Component

Created `ErrorDisplay` component (`components/ui/error-display.tsx`) that:

- Uses the existing Alert component with destructive variant
- Displays red-themed error cards
- Includes retry functionality
- Provides consistent error UI across the application

### 4. Enhanced Hooks

Updated all VTU hooks with improved error handling:

#### Data Fetching Hooks
- `useNetworks` - Network providers with mock fallback
- `useDataPlans` - Data plans with network filtering  
- `useCableProviders` - Cable providers with caching
- `useCablePackages` - Cable packages with provider filtering
- `useElectricityProviders` - Electricity providers with caching

#### Purchase Hooks  
- `usePurchaseAirtime` - Enhanced error messages for airtime purchases
- `usePurchaseData` - Enhanced error messages for data purchases
- `usePurchaseCable` - Enhanced error messages for cable subscriptions
- `usePurchaseElectricity` - Enhanced error messages for electricity payments

### 5. Error Message Types

The system provides specific error messages for different scenarios:

- **Network Errors**: "Network connection failed. Please check your internet connection and try again."
- **Timeout Errors**: "Request timed out. Please try again."
- **Insufficient Balance**: "Insufficient wallet balance. Please fund your wallet and try again."
- **Invalid Input**: "Invalid [field] or [field]. Please check your details and try again."
- **Generic Errors**: Original error message or fallback message

## Environment Configuration

### Enable Mock Mode

Set the environment variable to enable mock data mode:

```env
NEXT_PUBLIC_USE_MOCK=true
```

When enabled, the system will:
- Always use mock data instead of real API
- Skip real API calls entirely
- Load data from `/__mock/*.json` files

### Production Fallback

In production, mock fallback is triggered by:
- Network connectivity issues (`!navigator.onLine`)
- Network-related errors (NetworkError, fetch failures)
- Connection timeouts
- Server unavailability

## Usage Examples

### Basic Error Handling in Components

```typescript
import { useNetworks } from '@/hooks/vtu/useNetworks';
import { ErrorDisplay } from '@/components/ui/error-display';

function MyComponent() {
  const { data, loading, error, refetch } = useNetworks();
  
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <ErrorDisplay
        title="Failed to Load Networks"
        message={error}
        onRetry={refetch}
        retryText="Retry Loading Networks"
      />
    );
  }
  
  return <div>{/* Render data */}</div>;
}
```

### Error Handling with Nested Dependencies

```typescript
function DataPurchaseForm() {
  const { data: networks, error: networksError, refetch: refetchNetworks } = useNetworks();
  const { data: plans, error: plansError, refetch: refetchPlans } = useDataPlans(selectedNetwork);
  
  if (networksError) {
    return <ErrorDisplay title="Networks Error" message={networksError} onRetry={refetchNetworks} />;
  }
  
  if (selectedNetwork && plansError) {
    return <ErrorDisplay title="Data Plans Error" message={plansError} onRetry={refetchPlans} />;
  }
  
  // Render form...
}
```

## Testing Error Scenarios

### Test Mock Fallback

1. Set `NEXT_PUBLIC_USE_MOCK=true`
2. Verify mock data loads correctly
3. Check error handling when mock files are missing

### Test Network Failures

1. Use browser dev tools to simulate offline mode
2. Use network throttling to simulate timeouts
3. Block API endpoints to simulate server failures

### Test Error Display

1. Temporarily break mock JSON files
2. Verify red alert cards appear
3. Test retry functionality

## File Structure

```
public/
  __mock/
    networks.json
    data-plans.json
    cable-providers.json
    cable-packages.json
    electricity-providers.json

components/
  ui/
    error-display.tsx
  vtu/
    AirtimeTab.tsx  # Updated with error handling
    DataTab.tsx     # Updated with error handling

hooks/
  vtu/
    useNetworks.ts           # Enhanced with mock fallback
    useDataPlans.ts          # Enhanced with mock fallback
    useCableProviders.ts     # Enhanced with mock fallback
    useCablePackages.ts      # Enhanced with mock fallback
    useElectricityProviders.ts # Enhanced with mock fallback
    usePurchaseAirtime.ts    # Enhanced error messages
    usePurchaseData.ts       # Enhanced error messages
    usePurchaseCable.ts      # Enhanced error messages
    usePurchaseElectricity.ts # Enhanced error messages
```

## Benefits

1. **Improved User Experience**: Clear, actionable error messages
2. **Offline Resilience**: App continues working with mock data
3. **Development Efficiency**: Easy testing with mock data
4. **Consistent Error UI**: Standardized error display across components
5. **Smart Fallbacks**: Automatic detection of when to use mock data
6. **Graceful Degradation**: App remains functional even when APIs fail

## Future Enhancements

1. **Error Reporting**: Add telemetry for tracking error patterns
2. **Caching Strategy**: Implement more sophisticated caching with TTL
3. **Retry Logic**: Add exponential backoff for failed requests
4. **User Preferences**: Allow users to enable/disable mock mode
5. **Mock Data Management**: Admin interface for updating mock data
