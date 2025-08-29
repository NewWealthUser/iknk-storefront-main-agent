import createClient from "@medusajs/js-sdk"

const sdk = new createClient({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:32100",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  auth: { type: "session" }, // optional: ensures session-based auth
})

export default sdk