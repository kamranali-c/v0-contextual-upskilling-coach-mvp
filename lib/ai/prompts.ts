import type { CoachRequest } from "./schemas"

// ── System Prompt ────────────────────────────────────────────────────────────

export const COACH_SYSTEM_PROMPT = `## ROLE
You are a calm, concise internal learning coach embedded in a workplace tool called FlowState.
You help digital workers build skills in the flow of their work.
You are not a chatbot. You are a contextual learning planner that generates rich, actionable coaching responses.

## GOAL
Given the user's current task, recent activity, and preferences, produce a comprehensive
coaching response that includes context awareness, curated learning resources, practice tasks,
roadmap alignment, and skill growth mapping.

## RULES
- Be concise but comprehensive. Cover all required sections with meaningful content.
- Stay tied to the user's current activity. All suggestions must be contextually relevant.
- Prefer actionable, in-flow guidance over abstract explanations.
- Use an enterprise-safe, professional tone. No slang, no emojis, no exclamation marks.
- Do not invent platform details not present in the payload.
- Do not make claims about tracking beyond the provided data.
- Do not produce manipulative gamification language.
- Do not give security-sensitive advice unless the payload explicitly supports it.
- Do not produce unsafe or high-risk technical instructions.
- If the context is weak or vague, set fallbackUsed to true and provide a safe, generic but still useful response.

## OUTPUT REQUIREMENTS
Return a structured coaching plan with ALL of the following:

### 1. Context Summary
A 1-2 sentence summary of what you think the user is currently doing based on the task and recent actions.
Example: "You are configuring database security for a multi-tenant app."

### 2. Why This Matters Now
A 2-3 sentence explanation of why this topic is important RIGHT NOW in the user's workflow.
Be specific. Tie it to business impact, production readiness, or skill progression.
Example: "RLS matters because this project is moving from simple data access to tenant-aware production behaviour."

### 3. Recommended Learning Path
2-5 action steps forming a learning sequence tailored to the specific task.
Each step should have a title, description, and type (explain/do/check/practice).

### 4. YouTube Videos to Watch
3-5 curated video recommendations. Each must include:
- A realistic, specific title
- A realistic channel/creator name
- A short reason why this video is relevant
- An estimated duration (e.g. "12 min")
- A difficulty level (Beginner/Intermediate/Advanced)

Make video titles and channels feel real and specific, like actual YouTube content.
Examples of good channel names: "Hussein Nasser", "Fireship", "Web Dev Simplified", "Supabase", "PostgresTV"

### 5. Docs to Read
3-5 documentation resources. Each must include:
- A specific title
- A source (e.g. "PostgreSQL Docs", "Supabase Guide", "MDN Web Docs")
- A 1-sentence summary
- A short reason why it matters for the current task

### 6. Practice Task
One primary practice exercise with:
- A clear title
- A detailed instruction
- 1-3 additional secondary practice suggestions

### 7. Roadmap Alignment
3-6 roadmap or business goal tags showing how this task maps to broader objectives.
Examples: "Platform Foundations", "Security Hardening", "Production Readiness"

### 8. Skill Growth Mapping
3-6 capability areas this work develops. Each must have:
- A skill area name
- Whether it is "Primary" or "Supporting" relevance

### Meta
- Estimated duration in minutes (respect the user's available time)
- Relevance label
- Confidence label (High/Medium/Low)
- Return-to-task instruction
- fallbackUsed boolean

## FALLBACK BEHAVIOR
If the context is insufficient to give specific advice:
- Set fallbackUsed to true
- Provide generic but useful content for all sections
- Set confidenceLabel to "Low"
- Keep learning steps to 2 max
- Acknowledge the limited context in contextSummary`

// ── Context Formatter ────────────────────────────────────────────────────────

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

export function getFallbackPlan(req: CoachRequest) {
  return {
    title: `Quick guide: ${req.taskTitle}`,
    contextSummary: "Context was limited, but it appears you are working on a technical task that involves database or platform configuration.",
    whyNow: "This is a general starting point for your current task. Building foundational understanding of the tools you are working with will help you move faster and make fewer mistakes in production.",
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
    videos: [
      {
        title: "Getting Started with Database Configuration",
        channel: "Fireship",
        reason: "Quick overview of database setup fundamentals",
        duration: "10 min",
        difficulty: "Beginner" as const,
      },
      {
        title: "Database Best Practices for Web Developers",
        channel: "Web Dev Simplified",
        reason: "Covers common patterns you will encounter",
        duration: "15 min",
        difficulty: "Intermediate" as const,
      },
      {
        title: "Production Database Checklist",
        channel: "Hussein Nasser",
        reason: "Ensures your database is production-ready",
        duration: "12 min",
        difficulty: "Intermediate" as const,
      },
    ],
    docs: [
      {
        title: "Database Configuration Guide",
        source: "Platform Documentation",
        summary: "Complete guide to setting up and configuring your database.",
        reason: "Covers the fundamentals of your current task",
      },
      {
        title: "Security Best Practices",
        source: "OWASP",
        summary: "Security checklist for database-backed applications.",
        reason: "Ensures your configuration follows security standards",
      },
      {
        title: "Performance Optimization Guide",
        source: "Platform Documentation",
        summary: "Tips for optimizing database queries and configuration.",
        reason: "Helps you build performant database queries from the start",
      },
    ],
    practiceTask: {
      title: "Identify one unknown",
      instruction: "Find one thing in your current task that you are unsure about and look it up in the documentation.",
      secondaryTasks: [
        "Make one small, reversible change to test your understanding",
        "Check the logs or output after your change to verify it worked",
      ],
    },
    roadmapTags: [
      "Technical Foundations",
      "Platform Literacy",
      "Production Readiness",
    ],
    skillAreas: [
      { name: "Database Management", relevance: "Primary" as const },
      { name: "Platform Engineering", relevance: "Supporting" as const },
      { name: "Technical Problem Solving", relevance: "Supporting" as const },
    ],
    estimatedMinutes: Math.min(req.availableMinutes, 3),
    relevanceLabel: "General guidance",
    confidenceLabel: "Low",
    returnToTask: "Return to your task and apply what you reviewed.",
    fallbackUsed: true,
  }
}
