# VTU Platform Frontend

A modern, type-safe VTU (Virtual Top-Up) platform built with Next.js, TypeScript, and a centralized API architecture.

## 🚀 Features

- ✅ **Type-Safe API Layer**: Comprehensive TypeScript API client with automatic type validation
- ✅ **Real-Time Data**: Replaced mock data with live API calls for accurate service information
- ✅ **Modern UI**: Built with Radix UI components and Tailwind CSS
- ✅ **Authentication**: Secure JWT-based authentication with automatic token refresh
- ✅ **Service Management**: Airtime, Data, Cable TV, and Electricity bill payments
- ✅ **Wallet Integration**: Real-time balance tracking and transaction history
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Loading States**: Skeleton loaders and progress indicators for better UX

## 📁 Project Structure

```
├── app/                    # Next.js 13+ app directory
├── components/             # Reusable UI components
│   ├── referrals/          # Referral system components
│   │   ├── StatsCard.tsx   # Statistics display cards
│   │   ├── ShareBox.tsx    # Social sharing component
│   │   ├── ReferralTable.tsx # Referral history table
│   │   ├── WithdrawalDialog.tsx # Withdrawal dialog
│   │   └── index.ts        # Component exports
│   ├── ui/                 # Base UI components
│   └── ...
├── context/               # React context providers
├── docs/                  # Documentation files
│   ├── data-fetching-guidelines.md
│   ├── mock-to-api-map.md
│   └── mock-usage-report.md
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── src/                   # Source code
│   └── api/               # Centralized API client
├── styles/                # Global styles
└── utils/                 # Helper functions
```

## 🛠 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)
- Access to the VTU Platform API

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd StarkTolVTUFRONTEND

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API configuration

# Run the development server
pnpm dev
```

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com/api/v1
NODE_ENV=development

# Mock Data Toggle (for development/testing)
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### Mock Data Toggle

For development and testing purposes, you can toggle between real API calls and mock data:

```bash
# Use mock data (useful for development without backend)
NEXT_PUBLIC_USE_MOCK_DATA=true pnpm dev

# Use real API (default production behavior)
NEXT_PUBLIC_USE_MOCK_DATA=false pnpm dev
```

This is particularly useful for:
- Frontend development without backend dependencies
- Testing UI components with predictable data
- Demo environments

## 🔧 API Integration

This project features a comprehensive API client layer located in `src/api/`. The API layer provides:

- **Type Safety**: Full TypeScript support with interfaces that mirror backend DTOs
- **Authentication**: Automatic token refresh and retry on auth failures
- **Error Handling**: Normalized error responses across all endpoints
- **Retry Logic**: Exponential backoff for failed requests
- **Validation**: Client-side validation before API calls

### Quick Usage

```typescript
import { api } from '@/src/api'

// Authentication
const loginResponse = await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
})

// Wallet operations
const balance = await api.wallet.getBalance()
const transactions = await api.wallet.getTransactions({ page: 1, limit: 10 })

// Service purchases
const airtimeResponse = await api.services.airtime.purchase({
  providerId: 'mtn',
  phoneNumber: '08012345678',
  amount: 1000,
  pin: '1234'
})
```

For detailed API documentation, see [src/api/README.md](src/api/README.md).

## 📖 Data Fetching Guidelines

We follow specific patterns for data fetching, loading states, and error handling. See our [Data Fetching Guidelines](docs/data-fetching-guidelines.md) for:

- How to add new API endpoints
- Standard loading and error UI patterns  
- Testing strategies with Mock Service Worker (MSW)
- Best practices for API integration

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing with MSW
- **Type Safety**: TypeScript compilation testing
- **E2E Tests**: End-to-end user flow testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run type checking
pnpm type-check
```

## 🎨 UI Components

Built with modern UI components:

- **Radix UI**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Tailored VTU platform components
- **Responsive Design**: Mobile-first responsive layouts

### Referral Components

Specialized components for the referral system:

```typescript
import { StatsCard, ShareBox, ReferralTable, WithdrawalDialog } from '@/components/referrals'

// Statistics display
<StatsCard
  title="Total Referrals"
  value={25}
  icon={Users}
  description="+5 this month"
  prefix="₦"
/>

// Social sharing
<ShareBox
  referralUrl="https://example.com/ref/123"
  title="Share Your Referral Link"
/>

// Referral history table
<ReferralTable
  referralHistory={referrals}
  title="Referral History"
/>

// Withdrawal dialog
<WithdrawalDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  availableBalance={1000}
  onSubmit={handleWithdrawal}
/>
```

## 🔒 Security

- JWT-based authentication with automatic refresh
- Secure token storage with httpOnly cookies
- Input validation and sanitization
- CSRF protection
- Environment-based configuration

## 📱 Features

### Authentication
- User registration and login
- Password reset functionality
- Profile management
- Two-factor authentication support

### Wallet Management
- Real-time balance display
- Transaction history
- Wallet funding
- Transfer to other users

### VTU Services
- **Airtime**: All major Nigerian networks
- **Data Plans**: Subscription packages for all networks  
- **Cable TV**: DStv, GOtv, StarTimes subscriptions
- **Electricity**: Bill payments for all DISCOs

### Dashboard
- Service usage analytics
- Recent transactions
- Quick action shortcuts
- Account overview

### Referral System
- **Referral Statistics**: Track total referrals, earnings, and conversion rates
- **Social Sharing**: Share referral links via Facebook, Twitter, Email, and generic share
- **Referral History**: View detailed history of all referred users
- **Withdrawal Management**: Request withdrawals to wallet or bank account
- **Real-time Updates**: Live balance and referral tracking

## 🚀 Deployment

The application can be deployed to various platforms:

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🔄 Release Notes

### Latest Updates
- ✅ **API Integration**: Replaced mock data with real API calls
- ✅ **Type Safety**: Enhanced TypeScript integration
- ✅ **Performance**: Optimized loading states and caching
- ✅ **Error Handling**: Improved error messages and recovery
- ✅ **Documentation**: Comprehensive API and development guidelines

## 📚 Documentation

- [API Documentation](src/api/README.md) - Complete API client guide
- [Data Fetching Guidelines](docs/data-fetching-guidelines.md) - Development patterns
- [Component Library](components/README.md) - UI component documentation
- [Deployment Guide](docs/deployment.md) - Production deployment steps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the [Data Fetching Guidelines](docs/data-fetching-guidelines.md)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Development Team: [Contact Information]
- API Issues: [API Support]
- General Questions: [General Support]
