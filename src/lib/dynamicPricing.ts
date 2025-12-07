/**
 * Dynamic Pricing Engine
 * Adjusts dish prices based on various factors:
 * - Peak hours (lunch/dinner rush)
 * - Real-time demand
 * - Inventory levels
 * - Weather conditions
 * - Special events
 * - Day of week
 */

import { supabase } from '@/lib/supabase';

export interface PricingRule {
  id: string;
  name: string;
  rule_type: 'peak_hour' | 'demand_threshold' | 'inventory_low' | 'weather' | 'day_of_week' | 'event';
  condition: Record<string, any>;
  multiplier: number;
  priority: number;
  active: boolean;
  category_ids?: string[];
  dish_ids?: string[];
}

export interface DynamicPrice {
  id: string;
  dish_id: string;
  base_price: number;
  current_price: number;
  pricing_rule: string;
  multiplier: number;
  active: boolean;
  start_time?: string;
  end_time?: string;
}

export interface DemandMetric {
  dish_id: string;
  date: string;
  hour: number;
  view_count: number;
  add_to_cart_count: number;
  order_count: number;
  revenue: number;
}

/**
 * Peak hours configuration
 * Higher demand = higher prices
 */
const PEAK_HOURS = [
  { start: 11, end: 14, multiplier: 1.15, name: 'Lunch Rush' }, // 11 AM - 2 PM: +15%
  { start: 18, end: 21, multiplier: 1.25, name: 'Dinner Rush' }, // 6 PM - 9 PM: +25%
  { start: 22, end: 23, multiplier: 0.9, name: 'Late Night' }, // 10 PM - 11 PM: -10%
];

/**
 * Day of week pricing
 * Weekends have higher demand
 */
const DAY_MULTIPLIERS: Record<number, { multiplier: number; name: string }> = {
  0: { multiplier: 1.2, name: 'Sunday Premium' }, // Sunday: +20%
  5: { multiplier: 1.15, name: 'Friday Night' }, // Friday: +15%
  6: { multiplier: 1.2, name: 'Saturday Premium' }, // Saturday: +20%
};

/**
 * Demand thresholds
 * Adjust prices based on order velocity
 */
const DEMAND_THRESHOLDS = [
  { min_orders: 20, multiplier: 1.3, name: 'Very High Demand' }, // 20+ orders/hour: +30%
  { min_orders: 15, multiplier: 1.2, name: 'High Demand' }, // 15+ orders/hour: +20%
  { min_orders: 10, multiplier: 1.1, name: 'Moderate Demand' }, // 10+ orders/hour: +10%
];

/**
 * Weather-based pricing
 * Bad weather increases delivery demand
 */
export const WEATHER_MULTIPLIERS: Record<string, number> = {
  rain: 1.15, // +15% for rainy weather
  snow: 1.25, // +25% for snow
  storm: 1.3, // +30% for storms
  cold: 1.1, // +10% for cold weather
  hot: 1.05, // +5% for hot weather
};

/**
 * Get current hour
 */
function getCurrentHour(): number {
  return new Date().getHours();
}

/**
 * Get current day of week (0 = Sunday, 6 = Saturday)
 */
function getCurrentDay(): number {
  return new Date().getDay();
}

/**
 * Calculate peak hour multiplier
 */
export function calculatePeakHourMultiplier(): { multiplier: number; reason: string } {
  const currentHour = getCurrentHour();
  
  for (const peak of PEAK_HOURS) {
    if (currentHour >= peak.start && currentHour < peak.end) {
      return { multiplier: peak.multiplier, reason: peak.name };
    }
  }
  
  return { multiplier: 1.0, reason: 'Regular Hours' };
}

/**
 * Calculate day of week multiplier
 */
export function calculateDayMultiplier(): { multiplier: number; reason: string } {
  const currentDay = getCurrentDay();
  const dayConfig = DAY_MULTIPLIERS[currentDay];
  
  if (dayConfig) {
    return { multiplier: dayConfig.multiplier, reason: dayConfig.name };
  }
  
  return { multiplier: 1.0, reason: 'Regular Day' };
}

