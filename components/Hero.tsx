
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[65vh] md:h-[80vh] w-full bg-slate-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://raw.githubusercontent.com/bexatas-create/capas-cursos/main/mateco.png" 
          alt="Destaque" 
          className="w-full h-full object-cover brightness-[0.35]"
        />
        {/* Gradients to blend with background - Education Blue Focus */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-6 md:px-12 pb-24 space-y-6 max-w-3xl">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
            Matemática Premium
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none">
          MATECO <br/>
          <span className="text-blue-500">2024</span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
          Domine a matemática do básico ao avançado com a plataforma líder em aprovação. 
          Metodologia estruturada para o ENEM e os vestibulares mais concorridos do Brasil.
        </p>
        
        <div className="flex flex-wrap gap-4 pt-4">
          <button className="flex items-center space-x-3 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Retomar Estudos</span>
          </button>
          <button className="flex items-center space-x-3 bg-slate-800/80 backdrop-blur text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-700 transition-all border border-slate-700 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span>Ver Programa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
