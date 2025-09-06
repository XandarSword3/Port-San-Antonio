import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  AuthService.extractTokenFromHeader(request.headers.get('authorization'))

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = AuthService.verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: {
        username: payload.username,
        role: payload.role
      },
      expiresAt: payload.exp * 1000 // Convert to milliseconds
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
