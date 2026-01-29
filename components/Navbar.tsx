
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from '../firebase';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setProfile] = useState<{name: string, emoji: string} | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const profileDoc = await getDoc(doc(db, "profiles", user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as any);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    fetchProfile();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-4 flex items-center justify-between ${
        isScrolled || location.pathname !== '/' ? 'bg-[#0F172A]/95 backdrop-blur-md shadow-lg border-b border-slate-800' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center space-x-10">
        <Link to="/" className="text-blue-500 text-xl md:text-2xl font-black tracking-tighter uppercase italic flex items-center">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md mr-2 not-italic">CF</span>
          Chama o Físico
        </Link>
        <div className="hidden lg:flex space-x-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Link to="/" className="hover:text-blue-400 transition-colors">Conteúdo</Link>
          <Link to="/desempenho" className="hover:text-blue-400 transition-colors">Progresso</Link>
          <a href="#" className="hover:text-blue-400 transition-colors">Materiais</a>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="hidden sm:flex items-center bg-slate-900/50 border border-slate-800 rounded-full px-4 py-1.5 space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plataforma Ativa</span>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-xl hover:ring-2 hover:ring-blue-500 transition-all shadow-lg overflow-hidden border border-slate-700"
          >
            {profile?.emoji || '👤'}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-4 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-3 mb-2 border-b border-slate-800">
                <p className="text-white font-bold text-sm truncate">{profile?.name || 'Estudante'}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Acesso Premium</p>
              </div>
              <Link 
                to="/perfil" 
                className="block px-5 py-2.5 text-sm text-slate-300 hover:bg-blue-600/10 hover:text-blue-400 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                Dados da conta
              </Link>
              <Link 
                to="/desempenho" 
                className="block px-5 py-2.5 text-sm text-slate-300 hover:bg-blue-600/10 hover:text-blue-400 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                Meu progresso
              </Link>
              <div className="h-px bg-slate-800 my-2"></div>
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-5 py-2.5 text-sm text-red-400 font-semibold hover:bg-red-600/10 transition-colors"
              >
                Sair da plataforma
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
