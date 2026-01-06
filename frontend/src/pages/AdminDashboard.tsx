import { useEffect, useState, useMemo } from 'react'; 
import axios from 'axios';
import { Trash2, RefreshCw, MessageSquare, TrendingUp, Activity, Edit2, Save, Send, X, AlertTriangle, Check, CheckCircle, ListFilter } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

/**
 * Painel administrativo de feedbacks
 * Rota: /
 * 
 * Funcionalidades:
 * - Listagem de feedbacks em cards
 * - Gráfico de distribuição de sentimentos
 * - Ranking das top 5 categorias mencionadas
 * - Edição de respostas sugeridas pela IA
 * - Envio de emails aos clientes
 * - Modal para confirmações de ações
 * - Persistência de emails já enviados (localStorage)
 */

interface Feedback {
  id: string;
  customerName: string;
  email: string;
  content: string;
  categories: string[];
  sentiment: string;
  actionRequired: boolean;
  suggestedResponse?: string;
}

interface ModalState {
  isOpen: boolean;
  type: 'delete' | 'email' | 'success';
  itemId: string;
  emailDestino?: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [copied, setCopied] = useState(false);

  const evaluationLink = useMemo(() => {
    if (!user?.slug) return null;
    return `${window.location.origin}/avaliar/${user.slug}`;
  }, [user?.slug]);

  const [sentEmails, setSentEmails] = useState<string[]>(() => {
    const saved = localStorage.getItem('sentEmails');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
  }, [sentEmails]);

