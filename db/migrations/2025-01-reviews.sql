-- Create reviews table for dish ratings and comments
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dish_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient dish-based queries
CREATE INDEX IF NOT EXISTS idx_reviews_dish_id ON reviews(dish_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to reviews" ON reviews
    FOR SELECT USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access to reviews" ON reviews
    FOR INSERT WITH CHECK (true);

-- Create policy to allow public update access (for moderation)
CREATE POLICY "Allow public update access to reviews" ON reviews
    FOR UPDATE USING (true);

-- Create policy to allow public delete access (for moderation)
CREATE POLICY "Allow public delete access to reviews" ON reviews
    FOR DELETE USING (true);

-- Create a view for dish ratings summary
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
GROUP BY dish_id;

-- Grant access to the view
GRANT SELECT ON dish_ratings TO anon, authenticated;
