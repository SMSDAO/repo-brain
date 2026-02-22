import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/supabase';

export function useRequireAuth(requiredRole?: UserRole) {
  const { user, userProfile, loading, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, userProfile, loading, requiredRole, hasRole, navigate]);

  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    hasRequiredRole: requiredRole ? hasRole(requiredRole) : true,
  };
}
