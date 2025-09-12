import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration for analytics API:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    })
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createSupabaseClient()
    
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Analytics service not configured' },
        { status: 503 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch analytics events
    const { data: events, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (eventsError) {
      console.error('Database error fetching analytics events:', eventsError)
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      )
    }

    // Fetch visitors
    const { data: visitors, error: visitorsError } = await supabase
      .from('visitors')
      .select('*')
      .order('last_seen', { ascending: false })
      .limit(50)

    if (visitorsError) {
      console.error('Database error fetching visitors:', visitorsError)
      return NextResponse.json(
        { error: 'Failed to fetch visitors' },
        { status: 500 }
      )
    }

    // Get summary stats
    const { count: totalEvents } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })

    const { count: totalVisitors } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      data: {
        events: events || [],
        visitors: visitors || [],
        summary: {
          totalEvents: totalEvents || 0,
          totalVisitors: totalVisitors || 0,
          eventsReturned: events?.length || 0,
          visitorsReturned: visitors?.length || 0
        }
      }
    })

  } catch (error) {
    console.error('Analytics GET endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