  const ranking = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    feedbacks.forEach(f => {
      if (f.categories && Array.isArray(f.categories)) {
        f.categories.forEach(cat => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
      }
    });
    return Object.entries(categoryCount).sort(([, a], [, b]) => b - a).slice(0, 5);
  }, [feedbacks]);

  /**
   * Busca todos os feedbacks do backend
   * Realiza uma requisição GET para listar feedbacks da base de dados
   * Atualiza estado de carregamento durante a operação
   */
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/feedbacks`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Erro ao buscar feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id: string) => { setModal({ isOpen: true, type: 'delete', itemId: id }); };
  /**
   * Abre modal de confirmação para envio de email
   * @param item - Feedback para o qual será enviado o email
   */
  const requestEmail = (item: Feedback) => { setModal({ isOpen: true, type: 'email', itemId: item.id, emailDestino: item.email }); };
  
  /**
   * Fecha o modal atual
   */
  const closeModal = () => { setModal(null); };

  /**
   * Processa a confirmação de ações do modal (deleção ou envio de email)
   * Para delete: remove o feedback da API e da lista
   * Para email: envia a resposta sugerida ao cliente e marca como enviado
   */
  const handleConfirmAction = async () => {
    if (!modal) return;
    if (modal.type === 'delete') {
      try {
        await axios.delete(`${API_URL}/feedbacks/${modal.itemId}`);
        setFeedbacks(feedbacks.filter(item => item.id !== modal.itemId));
        closeModal();
      } catch (error) { alert('Erro ao deletar.'); }
    } 
    else if (modal.type === 'email') {
      setSendingId(modal.itemId);
      try {
        await axios.post(`${API_URL}/feedbacks/${modal.itemId}/reply`);
        setSentEmails((prev) => [...prev, modal.itemId]);
        setModal({ ...modal, type: 'success' });
      } catch (error) { console.error(error); alert('Erro ao enviar.'); closeModal(); } finally { setSendingId(null); }
    }
  };

  /**
   * Inicia modo de edição para a resposta sugerida de um feedback
   * @param feedback - Feedback a ser editado
   */
  const startEditing = (feedback: Feedback) => { setEditingId(feedback.id); setEditText(feedback.suggestedResponse || ''); };
  
  /**
   * Salva a resposta sugerida editada no backend
   * @param id - ID do feedback a ser atualizado
   */
  const saveEdit = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/feedbacks/${id}`, { suggestedResponse: editText });
      setFeedbacks(feedbacks.map(item => item.id === id ? { ...item, suggestedResponse: editText } : item));
      setEditingId(null);
    } catch (error) { alert('Erro ao salvar.'); }
  };

  useEffect(() => {
    if (user) {
      fetchFeedbacks();
    }
  }, [user]);

  const chartData = [
    { name: 'Positivo', value: feedbacks.filter(f => f.sentiment === 'POSITIVE').length, color: '#10b981' },
    { name: 'Negativo', value: feedbacks.filter(f => f.sentiment === 'NEGATIVE').length, color: '#ef4444' },
    { name: 'Neutro', value: feedbacks.filter(f => f.sentiment === 'NEUTRAL').length, color: '#64748b' },
    { name: 'Sem Análise', value: feedbacks.filter(f => !['POSITIVE', 'NEGATIVE', 'NEUTRAL'].includes(f.sentiment)).length, color: '#334155' },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans relative">
      
    {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                modal.type === 'delete' ? 'bg-red-500/20 text-red-500' : 
                modal.type === 'email' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-emerald-500/20 text-emerald-500'
              }`}>
                {modal.type === 'delete' && <AlertTriangle size={24} />}
                {modal.type === 'email' && <Send size={24} />}
                {modal.type === 'success' && <CheckCircle size={24} />}
              </div>
              <h3 className="text-xl font-bold text-white">
                {modal.type === 'delete' ? 'Excluir?' : modal.type === 'email' ? 'Enviar?' : 'Enviado!'}
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                {modal.type === 'delete' ? 'Essa ação é irreversível.' : modal.type === 'email' ? `Para: ${modal.emailDestino}` : 'Resposta enviada com sucesso.'}
              </p>
            </div>
            <div className="flex gap-3">
              {modal.type === 'success' ? (
                 <button onClick={closeModal} className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Fechar</button>
              ) : (
                <>
                  <button onClick={closeModal} className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium">Cancelar</button>
                  <button onClick={handleConfirmAction} disabled={sendingId !== null} className={`flex-1 px-4 py-2 rounded-lg text-white font-bold flex items-center justify-center gap-2 ${modal.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                    {sendingId ? 'Enviando...' : 'Confirmar'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              {user?.companyName || 'Painel de Gestão'} <Activity className="text-indigo-400" />
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {user ? `Olá, ${user.name || 'Gestor'} — ${user.nicho || 'seu negócio'}` : 'Gerencie feedbacks com IA'}
            </p>
          </div>
          <button onClick={fetchFeedbacks} disabled={loading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg transition-all font-medium disabled:opacity-50">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} /> {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {evaluationLink && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-semibold">Link de Avaliação</p>
              <p className="text-sm text-slate-200 mt-1">Envie para clientes avaliarem seu estabelecimento</p>
            </div>
            <div className="flex flex-1 gap-2 items-center">
              <input
                readOnly
                value={evaluationLink}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 select-all"
              />
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(evaluationLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        )}

        {/* Totais */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold text-slate-400 mb-1 flex items-center gap-2"><TrendingUp size={18} className="text-cyan-400" /> Total Recebido</h2>
                <p className="text-4xl font-bold text-white tracking-tight">{feedbacks.length}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-500">Última atualização:</p>
                <p className="text-sm text-slate-300">{new Date().toLocaleTimeString()}</p>
            </div>
        </div>

        {/* Gráfico + Ranking */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-center">
             <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={chartData} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={60} 
                            outerRadius={80} 
                            paddingAngle={5} 
                            dataKey="value" 
                            stroke="none"
                        >
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Ranking */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><ListFilter size={18} className="text-indigo-400" /> Top Motivos</h2>
            <div className="space-y-3">
              {ranking.length === 0 ? <p className="text-slate-500 text-sm">Sem dados suficientes.</p> : ranking.map(([cat, count], index) => (
                <div key={cat} className="flex justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 transition-colors">
                  <div className="flex gap-3 items-center">
                    <span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">#{index + 1}</span>
                    <span className="text-sm text-slate-200 font-medium">{cat}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-400">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mt-8 border-b border-slate-800 pb-4">Feedbacks Recentes</h2>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((item) => {
            const isSent = sentEmails.includes(item.id);
            return (
              <div key={item.id} className="group relative bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-2xl flex flex-col">
                <button onClick={() => requestDelete(item.id)} className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>

                <div className="mb-4 pr-8">
                  <h3 className="font-bold text-lg text-white truncate">{item.customerName}</h3>
                  <p className="text-xs text-slate-500 truncate mb-2">{item.email}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.categories && item.categories.map(cat => (
                      <span key={cat} className="px-2 py-1 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-medium">{cat}</span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${item.sentiment === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : item.sentiment === 'NEGATIVE' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{item.sentiment}</span>
                     {item.actionRequired && <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">🚨 AÇÃO</span>}
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">"{item.content}"</p>

                <div className={`mt-auto rounded-xl p-4 border transition-colors ${editingId === item.id ? 'bg-indigo-900/20 border-indigo-500' : 'bg-indigo-950/30 border-indigo-500/20'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider"><MessageSquare size={14} /> Sugestão IA</div>
                    {!isSent && <button onClick={() => editingId === item.id ? setEditingId(null) : startEditing(item)} className="text-indigo-400 hover:text-white p-1">{editingId === item.id ? <X size={16} /> : <Edit2 size={16} />}</button>}
                  </div>
                  {editingId === item.id ? (
                    <div>
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-slate-950 text-indigo-100 text-sm p-3 rounded-lg border border-indigo-500/50 mb-3 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      <button onClick={() => saveEdit(item.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold flex justify-center gap-2"><Save size={14} /> Salvar</button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-indigo-100/90 text-sm italic mb-4">"{item.suggestedResponse || "Sem sugestão."}"</p>
                      <button onClick={() => requestEmail(item)} disabled={sendingId === item.id || isSent} className={`w-full py-2 rounded-lg text-xs font-bold flex justify-center gap-2 transition-all ${isSent ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>{isSent ? <><Check size={14} /> Enviada</> : sendingId === item.id ? 'Enviando...' : <><Send size={14} /> Enviar</>}</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}