import dotenv from "dotenv"
dotenv.config()

import { analyzeMessage } from "./src/ai/analyzer.js"
import { generateReply } from "./src/ai/generator.js"

const context = `Sergio: parce hagamos una app tipo uber pero para domiciliarios
Andrus: yo conozco gente en bancolombia podemos conseguir clientes
Sergio: pero si hacemos un clon de uber con flutter sale rapido
David: yo puedo hacer el logo`

const tests = [
  { sender: "Sergio", msg: "trabajo en redeban y eso es lo mismo que una api parce" },
  { sender: "Sergio", msg: "la seguridad depende de una auditoria de andrus, el sabe de eso" },
  { sender: "Sergio", msg: "hagamos una ia que haga paginas web sola y vendamos el servicio" },
  { sender: "Sergio", msg: "con wordpress podemos hacer un clone de netflix, es facil" },
  { sender: "Sergio", msg: "parce y si hacemos un bot que trae clientes solito?" },
]

async function run() {
  for (const { sender, msg } of tests) {
    console.log("\n" + "=".repeat(60))
    console.log(`${sender}: "${msg}"`)
    console.log("-".repeat(60))

    const analysis = await analyzeMessage(msg, sender)
    console.log(`[ANALIZADOR] respond=${analysis.respond}`)

    if (analysis.respond) {
      const reply = await generateReply(msg, context, sender)
      console.log(`[KOKY] ${reply}`)
    } else {
      console.log(`[KOKY] (ignorado)`)
    }
  }
}

run().catch(console.error)
