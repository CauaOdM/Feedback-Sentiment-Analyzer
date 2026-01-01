import { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';

export default function ClientPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    content: '',
    categories: [] as string[]
  });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const options = ["Atendimento Lento", "Falta de Empatia", "Informação Confusa", "Preço Alto", "Problema Técnico", "Elogio"];

  const toggleCategory = (option: string) => {
    setFormData(prev => {
      const exists = prev.categories.includes(option);
      return {
        ...prev,
        categories: exists 
          ? prev.categories.filter(c => c !== option)
          : [...prev.categories, option]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING');
    try {
      await axios.post('http://localhost:3000/feedbacks', formData);
      setStatus('SUCCESS');
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-10 rounded-3xl border border-emerald-500/30 text-center max-w-md w-full shadow-2xl">
          <CheckCircle className="mx-auto text-emerald-400 mb-6" size={56} />
          <h2 className="text-3xl font-bold text-white mb-2">Obrigado!</h2>
          <p className="text-slate-400 text-lg">Seu feedback foi recebido com sucesso.</p>
          <button onClick={() => window.location.reload()} className="mt-8 text-indigo-400 hover:text-indigo-300 font-medium">Enviar outro</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">

      <div className="max-w-xl w-full bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl">

        <div className="text-center mb-10 flex flex-col items-center">
          <div className="bg-indigo-600/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
            <MessageSquare className="text-indigo-400" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white">Sua Opinião</h1>
          <p className="text-slate-400 mt-2">Ajude-nos a melhorar nossos serviços.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <input required type="text" placeholder="Seu Nome" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50"
              value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
            
            <input required type="email" placeholder="Seu E-mail" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="space-y-3">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider ml-1">O que podemos melhorar?</label>

            <div className="grid grid-cols-2 gap-3">
              {options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleCategory(opt)}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                    formData.categories.includes(opt) 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-900'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <textarea required rows={4} placeholder="Conte mais detalhes..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none resize-none transition-all focus:ring-1 focus:ring-indigo-500/50"
            value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />

          <button type="submit" disabled={status === 'SENDING'} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all flex justify-center gap-2 text-lg shadow-lg shadow-indigo-900/20 active:scale-[0.98]">
            {status === 'SENDING' ? 'Enviando...' : <><Send size={20} /> Enviar Feedback</>}
          </button>
        </form>
      </div>
    </div>
  );
}