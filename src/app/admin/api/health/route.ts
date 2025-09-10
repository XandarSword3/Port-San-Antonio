import { NextResponse } from 'next/server'

export async function GET() {
  // Deprecated admin route
  return NextResponse.json({ 
    status: 'deprecated',
    message: 'Admin endpoints moved to staff portal',
    timestamp: new Date().toISOString()
  })
}
