const STT_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
const MODEL = "whisper-large-v3-turbo"

export async function transcribeAudio(base64Data, mimetype) {
  try {
    const buffer = Buffer.from(base64Data, "base64")
    const blob = new Blob([buffer], { type: mimetype })
    const formData = new FormData()
    const ext = mimetype.split("/")[1] || "ogg"
    formData.append("file", blob, `audio.${ext}`)
    formData.append("model", MODEL)

    const res = await fetch(STT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: formData,
    })

    if (!res.ok) {
      console.error(`[STT] HTTP ${res.status}: ${res.statusText}`)
      const errText = await res.text().catch(() => "")
      console.error(`[STT] Body: ${errText}`)
      return null
    }

    const data = await res.json()
    return data.text || null
  } catch (err) {
    console.error("[STT] Error:", err.message)
    return null
  }
}
