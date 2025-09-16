import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import EmergencyApp from './EmergencyApp'
import './index.css'

// Verificar se Firebase está configurado
const hasFirebaseConfig = () => {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

const AppToRender = hasFirebaseConfig() ? App : EmergencyApp;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppToRender />
  </React.StrictMode>
)
