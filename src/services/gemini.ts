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

  const systemPrompt = `You are a non-partisan Election Process Assistant for India. 
  Your goal is to provide factual, accurate information about voter registration (Voter ID/EPIC), deadlines, polling locations, and the election process in India.
  
  GUIDELINES:
  - Never express a political opinion or endorse any candidate or party.
  - Cite official sources (e.g., eci.gov.in, Voter Service Portal - voters.eci.gov.in) when possible.
  - Explain concepts like Lok Sabha, Rajya Sabha, Vidhan Sabha, and the role of the Election Commission of India.
  - If a question is about who to vote for, politely decline and offer factual information about how to research candidates via the 'Know Your Candidate' (KYC) app or ECI website.
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
