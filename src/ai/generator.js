import { callApi } from "./api.js"

export async function generateReply(message, context = "", sender = "alguien") {
  try {
    const messages = [
      { role: "system", content: process.env.SYSTEM_PROMPT },
    ]

    if (context) {
      messages.push({ role: "system", content: "Lo ultimo que paso en el grupo:\n" + context.replace(/\|/g, "\n") })
    }

    messages.push({ role: "system", content: "Ahora " + sender + " te dice a vos: \"" + message + "\"" })

    const content = await callApi(messages)
    return content
  } catch (err) {
    console.error("[GENERATOR] Error:", err.message)
    return null
  }
}
