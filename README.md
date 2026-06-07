# WhatsApp AI Product Architect & Middleware

An asynchronous, event-driven WhatsApp middleware built with Node.js, Express, and `whatsapp-web.js`. This service intercepts incoming group chat messages via localized browser automation (Puppeteer), routes them through an optimized Keyword-Gating filter, and leverages advanced LLMs (via Groq Cloud Engine) with **Strict Structured JSON Outputs** to evaluate technical feasibility and deliver autonomous architectural feedback in real-time.

---

## 🚀 Core Features & Architecture

* **WebSocket Event Interception:** Emulates a standard browser environment using Puppeteer to intercept incoming messages natively, bypassing heavy enterprise API restrictions.
* **Keyword Gating Filter (Token Cost Mitigation):** Includes a local regex-based analyzer scanning for over 70 specific technical keywords before initiating API streams, decreasing unnecessary LLM invocation and slashing Token Burn Rate.
* **Structured Output Engine:** Enforces a rigid JSON output format from the LLaMA model (`is_humo`, `reasoning`, `reply`) ensuring deterministic logic handling and sanitization within the Express backend.
* **Heuristic Anti-Detection Layers:** Implements specialized post-processing functions (`breakPattern`, `randomCut`) that dynamically alter syntax rules, lowercase text, and simulate human typing behavior to seamlessly integrate into chat workflows.
* **Short-Term Context Memory:** Maintains an in-memory sliding window queue (`RAM sliding-cache`) tracking the last 20 messages for contextual awareness without database overhead.

---

## 📂 Project Structure

```text
atlas-whatsapp-bot/
├── .wwebjs_auth/         # Persistent WhatsApp session storage (LocalAuth)
├── src/
│   ├── index.js          # Application entry point & configuration loader
│   ├── ai/
│   │   ├── api.js        # Groq HTTP REST client wrapper
│   │   ├── analyzer.js   # Logical gate for evaluating message metadata
│   │   └── generator.js  # Conversational payload builder with system prompts
│   ├── whatsapp/
│   │   └── client.js     # WhatsApp client initialization and DOM listeners
│   └── utils/
│       └── rateLimiter.js# Anti-spam temporal middleware (15-second intervals)
├── .env                  # Secure environment variable vault
└── package.json          # Dependency Manifest
