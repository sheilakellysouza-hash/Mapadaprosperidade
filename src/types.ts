import type { LucideIcon } from 'lucide-react';

export interface Option {
  label: string;
  score: number;
}

export interface Question {
  id: string;
  title: string;
  options: Option[];
}

export interface Dimension {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  questions: Question[];
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  primaryGoal: string;
}

export type StageName = 'Sustentar' | 'Organizar' | 'Construir' | 'Expandir';

export interface DimensionResult {
  title: string;
  subtitle: string;
  avg: number;
  stageNum: number;
  stageName: StageName;
  description: string;
}

export interface Recommendation {
  title: string;
  desc: string;
  product: string;
}

export type BusinessChoice = 'yes' | 'no' | null;

export interface SubmissionRecord {
  id: string;
  createdAt: string;
  lead: LeadData;
  answers: Record<string, number>;
  businessChoice: BusinessChoice;
  businessAns: Record<number, string>;
  dimensionResults: Record<string, DimensionResult>;
  recommendation: Recommendation;
  overallAvg: number;
}

export type AppStep = 'welcome' | 'lead' | 'quiz' | 'business' | 'result';
