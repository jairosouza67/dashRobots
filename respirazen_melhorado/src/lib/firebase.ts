import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase - RespiraZen1 (Renovado)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-4EDLZWWEGE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (somente em produção e fora de localhost)
export const analytics = (
  typeof window !== 'undefined' &&
  import.meta.env.PROD &&
  window.location.hostname !== 'localhost' &&
  !!firebaseConfig.measurementId
) ? getAnalytics(app) : null;

// Provedor do Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;