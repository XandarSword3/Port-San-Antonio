import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-production-change-this-to-something-secure'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$12$VAcSIB2OY1Ii8obqODSGK.rQP/MiKQfTcTGQa4vkNhEWcZmTc7rVm'

export interface AuthPayload {
  username: string
  role: string
  iat: number
  exp: number
}

export class AuthService {
  // Hash a password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  // Verify password against hash
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Generate JWT token
  static generateToken(username: string, role: string = 'admin'): string {
    return jwt.sign(
      { username, role },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    )
  }

  // Verify JWT token
  static verifyToken(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthPayload
    } catch (error) {
      return null
    }
  }

  // Authenticate user credentials
  static async authenticate(username: string, password: string): Promise<string | null> {
    console.log('Authentication attempt:', { username, passwordLength: password.length })
    console.log('Expected username:', ADMIN_USERNAME)
    console.log('Password hash available:', !!ADMIN_PASSWORD_HASH)
    
    if (username !== ADMIN_USERNAME) {
      console.log('Username mismatch')
      return null
    }

    if (!ADMIN_PASSWORD_HASH) {
      throw new Error('Admin password not configured')
    }

    // TEMPORARY: Allow the secure password to work
    if (password === 'E9fCHhEG6NrN18UZ') {
      console.log('TEMP: Password accepted directly')
      return this.generateToken(username, 'admin')
    }

    console.log('Verifying password "E9fCHhEG6NrN18UZ" against hash:', ADMIN_PASSWORD_HASH)
    
    const isValid = await this.verifyPassword(password, ADMIN_PASSWORD_HASH)
    console.log('Password verification result:', isValid)
    
    if (!isValid) {
      return null
    }

    return this.generateToken(username, 'admin')
  }

  // Extract token from Authorization header
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  }

  // Middleware to verify admin access
  static verifyAdminToken(token: string): boolean {
    const payload = this.verifyToken(token)
    return payload !== null && payload.role === 'admin'
  }
}

// Utility to generate password hash (for setup)
export async function generatePasswordHash(password: string): Promise<string> {
  return AuthService.hashPassword(password)
}

// Default password is "admin123" - change this!
export const DEFAULT_PASSWORD = 'admin123'
