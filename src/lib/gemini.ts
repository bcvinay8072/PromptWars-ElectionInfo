import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API with environment validation
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is missing. Please set REACT_APP_GEMINI_API_KEY in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// Safety settings to ensure responsible AI usage
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Generation config for controlled, deterministic output
const generationConfig = {
  maxOutputTokens: 800,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
};

// Configure the model with safety and generation settings
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  safetySettings,
  generationConfig,
});

const SYSTEM_PROMPT = `
You are CivicSync Assistant, a helpful, unbiased, and highly accurate AI designed to guide citizens through the democratic electoral process.

CORE RULES:
1. NEVER show political bias, endorse candidates, or predict election outcomes.
2. NEVER provide legal advice — always recommend consulting official election authorities.
3. Focus ONLY on the process: registration, eligibility, polling stations, types of voting, and election timelines.
4. Keep answers concise, clear, and structured with bullet points when appropriate.
5. When uncertain, say so and direct users to official government election resources.
6. Always encourage civic participation while remaining neutral.

FORMATTING:
- Use bullet points for lists
- Bold key terms using **term**
- Keep responses under 300 words for readability
- End with a helpful follow-up suggestion when appropriate

KNOWLEDGE AREAS:
- Voter eligibility requirements
- Registration processes (online, in-person, mail)
- Polling station locations and hours
- Types of voting (in-person, absentee, early, mail-in)
- Required identification documents
- Election day procedures and rights
- Accessibility accommodations for voters with disabilities
`;

/**
 * Creates a new chat session with the election assistant.
 * Uses multi-turn conversation with system prompt priming.
 */
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
                parts: [{ text: "Understood. I am CivicSync Assistant, ready to help guide you through the election process. I will remain neutral, factual, and focused on electoral procedures. How can I assist you today?" }]
            }
        ],
      });
      return chat;
    } catch (error) {
        console.error("Failed to initialize Gemini chat:", error);
        return null;
    }
};

/**
 * Validates and sanitizes user input before sending to the API.
 * Prevents injection attacks and ensures clean input.
 */
export const sanitizeInput = (input: string): string => {
  // Remove potential HTML/script tags
  const sanitized = input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
  
  // Enforce maximum length
  return sanitized.substring(0, 1000);
};

/**
 * Rate limiter to prevent API abuse.
 * Implements a simple token bucket algorithm.
 */
class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;

  constructor(maxTokens: number = 10, refillRate: number = 1) {
    this.tokens = maxTokens;
    this.maxTokens = maxTokens;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }

  canMakeRequest(): boolean {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}

export const rateLimiter = new RateLimiter(10, 1);
