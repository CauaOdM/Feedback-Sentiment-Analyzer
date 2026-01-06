import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Loader } from 'lucide-react';

/**
 * Página de Registro
 * Rota: /register
 * 
 * Permite criar novo gestor/usuário
 * Valida dados e faz login automático após registro
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    companyName: '',
    slug: '',
    nicho: '',
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validações básicas
    if (formData.password.length < 6) {
      setLocalError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setLocalError('Senhas não conferem');
      return;
    }

    if (!formData.slug.match(/^[a-z0-9-]+$/)) {
      setLocalError('Slug deve conter apenas letras minúsculas, números e hífen');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        slug: formData.slug,
        nicho: formData.nicho,
      });
      // Se registro bem-sucedido, vai para dashboard (login automático)
      navigate('/');
    } catch (err) {
      // Erro já capturado pela context
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="bg-emerald-600/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="text-emerald-400" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
          <p className="text-slate-400 mt-2">Comece a gerenciar feedbacks agora</p>
        </div>

        {/* Erro geral */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Erro local */}
        {localError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-400 text-sm">{localError}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Linha 1: Nome + Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                placeholder="João Silva"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-emerald-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/50"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-emerald-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/50"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Linha 2: Senha + Confirmar */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Senha (mín. 6 caracteres)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-emerald-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/50"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-emerald-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/50"
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirm: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Linha 3: Empresa + Slug */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Nome da Empresa
              </label>
              <input
                type="text"
                placeholder="Pizzaria do João"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-emerald-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/50"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Slug (URL única)
              </label>
              <input
                type="text"
                placeholder="pizzaria-do-joao"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-emerald-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/50"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Linha 4: Nicho */}
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">
              Nicho de Negócio (contexto para IA)
            </label>
            <input
              type="text"
              placeholder="Ex: Restaurante Italiano, Clínica Dentária, E-commerce"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:border-emerald-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/50"
              value={formData.nicho}
              onChange={(e) =>
                setFormData({ ...formData, nicho: e.target.value })
              }
              disabled={loading}
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-8"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Criando conta...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Criar Conta
              </>
            )}
          </button>
        </form>

        {/* Link para login */}
        <p className="text-center text-slate-400 text-sm mt-8">
          Já tem conta?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
