import { useState, useEffect } from 'react';
// import { getCableTransactions, getCableProviders, getCablePlans } from '@/src/api';
// import { formatCurrency } from '@/src/api';

// Mock data fallback until API endpoints are available
const mockProviders = [
  { id: "dstv", name: "DSTV", logo: "/dstv.logo.jpg?height=60&width=60" },
  { id: "gotv", name: "GOTV", logo: "/gotv.logo.jpg?height=60&width=60" },
  { id: "startimes", name: "Startimes", logo: "/startime.logo.jpg?height=60&width=60" },
  { id: "showmax", name: "Showmax", logo: "/Showmax.jpg?height=60&width=60" },
];

const mockPackages = {
  dstv: [
    { id: "dstv-premium", name: "DSTV Premium", price: "₦24,500" },
    { id: "dstv-compact-plus", name: "DSTV Compact Plus", price: "₦18,600" },
    { id: "dstv-compact", name: "DSTV Compact", price: "₦10,500" },
    { id: "dstv-confam", name: "DSTV Confam", price: "₦7,100" },
    { id: "dstv-yanga", name: "DSTV Yanga", price: "₦4,200" },
  ],
  gotv: [
    { id: "gotv-max", name: "GOTV Max", price: "₦4,850" },
    { id: "gotv-jolli", name: "GOTV Jolli", price: "₦3,950" },
    { id: "gotv-jinja", name: "GOTV Jinja", price: "₦2,250" },
    { id: "gotv-smallie", name: "GOTV Smallie", price: "₦1,100" },
  ],
  startimes: [
    { id: "startimes-super", name: "Startimes Super", price: "₦4,900" },
    { id: "startimes-classic", name: "Startimes Classic", price: "₦2,800" },
    { id: "startimes-basic", name: "Startimes Basic", price: "₦1,850" },
    { id: "startimes-nova", name: "Startimes Nova", price: "₦1,200" },
  ],
  showmax: [
    { id: "showmax-premium", name: "Showmax Premium", price: "₦5,500" },
    { id: "showmax-standard", name: "Showmax Standard", price: "₦3,200" },
    { id: "showmax-mobile", name: "Showmax Mobile", price: "₦1,500" },
  ],
};

const mockTransactions = [
  {
    id: 1,
    provider: "DSTV",
    smartCardNumber: "12345678901",
    package: "DSTV Premium",
    amount: "₦24,500",
    date: "Today, 10:30 AM",
    status: "success",
  },
  {
    id: 2,
    provider: "GOTV",
    smartCardNumber: "98765432109",
    package: "GOTV Max",
    amount: "₦4,850",
    date: "Yesterday, 3:15 PM",
    status: "success",
  },
  {
    id: 3,
    provider: "Startimes",
    smartCardNumber: "45678901234",
    package: "Startimes Super",
    amount: "₦4,900",
    date: "23/04/2023, 9:00 AM",
    status: "failed",
  },
  {
    id: 4,
    provider: "DSTV",
    smartCardNumber: "56789012345",
    package: "DSTV Compact Plus",
    amount: "₦18,600",
    date: "20/04/2023, 11:45 AM",
    status: "success",
  },
];

interface Provider {
  id: string;
  name: string;
  logo: string;
}

interface CablePackage {
  id: string;
  name: string;
  price: string;
}

interface Transaction {
  id: string | number;
  provider: string;
  smartCardNumber: string;
  package: string;
  amount: string;
  date: string;
  status: string;
}

interface UseCableReturn {
  providers: Provider[];
  packages: Record<string, CablePackage[]>;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const useCable = (): UseCableReturn => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [packages, setPackages] = useState<Record<string, CablePackage[]>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCableData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // TODO: Replace with actual API calls when endpoints are available
      // const [providersResponse, transactionsResponse] = await Promise.all([
      //   getCableProviders(),
      //   getCableTransactions({ limit: 10 }),
      // ]);
      
      // For now, use mock data but structure it like API responses
      const providersResponse = { success: true, data: mockProviders };
      const transactionsResponse = { success: true, data: mockTransactions };

      if (providersResponse.success) {
        setProviders(providersResponse.data);
        
        // Set mock packages for each provider
        setPackages(mockPackages);
        
        // TODO: Fetch plans for each provider when API is available
        // for (const provider of providersResponse.data) {
        //   const plansResponse = await getCablePlans({ providerId: provider.id });
        //   if (plansResponse.success) {
        //     setPackages((prev) => ({ ...prev, [provider.id]: plansResponse.data }));
        //   }
        // }
      }

      if (transactionsResponse.success && Array.isArray(transactionsResponse.data)) {
        setTransactions(transactionsResponse.data);
      }
    } catch (err: any) {
      console.error('Error fetching cable data:', err);
      setError(err.message || 'Failed to fetch cable data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCableData();
  }, []);

  return {
    providers,
    packages,
    transactions,
    loading,
    error,
    refetch: fetchCableData,
  };
};

export default useCable;

