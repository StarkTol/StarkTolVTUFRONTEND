# Data Fetching Guidelines

This document outlines the standard patterns and practices for data fetching, API integration, and testing in the VTU platform.

## Adding New Endpoints to the API Layer

### Step 1: Define Types

Add relevant TypeScript interfaces to `src/api/types.ts`:

```typescript
// Example: Adding a new service endpoint
export interface EducationPinRequest {
  examType: string;
  quantity: number;
  pin?: string;
}

export interface EducationPinResponse {
  pins: Array<{
    serialNumber: string;
    pin: string;
    examType: string;
  }>;
  totalAmount: number;
  transactionRef: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}
```

### Step 2: Create Endpoint Class

Create a new endpoint file in `src/api/endpoints/`:

```typescript
// src/api/endpoints/education.ts
import { BaseEndpoint } from './base';
import { 
  EducationPinRequest, 
  EducationPinResponse, 
  ApiResponse 
} from '../types';

class EducationEndpoints extends BaseEndpoint {
  constructor() {
    super('/education');
  }

  async getExamTypes(): Promise<ApiResponse<string[]>> {
    return this.get('/exam-types');
  }

  async purchasePins(data: EducationPinRequest): Promise<ApiResponse<EducationPinResponse>> {
    // Client-side validation
    this.validateRequired(data, ['examType', 'quantity']);
    
    if (data.quantity < 1 || data.quantity > 50) {
      throw new Error('Quantity must be between 1 and 50');
    }

    return this.post('/purchase', data);
  }

  async getTransactionHistory(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<any>> {
    return this.get('/transactions', { params });
  }
}

export const educationApi = new EducationEndpoints();

// Export individual functions for easier importing
export const getExamTypes = () => educationApi.getExamTypes();
export const purchaseEducationPins = (data: EducationPinRequest) => educationApi.purchasePins(data);
export const getEducationTransactions = (params?: { page?: number; limit?: number }) => 
  educationApi.getTransactionHistory(params);
```

### Step 3: Export from Main Index

Add exports to `src/api/index.ts`:

```typescript
// Export the API class
export { educationApi } from './endpoints/education';

// Export individual functions
export { 
  getExamTypes,
  purchaseEducationPins,
  getEducationTransactions
} from './endpoints/education';

// Add to main API object
export const api = {
  auth: authApi,
  wallet: walletApi,
  services: {
    airtime: airtimeApi,
    data: dataApi,
    education: educationApi, // Add new service
  }
};
```

### Step 4: Update Documentation

Add usage examples to the API README:

```typescript
// Education pin purchase
const examTypes = await api.services.education.getExamTypes();
const pinPurchase = await api.services.education.purchasePins({
  examType: 'waec',
  quantity: 2,
  pin: '1234'
});
```

## Standard Patterns for Loading/Error UI

### Loading States

#### 1. Skeleton Loaders

Use skeleton loaders for content that has a predictable structure:

```tsx
// components/ui/skeleton.tsx
export function ServiceCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

// Usage in components
function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
```

#### 2. Spinner for Actions

Use spinners for user actions like button clicks:

```tsx
import { Loader2 } from 'lucide-react';

function PurchaseButton({ onPurchase }: { onPurchase: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await onPurchase();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePurchase} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? 'Processing...' : 'Purchase'}
    </Button>
  );
}
```

### Error Handling

#### 1. Toast Notifications

```tsx
import { toast } from 'sonner';
import { getErrorMessage } from '@/src/api';

function useApiCall<T>(apiCall: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}

// Usage
function AirtimePurchase() {
  const purchaseAirtime = useApiCall(() => 
    api.services.airtime.purchase(purchaseData)
  );

  const handlePurchase = async () => {
    try {
      await purchaseAirtime.execute();
      toast.success('Airtime purchased successfully!');
    } catch {
      // Error already handled by useApiCall
    }
  };
}
```

#### 2. Error Boundaries

