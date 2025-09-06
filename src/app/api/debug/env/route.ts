import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    adminUsername: process.env.ADMIN_USERNAME,
    jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    passwordHashLength: process.env.ADMIN_PASSWORD_HASH?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.startsWith('ADMIN') || key.startsWith('JWT'))
  })
}
