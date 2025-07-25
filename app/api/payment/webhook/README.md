# Flutterwave Webhook API Endpoint

This API endpoint handles Flutterwave webhook notifications for payment events.

## Overview

The `/api/payment/webhook` endpoint:

1. **Receives** Flutterwave webhook notifications
2. **Verifies** the webhook signature using `FLW_SECRET_HASH`
3. **Forwards** verified payloads to the backend `/api/v1/payment/webhook`
4. **Responds** with a 200 status quickly to acknowledge receipt

## Endpoint Details

- **URL**: `/api/payment/webhook`
- **Method**: `POST` only
- **Content-Type**: `application/json`

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FLW_SECRET_HASH` | Flutterwave webhook secret hash for signature verification | Yes |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL (defaults to production if not set) | No |

### Example Environment Setup

```bash
# .env.local
FLW_SECRET_HASH=your-flutterwave-webhook-secret-hash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.com/api/v1
```

## Webhook Signature Verification

The endpoint validates webhook authenticity using HMAC SHA256 signature verification:

1. Extracts signature from `verif-hash` header
2. Generates expected signature using payload + secret hash
3. Compares signatures using timing-safe comparison
4. Rejects requests with invalid signatures

## Request/Response Examples

### Valid Webhook Request

```http
POST /api/payment/webhook
Content-Type: application/json
verif-hash: abc123def456789...

{
  "event": "charge.completed",
  "data": {
    "id": 123456789,
    "tx_ref": "starktol_1642598400000_123",
    "flw_ref": "FLW-MOCK-REF-123456789",
    "amount": 1000,
    "currency": "NGN",
    "status": "successful",
    "customer": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Success Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "success",
  "message": "Webhook received and verified successfully"
}
```

### Error Responses

#### Missing Signature

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Bad Request",
  "message": "Webhook signature is required",
  "status": 400
}
```

#### Invalid Signature

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Unauthorized",
  "message": "Invalid webhook signature",
  "status": 401
}
```

#### Configuration Error

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Internal Server Error",
  "message": "Webhook configuration error",
  "status": 500
}
```

## Backend Integration

The webhook forwards verified payloads to your backend with these headers:

```http
POST /api/v1/payment/webhook
Content-Type: application/json
X-Webhook-Source: flutterwave
X-Signature-Verified: true

{...webhook payload...}
```

## Error Handling

### Frontend Response Strategy

- **Always responds with 200** to Flutterwave (except for signature/config errors)
- **Logs all errors** for monitoring and debugging
- **Uses fire-and-forget** pattern for backend forwarding to respond quickly

### Backend Forwarding Failures

If backend forwarding fails:
- Error is logged for investigation
- 200 response is still sent to Flutterwave
- Consider implementing retry logic or dead letter queue

## Security Features

1. **Signature Verification**: Uses HMAC SHA256 with timing-safe comparison
2. **Environment Variable Protection**: Secret hash not exposed in code
3. **Input Validation**: Validates JSON payload format
4. **Error Handling**: Graceful error handling prevents information leakage

## Testing

### Running Tests

```bash
# Run webhook tests
npm test __tests__/api/payment/webhook/route.test.ts

# Run signature utility tests
npm test __tests__/lib/utils/webhookSignature.test.ts

# Run all tests with coverage
npm run test:coverage
```

### Test Coverage

The test suite covers:
- ✅ Signature verification (valid/invalid cases)
- ✅ Environment variable handling
- ✅ Payload validation
- ✅ Backend forwarding scenarios
- ✅ Error handling edge cases
- ✅ HTTP method restrictions
- ✅ Integration scenarios

## Monitoring and Logging

### Webhook Events Logged

```javascript
// Successful webhook verification
console.log('✅ Verified Flutterwave webhook:', {
  event: 'charge.completed',
  tx_ref: 'starktol_1642598400000_123',
  status: 'successful',
  amount: 1000,
});

// Backend forwarding success
console.log('✅ Webhook forwarded to backend successfully');

// Backend forwarding failure
console.error('❌ Failed to forward webhook to backend:', error);
```

### Metrics to Monitor

- Webhook receipt rate
- Signature verification success/failure rate
- Backend forwarding success rate
- Response time (should be < 15 seconds)

## Common Issues and Solutions

### Issue: Webhook signature verification fails

**Causes:**
- Incorrect `FLW_SECRET_HASH` environment variable
- Payload modification during transmission
- Clock synchronization issues

**Solutions:**
- Verify webhook secret hash in Flutterwave dashboard
- Check for middleware that modifies request body
- Ensure consistent string encoding (UTF-8)

### Issue: Backend forwarding timeouts

**Causes:**
- Backend server overload
- Network connectivity issues
- Backend endpoint not responding

**Solutions:**
- Implement backend health checks
- Add retry logic with exponential backoff
- Consider using message queue for reliability

### Issue: Duplicate webhook processing

**Causes:**
- Flutterwave retry mechanism
- Multiple webhook endpoints configured

**Solutions:**
- Implement idempotency checks in backend
- Use transaction reference for deduplication
- Respond quickly (< 15 seconds) to prevent retries

## Development Checklist

When setting up webhook handling:

- [ ] Configure `FLW_SECRET_HASH` environment variable
- [ ] Set up backend webhook endpoint at `/api/v1/payment/webhook`
- [ ] Test signature verification with sample payloads
- [ ] Verify webhook URL in Flutterwave dashboard
- [ ] Implement backend idempotency checks
- [ ] Set up monitoring and alerting
- [ ] Test error scenarios (invalid signatures, backend failures)
- [ ] Verify response times are under 15 seconds

## Related Files

- `app/api/payment/webhook/route.ts` - Main webhook endpoint
- `lib/utils/webhookSignature.ts` - Signature verification utilities
- `__tests__/api/payment/webhook/route.test.ts` - Webhook endpoint tests
- `__tests__/lib/utils/webhookSignature.test.ts` - Signature utility tests

## References

- [Flutterwave Webhook Documentation](https://developer.flutterwave.com/docs/integration-guides/webhooks)
- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [HMAC Security Best Practices](https://tools.ietf.org/html/rfc2104)
