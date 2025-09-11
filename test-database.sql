-- Test if data was inserted correctly
-- Run this in Supabase SQL Editor

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('job_positions', 'footer_settings', 'legal_pages');

-- Check job_positions data
SELECT COUNT(*) as job_count FROM public.job_positions;

-- Check footer_settings data  
SELECT COUNT(*) as footer_count FROM public.footer_settings;

-- Check legal_pages data
SELECT COUNT(*) as legal_count FROM public.legal_pages;

-- Show sample job data
SELECT title, department, type, active FROM public.job_positions LIMIT 3;
