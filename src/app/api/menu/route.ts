import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get menu data from database
    const { data: dishes, error } = await supabase
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
      { error: 'Failed to load menu data' },
      { status: 500 }
    )
  }
}
