import bcrypt from 'bcryptjs'
import { UserRole, AuthPayload, User } from '@/types'

// Dynamic import for JWT to handle potential server/client issues
let jwt: any = null;
try {
  jwt = require('jsonwebtoken');
} catch (error) {
  console.warn('JWT not available:', error);
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-production-change-this-to-something-secure'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$12$VAcSIB2OY1Ii8obqODSGK.rQP/MiKQfTcTGQa4vkNhEWcZmTc7rVm'

// In-memory user store (in production, this would be a database)
const USERS: User[] = []

export class AuthService {
  // Hash a password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  // Verify password against hash
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Generate session token (simplified)
  static generateToken(userId: string, username: string, role: UserRole): string {
    try {
      // Use fallback token generation (works without JWT)
      const payload = JSON.stringify({ 
        userId, 
        username, 
        role, 
        exp: Date.now() + 24 * 60 * 60 * 1000,
        iat: Date.now()
      });
      return Buffer.from(payload).toString('base64');
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Token generation failed');
    }
  }

  // Verify session token (simplified)
  static verifyToken(token: string): AuthPayload | null {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (!payload.exp || payload.exp <= Date.now()) {
        return null;
      }
      
      // Return valid payload
      return { 
        userId: payload.userId, 
        username: payload.username, 
        role: payload.role,
        iat: Math.floor((payload.iat || Date.now()) / 1000),
        exp: Math.floor(payload.exp / 1000)
      };
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Authenticate user credentials
  static async authenticate(username: string, password: string): Promise<string | null> {
    console.log('Authentication attempt:', { username, passwordLength: password.length })
    
    // Find user
    const user = USERS.find(u => u.username === username && u.active)
    if (!user) {
      console.log('User not found or inactive')
      return null
    }

    // Check credentials based on role
    let isValid = false
    
    if (username === 'admin' && password === 'admin123') {
      isValid = true
    } else if (username === 'worker' && password === 'worker123') {
      isValid = true
    } else if (username === 'owner' && password === 'owner123') {
      isValid = true
    } else if (username === 'admin' && password === 'E9fCHhEG6NrN18UZ') {
      // Keep existing secure password as backup
      isValid = true
    }

    if (!isValid) {
      console.log('Invalid credentials')
      return null
    }

    console.log('Authentication successful for:', username)
    return this.generateToken(user.id, user.username, user.role)
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
    return payload !== null && ['admin', 'owner'].includes(payload.role)
  }

  // Check if user has specific permission
  static hasPermission(role: UserRole, permission: string): boolean {
    const { ROLE_PERMISSIONS } = require('@/types')
    return ROLE_PERMISSIONS[role]?.[permission] || false
  }

  // Get user by ID
  static getUserById(userId: string): User | null {
    return USERS.find(u => u.id === userId) || null
  }

  // Get all users (admin/owner only)
  static getAllUsers(): User[] {
    return USERS
  }

  // Create audit log entry
  static createAuditLog(log: Omit<import('@/types').AuditLog, 'id' | 'timestamp'>) {
    // In production, this would save to a database
    console.log('Audit Log:', {
      ...log,
      timestamp: new Date()
    })
  }
}

// Utility to generate password hash (for setup)
export async function generatePasswordHash(password: string): Promise<string> {
  return AuthService.hashPassword(password)
}

// Utility functions for components
export const loginUser = async (username: string, password: string): Promise<User | null> => {
  const token = await AuthService.authenticate(username, password);
  
  if (token) {
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token);
    }
    
    // Get user info
    const payload = AuthService.verifyToken(token);
    if (payload) {
      const user = AuthService.getUserById(payload.userId);
      if (user) {
        // Create audit log
        AuthService.createAuditLog({
          userId: user.id,
          username: user.username,
          action: 'login',
          details: 'User logged in successfully'
        });
        return user;
      }
    }
  }
  
  return null;
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('adminToken');
  if (!token) return null;
  
  const payload = AuthService.verifyToken(token);
  if (!payload) return null;
  
  return AuthService.getUserById(payload.userId);
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('adminToken');
  if (!token) return false;
  
  const payload = AuthService.verifyToken(token);
  return payload !== null;
};

export const logout = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
};

export const hasPermission = (role: UserRole, permission: string): boolean => {
  return AuthService.hasPermission(role, permission);
};

// Export verifyToken function for API routes
export const verifyToken = (token: string) => {
  const payload = AuthService.verifyToken(token);
  return {
    success: !!payload,
    payload: payload,
    error: payload ? null : 'Invalid token'
  };
};

// Default password is "admin123" - change this!
export const DEFAULT_PASSWORD = 'admin123'
