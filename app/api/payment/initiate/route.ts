import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import axios from 'axios';

// Validation schema for request body
const PaymentInitiateSchema = z.object({
  amount: z.number().positive('Amount must be positive').min(1, 'Minimum amount is 1'),
});

// Type for the validated request body
type PaymentInitiateRequest = z.infer<typeof PaymentInitiateSchema>;

// Response type from backend
interface PaymentInitiateResponse {
  paymentLink: string;
  txRef: string;
}

// Error response type
interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}

/**
 * Helper function to extract userId from Authorization header
 * or fallback to X-User-ID header
 */
function extractUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  const userIdHeader = request.headers.get('x-user-id');
  
  // If we have X-User-ID header, use it directly
  if (userIdHeader) {
    return userIdHeader;
  }
  
  // Try to extract from auth token (if it's a JWT, we'd decode it here)
  // For now, we'll rely on the X-User-ID header that the frontend sets
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In a real app, you'd decode the JWT here to get the user ID
    // For this implementation, we'll rely on X-User-ID header
    return null;
  }
  
  return null;
}

/**
 * Helper function to get access token from Authorization header
 */
function extractAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  
  return null;
}

/**
 * POST /api/payment/initiate
 * 
 * Initiates a payment by validating the request, extracting user info,
 * and proxying to the backend payment service.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    
    let validatedData: PaymentInitiateRequest;
    try {
      validatedData = PaymentInitiateSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            status: 400,
          } satisfies ErrorResponse,
          { status: 400 }
        );
      }
      throw error;
    }

    // 2. Extract userId from auth token or headers
    const userId = extractUserId(request);
    if (!userId) {
      return NextResponse.json(
        {
          error: 'Authentication Error',
          message: 'User ID not found in request. Please ensure you are authenticated.',
          status: 401,
        } satisfies ErrorResponse,
        { status: 401 }
      );
    }

    // 3. Extract access token for backend authentication
    const accessToken = extractAccessToken(request);
    if (!accessToken) {
      return NextResponse.json(
        {
          error: 'Authentication Error',
          message: 'Access token not found. Please ensure you are authenticated.',
          status: 401,
        } satisfies ErrorResponse,
        { status: 401 }
      );
    }

    // 4. Prepare backend request
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
    const backendPayload = {
      amount: validatedData.amount,
      userId: userId,
    };

    // 5. Make request to backend
    try {
      const backendResponse = await axios.post<PaymentInitiateResponse>(
        `${backendUrl}/payment/initiate`,
        backendPayload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      // 6. Return successful response
      const responseData = backendResponse.data;
      
      // Validate that we received the expected response structure
      if (!responseData.paymentLink || !responseData.txRef) {
        return NextResponse.json(
          {
            error: 'Backend Error',
            message: 'Invalid response from payment service. Missing required fields.',
            status: 502,
          } satisfies ErrorResponse,
          { status: 502 }
        );
      }

      return NextResponse.json({
        paymentLink: responseData.paymentLink,
        txRef: responseData.txRef,
      } satisfies PaymentInitiateResponse);

    } catch (backendError) {
      console.error('Backend payment initiation error:', backendError);
      
      if (axios.isAxiosError(backendError)) {
        const status = backendError.response?.status || 500;
        const message = backendError.response?.data?.message || 
                       backendError.message || 
                       'Failed to initiate payment';
        
        return NextResponse.json(
          {
            error: 'Backend Error',
            message: message,
            status: status,
          } satisfies ErrorResponse,
          { status: status }
        );
      }
      
      // Non-axios error
      return NextResponse.json(
        {
          error: 'Internal Error',
          message: 'An unexpected error occurred while processing payment',
          status: 500,
        } satisfies ErrorResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Payment initiate API error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        status: 500,
      } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method Not Allowed',
      message: 'Only POST method is allowed for this endpoint',
      status: 405,
    } satisfies ErrorResponse,
    { status: 405 }
  );
}
