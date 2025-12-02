// FIX: Updated to align with @google/genai guidelines.
// Removed `Schema` from import as it is not part of the recommended API.
import { GoogleGenAI, Type } from "@google/genai";
import { DreamAnalysis } from "../types";

// FIX: Per guideline, the API key must be obtained exclusively from `process.env.API_KEY`.
// The conditional check and fallback key have been removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Removed `Schema` type annotation. The type is inferred.
const dreamAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative, mystical title for the dream." },
    dreamLevel: { type: Type.INTEGER, description: "Intensity level of the dream from 1 (Mundane) to 5 (Lucid/Prophetic/Night Terror)." },
    dreamLevelLabel: { type: Type.STRING, description: "Label for the level, e.g., 'Surface Processing', 'Deep Subconscious', 'Archetypal'." },
    summary: { type: Type.STRING, description: "A concise summary of the dream narrative." },
    interpretation: { type: Type.STRING, description: "A deep, professional psychoanalytic interpretation (Freudian/Jungian/Gestalt)." },
    symbols: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          meaning: { type: Type.STRING },
          archetype: { type: Type.STRING, description: "The Jungian archetype associated with this symbol if applicable." },
        },
        required: ["name", "meaning", "archetype"]
      }
    },
    psychologicalState: {
      type: Type.OBJECT,
      properties: {
        stressLevel: { type: Type.INTEGER, description: "Estimated stress level of the dreamer (0-100) based on dream content." },
        burnoutRisk: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Severe"] },
        emotions: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of 3-5 specific emotions felt by the dreamer during the dream (e.g., 'Anxiety', 'Euphorria', 'Confusion')." 
        },
      },
      required: ["stressLevel", "burnoutRisk", "emotions"]
    },
    healthReport: {
      type: Type.OBJECT,
      properties: {
        sleepQualityLikelihood: { type: Type.STRING, description: "Assessment of likely sleep quality." },
        suggestedBedtimeRoutine: { type: Type.STRING, description: "Actionable advice to improve sleep based on this dream type." },
        wakingLifeCorrelation: { type: Type.STRING, description: "How this dream connects to potential waking life events." },
      },
      required: ["sleepQualityLikelihood", "suggestedBedtimeRoutine", "wakingLifeCorrelation"]
    }
  },
  required: ["title", "dreamLevel", "dreamLevelLabel", "summary", "interpretation", "symbols", "psychologicalState", "healthReport"]
};

const MOCK_ANALYSIS: DreamAnalysis = {
  title: "Simulation: API Limit Reached",
  dreamLevel: 3,
  dreamLevelLabel: "Simulation Mode",
  summary: "The AI service is currently experiencing high traffic (Quota Exceeded). This is a simulated analysis to demonstrate the application's features without consuming API credits.",
  interpretation: "In a real analysis, this section would contain a deep Freudian or Jungian interpretation of your specific dream text. Currently, we are showing a placeholder to preserve functionality during high load. The application interface, charts, and export functions remain fully operational.",
  symbols: [
    { name: "Hourglass", meaning: "The passage of time and patience required.", archetype: "Father Time" },
    { name: "Wall", meaning: "A temporary barrier or limitation encountered.", archetype: "The Threshold Guardian" },
    { name: "Key", meaning: "The potential to unlock access once the barrier is removed.", archetype: "The Hero" }
  ],
  psychologicalState: {
    stressLevel: 42,
    burnoutRisk: "Low",
    emotions: ["Patience", "Determination", "Hope"]
  },
  healthReport: {
    sleepQualityLikelihood: "Likely Uninterrupted",
    suggestedBedtimeRoutine: "Practice mindfulness breathing to reduce frustration with technical limits.",
    wakingLifeCorrelation: "You may be encountering temporary restrictions in your daily life or work."
  }
};

export const analyzeDream = async (dreamText: string, userContext?: string, sleepQuality?: number): Promise<DreamAnalysis> => {
  const systemInstruction = `
    You are a world-renowned Oneirologist with 25+ years of experience in psychoanalysis, neuroscience, and dream interpretation. 
    You combine the analytical precision of Freud and Jung with modern sleep science.
    
    Your task is to analyze a user's dream description.
    
    DREAM LEVELS GUIDE:
    Level 1: Surface Processing (Day residue, mundane tasks, low emotion).
    Level 2: Symbolic Sorting (Working through recent mild emotions, confusing but not intense).
    Level 3: Deep Subconscious (Vivid symbols, strong emotions, childhood memories, archetypes).
    Level 4: High Intensity / Lucid (Awareness within dream, flying, extreme vividness, or intense nightmares).
    Level 5: Transcendental / Night Terror (Life-altering impact, sleep paralysis, prophetic feeling, extreme physiological response).

    Provide a professional, empathetic, and insightful report. Be precise in your symbolism.
  `;

  const prompt = `
    Analyze the following dream description:
    "${dreamText}"
    
    ${userContext ? `Additional Context from Dreamer: ${userContext}` : ''}
    ${sleepQuality ? `User Reported Sleep Quality prior to dream: ${sleepQuality}/5 (1=Poor, 5=Excellent). Use this to refine the physiological and health analysis, specifically correlating poor sleep with stress/burnout markers if applicable.` : ''}
    
    Provide the output strictly in JSON format matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: dreamAnalysisSchema,
        temperature: 0.7, 
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
        throw new Error("No response received from AI");
    }
    
    return JSON.parse(textResponse) as DreamAnalysis;

  } catch (error: any) {
    console.error("Error analyzing dream:", error);
    
    // Handle 429 Resource Exhausted or other quota errors gracefully
    if (
      (error.message && (error.message.includes('429') || error.message.includes('quota'))) ||
      error.status === 429 ||
      (error.error && error.error.code === 429)
    ) {
      console.warn("Gemini API Quota Exceeded. Switching to mock data.");
      return MOCK_ANALYSIS;
    }

    throw new Error("Failed to analyze the dream. Please try again.");
  }
};