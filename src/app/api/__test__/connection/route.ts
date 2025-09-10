import { NextResponse } from 'next/server'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

export async function GET() {
  console.log('=== SUPABASE CONNECTION TEST API ===')
  
  const result = {
    environment: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'undefined'
    },
    isSupabaseAvailable: isSupabaseAvailable(),
    supabaseClient: !!supabase,
    connectionTest: null as string | null,
    dishCount: 0,
    sampleDishes: [] as any[]
  }
  
  console.log('Environment:', result.environment)
  console.log('isSupabaseAvailable():', result.isSupabaseAvailable)
  console.log('supabase client:', result.supabaseClient)
  
  if (result.isSupabaseAvailable && supabase) {
    try {
      console.log('Testing connection...')
      
      // Try to get dish count
      const { data: dishes, error } = await supabase
        .from('dishes')
        .select('*')
        .limit(5)
      
      if (error) {
        console.error('Connection error:', error)
        result.connectionTest = `Error: ${error.message}`
      } else {
        console.log('Connection successful! Dishes found:', dishes?.length)
        result.connectionTest = 'Success'
        result.dishCount = dishes?.length || 0
        result.sampleDishes = dishes?.map(d => ({
          name: d.name,
          price: d.price,
          category: d.category_id
        })) || []
      }
      
    } catch (err) {
      console.error('Test error:', err)
      result.connectionTest = `Exception: ${err instanceof Error ? err.message : 'Unknown error'}`
    }
  } else {
    result.connectionTest = 'Supabase not available'
    console.log('Supabase not available for testing')
  }
  
  return NextResponse.json(result)
}
