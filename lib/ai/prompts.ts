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
    `SUGGESTION CLICKED: ${req.taskTitle}`,
    `SUGGESTION CATEGORY: ${req.taskType}`,
    `SUGGESTION DETAIL: ${req.suggestionDescription}`,
    `SOURCE SIGNAL: ${req.sourceSignal}`,
    `TRIGGER: ${req.triggerType} — ${req.triggerReason}`,
    `RETRIES: ${req.retries}`,
    `RECENT ACTIONS:\n${req.recentActions.map((a) => `  - ${a}`).join("\n")}`,
    `USER GOAL: ${req.userGoal}`,
    `CONFIDENCE: ${req.confidenceLevel}`,
    `LEARNING PREFERENCE: ${req.learningPreference}`,
    `AVAILABLE TIME: ${req.availableMinutes} minutes`,
    `PAGE: ${req.currentPage}`,
    "",
    "IMPORTANT: Generate a coaching response specifically about the SUGGESTION CLICKED topic.",
    "All videos, docs, learning steps, and practice tasks MUST be directly relevant to that specific suggestion.",
    "Do NOT generate generic database content. Focus entirely on the clicked suggestion's subject matter.",
  ]
  return sections.join("\n\n")
}

// ── Fallback Plan ────────────────────────────────────────────────────────────

// ── Suggestion-specific fallback plans ────────────────────────────────────────
// Each key maps to a suggestion title prefix. When the AI fails, these give
// contextual responses instead of a generic "review the basics" answer.

