import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader } from 'lucide-react';

/**
 * Página de Login
 * Rota: /login
 * 
 * Permite que gestores façam login com email + senha
 * Redireciona para / após sucesso
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await login(formData.email, formData.password);
      // Se login bem-sucedido, redireciona para dashboard
      navigate('/');
    } catch (err) {
      setLocalError('Email ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="bg-indigo-600/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
            <LogIn className="text-indigo-400" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white">Entrar</h1>
          <p className="text-slate-400 mt-2">Gerencie seus feedbacks</p>
        </div>

        {/* Erro geral (da context) */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Erro local (validação) */}
        {localError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-400 text-sm">{localError}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Link para registro */}
        <p className="text-center text-slate-400 text-sm mt-8">
          Não tem conta?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