/**
 * Calculate demand-based multiplier from recent orders
 */
export async function calculateDemandMultiplier(dishId: string): Promise<{ multiplier: number; reason: string }> {
  if (!supabase) return { multiplier: 1.0, reason: 'Supabase unavailable' };
  
  const currentDate = new Date().toISOString().split('T')[0];
  const currentHour = getCurrentHour();

  try {
    const { data, error } = await supabase
      .from('demand_metrics')
      .select('order_count')
      .eq('dish_id', dishId)
      .eq('date', currentDate)
      .eq('hour', currentHour)
      .single();

    if (error || !data) {
      return { multiplier: 1.0, reason: 'No demand data' };
    }

    const orderCount = data.order_count;

    for (const threshold of DEMAND_THRESHOLDS) {
      if (orderCount >= threshold.min_orders) {
        return { multiplier: threshold.multiplier, reason: threshold.name };
      }
    }

    return { multiplier: 1.0, reason: 'Normal Demand' };
  } catch (error) {
    console.error('Error calculating demand multiplier:', error);
    return { multiplier: 1.0, reason: 'Error' };
  }
}

/**
 * Track dish views for demand metrics
 */
export async function trackDishView(dishId: string): Promise<void> {
  if (!supabase) return;
  
  const currentDate = new Date().toISOString().split('T')[0];
  const currentHour = getCurrentHour();

  try {
    // Upsert view count
    await supabase.rpc('increment_demand_metric', {
      p_dish_id: dishId,
      p_date: currentDate,
      p_hour: currentHour,
      p_metric: 'view_count',
    });
  } catch (error) {
    console.error('Error tracking dish view:', error);
  }
}

/**
 * Track add to cart events
 */
export async function trackAddToCart(dishId: string): Promise<void> {
  if (!supabase) return;
  
  const currentDate = new Date().toISOString().split('T')[0];
  const currentHour = getCurrentHour();

  try {
    await supabase.rpc('increment_demand_metric', {
      p_dish_id: dishId,
      p_date: currentDate,
      p_hour: currentHour,
      p_metric: 'add_to_cart_count',
    });
  } catch (error) {
    console.error('Error tracking add to cart:', error);
  }
}

/**
 * Track completed order
 */
export async function trackOrder(dishId: string, amount: number): Promise<void> {
  if (!supabase) return;
  
  const currentDate = new Date().toISOString().split('T')[0];
  const currentHour = getCurrentHour();

  try {
    await supabase.rpc('increment_demand_metric', {
      p_dish_id: dishId,
      p_date: currentDate,
      p_hour: currentHour,
      p_metric: 'order_count',
    });

    await supabase.rpc('increment_demand_metric', {
      p_dish_id: dishId,
      p_date: currentDate,
      p_hour: currentHour,
      p_metric: 'revenue',
      p_amount: amount,
    });
  } catch (error) {
    console.error('Error tracking order:', error);
  }
}

/**
 * Calculate final price with all multipliers applied
 */
