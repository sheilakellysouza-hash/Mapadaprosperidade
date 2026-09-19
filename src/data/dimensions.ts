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
