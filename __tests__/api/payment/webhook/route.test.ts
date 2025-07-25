/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST, GET, PUT, DELETE } from '@/app/api/payment/webhook/route';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import crypto from 'crypto';

// Mock axios
const mockAxios = new MockAdapter(axios);

// Mock setImmediate for testing
const originalSetImmediate = global.setImmediate;
let setImmediateMock: jest.Mock;

// Test constants
const MOCK_WEBHOOK_HASH = 'test-webhook-hash-secret';
const MOCK_BACKEND_URL = 'https://backend-066c.onrender.com/api/v1';

// Sample Flutterwave webhook payload
const SAMPLE_WEBHOOK_PAYLOAD = {
  event: 'charge.completed',
  data: {
    id: 123456789,
    tx_ref: 'starktol_1642598400000_123',
    flw_ref: 'FLW-MOCK-REF-123456789',
    device_fingerprint: 'abc123device',
    amount: 1000,
    currency: 'NGN',
    charged_amount: 1000,
    app_fee: 14,
    merchant_fee: 0,
    processor_response: 'Approved Successful',
    auth_model: 'VBVSECURECODE',
    ip: '197.210.84.50',
    narration: 'StarTol VTU Platform',
    status: 'successful',
    payment_type: 'card',
    created_at: '2022-01-19T12:20:00.000Z',
    account_id: 123456,
    customer: {
      id: 987654321,
      name: 'John Doe',
      phone_number: '+2348123456789',
      email: 'john.doe@example.com',
      created_at: '2022-01-19T12:20:00.000Z',
    },
    card: {
      first_6digits: '553188',
      last_4digits: '2950',
      issuer: 'MASTERCARD  CREDIT',
      country: 'NG',
      type: 'MASTERCARD',
      expiry: '09/32',
    },
  },
  event_type: 'CARD_TRANSACTION',
};

/**
 * Helper function to generate valid webhook signature
 */
function generateValidSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Helper function to create a NextRequest for testing
 */
function createMockWebhookRequest(
  payload: any,
  signature?: string,
  headers: Record<string, string> = {}
): NextRequest {
  const bodyString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const validSignature = signature || generateValidSignature(bodyString, MOCK_WEBHOOK_HASH);

  return new NextRequest('http://localhost:3000/api/payment/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'verif-hash': validSignature,
      ...headers,
    },
    body: bodyString,
  });
}

