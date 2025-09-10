import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    // Get data from database instead of file
    const { supabase } = await import('@/lib/supabase')
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
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT || '3000'
      },
      data: {
        dishes: dishes || [],
        categories: categories || []
      },
      source: 'database'
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: 'Failed to read menu data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
