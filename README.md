# CivicSync: India's Intelligent Election Guide 🇮🇳🏛️🤖

**CivicSync** is a premium, AI-native educational platform that empowers Indian citizens with the knowledge they need to navigate the electoral process with confidence. Built for the **PromptWars Virtual Challenge**, it combines multiple Google services with a stunning, accessible, and secure interactive interface specifically tailored for India's democracy.

---

## 🔗 Live Links
- **GitHub Repository:** [https://github.com/bcvinay8072/PromptWars-ElectionInfo](https://github.com/bcvinay8072/PromptWars-ElectionInfo)
- **Deployed URL (Cloud Run):** [https://civic-sync-299191823241.us-central1.run.app](https://civic-sync-299191823241.us-central1.run.app)

---

## 🏛️ Chosen Vertical
**Election Process Education (India)** — An interactive assistant that simplifies voter eligibility, registration (Form 6), EPIC card, polling booth location, and EVM/VVPAT procedures into an engaging, AI-driven journey for the world's largest democracy.

---

## 💡 Approach and Logic

### 1. AI-Native Interactivity (Google Gemini 2.5 Flash)
- **Deep Gemini Integration:** Utilizes the `@google/generative-ai` SDK with strict safety settings and a comprehensive system prompt focused on the Election Commission of India (ECI) guidelines.
- **Indian Election Context:** The assistant is primed with knowledge about NVSP portal, EPIC (Voter ID), EVMs, VVPATs, NOTA, and constitutional requirements.
- **Streaming Responses:** Implements real-time token-by-token streaming for a modern, fluid UX.
- **Event-Driven Architecture:** Clicking any timeline step automatically triggers the AI assistant via a custom `ask-assistant` event for contextual help.

### 2. ECI & National Resource Integration
- **Direct Resource Linking:** Integrated links to the National Voters' Service Portal (NVSP), Voter Helpline App, and official ECI portal.
- **State-Specific Guidance:** A directory of all State Chief Electoral Officer (CEO) websites, allowing users to find their local election authorities instantly.
- **Voter Helpline Integration:** Highlights the 1950 helpline for citizen support.

### 3. Interactive Voter Journey (India-Tailored)
- A state-driven, 4-step roadmap (`VoterTimeline.tsx`) built with **Framer Motion** animations.
- Steps cover: Eligibility Check, Voter Registration (Form 6), Finding Polling Booth, and Election Day Voting (EVM/VVPAT).

### 4. Google Cloud Run Deployment
- Containerized via **Docker** (multi-stage build: Node.js → Nginx).
- Deployed to **Google Cloud Run** with high-availability and security.

---

## 🛠️ Technical Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vanilla CSS (Glassmorphism) |
| **AI Engine** | Google Gemini 2.5 Flash (Streaming, Safety Settings) |
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

---

## ♿ Accessibility Features
- **Full ARIA Compliance:** Proper landmarks, roles, and live regions.
- **Keyboard Navigation:** Fully navigable via keyboard with visible focus indicators.
- **Skip Navigation**: Included `Skip to main content` for screen reader efficiency.
- **Reduced Motion:** Respects user's motion preferences.

---

## 🧪 Testing Achievement
The project features a comprehensive test suite with **41 passing tests** (100% pass rate) covering:
- **Accessibility & Landmark Roles**
- **Security & Sanitization Logic**
- **Voter Journey State Transitions**
- **AI Assistant Event Integration**
- **Navigation & Routing Integrity**

Run tests: `npm test`

---

## 🧠 Assumptions Made
1. **Official Data:** Assumes users should rely on ECI (Election Commission of India) as the final authority.
2. **Neutrality:** The AI maintains absolute political neutrality as per competition guidelines.
3. **EPIC Focus:** Focuses on the EPIC card as the primary identification for voters.
