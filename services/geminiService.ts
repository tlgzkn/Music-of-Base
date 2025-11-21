
import { GoogleGenAI } from "@google/genai";
import { Song } from '../types';

// Lazy initialization variable
let aiClient: GoogleGenAI | null = null;

// Helper to get or create the client instance safely
const getAiClient = () => {
  if (!aiClient) {
    // Try to get key from process.env (polyfilled by Vite)
    // Fallback to empty string to allow instantiation without crashing immediately
    const apiKey = process.env.API_KEY || "";
    // Only create client if we have a string (even empty), preventing undefined errors
    aiClient = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiClient;
};

export const generateVibeDescription = async (song: Song): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    // If no key provided at build/runtime, skip API call to avoid 400 errors
    if (!apiKey) {
      console.warn("API Key is missing. Using fallback description.");
      return "The community has spoken. A certified banger.";
    }

    const ai = getAiClient();
    
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
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "Music is the universal language of the decentralized web.";

    const ai = getAiClient();

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
