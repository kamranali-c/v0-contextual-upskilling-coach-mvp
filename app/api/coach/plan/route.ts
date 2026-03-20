import { generateText, Output } from "ai"
import { xai, XAI_MODEL } from "@/lib/ai/xai"
import { coachingPlanSchema, coachRequestSchema } from "@/lib/ai/schemas"
import { COACH_SYSTEM_PROMPT, formatContextMessage, getFallbackPlan } from "@/lib/ai/prompts"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const parsed = coachRequestSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const payload = parsed.data

    // Check for API key
    if (!process.env.XAI_API_KEY) {
      console.warn("[coach/plan] XAI_API_KEY missing, returning fallback")
      return Response.json({ plan: getFallbackPlan(payload) })
    }

    // Call Grok via AI SDK with structured output
    const { output } = await generateText({
      model: xai(XAI_MODEL),
      system: COACH_SYSTEM_PROMPT,
      output: Output.object({ schema: coachingPlanSchema }),
      messages: [
        {
          role: "user",
          content: formatContextMessage(payload),
        },
      ],
    })

    if (!output) {
      console.warn("[coach/plan] Model returned no structured output, using fallback")
      return Response.json({ plan: getFallbackPlan(payload) })
    }

    return Response.json({ plan: output })
  } catch (error) {
    console.error("[coach/plan] Error:", error)

    // Try to return a fallback even on error
    try {
      const body = await req.clone().json()
      const parsed = coachRequestSchema.safeParse(body)
      if (parsed.success) {
        return Response.json({ plan: getFallbackPlan(parsed.data) })
      }
    } catch {
      // ignore parse error on fallback attempt
    }

    return Response.json(
      { error: "Failed to generate coaching plan" },
      { status: 500 }
    )
  }
}
