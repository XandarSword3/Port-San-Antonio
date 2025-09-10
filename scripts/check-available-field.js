const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ifcjvulukaqoqnolgajb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k'
);

async function checkAvailable() {
  console.log('🔍 Checking available field in dishes...');
  
  const { data: allDishes } = await supabase.from('dishes').select('id, name, available').limit(10);
  console.log('📊 Sample dishes with available field:');
  allDishes.forEach(dish => console.log(`  - ${dish.name}: available=${dish.available}`));
  
  const { data: availableDishes, count: availableCount } = await supabase
    .from('dishes')
    .select('*', {count: 'exact'})
    .eq('available', true);
  console.log(`✅ Dishes where available=true: ${availableCount}`);
  
  const { data: allCount, count: totalCount } = await supabase
    .from('dishes')
    .select('*', {count: 'exact'});
  console.log(`📈 Total dishes: ${totalCount}`);
  
  // Test what MenuContext query would return
  const { data: menuContextQuery, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('available', true)
    .order('category_id');
    
  if (error) {
    console.error('❌ MenuContext query error:', error);
  } else {
    console.log(`🔍 MenuContext query result: ${menuContextQuery.length} dishes`);
  }
}

checkAvailable().catch(console.error);
