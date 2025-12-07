-- Additional SQL Functions for Demand Metrics
-- Add these functions to your Supabase SQL Editor

-- Function to increment demand metrics (used for tracking)
CREATE OR REPLACE FUNCTION increment_demand_metric(
    p_dish_id TEXT,
    p_date DATE,
    p_hour INTEGER,
    p_metric TEXT,
    p_amount DECIMAL DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    IF p_metric = 'view_count' THEN
        INSERT INTO demand_metrics (dish_id, date, hour, view_count)
        VALUES (p_dish_id, p_date, p_hour, 1)
        ON CONFLICT (dish_id, date, hour) DO UPDATE
        SET view_count = demand_metrics.view_count + 1;
    
    ELSIF p_metric = 'add_to_cart_count' THEN
        INSERT INTO demand_metrics (dish_id, date, hour, add_to_cart_count)
        VALUES (p_dish_id, p_date, p_hour, 1)
        ON CONFLICT (dish_id, date, hour) DO UPDATE
        SET add_to_cart_count = demand_metrics.add_to_cart_count + 1;
    
    ELSIF p_metric = 'order_count' THEN
        INSERT INTO demand_metrics (dish_id, date, hour, order_count)
        VALUES (p_dish_id, p_date, p_hour, 1)
        ON CONFLICT (dish_id, date, hour) DO UPDATE
        SET order_count = demand_metrics.order_count + 1;
    
    ELSIF p_metric = 'revenue' AND p_amount IS NOT NULL THEN
        INSERT INTO demand_metrics (dish_id, date, hour, revenue)
        VALUES (p_dish_id, p_date, p_hour, p_amount)
        ON CONFLICT (dish_id, date, hour) DO UPDATE
        SET revenue = demand_metrics.revenue + p_amount;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to award spin wheel spins
CREATE OR REPLACE FUNCTION award_spin(
    p_user_id TEXT,
    p_spins INTEGER
)
RETURNS void AS $$
BEGIN
    INSERT INTO spin_wheel_state (user_id, spins_available, total_spins)
    VALUES (p_user_id, p_spins, 0)
    ON CONFLICT (user_id) DO UPDATE
    SET 
        spins_available = spin_wheel_state.spins_available + p_spins,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to use a spin
CREATE OR REPLACE FUNCTION use_spin(
    p_user_id TEXT,
    p_prize JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    available_spins INTEGER;
BEGIN
    -- Get available spins
    SELECT spins_available INTO available_spins
    FROM spin_wheel_state
    WHERE user_id = p_user_id;
    
    IF available_spins IS NULL OR available_spins < 1 THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct spin
    UPDATE spin_wheel_state
    SET 
        spins_available = spins_available - 1,
        last_spin_date = NOW(),
        total_spins = total_spins + 1,
        prizes_won = prizes_won || p_prize,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to update achievement progress
CREATE OR REPLACE FUNCTION update_achievement_progress(
    p_user_id TEXT,
    p_achievement_id TEXT,
    p_progress INTEGER
)
RETURNS void AS $$
DECLARE
    current_unlocked BOOLEAN;
BEGIN
    -- Get current status
    SELECT unlocked INTO current_unlocked
    FROM achievements
    WHERE user_id = p_user_id AND achievement_id = p_achievement_id;
    
    -- Update progress
    INSERT INTO achievements (id, user_id, achievement_id, progress)
    VALUES (gen_random_uuid()::TEXT, p_user_id, p_achievement_id, p_progress)
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET 
        progress = GREATEST(achievements.progress, p_progress),
        updated_at = NOW();
    
    -- Check if should be unlocked
    -- This is simplified - actual logic should compare progress with requirement
    IF p_progress >= 100 AND (current_unlocked IS NULL OR current_unlocked = FALSE) THEN
        UPDATE achievements
        SET 
            unlocked = TRUE,
            unlocked_at = NOW()
        WHERE user_id = p_user_id AND achievement_id = p_achievement_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-upgrade membership tier based on spending
CREATE OR REPLACE FUNCTION check_auto_upgrade()
RETURNS void AS $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT 
            lp.user_id,
            lp.lifetime_points,
            lp.tier,
            s.tier as subscription_tier
        FROM loyalty_points lp
        LEFT JOIN subscriptions s ON lp.user_id = s.user_id AND s.status = 'active'
    LOOP
        -- Auto upgrade based on lifetime spending
        -- Gold: $1,000+, Platinum: $5,000+, Diamond: $15,000+
        IF user_record.lifetime_points >= 15000 AND user_record.tier != 'diamond' THEN
            UPDATE loyalty_points
            SET tier = 'diamond', updated_at = NOW()
            WHERE user_id = user_record.user_id;
            
        ELSIF user_record.lifetime_points >= 5000 AND user_record.tier NOT IN ('platinum', 'diamond') THEN
            UPDATE loyalty_points
            SET tier = 'platinum', updated_at = NOW()
            WHERE user_id = user_record.user_id;
            
        ELSIF user_record.lifetime_points >= 1000 AND user_record.tier = 'free' THEN
            UPDATE loyalty_points
            SET tier = 'gold', updated_at = NOW()
            WHERE user_id = user_record.user_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Scheduled job to run pricing updates (run every 15 minutes)
-- Note: Set this up in Supabase Dashboard -> Database -> Cron Jobs
-- SELECT cron.schedule(
--     'update-pricing',
--     '*/15 * * * *',  -- Every 15 minutes
--     'SELECT update_demand_pricing()'
-- );

-- Scheduled job to check auto upgrades (run daily)
-- SELECT cron.schedule(
--     'check-auto-upgrades',
--     '0 0 * * *',  -- Daily at midnight
--     'SELECT check_auto_upgrade()'
-- );
