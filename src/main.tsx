// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@fontsource/inter';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
