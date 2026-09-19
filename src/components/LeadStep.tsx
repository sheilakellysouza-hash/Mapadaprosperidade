import React, { useState } from 'react';
import { User, Mail, Phone, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import type { LeadData } from '../types';

interface LeadStepProps {
  lead: LeadData;
  setLead: React.Dispatch<React.SetStateAction<LeadData>>;
  onNext: () => void;
  onBack: () => void;
}

export const LeadStep: React.FC<LeadStepProps> = ({ lead, setLead, onNext, onBack }) => {
  const [error, setError] = useState<string | null>(null);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setLead(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!lead.name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (!lead.email.trim() || !lead.email.includes('@')) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (!lead.phone.trim() || lead.phone.replace(/\D/g, '').length < 10) {
      setError('Por favor, informe um número de WhatsApp com DDD válido.');
      return;
    }

    onNext();
  };

  return (
    <div id="lead-step-card" className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C6934] bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E9D7BC]">
          Passo 1 de 2
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0E1B33] mt-2.5">
          Para quem devemos emitir o seu Mapa?
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Preencha seus dados para receber e liberar o acesso ao diagnóstico completo.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lead-name-input" className="block text-sm font-semibold text-[#0E1B33] mb-1 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#C59B68]" /> Seu Nome Completo
          </label>
          <input 
            id="lead-name-input"
            type="text" 
            required
            placeholder="Ex: Dra. Juliana Mello"
            value={lead.name}
            onChange={(e) => setLead(prev => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B68] focus:border-[#C59B68] bg-white text-slate-800 transition-all"
          />
        </div>

        <div>
          <label htmlFor="lead-email-input" className="block text-sm font-semibold text-[#0E1B33] mb-1 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#C59B68]" /> Seu Melhor E-mail
          </label>
          <input 
            id="lead-email-input"
            type="email" 
            required
            placeholder="seu.email@exemplo.com"
            value={lead.email}
            onChange={(e) => setLead(prev => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B68] focus:border-[#C59B68] bg-white text-slate-800 transition-all"
          />
        </div>

        <div>
          <label htmlFor="lead-phone-input" className="block text-sm font-semibold text-[#0E1B33] mb-1 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-[#C59B68]" /> WhatsApp / Telefone (com DDD)
          </label>
          <input 
            id="lead-phone-input"
            type="tel" 
            required
            placeholder="(71) 99999-9999"
            value={lead.phone}
            onChange={handlePhoneChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B68] focus:border-[#C59B68] bg-white text-slate-800 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-[#C59B68] shrink-0" />
          <span>Seus dados são 100% confidenciais e utilizados apenas para gerar o seu relatório estratégico.</span>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <button
            id="btn-back-to-welcome"
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <button
            id="btn-submit-lead"
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-[#0E1B33] hover:bg-[#182C50] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer border-t border-[#C59B68]/30"
          >
            Acessar Diagnóstico <ArrowRight className="w-4 h-4 text-[#C59B68]" />
          </button>
        </div>
      </form>
    </div>
  );
};
