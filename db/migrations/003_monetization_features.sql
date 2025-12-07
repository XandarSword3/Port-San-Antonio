-- Dynamic Pricing System Tables
-- Run this migration in your Supabase SQL Editor

-- 1. Create dynamic_pricing table
CREATE TABLE IF NOT EXISTS public.dynamic_pricing (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    dish_id TEXT NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
    base_price DECIMAL(10, 2) NOT NULL,
    current_price DECIMAL(10, 2) NOT NULL,
    pricing_rule TEXT NOT NULL, -- 'peak_hour', 'demand', 'inventory', 'weather', 'event'
    multiplier DECIMAL(5, 2) DEFAULT 1.0,
    active BOOLEAN DEFAULT true,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create pricing_history table for analytics
CREATE TABLE IF NOT EXISTS public.pricing_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    dish_id TEXT NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
    old_price DECIMAL(10, 2) NOT NULL,
    new_price DECIMAL(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create pricing_rules table
CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    rule_type TEXT NOT NULL, -- 'peak_hour', 'demand_threshold', 'inventory_low', 'weather', 'day_of_week'
    condition JSONB NOT NULL, -- Flexible conditions: {day: 'friday', hour_start: 18, hour_end: 21}
    multiplier DECIMAL(5, 2) NOT NULL,
    priority INTEGER DEFAULT 0, -- Higher priority rules apply first
    active BOOLEAN DEFAULT true,
    category_ids TEXT[], -- Apply to specific categories
    dish_ids TEXT[], -- Apply to specific dishes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create demand_metrics table
CREATE TABLE IF NOT EXISTS public.demand_metrics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    dish_id TEXT NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hour INTEGER NOT NULL CHECK (hour >= 0 AND hour < 24),
    view_count INTEGER DEFAULT 0,
    add_to_cart_count INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dish_id, date, hour)
);

-- 5. Create subscriptions table for membership
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'gold', 'platinum', 'diamond')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
    billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    renew_date TIMESTAMPTZ,
    auto_renew BOOLEAN DEFAULT true,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create loyalty_points table
CREATE TABLE IF NOT EXISTS public.loyalty_points (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT NOT NULL,
    current_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 7. Create loyalty_transactions table
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'expire', 'bonus')),
    points INTEGER NOT NULL,
    description TEXT NOT NULL,
    order_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    unlocked BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- 9. Create spin_wheel_state table
