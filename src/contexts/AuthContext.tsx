import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { AuthContextType, UserProfile, UserProgress, SessionHistory } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Verificar se o Firebase está configurado
const isFirebaseConfigured = () => {
  return import.meta.env.VITE_FIREBASE_API_KEY && 
         import.meta.env.VITE_FIREBASE_API_KEY !== 'your_api_key_here';
};

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
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitorar estado de autenticação
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      // Se Firebase não está configurado, apenas marcar como não carregando
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await loadUserData(user);
      } else {
        setUserProfile(null);
        setUserProgress(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Carregar dados do usuário
  const loadUserData = async (user: User) => {
    try {
      const userProfileRef = doc(db, 'users', user.uid);
      const userProgressRef = doc(db, 'progress', user.uid);

      const [profileSnap, progressSnap] = await Promise.all([
        getDoc(userProfileRef),
        getDoc(userProgressRef)
      ]);

      // Profile
      if (profileSnap.exists()) {
        const profileData = profileSnap.data();
        setUserProfile({
          ...profileData,
          createdAt: profileData.createdAt?.toDate(),
          lastLoginAt: profileData.lastLoginAt?.toDate()
        } as UserProfile);
      } else {
        await createUserProfile(user);
      }

      // Progress
      if (progressSnap.exists()) {
        const progressData = progressSnap.data();
        setUserProgress({
          ...progressData,
          stats: {
            ...progressData.stats,
            lastSessionDate: progressData.stats.lastSessionDate?.toDate()
          },
          history: progressData.history?.map((session: any) => ({
            ...session,
            completedAt: session.completedAt?.toDate()
          })) || []
        } as UserProgress);
      } else {
        await createUserProgress(user.uid);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Criar perfil do usuário
  const createUserProfile = async (user: User) => {
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    });

    setUserProfile(profile);
  };

  // Criar progresso inicial do usuário
  const createUserProgress = async (uid: string) => {
    const progress: UserProgress = {
      uid,
      stats: {
        totalSessions: 0,
        totalMinutes: 0,
        streakDays: 0,
        breathingSessions: 0,
        meditationSessions: 0
      },
      preferences: {
        notifications: true
      },
      history: []
    };

    await setDoc(doc(db, 'progress', uid), progress);
    setUserProgress(progress);
  };

  // Login com email e senha
  const signInWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Registro com email e senha
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar nome do usuário
      await updateProfile(result.user, { displayName });
      
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Login com Google
  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
    }
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Logout
  const signOut = async () => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
    }
    
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error('Erro ao fazer logout');
    }
  };

  // Reset de senha
  const resetPassword = async (email: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase não configurado. Configure suas chaves no arquivo .env');
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Atualizar progresso do usuário
  const updateUserProgress = async (sessionData: Omit<SessionHistory, 'id' | 'completedAt'>) => {
    if (!user) return;
    if (!isFirebaseConfigured()) {
      console.log('Firebase não configurado - progresso salvo apenas localmente');
      return;
    }

    try {
      const progressRef = doc(db, 'progress', user.uid);
      const sessionId = Date.now().toString();
      
      const newSession: SessionHistory = {
        ...sessionData,
        id: sessionId,
        completedAt: new Date()
      };

      // Atualizar estatísticas
      const statsUpdate = {
        [`stats.totalSessions`]: increment(1),
        [`stats.totalMinutes`]: increment(Math.round(sessionData.duration / 60)),
        [`stats.lastSessionDate`]: serverTimestamp()
      };

      if (sessionData.type === 'breathing') {
        statsUpdate[`stats.breathingSessions`] = increment(1);
      } else {
        statsUpdate[`stats.meditationSessions`] = increment(1);
      }

      await updateDoc(progressRef, {
        ...statsUpdate,
        [`history`]: [...(userProgress?.history || []), newSession]
      });

      // Atualizar localStorage para compatibilidade
      const totalSessions = Number(localStorage.getItem('rz_sessions_completed') || '0') + 1;
      localStorage.setItem('rz_sessions_completed', String(totalSessions));
      
      if (sessionData.type === 'breathing') {
        const breathingSessions = Number(localStorage.getItem('rz_breathing_sessions') || '0') + 1;
        localStorage.setItem('rz_breathing_sessions', String(breathingSessions));
      } else {
        const meditationSessions = Number(localStorage.getItem('rz_meditation_sessions') || '0') + 1;
        localStorage.setItem('rz_meditation_sessions', String(meditationSessions));
      }

      // Recarregar dados
      await loadUserData(user);
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
  };

  // Traduzir códigos de erro do Firebase
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'Este email já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca. Use pelo menos 6 caracteres';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde';
      case 'auth/popup-closed-by-user':
        return 'Login cancelado pelo usuário';
      default:
        return 'Erro de autenticação. Tente novamente';
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    userProgress,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    updateUserProgress,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};