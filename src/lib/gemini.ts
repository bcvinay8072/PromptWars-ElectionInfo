import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is missing. Please set REACT_APP_GEMINI_API_KEY in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// We will use the recommended model for chat
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `
You are Civic Assistant, a helpful, unbiased, and highly accurate AI designed to guide users through the electoral process. 
Your goal is to simplify complex election procedures, explain timelines, and help users understand their rights and requirements.
Do not show political bias, endorse candidates, or predict election outcomes.
Focus entirely on the process: registration, eligibility, polling stations, types of voting, and election timelines.
Keep your answers concise, clear, and easy to read.
`;

export const getElectionAssistantChat = () => {
    try {
      const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "System prompt: " + SYSTEM_PROMPT }]
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am Civic Assistant, ready to help guide you through the election process." }]
            }
        ],
        generationConfig: {
          maxOutputTokens: 500,
        },
      });
      return chat;
    } catch (error) {
        console.error("Failed to initialize Gemini chat:", error);
        return null;
    }
};
