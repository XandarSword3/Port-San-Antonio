import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  try {
    // Read the dishes data file
    const dataPath = path.join(process.cwd(), 'data', 'dishes.json')
    const rawData = fs.readFileSync(dataPath, 'utf8')
    const menuData = JSON.parse(rawData)

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT || '3000'
      },
      data: menuData
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: 'Failed to read menu data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
