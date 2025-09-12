-- Analytics Migration - September 2025
-- Creates tables for visitor tracking and analytics events

-- Create analytics_events table for storing all tracking events
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    user_id UUID DEFAULT NULL,
    event_name TEXT NOT NULL,
    event_props JSONB DEFAULT '{}'::jsonb,
    url TEXT,
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create visitors table for visitor session tracking
CREATE TABLE IF NOT EXISTS public.visitors (
    visitor_id TEXT PRIMARY KEY,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    device_meta JSONB DEFAULT '{}'::jsonb
);

-- Create user_visitors table to link authenticated users with their visitor sessions
CREATE TABLE IF NOT EXISTS public.user_visitors (
    user_id UUID NOT NULL,
    visitor_id TEXT NOT NULL,
    linked_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, visitor_id)
);

-- Add foreign key constraints if users table exists
-- Note: This will only work if you have a users table in your schema
-- Remove or modify this if your user table has a different name or structure
DO $$
BEGIN
    -- Check if users table exists before adding foreign key
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        -- Add foreign key constraint for analytics_events.user_id
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_analytics_events_user_id' 
            AND table_name = 'analytics_events'
        ) THEN
            ALTER TABLE public.analytics_events 
            ADD CONSTRAINT fk_analytics_events_user_id 
            FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
        END IF;
        
        -- Add foreign key constraint for user_visitors.user_id
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_user_visitors_user_id' 
            AND table_name = 'user_visitors'
        ) THEN
            ALTER TABLE public.user_visitors 
            ADD CONSTRAINT fk_user_visitors_user_id 
            FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- Add foreign key constraint for user_visitors.visitor_id
ALTER TABLE public.user_visitors 
ADD CONSTRAINT fk_user_visitors_visitor_id 
FOREIGN KEY (visitor_id) REFERENCES public.visitors(visitor_id) ON DELETE CASCADE;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_id ON public.analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_url ON public.analytics_events(url) WHERE url IS NOT NULL;

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_event_time ON public.analytics_events(visitor_id, event_name, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_time ON public.analytics_events(event_name, created_at);

-- Indexes for visitors table
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON public.visitors(last_seen);
CREATE INDEX IF NOT EXISTS idx_visitors_first_seen ON public.visitors(first_seen);

-- GIN index for JSONB columns for efficient querying
CREATE INDEX IF NOT EXISTS idx_analytics_events_props ON public.analytics_events USING GIN(event_props);
CREATE INDEX IF NOT EXISTS idx_visitors_device_meta ON public.visitors USING GIN(device_meta);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_visitors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics_events
DROP POLICY IF EXISTS "Allow public insert to analytics_events" ON public.analytics_events;
CREATE POLICY "Allow public insert to analytics_events" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access to analytics_events" ON public.analytics_events;
CREATE POLICY "Allow service role full access to analytics_events" ON public.analytics_events
    FOR ALL USING (true);

-- Create RLS policies for visitors
DROP POLICY IF EXISTS "Allow public insert to visitors" ON public.visitors;
CREATE POLICY "Allow public insert to visitors" ON public.visitors
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to visitors" ON public.visitors;
CREATE POLICY "Allow public update to visitors" ON public.visitors
    FOR UPDATE WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access to visitors" ON public.visitors;
CREATE POLICY "Allow service role full access to visitors" ON public.visitors
    FOR ALL USING (true);

-- Create RLS policies for user_visitors
DROP POLICY IF EXISTS "Allow public insert to user_visitors" ON public.user_visitors;
CREATE POLICY "Allow public insert to user_visitors" ON public.user_visitors
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access to user_visitors" ON public.user_visitors;
CREATE POLICY "Allow service role full access to user_visitors" ON public.user_visitors
    FOR ALL USING (true);

-- Grant permissions to anon and authenticated roles
GRANT INSERT ON public.analytics_events TO anon;
GRANT INSERT, UPDATE ON public.visitors TO anon;
GRANT INSERT ON public.user_visitors TO anon;

GRANT ALL ON public.analytics_events TO authenticated;
GRANT ALL ON public.visitors TO authenticated;
GRANT ALL ON public.user_visitors TO authenticated;

-- Function to automatically update visitors.last_seen when analytics_events are inserted
CREATE OR REPLACE FUNCTION update_visitor_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.visitors (visitor_id, last_seen)
    VALUES (NEW.visitor_id, NEW.created_at)
    ON CONFLICT (visitor_id) 
    DO UPDATE SET last_seen = NEW.created_at
    WHERE visitors.last_seen < NEW.created_at;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update visitor last_seen
DROP TRIGGER IF EXISTS trigger_update_visitor_last_seen ON public.analytics_events;
CREATE TRIGGER trigger_update_visitor_last_seen
    AFTER INSERT ON public.analytics_events
    FOR EACH ROW
    EXECUTE FUNCTION update_visitor_last_seen();

-- Add helpful comments
COMMENT ON TABLE public.analytics_events IS 'Stores all visitor tracking events and interactions';
COMMENT ON COLUMN public.analytics_events.visitor_id IS 'Anonymous visitor identifier (UUID)';
COMMENT ON COLUMN public.analytics_events.user_id IS 'Authenticated user ID if logged in';
COMMENT ON COLUMN public.analytics_events.event_name IS 'Event type (page_view, qr_scan, etc.)';
COMMENT ON COLUMN public.analytics_events.event_props IS 'Event-specific properties and metadata';
COMMENT ON COLUMN public.analytics_events.url IS 'URL where the event occurred';
COMMENT ON COLUMN public.analytics_events.referrer IS 'HTTP referrer header';
COMMENT ON COLUMN public.analytics_events.user_agent IS 'Browser user agent string';

COMMENT ON TABLE public.visitors IS 'Tracks visitor sessions and metadata';
COMMENT ON COLUMN public.visitors.visitor_id IS 'Anonymous visitor identifier matching analytics_events';
COMMENT ON COLUMN public.visitors.first_seen IS 'First time this visitor was seen';
COMMENT ON COLUMN public.visitors.last_seen IS 'Most recent activity from this visitor';
COMMENT ON COLUMN public.visitors.device_meta IS 'Device and browser metadata';

COMMENT ON TABLE public.user_visitors IS 'Links authenticated users with their visitor sessions';
COMMENT ON COLUMN public.user_visitors.user_id IS 'Authenticated user ID';
COMMENT ON COLUMN public.user_visitors.visitor_id IS 'Visitor session ID';
COMMENT ON COLUMN public.user_visitors.linked_at IS 'When the user-visitor link was established';

-- Example queries for testing:
-- 
-- -- Get all page views for a visitor:
-- SELECT event_name, url, created_at FROM analytics_events 
-- WHERE visitor_id = 'your-visitor-id' AND event_name = 'page_view' 
-- ORDER BY created_at;
--
-- -- Get visitor activity summary:
-- SELECT visitor_id, COUNT(*) as total_events, 
--        MIN(created_at) as first_seen, MAX(created_at) as last_seen
-- FROM analytics_events GROUP BY visitor_id;
--
-- -- Get popular pages:
-- SELECT event_props->>'path' as page, COUNT(*) as views
-- FROM analytics_events WHERE event_name = 'page_view'
-- GROUP BY page ORDER BY views DESC;
