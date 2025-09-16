import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Página simples sem dependências complexas
import EmergencyIndex from './pages/EmergencyIndex'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EmergencyIndex />
  </React.StrictMode>
)
