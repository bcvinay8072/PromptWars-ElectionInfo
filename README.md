# CivicSync: The Intelligent Election Guide 🏛️🤖

**CivicSync** is a premium, AI-native educational platform that empowers citizens with the knowledge they need to navigate the electoral process with confidence. Built for the **PromptWars Virtual Challenge**, it combines multiple Google services with a stunning, accessible, and secure interactive interface.

---

## 🔗 Live Links
- **GitHub Repository:** [https://github.com/bcvinay8072/PromptWars-ElectionInfo](https://github.com/bcvinay8072/PromptWars-ElectionInfo)
- **Deployed URL (Cloud Run):** [https://civic-sync-299191823241.us-central1.run.app](https://civic-sync-299191823241.us-central1.run.app)

---

## 🏛️ Chosen Vertical
**Election Process Education** — An interactive assistant that simplifies voter eligibility, registration, polling, and election day procedures into an engaging, AI-driven journey.

---

## 💡 Approach and Logic

### 1. AI-Native Interactivity (Google Gemini 2.5 Flash)
- **Deep Gemini Integration:** Utilizes the `@google/generative-ai` SDK with configurable safety settings (`HarmCategory`, `HarmBlockThreshold`), generation parameters (`temperature`, `topP`, `topK`, `maxOutputTokens`), and multi-turn chat sessions with system prompt priming.
- **Streaming Responses:** Implements real-time token-by-token streaming via `sendMessageStream()` for a modern, fluid UX.
- **Event-Driven Architecture:** Clicking any timeline step automatically triggers the AI assistant via a custom `ask-assistant` event, creating seamless cross-component communication.

### 2. Google Civic Information API Integration
- **Real Election Data:** Fetches live upcoming election data from `googleapis.com/civicinfo/v2/elections` on page load.
- **Voter Info Lookup:** Searches for polling locations, election administration bodies, and official election resources via `googleapis.com/civicinfo/v2/voterinfo`.
- **Representative Data:** Supports querying `googleapis.com/civicinfo/v2/representatives` for elected officials by address.

### 3. Interactive Voter Journey (Gamified Timeline)
- A state-driven, 4-step roadmap (`VoterTimeline.tsx`) built with **Framer Motion** animations.
- Each step expands with details and provides a one-click bridge to the AI assistant.

### 4. Google Cloud Run Deployment
- Containerized via **Docker** (multi-stage build: Node.js → Nginx).
- Deployed to **Google Cloud Run** with auto-scaling and HTTPS.

---

## 🛠️ Technical Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vanilla CSS (Glassmorphism) |
| **AI Engine** | Google Gemini 2.5 Flash (Streaming, Safety Settings) |
| **Data API** | Google Civic Information API (Elections, Voter Info) |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Infrastructure** | Docker + Google Cloud Run |
| **Testing** | Jest + React Testing Library (41 tests) |

---

## 🔐 Security Features
- **Input Sanitization:** All user inputs are sanitized (HTML tag removal, `javascript:` protocol blocking, `onEvent=` handler stripping) before API transmission.
- **Rate Limiting:** Token bucket rate limiter prevents API abuse (10 requests/burst, 1 token/second refill).
- **Safety Settings:** Gemini API configured with `BLOCK_MEDIUM_AND_ABOVE` thresholds for harassment, hate speech, explicit content, and dangerous content.
- **Error Boundaries:** React ErrorBoundary components wrap all critical sections, preventing cascading failures.
- **No Exposed Secrets:** API keys are managed via environment variables and excluded from version control via `.gitignore`.

---

## ♿ Accessibility Features
- **Skip Navigation:** Keyboard-accessible "Skip to main content" link.
- **ARIA Landmarks:** Proper `role="banner"`, `role="main"`, `role="contentinfo"`, `role="navigation"`, `role="search"`, `role="log"` attributes.
- **Screen Reader Support:** `aria-label`, `aria-labelledby`, `aria-expanded`, `aria-controls`, `aria-live="polite"`, `aria-current="step"` throughout.
- **Keyboard Navigation:** All interactive elements are focusable with `tabIndex` and respond to `Enter`/`Space` keys.
- **Focus Indicators:** Visible `focus-visible` outlines for keyboard users.
- **Reduced Motion:** `@media (prefers-reduced-motion)` disables animations for vestibular disorder support.
- **High Contrast:** `@media (prefers-contrast: high)` increases border and text contrast.
- **Semantic HTML:** Proper heading hierarchy (`h1` → `h2` → `h3` → `h4`), `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`.

---

## 🧪 Testing (41 Tests)
| Category | Tests | Coverage |
|---|---|---|
| App Rendering | 8 | Header, hero, sections, footer, skip-link |
| Navigation | 3 | Links, hrefs, aria-labels |
| Accessibility | 4 | Landmarks, skip-link target, heading hierarchy |
| VoterTimeline | 6 | Steps, interactions, ARIA states, events |
| ChatAssistant | 7 | Messages, input, disabled states, ARIA regions |
| PollingStation | 7 | Rendering, search, Civic API mock, loading states |
| Security | 4 | Sanitization (XSS, JS injection), length limits, rate limiting |
| ErrorBoundary | 1 | Component isolation |
| Integration | 1 | Timeline → Assistant event flow |

Run tests: `npm test`

---

## 🧠 Assumptions Made
1. **Generalist Education:** The assistant focuses on universal democratic principles and recommends verifying local election laws with official authorities.
2. **API Keys via Environment:** `REACT_APP_GEMINI_API_KEY` is provided via `.env` file locally and via Cloud Run environment variables in production.
3. **Civic API Availability:** The Google Civic Information API returns data primarily for US elections. Non-US addresses may return empty results gracefully.

---

## 🏆 Competitive Edge
- **Ultra-Lightweight:** ~190KB repository, well under the 10MB limit.
- **Multiple Google Services:** Gemini AI (chat) + Civic Information API (elections) + Cloud Run (deployment).
- **41 Passing Tests** with zero warnings or errors.
- **Zero ESLint Warnings** — completely clean production build.
- **Premium Glassmorphic UI** with dark mode, micro-animations, and responsive design.

---

## 🚀 Local Setup
1. Clone: `git clone https://github.com/bcvinay8072/PromptWars-ElectionInfo.git`
2. Navigate: `cd civic-sync`
3. Install: `npm install`
4. Configure: Create `.env` with `REACT_APP_GEMINI_API_KEY=your_key_here`
5. Run: `npm start`
6. Test: `npm test`
