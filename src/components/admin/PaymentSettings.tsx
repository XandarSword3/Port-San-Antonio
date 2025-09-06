'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Save, TestTube, Globe, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { saveStripeConfig, getStoredStripeConfig } from '@/lib/stripe';
import { useLanguage } from '@/contexts/LanguageContext';

interface StripeConfig {
  publishableKey: string;
  enabled: boolean;
  currency: string;
  testMode: boolean;
}

const PaymentSettings: React.FC = () => {
  const { language } = useLanguage();
  const [config, setConfig] = useState<StripeConfig>({
    publishableKey: '',
    enabled: false,
    currency: 'USD',
    testMode: true,
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const text = {
    en: {
      title: 'Payment Settings',
      subtitle: 'Configure Stripe payment processing',
      publishableKey: 'Stripe Publishable Key',
      publishableKeyHelp: 'Your Stripe publishable key (starts with pk_)',
      testMode: 'Test Mode',
      testModeHelp: 'Use test keys for development and testing',
      enabled: 'Enable Payments',
      enabledHelp: 'Allow customers to pay through Stripe',
      currency: 'Default Currency',
      currencyHelp: 'Currency for all transactions',
      save: 'Save Settings',
      saved: 'Settings saved successfully!',
      setupInstructions: 'Setup Instructions',
      step1: '1. Create a Stripe account at stripe.com',
      step2: '2. Get your API keys from the Stripe dashboard',
      step3: '3. Add your publishable key above',
      step4: '4. Configure your secret key in environment variables',
      envNote: 'Add to your .env.local file:',
      testKeyNote: 'For test mode, use keys starting with pk_test_ and sk_test_',
      liveKeyNote: 'For live mode, use keys starting with pk_live_ and sk_live_',
      securityWarning: '⚠️ Never expose your secret key in client-side code',
    },
    ar: {
      title: 'إعدادات الدفع',
      subtitle: 'تكوين معالجة الدفع عبر Stripe',
      publishableKey: 'مفتاح Stripe القابل للنشر',
      publishableKeyHelp: 'مفتاح Stripe القابل للنشر (يبدأ بـ pk_)',
      testMode: 'وضع الاختبار',
      testModeHelp: 'استخدم مفاتيح الاختبار للتطوير والاختبار',
      enabled: 'تفعيل المدفوعات',
      enabledHelp: 'السماح للعملاء بالدفع عبر Stripe',
      currency: 'العملة الافتراضية',
      currencyHelp: 'العملة لجميع المعاملات',
      save: 'حفظ الإعدادات',
      saved: 'تم حفظ الإعدادات بنجاح!',
      setupInstructions: 'تعليمات الإعداد',
      step1: '1. إنشاء حساب Stripe في stripe.com',
      step2: '2. احصل على مفاتيح API من لوحة تحكم Stripe',
      step3: '3. أضف مفتاحك القابل للنشر أعلاه',
      step4: '4. تكوين مفتاحك السري في متغيرات البيئة',
      envNote: 'أضف إلى ملف .env.local الخاص بك:',
      testKeyNote: 'لوضع الاختبار، استخدم مفاتيح تبدأ بـ pk_test_ و sk_test_',
      liveKeyNote: 'للوضع المباشر، استخدم مفاتيح تبدأ بـ pk_live_ و sk_live_',
      securityWarning: '⚠️ لا تكشف أبداً مفتاحك السري في كود العميل',
    }
  };

  const t = text[language as keyof typeof text] || text.en;

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'LBP', symbol: 'ل.ل', name: 'Lebanese Pound' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  ];

  useEffect(() => {
    const stored = getStoredStripeConfig();
    if (stored) {
      setConfig(stored);
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (config.enabled && !config.publishableKey) {
      newErrors.publishableKey = 'Publishable key is required when payments are enabled';
    }

    if (config.publishableKey && !config.publishableKey.startsWith('pk_')) {
      newErrors.publishableKey = 'Invalid publishable key format';
    }

    if (config.testMode && config.publishableKey && !config.publishableKey.startsWith('pk_test_')) {
      newErrors.publishableKey = 'Use test keys (pk_test_) in test mode';
    }

    if (!config.testMode && config.publishableKey && !config.publishableKey.startsWith('pk_live_')) {
      newErrors.publishableKey = 'Use live keys (pk_live_) in live mode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      saveStripeConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const ToggleButton: React.FC<{ 
    enabled: boolean; 
    onToggle: () => void; 
    label: string;
  }> = ({ enabled, onToggle, label }) => (
    <button
      onClick={onToggle}
      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {enabled ? (
        <ToggleRight className="w-6 h-6 text-green-500" />
      ) : (
        <ToggleLeft className="w-6 h-6 text-gray-400" />
      )}
      <span className={enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <CreditCard className="w-12 h-12 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold">{t.title}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-6">Configuration</h2>

          <div className="space-y-6">
            {/* Enable Payments Toggle */}
            <div>
              <ToggleButton
                enabled={config.enabled}
                onToggle={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                label={t.enabled}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-8">
                {t.enabledHelp}
              </p>
            </div>

            {/* Test Mode Toggle */}
            <div>
              <ToggleButton
                enabled={config.testMode}
                onToggle={() => setConfig(prev => ({ ...prev, testMode: !prev.testMode }))}
                label={t.testMode}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-8">
                {t.testModeHelp}
              </p>
            </div>

            {/* Publishable Key */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.publishableKey}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.publishableKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, publishableKey: e.target.value }))}
                  placeholder="pk_test_..."
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 ${
                    errors.publishableKey 
                      ? 'border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <TestTube className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
              {errors.publishableKey && (
                <p className="text-red-500 text-sm mt-1">{errors.publishableKey}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t.publishableKeyHelp}
              </p>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.currency}
              </label>
              <div className="relative">
                <select
                  value={config.currency}
                  onChange={(e) => setConfig(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 appearance-none"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                <DollarSign className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t.currencyHelp}
              </p>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {t.save}
            </motion.button>

            {/* Success Message */}
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-center"
              >
                {t.saved}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-2" />
            {t.setupInstructions}
          </h2>

          <div className="space-y-4">
            <div className="text-sm space-y-2">
              <p>{t.step1}</p>
              <p>{t.step2}</p>
              <p>{t.step3}</p>
              <p>{t.step4}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">{t.envNote}</p>
              <code className="text-xs bg-gray-800 text-green-400 p-2 rounded block">
                STRIPE_SECRET_KEY={config.testMode ? 'sk_test_...' : 'sk_live_...'}
                <br />
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY={config.testMode ? 'pk_test_...' : 'pk_live_...'}
              </code>
            </div>

            <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
              <p>📝 {t.testKeyNote}</p>
              <p>🔴 {t.liveKeyNote}</p>
              <p className="text-red-600 dark:text-red-400 font-medium">
                {t.securityWarning}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSettings;
