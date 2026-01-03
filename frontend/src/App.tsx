import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ClientPage from './pages/ClientPage';

/**
 * Componente raiz da aplicação
 * 
 * Configuração de rotas:
 * - "/" → AdminDashboard (painel de gestão de feedbacks)
 * - "/avaliar" → ClientPage (formulário de avaliação de clientes)
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/avaliar" element={<ClientPage />} />
      </Routes>
    </BrowserRouter>
  );
}