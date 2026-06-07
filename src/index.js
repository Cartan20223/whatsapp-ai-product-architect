import dotenv from "dotenv"
dotenv.config()

import { createClient } from "./whatsapp/client.js"

const client = createClient()
client.initialize()
