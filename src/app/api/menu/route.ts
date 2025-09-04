import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Read the dishes.json file
    const dataPath = join(process.cwd(), 'data', 'dishes.json')
    const fileContent = readFileSync(dataPath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading menu data:', error)
    return NextResponse.json(
      { error: 'Failed to load menu data' },
      { status: 500 }
    )
  }
}
