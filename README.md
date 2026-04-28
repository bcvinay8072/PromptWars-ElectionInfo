# CivicSync: The Intelligent Election Guide

**CivicSync** is an interactive, AI-powered web application designed to help users navigate the complex electoral process with ease and confidence. Built specifically for the PromptWars Virtual Challenge.

## Chosen Vertical
**Election Process Education** - Creating an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

## Approach and Logic
To meet the challenge expectations of building a "smart, dynamic assistant" with an "interactive and easy-to-follow" experience, CivicSync implements a three-pronged approach:

1. **The Smart Assistant (Gemini API Integration):**
   - **Logic**: We utilized the `@google/generative-ai` SDK to integrate the Gemini 1.5 Flash model. We implemented a strict system prompt to ensure the AI acts as an unbiased, highly accurate "Civic Assistant." It specifically avoids political bias or predictions and focuses purely on educational processes (registration, polling rules, eligibility).
   - **Value**: Provides real-time, personalized context and answers to users without them having to search through dense government websites.

2. **The Interactive Voter Journey:**
   - **Logic**: We built a scroll-linked, state-driven timeline component (`VoterTimeline.tsx`) using React and Framer Motion. This breaks down the daunting election process into 4 digestible steps: Eligibility, Registration, Finding the Polling Station, and Election Day.
   - **Value**: Gamifies the learning experience and provides a clear, visual roadmap.

3. **Polling Station Visualizer (Google Maps):**
   - **Logic**: Integrated a Google Maps Embed iframe (`PollingStation.tsx`) that dynamically updates a search query based on user input (e.g., zip code). 
   - **Value**: Satisfies the requirement for meaningful Google Services integration while providing practical, real-world usability for voters trying to find their polling location.

## How the Solution Works
- **Tech Stack**: React 18, TypeScript, Vanilla CSS (Custom Glassmorphism Design System), Google Gemini API, Lucide React (Icons), Framer Motion (Animations).
- **Architecture**: A single-page application where the UI is divided into a main content area (Timeline and Map) and a persistent AI Assistant sidebar. 
- **Setup**: 
  1. Clone the repository.
  2. Run `npm install`.
  3. Create a `.env` file and add `REACT_APP_GEMINI_API_KEY=your_api_key`.
  4. Run `npm start`.

## Assumptions Made
1. **API Keys**: It is assumed the user running this locally will have access to a Google Gemini API key. 
2. **Generic Maps Query**: Due to the lack of a specific Maps API key in the submission environment, the Google Maps integration uses a generic search embed query (`https://www.google.com/maps/embed/v1/search?q=...`) which requires an API key in a true production environment to unlock full interactive features.
3. **Region Agnostic**: The system prompt and timeline are designed to be generally applicable to most democratic election processes, rather than hardcoded to a specific country, to ensure broad usability.

## Evaluation Focus Areas Addressed
- **Code Quality**: Built with TypeScript for type safety, modular component structure (`src/components/`), and clean, organized CSS variables.
- **Security**: The AI prompt is strictly instructed to avoid political bias, hallucinations, and malicious intent.
- **Efficiency**: Used Vanilla CSS over heavy component libraries (like Tailwind or Material UI) to keep the repository well under the 10 MB limit.
- **Testing**: Includes Jest/React Testing Library setup with basic component rendering tests (`App.test.tsx`).
- **Accessibility**: High contrast dark-mode theme, keyboard-navigable timeline buttons, and semantic HTML structure.
- **Google Services**: Meaningful integration of Google Gemini API (Core Assistant) and Google Maps (Polling Station Locator).
