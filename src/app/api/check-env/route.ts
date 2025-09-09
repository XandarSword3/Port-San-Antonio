import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
    GITHUB_REPO: process.env.GITHUB_REPO || 'default: XandarSword3/Port-San-Antonio',
    GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'default: main',
    JWT_SECRET: !!process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: !!process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV
  }

  return NextResponse.json({
    environment: envCheck,
    timestamp: new Date().toISOString()
  })
}
