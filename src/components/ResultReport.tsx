import React, { useEffect, useState } from 'react';
import { 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  UserCheck,
  Check, 
  Copy, 
  Printer, 
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';
import type { LeadData, DimensionResult, Recommendation, BusinessChoice } from '../types';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ResultReportProps {
  lead: LeadData;
  dimensionResults: Record<string, DimensionResult>;
  businessChoice: BusinessChoice;
  businessAns: Record<number, string>;
  recommendation: Recommendation;
  onReset: () => void;
}

export const ResultReport: React.FC<ResultReportProps> = ({
  lead,
  dimensionResults,
  businessChoice,
  businessAns,
  recommendation,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [whatsappTargetNumber, setWhatsappTargetNumber] = useState('5571999999999');
  const hasBusiness = businessChoice === 'yes';

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.whatsappNumber) {
          setWhatsappTargetNumber(data.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0E1B33', '#C59B68', '#D4AF7A', '#1E2E56', '#FAF6EE']
      });
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const businessYesCount = Object.values(businessAns).filter(v => v === 'Sim').length;
  const businessTotalAnswered = Object.keys(businessAns).length;

  const profileType = hasBusiness ? 'Empresário/PJ' : 'Pessoa Física';
  const whatsappMessage = `Olá! Meu nome é ${lead.name}. Fiz o Mapa da Prosperidade (Método MIL da Inspirar Finanças) como ${profileType} e meu resultado indicou: ${recommendation.product}. Gostaria de conversar sobre meu diagnóstico.`;
  const whatsappUrl = `https://wa.me/${whatsappTargetNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopySummary = () => {
    const lines = [
      `📊 MAPA DA PROSPERIDADE | MÉTODO MIL - INSPIRAR FINANÇAS`,
      `Cliente: ${lead.name}`,
      `Perfil: ${profileType}`,
      `Objetivo Principal: ${lead.primaryGoal}`,
      `Recomendação: ${recommendation.title} (${recommendation.product})`,
      ``,
      `Estágios das Dimensões:`,
      ...Object.values(dimensionResults).map(d => `• ${d.title}: ${d.stageName} (Média ${d.avg.toFixed(1)}/4.0)`),
      hasBusiness ? `\nMódulo Empresarial CPF ⇄ CNPJ: ${businessYesCount}/6 pontos de viabilidade atendidos` : '\nPerfil: Pessoa Física'
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const stageColorMap: Record<string, { badge: string; bar: string; text: string }> = {
    'Sustentar': {
      badge: 'bg-amber-50 text-amber-900 border-amber-200',
      bar: 'bg-amber-500',
      text: 'text-amber-800'
    },
    'Organizar': {
      badge: 'bg-sky-50 text-sky-900 border-sky-200',
      bar: 'bg-sky-600',
      text: 'text-sky-800'
    },
    'Construir': {
      badge: 'bg-indigo-50 text-[#0E1B33] border-indigo-200',
      bar: 'bg-[#0E1B33]',
      text: 'text-[#0E1B33]'
    },
    'Expandir': {
      badge: 'bg-[#FAF6EE] text-[#8C6934] border-[#E9D7BC] font-bold',
      bar: 'bg-gradient-to-r from-[#9E7848] to-[#C59B68]',
      text: 'text-[#8C6934]'
    }
  };

  return (
    <div id="result-report-view" className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C6934] bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E9D7BC]">
            Diagnóstico Emitido
          </span>
          <span className="text-xs text-slate-600 hidden sm:inline">
            Emissão exclusiva para <strong className="text-[#0E1B33]">{lead.name}</strong> ({profileType})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-copy-summary"
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-[#0E1B33] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            title="Copiar resumo do relatório"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#C59B68]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          <button
            id="btn-print-report"
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-[#0E1B33] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            title="Imprimir ou salvar em PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
          <button 
            id="btn-reset-quiz"
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refazer Diagnóstico"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refazer
          </button>
        </div>
      </div>

      {/* Main Executive Summary Header */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6934] bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E9D7BC]">
                Relatório Executivo Método MIL
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {profileType}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E1B33] mt-2.5">
              Mapa da Prosperidade de {lead.name}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
              <span><strong>E-mail:</strong> {lead.email}</span>
              {lead.phone && <span><strong>WhatsApp:</strong> {lead.phone}</span>}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-5 bg-[#FAF8F5] rounded-xl border border-[#EFE5D5] text-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6934] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C59B68]" /> Parecer Estratégico Inspirar Finanças
            </h4>
            <p className="text-sm leading-relaxed font-medium text-slate-800">
              {lead.name}, com base nas suas respostas para o objetivo de <strong className="text-[#0E1B33] font-bold">"{lead.primaryGoal}"</strong>, identificamos que o seu principal ponto de alavancagem não é apenas aumentar a renda bruta, mas sim construir uma governança clara para transformar o fluxo financeiro em segurança sustentável, patrimônio líquido e liberdade de escolhas.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Dimensions Breakdown */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-[#0E1B33]">
            Raio-X por Dimensões (Estágios Atuais)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Análise detalhada do seu momento em cada uma das 6 pilastras do Método MIL.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(dimensionResults).map(([key, dim]) => {
            const styles = stageColorMap[dim.stageName] || stageColorMap['Sustentar'];

            return (
              <div 
                key={key} 
                id={`result-card-${key}`}
                className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between hover:border-[#C59B68]/40 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#0E1B33] text-sm">{dim.title}</span>
                    <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full border", styles.badge)}>
                      {dim.stageName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {dim.description}
                  </p>
                </div>
                
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <span>Sustentar</span>
                    <span>Organizar</span>
                    <span>Construir</span>
                    <span>Expandir</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-700", styles.bar)}
                      style={{ width: `${(dim.stageNum / 4) * 100}%` }}
                    />
                  </div>
                  <div className="text-right text-[11px] text-slate-500 font-medium">
                    Índice: <strong className="text-[#0E1B33] font-bold">{dim.avg.toFixed(1)}</strong> de 4.0
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Module Evaluation (if CNPJ was chosen) */}
      {hasBusiness && (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#8C6934] font-bold text-sm mb-2">
            <Building2 className="w-4 h-4 text-[#C59B68]" /> Diagnóstico Empresarial (CPF ⇄ CNPJ)
          </div>
          <h3 className="text-lg font-bold text-[#0E1B33] mb-2">
            Relação entre Atividade Profissional e Patrimônio Pessoal
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Você atendeu a <strong className="text-[#0E1B33] font-bold">{businessYesCount} de {businessTotalAnswered || 6}</strong> critérios de viabilidade estrutural entre sua empresa e suas contas pessoais.
          </p>

          <div className="p-4.5 rounded-xl border bg-[#FAF8F5] border-[#EFE5D5] text-xs text-slate-800 space-y-2">
            {businessYesCount >= 5 ? (
              <p className="text-emerald-900 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Excelente governança entre pessoa física e jurídica. Sua operação possui separação contábil consistente e potencializa a expansão patrimonial.
              </p>
            ) : businessYesCount >= 3 ? (
              <p className="text-amber-900 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Atenção ao pró-labore e separação de caixas: há pontos onde a empresa e o custo de vida pessoal concorrem pelos mesmos recursos, gerando vulnerabilidade.
              </p>
            ) : (
              <p className="text-rose-900 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                Alerta de mistura patrimonial: a empresa está funcionando predominantemente para cobrir despesas correntes, sem margem real ou formação contínua de patrimônio pessoal.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Non-business indication card if chosen Não */}
      {!hasBusiness && businessChoice === 'no' && (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#8C6934] font-bold text-sm mb-1.5">
            <UserCheck className="w-4 h-4 text-[#C59B68]" /> Foco em Pessoa Física & Família
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Como você não possui atividade como PJ/CNPJ, suas decisões estratégicas devem focar em otimizar a taxa de poupança da renda salarial, blindar suas reservas e acelerar a rentabilidade dos investimentos para geração de patrimônio sólido.
          </p>
        </div>
      )}

      {/* Recommended Next Movement CTA with Inspirar Finanças Navy & Gold */}
      <div className="bg-gradient-to-br from-[#0B1528] via-[#0E1B33] to-[#16274B] rounded-2xl shadow-2xl p-6 sm:p-8 text-white border border-[#C59B68]/30 relative overflow-hidden">
        {/* Subtle decorative gold circle in background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#C59B68]/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-[#C59B68] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-[#C59B68]" /> Próximo Movimento Recomendado
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {recommendation.title}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-2xl">
          {recommendation.desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a 
            id="link-whatsapp-recommendation"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2.5 bg-[#C59B68] hover:bg-[#D4AF7A] text-[#0E1B33] font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-95 text-sm cursor-pointer"
          >
            Quero conversar sobre meu resultado no WhatsApp <ArrowRight className="w-4 h-4 text-[#0E1B33]" />
          </a>
        </div>
        <p className="text-[11px] text-slate-400 mt-3 text-center sm:text-left">
          Você será direcionado para conversar diretamente com um consultor especialista da equipe Inspirar Finanças.
        </p>
      </div>
    </div>
  );
};
