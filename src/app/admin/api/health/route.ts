import { NextResponse } from 'next/server'

export async function GET() {
  // Simple health check for admin route
  return NextResponse.json({ 
    status: 'Admin route is accessible',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
}
