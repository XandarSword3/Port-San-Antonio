import { supabase, isSupabaseAvailable } from '@/lib/supabase'

async function testSupabaseConnection() {
  console.log('=== SUPABASE CONNECTION TEST ===')
  console.log('Environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'undefined')
  
  console.log('isSupabaseAvailable():', isSupabaseAvailable())
  console.log('supabase client:', !!supabase)
  
  if (isSupabaseAvailable() && supabase) {
    try {
      console.log('Testing connection...')
      const { data, error } = await supabase
        .from('dishes')
        .select('count(*)', { count: 'exact' })
        .limit(1)
      
      if (error) {
        console.error('Connection error:', error)
      } else {
        console.log('Connection successful! Count result:', data)
      }
      
      // Try to get actual dishes
      const { data: dishes, error: dishError } = await supabase
        .from('dishes')
        .select('*')
        .limit(5)
      
      if (dishError) {
        console.error('Dish query error:', dishError)
      } else {
        console.log('Dishes found:', dishes?.length)
        dishes?.forEach(dish => console.log(`- ${dish.name} ($${dish.price})`))
      }
      
    } catch (err) {
      console.error('Test error:', err)
    }
  } else {
    console.log('Supabase not available for testing')
  }
}

testSupabaseConnection().catch(console.error)
