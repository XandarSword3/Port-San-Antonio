import { loadStripe } from '@stripe/stripe-js';

// This will be configured through admin settings
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    // Get publishable key from configuration or environment
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
                          getStoredStripeConfig()?.publishableKey;
    
    if (publishableKey) {
      stripePromise = loadStripe(publishableKey);
    }
  }
  return stripePromise;
};

// Admin configuration storage
interface StripeConfig {
  publishableKey: string;
  enabled: boolean;
  currency: string;
  testMode: boolean;
}

export const saveStripeConfig = (config: StripeConfig) => {
  localStorage.setItem('stripe_config', JSON.stringify(config));
  // Reset stripe promise to reload with new key
  stripePromise = null;
};

export const getStoredStripeConfig = (): StripeConfig | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('stripe_config');
  return stored ? JSON.parse(stored) : null;
};

// Payment intent creation
export const createPaymentIntent = async (amount: number, currency = 'usd') => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
};

// Format currency
export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export default getStripe;
