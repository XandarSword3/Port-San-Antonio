import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'dishes.json')
    const dataExists = fs.existsSync(dataPath)
    const dataFileSize = dataExists ? fs.statSync(dataPath).size : 0
    
    const suspectFiles = [
      'src/app/page.tsx',
      'src/app/layout.tsx',
      'src/lib/animation.ts',
      'data/dishes.json',
      'tailwind.config.js',
      'next.config.js'
    ]
    
    const files = suspectFiles.map(file => {
      const fullPath = path.join(process.cwd(), file)
      return {
        file,
        exists: fs.existsSync(fullPath),
        size: fs.existsSync(fullPath) ? fs.statSync(fullPath).size : 0
      }
    })

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      node: process.version,
      files,
      dataExists: {
        dishes: dataExists,
        dataFileSize
      }
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
