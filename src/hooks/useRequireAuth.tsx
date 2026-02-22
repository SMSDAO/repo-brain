import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/supabase';

interface UseRequireAuthOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { user, userProfile, loading, hasRole } = useAuth();
  const navigate = useNavigate();
  const { requiredRole, redirectTo = '/login' } = options;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      navigate('/unauthorized', { replace: true });
    }
  }, [user, userProfile, loading, requiredRole, hasRole, navigate, redirectTo]);

  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    hasRequiredRole: requiredRole ? hasRole(requiredRole) : true,
  };
}
