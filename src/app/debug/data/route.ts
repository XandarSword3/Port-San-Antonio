import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get data from database instead of file
    const { data: dishes, error: dishesError } = await supabase
      .from('dishes')
      .select('*')
      .order('name')

    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (dishesError || categoriesError) {
      throw new Error(`Database error: ${dishesError?.message || categoriesError?.message}`)
    }
    
    return NextResponse.json({
      ok: true,
      data: {
        dishes: dishes || [],
        categories: categories || []
      },
      dishCount: dishes?.length || 0,
      categoryCount: categories?.length || 0,
      source: 'database'
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
