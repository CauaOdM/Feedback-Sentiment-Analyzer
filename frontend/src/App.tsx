import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw, MessageSquare, TrendingUp, Activity, Edit2, Save, Send, X, AlertTriangle, Check, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Feedback {
  id: string;
  customerName: string;
  email: string;
  content: string;
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

function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [sendingId, setSendingId] = useState<string | null>(null);

  const [modal, setModal] = useState<ModalState | null>(null);

  const [sentEmails, setSentEmails] = useState<string[]>(() => {
    const saved = localStorage.getItem('sentEmails');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));
  }, [sentEmails]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/feedbacks');
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Erro ao buscar feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id: string) => {
    setModal({ isOpen: true, type: 'delete', itemId: id });
  };

  const requestEmail = (item: Feedback) => {
    setModal({ isOpen: true, type: 'email', itemId: item.id, emailDestino: item.email });
  };

  const closeModal = () => {
    setModal(null);
  };

  const handleConfirmAction = async () => {
    if (!modal) return;

    // deleta
    if (modal.type === 'delete') {
      try {
        await axios.delete(`http://localhost:3000/feedbacks/${modal.itemId}`);
        setFeedbacks(feedbacks.filter(item => item.id !== modal.itemId));
        closeModal();
      } catch (error) {
        alert('Erro ao deletar.');
      }
    } 
    
    else if (modal.type === 'email') {
      setSendingId(modal.itemId);
      try {
        await axios.post(`http://localhost:3000/feedbacks/${modal.itemId}/reply`);
        
        // Atualiza lista de enviados
        setSentEmails((prev) => [...prev, modal.itemId]);
        
        setModal({ 
          ...modal, 
          type: 'success' 
        });

      } catch (error) {
        console.error(error);
        alert('Erro ao enviar e-mail. Verifique o console.');
        closeModal();
      } finally {
        setSendingId(null);
      }
    }
  };

  const startEditing = (feedback: Feedback) => {
    setEditingId(feedback.id);
    setEditText(feedback.suggestedResponse || '');
  };

  const saveEdit = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/feedbacks/${id}`, { suggestedResponse: editText });
      setFeedbacks(feedbacks.map(item => item.id === id ? { ...item, suggestedResponse: editText } : item));
      setEditingId(null);
      alert('Resposta salva!');
    } catch (error) {
      alert('Erro ao salvar.');
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const chartData = [
    { name: 'Positivo', value: feedbacks.filter(f => f.sentiment === 'POSITIVE').length, color: '#10b981' },
    { name: 'Negativo', value: feedbacks.filter(f => f.sentiment === 'NEGATIVE').length, color: '#ef4444' },
    { name: 'Neutro', value: feedbacks.filter(f => f.sentiment === 'NEUTRAL').length, color: '#64748b' },
    { name: 'Sem Análise', value: feedbacks.filter(f => !['POSITIVE', 'NEGATIVE', 'NEUTRAL'].includes(f.sentiment)).length, color: '#334155' },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans relative">
      
      {/* === MODAL CUSTOMIZADA === */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            
            {/* Ícone Dinâmico */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                modal.type === 'delete' ? 'bg-red-500/20 text-red-500' : 
                modal.type === 'email' ? 'bg-indigo-500/20 text-indigo-500' :
                'bg-emerald-500/20 text-emerald-500' // Cor de Sucesso
              }`}>
                {modal.type === 'delete' && <AlertTriangle size={24} />}
                {modal.type === 'email' && <Send size={24} />}
                {modal.type === 'success' && <CheckCircle size={24} />}
              </div>

              {/* Título Dinâmico */}
              <h3 className="text-xl font-bold text-white">
                {modal.type === 'delete' && 'Excluir Feedback?'}
                {modal.type === 'email' && 'Enviar Resposta?'}
                {modal.type === 'success' && 'E-mail Enviado!'}
              </h3>

              {/* Texto Dinâmico */}
              <p className="text-slate-400 text-sm mt-2">
                {modal.type === 'delete' && 'Essa ação não pode ser desfeita.'}
                {modal.type === 'email' && `Enviar resposta para: ${modal.emailDestino}?`}
                {modal.type === 'success' && `A resposta foi enviada com sucesso para ${modal.emailDestino}.`}
              </p>
            </div>

            <div className="flex gap-3">
              {modal.type === 'success' ? (
                 <button 
                 onClick={closeModal}
                 className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
               >
                 Ótimo, fechar
               </button>
              ) : (
                <>
                  <button onClick={closeModal} className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors">Cancelar</button>
                  <button 
                    onClick={handleConfirmAction}
                    disabled={sendingId !== null}
                    className={`flex-1 px-4 py-2 rounded-lg text-white font-bold transition-colors flex items-center justify-center gap-2 ${
                      modal.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {sendingId ? 'Enviando...' : (modal.type === 'delete' ? 'Sim, Excluir' : 'Sim, Enviar')}
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
              Feedback Intelligence <Activity className="text-indigo-400" />
            </h1>
            <p className="text-slate-400 text-sm mt-1">Painel de controle de satisfação</p>
          </div>
          <button onClick={fetchFeedbacks} disabled={loading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20 font-medium disabled:opacity-50">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} /> {loading ? 'Atualizando...' : 'Atualizar Dados'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-slate-400 mb-2 flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-400" /> Total Recebido
            </h2>
            <p className="text-5xl font-bold text-white tracking-tight">{feedbacks.length}</p>
          </div>
          <div className="md:col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm flex items-center justify-between">
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={40} outerRadius={65} paddingAngle={5} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="middle" align="right" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="hidden md:block w-1/2 pl-6 border-l border-slate-800">
              <h3 className="text-white font-semibold mb-2">Análise de Sentimento</h3>
              <p className="text-sm text-slate-400">Distribuição em tempo real.</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mt-8 border-b border-slate-800 pb-4">Feedbacks Recentes</h2>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((item) => {
            const isSent = sentEmails.includes(item.id);
            return (
              <div key={item.id} className="group relative bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col">
                <button 
                  onClick={() => requestDelete(item.id)}
                  className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>

                <div className="mb-4 pr-8">
                  <h3 className="font-bold text-lg text-white truncate">{item.customerName}</h3>
                  <p className="text-xs text-slate-500 truncate mb-1">{item.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                      item.sentiment === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      item.sentiment === 'NEGATIVE' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {item.sentiment || 'N/A'}
                    </span>
                    {item.actionRequired && <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">🚨 AÇÃO</span>}
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">"{item.content}"</p>

                <div className={`mt-auto rounded-xl p-4 border transition-colors ${editingId === item.id ? 'bg-indigo-900/20 border-indigo-500' : 'bg-indigo-950/30 border-indigo-500/20'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <MessageSquare size={14} /> Sugestão de Resposta
                    </div>
                    {!isSent && (
                      <button onClick={() => editingId === item.id ? setEditingId(null) : startEditing(item)} className="text-indigo-400 hover:text-white transition-colors p-1">
                        {editingId === item.id ? <X size={16} /> : <Edit2 size={16} />}
                      </button>
                    )}
                  </div>

                  {editingId === item.id ? (
                    <div className="animate-in fade-in duration-200">
                      <textarea 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-slate-950 text-indigo-100 text-sm p-3 rounded border border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-28 resize-none mb-3"
                      />
                      <button onClick={() => saveEdit(item.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2">
                        <Save size={14} /> Salvar Alteração
                      </button>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-200">
                      <p className="text-indigo-100/90 text-sm italic leading-snug min-h-[3rem] mb-4">"{item.suggestedResponse || "Sem sugestão."}"</p>
                      
                      <button 
                        onClick={() => requestEmail(item)}
                        disabled={sendingId === item.id || isSent}
                        className={`w-full py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300
                          ${isSent 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                          }
                        `}
                      >
                        {isSent ? <><Check size={14} /> Resposta Enviada</> : (sendingId === item.id ? 'Enviando...' : <><Send size={14} /> Enviar por Email</>)}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {feedbacks.length === 0 && !loading && <div className="text-center py-20 text-slate-500">Nenhum feedback encontrado.</div>}
      </div>
    </div>
  );
}

export default App;