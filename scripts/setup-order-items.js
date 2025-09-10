const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ifcjvulukaqoqnolgajb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createOrderItemsTable() {
  console.log('🛠️  Creating order_items table...')
  
  try {
    // Note: We can't create tables with the anon key, but we can check if orders work
    console.log('✅ Testing database connectivity...')
    
    // Test if we can read orders
    const { data, error } = await supabase
      .from('orders')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Error accessing orders table:', error)
      console.log('⚠️  The order_items table needs to be created in the Supabase dashboard')
      console.log('📋 Please run this SQL in the Supabase SQL Editor:')
      console.log(`
-- Create order_items table for detailed order tracking
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    dish_id TEXT NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_dish_id ON public.order_items(dish_id);

-- Enable Row Level Security
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to order items
CREATE POLICY "Allow public read access to order items" ON public.order_items
    FOR SELECT USING (true);

-- Create policy to allow public insert access to order items
CREATE POLICY "Allow public insert access to order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.order_items TO anon;
GRANT ALL ON public.order_items TO authenticated;
`)
    } else {
      console.log('✅ Database connectivity confirmed')
      console.log('📦 Orders table accessible')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createOrderItemsTable()
