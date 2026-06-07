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
🛠️ Installation & Setup
Prerequisites
Node.js (v18.0.0 or higher configured for ES Modules).

FFmpeg installed on your local host system variable path (required for processing inbound media types/audio streams).

1. Clone the Repository
Bash
git clone [https://github.com/Cartan20223/whatsapp-ai-product-architect.git](https://github.com/Cartan20223/whatsapp-ai-product-architect.git)
cd whatsapp-ai-product-architect
2. Install Dependencies
Bash
npm install
3. Environment Configuration
Create a .env file in the root directory and populate it with your credentials:

Ini, TOML
# Groq Cloud API Engine Access Token
GROQ_API_KEY=your_groq_api_key_here

# System Instructions defining agent behavior, constraints, and architecture rules
SYSTEM_PROMPT="your_custom_behavior_prompt_here"
💻 Usage
Running Locally
To launch the script and initialize the browser emulator, run:

Bash
npm start
Upon execution, a QR Code will render directly inside your terminal interface. Scan this code using your WhatsApp application (Linked Devices > Link a Device) to establish a persistent web session.

📦 Note on Persistence: Thanks to the LocalAuth integration, your authentication session tokens will save inside the .wwebjs_auth/ directory. You will only need to scan the QR code once per runtime profile.