```tsx
// components/ErrorBoundary.tsx
import React from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600">
            We encountered an error while loading this section. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Form Validation Patterns

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const airtimeSchema = z.object({
  provider: z.string().min(1, 'Please select a provider'),
  phoneNumber: z.string()
    .min(11, 'Phone number must be 11 digits')
    .regex(/^\d{11}$/, 'Invalid phone number format'),
  amount: z.number()
    .min(50, 'Minimum amount is ₦50')
    .max(50000, 'Maximum amount is ₦50,000')
});

type AirtimeFormData = z.infer<typeof airtimeSchema>;

function AirtimePurchaseForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<AirtimeFormData>({
    resolver: zodResolver(airtimeSchema)
  });

  const onSubmit = async (data: AirtimeFormData) => {
    try {
      const response = await api.services.airtime.purchase(data);
      if (response.success) {
        toast.success('Airtime purchased successfully!');
      }
    } catch (error) {
      // Set server validation errors
      if (error.status === 422 && error.details) {
        Object.entries(error.details).forEach(([field, message]) => {
          setError(field as keyof AirtimeFormData, {
            message: message as string
          });
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <input
            {...register('phoneNumber')}
            placeholder="Phone Number"
            className={errors.phoneNumber ? 'border-red-500' : ''}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Purchase Airtime'}
        </button>
      </div>
    </form>
  );
}
```

## Testing Strategy with MSW

### MSW Setup

#### 1. Installation and Basic Setup

```bash
# Install MSW as a dev dependency
pnpm add -D msw

# Initialize MSW
npx msw init public/
```

#### 2. Request Handlers

Create mock handlers in `src/mocks/handlers.ts`:

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '@/src/api/httpClient';

export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
          },
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token'
          }
        },
        message: 'Login successful'
      });
    }

    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid credentials'
      },
      { status: 401 }
    );
  }),

  // Wallet endpoints
  http.get(`${API_BASE_URL}/wallet/balance`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        balance: 15000,
        formattedBalance: '₦15,000.00'
      },
      message: 'Balance retrieved successfully'
    });
  }),

  // Airtime endpoints
  http.get(`${API_BASE_URL}/services/airtime/providers`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 'mtn', name: 'MTN', code: 'MTN' },
        { id: 'airtel', name: 'Airtel', code: 'AIRTEL' },
        { id: 'glo', name: 'Globacom', code: 'GLO' },
        { id: '9mobile', name: '9mobile', code: '9MOBILE' }
      ],
      message: 'Providers retrieved successfully'
    });
  }),

  http.post(`${API_BASE_URL}/services/airtime/purchase`, async ({ request }) => {
    const body = await request.json() as {
      providerId: string;
      phoneNumber: string;
      amount: number;
    };

    // Simulate validation error
    if (body.amount < 50) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: ['Amount must be at least ₦50']
        },
        { status: 422 }
      );
    }

    // Simulate network error occasionally
    if (Math.random() < 0.1) {
      return HttpResponse.error();
    }

    return HttpResponse.json({
      success: true,
      data: {
        transactionRef: `TXN_${Date.now()}`,
        amount: body.amount,
        phoneNumber: body.phoneNumber,
        provider: body.providerId,
        status: 'completed'
      },
      message: 'Airtime purchased successfully'
    });
  }),

  // Error simulation endpoints
  http.get(`${API_BASE_URL}/test/server-error`, () => {
    return HttpResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }),

  http.get(`${API_BASE_URL}/test/network-error`, () => {
    return HttpResponse.error();
  })
];
```

#### 3. Test Setup

Create MSW server for tests in `src/mocks/server.ts`:

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

#### 4. Jest Setup

Configure Jest in `jest.setup.js`:

```javascript
// jest.setup.js
import { server } from './src/mocks/server';

// Enable API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that are declared in individual tests
afterEach(() => server.resetHandlers());

// Clean up after all tests are complete
afterAll(() => server.close());
```

### Testing Examples

#### 1. Component Testing with API Calls

```typescript
// __tests__/components/AirtimePurchase.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { server } from '@/src/mocks/server';
import { http, HttpResponse } from 'msw';
import AirtimePurchaseForm from '@/components/AirtimePurchaseForm';

