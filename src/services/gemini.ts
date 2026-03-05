import { GoogleGenAI } from "@google/genai";
import { ANALYSIS_SCHEMA, AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `You are a senior FMCG regulatory compliance expert with 30+ years experience in Latin American supply chains, import regulation, and product compliance.
Your task is to analyze FMCG compliance risks for a product entering or being produced within Latin American markets.

Consider regional regulatory authorities:
- Mexico: COFEPRIS, SAT
- Brazil: ANVISA
- Colombia: INVIMA, DIAN
- Argentina: ANMAT
- Chile: ISP

Follow these steps:
1. Identify regulatory framework (Authority, Laws, Registration status).
2. Country of Origin Risk (Manufacturing, Labeling, Health certs, Export docs).
3. Destination Market Risk (Import licensing, Customs, Local labeling, Taxes).
4. Supply Chain Risk Mapping (Production to Retail).
5. Risk Scoring (LOW, MEDIUM, HIGH, CRITICAL).
6. Risk Mitigation (Explanation, Action, Cost, Delay).
7. Regional Context (Mercosur, Andean Community, Informal risks, Enforcement).
8. Answer User Questions (Top 5).

Output MUST be valid JSON matching the provided schema.`;

export async function analyzeCompliance(
  productType: string,
  origin: string,
  destination: string,
  questions: string,
  files: { data: string; mimeType: string }[]
): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  const prompt = `
    Product Type: ${productType}
    Country of Origin: ${origin}
    Country of Destination: ${destination}
    User Questions: ${questions}
    
    Analyze the compliance risks for this scenario based on the provided documents and your expertise.
  `;

  const parts = [
    { text: prompt },
    ...files.map(f => ({
      inlineData: {
        data: f.data.split(',')[1], // Remove data:mime;base64,
        mimeType: f.mimeType
      }
    }))
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [{ parts }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text);
}
