
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from '../firebase';
import { progressService } from '../services/progressService';
import Navbar from './Navbar';

// Fix: Added missing CheckIcon component definition
const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const StudentProfile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const profileDoc = await getDoc(doc(db, "profiles", auth.currentUser.uid));
        if (profileDoc.exists()) setProfile(profileDoc.data());
      }
    };
    fetchProfile();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As novas senhas não coincidem.' });
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Senha atual incorreta.' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao atualizar senha. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = async (mode: 'live' | 'recorded') => {
    if (!auth.currentUser) return;
    try {
      await progressService.updateUserPreference(auth.currentUser.uid, mode);
      setProfile({ ...profile, preferredCourseMode: mode });
      setMessage({ type: 'success', text: `Modo de estudo alterado para ${mode === 'live' ? 'Ao Vivo' : 'Gravado'}.` });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navbar />
      <div className="pt-32 px-6 md:px-12 max-w-4xl mx-auto pb-24">
        <h1 className="text-5xl font-extrabold tracking-tight mb-10">Dados do Aluno</h1>
        
        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 space-y-12">
          
          {/* Sessão de Informações Básicas */}
          <div>
            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">E-mail Cadastrado</label>
            <div className="bg-slate-950 p-5 rounded-2xl text-slate-300 font-bold border border-slate-800">
              {auth.currentUser?.email}
            </div>
          </div>

          <div className="h-px bg-slate-800"></div>

          {/* Preferências de Estudo */}
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-4"></span>
              Preferências de Estudo
            </h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">Escolha como a plataforma deve se comportar ao abrir o curso Chama o Físico.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                 onClick={() => handleToggleMode('live')}
                 className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${profile?.preferredCourseMode === 'live' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
               >
                  <div className="flex items-center">
                     <div className={`w-3 h-3 rounded-full mr-3 ${profile?.preferredCourseMode === 'live' ? 'bg-blue-500 animate-pulse' : 'bg-slate-800'}`}></div>
                     <span className="font-bold uppercase tracking-widest text-[11px]">Modo Ao Vivo</span>
                  </div>
                  {profile?.preferredCourseMode === 'live' && <CheckIcon className="text-blue-500" />}
               </button>

               <button 
                 onClick={() => handleToggleMode('recorded')}
                 className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${profile?.preferredCourseMode === 'recorded' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
               >
                  <div className="flex items-center">
                     <div className={`w-3 h-3 rounded-full mr-3 ${profile?.preferredCourseMode === 'recorded' ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
                     <span className="font-bold uppercase tracking-widest text-[11px]">Modo Gravado</span>
                  </div>
                  {profile?.preferredCourseMode === 'recorded' && <CheckIcon className="text-blue-500" />}
               </button>
            </div>
          </div>

          <div className="h-px bg-slate-800"></div>

          {/* Segurança */}
          <div>
            <h2 className="text-xl font-bold mb-8">Segurança e Senha</h2>
            
            {message.text && (
              <div className={`p-5 rounded-2xl mb-10 text-sm font-bold flex items-center shadow-lg animate-in fade-in duration-300 ${message.type === 'success' ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-red-600/20 text-red-400 border border-red-600/30'}`}>
                {message.type === 'success' ? <CheckIcon className="mr-3"/> : null}
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Senha Atual</label>
                <input 
                  type="password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Nova Senha</label>
                <input 
                  type="password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Confirmar Nova Senha</label>
                <input 
                  type="password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white font-black uppercase tracking-[0.2em] px-10 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 mt-4 disabled:opacity-50 active:scale-95 text-xs"
              >
                {loading ? 'Processando...' : 'Salvar Alterações'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
