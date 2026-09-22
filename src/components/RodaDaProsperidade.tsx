import React, { useState } from 'react';
import { 
  Coins, 
  Cog, 
  Shield, 
  Home, 
  Sprout, 
  Mountain, 
  ArrowRight, 
  Lightbulb, 
  ChevronRight, 
  X, 
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ListChecks,
  BarChart3,
  Compass
} from 'lucide-react';
import type { LeadData, DimensionResult, StageName } from '../types';
import { DIMENSIONS, DIMENSION_METADATA, getDimensionMeta } from '../data/dimensions';

interface RodaDaProsperidadeProps {
  dimensionResults: Record<string, DimensionResult>;
  overallAvg: number;
  lead: LeadData;
  answers: Record<string, number>;
  onScheduleStrategicSession: () => void;
}

export const RodaDaProsperidade: React.FC<RodaDaProsperidadeProps> = ({
  dimensionResults,
  overallAvg,
  lead,
  answers,
  onScheduleStrategicSession,
}) => {
  const [selectedDimId, setSelectedDimId] = useState<string | null>(null);

  // 6 dimensions in clockwise order matching the user's diagram
  const dimensionKeys = ['renda', 'estrutura', 'seguranca', 'patrimonio', 'expansao', 'lideranca'];

  // Icons map
  const iconMap: Record<string, React.ElementType> = {
    renda: Coins,
    estrutura: Cog,
    seguranca: Shield,
    patrimonio: Home,
    expansao: Sprout,
    lideranca: Mountain,
  };

  // Radar geometry configuration
  const cx = 270;
  const cy = 250;
  const maxRadius = 150;
  const numLevels = 4; // Sustentar, Organizar, Construir, Expandir

  // Compute angles for regular hexagon (-60° for top-right, 0° for right, 60° for bottom-right, etc.)
  // Angles in degrees: -60, 0, 60, 120, 180, 240
  const anglesDeg = [-60, 0, 60, 120, 180, 240];
  const anglesRad = anglesDeg.map(d => (d * Math.PI) / 180);

  // Hexagonal grid points for each level (1 to 4)
  const gridPolygons = Array.from({ length: numLevels }, (_, i) => {
    const levelRadius = ((i + 1) / numLevels) * maxRadius;
    const points = anglesRad.map(angle => {
      const x = cx + levelRadius * Math.cos(angle);
      const y = cy + levelRadius * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return { level: i + 1, points, radius: levelRadius };
  });

  // Calculate user polygon vertices based on actual scores
  const userVertices = dimensionKeys.map((key, i) => {
    const dim = dimensionResults[key];
    const score = dim ? dim.avg : 1.0;
    // Map score 1.0..4.0 to radius (minimum 36px so it wraps the center badge neatly, max maxRadius)
    const minR = 38;
    const normalized = (score - 1.0) / 3.0; // 0 to 1
    const r = minR + normalized * (maxRadius - minR);
    const angle = anglesRad[i];
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, score, key, dim };
  });

  const userPolygonPoints = userVertices.map(v => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');

  // Compute prioritized focuses based on lowest scores
  const sortedByScore = [...dimensionKeys].sort((a, b) => {
    const scoreA = dimensionResults[a]?.avg ?? 1;
    const scoreB = dimensionResults[b]?.avg ?? 1;
    return scoreA - scoreB;
  });

  const topPriorities = sortedByScore.slice(0, 4);

  // Overall Stage interpretation text
  let overallStageTitle = 'Sustentar';
  let overallStageNarrative = 'Você está no início da sua jornada de construção financeira. Existe um grande potencial de evolução em todas as dimensões.';
  let centerBadgeText = 'SUA PROSPERIDADE EM CONSTRUÇÃO';

  if (overallAvg >= 3.5) {
    overallStageTitle = 'Expandir';
    overallStageNarrative = 'Você atingiu maturidade de expansão e governança executiva, com bases sólidas para escala, proteção e consolidação de legado.';
    centerBadgeText = 'EXPANSÃO PATRIMONIAL';
  } else if (overallAvg >= 2.5) {
    overallStageTitle = 'Construir';
    overallStageNarrative = 'Você está em fase ativa de construção de ativos, transformando renda ativa em segurança e patrimônio líquido crescente.';
    centerBadgeText = 'FASE DE CONSTRUÇÃO';
  } else if (overallAvg >= 1.8) {
    overallStageTitle = 'Organizar';
    overallStageNarrative = 'Você já possui capacidade de geração, e seu próximo salto estratégico é organizar a estrutura e criar reservas de tranquilidade.';
    centerBadgeText = 'EM ORGANIZAÇÃO';
  }

  // Selected dimension for modal
  const selectedDimension = selectedDimId ? DIMENSIONS.find(d => d.id === selectedDimId) : null;
  const selectedResult = selectedDimId ? dimensionResults[selectedDimId] : null;
  const selectedMeta = selectedDimId ? getDimensionMeta(selectedDimId) : null;

  return (
    <div id="mapa-da-prosperidade-container" className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
      {/* Top Header Section */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-b from-[#FAF8F5]/60 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8C6934] bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E9D7BC]">
                MAPA DA PROSPERIDADE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E1B33] tracking-tight">
              Seu momento em cada dimensão
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Uma visão integrada da sua vida financeira, mostrando onde você está hoje e os próximos movimentos para construir a vida que deseja.
            </p>
          </div>

          {/* Right Brand Lockup & Script */}
          <div className="flex flex-col items-start md:items-end shrink-0 pt-2 md:pt-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-[#0E1B33]">MÉTODO MIL®</span>
              <span className="text-[10px] uppercase font-bold text-[#8C6934] tracking-wider bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#E9D7BC]">
                INSPIRAR FINANÇAS
              </span>
            </div>
            <div className="mt-1 flex flex-col items-start md:items-end">
              <span 
                className="text-2xl sm:text-3xl text-[#C59B68] select-none"
                style={{ fontFamily: 'Caveat, cursive' }}
              >
                Da consciência ao legado
              </span>
              <svg className="w-28 h-2 text-[#C59B68]/60 -mt-1" viewBox="0 0 100 8" fill="none">
                <path d="M2 5 Q 50 1, 98 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Radar + Stepper) & Right (Gauge, Distribution, Suggested Focus) */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Radar + Stages) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          
          {/* Hexagonal Radar Section */}
          <div className="bg-[#FAF8F5]/50 rounded-2xl p-4 sm:p-6 border border-[#EFE5D5] flex flex-col items-center relative">
            
            {/* Dimension Callout Cards surrounding the Radar */}
            <div className="w-full">
              {/* Desktop & Tablet Circular Layout Wrapper */}
              <div className="relative w-full max-w-[620px] mx-auto min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
                
                {/* The SVG Radar Graph */}
                <svg 
                  viewBox="0 0 540 500" 
                  className="w-full max-w-[500px] h-auto drop-shadow-xs select-none"
                >
                  <defs>
                    <radialGradient id="radarGoldGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#C59B68" stopOpacity="0.38" />
                      <stop offset="100%" stopColor="#8C6934" stopOpacity="0.15" />
                    </radialGradient>
                    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Concentric Hexagon Grid Levels */}
                  {gridPolygons.map(({ level, points }) => (
                    <polygon
                      key={`grid-${level}`}
                      points={points}
                      fill={level % 2 === 0 ? '#FAF6EE' : '#FFFFFF'}
                      fillOpacity="0.45"
                      stroke="#E9D7BC"
                      strokeWidth={level === 4 ? "1.8" : "1"}
                      strokeDasharray={level === 4 ? undefined : "3 3"}
                    />
                  ))}

                  {/* 6 Radial Axes from Center */}
                  {anglesRad.map((angle, i) => {
                    const outerX = cx + maxRadius * Math.cos(angle);
                    const outerY = cy + maxRadius * Math.sin(angle);
                    return (
                      <line
                        key={`axis-${i}`}
                        x1={cx}
                        y1={cy}
                        x2={outerX}
                        y2={outerY}
                        stroke="#E9D7BC"
                        strokeWidth="1.2"
                      />
                    );
                  })}

                  {/* User's Score Polygon */}
                  <polygon
                    points={userPolygonPoints}
                    fill="url(#radarGoldGradient)"
                    stroke="#C59B68"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    className="transition-all duration-700 ease-out"
                    filter="url(#goldGlow)"
                  />

                  {/* Vertices Nodes */}
                  {userVertices.map((v, i) => (
                    <g key={`vertex-${i}`} className="cursor-pointer" onClick={() => setSelectedDimId(v.key)}>
                      <circle
                        cx={v.x}
                        cy={v.y}
                        r="7"
                        fill="#FFFFFF"
                        stroke="#C59B68"
                        strokeWidth="2.5"
                        className="hover:scale-125 transition-transform"
                      />
                      <circle
                        cx={v.x}
                        cy={v.y}
                        r="3.5"
                        fill="#8C6934"
                      />
                    </g>
                  ))}

                  {/* Center Circle Badge */}
                  <g className="select-none">
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="44" 
                      fill="#FAF6EE" 
                      stroke="#E9D7BC" 
                      strokeWidth="2" 
                    />
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="40" 
                      fill="#FFFFFF" 
                      stroke="#C59B68" 
                      strokeWidth="1" 
                      strokeDasharray="2.5 2.5" 
                    />
                    <text 
                      x={cx} 
                      y={cy - 10} 
                      textAnchor="middle" 
                      fontSize="7.5" 
                      fontWeight="800" 
                      fill="#0E1B33" 
                      letterSpacing="0.08em"
                    >
                      SUA
                    </text>
                    <text 
                      x={cx} 
                      y={cy - 1} 
                      textAnchor="middle" 
                      fontSize="7" 
                      fontWeight="800" 
                      fill="#8C6934" 
                      letterSpacing="0.08em"
                    >
                      PROSPERIDADE
                    </text>
                    <text 
                      x={cx} 
                      y={cy + 9} 
                      textAnchor="middle" 
                      fontSize="6.5" 
                      fontWeight="700" 
                      fill="#64748B"
                    >
                      EM
                    </text>
                    <text 
                      x={cx} 
                      y={cy + 18} 
                      textAnchor="middle" 
                      fontSize="7.5" 
                      fontWeight="800" 
                      fill="#0E1B33" 
                      letterSpacing="0.08em"
                    >
                      CONSTRUÇÃO
                    </text>
                  </g>
                </svg>

              </div>
            </div>

            {/* 6 Dimension Cards in Responsive 2x3 Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
              {dimensionKeys.map((key) => {
                const meta = getDimensionMeta(key);
                const result = dimensionResults[key];
                const score = result ? result.avg : 1.0;
                const IconComponent = iconMap[key] || Coins;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedDimId(key)}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#C59B68] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${meta.badgeBg} flex items-center justify-center text-white shrink-0 shadow-2xs`}>
                            <IconComponent className="w-4 h-4 text-amber-200" />
                          </div>
                          <span className="font-bold text-xs text-[#0E1B33] group-hover:text-[#8C6934] transition-colors">
                            {meta.title}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-[#0E1B33]">{score.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400 font-semibold"> / 4.0</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {result?.description || meta.stageDescriptions.Sustentar}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6934] bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#E9D7BC]">
                        {result?.stageName || 'Sustentar'}
                      </span>
                      <span className="text-[#8C6934] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Ver detalhes →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Radar Legend (as shown in the reference image) */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-[#EFE5D5] w-full text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#C59B68] ring-2 ring-[#FAF6EE] ring-offset-1" />
                <span className="font-semibold text-slate-800">Seu momento atual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF7A]" />
                <span>Em desenvolvimento</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-300" />
                <span>Próximo estágio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Potencial máximo</span>
              </div>
            </div>

          </div>

          {/* OS ESTÁGIOS DO SEU DESENVOLVIMENTO EM CADA DIMENSÃO */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#8C6934] mb-3 text-center sm:text-left">
              OS ESTÁGIOS DO SEU DESENVOLVIMENTO EM CADA DIMENSÃO
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
              {/* Stage 1: Sustentar */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between text-center relative ${overallStageTitle === 'Sustentar' ? 'bg-[#FAF6EE] border-[#C59B68] shadow-xs ring-1 ring-[#C59B68]' : 'bg-slate-50 border-slate-200'}`}>
                {overallStageTitle === 'Sustentar' && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0E1B33] text-[#C59B68]">
                    Seu Nível Geral
                  </span>
                )}
                <div>
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E9D7BC] mx-auto flex items-center justify-center text-[#8C6934] mb-2 shadow-2xs">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <h5 className="font-black text-xs text-[#0E1B33] uppercase tracking-wider">SUSTENTAR</h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Resolver o agora e garantir o essencial.
                  </p>
                </div>
              </div>

              {/* Stage 2: Organizar */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between text-center relative ${overallStageTitle === 'Organizar' ? 'bg-[#FAF6EE] border-[#C59B68] shadow-xs ring-1 ring-[#C59B68]' : 'bg-slate-50 border-slate-200'}`}>
                {overallStageTitle === 'Organizar' && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0E1B33] text-[#C59B68]">
                    Seu Nível Geral
                  </span>
                )}
                <div>
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E9D7BC] mx-auto flex items-center justify-center text-[#8C6934] mb-2 shadow-2xs">
                    <ListChecks className="w-4 h-4" />
                  </div>
                  <h5 className="font-black text-xs text-[#0E1B33] uppercase tracking-wider">ORGANIZAR</h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Estruturar, criar base e ganhar consistência.
                  </p>
                </div>
              </div>

              {/* Stage 3: Construir */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between text-center relative ${overallStageTitle === 'Construir' ? 'bg-[#FAF6EE] border-[#C59B68] shadow-xs ring-1 ring-[#C59B68]' : 'bg-slate-50 border-slate-200'}`}>
                {overallStageTitle === 'Construir' && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0E1B33] text-[#C59B68]">
                    Seu Nível Geral
                  </span>
                )}
                <div>
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E9D7BC] mx-auto flex items-center justify-center text-[#8C6934] mb-2 shadow-2xs">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h5 className="font-black text-xs text-[#0E1B33] uppercase tracking-wider">CONSTRUIR</h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Investir, ampliar e gerar resultados.
                  </p>
                </div>
              </div>

              {/* Stage 4: Expandir */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between text-center relative ${overallStageTitle === 'Expandir' ? 'bg-[#FAF6EE] border-[#C59B68] shadow-xs ring-1 ring-[#C59B68]' : 'bg-slate-50 border-slate-200'}`}>
                {overallStageTitle === 'Expandir' && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0E1B33] text-[#C59B68]">
                    Seu Nível Geral
                  </span>
                )}
                <div>
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E9D7BC] mx-auto flex items-center justify-center text-[#8C6934] mb-2 shadow-2xs">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h5 className="font-black text-xs text-[#0E1B33] uppercase tracking-wider">EXPANDIR</h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Multiplicar, gerar impacto e deixar um legado.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Índice Geral, Distribuição Atual, Próximos Focos & CTA) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">

          {/* Card: ÍNDICE GERAL DA PROSPERIDADE */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#EFE5D5]">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8C6934] text-center mb-4">
              ÍNDICE GERAL DA PROSPERIDADE
            </h4>

            {/* Semicircular Arc Gauge */}
            <div className="relative w-44 h-24 mx-auto flex items-end justify-center overflow-hidden">
              <svg viewBox="0 0 160 85" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 15 80 A 65 65 0 0 1 145 80"
                  fill="none"
                  stroke="#E9D7BC"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Foreground progress arc */}
                <path
                  d="M 15 80 A 65 65 0 0 1 145 80"
                  fill="none"
                  stroke="#C59B68"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="204.2"
                  strokeDashoffset={204.2 * (1 - (overallAvg / 4.0))}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Central number inside arc */}
              <div className="absolute bottom-1 text-center">
                <span className="text-3xl font-black text-[#0E1B33] leading-none block">
                  {overallAvg.toFixed(1)}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  de 4.0
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed text-center mt-3">
              {overallStageNarrative}
            </p>

            {/* Tip Card */}
            <div className="mt-4 p-3.5 rounded-xl bg-white border border-[#E9D7BC] flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-[#FAF6EE] text-[#C59B68] shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                Este é um ponto de partida, não um limite. Com clareza e estratégia, você pode avançar um estágio de cada vez.
              </p>
            </div>
          </div>

          {/* Card: SUA DISTRIBUIÇÃO ATUAL */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8C6934] mb-4">
              SUA DISTRIBUIÇÃO ATUAL
            </h4>

            <div className="space-y-3">
              {dimensionKeys.map((key) => {
                const meta = getDimensionMeta(key);
                const result = dimensionResults[key];
                const score = result ? result.avg : 1.0;
                const percentage = ((score - 1) / 3) * 100;

                return (
                  <div 
                    key={key}
                    onClick={() => setSelectedDimId(key)}
                    className="flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors group"
                  >
                    <span className="font-semibold text-slate-700 w-20 shrink-0 group-hover:text-[#0E1B33]">
                      {meta.shortTitle}
                    </span>

                    {/* Horizontal Bar */}
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#D4AF7A] to-[#C59B68] transition-all duration-700"
                        style={{ width: `${Math.max(15, (score / 4.0) * 100)}%` }}
                      />
                    </div>

                    <span className="font-bold text-[#0E1B33] w-7 text-right shrink-0">
                      {score.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: PRÓXIMOS FOCOS SUGERIDOS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8C6934] mb-3">
              PRÓXIMOS FOCOS SUGERIDOS
            </h4>

            <div className="space-y-2.5">
              {topPriorities.map((key, idx) => {
                const meta = getDimensionMeta(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDimId(key)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-[#FAF6EE] hover:border-[#E9D7BC] transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#C59B68] text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0E1B33]">
                        {meta.suggestedFocus}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#8C6934] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Final CTA Button: Agendar Sessão Estratégica com a Inspirar Finanças */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <button
                id="btn-agenda-sessao-estrategica"
                type="button"
                onClick={onScheduleStrategicSession}
                className="w-full flex items-center justify-center gap-2 bg-[#0E1B33] hover:bg-[#182C50] text-[#C59B68] hover:text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-[#0E1B33]/20 transition-all text-xs sm:text-sm cursor-pointer border border-[#C59B68]/30 group"
              >
                <span>Agendar Sessão Estratégica com a Inspirar Finanças</span>
                <ArrowRight className="w-4 h-4 text-[#C59B68] group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-2 leading-relaxed">
                Converse diretamente com um consultor especialista para montar seu plano sob medida.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Brand Bar (from uploaded image) */}
      <div className="bg-[#0E1B33] text-white px-6 py-4 border-t border-[#C59B68]/40 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-widest text-white text-xs">MÉTODO MIL®</span>
          <span className="text-[10px] text-[#C59B68] uppercase font-bold tracking-wider">INSPIRAR FINANÇAS</span>
        </div>

        <div className="text-center italic text-slate-300 font-serif text-[11px] sm:text-xs">
          "Cada decisão atual é um passo em direção à vida financeira que você deseja construir."
        </div>

        <div className="text-[10px] uppercase font-bold tracking-widest text-[#C59B68] flex items-center gap-1.5">
          <span>MAPEAR</span>
          <span>•</span>
          <span>INTERROMPER</span>
          <span>•</span>
          <span>INVESTIR</span>
          <span>•</span>
          <span>LIDERAR</span>
        </div>
      </div>

      {/* Dimension Detail Modal */}
      {selectedDimension && selectedResult && selectedMeta && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E9D7BC] p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${selectedMeta.badgeBg} flex items-center justify-center text-white shadow-sm`}>
                  {(() => {
                    const IconComponent = iconMap[selectedDimension.id] || Coins;
                    return <IconComponent className="w-5 h-5 text-amber-200" />;
                  })()}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C6934] bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#E9D7BC]">
                    Dimensão {selectedMeta.orderNumber} de 6
                  </span>
                  <h3 className="text-lg font-black text-[#0E1B33] mt-0.5">
                    {selectedDimension.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDimId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Stage Highlight */}
            <div className="mt-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE5D5] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Estágio de Maturidade:</span>
                <span className="text-sm font-extrabold text-[#0E1B33]">
                  {selectedResult.stageName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-semibold block">Pontuação:</span>
                <span className="text-lg font-black text-[#C59B68]">
                  {selectedResult.avg.toFixed(1)} <span className="text-xs text-slate-400">/ 4.0</span>
                </span>
              </div>
            </div>

            {/* Detailed Diagnostics */}
            <div className="mt-5 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-[#0E1B33] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B68]" /> O que este momento representa
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedMeta.stageDescriptions[selectedResult.stageName]}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0E1B33] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Como avançar para o próximo estágio
                </h4>
                <p className="text-slate-700 leading-relaxed bg-[#FAF6EE] p-3.5 rounded-xl border border-[#E9D7BC] font-medium">
                  {selectedMeta.actionAdvice[selectedResult.stageName]}
                </p>
              </div>

              {/* Questions Answered */}
              <div className="pt-2">
                <h4 className="font-bold text-[#0E1B33] uppercase tracking-wider text-[11px] mb-2">
                  Suas respostas neste pilar:
                </h4>
                <div className="space-y-2">
                  {selectedDimension.questions.map((q) => {
                    const chosenIdx = answers[q.id];
                    const chosenOpt = chosenIdx !== undefined ? q.options[chosenIdx] : null;

                    return (
                      <div key={q.id} className="p-3 rounded-lg border border-slate-200 bg-white">
                        <p className="font-semibold text-slate-800 text-[11px] mb-1">{q.title}</p>
                        <p className="text-[11px] text-[#8C6934] font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B68]" />
                          {chosenOpt ? chosenOpt.label : 'Não respondida'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedDimId(null);
                  onScheduleStrategicSession();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0E1B33] hover:bg-[#182C50] text-[#C59B68] py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#C59B68]" />
                Conversar sobre esta dimensão
              </button>
              <button
                type="button"
                onClick={() => setSelectedDimId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