export async function calculateDynamicPrice(
  dishId: string,
  basePrice: number,
  options: {
    considerDemand?: boolean;
    considerWeather?: boolean;
    weatherCondition?: keyof typeof WEATHER_MULTIPLIERS;
  } = {}
): Promise<{
  price: number;
  basePrice: number;
  multipliers: Array<{ factor: string; multiplier: number; reason: string }>;
  totalMultiplier: number;
}> {
  const multipliers: Array<{ factor: string; multiplier: number; reason: string }> = [];

  // 1. Peak hour pricing
  const peakHour = calculatePeakHourMultiplier();
  if (peakHour.multiplier !== 1.0) {
    multipliers.push({
      factor: 'Peak Hour',
      multiplier: peakHour.multiplier,
      reason: peakHour.reason,
    });
  }

  // 2. Day of week pricing
  const dayMultiplier = calculateDayMultiplier();
  if (dayMultiplier.multiplier !== 1.0) {
    multipliers.push({
      factor: 'Day Premium',
      multiplier: dayMultiplier.multiplier,
      reason: dayMultiplier.reason,
    });
  }

  // 3. Demand-based pricing (optional)
  if (options.considerDemand !== false) {
    const demandMultiplier = await calculateDemandMultiplier(dishId);
    if (demandMultiplier.multiplier !== 1.0) {
      multipliers.push({
        factor: 'Demand',
        multiplier: demandMultiplier.multiplier,
        reason: demandMultiplier.reason,
      });
    }
  }

  // 4. Weather-based pricing (optional)
  if (options.considerWeather && options.weatherCondition) {
    const weatherMultiplier = WEATHER_MULTIPLIERS[options.weatherCondition] || 1.0;
    if (weatherMultiplier !== 1.0) {
      multipliers.push({
        factor: 'Weather',
        multiplier: weatherMultiplier,
        reason: `${options.weatherCondition} conditions`,
      });
    }
  }

  // Calculate total multiplier (compound)
  const totalMultiplier = multipliers.reduce((acc, m) => acc * m.multiplier, 1.0);
  const finalPrice = parseFloat((basePrice * totalMultiplier).toFixed(2));

  return {
    price: finalPrice,
    basePrice,
    multipliers,
    totalMultiplier,
  };
}

/**
 * Get active pricing rules from database
 */
export async function getActivePricingRules(): Promise<PricingRule[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pricing rules:', error);
    return [];
  }
}

/**
 * Apply pricing rules to a dish
 */
export async function applyPricingRules(
  dishId: string,
  categoryId: string,
  basePrice: number
): Promise<number> {
  const rules = await getActivePricingRules();
  let finalMultiplier = 1.0;

  for (const rule of rules) {
    // Check if rule applies to this dish/category
    const appliesToDish = !rule.dish_ids || rule.dish_ids.length === 0 || rule.dish_ids.includes(dishId);
    const appliesToCategory = !rule.category_ids || rule.category_ids.length === 0 || rule.category_ids.includes(categoryId);

    if (!appliesToDish || !appliesToCategory) continue;

    // Check if rule condition is met
    const conditionMet = evaluateRuleCondition(rule);

    if (conditionMet) {
      finalMultiplier *= rule.multiplier;
    }
  }

  return parseFloat((basePrice * finalMultiplier).toFixed(2));
}

/**
 * Evaluate if a rule condition is currently met
 */
function evaluateRuleCondition(rule: PricingRule): boolean {
  const currentHour = getCurrentHour();
  const currentDay = getCurrentDay();

  switch (rule.rule_type) {
    case 'peak_hour':
      return (
        currentHour >= (rule.condition.hour_start || 0) &&
        currentHour < (rule.condition.hour_end || 24)
      );

    case 'day_of_week':
      return rule.condition.days?.includes(currentDay) || false;

    case 'event':
      // Check if current date matches event date
      const eventDate = rule.condition.date;
      const today = new Date().toISOString().split('T')[0];
      return eventDate === today;

    default:
      return false;
  }
}

/**
 * Update dynamic pricing in database
 */
export async function updateDynamicPricing(
  dishId: string,
  basePrice: number,
  currentPrice: number,
  reason: string,
  multiplier: number
): Promise<void> {
  if (!supabase) return;

  try {
    // Check if pricing record exists
    const { data: existing } = await supabase
      .from('dynamic_pricing')
      .select('id, base_price')
      .eq('dish_id', dishId)
      .single();

    if (existing) {
      // Update existing record
      await supabase
        .from('dynamic_pricing')
        .update({
          current_price: currentPrice,
          pricing_rule: reason,
          multiplier,
          updated_at: new Date().toISOString(),
        })
        .eq('dish_id', dishId);

      // Log price change history
      if (existing.base_price !== currentPrice) {
        await supabase.from('pricing_history').insert({
          dish_id: dishId,
          old_price: existing.base_price,
          new_price: currentPrice,
          reason,
        });
      }
    } else {
      // Create new record
      await supabase.from('dynamic_pricing').insert({
        dish_id: dishId,
        base_price: basePrice,
        current_price: currentPrice,
        pricing_rule: reason,
        multiplier,
        active: true,
      });
    }
  } catch (error) {
    console.error('Error updating dynamic pricing:', error);
  }
}

