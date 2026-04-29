// components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, initialized } = useAuth();

  useEffect(() => {
    // После инициализации, если нет пользователя - редирект на логин
    if (initialized && !loading && !user) {
      window.location.href = '/login';
    }
  }, [user, loading, initialized]);

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};