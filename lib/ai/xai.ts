import { xai } from "@ai-sdk/xai"

// ── Server-only xAI helpers ─────────────────────────────────────────────────
// This file must only be imported in server contexts (API routes, server actions).

export function getGrokModel() {
  return xai("grok-4", {
    apiKey: process.env.XAI_API_KEY,
  })
}
