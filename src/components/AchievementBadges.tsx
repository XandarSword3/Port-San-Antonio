'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ACHIEVEMENTS } from '@/lib/membershipConfig';
import { Achievement } from '@/types/membership';
import {
  ShoppingBag,
  Heart,
  Award,
  DollarSign,
  MessageSquare,
  Users,
  Flame,
  Star,
  Lock,
  Check,
} from 'lucide-react';
import {
  getAdaptiveDuration,
  getAdaptiveStagger,
  isFeatureEnabled,
  type DeviceTier,
  getPerformanceManager,
} from '@/lib/hardwareDetection';

interface AchievementBadgesProps {
  userAchievements?: Achievement[];
  totalOrders?: number;
  totalSpending?: number;
  totalReviews?: number;
  totalReferrals?: number;
  orderStreak?: number;
  categoriesCompleted?: number;
  className?: string;
}

export default function AchievementBadges({
  userAchievements = [],
  totalOrders = 0,
  totalSpending = 0,
  totalReviews = 0,
  totalReferrals = 0,
  orderStreak = 0,
  categoriesCompleted = 0,
  className = '',
}: AchievementBadgesProps) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('medium');

  useEffect(() => {
    const perfManager = getPerformanceManager();
    setDeviceTier(perfManager.getCurrentTier());
  }, []);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      ShoppingBag,
      Heart,
      Award,
      DollarSign,
      MessageSquare,
      Users,
      Flame,
      Star,
    };
    return icons[iconName] || Award;
  };

  const calculateProgress = (achievement: Achievement): number => {
    const { type, target, category } = achievement.requirement;

    switch (type) {
      case 'orders':
        return Math.min((totalOrders / target) * 100, 100);
      case 'spending':
        return Math.min((totalSpending / target) * 100, 100);
      case 'reviews':
        return Math.min((totalReviews / target) * 100, 100);
      case 'referrals':
        return Math.min((totalReferrals / target) * 100, 100);
      case 'streak':
        return Math.min((orderStreak / target) * 100, 100);
      case 'category':
        return Math.min((categoriesCompleted / target) * 100, 100);
      default:
        return 0;
    }
  };

  const isUnlocked = (achievement: Achievement): boolean => {
    return userAchievements.some((ua) => ua.id === achievement.id && ua.unlockedAt);
  };

  const enhancedAchievements = ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    progress: calculateProgress(achievement),
    unlocked: isUnlocked(achievement),
  }));

  const unlockedCount = enhancedAchievements.filter((a) => a.unlocked).length;
  const totalPoints = enhancedAchievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.pointsReward, 0);

  return (
    <div className={`${className}`}>
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: getAdaptiveDuration(0.6, deviceTier) }}
        className={`mb-8 rounded-2xl p-6 ${
          isDark
            ? 'bg-luxury-dark-card border border-luxury-dark-border'
            : 'bg-luxury-light-card border border-luxury-light-border shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'}`}>
            🏆 Achievements
          </h2>
          <div className="text-right">
            <p className={`text-sm ${isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'}`}>
              Progress
            </p>
            <p className={`text-2xl font-bold ${isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'}`}>
              {unlockedCount}/{ACHIEVEMENTS.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`relative h-4 rounded-full overflow-hidden ${isDark ? 'bg-luxury-dark-bg' : 'bg-gray-200'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
            transition={{ duration: getAdaptiveDuration(1, deviceTier), ease: 'easeOut' }}
            className={`absolute inset-y-0 left-0 rounded-full ${
              isDark ? 'bg-luxury-dark-accent' : 'bg-luxury-light-accent'
            }`}
          />
        </div>

        {/* Total Points Earned */}
        <div className="mt-4 text-center">
          <p className={`text-sm ${isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'}`}>
            Total Points Earned from Achievements
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'}`}>
            {totalPoints.toLocaleString()} pts
          </p>
        </div>
      </motion.div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {enhancedAchievements.map((achievement, index) => {
          const Icon = getIconComponent(achievement.icon);
          const isLocked = !achievement.unlocked;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: getAdaptiveDuration(0.4, deviceTier),
                delay: getAdaptiveStagger(index * 0.05, deviceTier),
              }}
              whileHover={
                isFeatureEnabled('enableTransforms3D', deviceTier)
                  ? {
                      scale: 1.05,
                      y: -5,
                      transition: { duration: 0.2 },
                    }
                  : { scale: 1.02 }
              }
              className={`relative overflow-hidden rounded-xl p-5 transition-all ${
                isFeatureEnabled('enableBackdropFilter', deviceTier) ? 'backdrop-blur-sm' : ''
              } ${
                isLocked
                  ? isDark
                    ? 'bg-luxury-dark-bg border border-luxury-dark-border opacity-60'
                    : 'bg-gray-100 border border-gray-300 opacity-70'
                  : isDark
                  ? 'bg-luxury-dark-card border-2 border-luxury-dark-accent'
                  : 'bg-luxury-light-card border-2 border-luxury-light-accent shadow-lg'
              }`}
            >
              {/* Unlocked Badge */}
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className={`absolute top-2 right-2 p-1.5 rounded-full ${
                    isDark ? 'bg-green-500/20' : 'bg-green-100'
                  }`}
                >
                  <Check className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </motion.div>
              )}

              {/* Icon */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`relative p-3 rounded-xl ${
                    isLocked
                      ? isDark
                        ? 'bg-gray-800'
                        : 'bg-gray-300'
                      : isDark
                      ? 'bg-luxury-dark-accent/20'
                      : 'bg-luxury-light-accent/20'
                  }`}
                >
                  {isLocked ? (
                    <Lock
                      className={`h-6 w-6 ${
                        isDark ? 'text-gray-600' : 'text-gray-500'
                      }`}
                    />
                  ) : (
                    <Icon
                      className={`h-6 w-6 ${
                        isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-bold text-sm ${
                      isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'
                    }`}
                  >
                    {achievement.name}
                  </h3>
                  <p
                    className={`text-xs ${
                      isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'
                    }`}
                  >
                    +{achievement.pointsReward} pts
                  </p>
                </div>
              </div>

              {/* Description */}
              <p
                className={`text-xs mb-3 ${
                  isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
                }`}
              >
                {achievement.description}
              </p>

              {/* Progress Bar */}
              {!achievement.unlocked && (
                <>
                  <div
                    className={`relative h-2 rounded-full overflow-hidden mb-2 ${
                      isDark ? 'bg-luxury-dark-bg' : 'bg-gray-200'
                    }`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{
                        duration: getAdaptiveDuration(1, deviceTier),
                        delay: getAdaptiveStagger(index * 0.05 + 0.3, deviceTier),
                      }}
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        isDark ? 'bg-luxury-dark-accent' : 'bg-luxury-light-accent'
                      }`}
                    />
                  </div>
                  <p
                    className={`text-xs text-center ${
                      isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
                    }`}
                  >
                    {achievement.progress.toFixed(0)}% Complete
                  </p>
                </>
              )}

              {/* Unlocked Date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <p
                  className={`text-xs text-center ${
                    isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
                  }`}
                >
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}

              {/* Shimmer Effect for Unlocked */}
              {achievement.unlocked && isFeatureEnabled('enableGradients', deviceTier) && (
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                  style={{ width: '50%' }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
