// src/components/auth/ProtectedRouteAdmin.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteAdminProps {
  children: React.ReactNode;
}

const ProtectedRouteAdmin: React.FC<ProtectedRouteAdminProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    // Если не авторизован, редиректим на страницу логина, сохраняя путь, чтобы после логина вернуться
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRouteAdmin;
