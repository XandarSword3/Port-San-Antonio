-- Add customer information fields to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create index for status-based queries
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- Update the dish_ratings view to only include approved reviews
CREATE OR REPLACE VIEW dish_ratings AS
SELECT 
    dish_id,
    COUNT(*) as review_count,
    ROUND(AVG(rating), 1) as average_rating,
    MIN(rating) as min_rating,
    MAX(rating) as max_rating,
    COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
    COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
    COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
    COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
    COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
FROM reviews
WHERE status = 'approved'
GROUP BY dish_id;
