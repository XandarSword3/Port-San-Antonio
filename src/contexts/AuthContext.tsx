'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token is still valid
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setUserRole(payload.role);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check against the simplified auth system
      const validCredentials = [
        { username: 'worker', password: 'worker123', role: 'worker' },
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'owner', password: 'owner123', role: 'owner' },
        { username: 'admin', password: 'E9fCHhEG6NrN18UZ', role: 'admin' }, // Legacy password
      ];

      const user = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );

      if (user) {
        // Create a simple token
        const token = btoa(JSON.stringify({
          username: user.username,
          role: user.role,
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        }));
        
        localStorage.setItem('adminToken', token);
        setIsLoggedIn(true);
        setUserRole(user.role);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const value: AuthContextType = {
    isLoggedIn,
    userRole,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
