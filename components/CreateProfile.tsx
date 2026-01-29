
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from '../firebase';

const emojis = ["😀", "😎", "🤓", "🦊", "🐼", "🐯", "🐸", "👽", "🐶", "🐱", "🤖", "👻", "⭐", "🚀"];

const CreateProfile = () => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "profiles", user.uid), {
          name: name.trim(),
          emoji: selectedEmoji,
          createdAt: new Date().toISOString()
        });
        navigate('/');
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center p-4">
      <div className="mb-12">
        <span className="text-red-600 text-4xl font-black italic uppercase tracking-tighter">Acervinho</span>
      </div>

      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-10">Quem está estudando?</h1>
        
        <form onSubmit={handleSave} className="flex flex-col items-center">
          <div className="mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-800 rounded-lg flex items-center justify-center text-7xl md:text-8xl shadow-2xl border-2 border-transparent">
              {selectedEmoji}
            </div>
          </div>

          <input 
            type="text"
            placeholder="Nome do perfil"
            className="w-full max-w-sm bg-[#333] border-none rounded p-4 text-white text-center text-xl mb-8 focus:ring-2 focus:ring-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="mb-10">
            <p className="text-zinc-500 mb-4 text-sm font-bold uppercase tracking-widest">Escolha seu avatar</p>
            <div className="flex flex-wrap justify-center gap-3">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-12 h-12 flex items-center justify-center text-2xl rounded-md transition-all ${selectedEmoji === emoji ? 'bg-zinc-600 scale-125 border-2 border-white' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !name}
            className="bg-red-600 text-white font-bold px-12 py-3 rounded text-xl hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Perfil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
