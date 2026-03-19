import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import DeveloperPage from './pages/DeveloperPage';
import SettingsPage from './pages/SettingsPage';
import DocsPage from './pages/DocsPage';
import OverviewPage from './pages/admin/OverviewPage';
import BrainsPage from './pages/admin/BrainsPage';
import AlertsPage from './pages/admin/AlertsPage';
import AdminSettingsPage from './pages/admin/SettingsPage';
import { useRequireAuth } from './hooks/useRequireAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ 
  children, 
  requireAdmin 
}) => {
  const { loading } = useRequireAuth(requireAdmin ? 'admin' : undefined);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-mono uppercase tracking-widest">Initializing...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requireAdmin>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/developer"
              element={
                <ProtectedRoute>
                  <DeveloperPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/docs"
              element={
                <ProtectedRoute>
                  <DocsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
            <Route
              path="/admin/overview"
              element={
                <ProtectedRoute requireAdmin>
                  <OverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/brains"
              element={
                <ProtectedRoute requireAdmin>
                  <BrainsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alerts"
              element={
                <ProtectedRoute requireAdmin>
                  <AlertsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
