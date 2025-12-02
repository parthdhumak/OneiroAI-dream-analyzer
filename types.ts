export interface SymbolAnalysis {
  name: string;
  meaning: string;
  archetype: string;
}

export interface DreamAnalysis {
  id?: string;        // Unique ID for history
  timestamp?: number; // Date saved
  title: string;
  dreamLevel: number; // 1-5
  dreamLevelLabel: string;
  summary: string;
  interpretation: string;
  symbols: SymbolAnalysis[];
  psychologicalState: {
    stressLevel: number; // 0-100
    burnoutRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
    emotions: string[];
  };
  healthReport: {
    sleepQualityLikelihood: string;
    suggestedBedtimeRoutine: string;
    wakingLifeCorrelation: string;
  };
}

export enum AnalysisState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}