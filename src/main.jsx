import { StrictMode } from 'react'
import React from 'react'
import ReactDom from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { ToastProvider } from './components/toast/ToastProvider.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
)
