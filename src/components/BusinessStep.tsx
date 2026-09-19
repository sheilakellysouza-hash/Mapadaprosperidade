import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Building2, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BUSINESS_QUESTIONS } from '../data/dimensions';
import type { BusinessChoice } from '../types';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface BusinessStepProps {
  businessChoice: BusinessChoice;
  setBusinessChoice: (choice: BusinessChoice) => void;
  businessAns: Record<number, string>;
  setBusinessAns: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onBack: () => void;
  onGenerateReport: () => void;
}

export const BusinessStep: React.FC<BusinessStepProps> = ({
  businessChoice,
  setBusinessChoice,
  businessAns,
  setBusinessAns,
  onBack,
  onGenerateReport,
}) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const handleChoose = (choice: 'yes' | 'no') => {
    setWarningMessage(null);
    setBusinessChoice(choice);
  };

  const handleGenerate = () => {
    if (businessChoice === null) {
      setWarningMessage('Por favor, selecione se você possui ou não CNPJ / atividade autônoma antes de continuar.');
      return;
    }

    if (businessChoice === 'yes') {
      const allAnswered = BUSINESS_QUESTIONS.every((_, idx) => businessAns[idx] !== undefined);
      if (!allAnswered) {
        setWarningMessage('Por favor, responda às 6 perguntas da sua atividade empresarial para um diagnóstico completo.');
        return;
      }
    }

    setWarningMessage(null);
    onGenerateReport();
  };

  return (
    <div id="business-step-card" className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C6934] bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E9D7BC] inline-flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#C59B68]" /> Módulo Empresarial (CPF ⇄ CNPJ)
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0E1B33] mt-2.5">
          Você possui CNPJ ou atua profissionalmente como autônomo / liberal?
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          A relação entre a sua empresa e as finanças da sua casa é um dos pilares mais importantes do Método MIL.
        </p>
      </div>

      {warningMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{warningMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Two prominent, explicit choices: SIM and NÃO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card SIM */}
          <button
            type="button"
            id="btn-choose-cnpj-yes"
            onClick={() => handleChoose('yes')}
            className={cn(
              "text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer",
              businessChoice === 'yes'
                ? "border-[#C59B68] bg-[#FAF7F2] shadow-md ring-2 ring-[#C59B68]/30"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className={cn(
                "p-2.5 rounded-xl transition-colors",
                businessChoice === 'yes' ? "bg-[#C59B68] text-white" : "bg-slate-100 text-slate-600"
              )}>
                <Building2 className="w-5 h-5" />
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                businessChoice === 'yes' ? "border-[#C59B68] bg-[#C59B68] text-white" : "border-slate-300 bg-white"
              )}>
                {businessChoice === 'yes' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
            <div>
              <span className="font-bold text-[#0E1B33] text-base block mb-1">
                Sim, possuo CNPJ / sou autônomo
              </span>
              <span className="text-xs text-slate-600 leading-relaxed block">
                Tenho empresa, clínica, consultório, escritório ou emito notas fiscais como PJ.
              </span>
            </div>
          </button>

          {/* Card NÃO */}
          <button
            type="button"
            id="btn-choose-cnpj-no"
            onClick={() => handleChoose('no')}
            className={cn(
              "text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer",
              businessChoice === 'no'
                ? "border-[#0E1B33] bg-slate-50 shadow-md ring-2 ring-[#0E1B33]/20"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className={cn(
                "p-2.5 rounded-xl transition-colors",
                businessChoice === 'no' ? "bg-[#0E1B33] text-white" : "bg-slate-100 text-slate-600"
              )}>
                <UserCheck className="w-5 h-5" />
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                businessChoice === 'no' ? "border-[#0E1B33] bg-[#0E1B33] text-white" : "border-slate-300 bg-white"
              )}>
                {businessChoice === 'no' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
            <div>
              <span className="font-bold text-[#0E1B33] text-base block mb-1">
                Não possuo CNPJ
              </span>
              <span className="text-xs text-slate-600 leading-relaxed block">
                Minha renda é como Pessoa Física (CLT, servidor público, aposentado ou profissional sem CNPJ).
              </span>
            </div>
          </button>
        </div>

        {/* Feedback if user selected NÃO */}
        {businessChoice === 'no' && (
          <div className="p-4.5 rounded-xl bg-[#FAF8F5] border border-[#EFE5D5] text-slate-700 text-xs sm:text-sm leading-relaxed flex items-start gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#C59B68] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0E1B33] block font-bold mb-0.5">Diagnóstico Focado em Pessoa Física & Família</strong>
              Perfeito! O seu relatório avaliará o fluxo direto da sua renda pessoal, segurança contra imprevistos e estratégias para acelerar seu patrimônio líquido sem interferência empresarial.
            </div>
          </div>
        )}

        {/* Business questions list if user selected SIM */}
        {businessChoice === 'yes' && (
          <div className="space-y-6 pt-3 border-t border-slate-100 animate-fade-in">
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFE5D5] text-xs text-slate-700 leading-relaxed">
              Responda às <strong className="text-[#0E1B33]">6 perguntas rápidas</strong> abaixo para avaliarmos se o seu negócio está alavancando ou drenando o seu patrimônio pessoal:
            </div>

            {BUSINESS_QUESTIONS.map((bq, idx) => (
              <div key={idx} id={`business-question-${idx}`} className="space-y-2.5">
                <label className="block text-sm font-bold text-[#0E1B33] leading-snug">
                  {idx + 1}. {bq}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id={`btn-business-${idx}-sim`}
                    onClick={() => {
                      setWarningMessage(null);
                      setBusinessAns(prev => ({ ...prev, [idx]: 'Sim' }));
                    }}
                    className={cn(
                      "py-3 px-4 rounded-xl border text-sm font-semibold transition-all text-center flex items-center justify-center gap-2 cursor-pointer",
                      businessAns[idx] === 'Sim' 
                        ? "border-[#C59B68] bg-[#FAF7F2] text-[#0E1B33] ring-1 ring-[#C59B68] shadow-xs" 
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <CheckCircle2 className={cn("w-4 h-4", businessAns[idx] === 'Sim' ? "text-[#C59B68]" : "text-slate-400")} />
                    Sim
                  </button>
                  <button
                    type="button"
                    id={`btn-business-${idx}-nao`}
                    onClick={() => {
                      setWarningMessage(null);
                      setBusinessAns(prev => ({ ...prev, [idx]: 'Não' }));
                    }}
                    className={cn(
                      "py-3 px-4 rounded-xl border text-sm font-semibold transition-all text-center flex items-center justify-center gap-2 cursor-pointer",
                      businessAns[idx] === 'Não' 
                        ? "border-[#0E1B33] bg-slate-100 text-[#0E1B33] ring-1 ring-[#0E1B33] shadow-xs" 
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    Não / Parcialmente
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            id="btn-business-back"
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>

          <button
            id="btn-generate-prosperity-map"
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-[#0E1B33] hover:bg-[#182C50] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-95 text-sm cursor-pointer border-t border-[#C59B68]/30"
          >
            Gerar Meu Mapa da Prosperidade <Sparkles className="w-4 h-4 text-[#C59B68]" />
          </button>
        </div>
      </div>
    </div>
  );
};
