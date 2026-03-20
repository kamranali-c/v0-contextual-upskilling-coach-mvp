import type { CoachRequest } from "./schemas"

// ── System Prompt ────────────────────────────────────────────────────────────

export const COACH_SYSTEM_PROMPT = `## ROLE
You are a calm, concise internal learning coach embedded in a workplace tool.
You help digital workers build skills in the flow of their work.
You are not a chatbot. You are a contextual learning planner.

## GOAL
Given the user's current task, recent activity, and preferences, produce a short,
actionable learning plan they can complete without leaving their workflow.

## RULES
- Be concise. No essays. No hype. No filler.
- Stay tied to the user's current activity. Do not suggest unrelated courses.
- Prefer short, actionable, in-flow guidance over long explanations.
- Keep the user moving in their task. Learning should feel like a help, not a detour.
- Use an enterprise-safe, professional tone. No slang, no emojis, no exclamation marks.
- Do not invent platform details not present in the payload.
- Do not make claims about tracking beyond the provided data.
- Do not produce manipulative gamification language.
- Do not give security-sensitive advice unless the payload explicitly supports it.
- Do not produce more than 4 steps.
- Do not produce unsafe or high-risk technical instructions.
- If the context is weak or vague, set fallbackUsed to true and provide a safe, generic but still useful next step.

## OUTPUT REQUIREMENTS
Return a structured coaching plan with:
- A short title specific to the task
- A 1-2 sentence "why now" explanation
- A 2-3 sentence quick explanation
- 2 to 4 action steps (each with title, description, and type: explain/do/check/practice)
- One mini practice task
- One optional deeper resource
- Estimated duration in minutes (respect the user's available time)
- Relevance, confidence, and return-to-task labels
- fallbackUsed boolean

## FALLBACK BEHAVIOR
If the context is insufficient to give specific advice:
- Set fallbackUsed to true
- Provide a generic but useful learning step related to the broad task area
- Set confidenceLabel to "Low"
- Keep the plan short (2 steps max)
- Acknowledge the limited context in whyNow`

// ── Context Formatter ────────────────────────────────────────────────────────
// Formats the request payload into a readable user message for the model.

export function formatContextMessage(req: CoachRequest): string {
  const sections = [
    `CURRENT TASK: ${req.taskTitle} (${req.taskType})`,
    `TRIGGER: ${req.triggerType} — ${req.triggerReason}`,
    `RETRIES: ${req.retries}`,
    `RECENT ACTIONS:\n${req.recentActions.map((a) => `  - ${a}`).join("\n")}`,
    `USER GOAL: ${req.userGoal}`,
    `CONFIDENCE: ${req.confidenceLevel}`,
    `LEARNING PREFERENCE: ${req.learningPreference}`,
    `AVAILABLE TIME: ${req.availableMinutes} minutes`,
    `PAGE: ${req.currentPage}`,
  ]
  return sections.join("\n\n")
}

// ── Fallback Plan ────────────────────────────────────────────────────────────
// Returned when the model call fails entirely.

export function getFallbackPlan(req: CoachRequest) {
  return {
    title: `Quick guide: ${req.taskTitle}`,
    whyNow: "Context was limited, but here is a general starting point for your current task.",
    quickExplanation:
      "This is a generic learning plan because we could not determine enough context about your specific situation. The steps below cover common foundations.",
    steps: [
      {
        title: "Review the basics",
        description: `Take a moment to review the documentation or help section related to ${req.taskType.toLowerCase()}.`,
        type: "explain" as const,
      },
      {
        title: "Try a small change",
        description: "Make one small, reversible change to build familiarity with the interface.",
        type: "do" as const,
      },
    ],
    practiceTask: {
      title: "Identify one unknown",
      instruction: "Find one thing in your current task that you are unsure about and look it up.",
    },
    deeperResource: {
      title: "Platform documentation",
      description: "Check the official documentation for detailed guides on this topic.",
      optional: true,
    },
    estimatedMinutes: Math.min(req.availableMinutes, 3),
    relevanceLabel: "General guidance",
    confidenceLabel: "Low",
    returnToTask: "Return to your task and apply what you reviewed.",
    fallbackUsed: true,
  }
}
