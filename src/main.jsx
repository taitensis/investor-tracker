import { StrictMode } from 'react'
import React from 'react'
import ReactDom from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import '@fontsource/inter'
import App from './App.jsx'
import { ToastProvider } from './components/toast/ToastProvider.jsx'
import { Auth } from '@supabase/auth-ui-react'
import { AuthProvider } from './contexts/AuthContext.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode >
)
