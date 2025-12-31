import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw, MessageSquare, TrendingUp, Activity, Edit2, Save, Send, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Feedback {
  id: string;
  customerName: string;
  email: string; // Adicionado: Precisamos saber o email para enviar
  content: string;
  sentiment: string;
  actionRequired: boolean;
  suggestedResponse?: string;
}

function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  // === NOVOS ESTADOS PARA EDIÇÃO E ENVIO ===
  const [editingId, setEditingId] = useState<string | null>(null); // Qual ID estou editando?
  const [editText, setEditText] = useState(''); // O texto que estou digitando
  const [sendingId, setSendingId] = useState<string | null>(null); // Qual ID está enviando email?

  // 1. Busca dados no Backend
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

  // 2. Função de Deletar
  const deleteFeedback = async (id: string) => {
    if (!confirm('Tem certeza que quer apagar esse feedback?')) return;
    
    try {
      await axios.delete(`http://localhost:3000/feedbacks/${id}`);
      setFeedbacks(feedbacks.filter(item => item.id !== id));
    } catch (error) {
      alert('Erro ao deletar. Verifique se o backend está rodando.');
      console.error(error);
    }
  };

  // 3. Iniciar Edição (Clica no Lápis)
  const startEditing = (feedback: Feedback) => {
    setEditingId(feedback.id);
    setEditText(feedback.suggestedResponse || ''); // Puxa o texto atual para o input
  };

  // 4. Salvar Edição (PATCH)
  const saveEdit = async (id: string) => {
    try {
      // Manda pro backend atualizar
      await axios.patch(`http://localhost:3000/feedbacks/${id}`, {
        suggestedResponse: editText
      });
      
      // Atualiza a lista visualmente sem recarregar tudo
      setFeedbacks(feedbacks.map(item => 
        item.id === id ? { ...item, suggestedResponse: editText } : item
      ));
      
      setEditingId(null); // Fecha o modo edição
      alert('Resposta atualizada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar edição.');
    }
  };

  // 5. Enviar Email (POST)
  const sendEmail = async (feedback: Feedback) => {
    if (!confirm(`Enviar resposta para ${feedback.email}?`)) return;
    
    setSendingId(feedback.id); // Ativa o loading só nesse botão
    try {
      await axios.post(`http://localhost:3000/feedbacks/${feedback.id}/reply`);
      alert('E-mail enviado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar e-mail.');
    } finally {
      setSendingId(null); // Para o loading
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  // Dados para o Gráfico
  const chartData = [
    { name: 'Positivo', value: feedbacks.filter(f => f.sentiment === 'POSITIVE').length, color: '#10b981' },
    { name: 'Negativo', value: feedbacks.filter(f => f.sentiment === 'NEGATIVE').length, color: '#ef4444' },
    { name: 'Neutro', value: feedbacks.filter(f => f.sentiment === 'NEUTRAL').length, color: '#64748b' },
    { name: 'Sem Análise', value: feedbacks.filter(f => !['POSITIVE', 'NEGATIVE', 'NEUTRAL'].includes(f.sentiment)).length, color: '#334155' },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              Feedback Intelligence <Activity className="text-indigo-400" />
            </h1>
            <p className="text-slate-400 text-sm mt-1">Painel de controle de satisfação do cliente com IA</p>
          </div>
          
          <button 
            onClick={fetchFeedbacks} 
            disabled={loading} 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Atualizando...' : 'Atualizar Dados'}
          </button>
        </div>

        {/* === AREA DE MÉTRICAS === */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-slate-400 mb-2 flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-400" /> Total Recebido
            </h2>
            <p className="text-5xl font-bold text-white tracking-tight">{feedbacks.length}</p>
            <p className="text-xs text-slate-500 mt-2">Feedbacks processados pelo Gemini</p>
          </div>

          <div className="md:col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm flex items-center justify-between">
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={40} outerRadius={65} paddingAngle={5} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="middle" align="right" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="hidden md:block w-1/2 pl-6 border-l border-slate-800">
              <h3 className="text-white font-semibold mb-2">Análise de Sentimento</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Visualização em tempo real da distribuição de humor dos seus clientes baseada na análise semântica.
              </p>
            </div>
          </div>
        </div>

        {/* === LISTAGEM DE CARDS === */}
        <h2 className="text-xl font-bold text-white mt-8 border-b border-slate-800 pb-4">
          Feedbacks Recentes
        </h2>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col"
            >
              
              <button 
                onClick={() => deleteFeedback(item.id)}
                className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Deletar Feedback"
              >
                <Trash2 size={18} />
              </button>

              <div className="mb-4 pr-8">
                <h3 className="font-bold text-lg text-white truncate">{item.customerName}</h3>
                {/* Mostra o email embaixo do nome */}
                <p className="text-xs text-slate-500 truncate mb-1">{item.email}</p>
                
                <div className="flex gap-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${
                    item.sentiment === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    item.sentiment === 'NEGATIVE' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {item.sentiment || 'SEM ANÁLISE'}
                  </span>
                  
                  {item.actionRequired && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                      🚨 AÇÃO
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                "{item.content}"
              </p>

              {/* === ÁREA DA RESPOSTA INTELIGENTE (AGORA INTERATIVA) === */}
              <div className={`mt-auto rounded-xl p-4 border transition-colors ${editingId === item.id ? 'bg-indigo-900/20 border-indigo-500' : 'bg-indigo-950/30 border-indigo-500/20'}`}>
                
                {/* Cabeçalho da caixinha roxa */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <MessageSquare size={14} /> Sugestão de Resposta
                  </div>
                  
                  {/* Botão Lápis / Fechar */}
                  <button 
                    onClick={() => editingId === item.id ? setEditingId(null) : startEditing(item)} 
                    className="text-indigo-400 hover:text-white transition-colors p-1"
                    title={editingId === item.id ? "Cancelar Edição" : "Editar Resposta"}
                  >
                    {editingId === item.id ? <X size={16} /> : <Edit2 size={16} />}
                  </button>
                </div>

                {/* LÓGICA: Se editando, mostra TEXTAREA. Se não, mostra TEXTO. */}
                {editingId === item.id ? (
                  // MODO EDIÇÃO
                  <div className="animate-in fade-in duration-200">
                    <textarea 
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-slate-950 text-indigo-100 text-sm p-3 rounded border border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-28 resize-none mb-3"
                    />
                    <button 
                      onClick={() => saveEdit(item.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Save size={14} /> Salvar Alteração
                    </button>
                  </div>
                ) : (
                  // MODO LEITURA
                  <div className="animate-in fade-in duration-200">
                    <p className="text-indigo-100/90 text-sm italic leading-snug min-h-[3rem] mb-4">
                      "{item.suggestedResponse || "Sem sugestão disponível."}"
                    </p>
                    <button 
                      onClick={() => sendEmail(item)}
                      disabled={sendingId === item.id}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingId === item.id ? 'Enviando...' : <><Send size={14} /> Enviar por Email</>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {feedbacks.length === 0 && !loading && (
          <div className="text-center py-20 text-slate-500">
            Nenhum feedback encontrado. Crie um novo no Thunder Client!
          </div>
        )}

      </div>
    </div>
  );
}

export default App;