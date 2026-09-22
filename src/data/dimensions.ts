import { 
  TrendingUp, 
  Calculator, 
  Shield, 
  Building2, 
  Compass, 
  Award 
} from 'lucide-react';
import type { Dimension } from '../types';

export const PRIMARY_GOALS: string[] = [
  'Construir patrimônio sólido',
  'Aumentar capacidade de gerar renda',
  'Garantir mais segurança e reserva',
  'Criar renda futura / passiva',
  'Expandir meu negócio ou atividade profissional',
  'Ter mais liberdade de tempo',
  'Preparar aposentadoria / independência'
];

export const DIMENSIONS: Dimension[] = [
  {
    id: 'renda',
    title: '1. Renda',
    subtitle: 'Minha capacidade de gerar',
    icon: TrendingUp,
    color: 'emerald',
    questions: [
      {
        id: 'renda_atual',
        title: 'Hoje, como você avalia sua capacidade de gerar renda?',
        options: [
          { label: 'Minha renda ainda é insuficiente para sustentar com tranquilidade minha vida atual.', score: 1 },
          { label: 'Minha renda sustenta minha vida, mas sobra pouco para outros objetivos.', score: 2 },
          { label: 'Tenho alguma capacidade de poupar/investir, mas sem consistência.', score: 3 },
          { label: 'Minha renda já permite investir regularmente.', score: 4 },
          { label: 'Minha renda sustenta meu presente e tenho estratégia clara para ampliá-la.', score: 4 }
        ]
      },
      {
        id: 'renda_expansao',
        title: 'Se você quisesse aumentar sua renda em 30% nos próximos 12 meses, hoje saberia de onde esse aumento poderia vir?',
        options: [
          { label: 'Não faço ideia.', score: 1 },
          { label: 'Provavelmente teria que trabalhar mais.', score: 2 },
          { label: 'Tenho algumas possibilidades, mas ainda não as avaliei.', score: 2 },
          { label: 'Tenho caminhos identificados.', score: 3 },
          { label: 'Tenho uma estratégia em execução.', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'estrutura',
    title: '2. Estrutura',
    subtitle: 'Quanto da minha renda está comprometido com o presente?',
    icon: Calculator,
    color: 'blue',
    questions: [
      {
        id: 'estrutura_sobra',
        title: 'Depois de pagar sua estrutura de vida e compromissos mensais, o que normalmente acontece com sua renda?',
        options: [
          { label: 'Falta dinheiro.', score: 1 },
          { label: 'Praticamente não sobra.', score: 2 },
          { label: 'Sobra, mas sem destino definido.', score: 2 },
          { label: 'Uma parte é direcionada para objetivos/investimentos.', score: 3 },
          { label: 'Tenho percentuais ou valores planejados para presente, objetivos e patrimônio.', score: 4 }
        ]
      },
      {
        id: 'estrutura_custo',
        title: 'Você sabe quanto custa manter a vida que possui hoje?',
        options: [
          { label: 'Não sei exatamente.', score: 1 },
          { label: 'Tenho uma estimativa geral.', score: 2 },
          { label: 'Sei o valor aproximado dos meus gastos mensais.', score: 3 },
          { label: 'Sei e utilizo esse número para tomar decisões financeiras.', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'seguranca',
    title: '3. Segurança',
    subtitle: 'Quanto tempo minha vida se sustenta sem minha renda?',
    icon: Shield,
    color: 'indigo',
    questions: [
      {
        id: 'seguranca_reserva',
        title: 'Se sua principal fonte de renda parasse hoje, por quanto tempo sua estrutura atual poderia ser mantida sem recorrer a crédito?',
        options: [
          { label: 'Menos de 1 mês', score: 1 },
          { label: '1 a 3 meses', score: 2 },
          { label: '3 a 6 meses', score: 3 },
          { label: '6 a 12 meses', score: 4 },
          { label: 'Mais de 12 meses', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'patrimonio',
    title: '4. Patrimônio',
    subtitle: 'O que minha renda já construiu?',
    icon: Building2,
    color: 'amber',
    questions: [
      {
        id: 'patrimonio_liquido',
        title: 'Hoje você sabe aproximadamente qual é o seu patrimônio líquido? (Bens e recursos financeiros menos obrigações/dívidas)',
        options: [
          { label: 'Não sei', score: 1 },
          { label: 'Tenho uma ideia', score: 2 },
          { label: 'Sei aproximadamente', score: 3 },
          { label: 'Acompanho periodicamente', score: 4 },
          { label: 'Acompanho e tenho meta patrimonial definida', score: 4 }
        ]
      },
      {
        id: 'patrimonio_evolucao',
        title: 'Nos últimos 12 meses, seu patrimônio:',
        options: [
          { label: 'Diminuiu', score: 1 },
          { label: 'Ficou praticamente igual', score: 2 },
          { label: 'Cresceu, mas não sei quanto', score: 2 },
          { label: 'Cresceu e acompanho', score: 3 },
          { label: 'Cresceu conforme uma estratégia definida', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'expansao',
    title: '5. Expansão',
    subtitle: 'Estou usando minha capacidade para criar novas possibilidades?',
    icon: Compass,
    color: 'violet',
    questions: [
      {
        id: 'expansao_momento',
        title: 'Quando você pensa em aumentar seus resultados financeiros, qual alternativa mais representa seu momento?',
        options: [
          { label: 'Preciso primeiro conseguir pagar tudo.', score: 1 },
          { label: 'Minha principal saída seria trabalhar mais horas.', score: 2 },
          { label: 'Sei que poderia ganhar mais, mas ainda não encontrei a melhor estratégia.', score: 2 },
          { label: 'Estou desenvolvendo novas fontes de renda ou ampliando minha atividade atual.', score: 3 },
          { label: 'Tenho estratégia definida para ampliar renda e patrimônio.', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'lideranca',
    title: '6. Liderança',
    subtitle: 'Eu transformo intenção em decisão?',
    icon: Award,
    color: 'rose',
    questions: [
      {
        id: 'lideranca_meta',
        title: 'Quando define uma meta financeira importante, o que costuma acontecer?',
        options: [
          { label: 'Normalmente não chego a transformá-la em plano.', score: 1 },
          { label: 'Começo, mas tenho dificuldade de manter.', score: 2 },
          { label: 'Faço movimentos, porém sem acompanhar indicadores.', score: 2 },
          { label: 'Tenho plano e acompanho parte dos resultados.', score: 3 },
          { label: 'Defino, acompanho, reviso e ajusto minhas decisões.', score: 4 }
        ]
      },
      {
        id: 'lideranca_numero',
        title: 'Hoje existe uma meta financeira que consegue dizer em número + prazo?',
        options: [
          { label: 'Não', score: 1 },
          { label: 'Tenho uma ideia', score: 2 },
          { label: 'Tenho o valor', score: 3 },
          { label: 'Tenho valor e prazo', score: 4 },
          { label: 'Tenho valor, prazo e plano de execução', score: 4 }
        ]
      }
    ]
  }
];

export const BUSINESS_QUESTIONS: string[] = [
  'Você separa completamente o dinheiro pessoal do dinheiro da atividade profissional?',
  'Você sabe quanto seu negócio precisa faturar para pagar todos os custos e ainda remunerar você adequadamente?',
  'Sua retirada/pró-labore foi definida com base na capacidade financeira do negócio ou conforme sua necessidade pessoal?',
  'Você conhece a margem real dos principais serviços que oferece?',
  'Hoje, o negócio consegue simultaneamente remunerar você, manter sua operação e formar recursos para crescer?',
  'O seu negócio está ajudando você a construir patrimônio pessoal ou apenas financiando seu custo de vida?'
];

export interface DimensionMeta {
  id: string;
  orderNumber: number;
  title: string;
  shortTitle: string;
  badgeBg: string;
  badgeBorder: string;
  badgeIconColor: string;
  suggestedFocus: string;
  stageDescriptions: {
    Sustentar: string;
    Organizar: string;
    Construir: string;
    Expandir: string;
  };
  actionAdvice: {
    Sustentar: string;
    Organizar: string;
    Construir: string;
    Expandir: string;
  };
}

export const DIMENSION_METADATA: Record<string, DimensionMeta> = {
  renda: {
    id: 'renda',
    orderNumber: 1,
    title: '1. Renda',
    shortTitle: 'Renda',
    badgeBg: 'bg-[#0E1B33]',
    badgeBorder: 'border-[#1E2E56]',
    badgeIconColor: 'text-[#C59B68]',
    suggestedFocus: 'Fortalecer a base da sua renda',
    stageDescriptions: {
      Sustentar: 'A renda ainda está predominantemente dedicada ao presente.',
      Organizar: 'A renda sustenta o custo de vida, mas ainda com pouca margem livre para acúmulo contínuo.',
      Construir: 'A renda gera excedentes regulares que alimentam investimentos e objetivos de médio e longo prazo.',
      Expandir: 'Capacidade consolidada de gerar múltiplos fluxos de renda e alavancar ganhos estrategicamente.'
    },
    actionAdvice: {
      Sustentar: 'Mapear imediatamente a relação entre horas trabalhadas e valor da hora gerada, identificando vazamentos de energia e custos.',
      Organizar: 'Identificar habilidades secundárias ou novos serviços de maior margem para gerar uma rota de aumento de até 30%.',
      Construir: 'Automatizar o percentual de investimento no exato momento da entrada da renda (Pague-se Primeiro).',
      Expandir: 'Desenvolver produtos de escala, parcerias societárias ou ativos que desvinculem a renda direta do seu tempo operacional.'
    }
  },
  estrutura: {
    id: 'estrutura',
    orderNumber: 2,
    title: '2. Estrutura',
    shortTitle: 'Estrutura',
    badgeBg: 'bg-[#0F766E]',
    badgeBorder: 'border-[#115E59]',
    badgeIconColor: 'text-emerald-300',
    suggestedFocus: 'Organizar sua estrutura financeira',
    stageDescriptions: {
      Sustentar: 'Compromissos fixos e custo de vida consomem praticamente tudo o que entra.',
      Organizar: 'Você conhece os números gerais, mas ainda falta um orçamento preditivo por percentuais.',
      Construir: 'Estrutura equilibrada com percentuais definidos para viver o presente, proteger e construir.',
      Expandir: 'Governança financeira de alto padrão, com previsibilidade de fluxo de caixa e otimização total.'
    },
    actionAdvice: {
      Sustentar: 'Definir o Custo Real de Vida e renegociar despesas recorrentes que não geram retorno ou bem-estar.',
      Organizar: 'Adotar a regra dos percentuais estratégicos do Método MIL (Presente, Objetivos, Patrimônio).',
      Construir: 'Realizar fechamentos mensais de indicadores de eficiência financeira para readequar despesas supérfluas.',
      Expandir: 'Planejar eficiência tributária, sucessória e alocação patrimonial em estruturas familiares ou empresariais.'
    }
  },
  seguranca: {
    id: 'seguranca',
    orderNumber: 3,
    title: '3. Segurança',
    shortTitle: 'Segurança',
    badgeBg: 'bg-[#065F46]',
    badgeBorder: 'border-[#047857]',
    badgeIconColor: 'text-emerald-300',
    suggestedFocus: 'Construir sua segurança e reservas',
    stageDescriptions: {
      Sustentar: 'Reserva de liquidez inexistente ou inferior a 1 mês de custo de vida.',
      Organizar: 'Reserva em formação cobrindo de 1 a 3 meses de despesas básicas, ainda sensível a imprevistos.',
      Construir: 'Colchão de liquidez sólido cobrindo de 3 a 6 meses de tranquilidade em ativos seguros.',
      Expandir: 'Segurança plena cobrindo de 6 a 12+ meses combinada com blindagem securitária e jurídica.'
    },
    actionAdvice: {
      Sustentar: 'Separar uma conta específica fora do banco do dia a dia e iniciar a meta da Reserva de Paz (1 mês de custos essenciais).',
      Organizar: 'Definir um aporte mensal inviolável até atingir 3 meses de tranquilidade financeira.',
      Construir: 'Calibrar a rentabilidade da reserva em ativos pós-fixados líquidos e avaliar seguros de renda e vida adequados.',
      Expandir: 'Estruturar estratégias de diversificação internacional e proteção de ativos contra volatilidades sistêmicas.'
    }
  },
  patrimonio: {
    id: 'patrimonio',
    orderNumber: 4,
    title: '4. Patrimônio',
    shortTitle: 'Patrimônio',
    badgeBg: 'bg-[#1E3A8A]',
    badgeBorder: 'border-[#1D4ED8]',
    badgeIconColor: 'text-sky-300',
    suggestedFocus: 'Planejar a formação de patrimônio',
    stageDescriptions: {
      Sustentar: 'Patrimônio líquido embrionário, sem acompanhamento periódico de ativos e passivos.',
      Organizar: 'Primeiras medições de patrimônio líquido realizadas, com eliminação gradual de dívidas onerosas.',
      Construir: 'Patrimônio em crescimento acelerado por meio de ativos geradores de renda e metas claras.',
      Expandir: 'Patrimônio maduro e diversificado, gerando renda passiva perpétua e estabilidade geracional.'
    },
    actionAdvice: {
      Sustentar: 'Calcular seu Balanço Patrimonial Pessoal: listar todos os bens reais menos financiamentos e dívidas.',
      Organizar: 'Estipular uma meta anual de valorização do Patrimônio Líquido com revisão semestral.',
      Construir: 'Acelerar a migração de recursos da renda ativa para ativos geradores de proventos e valorização.',
      Expandir: 'Implementar governança patrimonial avançada, holdings e diversificação multi-mercado.'
    }
  },
  expansao: {
    id: 'expansao',
    orderNumber: 5,
    title: '5. Expansão',
    shortTitle: 'Expansão',
    badgeBg: 'bg-[#581C87]',
    badgeBorder: 'border-[#6B21A8]',
    badgeIconColor: 'text-purple-300',
    suggestedFocus: 'Desenvolver novos canais e expansão',
    stageDescriptions: {
      Sustentar: 'Foco quase total na sustentação do momento, sem margem mental para projetos de expansão.',
      Organizar: 'Ideias e oportunidades identificadas, mas que ainda não foram convertidas em rotas de ação.',
      Construir: 'Execução de novos projetos, produtos ou serviços que ampliam o alcance profissional.',
      Expandir: 'Escala consolidada, multiplicação de impacto e consolidação de legado profissional/empresarial.'
    },
    actionAdvice: {
      Sustentar: 'Identificar tarefas operacionais que consomem seu tempo e não geram retorno direto de renda.',
      Organizar: 'Validar 1 rota de expansão profissional nos próximos 90 dias com baixo custo de teste.',
      Construir: 'Estabelecer parcerias estratégicas e canais de atração de clientes de maior poder aquisitivo.',
      Expandir: 'Criar modelos de negócio baseados em equity, franqueamento, licenciamento ou liderança setorial.'
    }
  },
  lideranca: {
    id: 'lideranca',
    orderNumber: 6,
    title: '6. Liderança',
    shortTitle: 'Liderança',
    badgeBg: 'bg-[#854D0E]',
    badgeBorder: 'border-[#A16207]',
    badgeIconColor: 'text-amber-300',
    suggestedFocus: 'Traduzir intenções em governança e metas',
    stageDescriptions: {
      Sustentar: 'Dificuldade em transformar desejos financeiros em planos objetivos e prazos realizáveis.',
      Organizar: 'Metas gerais estabelecidas, mas com oscilações no acompanhamento e no cumprimento.',
      Construir: 'Metas com número, prazo e rotina de prestação de contas pessoal sendo cumpridas.',
      Expandir: 'Liderança executiva da própria trajetória financeira, com tomada de decisão serena e visão de legado.'
    },
    actionAdvice: {
      Sustentar: 'Escrever 1 meta financeira prioritária com valor e data-limite exata para os próximos 6 meses.',
      Organizar: 'Reservar 30 minutos a cada 15 dias para uma Sessão de Governança Pessoal/Familiar de revisão.',
      Construir: 'Contar com mentoria ou assessoria especializada para validar decisões estratégicas de alocação.',
      Expandir: 'Instituir conselho familiar ou diretrizes de perpetuidade de valores e propósito patrimonial.'
    }
  }
};

export function getDimensionMeta(dimId: string): DimensionMeta {
  return DIMENSION_METADATA[dimId] || {
    id: dimId,
    orderNumber: 1,
    title: dimId,
    shortTitle: dimId,
    badgeBg: 'bg-[#0E1B33]',
    badgeBorder: 'border-[#1E2E56]',
    badgeIconColor: 'text-[#C59B68]',
    suggestedFocus: `Evoluir dimensão ${dimId}`,
    stageDescriptions: {
      Sustentar: 'A renda ainda está predominantemente dedicada ao presente.',
      Organizar: 'Estágio de organização e estruturação de bases.',
      Construir: 'Construção ativa de resultados consistentes.',
      Expandir: 'Maturidade de expansão e legado.'
    },
    actionAdvice: {
      Sustentar: 'Estruturar o presente para garantir o essencial.',
      Organizar: 'Ganhar consistência nas decisões financeiras.',
      Construir: 'Investir e ampliar resultados.',
      Expandir: 'Multiplicar capital e gerar impacto.'
    }
  };
}

