
import { GoogleGenAI } from "@google/genai";
import { Song } from '../types';

// Lazy initialization variable
let aiClient: GoogleGenAI | null = null;

// Helper to get or create the client instance safely
const getAiClient = (): GoogleGenAI | null => {
  if (aiClient) return aiClient;

  // Try to get key from process.env
  const apiKey = process.env.API_KEY;

  // If no key provided, return null instead of crashing
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return null;
  }

  try {
    aiClient = new GoogleGenAI({ apiKey: apiKey });
    return aiClient;
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    return null;
  }
};

export const generateVibeDescription = async (song: Song): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Graceful fallback if AI is not configured
    if (!ai) {
      console.info("Gemini API Key missing. Using offline fallback.");
      return "The community has spoken. A certified banger.";
    }
    
    const prompt = `
      You are a music curator for a cool, web3-native music app called "Music of Base".
      Write a short, catchy, 1-sentence "vibe check" description for a fictional song titled "${song.title}" by "${song.artist}".
      The description should sound like a music review or a mood setting.
      Keep it under 30 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    return response.text?.trim() || "A mysterious tune resonating across the chain.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "The community has spoken. A certified banger.";
  }
};

export const generateDailyTrivia = async (): Promise<string> => {
   try {
    const ai = getAiClient();
    if (!ai) return "Music is the universal language of the decentralized web.";

    const prompt = `
      Give me one interesting, short fact about the intersection of music and technology (or blockchain).
      Max 20 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Music is the universal language of the decentralized web.";
  } catch (error) {
    return "Did you know? Music NFTs are changing artist royalties forever.";
  }
}
