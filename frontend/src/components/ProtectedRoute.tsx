import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente ProtectedRoute
 * Protege rotas que requerem autenticação
 * 
 * Se usuário NÃO está autenticado:
 * - Redireciona para /login
 * 
 * Se está autenticado:
 * - Renderiza o componente
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, renderiza o componente
  return <>{children}</>;
}
