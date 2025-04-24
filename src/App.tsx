// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/contexts/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';

import MainLayout from '@/layouts/MainLayout';
import LoginPage from '@/pages/LoginPage';
import HomepagePage from '@/pages/HomepagePage';
import DashboardPage from '@/pages/DashboardPage';
import PortfolioPage from '@/pages/PortfolioPage';
import PositionPage from '@/pages/PositionPage';
import SettingsPage from '@/pages/SettingsPage';
import DividendPage from '@/pages/DividendPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="homepage" replace />} />
            <Route path="homepage" element={<HomepagePage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="position" element={<PositionPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="dividend" element={<DividendPage />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
