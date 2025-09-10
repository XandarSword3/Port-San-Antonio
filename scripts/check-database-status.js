const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ifcjvulukaqoqnolgajb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k'
);

async function checkDatabase() {
  console.log('🔍 Checking current database state...');
  
  try {
    const { data: dishes, error: dishesError } = await supabase
      .from('dishes')
      .select('*', { count: 'exact' });
      
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*', { count: 'exact' });
      
    if (dishesError) {
      console.error('❌ Error loading dishes:', dishesError);
    } else {
      console.log(`📊 Current dishes in database: ${dishes.length}`);
      if (dishes.length > 0) {
        console.log('🍽️ Sample dishes:');
        dishes.slice(0, 5).forEach(dish => console.log(`  - ${dish.name} (${dish.category_id})`));
        if (dishes.length > 5) console.log(`  ... and ${dishes.length - 5} more`);
      } else {
        console.log('❌ NO DISHES FOUND - Database is empty!');
      }
    }
    
    if (categoriesError) {
      console.error('❌ Error loading categories:', categoriesError);
    } else {
      console.log(`📋 Categories in database: ${categories.length}`);
      categories.forEach(cat => console.log(`  - ${cat.name} (id: ${cat.id})`));
    }
  } catch (error) {
    console.error('💥 Database connection failed:', error);
  }
}

checkDatabase();
