'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { StaffUser } from '../types';

interface AuthContextType {
  user: StaffUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock authentication for now - replace with real Supabase auth
const MOCK_USERS: (StaffUser & { password: string })[] = [
  {
    id: '1',
    email: 'owner@portsanantonio.com',
    username: 'owner',
    password: 'owner123',
    firstName: 'John',
    lastName: 'Owner',
    role: 'owner',
    department: 'Management',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    id: '2',
    email: 'admin@portsanantonio.com',
    username: 'admin',
    password: 'admin123',
    firstName: 'Sarah',
    lastName: 'Manager',
    role: 'admin',
    department: 'Front Office',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
  },
  {
    id: '3',
    email: 'worker@portsanantonio.com',
    username: 'worker',
    password: 'worker123',
    firstName: 'Mike',
    lastName: 'Server',
    role: 'worker',
    department: 'Service',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '2',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('staff_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('staff_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (mockUser) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      localStorage.setItem('staff_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('staff_user');
  };

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Owner has all permissions
    if (user.role === 'owner') return true;
    
    // Admin permissions
    if (user.role === 'admin') {
      return ![
        'deleteStaff',
        'manageOwners',
        'systemSettings'
      ].includes(permission);
    }
    
    // Worker permissions (limited)
    if (user.role === 'worker') {
      return [
        'viewReservations',
        'createReservations',
        'viewOrders',
        'createOrders',
        'viewOwnData'
      ].includes(permission);
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
