const { createClient } = require('@supabase/supabase-js');

// Use the same credentials as in .env.local
const supabaseUrl = 'https://ifcjvulukaqoqnolgajb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simulate exactly what MenuContext does
async function simulateMenuContext() {
  console.log('🔄 Simulating MenuContext loadMenuData...');
  
  try {
    // Load categories exactly like MenuContext
    console.log('📋 Loading categories...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('order_index');

    if (categoriesError) {
      console.error('❌ Error loading categories:', categoriesError);
    } else {
      console.log(`✅ Categories loaded: ${categoriesData?.length}`);
      const transformedCategories = categoriesData?.map(cat => ({
        id: cat.id,
        name: cat.name,
        order: cat.order_index,
        description: cat.description
      })) || [];
      console.log('📋 Transformed categories:', transformedCategories.map(c => c.name));
    }

    // Load dishes exactly like MenuContext  
    console.log('🍽️ Loading dishes...');
    const { data: dishesData, error: dishesError } = await supabase
      .from('dishes')
      .select('*')
      .eq('available', true)
      .order('category_id');

    if (dishesError) {
      console.error('❌ Error loading dishes:', dishesError);
      throw dishesError;
    }

    console.log(`✅ Dishes loaded: ${dishesData?.length}`);
    
    // Transform dishes like MenuContext
    const transformedDishes = dishesData?.map(dbDish => ({
      id: dbDish.id,
      name: dbDish.name,
      shortDesc: dbDish.short_desc || dbDish.name,
      fullDesc: dbDish.full_desc || `Delicious ${dbDish.name} from our kitchen`,
      price: dbDish.price || 0,
      categoryId: dbDish.category_id,
      currency: dbDish.currency || 'USD',
      image: dbDish.image_url || '/images/placeholder.jpg',
      available: dbDish.available !== false,
      sponsored: false,
      variants: [],
      dietTags: [],
      allergens: [],
      ingredients: [],
      calories: null,
      rating: 4.5,
      reviewCount: 0,
      imageVariants: { 
        src: dbDish.image_url || '/images/placeholder.jpg'
      }
    })) || [];

    console.log(`🎯 Final transformed dishes: ${transformedDishes.length}`);
    console.log('📊 Sample dishes:');
    transformedDishes.slice(0, 5).forEach(dish => {
      console.log(`  - ${dish.name} (${dish.categoryId}) - Available: ${dish.available}`);
    });
    
    console.log('✅ MenuContext simulation successful!');
    
  } catch (err) {
    console.error('💥 MenuContext simulation failed:', err);
  }
}

simulateMenuContext();
