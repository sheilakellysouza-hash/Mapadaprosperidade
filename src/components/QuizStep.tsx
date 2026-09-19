import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DIMENSIONS } from '../data/dimensions';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface QuizStepProps {
  currentDimensionIndex: number;
  setCurrentDimensionIndex: React.Dispatch<React.SetStateAction<number>>;
  answers: Record<string, number>; // stores optionIndex (0, 1, 2, ...)
  onSelectOption: (questionId: string, optionIndex: number) => void;
  onBackToLead: () => void;
  onFinishQuiz: () => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({
  currentDimensionIndex,
  setCurrentDimensionIndex,
  answers,
  onSelectOption,
  onBackToLead,
  onFinishQuiz,
}) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const currentDim = DIMENSIONS[currentDimensionIndex];
  const IconComponent = currentDim.icon;
  const progressPercent = Math.round(((currentDimensionIndex + 1) / DIMENSIONS.length) * 100);

  const handleNext = () => {
    const questionIds = currentDim.questions.map(q => q.id);
    const allAnswered = questionIds.every(id => answers[id] !== undefined);

    if (!allAnswered) {
      setWarningMessage('Por favor, responda todas as perguntas desta dimensão antes de avançar.');
      return;
    }

    setWarningMessage(null);
    if (currentDimensionIndex < DIMENSIONS.length - 1) {
      setCurrentDimensionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onFinishQuiz();
    }
  };

  const handleBack = () => {
    setWarningMessage(null);
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBackToLead();
    }
  };

  return (
    <div id="quiz-step-card" className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
      {/* Progress header with Inspirar Finanças Navy & Gold */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C6934] bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E9D7BC]">
            Dimensão {currentDimensionIndex + 1} de {DIMENSIONS.length}
          </span>
          <span className="text-xs font-bold text-[#0E1B33]">
            {progressPercent}% concluído
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
          <div 
            className="bg-gradient-to-r from-[#0E1B33] via-[#9E7848] to-[#C59B68] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Dimension Title & Subtitle */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <div className="p-3 bg-[#FAF6EE] text-[#8C6934] border border-[#E9D7BC] rounded-xl shrink-0 shadow-xs">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0E1B33]">{currentDim.title}</h2>
            <p className="text-sm text-slate-600 font-medium">{currentDim.subtitle}</p>
          </div>
        </div>

        {warningMessage && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-8">
          {currentDim.questions.map((q, qIdx) => {
            const selectedOptIdx = answers[q.id];

            return (
              <div key={q.id} id={`question-box-${q.id}`} className="space-y-3">
                <h3 className="font-bold text-[#0E1B33] text-base leading-snug">
                  {qIdx + 1}. {q.title}
                </h3>
                <div className="grid gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    // Fix: Strict index equality ensures exactly ONE option is selected at a time
                    const isSelected = selectedOptIdx === optIdx;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        id={`option-${q.id}-${optIdx}`}
                        onClick={() => {
                          setWarningMessage(null);
                          onSelectOption(q.id, optIdx);
                        }}
                        className={cn(
                          "text-left p-4 rounded-xl border text-sm transition-all duration-150 flex items-start gap-3.5 cursor-pointer",
                          isSelected 
                            ? "border-[#C59B68] bg-[#FAF7F2] text-[#0E1B33] font-semibold shadow-sm ring-1 ring-[#C59B68]" 
                            : "border-slate-200 hover:border-[#C59B68]/60 hover:bg-[#FDFBF7] text-slate-700"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                          isSelected ? "border-[#C59B68] bg-[#C59B68] text-white" : "border-slate-300 bg-white"
                        )}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="leading-relaxed">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            id="btn-quiz-back"
            type="button"
            onClick={handleBack}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>

          <button
            id="btn-quiz-next"
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 bg-[#0E1B33] hover:bg-[#182C50] text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-95 text-sm cursor-pointer border-t border-[#C59B68]/30"
          >
            {currentDimensionIndex < DIMENSIONS.length - 1 ? (
              <>Próxima <ArrowRight className="w-4 h-4 text-[#C59B68]" /></>
            ) : (
              <>Módulo Empresarial <ArrowRight className="w-4 h-4 text-[#C59B68]" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
