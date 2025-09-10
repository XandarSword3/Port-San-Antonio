import { NextResponse } from 'next/server'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

export async function GET() {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      return NextResponse.json({ pageContent: [] }, { status: 200 })
    }
    
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ pageContent: data || [] })
  } catch (e: any) {
    console.error('Error loading page content data:', e)
    return NextResponse.json({ pageContent: [], error: e?.message || 'Failed' }, { status: 200 })
  }
}
