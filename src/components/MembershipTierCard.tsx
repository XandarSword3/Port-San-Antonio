'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MEMBERSHIP_PLANS } from '@/lib/membershipConfig';
import { MembershipTier } from '@/types/membership';
import { Check, Crown, Star, Award, User, Sparkles } from 'lucide-react';
import {
  getAdaptiveDuration,
  getAdaptiveStagger,
  isFeatureEnabled,
  type DeviceTier,
  getPerformanceManager,
} from '@/lib/hardwareDetection';

interface MembershipTierCardProps {
  onSelectPlan?: (tier: MembershipTier, billing: 'monthly' | 'annual') => void;
  currentTier?: MembershipTier;
  className?: string;
}

export default function MembershipTierCard({
  onSelectPlan,
  currentTier = 'free',
  className = '',
}: MembershipTierCardProps) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('medium');

  useEffect(() => {
    const perfManager = getPerformanceManager();
    setDeviceTier(perfManager.getCurrentTier());

    const handleTierChange = (e: CustomEvent) => {
      setDeviceTier(e.detail.tier);
    };

    window.addEventListener('performance-tier-changed', handleTierChange as EventListener);
    return () => {
      window.removeEventListener('performance-tier-changed', handleTierChange as EventListener);
    };
  }, []);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      User,
      Star,
      Award,
      Crown,
    };
    return icons[iconName] || User;
  };

  const tiers: MembershipTier[] = ['free', 'gold', 'platinum', 'diamond'];

  return (
    <div className={`${className}`}>
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div
          className={`relative inline-flex items-center rounded-full p-1 ${
            isDark ? 'bg-luxury-dark-card border border-luxury-dark-border' : 'bg-luxury-light-card border border-luxury-light-border'
          }`}
        >
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? isDark
                  ? 'text-black'
                  : 'text-white'
                : isDark
                ? 'text-luxury-dark-muted'
                : 'text-luxury-light-text/70'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              billingPeriod === 'annual'
                ? isDark
                  ? 'text-black'
                  : 'text-white'
                : isDark
                ? 'text-luxury-dark-muted'
                : 'text-luxury-light-text/70'
            }`}
          >
            Annual
            <span
              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                isDark ? 'bg-luxury-dark-accent/20 text-luxury-dark-accent' : 'bg-luxury-light-accent/20 text-luxury-light-accent'
              }`}
            >
              Save up to $160
            </span>
          </button>
          <motion.div
            className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full ${
              isDark ? 'bg-luxury-dark-accent' : 'bg-luxury-light-accent'
            }`}
            initial={false}
            animate={{
              x: billingPeriod === 'monthly' ? 4 : 'calc(100% + 4px)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Membership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier, index) => {
          const plan = MEMBERSHIP_PLANS[tier];
          const Icon = getIconComponent(plan.icon);
          const isCurrentTier = tier === currentTier;
          const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice / 12;

          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: getAdaptiveDuration(0.5, deviceTier),
                delay: getAdaptiveStagger(index * 0.1, deviceTier),
              }}
              whileHover={
                isFeatureEnabled('enableTransforms3D', deviceTier)
                  ? {
                      scale: 1.05,
                      y: -10,
                      transition: { duration: 0.3 },
                    }
                  : { scale: 1.02 }
              }
              className={`relative overflow-hidden rounded-3xl p-6 transition-all ${
                isFeatureEnabled('enableBackdropFilter', deviceTier) ? 'backdrop-blur-sm' : ''
              } ${
                tier === 'platinum'
                  ? isDark
                    ? 'bg-gradient-to-br from-luxury-dark-card to-luxury-dark-secondary border-2 border-luxury-dark-accent shadow-2xl'
                    : 'bg-gradient-to-br from-luxury-light-card to-white border-2 border-luxury-light-accent shadow-2xl'
                  : isDark
                  ? 'bg-luxury-dark-card border border-luxury-dark-border hover:border-luxury-dark-accent'
                  : 'bg-luxury-light-card border border-luxury-light-border hover:border-luxury-light-accent shadow-lg'
              }`}
              style={{
                perspective: isFeatureEnabled('enableTransforms3D', deviceTier) ? '1000px' : 'none',
              }}
            >
              {/* Popular Badge */}
              {tier === 'platinum' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                    isDark ? 'bg-luxury-dark-accent text-black' : 'bg-luxury-light-accent text-white'
                  }`}
                >
                  <Sparkles className="inline h-3 w-3 mr-1" />
                  MOST POPULAR
                </motion.div>
              )}

              {/* Current Tier Badge */}
              {isCurrentTier && (
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                  }`}
                >
                  Current Plan
                </div>
              )}

              {/* Icon and Tier Name */}
              <div className="mb-6">
                <div
                  className={`inline-flex p-3 rounded-2xl mb-4 ${
                    isDark ? 'bg-luxury-dark-bg' : 'bg-luxury-light-warm'
                  }`}
                  style={{ color: plan.color }}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                {tier === 'free' ? (
                  <div className="text-4xl font-bold" style={{ color: plan.color }}>
                    Free
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold" style={{ color: plan.color }}>
                        ${price.toFixed(2)}
                      </span>
                      <span
                        className={`text-sm ${
                          isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
                        }`}
                      >
                        /month
                      </span>
                    </div>
                    {billingPeriod === 'annual' && plan.annualSavings > 0 && (
                      <p className={`text-xs mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        Save ${plan.annualSavings}/year
                      </p>
                    )}
                    {billingPeriod === 'annual' && (
                      <p
                        className={`text-xs mt-1 ${
                          isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
                        }`}
                      >
                        Billed ${plan.annualPrice} annually
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-6">
                {plan.features.slice(0, tier === 'free' ? 5 : 8).map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: getAdaptiveDuration(0.3, deviceTier),
                      delay: getAdaptiveStagger(0.3 + i * 0.05, deviceTier),
                    }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check
                      className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'
                      }`}
                    />
                    <span
                      className={isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                onClick={() => onSelectPlan?.(tier, billingPeriod)}
                disabled={isCurrentTier}
                whileHover={!isCurrentTier ? { scale: 1.05 } : {}}
                whileTap={!isCurrentTier ? { scale: 0.95 } : {}}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  isCurrentTier
                    ? isDark
                      ? 'bg-luxury-dark-bg text-luxury-dark-muted cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : tier === 'platinum'
                    ? isDark
                      ? 'bg-luxury-dark-accent text-black hover:bg-yellow-400'
                      : 'bg-luxury-light-accent text-white hover:bg-amber-600'
                    : isDark
                    ? 'bg-luxury-dark-bg border border-luxury-dark-border text-luxury-dark-text hover:border-luxury-dark-accent'
                    : 'bg-white border border-luxury-light-border text-luxury-light-text hover:border-luxury-light-accent'
                }`}
              >
                {isCurrentTier ? 'Current Plan' : tier === 'free' ? 'Get Started' : 'Upgrade Now'}
              </motion.button>

              {/* Hover Glow Effect */}
              {isFeatureEnabled('enableGradients', deviceTier) && !isCurrentTier && (
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                    isDark
                      ? 'bg-gradient-to-br from-luxury-dark-accent/5 to-transparent'
                      : 'bg-gradient-to-br from-luxury-light-accent/10 to-transparent'
                  }`}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: getAdaptiveDuration(0.6, deviceTier),
          delay: getAdaptiveStagger(0.8, deviceTier),
        }}
        className={`mt-8 text-center text-sm ${
          isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
        }`}
      >
        All plans include access to our full menu and online ordering system.
        <br />
        Cancel or change your plan anytime. No hidden fees.
      </motion.div>
    </div>
  );
}
