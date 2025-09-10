const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ifcjvulukaqoqnolgajb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3FuMGxnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MzIzOTgsImV4cCI6MjA1MTAwODM5OH0.5HzpU7QafztedWR8NCbWPVD1-KZfW4igE6KLVKbHvuE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createOrderItemsTable() {
  console.log('Creating order_items table...');
  
  // Use direct query instead of RPC
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_name', 'order_items')
    .eq('table_schema', 'public');

  if (error) {
    console.error('Error checking table:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('order_items table already exists!');
    return;
  }

  console.log('Table does not exist. Please run this SQL in your Supabase dashboard:');
  console.log(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      dish_id INTEGER REFERENCES dishes(id),
      quantity INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_dish_id ON order_items(dish_id);
  `);
}

createOrderItemsTable().catch(console.error);
