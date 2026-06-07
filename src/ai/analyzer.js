import { callApi } from "./api.js"

const CLASSIFIER_SYSTEM = `Decide if Koky would respond. Output only JSON.

{"respond": boolean}

Rules:
- If Andrus about general business/strategy (prices, phases, guarantees, meetings, using AI to speed up work): skip.
- If Andrus says he GOT clients, contracts, or closed deals: respond — to ask which ones, names, and what project.
- If Andrus about building with normal tools (WordPress, landing pages, basic websites): skip.
- If Andrus about unrealistic building (clones of Rappi/Uber, complex apps, IA doing all the work, blockchain, building without coding): respond.
- If Sergio about unrealistic tech ideas: respond simple.
- Otherwise: skip.
Spanish messages are common. Always output valid JSON.`

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/)
  return match ? match[0] : text
}

export async function analyzeMessage(message, sender = "alguien") {
  try {
    const content = await callApi([
      { role: "system", content: CLASSIFIER_SYSTEM },
      { role: "system", content: "The message is from: " + sender },
      { role: "user", content: message },
    ], 0.1)

    if (!content) {
      return { respond: false }
    }

    const cleaned = extractJSON(content)
    const parsed = JSON.parse(cleaned)

    return { respond: Boolean(parsed.respond) }
  } catch {
    return { respond: false }
  }
}
