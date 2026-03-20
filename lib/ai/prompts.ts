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

### 2. Why This Matters Now
A 2-3 sentence explanation of why this topic is important RIGHT NOW in the user's workflow.
Be specific. Tie it to business impact, production readiness, or skill progression.

### 3. Recommended Learning Path
2-5 action steps forming a learning sequence tailored to the specific task.
Each step should have a title, description, and type (explain/do/check/practice).

### 4. YouTube Videos to Watch
3-5 curated video recommendations. Each must include:
- A realistic, specific title
- A real, valid YouTube URL. Use actual YouTube video URLs you know exist, or construct realistic ones.
  For example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  If you are unsure of the exact URL, use a realistic search-based URL like:
  https://www.youtube.com/results?search_query=postgresql+row+level+security+tutorial
- A realistic channel/creator name (e.g. "Hussein Nasser", "Fireship", "Web Dev Simplified", "Supabase", "Traversy Media")
- A short reason why this video is relevant
- An estimated duration (e.g. "12 min")
- A difficulty level (Beginner/Intermediate/Advanced)

### 5. Docs to Read
3-5 documentation resources. Each must include:
- A specific title
- A real URL to the actual documentation page (e.g. https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
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
    \`CURRENT TASK: \${req.taskTitle} (\${req.taskType})\`,
    \`TRIGGER: \${req.triggerType} — \${req.triggerReason}\`,
    \`RETRIES: \${req.retries}\`,
    \`RECENT ACTIONS:\n\${req.recentActions.map((a) => \`  - \${a}\`).join("\\n")}\`,
    \`USER GOAL: \${req.userGoal}\`,
    \`CONFIDENCE: \${req.confidenceLevel}\`,
    \`LEARNING PREFERENCE: \${req.learningPreference}\`,
    \`AVAILABLE TIME: \${req.availableMinutes} minutes\`,
    \`PAGE: \${req.currentPage}\`,
  ]
  return sections.join("\\n\\n")
}

// ── Fallback Plan ────────────────────────────────────────────────────────────

export function getFallbackPlan(req: CoachRequest) {
  return {
    title: \`Quick guide: \${req.taskTitle}\`,
    contextSummary: "Context was limited, but it appears you are working on a technical task that involves database or platform configuration.",
    whyNow: "This is a general starting point for your current task. Building foundational understanding of the tools you are working with will help you move faster and make fewer mistakes in production.",
    quickExplanation:
      "This is a generic learning plan because we could not determine enough context about your specific situation. The steps below cover common foundations.",
    steps: [
      {
        title: "Review the basics",
        description: \`Take a moment to review the documentation or help section related to \${req.taskType.toLowerCase()}.\`,
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
        title: "SQL For Beginners Tutorial",
        url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        channel: "freeCodeCamp",
        reason: "Comprehensive SQL fundamentals covering queries, joins, and data manipulation",
        duration: "44 min",
        difficulty: "Beginner" as const,
      },
      {
        title: "7 Database Paradigms",
        url: "https://www.youtube.com/watch?v=W2Z7fbCLSTw",
        channel: "Fireship",
        reason: "Quick overview of different database types and when to use each one",
        duration: "10 min",
        difficulty: "Intermediate" as const,
      },
      {
        title: "Database Indexing Explained",
        url: "https://www.youtube.com/watch?v=HubezKbFL7E",
        channel: "Hussein Nasser",
        reason: "Understanding indexes is critical for query performance optimization",
        duration: "18 min",
        difficulty: "Intermediate" as const,
      },
    ],
    docs: [
      {
        title: "PostgreSQL: Getting Started",
        url: "https://www.postgresql.org/docs/current/tutorial-start.html",
        source: "PostgreSQL Docs",
        summary: "Official getting started guide covering basic PostgreSQL setup and usage.",
        reason: "Covers the fundamentals of your current database task",
      },
      {
        title: "Supabase Database Guide",
        url: "https://supabase.com/docs/guides/database/overview",
        source: "Supabase",
        summary: "Complete guide to working with databases on the Supabase platform.",
        reason: "Platform-specific guidance for database configuration and management",
      },
      {
        title: "OWASP Database Security Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html",
        source: "OWASP",
        summary: "Security checklist for database-backed applications.",
        reason: "Ensures your configuration follows industry security standards",
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
