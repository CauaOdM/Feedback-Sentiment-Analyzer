import { useEffect, useState } from 'react';
import axios from 'axios';

interface Feedback {
  id: number;
  customerName: string;
  content: string;
  sentiment: string;
  actionRequired: boolean;
}

function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/feedbacks');
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Erro ao buscar feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Dashboard de Feedbacks 🌙
          </h1>
          <button 
            onClick={fetchFeedbacks}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-indigo-500/20"
          >
            Atualizar
          </button>
        </div>

        {/* Listagem (Grid) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((feedback) => (
            <div 
              key={feedback.id} 
              // Mudei aqui: bg-slate-800 (Cinza escuro) e borda sutil
              className={`p-6 rounded-xl shadow-lg border border-slate-700 bg-slate-800 transition-transform hover:-translate-y-1 hover:shadow-xl`}
            >
              {/* Nome */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-100 text-lg truncate">
                  {feedback.customerName}
                </h3>
              </div>

              {/* Texto do Feedback (Cinza claro para leitura) */}
              <p className="text-slate-400 text-sm mb-6 h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
                "{feedback.content}"
              </p>

              {/* Badges de Status (Cores adaptadas para fundo escuro) */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                
                {/* Badge de Sentimento */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                  ${feedback.sentiment === 'POSITIVE' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 
                    feedback.sentiment === 'NEGATIVE' ? 'bg-red-950 text-red-400 border-red-800' : 
                    'bg-slate-700 text-slate-300 border-slate-600'}`
                }>
                  {feedback.sentiment || 'SEM ANALISE'}
                </span>

                {/* Badge de Ação */}
                {feedback.actionRequired && (
                  <span className="flex items-center text-xs font-bold text-red-400 animate-pulse">
                    🚨 AÇÃO
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default App;