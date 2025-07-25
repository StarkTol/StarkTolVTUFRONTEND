import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { validateFlutterwaveWebhookSignature } from '@/lib/utils/webhookSignature';

// Interface for Flutterwave webhook payload
interface FlutterwaveWebhookPayload {
  event: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: string;
    created_at: string;
    account_id: number;
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: string;
    };
    card?: {
      first_6digits: string;
      last_4digits: string;
      issuer: string;
      country: string;
      type: string;
      expiry: string;
    };
  };
  event_type: string;
}

// Error response type
interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}


/**
 * POST /api/payment/webhook
 * 
 * Handles Flutterwave webhook notifications by:
 * 1. Verifying the webhook signature using FLW_SECRET_HASH
 * 2. Forwarding the verified payload to the backend webhook endpoint
 * 3. Responding with a 200 status quickly to acknowledge receipt
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Get the raw body for signature verification
    const body = await request.text();
    
    // 2. Get the signature from headers
    const signature = request.headers.get('verif-hash');
    if (!signature) {
      console.error('Webhook signature missing');
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Webhook signature is required',
          status: 400,
        } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    // 3. Get the webhook secret hash from environment variables
    const webhookHash = process.env.FLW_SECRET_HASH;
    if (!webhookHash) {
      console.error('FLW_SECRET_HASH environment variable not set');
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Webhook configuration error',
          status: 500,
        } satisfies ErrorResponse,
        { status: 500 }
      );
    }

    // 4. Verify the webhook signature
    if (!validateFlutterwaveWebhookSignature(body, signature, webhookHash)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid webhook signature',
          status: 401,
        } satisfies ErrorResponse,
        { status: 401 }
      );
    }

    // 5. Parse the payload
    let webhookPayload: FlutterwaveWebhookPayload;
    try {
      webhookPayload = JSON.parse(body);
    } catch (parseError) {
      console.error('Invalid JSON payload:', parseError);
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Invalid JSON payload',
          status: 400,
        } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    // 6. Log the webhook event for monitoring
    console.log('✅ Verified Flutterwave webhook:', {
      event: webhookPayload.event,
      tx_ref: webhookPayload.data?.tx_ref,
      status: webhookPayload.data?.status,
      amount: webhookPayload.data?.amount,
    });

    // 7. Forward to backend webhook endpoint (don't wait for response to respond quickly)
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
    
    // Fire and forget - don't await this to respond quickly to Flutterwave
    setImmediate(async () => {
      try {
        await axios.post(
          `${backendUrl}/payment/webhook`,
          webhookPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Source': 'flutterwave',
              'X-Signature-Verified': 'true',
            },
            timeout: 30000, // 30 second timeout
          }
        );
        console.log('✅ Webhook forwarded to backend successfully');
      } catch (backendError) {
        console.error('❌ Failed to forward webhook to backend:', backendError);
        
        if (axios.isAxiosError(backendError)) {
          console.error('Backend response:', backendError.response?.data);
        }
        
        // TODO: Implement retry logic or dead letter queue for failed webhook forwards
        // For now, we just log the error since we already responded to Flutterwave
      }
    });

    // 8. Respond quickly to Flutterwave (within 15 seconds as per their requirement)
    return NextResponse.json(
      { 
        status: 'success',
        message: 'Webhook received and verified successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Still respond with 200 to avoid Flutterwave retries for non-signature issues
    // The actual error handling will be logged for investigation
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Webhook processing failed but acknowledged' 
      },
      { status: 200 }
    );
  }
}

/**
 * Handle other HTTP methods
 * Webhooks should only be POST requests
 */
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method Not Allowed',
      message: 'Only POST method is allowed for webhook endpoint',
      status: 405,
    } satisfies ErrorResponse,
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      error: 'Method Not Allowed',
      message: 'Only POST method is allowed for webhook endpoint',
      status: 405,
    } satisfies ErrorResponse,
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: 'Method Not Allowed',
      message: 'Only POST method is allowed for webhook endpoint',
      status: 405,
    } satisfies ErrorResponse,
    { status: 405 }
  );
}