CREATE TABLE IF NOT EXISTS public.spin_wheel_state (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT NOT NULL UNIQUE,
    spins_available INTEGER DEFAULT 1,
    last_spin_date TIMESTAMPTZ,
    total_spins INTEGER DEFAULT 0,
    prizes_won JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create rewards_redeemed table
CREATE TABLE IF NOT EXISTS public.rewards_redeemed (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT NOT NULL,
    reward_id TEXT NOT NULL,
    points_spent INTEGER NOT NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ,
    order_id TEXT
);

-- 11. Create push_subscriptions table for PWA notifications
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT,
    endpoint TEXT NOT NULL UNIQUE,
    keys JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dynamic_pricing_dish_id ON public.dynamic_pricing(dish_id);
CREATE INDEX IF NOT EXISTS idx_dynamic_pricing_active ON public.dynamic_pricing(active);
CREATE INDEX IF NOT EXISTS idx_pricing_history_dish_id ON public.pricing_history(dish_id);
CREATE INDEX IF NOT EXISTS idx_demand_metrics_dish_date ON public.demand_metrics(dish_id, date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON public.loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_spin_wheel_user_id ON public.spin_wheel_state(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards_redeemed(user_id);

-- Functions

-- Function to update pricing based on demand
CREATE OR REPLACE FUNCTION update_demand_pricing()
RETURNS void AS $$
DECLARE
    dish_record RECORD;
    high_demand_threshold INTEGER := 10; -- 10 orders in last hour
    demand_multiplier DECIMAL := 1.2; -- 20% price increase
BEGIN
    FOR dish_record IN 
        SELECT 
            d.id,
            d.price as base_price,
            COALESCE(SUM(dm.order_count), 0) as recent_orders
        FROM dishes d
        LEFT JOIN demand_metrics dm ON d.id = dm.dish_id 
            AND dm.date = CURRENT_DATE
            AND dm.hour = EXTRACT(HOUR FROM NOW())
        GROUP BY d.id, d.price
    LOOP
        IF dish_record.recent_orders >= high_demand_threshold THEN
            -- Apply demand pricing
            INSERT INTO dynamic_pricing (dish_id, base_price, current_price, pricing_rule, multiplier)
            VALUES (
                dish_record.id,
                dish_record.base_price,
                dish_record.base_price * demand_multiplier,
                'demand',
                demand_multiplier
            )
            ON CONFLICT (dish_id) DO UPDATE
            SET 
                current_price = dish_record.base_price * demand_multiplier,
                multiplier = demand_multiplier,
                updated_at = NOW();
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to award loyalty points
CREATE OR REPLACE FUNCTION award_loyalty_points(
    p_user_id TEXT,
    p_points INTEGER,
    p_description TEXT,
    p_order_id TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Update loyalty points
    INSERT INTO loyalty_points (user_id, current_points, lifetime_points)
    VALUES (p_user_id, p_points, p_points)
    ON CONFLICT (user_id) DO UPDATE
    SET 
        current_points = loyalty_points.current_points + p_points,
        lifetime_points = loyalty_points.lifetime_points + p_points,
        updated_at = NOW();
    
    -- Record transaction
    INSERT INTO loyalty_transactions (user_id, type, points, description, order_id)
    VALUES (p_user_id, 'earn', p_points, p_description, p_order_id);
END;
$$ LANGUAGE plpgsql;

-- Function to redeem loyalty points
CREATE OR REPLACE FUNCTION redeem_loyalty_points(
    p_user_id TEXT,
    p_points INTEGER,
    p_description TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance INTEGER;
BEGIN
    -- Get current balance
    SELECT current_points INTO current_balance
    FROM loyalty_points
    WHERE user_id = p_user_id;
    
    IF current_balance IS NULL OR current_balance < p_points THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct points
    UPDATE loyalty_points
    SET 
        current_points = current_points - p_points,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record transaction
    INSERT INTO loyalty_transactions (user_id, type, points, description)
    VALUES (p_user_id, 'redeem', -p_points, p_description);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Triggers

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS update_dynamic_pricing_updated_at ON public.dynamic_pricing;
CREATE TRIGGER update_dynamic_pricing_updated_at BEFORE UPDATE ON public.dynamic_pricing
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_loyalty_points_updated_at ON public.loyalty_points;
CREATE TRIGGER update_loyalty_points_updated_at BEFORE UPDATE ON public.loyalty_points
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
-- Enable RLS on all tables
ALTER TABLE public.dynamic_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spin_wheel_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_redeemed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read access for pricing (everyone can see prices)
CREATE POLICY "Public can view dynamic pricing" ON public.dynamic_pricing
FOR SELECT USING (true);

CREATE POLICY "Public can view pricing rules" ON public.pricing_rules
FOR SELECT USING (active = true);

-- Users can view and manage their own data
CREATE POLICY "Users can view own subscription" ON public.subscriptions
FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can view own loyalty points" ON public.loyalty_points
FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can view own loyalty transactions" ON public.loyalty_transactions
FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can view own achievements" ON public.achievements
FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can manage own spin wheel" ON public.spin_wheel_state
FOR ALL USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can view own rewards" ON public.rewards_redeemed
FOR SELECT USING (auth.uid()::TEXT = user_id);

-- Admin policies (assuming you have an 'admin' role)
-- Admins can do everything
CREATE POLICY "Admins can manage all pricing" ON public.dynamic_pricing
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage pricing rules" ON public.pricing_rules
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view demand metrics" ON public.demand_metrics
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Grant necessary permissions
GRANT ALL ON public.dynamic_pricing TO authenticated;
GRANT ALL ON public.pricing_history TO authenticated;
GRANT ALL ON public.pricing_rules TO authenticated;
GRANT ALL ON public.demand_metrics TO authenticated;
GRANT ALL ON public.subscriptions TO authenticated;
GRANT ALL ON public.loyalty_points TO authenticated;
GRANT ALL ON public.loyalty_transactions TO authenticated;
GRANT ALL ON public.achievements TO authenticated;
GRANT ALL ON public.spin_wheel_state TO authenticated;
GRANT ALL ON public.rewards_redeemed TO authenticated;
GRANT ALL ON public.push_subscriptions TO authenticated;

GRANT SELECT ON public.dynamic_pricing TO anon;
GRANT SELECT ON public.pricing_rules TO anon;