/**
 * Get dynamic price for a dish from database
 */
export async function getDynamicPrice(dishId: string): Promise<DynamicPrice | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('dynamic_pricing')
      .select('*')
      .eq('dish_id', dishId)
      .eq('active', true)
      .single();

    if (error) return null;
    return data;
  } catch (error) {
    console.error('Error fetching dynamic price:', error);
    return null;
  }
}

/**
 * Batch update all dish prices based on current conditions
 * Run this periodically (e.g., every 15 minutes)
 */
export async function batchUpdatePrices(): Promise<void> {
  if (!supabase) {
    console.warn('Supabase unavailable, skipping price update');
    return;
  }

  try {
    // Get all dishes
    const { data: dishes, error } = await supabase
      .from('dishes')
      .select('id, price, category_id');

    if (error || !dishes) {
      console.error('Error fetching dishes:', error);
      return;
    }

    console.log(`🔄 Updating prices for ${dishes.length} dishes...`);

    for (const dish of dishes) {
      const dynamicPrice = await calculateDynamicPrice(dish.id, dish.price);
      
      if (dynamicPrice.price !== dish.price) {
        await updateDynamicPricing(
          dish.id,
          dish.price,
          dynamicPrice.price,
          dynamicPrice.multipliers.map(m => m.reason).join(', '),
          dynamicPrice.totalMultiplier
        );
      }
    }

    console.log('✅ Price update complete');
  } catch (error) {
    console.error('Error in batch price update:', error);
  }
}

/**
 * Get pricing analytics for admin dashboard
 */
export async function getPricingAnalytics(days: number = 7): Promise<{
  totalRevenue: number;
  averageMultiplier: number;
  priceChanges: number;
  topPerformingDishes: Array<{ dish_id: string; revenue: number; orders: number }>;
}> {
  if (!supabase) {
    return {
      totalRevenue: 0,
      averageMultiplier: 1.0,
      priceChanges: 0,
      topPerformingDishes: [],
    };
  }
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    // Get revenue metrics
    const { data: metrics } = await supabase
      .from('demand_metrics')
      .select('dish_id, revenue, order_count')
      .gte('date', startDate.toISOString().split('T')[0]);

    const totalRevenue = metrics?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;
    const totalOrders = metrics?.reduce((sum, m) => sum + (m.order_count || 0), 0) || 0;

    // Get price changes
    const { count: priceChanges } = await supabase
      .from('pricing_history')
      .select('*', { count: 'exact', head: true })
      .gte('changed_at', startDate.toISOString());

    // Get top performing dishes
    const dishRevenue = new Map<string, { revenue: number; orders: number }>();
    metrics?.forEach((m) => {
      const existing = dishRevenue.get(m.dish_id) || { revenue: 0, orders: 0 };
      dishRevenue.set(m.dish_id, {
        revenue: existing.revenue + (m.revenue || 0),
        orders: existing.orders + (m.order_count || 0),
      });
    });

    const topPerformingDishes = Array.from(dishRevenue.entries())
      .map(([dish_id, stats]) => ({ dish_id, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get average multiplier
    const { data: pricing } = await supabase
      .from('dynamic_pricing')
      .select('multiplier')
      .eq('active', true);

    const averageMultiplier = pricing?.length
      ? pricing.reduce((sum, p) => sum + p.multiplier, 0) / pricing.length
      : 1.0;

    return {
      totalRevenue,
      averageMultiplier,
      priceChanges: priceChanges || 0,
      topPerformingDishes,
    };
  } catch (error) {
    console.error('Error fetching pricing analytics:', error);
    return {
      totalRevenue: 0,
      averageMultiplier: 1.0,
      priceChanges: 0,
      topPerformingDishes: [],
    };
  }
}
