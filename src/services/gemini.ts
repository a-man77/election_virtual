/**
 * Gemini API Service
 * Handles communication with Google's Gemini AI model.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const askGemini = async (prompt: string, context: string = "") => {
  if (!GEMINI_API_KEY) {
    return "Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
  }

  const systemPrompt = `You are a non-partisan Election Process Assistant. 
  Your goal is to provide factual, accurate information about voter registration, deadlines, polling locations, and the election process.
  
  GUIDELINES:
  - Never express a political opinion or endorse any candidate or party.
  - Cite official sources (e.g., vote.gov, state Secretary of State websites) when possible.
  - If a question is about who to vote for, politely decline and offer factual information about how to research candidates.
  - Use the following context if provided: ${context}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get response from Gemini.");
  }
};
