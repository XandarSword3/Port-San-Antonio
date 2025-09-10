-- Setup content management tables for Port Antonio Resort
-- This script creates all necessary tables for careers, legal pages, and other content

-- Create footer_settings table (if not exists)
CREATE TABLE IF NOT EXISTS public.footer_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    dining_hours TEXT NOT NULL,
    dining_location TEXT NOT NULL,
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create job_positions table
CREATE TABLE IF NOT EXISTS public.job_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    benefits TEXT[] NOT NULL DEFAULT '{}',
    salary TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create legal_pages table
CREATE TABLE IF NOT EXISTS public.legal_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('privacy', 'terms', 'accessibility')),
    title TEXT NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS public.page_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id TEXT NOT NULL CHECK (page_id IN ('careers', 'privacy', 'terms', 'accessibility')),
    section TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_positions_active ON public.job_positions(active);
CREATE INDEX IF NOT EXISTS idx_job_positions_type ON public.job_positions(type);
CREATE INDEX IF NOT EXISTS idx_legal_pages_type ON public.legal_pages(type);
CREATE INDEX IF NOT EXISTS idx_page_content_page_id ON public.page_content(page_id);

-- Enable Row Level Security
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (drop first if they exist)
DROP POLICY IF EXISTS "Allow public read access to footer settings" ON public.footer_settings;
CREATE POLICY "Allow public read access to footer settings" ON public.footer_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to job positions" ON public.job_positions;
CREATE POLICY "Allow public read access to job positions" ON public.job_positions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to legal pages" ON public.legal_pages;
CREATE POLICY "Allow public read access to legal pages" ON public.legal_pages
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to page content" ON public.page_content;
CREATE POLICY "Allow public read access to page content" ON public.page_content
    FOR SELECT USING (true);

-- Grant permissions
GRANT ALL ON public.footer_settings TO anon;
GRANT ALL ON public.footer_settings TO authenticated;
GRANT ALL ON public.job_positions TO anon;
GRANT ALL ON public.job_positions TO authenticated;
GRANT ALL ON public.legal_pages TO anon;
GRANT ALL ON public.legal_pages TO authenticated;
GRANT ALL ON public.page_content TO anon;
GRANT ALL ON public.page_content TO authenticated;

-- Insert default footer settings
INSERT INTO public.footer_settings (
    company_name, description, address, phone, email, 
    dining_hours, dining_location, social_links
) VALUES (
    'Port Antonio Resort',
    'Luxury beachfront resort with world-class dining',
    'Port Antonio, Mastita, Lebanon',
    '+1 (876) 555-0123',
    'info@portantonio.com',
    'Dining Available 24/7',
    'Main Restaurant & Beachside',
    '{}'
) ON CONFLICT DO NOTHING;

-- Insert default job positions
INSERT INTO public.job_positions (
    title, department, type, location, description, 
    requirements, benefits, salary, active
) VALUES 
(
    'Head Chef',
    'Kitchen',
    'full-time',
    'Port Antonio, Lebanon',
    'Lead our culinary team in creating exceptional Mediterranean and international cuisine. Oversee kitchen operations, menu development, and staff management.',
    ARRAY[
        '5+ years of experience as a head chef or sous chef',
        'Culinary degree or equivalent experience',
        'Experience with Mediterranean cuisine',
        'Strong leadership and communication skills',
        'Food safety certification'
    ],
    ARRAY[
        'Competitive salary package',
        'Health and dental insurance',
        'Staff meals and accommodation',
        'Professional development opportunities',
        'Performance bonuses'
    ],
    'Competitive salary based on experience',
    true
),
(
    'Server',
    'Service',
    'part-time',
    'Port Antonio, Lebanon',
    'Provide exceptional dining service to our guests. Take orders, serve food and beverages, and ensure a memorable dining experience.',
    ARRAY[
        'Previous serving experience preferred',
        'Excellent communication skills',
        'Ability to work in a fast-paced environment',
        'Knowledge of food and wine pairings',
        'Multilingual skills (Arabic, French, English) preferred'
    ],
    ARRAY[
        'Hourly wages plus tips',
        'Flexible scheduling',
        'Staff meal benefits',
        'Training and development',
        'Friendly work environment'
    ],
    'Hourly wage plus tips',
    true
),
(
    'Sous Chef',
    'Kitchen',
    'full-time',
    'Port Antonio, Lebanon',
    'Support the head chef in daily kitchen operations, food preparation, and staff supervision. Help maintain our high culinary standards.',
    ARRAY[
        '3+ years of professional kitchen experience',
        'Culinary training or apprenticeship',
        'Knowledge of food safety standards',
        'Ability to work under pressure',
        'Team player with leadership potential'
    ],
    ARRAY[
        'Competitive salary',
        'Career advancement opportunities',
        'Health benefits',
        'Staff accommodation available',
        'Continuing education support'
    ],
    'Competitive salary based on experience',
    true
) ON CONFLICT DO NOTHING;

-- Insert default legal pages
INSERT INTO public.legal_pages (type, title, sections) VALUES 
(
    'privacy',
    'Privacy Policy',
    '[
        {
            "id": "intro",
            "title": "Introduction",
            "content": "This Privacy Policy explains how Port Antonio Resort collects, uses, and protects your personal information when you visit our website or use our services.",
            "order": 1
        },
        {
            "id": "data-collection",
            "title": "Information We Collect",
            "content": "We collect information you provide directly to us, such as when you make a reservation, contact us, or use our services. This may include your name, email address, phone number, and other information you choose to provide.",
            "order": 2
        }
    ]'::jsonb
),
(
    'terms',
    'Terms of Service',
    '[
        {
            "id": "intro",
            "title": "Agreement to Terms",
            "content": "By using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
            "order": 1
        },
        {
            "id": "use-of-services",
            "title": "Use of Services",
            "content": "You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that could damage, disable, or impair our website or services.",
            "order": 2
        }
    ]'::jsonb
),
(
    'accessibility',
    'Accessibility Statement',
    '[
        {
            "id": "intro",
            "title": "Our Commitment",
            "content": "Port Antonio Resort is committed to making our website and services accessible to everyone, including people with disabilities. We strive to provide an inclusive experience for all our guests.",
            "order": 1
        },
        {
            "id": "standards",
            "title": "Accessibility Standards",
            "content": "We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards to ensure our website is accessible to all users.",
            "order": 2
        }
    ]'::jsonb
) ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at (drop first if they exist)
DROP TRIGGER IF EXISTS update_footer_settings_updated_at ON public.footer_settings;
CREATE TRIGGER update_footer_settings_updated_at BEFORE UPDATE ON public.footer_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_positions_updated_at ON public.job_positions;
CREATE TRIGGER update_job_positions_updated_at BEFORE UPDATE ON public.job_positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_legal_pages_updated_at ON public.legal_pages;
CREATE TRIGGER update_legal_pages_updated_at BEFORE UPDATE ON public.legal_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_page_content_updated_at ON public.page_content;
CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON public.page_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
