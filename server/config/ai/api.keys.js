import dotenv from 'dotenv';
dotenv.config();

// Securely loaded from the backend environment
// NEVER expose these to the frontend
export const apiKeys = {
    gemini: process.env.GEMINI_API_KEY || '',
    openai: process.env.OPENAI_API_KEY || '',
    anthropic: process.env.ANTHROPIC_API_KEY || '',
};

export const getGeminiKey = () => apiKeys.gemini;
export const getOpenAIKey = () => apiKeys.openai;
export const getAnthropicKey = () => apiKeys.anthropic;
