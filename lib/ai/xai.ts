import { createXai } from "@ai-sdk/xai"

// ── Server-only xAI client ──────────────────────────────────────────────────
// This file must only be imported in server contexts (API routes, server actions).

const apiKey = process.env.XAI_API_KEY

if (!apiKey) {
  console.warn(
    "[xai] XAI_API_KEY is not set. Grok calls will fail at runtime."
  )
}

export const xai = createXai({ apiKey: apiKey ?? "" })

export const XAI_MODEL =
  process.env.XAI_MODEL ?? "grok-3-mini-fast"
