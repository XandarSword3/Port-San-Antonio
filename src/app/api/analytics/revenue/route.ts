import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/analytics/revenue
 * Get revenue analytics data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      );
    }

    // Get order metrics
    const { data: orders } = await supabase
      .from('orders')
      .select('total, created_at, customer_id')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const orderCount = orders?.length || 0;
    const uniqueCustomers = new Set(orders?.map(o => o.customer_id)).size;
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Get subscription revenue
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('amount, status')
      .eq('status', 'active');

    const subscriptionRevenue = subscriptions?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;
    const membershipCount = subscriptions?.length || 0;

    // Get loyalty points redeemed
    const { data: loyaltyTransactions } = await supabase
      .from('loyalty_transactions')
      .select('points')
      .eq('type', 'redeem')
      .gte('created_at', startDate.toISOString());

    const loyaltyPointsRedeemed = Math.abs(
      loyaltyTransactions?.reduce((sum, t) => sum + (t.points || 0), 0) || 0
    );

    // Calculate growth (compare with previous period)
    const previousStartDate = new Date(startDate);
    const periodDiff = endDate.getTime() - startDate.getTime();
    previousStartDate.setTime(startDate.getTime() - periodDiff);

    const { data: previousOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    const previousRevenue = previousOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Get top dishes from demand metrics
    const { data: demandMetrics } = await supabase
      .from('demand_metrics')
      .select('dish_id, revenue, order_count')
      .gte('date', startDate.toISOString().split('T')[0]);

    // Aggregate by dish
    const dishRevenue = new Map<string, { revenue: number; orders: number }>();
    demandMetrics?.forEach((metric) => {
      const existing = dishRevenue.get(metric.dish_id) || { revenue: 0, orders: 0 };
      dishRevenue.set(metric.dish_id, {
        revenue: existing.revenue + (metric.revenue || 0),
        orders: existing.orders + (metric.order_count || 0),
      });
    });

    // Get dish details
    const dishIds = Array.from(dishRevenue.keys());
    const { data: dishes } = await supabase
      .from('dishes')
      .select('id, name, category_id')
      .in('id', dishIds);

    const topDishes = Array.from(dishRevenue.entries())
      .map(([dish_id, stats]) => {
        const dish = dishes?.find(d => d.id === dish_id);
        return {
          id: dish_id,
          name: dish?.name || 'Unknown',
          revenue: stats.revenue,
          orders: stats.orders,
          growth: 0, // TODO: Calculate growth from previous period
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get top categories
    const categoryRevenue = new Map<string, { revenue: number; orders: number }>();
    dishes?.forEach(dish => {
      const stats = dishRevenue.get(dish.id);
      if (stats) {
        const existing = categoryRevenue.get(dish.category_id) || { revenue: 0, orders: 0 };
        categoryRevenue.set(dish.category_id, {
          revenue: existing.revenue + stats.revenue,
          orders: existing.orders + stats.orders,
        });
      }
    });

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');

    const topCategories = Array.from(categoryRevenue.entries())
      .map(([category_id, stats]) => {
        const category = categories?.find(c => c.id === category_id);
        return {
          id: category_id,
          name: category?.name || 'Unknown',
          revenue: stats.revenue,
          orders: stats.orders,
          growth: 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get customer segments
    const { data: loyaltyPoints } = await supabase
      .from('loyalty_points')
      .select('user_id, tier');

    const segmentStats = new Map<string, { count: number; revenue: number }>();
    loyaltyPoints?.forEach(lp => {
      const existing = segmentStats.get(lp.tier) || { count: 0, revenue: 0 };
      segmentStats.set(lp.tier, {
        count: existing.count + 1,
        revenue: existing.revenue,
      });
    });

    // Add revenue per segment (from orders)
    orders?.forEach(order => {
      const userTier = loyaltyPoints?.find(lp => lp.user_id === order.customer_id)?.tier || 'free';
      const existing = segmentStats.get(userTier) || { count: 0, revenue: 0 };
      segmentStats.set(userTier, {
        count: existing.count,
        revenue: existing.revenue + (order.total || 0),
      });
    });

    const customerSegments = Array.from(segmentStats.entries()).map(([tier, stats]) => ({
      tier,
      count: stats.count,
      revenue: stats.revenue,
      averageSpend: stats.count > 0 ? stats.revenue / stats.count : 0,
    }));

    // Time series data (simplified)
    const timeSeries: Array<{ date: string; revenue: number; orders: number; customers: number }> = [];
    
    return NextResponse.json({
      metrics: {
        totalRevenue,
        revenueGrowth,
        averageOrderValue,
        orderCount,
        customerCount: uniqueCustomers,
        subscriptionRevenue,
        membershipCount,
        loyaltyPointsRedeemed,
      },
      topDishes,
      topCategories,
      customerSegments,
      timeSeries,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
