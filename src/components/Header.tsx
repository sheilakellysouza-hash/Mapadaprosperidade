import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  isAdminView?: boolean;
  onToggleAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isAdminView = false, onToggleAdmin }) => {
  return (
    <header className="text-center mb-8 sm:mb-10 relative">
      {/* Return button ONLY if already in admin mode */}
      {isAdminView && onToggleAdmin && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={onToggleAdmin}
            id="btn-header-exit-admin"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#0E1B33] bg-white border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C59B68]" />
            <span>Voltar ao Diagnóstico Público</span>
          </button>
        </div>
      )}

      {/* Inspirar Finanças Official Brand Banner */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 mb-5 max-w-lg mx-auto px-2 select-none">
        {/* Gold metallic gradient accent bar */}
        <div className="flex-1 h-[2.5px] rounded-full bg-gradient-to-r from-transparent via-[#C59B68] to-[#9E7848] opacity-90" />
        
        {/* Brand Name in Navy Italic with tracking */}
        <div className="shrink-0 flex flex-col items-center cursor-default">
          <span className="font-serif sm:font-sans text-base sm:text-lg font-bold tracking-[0.22em] text-[#0E1B33] uppercase italic">
            INSPIRAR FINANÇAS
          </span>
        </div>
        
        {/* Soft gold accent end cap */}
        <div className="w-8 sm:w-12 h-[2.5px] rounded-full bg-gradient-to-r from-[#9E7848] to-transparent opacity-70 hidden sm:block" />
      </div>

      {/* Método MIL Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6EE] text-[#8C6934] border border-[#E9D7BC] text-xs font-bold tracking-wide shadow-xs mb-3.5">
        <Sparkles className="w-3.5 h-3.5 text-[#C59B68]" /> 
        <span>Método MIL — Inspirar Finanças</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0E1B33]">
        Mapa da Prosperidade
      </h1>
      
      <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
        O que a sua renda está construindo? Descubra o raio-x real do seu momento financeiro e o caminho para o seu próximo nível.
      </p>

      {/* Decorative Gold Accent Underline */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        <div className="w-8 h-[2px] bg-[#C59B68]/30 rounded-full" />
        <div className="w-12 h-[2.5px] bg-[#C59B68] rounded-full" />
        <div className="w-8 h-[2px] bg-[#C59B68]/30 rounded-full" />
      </div>
    </header>
  );
};
