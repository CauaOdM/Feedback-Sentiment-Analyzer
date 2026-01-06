import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ClientPage from './pages/ClientPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Componente raiz da aplicação
 * 
 * Configuração de rotas:
 * - "/login" → LoginPage (fazer login)
 * - "/register" → RegisterPage (criar conta)
 * - "/" → AdminDashboard (protegido - requer autenticação)
 * - "/avaliar" → ClientPage (público - clientes enviam feedback anonimamente)
 * - "/avaliar/:slug" → ClientPage (formulário de avaliação de clientes por empresa)
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/avaliar/:slug" element={<ClientPage />} />

        {/* Rotas protegidas (requer login) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}