import React from 'react';
import { Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PRIMARY_GOALS } from '../data/dimensions';
import type { LeadData } from '../types';

interface WelcomeStepProps {
  lead: LeadData;
  setLead: React.Dispatch<React.SetStateAction<LeadData>>;
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ lead, setLead, onNext }) => {
  return (
    <div id="welcome-step-card" className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 transition-all duration-300">
      <div className="space-y-6">
        {/* Explanation Card */}
        <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#EFE5D5]">
          <h3 className="font-bold text-[#0E1B33] mb-2 flex items-center gap-2 text-base">
            <Compass className="w-5 h-5 text-[#C59B68] shrink-0" /> Como funciona este diagnóstico?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Em vez de uma pontuação fria de 0 a 100, vamos analisar 6 dimensões fundamentais da sua vida financeira: <strong className="text-[#0E1B33]">Renda, Estrutura, Segurança, Patrimônio, Expansão e Liderança</strong>. No final, você receberá um Mapa personalizado com o seu estágio em cada área e a rota exata para o seu próximo nível de prosperidade.
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C59B68]" /> Renda & Geração</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C59B68]" /> Estrutura de Vida</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C59B68]" /> Segurança & Reserva</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C59B68]" /> Patrimônio Líquido</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C59B68]" /> Expansão & Escala</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#C59B68]" /> Decisão & Liderança</div>
          </div>
        </div>

        {/* Primary Goal Selector */}
        <div className="space-y-3">
          <label htmlFor="primary-goal-select" className="block text-sm font-bold text-[#0E1B33]">
            Qual resultado financeiro você mais deseja construir nos próximos anos?
          </label>
          <div className="relative">
            <select 
              id="primary-goal-select"
              value={lead.primaryGoal}
              onChange={(e) => setLead(prev => ({ ...prev, primaryGoal: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B68] focus:border-[#C59B68] bg-white text-slate-800 font-medium transition-all"
            >
              {PRIMARY_GOALS.map((goal) => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          id="btn-start-diagnosis"
          type="button"
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2.5 bg-[#0E1B33] hover:bg-[#182C50] text-[#FFFFFF] font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer border-t border-[#C59B68]/30"
        >
          Iniciar Diagnóstico <ArrowRight className="w-4 h-4 text-[#C59B68]" />
        </button>
      </div>
    </div>
  );
};
