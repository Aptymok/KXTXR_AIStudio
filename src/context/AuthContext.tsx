import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  email: string;
  name: string;
  role: 'OPERATOR' | 'WITNESS' | 'ARCHIVIST';
  avatar?: string;
  sessionToken: string;
  authenticatedAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  signInWithGoogle: (email?: string, name?: string) => Promise<void>;
  signOut: () => void;
  isOperator: boolean;
}

const AUTH_STORAGE_KEY = 'kxtxr_auth_session_v1';

const AuthContext = createContext<AuthContextType>({
  user: null,
  signInWithGoogle: async () => {},
  signOut: () => {},
  isOperator: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const signInWithGoogle = async (
    email = 'kxtxr@systemfriction.org',
    name = 'Edwing · KXTXR Canonical Operator'
  ) => {
    const isCanonical = email.toLowerCase() === 'kxtxr@systemfriction.org';
    const profile: UserProfile = {
      email,
      name,
      role: isCanonical ? 'OPERATOR' : 'WITNESS',
      avatar: isCanonical ? '/assets/system/kxtxr-system-icon.svg' : undefined,
      sessionToken: `sfi_jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      authenticatedAt: new Date().toISOString()
    };

    setUser(profile);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    } catch {}
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signOut,
        isOperator: user?.email.toLowerCase() === 'kxtxr@systemfriction.org'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
