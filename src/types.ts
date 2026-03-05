import { Type } from "@google/genai";

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export interface RiskMitigation {
  risk: string;
  explanation: string;
  mitigation: string;
  costImpact: string;
  delayRisk: string;
}

export interface SupplyChainRisk {
  stage: string;
  riskDescription: string;
  score: RiskLevel;
}

export interface AnalysisResult {
  regulatoryOverview: {
    authority: string;
    laws: string[];
    registrationRequired: boolean;
    summary: string;
  };
  originRisks: string[];
  destinationRisks: string[];
  supplyChainTable: SupplyChainRisk[];
  mitigationPlan: RiskMitigation[];
  answersToQuestions: {
    question: string;
    answer: string;
  }[];
  regionalContext: string;
  finalRiskScore: RiskLevel;
  overallSummary: string;
}

export const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    regulatoryOverview: {
      type: Type.OBJECT,
      properties: {
        authority: { type: Type.STRING },
        laws: { type: Type.ARRAY, items: { type: Type.STRING } },
        registrationRequired: { type: Type.BOOLEAN },
        summary: { type: Type.STRING }
      },
      required: ["authority", "laws", "registrationRequired", "summary"]
    },
    originRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
    destinationRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
    supplyChainTable: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stage: { type: Type.STRING },
          riskDescription: { type: Type.STRING },
          score: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] }
        },
        required: ["stage", "riskDescription", "score"]
      }
    },
    mitigationPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          risk: { type: Type.STRING },
          explanation: { type: Type.STRING },
          mitigation: { type: Type.STRING },
          costImpact: { type: Type.STRING },
          delayRisk: { type: Type.STRING }
        },
        required: ["risk", "explanation", "mitigation", "costImpact", "delayRisk"]
      }
    },
    answersToQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        },
        required: ["question", "answer"]
      }
    },
    regionalContext: { type: Type.STRING },
    finalRiskScore: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
    overallSummary: { type: Type.STRING }
  },
  required: [
    "regulatoryOverview",
    "originRisks",
    "destinationRisks",
    "supplyChainTable",
    "mitigationPlan",
    "answersToQuestions",
    "regionalContext",
    "finalRiskScore",
    "overallSummary"
  ]
};
