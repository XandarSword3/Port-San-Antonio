import { NextResponse } from 'next/server'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

export async function GET() {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      return NextResponse.json({ footer: null }, { status: 200 })
    }
    const { data, error } = await supabase
      .from('footer_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
    if (error) throw error
    return NextResponse.json({ footer: data?.[0] || null })
  } catch (e: any) {
    return NextResponse.json({ footer: null, error: e?.message || 'Failed' }, { status: 200 })
  }
}