describe('/api/payment/webhook', () => {
  beforeEach(() => {
    // Clear all axios mocks before each test
    mockAxios.reset();
    
    // Reset environment variables
    process.env.FLW_SECRET_HASH = MOCK_WEBHOOK_HASH;
    process.env.NEXT_PUBLIC_API_BASE = MOCK_BACKEND_URL;

    // Mock setImmediate to make async operations synchronous for testing
    setImmediateMock = jest.fn((callback) => {
      // Execute the callback immediately in tests
      callback();
    });
    global.setImmediate = setImmediateMock;

    // Suppress console.log in tests unless needed
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up after each test
    mockAxios.reset();
    global.setImmediate = originalSetImmediate;
    jest.restoreAllMocks();
  });

  describe('POST method', () => {
    describe('Signature verification', () => {
      it('should return 400 when signature header is missing', async () => {
        const request = new NextRequest('http://localhost:3000/api/payment/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // No 'verif-hash' header
          },
          body: JSON.stringify(SAMPLE_WEBHOOK_PAYLOAD),
        });

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.error).toBe('Bad Request');
        expect(json.message).toBe('Webhook signature is required');
      });

      it('should return 500 when FLW_SECRET_HASH environment variable is not set', async () => {
        delete process.env.FLW_SECRET_HASH;

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json.error).toBe('Internal Server Error');
        expect(json.message).toBe('Webhook configuration error');
      });

      it('should return 401 when signature is invalid', async () => {
        const request = createMockWebhookRequest(
          SAMPLE_WEBHOOK_PAYLOAD,
          'invalid-signature-hash'
        );

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(401);
        expect(json.error).toBe('Unauthorized');
        expect(json.message).toBe('Invalid webhook signature');
      });

      it('should accept request with valid signature', async () => {
        // Mock successful backend forwarding
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.status).toBe('success');
        expect(json.message).toBe('Webhook received and verified successfully');
      });

      it('should validate signature correctly with different payloads', async () => {
        const differentPayload = {
          ...SAMPLE_WEBHOOK_PAYLOAD,
          data: {
            ...SAMPLE_WEBHOOK_PAYLOAD.data,
            amount: 2000,
            tx_ref: 'different_tx_ref_123',
          },
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(differentPayload);
        const response = await POST(request);

        expect(response.status).toBe(200);
      });

      it('should reject request when payload is modified after signature generation', async () => {
        const originalPayload = JSON.stringify(SAMPLE_WEBHOOK_PAYLOAD);
        const validSignature = generateValidSignature(originalPayload, MOCK_WEBHOOK_HASH);

        // Modify the payload after generating signature
        const modifiedPayload = {
          ...SAMPLE_WEBHOOK_PAYLOAD,
          data: {
            ...SAMPLE_WEBHOOK_PAYLOAD.data,
            amount: 9999999, // Modified amount
          },
        };

        const request = createMockWebhookRequest(modifiedPayload, validSignature);
        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(401);
        expect(json.error).toBe('Unauthorized');
        expect(json.message).toBe('Invalid webhook signature');
      });
    });

    describe('Payload validation', () => {
      it('should return 400 for invalid JSON payload', async () => {
        const invalidJsonPayload = '{ invalid json';
        const signature = generateValidSignature(invalidJsonPayload, MOCK_WEBHOOK_HASH);

        const request = new NextRequest('http://localhost:3000/api/payment/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'verif-hash': signature,
          },
          body: invalidJsonPayload,
        });

        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.error).toBe('Bad Request');
        expect(json.message).toBe('Invalid JSON payload');
      });

      it('should accept valid JSON payload with correct signature', async () => {
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        const response = await POST(request);

        expect(response.status).toBe(200);
      });

      it('should handle empty payload with correct signature', async () => {
        const emptyPayload = {};
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(emptyPayload);
        const response = await POST(request);

        expect(response.status).toBe(200);
      });
    });

    describe('Backend forwarding', () => {
      it('should forward webhook to backend with correct headers', async () => {
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        const response = await POST(request);

        expect(response.status).toBe(200);

        // Verify the backend call was made with correct data and headers
        const backendCall = mockAxios.history.post[0];
        expect(backendCall.url).toBe(`${MOCK_BACKEND_URL}/payment/webhook`);
        expect(JSON.parse(backendCall.data)).toEqual(SAMPLE_WEBHOOK_PAYLOAD);
        expect(backendCall.headers?.['Content-Type']).toBe('application/json');
        expect(backendCall.headers?.['X-Webhook-Source']).toBe('flutterwave');
        expect(backendCall.headers?.['X-Signature-Verified']).toBe('true');
      });

      it('should respond quickly even if backend forwarding fails', async () => {
        // Mock backend failure
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(500, { error: 'Internal server error' });

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        const response = await POST(request);
        const json = await response.json();

        // Should still return 200 to Flutterwave
        expect(response.status).toBe(200);
        expect(json.status).toBe('success');
        expect(json.message).toBe('Webhook received and verified successfully');
      });

      it('should handle backend network timeout gracefully', async () => {
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).timeout();

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        const response = await POST(request);

        expect(response.status).toBe(200);
      });

      it('should handle backend network error gracefully', async () => {
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).networkError();

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        const response = await POST(request);

        expect(response.status).toBe(200);
      });

      it('should use custom backend URL from environment variable', async () => {
        const customBackendUrl = 'https://custom-backend.example.com/api/v1';
        process.env.NEXT_PUBLIC_API_BASE = customBackendUrl;

        mockAxios.onPost(`${customBackendUrl}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        const response = await POST(request);

        expect(response.status).toBe(200);

        const backendCall = mockAxios.history.post[0];
        expect(backendCall.url).toBe(`${customBackendUrl}/payment/webhook`);
      });

      it('should use default backend URL when env var is not set', async () => {
        delete process.env.NEXT_PUBLIC_API_BASE;
        const defaultUrl = 'https://backend-066c.onrender.com/api/v1';

        mockAxios.onPost(`${defaultUrl}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        const response = await POST(request);

        expect(response.status).toBe(200);

        const backendCall = mockAxios.history.post[0];
        expect(backendCall.url).toBe(`${defaultUrl}/payment/webhook`);
      });
    });

    describe('Event types and data handling', () => {
      it('should handle charge.completed event', async () => {
        const chargeCompletedPayload = {
          ...SAMPLE_WEBHOOK_PAYLOAD,
          event: 'charge.completed',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(chargeCompletedPayload);
        const response = await POST(request);

        expect(response.status).toBe(200);

        const backendCall = mockAxios.history.post[0];
        expect(JSON.parse(backendCall.data).event).toBe('charge.completed');
      });

      it('should handle transfer.completed event', async () => {
        const transferCompletedPayload = {
          ...SAMPLE_WEBHOOK_PAYLOAD,
          event: 'transfer.completed',
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(transferCompletedPayload);
        const response = await POST(request);

        expect(response.status).toBe(200);

        const backendCall = mockAxios.history.post[0];
        expect(JSON.parse(backendCall.data).event).toBe('transfer.completed');
      });

      it('should handle payload without card data', async () => {
        const { card, ...dataWithoutCard } = SAMPLE_WEBHOOK_PAYLOAD.data;
        const payloadWithoutCard = {
          ...SAMPLE_WEBHOOK_PAYLOAD,
          data: dataWithoutCard,
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(payloadWithoutCard);
        const response = await POST(request);

        expect(response.status).toBe(200);

        const backendCall = mockAxios.history.post[0];
        const forwardedData = JSON.parse(backendCall.data);
        expect(forwardedData.data.card).toBeUndefined();
      });
    });

    describe('Error handling and edge cases', () => {
      it('should handle unexpected errors gracefully', async () => {
        // Create a request that will cause JSON parsing to fail
        const request = new NextRequest('http://localhost:3000/api/payment/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'verif-hash': generateValidSignature('invalid json{', MOCK_WEBHOOK_HASH),
          },
          body: 'invalid json{',
        });

        const response = await POST(request);
        const json = await response.json();

        // Should return 400 for invalid JSON
        expect(response.status).toBe(400);
        expect(json.error).toBe('Bad Request');
        expect(json.message).toBe('Invalid JSON payload');
      });

      it('should log webhook details for monitoring', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(SAMPLE_WEBHOOK_PAYLOAD);
        await POST(request);

        expect(consoleSpy).toHaveBeenCalledWith('✅ Verified Flutterwave webhook:', {
          event: SAMPLE_WEBHOOK_PAYLOAD.event,
          tx_ref: SAMPLE_WEBHOOK_PAYLOAD.data.tx_ref,
          status: SAMPLE_WEBHOOK_PAYLOAD.data.status,
          amount: SAMPLE_WEBHOOK_PAYLOAD.data.amount,
        });
      });

      it('should handle very large payload signatures correctly', async () => {
        const largePayload = {
          ...SAMPLE_WEBHOOK_PAYLOAD,
          data: {
            ...SAMPLE_WEBHOOK_PAYLOAD.data,
            // Add large string to test signature handling
            large_field: 'x'.repeat(10000),
          },
        };

        mockAxios.onPost(`${MOCK_BACKEND_URL}/payment/webhook`).reply(200, { status: 'ok' });

        const request = createMockWebhookRequest(largePayload);
        const response = await POST(request);

        expect(response.status).toBe(200);
      });
    });
  });

  describe('HTTP method restrictions', () => {
    it('should return 405 for GET requests', async () => {
      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(405);
      expect(json.error).toBe('Method Not Allowed');
      expect(json.message).toBe('Only POST method is allowed for webhook endpoint');
    });

    it('should return 405 for PUT requests', async () => {
      const response = await PUT();
      const json = await response.json();

      expect(response.status).toBe(405);
      expect(json.error).toBe('Method Not Allowed');
      expect(json.message).toBe('Only POST method is allowed for webhook endpoint');
    });

    it('should return 405 for DELETE requests', async () => {
      const response = await DELETE();
      const json = await response.json();

      expect(response.status).toBe(405);
      expect(json.error).toBe('Method Not Allowed');
      expect(json.message).toBe('Only POST method is allowed for webhook endpoint');
    });
  });

  describe('Signature verification function unit tests', () => {
    // We need to test the signature validation function separately
    // since it's not exported. We'll create a utility module for this.
  });
});
