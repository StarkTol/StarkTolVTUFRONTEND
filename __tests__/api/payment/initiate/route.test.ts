/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/payment/initiate/route';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock axios
const mockAxios = new MockAdapter(axios);

// Helper function to create a NextRequest for testing
function createMockRequest(
  body: any,
  headers: Record<string, string> = {}
): NextRequest {
  const request = new NextRequest('http://localhost:3000/api/payment/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
  
  return request;
}

// Test constants
const MOCK_USER_ID = 'user-123';
const MOCK_ACCESS_TOKEN = 'mock-access-token';
const MOCK_BACKEND_URL = 'https://backend-066c.onrender.com/api/v1';

describe('/api/payment/initiate', () => {
  beforeEach(() => {
    // Clear all axios mocks before each test
    mockAxios.reset();
    
    // Reset environment variables
    process.env.NEXT_PUBLIC_API_BASE = MOCK_BACKEND_URL;
  });

  afterEach(() => {
    // Clean up after each test
    mockAxios.reset();
  });

  describe('POST method', () => {
    describe('Request validation', () => {
      it('should return 400 for missing amount', async () => {
        const request = createMockRequest(
          {},
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.error).toBe('Validation Error');
        expect(json.message).toContain('amount');
      });

      it('should return 400 for invalid amount (zero)', async () => {
        const request = createMockRequest(
          { amount: 0 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.error).toBe('Validation Error');
        expect(json.message).toContain('Minimum amount is 1');
      });

      it('should return 400 for negative amount', async () => {
        const request = createMockRequest(
          { amount: -10 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.error).toBe('Validation Error');
        expect(json.message).toContain('Amount must be positive');
      });

      it('should return 400 for non-numeric amount', async () => {
        const request = createMockRequest(
          { amount: 'invalid' },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.error).toBe('Validation Error');
      });

      it('should accept valid amount', async () => {
        const mockPaymentResponse = {
          paymentLink: 'https://payment.example.com/pay/123',
          txRef: 'tx_ref_123456',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(200, mockPaymentResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.paymentLink).toBe(mockPaymentResponse.paymentLink);
        expect(json.txRef).toBe(mockPaymentResponse.txRef);
      });
    });

    describe('Authentication', () => {
      it('should return 401 when no user ID is provided', async () => {
        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(401);
        expect(json.error).toBe('Authentication Error');
        expect(json.message).toContain('User ID not found');
      });

      it('should return 401 when no access token is provided', async () => {
        const request = createMockRequest(
          { amount: 100 },
          {
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(401);
        expect(json.error).toBe('Authentication Error');
        expect(json.message).toContain('Access token not found');
      });

      it('should extract user ID from X-User-ID header', async () => {
        const mockPaymentResponse = {
          paymentLink: 'https://payment.example.com/pay/123',
          txRef: 'tx_ref_123456',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(200, mockPaymentResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);

        expect(response.status).toBe(200);
        
        // Verify that the correct headers were sent to backend
        const backendCall = mockAxios.history.post[0];
        expect(backendCall.headers?.['X-User-ID']).toBe(MOCK_USER_ID);
        expect(backendCall.headers?.['Authorization']).toBe(`Bearer ${MOCK_ACCESS_TOKEN}`);
      });

      it('should extract access token from Authorization header', async () => {
        const mockPaymentResponse = {
          paymentLink: 'https://payment.example.com/pay/123',
          txRef: 'tx_ref_123456',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(200, mockPaymentResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);

        expect(response.status).toBe(200);
        
        const backendCall = mockAxios.history.post[0];
        expect(backendCall.headers?.['Authorization']).toBe(`Bearer ${MOCK_ACCESS_TOKEN}`);
      });
    });

    describe('Backend integration', () => {
      it('should successfully proxy request to backend', async () => {
        const mockPaymentResponse = {
          paymentLink: 'https://payment.example.com/pay/123',
          txRef: 'tx_ref_123456',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(200, mockPaymentResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.paymentLink).toBe(mockPaymentResponse.paymentLink);
        expect(json.txRef).toBe(mockPaymentResponse.txRef);

        // Verify backend request was made correctly
        const backendCall = mockAxios.history.post[0];
        expect(backendCall.url).toBe(`${MOCK_BACKEND_URL}/payment/initiate`);
        expect(JSON.parse(backendCall.data)).toEqual({
          amount: 100,
          userId: MOCK_USER_ID,
        });
      });

      it('should handle backend 400 error', async () => {
        const mockErrorResponse = {
          message: 'Invalid payment amount',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(400, mockErrorResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.error).toBe('Backend Error');
        expect(json.message).toBe(mockErrorResponse.message);
      });

      it('should handle backend 401 error', async () => {
        const mockErrorResponse = {
          message: 'Unauthorized',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(401, mockErrorResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(401);
        expect(json.error).toBe('Backend Error');
        expect(json.message).toBe(mockErrorResponse.message);
      });

      it('should handle backend 500 error', async () => {
        const mockErrorResponse = {
          message: 'Internal server error',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(500, mockErrorResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.error).toBe('Backend Error');
        expect(json.message).toBe(mockErrorResponse.message);
      });

      it('should handle network timeout', async () => {
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).timeout();

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.error).toBe('Backend Error');
        expect(json.message).toContain('timeout');
      });

      it('should handle network error', async () => {
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).networkError();

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.error).toBe('Backend Error');
      });

      it('should handle invalid backend response (missing paymentLink)', async () => {
        const invalidResponse = {
          txRef: 'tx_ref_123456',
          // paymentLink is missing
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(200, invalidResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(502);
        expect(json.error).toBe('Backend Error');
        expect(json.message).toContain('Missing required fields');
      });

      it('should handle invalid backend response (missing txRef)', async () => {
        const invalidResponse = {
          paymentLink: 'https://payment.example.com/pay/123',
          // txRef is missing
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(200, invalidResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(502);
        expect(json.error).toBe('Backend Error');
        expect(json.message).toContain('Missing required fields');
      });
    });

    describe('Environment configuration', () => {
      it('should use NEXT_PUBLIC_API_BASE when provided', async () => {
        const customBackendUrl = 'https://custom-backend.com/api/v1';
        process.env.NEXT_PUBLIC_API_BASE = customBackendUrl;

        const mockPaymentResponse = {
          paymentLink: 'https://payment.example.com/pay/123',
          txRef: 'tx_ref_123456',
        };

        mockAxios.onPost(`${customBackendUrl}/payment/initiate`).reply(200, mockPaymentResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);

        expect(response.status).toBe(200);
        
        const backendCall = mockAxios.history.post[0];
        expect(backendCall.url).toBe(`${customBackendUrl}/payment/initiate`);
      });

      it('should use default backend URL when env var is not set', async () => {
        delete process.env.NEXT_PUBLIC_API_BASE;

        const defaultUrl = 'https://backend-066c.onrender.com/api/v1';
        const mockPaymentResponse = {
          paymentLink: 'https://payment.example.com/pay/123',
          txRef: 'tx_ref_123456',
        };

        mockAxios.onPost(`${defaultUrl}/payment/initiate`).reply(200, mockPaymentResponse);

        const request = createMockRequest(
          { amount: 100 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);

        expect(response.status).toBe(200);
        
        const backendCall = mockAxios.history.post[0];
        expect(backendCall.url).toBe(`${defaultUrl}/payment/initiate`);
      });
    });

    describe('Edge cases', () => {
      it('should handle malformed JSON request', async () => {
        const request = new NextRequest('http://localhost:3000/api/payment/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          },
          body: 'invalid json{',
        });

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.error).toBe('Internal Server Error');
      });

      it('should handle decimal amounts correctly', async () => {
        const mockPaymentResponse = {
          paymentLink: 'https://payment.example.com/pay/123',
          txRef: 'tx_ref_123456',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/initiate`).reply(200, mockPaymentResponse);

        const request = createMockRequest(
          { amount: 99.99 },
          {
            'authorization': `Bearer ${MOCK_ACCESS_TOKEN}`,
            'x-user-id': MOCK_USER_ID,
          }
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        
        const backendCall = mockAxios.history.post[0];
        expect(JSON.parse(backendCall.data).amount).toBe(99.99);
      });
    });
  });

  describe('GET method (not allowed)', () => {
    it('should return 405 for GET requests', async () => {
      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(405);
      expect(json.error).toBe('Method Not Allowed');
      expect(json.message).toContain('Only POST method is allowed');
    });
  });
});
