import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  pending2FAUser: User | null;
  login: (email: string, role: Role, password?: string, enable2FA?: boolean, customAvatar?: string) => { success: boolean; requires2FA: boolean };
  verify2FACode: (code: string) => boolean;
  cancel2FA: () => void;
  register: (name: string, email: string, role: Role, avatar?: string, extra?: Partial<User>) => { success: boolean };
  quickDemoLogin: (role: Role) => void;
  updateUserAvatar: (avatarUrl: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('st_slas_session_user') || localStorage.getItem('kea_session_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [pending2FAUser, setPending2FAUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('st_slas_session_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('st_slas_session_user');
    }
  }, [user]);

  const login = (email: string, role: Role, _password?: string, enable2FA: boolean = false, customAvatar?: string) => {
    // Find matching demo or synthesize user
    const existingDemo = Object.values(DEMO_USERS).find(u => u.role === role);
    const baseAvatar = customAvatar || existingDemo?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80';
    
    const resolvedUser: User = existingDemo
      ? { ...existingDemo, email: email || existingDemo.email, avatar: customAvatar || existingDemo.avatar }
      : {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email,
          role,
          avatar: baseAvatar,
          district: 'Gatsibo',
          sector: 'Kabarore',
          cell: 'Simbwa',
          village: 'Kibondo',
          emailVerified: true,
          twoFactorEnabled: enable2FA,
        };

    if (enable2FA || resolvedUser.twoFactorEnabled) {
      setPending2FAUser(resolvedUser);
      return { success: true, requires2FA: true };
    }

    setUser(resolvedUser);
    return { success: true, requires2FA: false };
  };

  const verify2FACode = (code: string) => {
    if (code.length === 6 && pending2FAUser) {
      setUser(pending2FAUser);
      setPending2FAUser(null);
      return true;
    }
    return false;
  };

  const cancel2FA = () => {
    setPending2FAUser(null);
  };

  const register = (name: string, email: string, role: Role, avatar?: string, extra?: Partial<User>) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      avatar: avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
      district: 'Gatsibo',
      sector: 'Kabarore',
      cell: 'Simbwa',
      village: 'Kibondo',
      emailVerified: true,
      ...extra,
    };
    setUser(newUser);
    return { success: true };
  };

  const quickDemoLogin = (role: Role) => {
    const demo = DEMO_USERS[role];
    if (demo) {
      setUser(demo);
      setPending2FAUser(null);
    }
  };

  const updateUserAvatar = (avatarUrl: string) => {
    setUser(prev => (prev ? { ...prev, avatar: avatarUrl } : null));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  const logout = () => {
    setUser(null);
    setPending2FAUser(null);
    localStorage.removeItem('st_slas_session_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        pending2FAUser,
        login,
        verify2FACode,
        cancel2FA,
        register,
        quickDemoLogin,
        updateUserAvatar,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
