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

  // Compute angles for regular hexagon (-90° top, -30° top-right, 30° bottom-right, 90° bottom, 150° bottom-left, 210° top-left)
  const anglesDeg = [-90, -30, 30, 90, 150, 210];
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
    // Map score 1.0..4.0 to radius (minimum 38px so it wraps the center badge neatly, max maxRadius)
    const minR = 38;
    const normalized = (score - 1.0) / 3.0; // 0 to 1
    const r = minR + normalized * (maxRadius - minR);
    const angle = anglesRad[i];
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, score, key, dim, angle };
  });

  const userPolygonPoints = userVertices.map(v => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');

  // Compute prioritized focuses based on lowest scores
  const sortedByScore = [...dimensionKeys].sort((a, b) => {
    const scoreA = dimensionResults[a]?.avg ?? 1;
    const scoreB = dimensionResults[b]?.avg ?? 1;
    return scoreA - scoreB;
  });

  const topPriorities = sortedByScore.slice(0, 3);

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
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-b from-[#FAF8F5]/80 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8C6934] bg-[#FAF6EE] px-3 py-1 rounded-md border border-[#E9D7BC]">
                MAPA DA PROSPERIDADE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E1B33] tracking-tight">
              Seu momento em cada dimensão
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Uma visão integrada da sua vida financeira, mostrando onde você está hoje e os próximos movimentos para construir a vida que deseja.
            </p>
          </div>

          {/* Right Brand Lockup & Script */}
          <div className="flex flex-col items-start md:items-end shrink-0 pt-2 md:pt-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-[#0E1B33]">MÉTODO MIL®</span>
              <span className="text-[10px] uppercase font-bold text-[#8C6934] tracking-wider bg-[#FAF6EE] px-2.5 py-0.5 rounded border border-[#E9D7BC]">
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

      {/* Section 1: Overview Grid (Left: Radar Hexagon + Legend | Right: Arc Gauge, Distribution & Focuses) */}
      <div className="p-6 sm:p-8 bg-[#FAF8F5]/30 border-b border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Hexagonal Radar Graph */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col items-center justify-between">
            <div className="w-full text-center sm:text-left mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C6934] bg-[#FAF6EE] px-2.5 py-0.5 rounded border border-[#E9D7BC]">
                VISÃO GEOMÉTRICA
              </span>
              <h3 className="text-lg font-bold text-[#0E1B33] mt-1">
                Roda da Prosperidade Integrada
              </h3>
            </div>

            {/* SVG Radar */}
            <div className="relative w-full max-w-[480px] mx-auto flex items-center justify-center my-2">
              <svg 
                viewBox="0 0 540 500" 
                className="w-full h-auto drop-shadow-xs select-none"
              >
                <defs>
                  <radialGradient id="radarGoldGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#C59B68" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#8C6934" stopOpacity="0.18" />
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
                    fillOpacity="0.5"
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
                  strokeWidth="2.8"
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
                      r="7.5"
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

                {/* Outer Axis Labels */}
                {dimensionKeys.map((key, i) => {
                  const meta = getDimensionMeta(key);
                  const result = dimensionResults[key];
                  const score = result ? result.avg : 1.0;
                  const angle = anglesRad[i];
                  const labelRadius = maxRadius + 32;
                  const lx = cx + labelRadius * Math.cos(angle);
                  const ly = cy + labelRadius * Math.sin(angle);

                  let textAnchor: 'start' | 'end' | 'middle' = 'middle';
                  if (Math.cos(angle) > 0.3) textAnchor = 'start';
                  else if (Math.cos(angle) < -0.3) textAnchor = 'end';

                  return (
                    <g 
                      key={`label-${key}`}
                      onClick={() => setSelectedDimId(key)}
                      className="cursor-pointer group"
                    >
                      <text
                        x={lx}
                        y={ly - 4}
                        textAnchor={textAnchor}
                        fontSize="11.5"
                        fontWeight="700"
                        fill="#0E1B33"
                        className="hover:fill-[#C59B68] transition-colors"
                      >
                        {meta.title}
                      </text>
                      <text
                        x={lx}
                        y={ly + 10}
                        textAnchor={textAnchor}
                        fontSize="10"
                        fontWeight="800"
                        fill="#8C6934"
                      >
                        {score.toFixed(1)} / 4.0
                      </text>
                    </g>
                  );
                })}

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

            {/* Radar Legend: Clean, balanced single row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 pt-3 border-t border-[#EFE5D5] w-full text-xs text-slate-600">
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

          {/* Right: Semicircular Gauge & Distribution */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Card: ÍNDICE GERAL DA PROSPERIDADE */}
            <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#EFE5D5]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8C6934]">
                  ÍNDICE GERAL DA PROSPERIDADE
                </h4>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#0E1B33] text-[#C59B68]">
                  ESTÁGIO: {overallStageTitle}
                </span>
              </div>

              {/* Semicircular Arc Gauge */}
              <div className="relative w-48 h-26 mx-auto flex items-end justify-center overflow-hidden my-1">
                <svg viewBox="0 0 160 85" className="w-full h-full">
                  <path
                    d="M 15 80 A 65 65 0 0 1 145 80"
                    fill="none"
                    stroke="#E9D7BC"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
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

                <div className="absolute bottom-1 text-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#0E1B33] leading-none block">
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
              <div className="mt-4 p-3 rounded-xl bg-white border border-[#E9D7BC] flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-[#FAF6EE] text-[#C59B68] shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                  Este é o seu ponto de partida estratégico. Com clareza e método, você pode avançar um estágio de cada vez.
                </p>
              </div>
            </div>

            {/* Card: SUA DISTRIBUIÇÃO ATUAL & FOCOS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8C6934]">
                  SUA DISTRIBUIÇÃO ATUAL
                </h4>
                <span className="text-[11px] text-slate-400 font-semibold">
                  Média por dimensão
                </span>
              </div>

              <div className="space-y-2.5">
                {dimensionKeys.map((key) => {
                  const meta = getDimensionMeta(key);
                  const result = dimensionResults[key];
                  const score = result ? result.avg : 1.0;

                  return (
                    <div 
                      key={key}
                      onClick={() => setSelectedDimId(key)}
                      className="flex items-center justify-between gap-3 text-xs cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors group"
                    >
                      <span className="font-semibold text-slate-700 w-22 shrink-0 group-hover:text-[#0E1B33]">
                        {meta.title}
                      </span>

                      {/* Horizontal Bar */}
                      <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#D4AF7A] to-[#C59B68] transition-all duration-700"
                          style={{ width: `${Math.max(15, (score / 4.0) * 100)}%` }}
                        />
                      </div>

                      <span className="font-bold text-[#0E1B33] w-12 text-right shrink-0">
                        {score.toFixed(1)} <span className="text-[10px] text-slate-400">/ 4</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Próximos Focos */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  PRÓXIMOS FOCOS PRIORITÁRIOS:
                </h5>
                <div className="space-y-2">
                  {topPriorities.map((key, idx) => {
                    const meta = getDimensionMeta(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedDimId(key)}
                        className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-[#FAF8F5]/80 hover:bg-[#FAF6EE] hover:border-[#E9D7BC] transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#C59B68] text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0E1B33]">
                            {meta.suggestedFocus}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#8C6934] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Section 2: Diagnóstico Detalhado das 6 Dimensões (Generous 3-Column Grid) */}
      <div className="p-6 sm:p-8 bg-white border-b border-slate-100">
        <div className="max-w-3xl mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8C6934] bg-[#FAF6EE] px-3 py-1 rounded-md border border-[#E9D7BC]">
            ANÁLISE DETALHADA
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E1B33] mt-2">
            Diagnóstico das 6 Dimensões do Método MIL
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Clique em cada dimensão para ver a interpretação completa do seu momento, as recomendações estratégicas e suas respostas.
          </p>
        </div>

        {/* 6 Dimensions in Spacious Grid (3 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dimensionKeys.map((key) => {
            const meta = getDimensionMeta(key);
            const dimDef = DIMENSIONS.find(d => d.id === key);
            const result = dimensionResults[key];
            const score = result ? result.avg : 1.0;
            const IconComponent = iconMap[key] || Coins;
            const percentage = (score / 4.0) * 100;

            return (
              <div
                key={key}
                onClick={() => setSelectedDimId(key)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#C59B68] hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon + Title + Score Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${meta.badgeBg} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                        <IconComponent className="w-5 h-5 text-amber-200" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-[#0E1B33] group-hover:text-[#8C6934] transition-colors block">
                          {meta.title}
                        </span>
                        <span className="text-[11px] text-slate-500 italic block leading-tight">
                          {dimDef?.subtitle || meta.suggestedFocus}
                        </span>
                      </div>
                    </div>

                    {/* Dedicated Score Badge (Guaranteed No Overflow) */}
                    <div className="flex items-center gap-1 bg-[#FAF6EE] text-[#0E1B33] px-2.5 py-1 rounded-lg border border-[#E9D7BC] shrink-0 font-mono">
                      <span className="text-sm font-black text-[#0E1B33]">{score.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">/ 4.0</span>
                    </div>
                  </div>

                  {/* Micro Progress Line with 4 Stage Steps */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-3 relative">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#D4AF7A] to-[#C59B68] transition-all duration-700"
                      style={{ width: `${Math.max(15, percentage)}%` }}
                    />
                  </div>

                  {/* Complete, Well-formatted Description */}
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[48px]">
                    {result?.description || meta.stageDescriptions.Sustentar}
                  </p>
                </div>

                {/* Bottom Bar: Stage Badge + Link */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6934] bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E9D7BC]">
                    {result?.stageName || 'Sustentar'}
                  </span>
                  <span className="text-[#8C6934] font-bold group-hover:text-[#0E1B33] group-hover:translate-x-1 transition-all flex items-center gap-1 whitespace-nowrap">
                    Ver detalhes →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: OS ESTÁGIOS DO SEU DESENVOLVIMENTO EM CADA DIMENSÃO */}
      <div className="p-6 sm:p-8 bg-[#FAF8F5]/50 border-b border-slate-100">
        <div className="text-center sm:text-left mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8C6934] bg-[#FAF6EE] px-3 py-1 rounded-md border border-[#E9D7BC]">
            ESCALA METODOLÓGICA
          </span>
          <h4 className="text-lg sm:text-xl font-extrabold text-[#0E1B33] mt-2">
            Os 4 Estágios do Desenvolvimento no Método MIL
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {/* Stage 1: Sustentar */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between text-center relative transition-all ${overallStageTitle === 'Sustentar' ? 'bg-[#FAF6EE] border-[#C59B68] shadow-sm ring-1 ring-[#C59B68]' : 'bg-white border-slate-200'}`}>
            {overallStageTitle === 'Sustentar' && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#0E1B33] text-[#C59B68]">
                Seu Nível Geral
              </span>
            )}
            <div>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E9D7BC] mx-auto flex items-center justify-center text-[#8C6934] mb-3 shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <h5 className="font-black text-xs text-[#0E1B33] uppercase tracking-wider">1. SUSTENTAR</h5>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Resolver o agora, conter vazamentos e garantir o essencial da sobrevivência.
              </p>
            </div>
          </div>

          {/* Stage 2: Organizar */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between text-center relative transition-all ${overallStageTitle === 'Organizar' ? 'bg-[#FAF6EE] border-[#C59B68] shadow-sm ring-1 ring-[#C59B68]' : 'bg-white border-slate-200'}`}>
            {overallStageTitle === 'Organizar' && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#0E1B33] text-[#C59B68]">
                Seu Nível Geral
              </span>
            )}
            <div>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E9D7BC] mx-auto flex items-center justify-center text-[#8C6934] mb-3 shadow-xs">
                <ListChecks className="w-5 h-5" />
              </div>
              <h5 className="font-black text-xs text-[#0E1B33] uppercase tracking-wider">2. ORGANIZAR</h5>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Estruturar rotinas, clarear números, criar base sólida e ganhar consistência.
              </p>
            </div>
          </div>

          {/* Stage 3: Construir */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between text-center relative transition-all ${overallStageTitle === 'Construir' ? 'bg-[#FAF6EE] border-[#C59B68] shadow-sm ring-1 ring-[#C59B68]' : 'bg-white border-slate-200'}`}>
            {overallStageTitle === 'Construir' && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#0E1B33] text-[#C59B68]">
                Seu Nível Geral
              </span>
            )}
            <div>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E9D7BC] mx-auto flex items-center justify-center text-[#8C6934] mb-3 shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h5 className="font-black text-xs text-[#0E1B33] uppercase tracking-wider">3. CONSTRUIR</h5>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Investir com estratégia, blindar reservas e multiplicar patrimônio produtivo.
              </p>
            </div>
          </div>

          {/* Stage 4: Expandir */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between text-center relative transition-all ${overallStageTitle === 'Expandir' ? 'bg-[#FAF6EE] border-[#C59B68] shadow-sm ring-1 ring-[#C59B68]' : 'bg-white border-slate-200'}`}>
            {overallStageTitle === 'Expandir' && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#0E1B33] text-[#C59B68]">
                Seu Nível Geral
              </span>
            )}
            <div>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E9D7BC] mx-auto flex items-center justify-center text-[#8C6934] mb-3 shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <h5 className="font-black text-xs text-[#0E1B33] uppercase tracking-wider">4. EXPANDIR</h5>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Alavancagem, governança executiva, geração de impacto e consolidação de legado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Final Strategic CTA Banner */}
      <div className="p-6 sm:p-8 bg-white border-b border-slate-100">
        <div className="bg-[#0E1B33] rounded-3xl p-6 sm:p-8 text-white border border-[#C59B68]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#0E1B33]/15">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C59B68] bg-[#FAF6EE]/10 px-3 py-1 rounded-md border border-[#C59B68]/30 inline-block mb-2">
              PRÓXIMO PASSO RECOMENDADO
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Pronto para transformar seu diagnóstico em um plano estratégico de evolução?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Agende uma sessão individual com um consultor executivo da Inspirar Finanças para aprofundar suas dimensões e traçar seu plano sob medida.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              id="btn-agenda-sessao-estrategica"
              type="button"
              onClick={onScheduleStrategicSession}
              className="w-full md:w-auto flex items-center justify-center gap-2.5 bg-[#C59B68] hover:bg-[#D4AF7A] text-[#0E1B33] font-extrabold py-4 px-6 rounded-2xl shadow-lg transition-all text-xs sm:text-sm cursor-pointer group"
            >
              <MessageCircle className="w-4 h-4 text-[#0E1B33]" />
              <span>Agendar Sessão Estratégica com a Inspirar Finanças</span>
              <ArrowRight className="w-4 h-4 text-[#0E1B33] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Brand Bar (from uploaded image) */}
      <div className="bg-[#0E1B33] text-white px-6 py-4.5 border-t border-[#C59B68]/40 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
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
