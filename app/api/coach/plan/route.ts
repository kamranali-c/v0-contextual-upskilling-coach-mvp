import { generateText, Output } from "ai"
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

    // Call via Vercel AI Gateway (zero-config for OpenAI)
    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
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
      console.warn(
        "[coach/plan] Model returned no structured output, using fallback"
      )
      return Response.json({ plan: getFallbackPlan(payload) })
    }

    return Response.json({ plan: output })
  } catch (error) {
    console.error("[coach/plan] Error:", error)

    // Return fallback if we have the parsed payload
    if (payload) {
      return Response.json({ plan: getFallbackPlan(payload) })
    }

    return Response.json(
      { error: "Failed to generate coaching plan" },
      { status: 500 }
    )
  }
}
