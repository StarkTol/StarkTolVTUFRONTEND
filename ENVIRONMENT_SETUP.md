# Environment Setup Guide

This guide will help you configure your application to work with both local and production environments seamlessly.

## Overview

Your application is configured to work with:

- **Local Backend**: `http://localhost:8000`
- **Production Backend**: `https://backend-066c.onrender.com`
- **Local Frontend**: `http://localhost:3000`
- **Production Frontend**: `https://starktolvtu.onrender.com`

## Quick Setup

### 1. Current Configuration

Your environment is currently set to use **local development** with the following URLs:
- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### 2. Environment Switching

You can easily switch between local and production environments using the provided scripts:

```bash
# Switch to local backend (for development)
npm run env:local

# Switch to production backend (for testing with live data)
npm run env:prod

# Check current environment status
npm run env:status
```

### 3. Starting the Application

#### For Local Development:
```bash
# 1. Make sure you're using local environment
npm run env:local

# 2. Start your local backend server on port 8000
# (Your backend should be running separately)

# 3. Start the frontend development server
npm run dev
```

#### For Production Testing:
```bash
# 1. Switch to production environment
npm run env:prod

# 2. Start the frontend (will connect to production backend)
npm run dev
```

## Environment Files

### `.env.local` (Current Environment)
This file contains your current environment configuration. The key variables are:

```env
# Toggle between local and production
USE_LOCAL_BACKEND=true

# Backend URLs
LOCAL_API_BASE=http://localhost:8000
PRODUCTION_API_BASE=https://backend-066c.onrender.com

# Current active configuration
NEXT_PUBLIC_API_BASE=http://localhost:8000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

### `.env.production` (Production Template)
Template for production deployment with production backend URLs.

## Features

### 🔄 Dynamic Environment Switching
- Automatically detects and switches between local/production backends
- No code changes required - just environment variable updates
- Smart fallbacks for missing configuration

### 🛡️ Robust Authentication
- Automatic token refresh
- Proper error handling for both environments
- Session management with localStorage/sessionStorage options

### ⚡ Real-time Updates
- Supabase integration for live data synchronization
- Real-time wallet balance updates
- Live transaction notifications

### 🐛 Debug Tools
- Development-only debug panel
- Environment configuration validation  
- Real-time system monitoring

## Usage Examples

### Switch to Local Development
```bash
npm run env:local
npm run dev
```
Your app will connect to `http://localhost:8000`

### Test with Production Data
```bash
npm run env:prod  
npm run dev
```
Your app will connect to `https://backend-066c.onrender.com`

### Check Current Status
```bash
npm run env:status
```
Output:
```
🔧 Current Environment Configuration:
=====================================
API Base:           http://localhost:8000
Base URL:           http://localhost:8000
Use Local Backend:  true
Frontend URL:       http://localhost:3000
Debug Mode:         true

📍 Current Mode: 🏠 LOCAL
```

## Configuration Details

### Environment Variables Explained

| Variable | Description | Local Value | Production Value |
|----------|-------------|-------------|------------------|
| `NEXT_PUBLIC_API_BASE` | Main API base URL | `http://localhost:8000` | `https://backend-066c.onrender.com` |
| `NEXT_PUBLIC_BASE_URL` | API endpoints base | `http://localhost:8000` | `https://backend-066c.onrender.com/api/v1` |
| `USE_LOCAL_BACKEND` | Environment toggle | `true` | `false` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` | `https://starktolvtu.onrender.com` |
| `NEXT_PUBLIC_DEBUG_MODE` | Debug panel | `true` | `false` |

### Services Configuration

#### Supabase (Real-time Updates)
```env
NEXT_PUBLIC_SUPABASE_URL=https://wgvowaefweylltjmbxfk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Flutterwave (Payments)
```env
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-9ea7b1f9c84cea2fc17bd763dd34ec87-X
```

## Troubleshooting

### Common Issues

#### 1. "API Request Failed" Errors
**Cause**: Backend not running or wrong URL
**Solution**: 
```bash
# Check current environment
npm run env:status

# Switch to correct environment
npm run env:local  # if backend is local
npm run env:prod   # if backend is production
```

#### 2. Authentication Errors
**Cause**: Token issues or environment mismatch
**Solution**:
- Clear browser localStorage
- Restart development server
- Check debug panel for auth status

#### 3. Real-time Updates Not Working
**Cause**: Supabase configuration or user ID mismatch
**Solution**:
- Verify Supabase credentials in `.env.local`
- Check debug panel for real-time status
- Ensure user is properly authenticated

### Debug Panel

In development mode, you'll see an "Auth Debug" button in the bottom-left corner. This shows:
- Authentication status
- User data validation
- API configuration
- Real-time connection status

## Deployment

### Local Development
1. Ensure your backend is running on `http://localhost:8000`
2. Run `npm run env:local`
3. Start with `npm run dev`

### Production Deployment
1. Environment variables are automatically set for production
2. Build with `npm run build`
3. Deploy to your hosting platform

## API Endpoints

The application automatically adjusts API endpoints based on environment:

### Local Development
- Base: `http://localhost:8000`
- Auth: `http://localhost:8000/auth/*`
- User: `http://localhost:8000/user/*`
- Wallet: `http://localhost:8000/wallet/*`

### Production
- Base: `https://backend-066c.onrender.com`
- Auth: `https://backend-066c.onrender.com/auth/*`
- User: `https://backend-066c.onrender.com/user/*`
- Wallet: `https://backend-066c.onrender.com/wallet/*`

## Support

If you encounter any issues:

1. Check the debug panel (development only)
2. Verify environment configuration with `npm run env:status`
3. Ensure backend server is running and accessible
4. Check browser console for detailed error messages

## Next Steps

1. **Start Development**: Run `npm run env:local && npm run dev`
2. **Test Registration/Login**: Try creating a new account
3. **Verify Real-time**: Check if wallet updates work in real-time
4. **Test Environment Switching**: Switch between local/prod to verify both work

Your application is now configured to work seamlessly with both environments! 🚀
