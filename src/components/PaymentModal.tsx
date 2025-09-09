'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getStoredStripeConfig, createPaymentIntent, formatCurrency } from '@/lib/stripe';
import { useLanguage } from '@/contexts/LanguageContext';

interface CheckoutFormProps {
  amount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  onSuccess: (paymentIntentId: string) => void;
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, items, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const text = {
    en: {
      title: 'Complete Your Payment',
      orderSummary: 'Order Summary',
      cardDetails: 'Card Details',
      processing: 'Processing...',
      payNow: 'Pay Now',
      successTitle: 'Payment Successful!',
      successMessage: 'Your order has been processed successfully.',
      close: 'Close',
      securePayment: 'Secure payment powered by Stripe',
      total: 'Total',
      paymentFailed: 'Payment failed',
    },
    ar: {
      title: 'إكمال الدفع',
      orderSummary: 'ملخص الطلب',
      cardDetails: 'تفاصيل البطاقة',
      processing: 'جاري المعالجة...',
      payNow: 'ادفع الآن',
      successTitle: 'تم الدفع بنجاح!',
      successMessage: 'تم معالجة طلبك بنجاح.',
      close: 'إغلاق',
      securePayment: 'دفع آمن بواسطة Stripe',
      total: 'المجموع',
      paymentFailed: 'فشل في الدفع',
    }
  };

  const localText = text[language as keyof typeof text] || text.en;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent(amount);

      // Get card element
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setError(error.message || localText.paymentFailed);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(paymentIntent.id);
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : localText.paymentFailed);
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-600 mb-2">{localText.successTitle}</h3>
        <p className="text-gray-600 dark:text-gray-300">{localText.successMessage}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          {localText.orderSummary}
        </h3>
        
        <div className="space-y-2 mb-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
          <div className="flex justify-between font-bold">
            <span>{localText.total}</span>
            <span>{formatCurrency(amount)}</span>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {localText.cardDetails}
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
        </motion.div>
      )}

      {/* Payment Button */}
      <motion.button
        type="submit"
        disabled={!stripe || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            {localText.processing}
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            {localText.payNow} {formatCurrency(amount)}
          </>
        )}
      </motion.button>

      {/* Security Notice */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center">
        <Lock className="w-3 h-3 mr-1" />
        {localText.securePayment}
      </p>
    </form>
  );
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  onSuccess: (paymentIntentId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  items,
  onSuccess
}) => {
  const { language } = useLanguage();
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    const config = getStoredStripeConfig();
    if (config?.enabled && config.publishableKey) {
      setStripePromise(loadStripe(config.publishableKey));
    }
  }, []);

  const text = {
    en: {
      title: 'Payment',
      paymentUnavailable: 'Payment processing is currently unavailable.',
      contactMessage: 'Please contact us directly to complete your order.',
    },
    ar: {
      title: 'الدفع',
      paymentUnavailable: 'معالجة الدفع غير متاحة حالياً.',
      contactMessage: 'يرجى التواصل معنا مباشرة لإكمال طلبك.',
    }
  };

  const t = text[language as keyof typeof text] || text.en;

  if (!stripePromise) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-mobile"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{t.title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.paymentUnavailable}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.contactMessage}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t.title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={amount}
                  items={items}
                  onSuccess={onSuccess}
                  onClose={onClose}
                />
              </Elements>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