const CONTEXTUAL_FALLBACKS: Record<string, Omit<ReturnType<typeof _baseFallback>, "estimatedMinutes" | "fallbackUsed">> = {
  "Enable Row Level Security": {
    title: "Secure your data with Row Level Security (RLS)",
    contextSummary: "You are configuring a PostgreSQL database and your users table currently has RLS disabled. This is a significant security gap for any multi-tenant or user-facing application.",
    whyNow: "Without RLS, any authenticated user can potentially access all rows in your users table. Enabling RLS before going to production prevents data leaks and is a critical step in securing your application.",
    quickExplanation: "Row Level Security lets you define policies that control which rows a user can see or modify. This guide walks you through enabling RLS, writing your first policy, and testing it.",
    steps: [
      { title: "Understand what RLS does", description: "RLS adds row-level access control to your table. When enabled, all queries are filtered through policies you define. Without a policy, no rows are visible.", type: "explain" as const },
      { title: "Enable RLS on your users table", description: "Run ALTER TABLE users ENABLE ROW LEVEL SECURITY; in your query editor. This activates RLS but blocks all access until you add a policy.", type: "do" as const },
      { title: "Create a basic select policy", description: "Write a policy like CREATE POLICY users_select ON users FOR SELECT USING (auth.uid() = id); so users can only read their own row.", type: "do" as const },
      { title: "Test with different user contexts", description: "Use Supabase's SQL editor with SET request.jwt.claims to simulate different users and verify the policy works correctly.", type: "check" as const },
      { title: "Add insert/update/delete policies", description: "Extend your policies to cover all operations. Each operation type needs its own policy with appropriate USING and WITH CHECK clauses.", type: "practice" as const },
    ],
    videos: [
      { title: "Row Level Security in PostgreSQL - Complete Guide", url: "https://www.youtube.com/watch?v=Ow_lr0SZVwA", channel: "Supabase", reason: "Official Supabase walkthrough of enabling and testing RLS policies", duration: "14 min", difficulty: "Beginner" as const },
      { title: "Postgres Row Level Security is a MUST", url: "https://www.youtube.com/watch?v=sp2rPQ2bGKU", channel: "Hussein Nasser", reason: "Deep dive into why RLS matters and how it works under the hood", duration: "22 min", difficulty: "Intermediate" as const },
      { title: "Supabase Auth & RLS - Full Stack Tutorial", url: "https://www.youtube.com/watch?v=0N6M5BBe9AE", channel: "The Net Ninja", reason: "Practical tutorial connecting auth with RLS policies in a real app", duration: "18 min", difficulty: "Intermediate" as const },
    ],
    docs: [
      { title: "PostgreSQL Row Security Policies", url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html", source: "PostgreSQL Docs", summary: "Official documentation on creating and managing row-level security policies.", reason: "Canonical reference for RLS syntax and behaviour" },
      { title: "Supabase Row Level Security Guide", url: "https://supabase.com/docs/guides/database/postgres/row-level-security", source: "Supabase", summary: "Step-by-step guide to implementing RLS with Supabase Auth integration.", reason: "Platform-specific guidance matching your current setup" },
      { title: "RLS Performance Considerations", url: "https://supabase.com/docs/guides/database/postgres/row-level-security#performance", source: "Supabase", summary: "How RLS policies affect query performance and how to optimize them.", reason: "Ensures your policies do not degrade query speed" },
    ],
    practiceTask: {
      title: "Enable RLS and write your first policy",
      instruction: "In your query editor, enable RLS on the users table with ALTER TABLE users ENABLE ROW LEVEL SECURITY; then create a SELECT policy that restricts users to viewing only their own row using auth.uid() = id.",
      secondaryTasks: [
        "Try querying the users table without a policy to see that zero rows are returned",
        "Add a separate INSERT policy for new user registration",
        "Test your policies by switching between user contexts in the SQL editor",
      ],
    },
    roadmapTags: ["Security Hardening", "Data Isolation", "Production Readiness", "Compliance", "Multi-tenant Architecture"],
    skillAreas: [
      { name: "Database Security", relevance: "Primary" as const },
      { name: "PostgreSQL Administration", relevance: "Primary" as const },
      { name: "Access Control Design", relevance: "Supporting" as const },
      { name: "Compliance Awareness", relevance: "Supporting" as const },
    ],
    relevanceLabel: "Directly relevant to your current task",
    confidenceLabel: "High",
    returnToTask: "Return to the schema panel and verify RLS is now enabled on the users table.",
  },
  "Learn SQL JOINs": {
    title: "Master SQL JOINs for complex queries",
    contextSummary: "You just ran a query using LEFT JOIN to count orders per user. This is a strong foundation. Expanding your JOIN knowledge will let you write more powerful reporting and analytics queries.",
    whyNow: "Your current query only uses LEFT JOIN. Many real-world reporting tasks require combining INNER JOIN, RIGHT JOIN, self-joins, and aggregations. Building this skill now will make you significantly faster at data analysis.",
    quickExplanation: "SQL JOINs combine rows from two or more tables based on related columns. Understanding when to use each type prevents missing data, duplicates, and incorrect counts in your queries.",
    steps: [
      { title: "Review JOIN types visually", description: "Understand the difference between INNER JOIN (matching rows only), LEFT JOIN (all left + matching right), RIGHT JOIN (all right + matching left), and FULL OUTER JOIN (all rows from both).", type: "explain" as const },
      { title: "Rewrite your query with INNER JOIN", description: "Change your LEFT JOIN query to INNER JOIN and compare the results. Notice which users disappear (those with zero orders).", type: "do" as const },
      { title: "Add GROUP BY with aggregates", description: "Extend your query to use GROUP BY with COUNT, SUM, and AVG to get richer order statistics per user.", type: "practice" as const },
      { title: "Try a self-join", description: "Write a query that joins the orders table to itself to find users who placed orders on the same day.", type: "practice" as const },
    ],
    videos: [
      { title: "SQL Joins Tutorial for Beginners", url: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw", channel: "Programming with Mosh", reason: "Clear visual explanation of all JOIN types with practical examples", duration: "12 min", difficulty: "Beginner" as const },
      { title: "SQL Joins Explained |  INNER, LEFT, RIGHT, FULL", url: "https://www.youtube.com/watch?v=2HVMiPPuPIM", channel: "Socratica", reason: "Concise comparison of JOIN types with Venn diagram visualizations", duration: "8 min", difficulty: "Beginner" as const },
      { title: "Advanced SQL Tutorial - JOINs and Subqueries", url: "https://www.youtube.com/watch?v=2Fn0WAyZV0E", channel: "freeCodeCamp", reason: "Takes JOINs further into subqueries and complex multi-table analysis", duration: "25 min", difficulty: "Intermediate" as const },
    ],
    docs: [
      { title: "PostgreSQL JOIN Syntax", url: "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-JOIN", source: "PostgreSQL Docs", summary: "Official reference for all JOIN types and their syntax in PostgreSQL.", reason: "Canonical reference for the database you are currently using" },
      { title: "SQL Joins - W3Schools", url: "https://www.w3schools.com/sql/sql_join.asp", source: "W3Schools", summary: "Interactive examples of INNER, LEFT, RIGHT, and FULL OUTER JOIN.", reason: "Quick interactive reference with try-it-yourself examples" },
      { title: "Visual Explanation of SQL Joins", url: "https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/", source: "Coding Horror", summary: "Jeff Atwood's famous visual guide to understanding SQL joins using Venn diagrams.", reason: "Best visual mental model for remembering JOIN behaviour" },
    ],
    practiceTask: {
      title: "Compare LEFT JOIN vs INNER JOIN results",
      instruction: "Run your current LEFT JOIN query, then rewrite it as an INNER JOIN. Compare the row counts and identify which users are missing from the INNER JOIN result. These are users with zero orders.",
      secondaryTasks: [
        "Add a HAVING clause to filter for users with more than 3 orders",
        "Write a query using FULL OUTER JOIN between users and a payments table",
        "Create a summary report using GROUP BY with multiple aggregate functions",
      ],
    },
    roadmapTags: ["Data Literacy", "SQL Proficiency", "Reporting Skills", "Analytics Foundations"],
    skillAreas: [
      { name: "SQL Query Writing", relevance: "Primary" as const },
      { name: "Data Analysis", relevance: "Primary" as const },
      { name: "Database Design Understanding", relevance: "Supporting" as const },
      { name: "Reporting & BI", relevance: "Supporting" as const },
    ],
    relevanceLabel: "Directly relevant to your current query",
    confidenceLabel: "High",
    returnToTask: "Return to the query editor and try modifying your LEFT JOIN query with the techniques above.",
  },
  "Add an index": {
    title: "Optimize query performance with indexes",
    contextSummary: "Your current query joins users and orders on user_id. Without an index on orders.user_id, PostgreSQL performs a sequential scan on every query, which gets slower as your data grows.",
    whyNow: "Adding an index on orders.user_id can reduce your JOIN query time by 10-100x depending on table size. This is one of the highest-impact performance improvements you can make right now.",
    quickExplanation: "An index is a data structure that lets PostgreSQL find matching rows without scanning the entire table. Creating one on foreign key columns used in JOINs and WHERE clauses dramatically speeds up queries.",
    steps: [
      { title: "Check current query plan", description: "Run EXPLAIN ANALYZE on your current query to see if PostgreSQL is doing a Seq Scan on the orders table. This confirms an index would help.", type: "check" as const },
      { title: "Create the index", description: "Run CREATE INDEX idx_orders_user_id ON orders(user_id); to add a B-tree index on the foreign key column.", type: "do" as const },
      { title: "Re-run EXPLAIN ANALYZE", description: "Run the same EXPLAIN ANALYZE query again. You should see an Index Scan instead of Seq Scan, with significantly lower execution time.", type: "check" as const },
      { title: "Understand index trade-offs", description: "Indexes speed up reads but slow down writes slightly. Learn about when NOT to add indexes and how to monitor index usage.", type: "explain" as const },
    ],
    videos: [
      { title: "Database Indexing Explained", url: "https://www.youtube.com/watch?v=HubezKbFL7E", channel: "Hussein Nasser", reason: "Deep dive into how B-tree indexes work and when to use them", duration: "18 min", difficulty: "Intermediate" as const },
      { title: "PostgreSQL Performance Tuning", url: "https://www.youtube.com/watch?v=lJnV7SNy7cE", channel: "Crunchy Data", reason: "Practical PostgreSQL indexing strategies for real-world workloads", duration: "24 min", difficulty: "Intermediate" as const },
      { title: "Indexing in SQL Explained in 10 Minutes", url: "https://www.youtube.com/watch?v=-qNSXPIi4D4", channel: "Web Dev Simplified", reason: "Quick, clear explanation of index types and when to use each one", duration: "10 min", difficulty: "Beginner" as const },
    ],
    docs: [
      { title: "PostgreSQL Indexes", url: "https://www.postgresql.org/docs/current/indexes.html", source: "PostgreSQL Docs", summary: "Complete guide to PostgreSQL index types, creation, and maintenance.", reason: "Canonical reference for index syntax and options" },
      { title: "PostgreSQL EXPLAIN Documentation", url: "https://www.postgresql.org/docs/current/sql-explain.html", source: "PostgreSQL Docs", summary: "How to read and interpret query execution plans.", reason: "Essential for verifying your index is actually being used" },
      { title: "Index Types in PostgreSQL", url: "https://www.postgresql.org/docs/current/indexes-types.html", source: "PostgreSQL Docs", summary: "Overview of B-tree, Hash, GiST, and GIN index types and their use cases.", reason: "Helps you choose the right index type for different column types" },
    ],
    practiceTask: {
      title: "Add an index and measure the improvement",
      instruction: "Run EXPLAIN ANALYZE on your current JOIN query, note the execution time. Then create an index with CREATE INDEX idx_orders_user_id ON orders(user_id); and run EXPLAIN ANALYZE again. Compare the before and after execution times.",
      secondaryTasks: [
        "Check for other foreign key columns that might benefit from indexes",
        "Try a composite index on (user_id, created_at) for time-range queries",
        "Use pg_stat_user_indexes to check index usage statistics",
      ],
    },
    roadmapTags: ["Performance Optimization", "Database Tuning", "Production Readiness", "Query Efficiency", "Scalability"],
    skillAreas: [
      { name: "Query Performance Tuning", relevance: "Primary" as const },
      { name: "Database Administration", relevance: "Primary" as const },
      { name: "PostgreSQL Internals", relevance: "Supporting" as const },
      { name: "Capacity Planning", relevance: "Supporting" as const },
    ],
    relevanceLabel: "Directly relevant to your current query",
    confidenceLabel: "High",
    returnToTask: "Return to the query editor and run EXPLAIN ANALYZE to verify your new index is being used.",
  },
  "Database design patterns": {
    title: "Multi-tenant database architecture patterns",
    contextSummary: "Your customer-portal schema suggests a multi-tenant application. Choosing the right isolation strategy now prevents costly migrations later and ensures data security between tenants.",
    whyNow: "Multi-tenant architecture decisions are hard to change after launch. Understanding shared schemas vs. separate schemas vs. separate databases now will save significant refactoring effort and prevent data leakage risks.",
    quickExplanation: "Multi-tenant databases serve multiple customers from the same application. The key decision is how to isolate tenant data: shared tables with a tenant_id column, separate schemas per tenant, or separate databases. Each has trade-offs in complexity, cost, and isolation.",
    steps: [
      { title: "Audit your current schema", description: "Check which tables have a tenant_id or org_id column. Tables without tenant identification are a data isolation risk in multi-tenant apps.", type: "check" as const },
      { title: "Understand isolation strategies", description: "Learn the three main approaches: shared database with tenant_id (cheapest, least isolated), schema-per-tenant (balanced), and database-per-tenant (most isolated, most expensive).", type: "explain" as const },
      { title: "Implement tenant_id with RLS", description: "For shared-table architecture, add RLS policies that filter by tenant_id. This gives strong isolation without the complexity of separate schemas.", type: "do" as const },
      { title: "Add connection pooling", description: "Multi-tenant apps with many tenants need connection pooling (e.g. PgBouncer or Supabase's built-in pooler) to avoid exhausting database connections.", type: "do" as const },
    ],
    videos: [
      { title: "Multi-tenancy in PostgreSQL", url: "https://www.youtube.com/watch?v=x1fCJ7sUXCM", channel: "Hussein Nasser", reason: "Practical comparison of multi-tenant strategies with PostgreSQL examples", duration: "20 min", difficulty: "Intermediate" as const },
      { title: "SaaS Multi-Tenant Database Design", url: "https://www.youtube.com/watch?v=joz0DoSQDNw", channel: "Fireship", reason: "Quick overview of tenant isolation patterns with real-world trade-offs", duration: "8 min", difficulty: "Beginner" as const },
      { title: "Scaling Multi-Tenant Databases", url: "https://www.youtube.com/results?search_query=scaling+multi+tenant+postgres+database", channel: "Various", reason: "Search for talks on scaling challenges specific to multi-tenant systems", duration: "15-30 min", difficulty: "Advanced" as const },
    ],
    docs: [
      { title: "Multi-tenant Data Architecture", url: "https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/multi-tenant-data-architecture.html", source: "AWS Well-Architected", summary: "AWS best practices for designing multi-tenant data layers.", reason: "Industry-standard guidance on tenant isolation patterns" },
      { title: "PostgreSQL Schema-based Multitenancy", url: "https://www.postgresql.org/docs/current/ddl-schemas.html", source: "PostgreSQL Docs", summary: "How to use PostgreSQL schemas for logical tenant separation.", reason: "Foundation for schema-per-tenant isolation strategy" },
      { title: "Supabase Multi-tenancy Guide", url: "https://supabase.com/docs/guides/resources/multi-tenancy", source: "Supabase", summary: "Implementing multi-tenant patterns with Supabase RLS and auth.", reason: "Directly applicable to your current platform setup" },
    ],
    practiceTask: {
      title: "Add tenant_id to your tables and create RLS policies",
      instruction: "Add a tenant_id column to your users and orders tables. Then create RLS policies that filter all queries by the current tenant's ID. Test by querying as different tenants.",
      secondaryTasks: [
        "Create a tenants table to store tenant metadata and subscription info",
        "Set up a search_path-based schema isolation prototype",
        "Benchmark query performance with 100k rows across 10 tenants vs. 10 schemas",
      ],
    },
    roadmapTags: ["Architecture Design", "Multi-tenancy", "Data Isolation", "Scalability", "SaaS Foundations", "Security"],
    skillAreas: [
      { name: "Database Architecture", relevance: "Primary" as const },
      { name: "Multi-tenant Design", relevance: "Primary" as const },
      { name: "Security Architecture", relevance: "Supporting" as const },
      { name: "Capacity Planning", relevance: "Supporting" as const },
    ],
    relevanceLabel: "Directly relevant to your schema design",
    confidenceLabel: "High",
    returnToTask: "Return to the schema panel and check which tables need a tenant_id column for proper tenant isolation.",
  },
  "Backup and disaster recovery": {
    title: "Database backup and disaster recovery essentials",
    contextSummary: "You are working with a production database. Having a tested backup and recovery strategy is essential before making schema changes or deploying new features.",
    whyNow: "Database changes like adding indexes, enabling RLS, or modifying schemas carry risk. Knowing you can restore to a known good state gives you confidence to make changes and protects against data loss.",
    quickExplanation: "A solid backup strategy combines automated snapshots, point-in-time recovery (PITR), and tested restore procedures. The key is not just having backups, but knowing they work.",
    steps: [
      { title: "Check your current backup status", description: "Verify that automated backups are enabled in your database dashboard. Check the retention period and last successful backup time.", type: "check" as const },
      { title: "Understand PITR", description: "Point-in-Time Recovery lets you restore to any moment within your retention window using WAL (Write-Ahead Log) archiving. This is more granular than daily snapshots.", type: "explain" as const },
      { title: "Test a restore procedure", description: "Create a test branch or clone of your database from a backup. Verify the data is complete and your application connects correctly.", type: "do" as const },
      { title: "Document your recovery plan", description: "Write down the exact steps to restore your database: who to contact, which tools to use, expected RTO (Recovery Time Objective) and RPO (Recovery Point Objective).", type: "practice" as const },
    ],
    videos: [
      { title: "PostgreSQL Backup and Recovery", url: "https://www.youtube.com/watch?v=kbCytSYPh0E", channel: "Crunchy Data", reason: "Comprehensive guide to pg_dump, pg_basebackup, and PITR in PostgreSQL", duration: "22 min", difficulty: "Intermediate" as const },
      { title: "Database Disaster Recovery Planning", url: "https://www.youtube.com/results?search_query=database+disaster+recovery+planning+postgresql", channel: "Various", reason: "Search for talks on building reliable database recovery procedures", duration: "15-25 min", difficulty: "Intermediate" as const },
      { title: "Supabase Database Backups Explained", url: "https://www.youtube.com/results?search_query=supabase+database+backups+point+in+time+recovery", channel: "Supabase", reason: "Platform-specific backup and restore workflows for Supabase databases", duration: "10 min", difficulty: "Beginner" as const },
    ],
    docs: [
      { title: "PostgreSQL Backup and Restore", url: "https://www.postgresql.org/docs/current/backup.html", source: "PostgreSQL Docs", summary: "Official guide covering SQL dump, file system level, and continuous archiving backup methods.", reason: "Canonical reference for all PostgreSQL backup strategies" },
      { title: "Supabase Database Backups", url: "https://supabase.com/docs/guides/platform/backups", source: "Supabase", summary: "How to manage automated backups and perform restores on Supabase.", reason: "Specific to your current database platform" },
      { title: "RTO vs RPO Explained", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html", source: "AWS Well-Architected", summary: "Understanding Recovery Time and Recovery Point Objectives for disaster planning.", reason: "Framework for defining your backup requirements" },
    ],
    practiceTask: {
      title: "Verify your backup configuration",
      instruction: "Navigate to your database settings and confirm automated backups are enabled. Check the retention period and note the timestamp of the last successful backup. If using Supabase, check the Backups tab in your project dashboard.",
      secondaryTasks: [
        "Take a manual backup using pg_dump before making your next schema change",
        "Practice restoring a backup to a test environment",
        "Write a one-page disaster recovery runbook for your team",
      ],
    },
    roadmapTags: ["Production Readiness", "Operational Excellence", "Data Durability", "Risk Management", "Compliance"],
    skillAreas: [
      { name: "Database Operations", relevance: "Primary" as const },
      { name: "Disaster Recovery", relevance: "Primary" as const },
      { name: "Risk Management", relevance: "Supporting" as const },
      { name: "Operational Awareness", relevance: "Supporting" as const },
    ],
    relevanceLabel: "Important for your production database",
    confidenceLabel: "High",
    returnToTask: "Return to your database dashboard and verify backup status before continuing schema changes.",
  },
}

function _baseFallback(req: CoachRequest) {
  return {
    estimatedMinutes: Math.min(req.availableMinutes, 10),
    fallbackUsed: true,
  }
}

export function getFallbackPlan(req: CoachRequest) {
  // Try to match the suggestion title to a contextual fallback
  for (const [prefix, plan] of Object.entries(CONTEXTUAL_FALLBACKS)) {
    if (req.taskTitle.includes(prefix)) {
      return {
        ...plan,
        ..._baseFallback(req),
      }
    }
  }

  // True generic fallback — only used when nothing matches
  return {
    title: `Quick guide: ${req.taskTitle}`,
    contextSummary: `You are working on: ${req.taskTitle}. ${req.suggestionDescription || ""}`,
    whyNow: "Understanding this topic will help you work more effectively with your current tools and avoid common pitfalls in production.",
    quickExplanation: "The steps below cover the key concepts for this topic. Follow them in order for the best learning experience.",
    steps: [
      {
        title: "Understand the concept",
        description: `Review the documentation related to "${req.taskTitle}" to build a solid mental model before making changes.`,
        type: "explain" as const,
      },
      {
        title: "Apply in a safe environment",
        description: "Make one small, reversible change to build familiarity. Check the output or logs to verify it worked as expected.",
        type: "do" as const,
      },
    ],
    videos: [
      { title: "SQL For Beginners Tutorial", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", channel: "freeCodeCamp", reason: "Comprehensive SQL fundamentals covering queries, joins, and data manipulation", duration: "44 min", difficulty: "Beginner" as const },
      { title: "7 Database Paradigms", url: "https://www.youtube.com/watch?v=W2Z7fbCLSTw", channel: "Fireship", reason: "Quick overview of different database types and when to use each one", duration: "10 min", difficulty: "Intermediate" as const },
      { title: "Database Indexing Explained", url: "https://www.youtube.com/watch?v=HubezKbFL7E", channel: "Hussein Nasser", reason: "Understanding indexes is critical for query performance optimization", duration: "18 min", difficulty: "Intermediate" as const },
    ],
    docs: [
      { title: "PostgreSQL: Getting Started", url: "https://www.postgresql.org/docs/current/tutorial-start.html", source: "PostgreSQL Docs", summary: "Official getting started guide covering basic PostgreSQL setup and usage.", reason: "Foundational reference for your database tasks" },
      { title: "Supabase Database Guide", url: "https://supabase.com/docs/guides/database/overview", source: "Supabase", summary: "Complete guide to working with databases on the Supabase platform.", reason: "Platform-specific guidance for database management" },
      { title: "OWASP Database Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html", source: "OWASP", summary: "Security checklist for database-backed applications.", reason: "Ensures your configuration follows security standards" },
    ],
    practiceTask: {
      title: "Explore and test",
      instruction: `Find one aspect of "${req.taskTitle}" that you are unsure about and look it up in the official documentation. Then try applying what you learned with a small, safe change.`,
      secondaryTasks: [
        "Check logs or output after your change to verify it worked",
        "Document what you learned for future reference",
      ],
    },
    roadmapTags: ["Technical Foundations", "Platform Literacy", "Production Readiness"],
    skillAreas: [
      { name: "Database Management", relevance: "Primary" as const },
      { name: "Platform Engineering", relevance: "Supporting" as const },
      { name: "Technical Problem Solving", relevance: "Supporting" as const },
    ],
    relevanceLabel: "Related to your current task",
    confidenceLabel: "Low",
    returnToTask: "Return to your task and apply what you reviewed.",
    ..._baseFallback(req),
  }
}
