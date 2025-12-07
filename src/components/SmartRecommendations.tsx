'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dish } from '@/types';
import { Sparkles, TrendingUp, Users, Heart } from 'lucide-react';
import { 
  getAdaptiveDuration, 
  getAdaptiveStagger, 
  isFeatureEnabled,
  type DeviceTier,
  getPerformanceManager 
} from '@/lib/hardwareDetection';

interface SmartRecommendationsProps {
  dishes: Dish[];
  currentDish?: Dish;
  viewedDishes?: string[];
  cartItems?: string[];
  onDishClick?: (dish: Dish) => void;
  className?: string;
}

type RecommendationType = 'trending' | 'popular' | 'pairing' | 'similar';

interface Recommendation {
  dish: Dish;
  type: RecommendationType;
  score: number;
  reason: string;
}

export default function SmartRecommendations({
  dishes,
  currentDish,
  viewedDishes = [],
  cartItems = [],
  onDishClick,
  className = '',
}: SmartRecommendationsProps) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
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

  useEffect(() => {
    generateRecommendations();
  }, [dishes, currentDish, viewedDishes, cartItems]);

  const generateRecommendations = () => {
    const recs: Recommendation[] = [];

    // Algorithm 1: If viewing a dish, find similar dishes (same category, similar price)
    if (currentDish) {
      const similarDishes = dishes
        .filter(d => d.id !== currentDish.id)
        .filter(d => d.categoryId === currentDish.categoryId)
        .filter(d => Math.abs((d.price || 0) - (currentDish.price || 0)) < 5)
        .slice(0, 3);

      similarDishes.forEach(dish => {
        recs.push({
          dish,
          type: 'similar',
          score: 0.9,
          reason: 'Similar to what you\'re viewing',
        });
      });
    }

    // Algorithm 2: Frequently paired together (dishes from different categories)
    if (cartItems.length > 0) {
      const cartDishes = dishes.filter(d => cartItems.includes(d.id));
      const cartCategories = new Set(cartDishes.map(d => d.categoryId));
      
      const pairingDishes = dishes
        .filter(d => !cartItems.includes(d.id))
        .filter(d => !cartCategories.has(d.categoryId))
        .slice(0, 3);

      pairingDishes.forEach(dish => {
        recs.push({
          dish,
          type: 'pairing',
          score: 0.85,
          reason: 'Complete your meal',
        });
      });
    }

    // Algorithm 3: Popular items (mock popularity score based on rating)
    const popularDishes = dishes
      .filter(d => !viewedDishes.includes(d.id))
      .filter(d => !cartItems.includes(d.id))
      .filter(d => currentDish ? d.id !== currentDish.id : true)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);

    popularDishes.forEach(dish => {
      recs.push({
        dish,
        type: 'popular',
        score: 0.8,
        reason: 'Popular choice',
      });
    });

    // Algorithm 4: Trending (recently added or high view count - mock)
    const trendingDishes = dishes
      .filter(d => !viewedDishes.includes(d.id))
      .filter(d => !cartItems.includes(d.id))
      .filter(d => currentDish ? d.id !== currentDish.id : true)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    trendingDishes.forEach(dish => {
      recs.push({
        dish,
        type: 'trending',
        score: 0.75,
        reason: 'Trending now',
      });
    });

    // Remove duplicates and sort by score
    const uniqueRecs = Array.from(
      new Map(recs.map(r => [r.dish.id, r])).values()
    ).sort((a, b) => b.score - a.score);

    // Limit to top 6 recommendations
    setRecommendations(uniqueRecs.slice(0, 6));
  };

  const getIcon = (type: RecommendationType) => {
    switch (type) {
      case 'trending':
        return TrendingUp;
      case 'popular':
        return Users;
      case 'pairing':
        return Heart;
      case 'similar':
        return Sparkles;
      default:
        return Sparkles;
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: getAdaptiveDuration(0.6, deviceTier),
        delay: getAdaptiveStagger(0.3, deviceTier)
      }}
      className={`${className}`}
    >
      <div className={`rounded-2xl p-6 ${
        isDark 
          ? 'bg-luxury-dark-card border border-luxury-dark-border' 
          : 'bg-luxury-light-card border border-luxury-light-border shadow-lg'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className={`h-5 w-5 ${
            isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'
          }`} />
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'
          }`}>
            {t('recommendedForYou') || 'Recommended For You'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => {
            const Icon = getIcon(rec.type);
            return (
              <motion.button
                key={rec.dish.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: getAdaptiveDuration(0.4, deviceTier),
                  delay: getAdaptiveStagger(index * 0.1, deviceTier)
                }}
                whileHover={isFeatureEnabled('enableTransforms3D', deviceTier) ? {
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                } : { scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDishClick?.(rec.dish)}
                className={`relative overflow-hidden rounded-xl p-4 text-left transition-all ${
                  isDark
                    ? 'bg-luxury-dark-bg hover:bg-luxury-dark-card border border-luxury-dark-border hover:border-luxury-dark-accent'
                    : 'bg-white hover:bg-luxury-light-warm border border-luxury-light-border hover:border-luxury-light-accent'
                }`}
              >
                {/* Badge */}
                <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  isDark
                    ? 'bg-luxury-dark-accent/20 text-luxury-dark-accent'
                    : 'bg-luxury-light-accent/20 text-luxury-light-accent'
                }`}>
                  <Icon className="h-3 w-3" />
                  {rec.type === 'trending' && (t('trending') || 'Trending')}
                  {rec.type === 'popular' && (t('popular') || 'Popular')}
                  {rec.type === 'pairing' && (t('pairing') || 'Pairs Well')}
                  {rec.type === 'similar' && (t('similar') || 'Similar')}
                </div>

                {/* Dish Image */}
                {rec.dish.image && (
                  <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                    <img
                      src={rec.dish.image}
                      alt={rec.dish.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isDark 
                        ? 'from-black/60 to-transparent' 
                        : 'from-black/40 to-transparent'
                    }`} />
                  </div>
                )}

                {/* Dish Info */}
                <div className="space-y-1">
                  <h4 className={`font-semibold line-clamp-1 ${
                    isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'
                  }`}>
                    {rec.dish.name}
                  </h4>
                  <p className={`text-xs line-clamp-2 ${
                    isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
                  }`}>
                    {rec.dish.shortDesc}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className={`font-bold ${
                      isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'
                    }`}>
                      ${rec.dish.price?.toFixed(2)}
                    </span>
                    {rec.dish.rating && rec.dish.rating > 0 && (
                      <span className={`text-xs flex items-center gap-1 ${
                        isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
                      }`}>
                        ⭐ {rec.dish.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                {isFeatureEnabled('enableGradients', deviceTier) && (
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                    isDark
                      ? 'bg-gradient-to-br from-luxury-dark-accent/5 to-transparent'
                      : 'bg-gradient-to-br from-luxury-light-accent/10 to-transparent'
                  }`} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
