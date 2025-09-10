import { NextResponse } from 'next/server'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

export async function GET() {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      return NextResponse.json({ legalPages: [] }, { status: 200 })
    }
    
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ legalPages: data || [] })
  } catch (e: any) {
    console.error('Error loading legal pages data:', e)
    return NextResponse.json({ legalPages: [], error: e?.message || 'Failed' }, { status: 200 })
  }
}
