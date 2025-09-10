import { NextResponse } from 'next/server'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

export async function GET() {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      return NextResponse.json({ jobPositions: [] }, { status: 200 })
    }
    
    const { data, error } = await supabase
      .from('job_positions')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ jobPositions: data || [] })
  } catch (e: any) {
    console.error('Error loading careers data:', e)
    return NextResponse.json({ jobPositions: [], error: e?.message || 'Failed' }, { status: 200 })
  }
}
