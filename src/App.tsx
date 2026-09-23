import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Lock } from 'lucide-react';
import { Header } from './components/Header';
import { WelcomeStep } from './components/WelcomeStep';
import { LeadStep } from './components/LeadStep';
import { QuizStep } from './components/QuizStep';
import { BusinessStep } from './components/BusinessStep';
import { ResultReport } from './components/ResultReport';
import { AdminDashboard } from './components/AdminDashboard';
import { DIMENSIONS, getDimensionMeta } from './data/dimensions';
import type { LeadData, DimensionResult, Recommendation, AppStep, StageName, BusinessChoice } from './types';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [step, setStep] = useState<AppStep>('welcome');
  const [lead, setLead] = useState<LeadData>({
    name: '',
    email: '',
    phone: '',
    primaryGoal: 'Construir patrimônio sólido'
  });

  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  // answers stores: questionId -> optionIndex (0, 1, 2, ...)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  // businessChoice: 'yes' | 'no' | null
  const [businessChoice, setBusinessChoice] = useState<BusinessChoice>(null);
  const [businessAns, setBusinessAns] = useState<Record<number, string>>({});

  // Check URL query param, pathname or hash for exclusive gestora access (?gestora=true, ?gestora, /gestora, #gestora)
  useEffect(() => {
    const checkIsGestoraUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const isGestoraRoute = 
        params.has('gestora') || 
        params.has('admin') || 
        params.has('painel') ||
        params.get('gestora') === 'true' || 
        params.get('admin') === 'true' || 
        params.get('painel') === 'true' ||
        window.location.pathname.includes('/gestora') ||
        window.location.pathname.includes('/admin') ||
        window.location.hash.includes('gestora') ||
        window.location.hash.includes('admin');

      setIsAdminView(isGestoraRoute);
    };

    checkIsGestoraUrl();
    window.addEventListener('popstate', checkIsGestoraUrl);
    window.addEventListener('hashchange', checkIsGestoraUrl);
    return () => {
      window.removeEventListener('popstate', checkIsGestoraUrl);
      window.removeEventListener('hashchange', checkIsGestoraUrl);
    };
  }, []);

  const handleExitAdmin = useCallback(() => {
    setIsAdminView(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('gestora');
      url.searchParams.delete('admin');
      url.searchParams.delete('painel');
      url.hash = '';
      if (url.pathname.endsWith('/gestora') || url.pathname.endsWith('/admin')) {
        url.pathname = '/';
      }
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    } catch {
      // noop
    }
  }, []);

  // Restore saved state from localStorage
  useEffect(() => {
    try {
      const savedLead = localStorage.getItem('mil_lead');
      const savedAnswers = localStorage.getItem('mil_answers');
      const savedChoice = localStorage.getItem('mil_business_choice') as BusinessChoice;
      const savedBusinessAns = localStorage.getItem('mil_business_ans');

      if (savedLead) {
        setLead(JSON.parse(savedLead));
      }
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      if (savedChoice === 'yes' || savedChoice === 'no') {
        setBusinessChoice(savedChoice);
      }
      if (savedBusinessAns) {
        setBusinessAns(JSON.parse(savedBusinessAns));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mil_lead', JSON.stringify(lead));
    } catch {
      // ignore
    }
  }, [lead]);

  useEffect(() => {
    try {
      localStorage.setItem('mil_answers', JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers]);

  useEffect(() => {
    try {
      if (businessChoice !== null) {
        localStorage.setItem('mil_business_choice', businessChoice);
      } else {
        localStorage.removeItem('mil_business_choice');
      }
      localStorage.setItem('mil_business_ans', JSON.stringify(businessAns));
    } catch {
      // ignore
    }
  }, [businessChoice, businessAns]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const dimensionResults = useMemo<Record<string, DimensionResult>>(() => {
    const results: Record<string, DimensionResult> = {};
    
    DIMENSIONS.forEach(dim => {
      const scores = dim.questions.map(q => {
        const chosenOptIdx = answers[q.id];
        if (chosenOptIdx !== undefined && q.options[chosenOptIdx]) {
          return q.options[chosenOptIdx].score;
        }
        return 1;
      });

      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      let stageNum = 1;
      let stageName: StageName = 'Sustentar';
      
      if (avg >= 3.5) {
        stageNum = 4;
        stageName = 'Expandir';
      } else if (avg >= 2.5) {
        stageNum = 3;
        stageName = 'Construir';
      } else if (avg >= 1.8) {
        stageNum = 2;
        stageName = 'Organizar';
      }

      const meta = getDimensionMeta(dim.id);
      const description = meta.stageDescriptions[stageName] || 'A renda ainda está predominantemente dedicada ao presente.';
      
      results[dim.id] = {
        title: dim.title,
        subtitle: dim.subtitle,
        avg,
        stageNum,
        stageName,
        description
      };
    });

    return results;
  }, [answers]);

  const recommendation = useMemo<Recommendation>(() => {
    const values = Object.values(dimensionResults);
    if (values.length === 0) {
      return { 
        title: 'O Código da Liberdade Financeira', 
        desc: 'Inicie sua jornada com fundamentos sólidos e metas claras.',
        product: 'O Código'
      };
    }
    
    const overallAvg = values.reduce((acc, curr) => acc + curr.avg, 0) / values.length;
    const estruturaAvg = dimensionResults['estrutura']?.avg ?? 1;
    const isCNPJ = businessChoice === 'yes';
    
    if (isCNPJ && estruturaAvg < 2.5) {
      return {
        title: 'Jornada com Módulo de Viabilidade CPF ⇄ CNPJ',
        desc: 'Seu negócio e suas finanças pessoais estão misturados ou estrangulando o caixa pessoal. O foco inicial é separar fluxos financeiros, blindar o pró-labore e ajustar margens operacionais.',
        product: 'Jornada Prosperidade MIL + CPF/CNPJ'
      };
    } else if (overallAvg < 2.2) {
      return {
        title: 'Jornada Prosperidade MIL',
        desc: 'Detectamos múltiplos gargalos na estrutura e segurança do seu fluxo financeiro. A rota mais eficiente é uma imersão completa para destravar sua estrutura, blindar reservas e construir patrimônio.',
        product: 'Jornada Prosperidade MIL'
      };
    } else if (overallAvg >= 3.2) {
      return {
        title: 'Gestor MIL (Acompanhamento Estratégico)',
        desc: 'Você já possui boa disciplina e estratégia patrimonial. O próximo movimento é contar com acompanhamento contínuo de indicadores e governança executiva para acelerar sua expansão.',
        product: 'Gestor MIL'
      };
    } else {
      return {
        title: 'O Código da Liberdade Financeira',
        desc: 'Você possui autonomia e boa capacidade de geração. O Código é o acelerador sob medida para consolidar suas decisões, organizar o fluxo e estruturar sua expansão com metas claras.',
        product: 'O Código'
      };
    }
  }, [dimensionResults, businessChoice]);

  // Submit to server when generating report
  const handleGenerateReport = useCallback(() => {
    setStep('result');
    const values = Object.values(dimensionResults);
    const overallAvg = values.length > 0 ? values.reduce((acc, curr) => acc + curr.avg, 0) / values.length : 2.5;

    const record = {
      id: `sub_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lead,
      answers,
      businessChoice,
      businessAns,
      dimensionResults,
      recommendation,
      overallAvg
    };

    // Post to backend API
    fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).catch(err => {
      console.warn('Could not post submission to backend (may be offline):', err);
    });
  }, [dimensionResults, lead, answers, businessChoice, businessAns, recommendation]);

  const handleReset = () => {
    setStep('welcome');
    setCurrentDimensionIndex(0);
    setAnswers({});
    setBusinessChoice(null);
    setBusinessAns({});
    localStorage.removeItem('mil_answers');
    localStorage.removeItem('mil_business_choice');
    localStorage.removeItem('mil_business_ans');
  };

  const isWideLayout = isAdminView || step === 'result';

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#0E1B33] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans">
      <div className={`${isWideLayout ? 'max-w-6xl' : 'max-w-4xl'} mx-auto transition-all duration-300`}>
        <Header 
          isAdminView={isAdminView} 
          onToggleAdmin={handleExitAdmin} 
          onOpenAdmin={() => {
            setIsAdminView(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {isAdminView ? (
          <AdminDashboard onBackToApp={handleExitAdmin} />
        ) : (
          <div className={`${isWideLayout ? 'max-w-full' : 'max-w-3xl'} mx-auto transition-all duration-300`}>
            {step === 'welcome' && (
              <WelcomeStep 
                lead={lead} 
                setLead={setLead} 
                onNext={() => setStep('lead')} 
              />
            )}

            {step === 'lead' && (
              <LeadStep 
                lead={lead} 
                setLead={setLead} 
                onNext={() => setStep('quiz')} 
                onBack={() => setStep('welcome')} 
              />
            )}

            {step === 'quiz' && (
              <QuizStep 
                currentDimensionIndex={currentDimensionIndex}
                setCurrentDimensionIndex={setCurrentDimensionIndex}
                answers={answers}
                onSelectOption={handleSelectOption}
                onBackToLead={() => setStep('lead')}
                onFinishQuiz={() => setStep('business')}
              />
            )}

            {step === 'business' && (
              <BusinessStep 
                businessChoice={businessChoice}
                setBusinessChoice={setBusinessChoice}
                businessAns={businessAns}
                setBusinessAns={setBusinessAns}
                onBack={() => setStep('quiz')}
                onGenerateReport={handleGenerateReport}
              />
            )}

            {step === 'result' && (
              <ResultReport 
                lead={lead}
                answers={answers}
                dimensionResults={dimensionResults}
                businessChoice={businessChoice}
                businessAns={businessAns}
                recommendation={recommendation}
                onReset={handleReset}
              />
            )}
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-slate-500 pb-6 border-t border-slate-200/60 pt-6">
          <p className="font-medium">
            © {new Date().getFullYear()} Inspirar Finanças — Método MIL. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-400">
            <span>Plataforma de Diagnóstico Estratégico de Prosperidade Financeira</span>
            <span className="hidden sm:inline opacity-40">•</span>
            <button
              id="btn-footer-gestora"
              type="button"
              onClick={() => {
                setIsAdminView(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-500 hover:text-[#0E1B33] bg-slate-100 hover:bg-[#FAF6EE] border border-slate-200 hover:border-[#E9D7BC] transition-all text-xs font-semibold cursor-pointer shadow-2xs group"
              title="Acesso exclusivo da Gestora"
            >
              <Lock className="w-3 h-3 text-[#C59B68] group-hover:scale-110 transition-transform" />
              <span>Acesso Gestora (Painel)</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
