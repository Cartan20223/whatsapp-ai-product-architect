import fetch from "node-fetch"

const API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

export async function callApi(messages, temperature = 0.95) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      top_p: 0.9,
      max_tokens: 100,
    }),
  })

  if (!res.ok) {
    console.error(`[API] HTTP ${res.status}: ${res.statusText}`)
    return null
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || null
}
