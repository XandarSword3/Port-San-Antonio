import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use server-side Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration for analytics API')
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Types for analytics events
interface AnalyticsEvent {
  visitorId: string
  eventName: string
  props?: Record<string, any>
  url?: string
  referrer?: string
  userAgent?: string
  ts?: string
}

interface BatchRequest {
  events: AnalyticsEvent[]
}

// Simple in-memory rate limiting (sliding window)
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60 // 60 requests per minute per IP

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const requests = rateLimitMap.get(ip) || []
  
  // Remove requests outside the window
  const validRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW)
  
  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false // Rate limited
  }
  
  // Add current request
  validRequests.push(now)
  rateLimitMap.set(ip, validRequests)
  
  return true // Not rate limited
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback to connection IP (may not be available in all environments)
  return 'unknown'
}

/**
 * Validate event object
 */
function validateEvent(event: any): event is AnalyticsEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    typeof event.visitorId === 'string' &&
    typeof event.eventName === 'string' &&
    event.visitorId.length > 0 &&
    event.eventName.length > 0 &&
    (event.props === undefined || typeof event.props === 'object') &&
    (event.url === undefined || typeof event.url === 'string') &&
    (event.referrer === undefined || typeof event.referrer === 'string') &&
    (event.userAgent === undefined || typeof event.userAgent === 'string') &&
    (event.ts === undefined || typeof event.ts === 'string')
  )
}

/**
 * Sanitize event data to prevent injection attacks
 */
function sanitizeEvent(event: AnalyticsEvent): AnalyticsEvent {
  return {
    visitorId: event.visitorId.substring(0, 255),
    eventName: event.eventName.substring(0, 100),
    props: event.props,
    url: event.url?.substring(0, 2000),
    referrer: event.referrer?.substring(0, 2000),
    userAgent: event.userAgent?.substring(0, 500),
    ts: event.ts
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Analytics service not configured' },
        { status: 503 }
      )
    }

    // Get client IP for rate limiting
    const clientIp = getClientIp(request)
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Parse request body
    let body: BatchRequest
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate request structure
    if (!body || !Array.isArray(body.events)) {
      return NextResponse.json(
        { error: 'Request must contain events array' },
        { status: 400 }
      )
    }

    // Check limits
    if (body.events.length === 0) {
      return NextResponse.json(
        { ok: true, inserted: 0 },
        { status: 200 }
      )
    }

    if (body.events.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 events per request' },
        { status: 400 }
      )
    }

    // Check serialized size
    const serializedSize = JSON.stringify(body).length
    if (serializedSize > 500 * 1024) { // 500KB
      return NextResponse.json(
        { error: 'Request too large (max 500KB)' },
        { status: 400 }
      )
    }

    // Validate and sanitize events
    const validEvents: AnalyticsEvent[] = []
    for (const event of body.events) {
      if (validateEvent(event)) {
        validEvents.push(sanitizeEvent(event))
      }
    }

    if (validEvents.length === 0) {
      return NextResponse.json(
        { error: 'No valid events found' },
        { status: 400 }
      )
    }

    // Transform events for database insertion
    const dbEvents = validEvents.map(event => ({
      visitor_id: event.visitorId,
      event_name: event.eventName,
      event_props: event.props || {},
      url: event.url,
      referrer: event.referrer,
      user_agent: event.userAgent,
      created_at: event.ts ? new Date(event.ts) : new Date()
    }))

    // Insert into database
    const { data, error } = await supabase
      .from('analytics_events')
      .insert(dbEvents)
      .select('id')

    if (error) {
      console.error('Database error inserting analytics events:', error)
      return NextResponse.json(
        { error: 'Failed to store events' },
        { status: 500 }
      )
    }

    // Update visitors table with last_seen
    const visitorIds = Array.from(new Set(validEvents.map(e => e.visitorId)))
    // Best-effort: upsert visitors, ignore errors per row to avoid failing entire request
    try {
      for (const visitorId of visitorIds) {
        await supabase
          .from('visitors')
          .upsert({
            visitor_id: visitorId,
            last_seen: new Date(),
            first_seen: new Date() // Will be ignored if visitor already exists
          }, {
            onConflict: 'visitor_id',
            ignoreDuplicates: false
          })
      }
    } catch (e) {
      console.warn('Visitor upsert warning:', e)
    }

    return NextResponse.json({
      ok: true,
      inserted: data?.length || validEvents.length
    })

  } catch (error) {
    console.error('Analytics batch endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
