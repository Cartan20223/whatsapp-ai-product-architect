import { createRequire } from "module"
const require = createRequire(import.meta.url)
const { Client, LocalAuth } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")
import { analyzeMessage } from "../ai/analyzer.js"
import { generateReply } from "../ai/generator.js"
import { RateLimiter } from "../utils/rateLimiter.js"

const TECHNICAL_KEYWORDS = [
  "ia", "face", "app", "bot", "api", "web", "chat", "server",
  "sistema", "plataforma", "startup", "negocio", "proyecto",
  "software", "idea", "database", "cloud", "backend", "frontend",
  "mobile", "site", "tool", "script", "deploy", "devops",
  "docker", "kubernetes", "ai", "machine learning", "inteligencia",
  "chatbot", "blockchain", "function", "endpoint", "rest", "graphql",
  "streaming", "cache", "redis", "sql", "nosql", "auth", "login",
  "session", "worker", "queue", "cdn", "dns", "proxy", "gateway",
  "pagina", "sitio", "tienda", "usuario", "datos", "servidor",
  "codigo", "pago", "registro", "logue", "nube", "seguridad",
  "automatizar", "online", "algoritmo", "red social", "base de datos",
  "notificacion", "descargar", "subir", "conectar", "mensajeria",
  "uber", "rappi", "netflix", "spotify", "instagram", "tiktok",
  "airbnb", "ecommerce", "mercado", "dashboard", "panel",
  "wordpress", "plugin", "plantilla", "host", "hosting",
  "cliente", "venta", "ventas", "video", "videos",
  "portafolio", "publicidad", "reunion", "correo",
  "componentes", "figma", "desplegar", "organigrama",
  "embudo", "micro",
  "claude", "openai", "gemini", "gpt", "copilot",
  "vender", "clon", "dólar", "dolares", "dinero", "ganar",
  "mockups", "mockup",
]

function randomCut(text) {
  const words = text.split(" ")
  if (words.length > 30 && Math.random() < 0.15) {
    return words.slice(0, Math.floor(words.length / 2)).join(" ")
  }
  return text
}

function cleanReply(text) {
  if (!text) return null
  return text.split("\n").slice(0, 6).join("\n").slice(0, 500)
}

const BAD_OPENERS = ["suena como", "suena a", "parece que", "eso suena", "eso es"]

function breakPattern(reply) {
  const lower = reply.toLowerCase().replace(/^(parce|mka|vea)[,\s]+/, "")
  for (const opener of BAD_OPENERS) {
    if (lower.startsWith(opener)) {
      const sentences = reply.split(/[.?!]\s*/)
      if (sentences.length <= 1) {
        return "jmm " + reply.toLowerCase()
      }
      return sentences[0].toLowerCase()
    }
  }
  return reply
}

function isTechnical(text) {
  if (text.length < 10) return false
  const lower = text.toLowerCase()
  return TECHNICAL_KEYWORDS.some(k => lower.includes(k))
}

const groupMemory = { lastTopics: [] }

async function updateMemory(msg) {
  let name = "alguien"
  try {
    const contact = await msg.getContact()
    name = contact.pushname || contact.name || "alguien"
  } catch {}
  const entry = name + ": " + msg.body
  groupMemory.lastTopics.push(entry)
  if (groupMemory.lastTopics.length > 20) {
    groupMemory.lastTopics.shift()
  }
}

export function createClient() {
  const limiter = new RateLimiter()

  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  })

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true })
    console.log("Escanea el QR con WhatsApp > Dispositivos vinculados")
  })

  client.on("ready", () => {
    console.log("WhatsApp conectado y listo")
  })

  client.on("message", async (msg) => {
    try {
      if (msg.fromMe) return

      const chat = await msg.getChat()
      if (!chat.isGroup) return

      const text = msg.body
      console.log(`[MENSAJE] ${text}`)

      await updateMemory(msg)

      if (!isTechnical(text)) return

      const contact = await msg.getContact()
      const senderName = contact.pushname || contact.name || "alguien"

      if (senderName.toLowerCase().includes("david")) {
        console.log("[DAVID] ignorado")
        return
      }

      if (!limiter.canReply()) {
        console.log("[RATE_LIMIT] Esperando 15s antes de responder")
        return
      }

      chat.sendStateTyping()

      const analysis = await analyzeMessage(text, senderName)
      console.log(`[ANALISIS] respond=${analysis.respond}`)

      if (!analysis.respond) return

      const context = groupMemory.lastTopics.slice(-10).join(" | ")
      const raw = await generateReply(text, context, senderName)
      let reply = raw
      if (!reply) return

      reply = reply.charAt(0).toLowerCase() + reply.slice(1)
      reply = breakPattern(reply)
      reply = randomCut(reply)
      reply = cleanReply(reply)

      if (reply) {
        console.log(`[RESPUESTA] ${reply}`)
        msg.reply(reply)
      }
    } catch (err) {
      console.error("[MESSAGE_HANDLER] Error:", err.message)
    }
  })

  return client
}
