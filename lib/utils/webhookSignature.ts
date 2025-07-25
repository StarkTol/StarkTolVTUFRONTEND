import crypto from 'crypto';

/**
 * Validate Flutterwave webhook signature using HMAC SHA256
 * 
 * @param payload - The raw webhook payload as a string
 * @param signature - The signature from the 'verif-hash' header
 * @param secret - The webhook secret hash from FLW_SECRET_HASH environment variable
 * @returns boolean indicating if the signature is valid
 */
export function validateFlutterwaveWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Generate expected signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');
    
    // Compare signatures using timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature validation error:', error);
    return false;
  }
}

/**
 * Generate a webhook signature for testing purposes
 * 
 * @param payload - The webhook payload as a string
 * @param secret - The webhook secret hash
 * @returns The generated signature
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
}

/**
 * Validate webhook signature with additional security checks
 * 
 * @param payload - The raw webhook payload as a string
 * @param signature - The signature from the 'verif-hash' header
 * @param secret - The webhook secret hash from FLW_SECRET_HASH environment variable
 * @param options - Additional validation options
 * @returns Validation result with details
 */
export interface WebhookValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    expectedSignature?: string;
    receivedSignature?: string;
    payloadLength?: number;
  };
}

export function validateWebhookSignatureDetailed(
  payload: string,
  signature: string,
  secret: string,
  options: {
    maxPayloadSize?: number;
    allowEmptyPayload?: boolean;
    logValidation?: boolean;
  } = {}
): WebhookValidationResult {
  const {
    maxPayloadSize = 1024 * 1024, // 1MB default max payload size
    allowEmptyPayload = false,
    logValidation = false,
  } = options;

  try {
    // Validate inputs
    if (!payload && !allowEmptyPayload) {
      return {
        isValid: false,
        error: 'Payload cannot be empty',
      };
    }

    if (!signature) {
      return {
        isValid: false,
        error: 'Signature cannot be empty',
      };
    }

    if (!secret) {
      return {
        isValid: false,
        error: 'Secret cannot be empty',
      };
    }

    // Check payload size
    if (payload.length > maxPayloadSize) {
      return {
        isValid: false,
        error: `Payload size exceeds maximum allowed size of ${maxPayloadSize} bytes`,
        details: {
          payloadLength: payload.length,
        },
      };
    }

    // Validate signature format (should be hex string)
    if (!/^[a-fA-F0-9]+$/.test(signature)) {
      return {
        isValid: false,
        error: 'Invalid signature format - must be hexadecimal',
        details: {
          receivedSignature: signature,
        },
      };
    }

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    // Compare signatures
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );

    if (logValidation) {
      console.log('Webhook signature validation:', {
        isValid,
        payloadLength: payload.length,
        signatureLength: signature.length,
      });
    }

    return {
      isValid,
      details: {
        expectedSignature,
        receivedSignature: signature,
        payloadLength: payload.length,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (logValidation) {
      console.error('Webhook signature validation error:', error);
    }

    return {
      isValid: false,
      error: `Signature validation failed: ${errorMessage}`,
    };
  }
}

/**
 * Extract and validate webhook signature from request headers
 * 
 * @param headers - Request headers object or Headers instance
 * @returns The extracted signature or null if not found/invalid
 */
export function extractWebhookSignature(
  headers: Headers | Record<string, string | string[] | undefined>
): string | null {
  let signature: string | null = null;

  if (headers instanceof Headers) {
    signature = headers.get('verif-hash');
  } else {
    const verifHash = headers['verif-hash'];
    if (typeof verifHash === 'string') {
      signature = verifHash;
    } else if (Array.isArray(verifHash) && verifHash.length > 0) {
      signature = verifHash[0];
    }
  }

  // Validate signature format
  if (signature && !/^[a-fA-F0-9]+$/.test(signature)) {
    console.warn('Invalid webhook signature format received:', signature);
    return null;
  }

  return signature;
}

/**
 * Constants for webhook validation
 */
export const WEBHOOK_SIGNATURE_CONSTANTS = {
  HEADER_NAME: 'verif-hash',
  ALGORITHM: 'sha256',
  ENCODING: 'hex' as const,
  MAX_PAYLOAD_SIZE: 1024 * 1024, // 1MB
  MIN_SIGNATURE_LENGTH: 64, // SHA256 hex string length
  MAX_SIGNATURE_LENGTH: 64, // SHA256 hex string length
} as const;
