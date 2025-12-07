/**
 * Revenue Analytics Dashboard
 * Provides comprehensive insights into revenue, customer behavior, and business metrics
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Award,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { detectHardware, getAdaptiveDuration, getAdaptiveStagger } from '@/lib/hardwareDetection';
import { DeviceTier } from '@/lib/hardwareDetection';

interface RevenueMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
  orderCount: number;
  customerCount: number;
  subscriptionRevenue: number;
  membershipCount: number;
  loyaltyPointsRedeemed: number;
}

interface TopPerformer {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  growth: number;
}

interface CustomerSegment {
  tier: string;
  count: number;
  revenue: number;
  averageSpend: number;
}

interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export default function RevenueAnalytics() {
  const { isDark } = useTheme();
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('high');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);

  // Metrics
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 0,
    revenueGrowth: 0,
    averageOrderValue: 0,
    orderCount: 0,
    customerCount: 0,
    subscriptionRevenue: 0,
    membershipCount: 0,
    loyaltyPointsRedeemed: 0,
  });

  const [topDishes, setTopDishes] = useState<TopPerformer[]>([]);
  const [topCategories, setTopCategories] = useState<TopPerformer[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);

  // Hardware detection
  useEffect(() => {
    const hardware = detectHardware();
    setDeviceTier(hardware.tier);
  }, []);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics/revenue?range=${timeRange}`);
        const data = await response.json();

        setMetrics(data.metrics);
        setTopDishes(data.topDishes);
        setTopCategories(data.topCategories);
        setCustomerSegments(data.customerSegments);
        setTimeSeriesData(data.timeSeries);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const duration = getAdaptiveDuration(0.5, deviceTier);
  const stagger = getAdaptiveStagger(0.05, deviceTier);
  const enableHover = deviceTier !== 'low';

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    prefix = '', 
    suffix = '',
    index = 0
  }: { 
    title: string; 
    value: number | string; 
    change?: number; 
    icon: any; 
    prefix?: string; 
    suffix?: string;
    index?: number;
  }) => {
    const isPositive = change && change > 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: index * stagger }}
        whileHover={enableHover ? { scale: 1.02, y: -4 } : undefined}
        className={`
          relative overflow-hidden rounded-xl p-6
          ${isDark ? 'bg-gray-800/50' : 'bg-white'}
          border ${isDark ? 'border-gray-700' : 'border-gray-200'}
          shadow-lg
        `}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {title}
            </p>
            <p className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            {change !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                <TrendIcon 
                  className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} 
                />
                <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(change).toFixed(1)}%
                </span>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  vs last period
                </span>
              </div>
            )}
          </div>
          <div className={`
            p-3 rounded-lg
            ${isDark ? 'bg-gold-500/10' : 'bg-gold-50'}
          `}>
            <Icon className={`w-6 h-6 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          </div>
        </div>
      </motion.div>
    );
  };

  const TopPerformersList = ({ 
    title, 
    items, 
    icon: Icon 
  }: { 
    title: string; 
    items: TopPerformer[]; 
    icon: any;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay: 0.3 }}
      className={`
        rounded-xl p-6
        ${isDark ? 'bg-gray-800/50' : 'bg-white'}
        border ${isDark ? 'border-gray-700' : 'border-gray-200'}
        shadow-lg
      `}
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon className={`w-6 h-6 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration, delay: index * stagger }}
            className={`
              flex items-center justify-between p-4 rounded-lg
              ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}
              ${enableHover ? 'hover:bg-opacity-70 transition-colors' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full
                ${index === 0 ? 'bg-gold-500 text-white' : ''}
                ${index === 1 ? 'bg-gray-400 text-white' : ''}
                ${index === 2 ? 'bg-amber-600 text-white' : ''}
                ${index > 2 ? `${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600'}` : ''}
                font-bold text-sm
              `}>
                {index + 1}
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.name}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.orders} orders
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${item.revenue.toLocaleString()}
              </p>
              {item.growth !== 0 && (
                <p className={`text-sm ${item.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.growth > 0 ? '+' : ''}{item.growth.toFixed(1)}%
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className={`w-12 h-12 animate-spin mx-auto mb-4 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Revenue Analytics
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Comprehensive insights into your business performance
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration, delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${timeRange === range 
                    ? `${isDark ? 'bg-gold-500 text-white' : 'bg-gold-600 text-white'}` 
                    : `${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`
                  }
                `}
              >
                {range === '7d' && 'Last 7 Days'}
                {range === '30d' && 'Last 30 Days'}
                {range === '90d' && 'Last 90 Days'}
                {range === '1y' && 'Last Year'}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            className={`
              px-4 py-2 rounded-lg font-medium flex items-center gap-2
              ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'}
              transition-colors
            `}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Total Revenue" 
            value={metrics.totalRevenue} 
            change={metrics.revenueGrowth}
            icon={DollarSign}
            prefix="$"
            index={0}
          />
          <MetricCard 
            title="Total Orders" 
            value={metrics.orderCount}
            icon={ShoppingCart}
            index={1}
          />
          <MetricCard 
            title="Active Customers" 
            value={metrics.customerCount}
            icon={Users}
            index={2}
          />
          <MetricCard 
            title="Avg Order Value" 
            value={metrics.averageOrderValue}
            icon={TrendingUp}
            prefix="$"
            index={3}
          />
        </div>

        {/* Membership Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard 
            title="Subscription Revenue" 
            value={metrics.subscriptionRevenue}
            icon={Award}
            prefix="$"
            index={4}
          />
          <MetricCard 
            title="Active Memberships" 
            value={metrics.membershipCount}
            icon={Users}
            index={5}
          />
          <MetricCard 
            title="Loyalty Points Redeemed" 
            value={metrics.loyaltyPointsRedeemed}
            icon={Award}
            index={6}
          />
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TopPerformersList 
            title="Top Dishes" 
            items={topDishes}
            icon={BarChart3}
          />
          <TopPerformersList 
            title="Top Categories" 
            items={topCategories}
            icon={PieChart}
          />
        </div>

        {/* Customer Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: 0.4 }}
          className={`
            rounded-xl p-6
            ${isDark ? 'bg-gray-800/50' : 'bg-white'}
            border ${isDark ? 'border-gray-700' : 'border-gray-200'}
            shadow-lg
          `}
        >
          <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Customer Segments by Membership Tier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {customerSegments.map((segment, index) => (
              <div
                key={segment.tier}
                className={`
                  p-4 rounded-lg
                  ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}
                `}
              >
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {segment.tier.toUpperCase()}
                </p>
                <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {segment.count}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ${segment.revenue.toLocaleString()} revenue
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  ${segment.averageSpend.toFixed(2)} avg spend
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
