import { z } from "zod"

// ── Coaching Plan Output Schema ──────────────────────────────────────────────
// Structured output from Grok. Richer response with videos, docs, roadmap, skills.

export const coachingPlanSchema = z.object({
  title: z.string().describe("Short, specific coaching title tied to the user's current task"),

  // 1. Context summary
  contextSummary: z.string().describe("1-2 sentence summary of what FlowState thinks the user is currently doing, based on the task and recent actions"),

  // 2. Why this matters now
  whyNow: z.string().describe("2-3 sentence explanation of why this topic is important right now in the user's workflow. Be specific and tie it to business impact."),

  // 3. Recommended learning path
  quickExplanation: z.string().describe("2-3 sentence overview of the learning path"),
  steps: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(["explain", "do", "check", "practice"]),
      })
    )
    .min(2)
    .max(5)
    .describe("2-5 actionable learning steps forming a recommended learning path"),

  // 4. YouTube videos to watch
  videos: z
    .array(
      z.object({
        title: z.string().describe("Video title"),
        url: z.string().describe("Full YouTube URL for the video, e.g. https://www.youtube.com/watch?v=..."),
        channel: z.string().describe("YouTube channel or creator name"),
        reason: z.string().describe("Short reason why this video is relevant to the current task"),
        duration: z.string().describe("Estimated duration like '12 min' or '8 min'"),
        difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).describe("Difficulty level"),
      })
    )
    .min(3)
    .max(5)
    .describe("3-5 curated YouTube video recommendations relevant to the task"),

  // 5. Docs to read
  docs: z
    .array(
      z.object({
        title: z.string().describe("Document or article title"),
        url: z.string().describe("Full URL to the documentation page"),
        source: z.string().describe("Source like 'PostgreSQL Docs', 'Supabase Guide', etc."),
        summary: z.string().describe("1 sentence summary of what the doc covers"),
        reason: z.string().describe("Short reason why this doc matters for the current task"),
      })
    )
    .min(3)
    .max(5)
    .describe("3-5 documentation resources relevant to the task"),

  // 6. Practice task
  practiceTask: z.object({
    title: z.string(),
    instruction: z.string(),
    secondaryTasks: z.array(z.string()).min(1).max(3).describe("1-3 additional practice suggestions"),
  }).describe("Hands-on practice exercises the user can try immediately"),

  // 7. Roadmap alignment
  roadmapTags: z
    .array(z.string())
    .min(3)
    .max(6)
    .describe("3-6 roadmap or business goal tags this task aligns with, e.g. 'Platform Foundations', 'Security Hardening', 'Production Readiness'"),

  // 8. Skill growth mapping
  skillAreas: z
    .array(
      z.object({
        name: z.string().describe("Skill area name like 'Backend Engineering' or 'Database Design'"),
        relevance: z.enum(["Primary", "Supporting"]).describe("Whether this is a primary or supporting skill for this task"),
      })
    )
    .min(3)
    .max(6)
    .describe("3-6 capability areas this work develops"),

  // Meta
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
  suggestionDescription: z.string().describe("Full description of the suggestion the user clicked, explaining what it is and why it matters"),
  sourceSignal: z.string().describe("What triggered this suggestion, e.g. 'RLS disabled on users table' or 'LEFT JOIN detected in query'"),
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
