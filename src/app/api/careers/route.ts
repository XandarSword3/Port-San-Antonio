import { NextResponse } from 'next/server'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

export async function GET() {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      return NextResponse.json({ jobPositions: [] }, { status: 200 })
    }
    
    // Query the jobs table (same as staff portal)
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform the data to match JobPosition interface
    const jobPositions = (data || []).map(job => ({
      id: job.id,
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      description: job.description,
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      salary: job.salary,
      active: job.active,
      createdAt: new Date(job.created_at)
    }))
    
    return NextResponse.json({ jobPositions })
  } catch (e: any) {
    console.error('Error loading careers data:', e)
    return NextResponse.json({ jobPositions: [], error: e?.message || 'Failed' }, { status: 200 })
  }
}
