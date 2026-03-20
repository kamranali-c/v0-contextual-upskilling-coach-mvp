import { z } from "zod"

// ── Coaching Plan Output Schema ──────────────────────────────────────────────
// Structured output from Grok. Every field is required (nullable where needed)
// so it works with strict mode in AI SDK 6.

export const coachingPlanSchema = z.object({
  title: z.string().describe("Short, specific coaching title tied to the user's current task"),
  whyNow: z.string().describe("1-2 sentence explanation of why this suggestion is relevant right now"),
  quickExplanation: z.string().describe("2-3 sentence overview of the learning plan"),
  steps: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(["explain", "do", "check", "practice"]),
      })
    )
    .min(2)
    .max(4)
    .describe("2-4 actionable learning steps"),
  practiceTask: z.object({
    title: z.string(),
    instruction: z.string(),
  }).describe("One small practice exercise the user can do immediately"),
  deeperResource: z.object({
    title: z.string(),
    description: z.string(),
    optional: z.boolean(),
  }).describe("One optional resource for deeper learning"),
  estimatedMinutes: z.number().describe("Estimated duration in minutes"),
  relevanceLabel: z.string().describe("Short label like 'Directly relevant' or 'Related to your task'"),
  confidenceLabel: z.string().describe("How confident the coach is: 'High', 'Medium', or 'Low'"),
  returnToTask: z.string().describe("Short instruction for returning to the original task after learning"),
  fallbackUsed: z.boolean().describe("True if the context was too weak to give specific advice"),
})

export type CoachingPlan = z.infer<typeof coachingPlanSchema>

// ── Request Payload Schema ───────────────────────────────────────────────────
// Compact payload sent from the client to the API route.

export const coachRequestSchema = z.object({
  taskTitle: z.string(),
  taskType: z.string(),
  currentPage: z.string(),
  triggerType: z.string(),
  triggerReason: z.string(),
  retries: z.number(),
  recentActions: z.array(z.string()),
  userGoal: z.string(),
  confidenceLevel: z.string(),
  learningPreference: z.string(),
  availableMinutes: z.number(),
})

export type CoachRequest = z.infer<typeof coachRequestSchema>
