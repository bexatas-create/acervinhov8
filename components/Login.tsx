
import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isRegistering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      let message = 'Ocorreu um erro. Tente novamente.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está em uso.';
      } else if (err.code === 'auth/weak-password') {
        message = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-[#0F172A]">
      <div 
        className="absolute inset-0 bg-cover bg-center brightness-[0.2] opacity-40 blur-[2px]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop)' }}
      ></div>
      
      <div className="absolute top-10 left-10">
        <span className="text-blue-500 text-3xl font-black tracking-tight uppercase italic">
          Acervinho
        </span>
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-10 md:p-14 rounded-3xl border border-slate-800 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          {isRegistering ? 'Nova Conta' : 'Login'}
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Acesse a melhor plataforma de exatas do país.
        </p>
        
        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/30 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input 
              type="email" 
              placeholder="Email acadêmico" 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isRegistering && (
            <div>
              <input 
                type="password" 
                placeholder="Confirmar Senha" 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Processando...' : (isRegistering ? 'Criar minha conta' : 'Entrar na Plataforma')}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            {isRegistering ? 'Já possui acesso?' : 'Não possui uma conta?'} 
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500 hover:text-blue-400 ml-2 bg-transparent border-none p-0 font-bold transition-colors"
            >
              {isRegistering ? 'Faça login' : 'Começar agora'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
