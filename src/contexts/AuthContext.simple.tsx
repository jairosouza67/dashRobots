import React, { createContext, useContext, useState } from 'react';

interface SimpleAuthContextType {
  user: any;
  userProfile: any;
  userProgress: any;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProgress: (sessionData: any) => Promise<void>;
}

const AuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

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
  const [user] = useState(null);
  const [userProfile] = useState(null);
  const [userProgress] = useState(null);
  const [loading] = useState(false);

  const signInWithEmail = async (email: string, password: string) => {
    throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
  };

  const signInWithGoogle = async () => {
    throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
  };

  const signOut = async () => {
    throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
  };

  const resetPassword = async (email: string) => {
    throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
  };

  const updateUserProgress = async (sessionData: any) => {
    console.log('Firebase não configurado - progresso salvo apenas localmente');
  };

  const value: SimpleAuthContextType = {
    user,
    userProfile,
    userProgress,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};