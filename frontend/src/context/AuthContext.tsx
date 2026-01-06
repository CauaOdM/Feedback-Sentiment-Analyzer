import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

/**
 * Interface do usuário autenticado
 * Contém informações básicas do gestor
 */
interface User {
  id: string;
  email: string;
  name: string;
  companyName: string;
  slug: string;
  nicho: string;
}

/**
 * Interface do contexto de autenticação
 * Disponibiliza métodos e estado para todo o app
 */
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

/**
 * Dados para registrar novo usuário
 */
interface RegisterData {
  name: string;
  email: string;
  password: string;
  companyName: string;
  slug: string;
  nicho: string;
}

/**
 * Criar contexto de autenticação
 * Inicialmente vazio, será preenchido pelo provider
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de autenticação
 * Envolve todo o app para disponibilizar autenticação
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    // Persiste apenas na sessão (fecha aba = desloga)
    return sessionStorage.getItem('token');
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decodeToken = (rawToken: string) => {
    try {
      return JSON.parse(atob(rawToken.split('.')[1]));
    } catch (err) {
      return null;
    }
  };

  const isTokenValid = (rawToken: string | null) => {
    if (!rawToken) return false;
    const payload = decodeToken(rawToken);
    if (!payload || !payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  };

  const persistToken = (rawToken: string) => {
    sessionStorage.setItem('token', rawToken);
    setToken(rawToken);
  };

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:3000/users/me');
      setUser(res.data);
    } catch (err) {
      // Token inválido ou expirado
      logout();
    }
  };

  /**
   * Configurar interceptor axios para adicionar token em todas as requisições
   * Se token expirar, redireciona para login
   */
  useEffect(() => {
    // Request interceptor: adiciona token no header
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = sessionStorage.getItem('token') || token;
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: captura 401 (token expirado)
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirou, fazer logout
          sessionStorage.removeItem('token');
          setToken(null);
          setUser(null);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Ao montar ou quando o token muda, busca o perfil
  useEffect(() => {
    if (isTokenValid(token)) {
      fetchProfile();
    } else {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Login: validar credenciais e receber JWT
   * @param email - Email do gestor
   * @param password - Senha em texto plano
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const { access_token } = response.data;

      // Salvar token
      persistToken(access_token);

      // Busca perfil completo após login
      await fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register: criar novo gestor/usuário
   * @param userData - Dados do novo usuário
   */
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:3000/auth/register', userData);

      // Após registrar, fazer login automaticamente
      await login(userData.email, userData.password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout: limpar token e dados do usuário
   */
  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  /**
   * Verificar se usuário está autenticado
   * @returns true se há token válido
   */
  const isAuthenticated = (): boolean => {
    const currentToken = token || sessionStorage.getItem('token');
    const valid = isTokenValid(currentToken);
    if (!valid) {
      logout();
      return false;
    }
    return true;
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar autenticação em qualquer componente
 * @returns Contexto de autenticação
 * @throws Se usado fora do AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