describe('AirtimePurchaseForm', () => {
  it('should display success message on successful purchase', async () => {
    render(<AirtimePurchaseForm />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '08012345678' }
    });
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: '1000' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('Purchase Airtime'));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Airtime purchased successfully!')).toBeInTheDocument();
    });
  });

  it('should display error message on validation failure', async () => {
    render(<AirtimePurchaseForm />);

    // Fill form with invalid amount
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '08012345678' }
    });
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: '25' } // Below minimum
    });

    fireEvent.click(screen.getByText('Purchase Airtime'));

    await waitFor(() => {
      expect(screen.getByText('Amount must be at least ₦50')).toBeInTheDocument();
    });
  });

  it('should handle network errors gracefully', async () => {
    // Override handler to simulate network error
    server.use(
      http.post('*/services/airtime/purchase', () => {
        return HttpResponse.error();
      })
    );

    render(<AirtimePurchaseForm />);

    fireEvent.change(screen.getByPlaceholderText('Phone Number'), {
      target: { value: '08012345678' }
    });
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: '1000' }
    });

    fireEvent.click(screen.getByText('Purchase Airtime'));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
```

#### 2. API Function Testing

```typescript
// __tests__/api/airtime.test.ts
import { purchaseAirtime, getAirtimeProviders } from '@/src/api';
import { server } from '@/src/mocks/server';
import { http, HttpResponse } from 'msw';

describe('Airtime API', () => {
  describe('getAirtimeProviders', () => {
    it('should return list of providers', async () => {
      const response = await getAirtimeProviders();
      
      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(4);
      expect(response.data?.[0]).toEqual({
        id: 'mtn',
        name: 'MTN',
        code: 'MTN'
      });
    });

    it('should handle server errors', async () => {
      server.use(
        http.get('*/services/airtime/providers', () => {
          return HttpResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
          );
        })
      );

      const response = await getAirtimeProviders();
      expect(response.success).toBe(false);
      expect(response.message).toBe('Server error');
    });
  });

  describe('purchaseAirtime', () => {
    const validPurchaseData = {
      providerId: 'mtn',
      phoneNumber: '08012345678',
      amount: 1000
    };

    it('should successfully purchase airtime', async () => {
      const response = await purchaseAirtime(validPurchaseData);
      
      expect(response.success).toBe(true);
      expect(response.data?.transactionRef).toMatch(/^TXN_\d+$/);
      expect(response.data?.amount).toBe(1000);
    });

    it('should validate minimum amount', async () => {
      const response = await purchaseAirtime({
        ...validPurchaseData,
        amount: 25
      });
      
      expect(response.success).toBe(false);
      expect(response.errors).toContain('Amount must be at least ₦50');
    });

    it('should handle network errors with retry', async () => {
      let attemptCount = 0;
      server.use(
        http.post('*/services/airtime/purchase', () => {
          attemptCount++;
          if (attemptCount < 3) {
            return HttpResponse.error();
          }
          return HttpResponse.json({
            success: true,
            data: { transactionRef: 'TXN_SUCCESS' },
            message: 'Success after retry'
          });
        })
      );

      const response = await purchaseAirtime(validPurchaseData);
      expect(response.success).toBe(true);
      expect(attemptCount).toBe(3); // Confirms retry logic worked
    });
  });
});
```

### Best Practices

1. **Consistent Error Handling**: Always use the same error handling patterns across components
2. **Loading States**: Show loading indicators for all async operations
3. **Validation**: Validate both client-side and handle server-side validation errors
4. **Testing**: Test both success and error scenarios with MSW
5. **Type Safety**: Leverage TypeScript for all API interactions
6. **Caching**: Consider implementing SWR or React Query for data fetching and caching

### Common Pitfalls to Avoid

- Don't forget to handle network errors and timeouts
- Always provide user feedback for loading and error states
- Don't expose sensitive error details to end users
- Test edge cases like slow networks and server errors
- Maintain consistent API response structures
- Use proper TypeScript types for all API calls

By following these guidelines, you'll ensure consistent, reliable, and user-friendly API integrations across the VTU platform.
