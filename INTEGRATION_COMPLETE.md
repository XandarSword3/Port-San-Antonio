📋 **URGENT: Complete the Integration**

The customer website is now fully integrated with Supabase, but one final step is needed to enable order submission:

## 🗄️ Create order_items Table

**Option 1: Supabase Dashboard (Recommended)**
1. Go to https://supabase.com/dashboard/project/ifcjvulukaqoqnolgajb
2. Navigate to SQL Editor
3. Run this SQL:

```sql
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
```

**Option 2: Staff Portal**
1. Go to https://port-antonio-staff.vercel.app
2. Login as admin
3. Use the database management tools (if available)

## ✅ After Creating the Table

The complete integration will be active:
- ✅ Customer menu loads from database (60 real dishes)
- ✅ Real-time menu updates (staff changes → customer site)
- ✅ Order submission works (customer → staff portal)
- ✅ Complete unified restaurant system

## 🎯 Current Status

**WORKING NOW:**
- Customer site: https://port-san-antonio.vercel.app (database menu)
- Staff portal: https://port-antonio-staff.vercel.app (menu management)
- Real-time sync: Menu changes appear instantly

**NEEDS order_items table:**
- Order submission from customer cart
- Order management in staff portal
