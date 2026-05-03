# CivicSync: India's Intelligent Election Guide 🇮🇳🏛️🤖

**CivicSync** is a premium, AI-native educational platform that empowers Indian citizens with the knowledge they need to navigate the electoral process with confidence. Built for the **PromptWars Virtual Challenge**, it combines **6 Google services** with a stunning, accessible, and secure interactive interface specifically tailored for India's democracy.

---

## 🔗 Live Links
- **GitHub Repository:** [https://github.com/bcvinay8072/PromptWars-ElectionInfo](https://github.com/bcvinay8072/PromptWars-ElectionInfo)
- **Deployed URL (Cloud Run):** [https://civic-sync-299191823241.us-central1.run.app](https://civic-sync-299191823241.us-central1.run.app)

---

## 🏛️ Chosen Vertical
**Election Process Education (India)** — An interactive assistant that simplifies voter eligibility, registration (Form 6), EPIC card, polling booth location, and EVM/VVPAT procedures into an engaging, AI-driven journey for the world's largest democracy.

---

## ☁️ Google Services Used (6 Services)

| # | Google Service | Usage |
|:---:|:---|:---|
| 1 | **Google Gemini 2.5 Flash** | AI-powered streaming chat assistant with safety settings for election guidance |
| 2 | **Google Cloud Run** | Production containerized deployment with auto-scaling |
| 3 | **Firebase Analytics** | Event tracking for chat interactions, search queries, and journey steps |
| 4 | **Cloud Firestore** | Persistent chat history storage for analytics and audit |
| 5 | **Google Analytics 4 (GA4)** | Web Vitals performance tracking, user behavior, and page view analytics |
| 6 | **Google Maps Embed** | Interactive map showing ECI headquarters location |
| 7 | **Google Translate Widget** | Multi-language support (Hindi, Tamil, Telugu, Bengali, + 9 more Indian languages) |
| 8 | **Google Fonts (Inter)** | Modern typography for premium UI design |

---

## 💡 Approach and Logic

### 1. AI-Native Interactivity (Google Gemini 2.5 Flash)
- **Deep Gemini Integration:** Utilizes the `@google/generative-ai` SDK with strict safety settings and a comprehensive system prompt focused on the Election Commission of India (ECI) guidelines.
- **Indian Election Context:** The assistant is primed with knowledge about NVSP portal, EPIC (Voter ID), EVMs, VVPATs, NOTA, and constitutional requirements.
- **Streaming Responses:** Implements real-time token-by-token streaming for a modern, fluid UX.
- **Event-Driven Architecture:** Clicking any timeline step automatically triggers the AI assistant via a custom `ask-assistant` event for contextual help.

### 2. Firebase & Firestore Integration
- **Firebase Analytics:** Tracks page views, chat interactions, search events, and voter journey step engagement with custom event logging.
- **Cloud Firestore:** Persists anonymized chat transcripts for analytics and audit, with privacy-first truncation (200 chars max).
- **Session Tracking:** Unique session IDs track user engagement patterns across the application.

### 3. Performance & Telemetry
- **Google Analytics 4 (GA4):** Full `gtag.js` integration with Core Web Vitals (CLS, FID, LCP) piped directly to GA4.
- **Code Splitting:** React.lazy + Suspense for all major components reduces initial bundle size.
- **Memoization:** `useMemo` and `useCallback` optimizations throughout the component tree.

### 4. Localization & Accessibility
- **Google Translate Widget:** Supports 13 Indian languages including Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, and Urdu.
- **Google Maps Embed:** Shows ECI headquarters on an interactive map with a direct link to Google Maps.
- **Google Fonts (Inter):** Modern, readable typography optimized for the Indian web audience.

### 5. ECI & National Resource Integration
- **Direct Resource Linking:** Integrated links to NVSP, Voter Helpline App, and official ECI portal.
- **State-Specific Guidance:** Directory of all State Chief Electoral Officer (CEO) websites.
- **Voter Helpline Integration:** Highlights the 1950 helpline for citizen support.

### 6. Interactive Voter Journey (India-Tailored)
- A state-driven, 4-step roadmap built with **Framer Motion** animations.
- Steps cover: Eligibility Check, Voter Registration (Form 6), Finding Polling Booth, and Election Day Voting (EVM/VVPAT).

### 7. Google Cloud Run Deployment
- Containerized via **Docker** (multi-stage build: Node.js → Nginx).
- Deployed to **Google Cloud Run** with high-availability, auto-scaling, and security.

---

## 🛠️ Technical Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vanilla CSS (Glassmorphism) |
| **AI Engine** | Google Gemini 2.5 Flash (Streaming, Safety Settings) |
| **Analytics** | Firebase Analytics + Google Analytics 4 (GA4) |
| **Database** | Cloud Firestore (chat history) |
| **Maps** | Google Maps Embed API |
| **i18n** | Google Translate Widget (13 Indian languages) |
| **Typography** | Google Fonts (Inter) |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Infrastructure** | Docker + Google Cloud Run |
| **Testing** | Jest + React Testing Library (**41 tests passing**) |

---

## 🔐 Security Features
- **Input Sanitization:** All user inputs are sanitized for XSS and JS injection before transmission.
- **Rate Limiting:** Implements a **Token Bucket** rate limiter to prevent API abuse.
- **Safety Settings:** Gemini API configured with strict thresholds for responsible AI.
- **Error Boundaries:** React ErrorBoundary components wrap all critical sections for resilience.
- **Privacy-First Analytics:** Chat messages truncated to 200 characters before Firestore storage.

---

## ♿ Accessibility Features
- **Full ARIA Compliance:** Proper landmarks, roles, and live regions.
- **Keyboard Navigation:** Fully navigable via keyboard with visible focus indicators.
- **Skip Navigation**: Included `Skip to main content` for screen reader efficiency.
- **Reduced Motion:** Respects user's motion preferences.
- **Multi-Language:** Google Translate widget for 13+ Indian languages.

---

## 🧪 Testing Achievement
The project features a comprehensive test suite with **41 passing tests** (100% pass rate) covering:
- **Accessibility & Landmark Roles**
- **Security & Sanitization Logic**
- **Voter Journey State Transitions**
- **AI Assistant Event Integration**
- **Navigation & Routing Integrity**
- **Firebase Analytics Mock Integration**

Run tests: `npm test`

---

## ⚡ Performance Optimizations
- **React.lazy + Suspense** for component-level code splitting
- **useMemo / useCallback** for memoized computations and callbacks
- **Lazy-loaded iframes** for Google Maps embed
- **Core Web Vitals** piped to GA4 for real-time performance monitoring
- **Nginx** optimized serving in production Docker container

---

## 🧠 Assumptions Made
1. **Official Data:** Assumes users should rely on ECI (Election Commission of India) as the final authority.
2. **Neutrality:** The AI maintains absolute political neutrality as per competition guidelines.
3. **EPIC Focus:** Focuses on the EPIC card as the primary identification for voters.
