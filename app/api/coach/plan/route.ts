import { callGrok } from "@/lib/ai/xai"
import { coachingPlanSchema, coachRequestSchema } from "@/lib/ai/schemas"
import {
  COACH_SYSTEM_PROMPT,
  formatContextMessage,
  getFallbackPlan,
} from "@/lib/ai/prompts"

export async function POST(req: Request) {
  let payload: ReturnType<typeof coachRequestSchema.parse> | null = null

  try {
    const body = await req.json()

    const parsed = coachRequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    payload = parsed.data

    if (!process.env.XAI_API_KEY) {
      console.warn("[coach/plan] XAI_API_KEY missing, returning fallback")
      return Response.json({ plan: getFallbackPlan(payload) })
    }

    // Call Grok directly and ask for JSON output
    const rawResponse = await callGrok([
      { role: "system", content: COACH_SYSTEM_PROMPT + "\n\nYou MUST respond with valid JSON only. No markdown, no code fences, no extra text." },
      { role: "user", content: formatContextMessage(payload) },
    ])

    // Strip any markdown code fences if present
    const cleaned = rawResponse
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim()

    // Parse and validate with Zod
    const jsonParsed = JSON.parse(cleaned)
    const validated = coachingPlanSchema.safeParse(jsonParsed)

    if (!validated.success) {
      console.warn("[coach/plan] Grok response failed schema validation:", validated.error.flatten())
      return Response.json({ plan: getFallbackPlan(payload) })
    }

    return Response.json({ plan: validated.data })
  } catch (error) {
    console.error("[coach/plan] Error:", error)

    if (payload) {
      return Response.json({ plan: getFallbackPlan(payload) })
    }

    return Response.json(
      { error: "Failed to generate coaching plan" },
      { status: 500 }
    )
  }
}
