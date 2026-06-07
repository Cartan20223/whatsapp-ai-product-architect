# WhatsApp AI Product Architect & Middleware

An asynchronous, event-driven WhatsApp middleware built with Node.js, Express, and `whatsapp-web.js`. This service intercepts incoming group chat messages via localized browser automation (Puppeteer), routes them through an optimized Keyword-Gating filter, and leverages advanced LLMs (via Groq Cloud Engine) with **Strict Structured JSON Outputs** to evaluate technical feasibility and deliver autonomous architectural feedback in real-time.

---

## 🚀 Core Features & Architecture

### 🔌 WebSocket Event Interception

Emulates a standard browser environment using Puppeteer to intercept incoming messages natively, bypassing heavy enterprise API restrictions.

### ⚡ Keyword Gating Filter (Token Cost Mitigation)

Implements a local regex-based analyzer scanning for 70+ technical keywords before triggering LLM calls, reducing unnecessary API usage and minimizing token burn.

### 🧠 Structured Output Engine

Enforces strict JSON outputs from the LLaMA model:

* `is_humo`
* `reasoning`
* `reply`

Ensures deterministic backend handling and response sanitation.

### 🛡️ Heuristic Anti-Detection Layers

Includes post-processing mechanisms:

* `breakPattern`
* `randomCut`
* lowercase normalization

These simulate human-like inconsistencies and prevent AI detection in chat.

### 🧾 Short-Term Context Memory

Maintains an in-memory sliding window (last 20 messages) to provide contextual awareness without requiring a database.

---

## 🔄 Audio Transcription Engine (STT Pipeline)

To prevent evasion via voice notes, the system integrates a real-time Speech-to-Text pipeline powered by Groq Whisper.

---

### 📁 `src/ai/stt.js` — Audio Processing Subsystem

* Uses native Node.js runtime (`fetch`, `FormData`, `Blob`)

* Eliminates dependency overhead (`axios`, `form-data`)

* Converts Base64 → Buffer → Blob (zero disk I/O)

* Streams audio directly to:

  `https://api.groq.com/openai/v1/audio/transcriptions`

* Model: `whisper-large-v3-turbo`

---

### 🔄 `src/whatsapp/client.js` — Event Pipeline Refactor

* Replaces immutable text (`const`) with dynamic registers (`let`)
* Detects audio via MIME-type (`audio/*`)
* Downloads media asynchronously with `msg.downloadMedia()`
* Pipes audio buffer to transcription engine
* Overwrites `msg.body` with transcribed text
* Injects into existing pipeline:

  * Memory
  * Keyword filter
  * AI analysis

---

## 📂 Project Structure

```bash
atlas-whatsapp-bot/
├── .wwebjs_auth/         # WhatsApp session persistence (LocalAuth)
├── src/
│   ├── index.js          # Entry point & config loader
│   ├── ai/
│   │   ├── api.js        # Groq API client
│   │   ├── analyzer.js   # Message classification logic
│   │   ├── generator.js  # Response generation
│   │   └── stt.js        # Audio transcription module
│   ├── whatsapp/
│   │   └── client.js     # WhatsApp client & event listeners
│   └── utils/
│       └── rateLimiter.js # Anti-spam (15s cooldown)
├── .env                  # Environment variables
└── package.json          # Dependencies
```

---

## 🛠️ Installation & Setup

### 📋 Prerequisites

* Node.js ≥ 18 (ES Modules enabled)
* FFmpeg installed and available in system PATH

---

### 1. Clone Repository

```bash
git clone https://github.com/Cartan20223/whatsapp-ai-product-architect.git
cd whatsapp-ai-product-architect
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Environment Configuration

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
SYSTEM_PROMPT="your_custom_behavior_prompt_here"
```

---

## 💻 Usage

### ▶️ Run Locally

```bash
npm start
```

---

### 🔐 Authentication

* A QR code will appear in the terminal
* Scan using:

  * WhatsApp → Linked Devices → Link a Device

---

### 📦 Session Persistence

* Stored in `.wwebjs_auth/`
* No need to re-scan QR on every restart (same environment)

---

## ⚠️ Known Limitations

| Issue                                | Cause                             |
| ------------------------------------ | --------------------------------- |
| No persistent memory                 | RAM-only sliding window           |
| Groq 429 errors                      | Free tier rate limits             |
| High memory usage                    | Puppeteer (~300MB)                |
| Session expiration                   | Requires active connection        |
| Not compatible with Render free tier | Instance sleeps and kills session |

---

## 🧠 Design Philosophy

This system prioritizes:

* low-latency processing
* minimal token usage
* human-like interaction patterns
* modular AI middleware architecture

---

## 🚧 Future Improvements

* Persistent memory layer (Redis / SQLite)
* Multi-user session handling
* Emotion/tone detection for audio
* Adaptive personality evolution (social memory)
* Migration to Baileys for improved stability

---
