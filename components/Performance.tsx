
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { auth } from '../firebase';
import { progressService } from '../services/progressService';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color} shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
    <p className="text-4xl font-extrabold text-white">{value}</p>
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-bl-full -mr-8 -mt-8"></div>
  </div>
);

const Performance = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (auth.currentUser) {
        const s = await progressService.getStudentStats(auth.currentUser.uid);
        setStats(s);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Cursos Ativos", 
      value: stats?.coursesCount.toString() || "0", 
      color: "bg-blue-600",
      icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    },
    { 
      label: "Aulas Concluídas", 
      value: stats?.totalWatched.toString() || "0", 
      color: "bg-blue-400",
      icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      label: "Carga Horária", 
      value: stats?.studyTime || "0h", 
      color: "bg-slate-700",
      icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      label: "Nível de Engajamento", 
      value: "Elite", 
      color: "bg-indigo-600",
      icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />
      <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-14">
          <h1 className="text-5xl font-extrabold tracking-tight mb-3">Painel de Desempenho</h1>
          <p className="text-slate-400 text-lg">Métricas e estatísticas sincronizadas em tempo real.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <div className="lg:col-span-2 bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <span className="w-2 h-6 bg-blue-600 rounded-full mr-4"></span>
              Histórico de Evolução
            </h2>
            <div className="text-slate-600 text-sm text-center py-20 border-2 border-slate-800 border-dashed rounded-3xl">
               <p className="uppercase font-black tracking-widest text-[10px] mb-2">Dados Analíticos</p>
               <p className="text-slate-500 font-medium">O gráfico de evolução pedagógica será exibido conforme você completa os simulados.</p>
            </div>
          </div>
          
          <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8">Conquistas</h2>
            <div className="space-y-6">
              {[
                { title: 'Primeiros Passos', desc: 'Assistiu 10 aulas', icon: '🎯', status: 'completed' },
                { title: 'Maratona Acadêmica', desc: '5 horas de estudo seguidas', icon: '🏃', status: 'pending' },
                { title: 'Mestre das Exatas', desc: 'Concluiu um curso de Física', icon: '🧬', status: 'pending' },
              ].map((badge, i) => (
                <div key={i} className={`flex items-center p-4 rounded-2xl border ${badge.status === 'completed' ? 'bg-blue-600/10 border-blue-500/20' : 'bg-slate-800/40 border-slate-800'}`}>
                  <div className="text-2xl mr-4">{badge.icon}</div>
                  <div>
                    <h4 className={`text-sm font-bold ${badge.status === 'completed' ? 'text-white' : 'text-slate-500'}`}>{badge.title}</h4>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
