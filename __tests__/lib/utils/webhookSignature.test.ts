/**
 * @jest-environment node
 */

import {
  validateFlutterwaveWebhookSignature,
  generateWebhookSignature,
  validateWebhookSignatureDetailed,
  extractWebhookSignature,
  WEBHOOK_SIGNATURE_CONSTANTS,
  WebhookValidationResult,
} from '@/lib/utils/webhookSignature';

describe('webhookSignature utility functions', () => {
  const TEST_SECRET = 'test-webhook-secret-hash';
  const TEST_PAYLOAD = JSON.stringify({
    event: 'charge.completed',
    data: {
      id: 123456,
      tx_ref: 'test_tx_ref_123',
      amount: 1000,
      status: 'successful',
    },
  });

  describe('generateWebhookSignature', () => {
    it('should generate a valid hex signature', () => {
      const signature = generateWebhookSignature(TEST_PAYLOAD, TEST_SECRET);
      
      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature).toHaveLength(64); // SHA256 hex string length
      expect(/^[a-f0-9]+$/.test(signature)).toBe(true);
    });

    it('should generate different signatures for different payloads', () => {
      const payload1 = JSON.stringify({ data: 'test1' });
      const payload2 = JSON.stringify({ data: 'test2' });
      
      const signature1 = generateWebhookSignature(payload1, TEST_SECRET);
      const signature2 = generateWebhookSignature(payload2, TEST_SECRET);
      
      expect(signature1).not.toBe(signature2);
    });

    it('should generate different signatures for different secrets', () => {
      const secret1 = 'secret1';
      const secret2 = 'secret2';
      
      const signature1 = generateWebhookSignature(TEST_PAYLOAD, secret1);
      const signature2 = generateWebhookSignature(TEST_PAYLOAD, secret2);
      
      expect(signature1).not.toBe(signature2);
    });

    it('should generate consistent signatures for the same input', () => {
      const signature1 = generateWebhookSignature(TEST_PAYLOAD, TEST_SECRET);
      const signature2 = generateWebhookSignature(TEST_PAYLOAD, TEST_SECRET);
      
      expect(signature1).toBe(signature2);
    });
  });

  describe('validateFlutterwaveWebhookSignature', () => {
    it('should validate correct signature', () => {
      const validSignature = generateWebhookSignature(TEST_PAYLOAD, TEST_SECRET);
      
      const isValid = validateFlutterwaveWebhookSignature(TEST_PAYLOAD, validSignature, TEST_SECRET);
      
      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', () => {
      const invalidSignature = 'invalid-signature-hash';
      
      const isValid = validateFlutterwaveWebhookSignature(TEST_PAYLOAD, invalidSignature, TEST_SECRET);
      
      expect(isValid).toBe(false);
    });

    it('should reject signature generated with different secret', () => {
      const wrongSecret = 'wrong-secret';
      const signatureWithWrongSecret = generateWebhookSignature(TEST_PAYLOAD, wrongSecret);
      
      const isValid = validateFlutterwaveWebhookSignature(TEST_PAYLOAD, signatureWithWrongSecret, TEST_SECRET);
      
      expect(isValid).toBe(false);
    });

    it('should reject signature for modified payload', () => {
      const originalPayload = JSON.stringify({ amount: 1000 });
      const modifiedPayload = JSON.stringify({ amount: 2000 });
      const signature = generateWebhookSignature(originalPayload, TEST_SECRET);
      
      const isValid = validateFlutterwaveWebhookSignature(modifiedPayload, signature, TEST_SECRET);
      
      expect(isValid).toBe(false);
    });

    it('should handle empty payload', () => {
      const emptyPayload = '';
      const signature = generateWebhookSignature(emptyPayload, TEST_SECRET);
      
      const isValid = validateFlutterwaveWebhookSignature(emptyPayload, signature, TEST_SECRET);
      
      expect(isValid).toBe(true);
    });

    it('should handle errors gracefully', () => {
      // Mock console.error to suppress error logs in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Invalid hex signature should trigger the catch block
      const isValid = validateFlutterwaveWebhookSignature(TEST_PAYLOAD, 'invalid-hex-signature', TEST_SECRET);
      
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('validateWebhookSignatureDetailed', () => {
    it('should return detailed validation result for valid signature', () => {
      const validSignature = generateWebhookSignature(TEST_PAYLOAD, TEST_SECRET);
      
      const result = validateWebhookSignatureDetailed(TEST_PAYLOAD, validSignature, TEST_SECRET);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.details).toBeDefined();
      expect(result.details?.expectedSignature).toBe(validSignature);
      expect(result.details?.receivedSignature).toBe(validSignature);
      expect(result.details?.payloadLength).toBe(TEST_PAYLOAD.length);
    });

    it('should return detailed validation result for invalid signature', () => {
      const invalidSignature = 'abc123invalid';
      
      const result = validateWebhookSignatureDetailed(TEST_PAYLOAD, invalidSignature, TEST_SECRET);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid signature format');
      expect(result.details?.receivedSignature).toBe(invalidSignature);
    });

    it('should validate empty payload when allowed', () => {
      const emptyPayload = '';
      const signature = generateWebhookSignature(emptyPayload, TEST_SECRET);
      
      const result = validateWebhookSignatureDetailed(emptyPayload, signature, TEST_SECRET, {
        allowEmptyPayload: true,
      });
      
      expect(result.isValid).toBe(true);
    });

    it('should reject empty payload when not allowed', () => {
      const result = validateWebhookSignatureDetailed('', 'signature', TEST_SECRET, {
        allowEmptyPayload: false,
      });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Payload cannot be empty');
    });

    it('should reject payload exceeding max size', () => {
      const largePayload = 'x'.repeat(1000);
      const signature = generateWebhookSignature(largePayload, TEST_SECRET);
      
      const result = validateWebhookSignatureDetailed(largePayload, signature, TEST_SECRET, {
        maxPayloadSize: 500,
      });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Payload size exceeds maximum');
      expect(result.details?.payloadLength).toBe(1000);
    });

    it('should reject empty signature', () => {
      const result = validateWebhookSignatureDetailed(TEST_PAYLOAD, '', TEST_SECRET);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Signature cannot be empty');
    });

    it('should reject empty secret', () => {
      const signature = generateWebhookSignature(TEST_PAYLOAD, TEST_SECRET);
      
      const result = validateWebhookSignatureDetailed(TEST_PAYLOAD, signature, '');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Secret cannot be empty');
    });

    it('should reject non-hex signature', () => {
      const result = validateWebhookSignatureDetailed(TEST_PAYLOAD, 'not-hex-signature!', TEST_SECRET);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid signature format - must be hexadecimal');
    });

    it('should log validation when requested', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const validSignature = generateWebhookSignature(TEST_PAYLOAD, TEST_SECRET);
      
      validateWebhookSignatureDetailed(TEST_PAYLOAD, validSignature, TEST_SECRET, {
        logValidation: true,
      });
      
      expect(consoleSpy).toHaveBeenCalledWith('Webhook signature validation:', {
        isValid: true,
        payloadLength: TEST_PAYLOAD.length,
        signatureLength: validSignature.length,
      });
      
      consoleSpy.mockRestore();
    });

    it('should handle crypto errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Use a signature that will cause buffer creation to fail (odd length hex)
      const result = validateWebhookSignatureDetailed(TEST_PAYLOAD, 'odd-length-hex1', TEST_SECRET);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid signature format - must be hexadecimal');
      
      consoleSpy.mockRestore();
    });
  });

  describe('extractWebhookSignature', () => {
    it('should extract signature from Headers object', () => {
      const headers = new Headers();
      headers.set('verif-hash', 'abc123def456');
      
      const signature = extractWebhookSignature(headers);
      
      expect(signature).toBe('abc123def456');
    });

    it('should extract signature from plain object with string value', () => {
      const headers = {
        'verif-hash': 'abc123def456',
        'content-type': 'application/json',
      };
      
      const signature = extractWebhookSignature(headers);
      
      expect(signature).toBe('abc123def456');
    });

    it('should extract signature from plain object with array value', () => {
      const headers = {
        'verif-hash': ['abc123def456', 'another-value'],
        'content-type': 'application/json',
      };
      
      const signature = extractWebhookSignature(headers);
      
      expect(signature).toBe('abc123def456');
    });

    it('should return null when signature header is missing', () => {
      const headers = {
        'content-type': 'application/json',
      };
      
      const signature = extractWebhookSignature(headers);
      
      expect(signature).toBeNull();
    });

    it('should return null when signature has invalid format', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const headers = new Headers();
      headers.set('verif-hash', 'invalid-signature!@#');
      
      const signature = extractWebhookSignature(headers);
      
      expect(signature).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Invalid webhook signature format received:', 'invalid-signature!@#');
      
      consoleSpy.mockRestore();
    });

    it('should return null when array is empty', () => {
      const headers = {
        'verif-hash': [],
      };
      
      const signature = extractWebhookSignature(headers);
      
      expect(signature).toBeNull();
    });
  });

  describe('WEBHOOK_SIGNATURE_CONSTANTS', () => {
    it('should have correct constant values', () => {
      expect(WEBHOOK_SIGNATURE_CONSTANTS.HEADER_NAME).toBe('verif-hash');
      expect(WEBHOOK_SIGNATURE_CONSTANTS.ALGORITHM).toBe('sha256');
      expect(WEBHOOK_SIGNATURE_CONSTANTS.ENCODING).toBe('hex');
      expect(WEBHOOK_SIGNATURE_CONSTANTS.MAX_PAYLOAD_SIZE).toBe(1024 * 1024);
      expect(WEBHOOK_SIGNATURE_CONSTANTS.MIN_SIGNATURE_LENGTH).toBe(64);
      expect(WEBHOOK_SIGNATURE_CONSTANTS.MAX_SIGNATURE_LENGTH).toBe(64);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete webhook validation flow', () => {
      // Simulate receiving a webhook
      const webhookPayload = {
        event: 'charge.completed',
        data: {
          id: 987654321,
          tx_ref: 'starktol_integration_test',
          amount: 5000,
          status: 'successful',
          customer: {
            email: 'test@example.com',
          },
        },
      };
      
      const payloadString = JSON.stringify(webhookPayload);
      const secret = 'integration-test-secret';
      
      // Generate signature (this would be done by Flutterwave)
      const signature = generateWebhookSignature(payloadString, secret);
      
      // Validate signature (this is what our webhook endpoint does)
      const isValid = validateFlutterwaveWebhookSignature(payloadString, signature, secret);
      
      expect(isValid).toBe(true);
      
      // Get detailed validation
      const detailedResult = validateWebhookSignatureDetailed(payloadString, signature, secret);
      
      expect(detailedResult.isValid).toBe(true);
      expect(detailedResult.details?.payloadLength).toBe(payloadString.length);
    });

    it('should detect tampering with webhook payload', () => {
      const originalPayload = { amount: 1000, status: 'successful' };
      const tamperedPayload = { amount: 9999999, status: 'successful' };
      
      const originalPayloadString = JSON.stringify(originalPayload);
      const tamperedPayloadString = JSON.stringify(tamperedPayload);
      
      // Signature generated for original payload
      const signature = generateWebhookSignature(originalPayloadString, TEST_SECRET);
      
      // Try to validate tampered payload with original signature
      const isValid = validateFlutterwaveWebhookSignature(tamperedPayloadString, signature, TEST_SECRET);
      
      expect(isValid).toBe(false);
    });

    it('should handle various payload formats', () => {
      const payloads = [
        '{}',
        '{"simple": "value"}',
        JSON.stringify({ complex: { nested: { object: true } } }),
        JSON.stringify([1, 2, 3, 4, 5]),
        'simple string payload',
      ];
      
      payloads.forEach((payload) => {
        const signature = generateWebhookSignature(payload, TEST_SECRET);
        const isValid = validateFlutterwaveWebhookSignature(payload, signature, TEST_SECRET);
        
        expect(isValid).toBe(true);
      });
    });
  });
});
