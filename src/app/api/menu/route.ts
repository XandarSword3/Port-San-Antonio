import { NextResponse } from 'next/server'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if Supabase is available
    if (!isSupabaseAvailable()) {
      console.error('❌ Supabase not available - missing environment variables')
      return NextResponse.json(
        { 
          dishes: [], 
          error: 'Database unavailable - missing configuration',
          message: 'Please configure Supabase environment variables' 
        },
        { status: 503 }
      )
    }

    // Get menu data from database
    const { data: dishes, error } = await supabase!
      .from('dishes')
      .select('*')
      .order('name')

    if (error) {
      throw error
    }

    return NextResponse.json({ dishes: dishes || [] })
  } catch (error) {
    console.error('Error loading menu data from database:', error)
    return NextResponse.json(
      { 
        dishes: [], 
        error: 'Failed to load menu data',
        message: error instanceof Error ? error.message : 'Unknown database error'
      },
      { status: 500 }
    )
  }
}
