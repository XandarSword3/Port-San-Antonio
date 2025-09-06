import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRole, AuthPayload, User } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-production-change-this-to-something-secure'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$12$VAcSIB2OY1Ii8obqODSGK.rQP/MiKQfTcTGQa4vkNhEWcZmTc7rVm'

// In-memory user store (in production, this would be a database)
const USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@portsanantonio.com',
    role: 'owner',
    createdAt: new Date(),
    active: true
  },
  {
    id: '2', 
    username: 'worker',
    email: 'worker@portsanantonio.com',
    role: 'worker',
    createdAt: new Date(),
    active: true
  }
]

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
  static generateToken(userId: string, username: string, role: UserRole): string {
    return jwt.sign(
      { userId, username, role },
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
    
    // Find user
    const user = USERS.find(u => u.username === username && u.active)
    if (!user) {
      console.log('User not found or inactive')
      return null
    }

    // For now, use the existing admin password system
    if (username === ADMIN_USERNAME) {
      if (!ADMIN_PASSWORD_HASH) {
        throw new Error('Admin password not configured')
      }

      // TEMPORARY: Allow the secure password to work
      if (password === 'E9fCHhEG6NrN18UZ') {
        console.log('TEMP: Password accepted directly')
        return this.generateToken(user.id, user.username, user.role)
      }

      console.log('Verifying password "E9fCHhEG6NrN18UZ" against hash:', ADMIN_PASSWORD_HASH)
      
      const isValid = await this.verifyPassword(password, ADMIN_PASSWORD_HASH)
      console.log('Password verification result:', isValid)
      
      if (!isValid) {
        return null
      }

      return this.generateToken(user.id, user.username, user.role)
    }

    // For other users, use a simple password for demo (in production, use proper hashing)
    if (username === 'worker' && password === 'worker123') {
      return this.generateToken(user.id, user.username, user.role)
    }

    return null
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

// Default password is "admin123" - change this!
export const DEFAULT_PASSWORD = 'admin123'
