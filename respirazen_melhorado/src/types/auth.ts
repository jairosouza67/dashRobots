import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserProgress {
  uid: string;
  stats: {
    totalSessions: number;
    totalMinutes: number;
    streakDays: number;
    lastSessionDate?: Date;
    breathingSessions: number;
    meditationSessions: number;
  };
  preferences: {
    favoriteBreathingPattern?: string;
    preferredSessionLength?: number;
    notifications: boolean;
  };
  history: SessionHistory[];
}

export interface SessionHistory {
  id: string;
  type: 'breathing' | 'meditation';
  duration: number; // em segundos
  completedAt: Date;
  sessionId: string;
  customAudio?: {
    type: 'youtube' | 'mp3' | 'none';
    url: string;
  };
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userProgress: UserProgress | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProgress: (sessionData: Omit<SessionHistory, 'id' | 'completedAt'>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}