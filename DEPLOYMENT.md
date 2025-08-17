# StarkTol VTU Platform - Deployment Guide

## 🚀 Quick Deployment

### Option 1: Automated Deployment
```bash
npm run deploy
```

### Option 2: Manual Deployment
```bash
# 1. Clean and install dependencies
rm -rf node_modules package-lock.json .next
npm install

# 2. Build the application
npm run build

# 3. Start production server
npm start
```

## 🔧 Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_BASE=https://backend-066c.onrender.com
   NEXT_PUBLIC_BASE_URL=https://backend-066c.onrender.com/api/v1
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Set environment variables in Netlify dashboard

### Railway/Render
1. Connect your repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Configure environment variables

## 📋 Environment Variables

### Required Variables
```env
NEXT_PUBLIC_API_BASE=https://backend-066c.onrender.com
NEXT_PUBLIC_BASE_URL=https://backend-066c.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=https://your-frontend-url.com
```

### Optional Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
```

## 🛠️ Build Configuration

### Node.js Version
- Required: Node.js >= 18.17.0
- Recommended: Node.js 18.x or 20.x

### Build Process
1. **Dependencies**: Compatible React 18.2.0 and Next.js 14.1.4
2. **TypeScript**: Configured to ignore build errors during deployment
3. **ESLint**: Configured to ignore errors during builds
4. **Images**: Optimized for deployment with unoptimized images for compatibility

## 🔍 Troubleshooting

### Common Issues

#### Build Fails with "Module not found"
```bash
# Clear cache and reinstall
npm run clean
npm install
npm run build
```

#### Environment Variables Not Loading
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Check `.env.production` or platform environment settings
- Restart development server after adding variables

#### Deployment Platform Issues
- **Vercel**: Ensure Node.js version is set to 18.x in dashboard
- **Netlify**: Use `npm run build && npm run export` for static export
- **Railway**: Set `nixpkgs` or specify Node version in `railway.toml`

## 📊 Build Output Structure
```
.next/
├── static/           # Static assets
├── server/          # Server-side code
└── cache/           # Build cache

public/              # Public assets
src/                 # Source code
```

## 🔐 Security Notes

1. **API Keys**: Never commit secret keys to repository
2. **CORS**: Configured for backend-066c.onrender.com
3. **Environment**: Separate configs for development/production

## 📈 Performance Optimizations

- ✅ SWC Minification enabled
- ✅ Image optimization configured
- ✅ Webpack bundle splitting
- ✅ CSS optimization enabled
- ✅ Server-side rendering optimized

## 🚨 Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] API endpoints accessible
- [ ] Build completes without errors
- [ ] No console errors in browser
- [ ] Mobile responsiveness tested
- [ ] Payment integration tested (if using Flutterwave)

## 📞 Support

If deployment issues persist:
1. Check the console for specific error messages
2. Verify all environment variables are set correctly
3. Ensure your backend API is accessible from the deployment platform
4. Test the build locally before deploying

---

✨ **Your StarkTol VTU Platform is now ready for deployment!**
