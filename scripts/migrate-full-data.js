const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://ifcjvulukaqoqnolgajb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k'

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateFullData() {
  try {
    console.log('🍽️ Starting FULL data migration (968 dishes)...')
    
    // Load the complete dishes data
    const dishesPath = path.join(__dirname, '..', 'public', 'menu-data.json')
    console.log('📖 Loading dishes from:', dishesPath)
    
    if (!fs.existsSync(dishesPath)) {
      console.error('❌ dishes.json not found at:', dishesPath)
      return
    }
    
    const dishesData = JSON.parse(fs.readFileSync(dishesPath, 'utf8'))
    console.log(`📊 Found ${dishesData.dishes.length} dishes to import`)
    
    // Extract unique categories from dishes
    const categorySet = new Set()
    const categoryData = {}
    
    dishesData.dishes.forEach(dish => {
      if (!categorySet.has(dish.categoryId)) {
        categorySet.add(dish.categoryId)
        // Create category with proper naming
        const categoryName = dish.categoryId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        categoryData[dish.categoryId] = categoryName
      }
    })
    
    console.log(`📋 Found ${categorySet.size} unique categories:`, Array.from(categorySet))
    
    // Category mapping to standard categories
    const categoryMapping = {
      'beers': 'beers',
      'arak': 'arak', 
      'drinks': 'drinks',
      'platters': 'main-courses',
      'pizza': 'main-courses',
      'burgers': 'main-courses',
      'salads': 'appetizers',
      'sandwiches': 'main-courses',
      'starters': 'appetizers',
      'prosecco': 'drinks',
      'wine': 'drinks',
      'cocktails': 'drinks'
    }
    
    // Clear existing data
    console.log('🗑️ Clearing existing dishes...')
    const { error: deleteError } = await supabase
      .from('dishes')
      .delete()
      .neq('id', '')  // Delete all records
    
    if (deleteError) {
      console.log('⚠️ Could not clear existing dishes:', deleteError.message)
    }
    
    // Import all categories first
    console.log('📦 Importing categories...')
    const categories = [
      { id: 'beers', name: 'Beers', order_index: 1 },
      { id: 'arak', name: 'Arak', order_index: 2 },
      { id: 'drinks', name: 'Drinks', order_index: 3 },
      { id: 'appetizers', name: 'Appetizers', order_index: 4 },
      { id: 'main-courses', name: 'Main Courses', order_index: 5 },
      { id: 'desserts', name: 'Desserts', order_index: 6 }
    ]
    
    const { error: catError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'id' })
    
    if (catError) {
      console.error('❌ Error importing categories:', catError)
    } else {
      console.log('✅ Categories imported successfully')
    }
    
    // Transform and import ALL dishes
    const transformedDishes = dishesData.dishes.map(dish => {
      // Handle variants (multiple prices) by taking the first variant or the single price
      let price = 0
      if (dish.variants && dish.variants.length > 0) {
        price = dish.variants[0].price
      } else if (dish.price) {
        price = dish.price
      }
      
      // Map category to existing database categories
      const mappedCategoryId = categoryMapping[dish.categoryId] || 'appetizers'
      
      return {
        id: dish.id,
        name: dish.name,
        short_desc: dish.shortDesc || dish.name,
        full_desc: dish.fullDesc || dish.description || `Delicious ${dish.name} from our kitchen`,
        price: price,
        category_id: mappedCategoryId,
        available: dish.available !== false,
        image_url: dish.image || '/images/placeholder.jpg',
        currency: dish.currency || 'USD'
      }
    })
    
    console.log(`📤 Uploading ${transformedDishes.length} dishes to Supabase...`)
    
    // Insert dishes in batches of 100 to avoid timeout
    const batchSize = 100
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < transformedDishes.length; i += batchSize) {
      const batch = transformedDishes.slice(i, i + batchSize)
      console.log(`📦 Importing batch ${Math.floor(i/batchSize) + 1} (${batch.length} dishes)...`)
      
      const { data, error } = await supabase
        .from('dishes')
        .upsert(batch, { onConflict: 'id' })
      
      if (error) {
        console.error(`❌ Error importing batch ${Math.floor(i/batchSize) + 1}:`, error)
        errorCount += batch.length
      } else {
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} imported successfully`)
        successCount += batch.length
      }
    }
    
    // Verify the import
    const { data: finalCount, error: countError } = await supabase
      .from('dishes')
      .select('id', { count: 'exact' })
    
    if (countError) {
      console.error('❌ Error counting dishes:', countError)
    } else {
      console.log(`🎉 Migration complete!`)
      console.log(`✅ Total dishes in database: ${finalCount.length}`)
      console.log(`✅ Successfully imported: ${successCount}`)
      if (errorCount > 0) {
        console.log(`❌ Failed imports: ${errorCount}`)
      }
    }
    
    // Show category distribution
    console.log('\n📊 Category distribution:')
    for (const category of categories) {
      const { data: catDishes } = await supabase
        .from('dishes')
        .select('id', { count: 'exact' })
        .eq('category_id', category.id)
      console.log(`  ${category.name}: ${catDishes?.length || 0} dishes`)
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
  }
}

// Run the migration
migrateFullData()
