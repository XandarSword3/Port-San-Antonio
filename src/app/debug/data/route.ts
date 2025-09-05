import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-static'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'dishes.json')
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({
        ok: false,
        error: 'Data file not found',
        path: dataPath
      }, { status: 404 })
    }

    const rawData = fs.readFileSync(dataPath, 'utf8')
    const data = JSON.parse(rawData)
    
    return NextResponse.json({
      ok: true,
      data,
      fileSize: rawData.length,
      dishCount: data.dishes?.length || 0,
      categoryCount: data.categories?.length || 0
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
