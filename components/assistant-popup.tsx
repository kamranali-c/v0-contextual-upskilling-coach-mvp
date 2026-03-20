"use client"

import { useState } from "react"
import {
  Sparkles,
  X,
  Minus,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Shield,
  Wrench,
  TestTube,
  Lightbulb,
  Bookmark,
  MessageSquare,
  Loader2,
  Play,
  FileText,
  Target,
  Map,
  TrendingUp,
  ExternalLink,
  ThumbsUp,
  Clock,
  Zap,
  ArrowRight,
  GripVertical,
  User,
  Trophy,
  Flame,
  Award,
  Database,
  Code,
  GitBranch,
  Settings,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CoachingPlan } from "@/lib/ai/schemas"

// ── Client-side fallback plans (used when API is completely unreachable) ────
const CLIENT_FALLBACKS: Record<string, CoachingPlan> = {
  "Enable Row Level Security": {
    title: "Secure your data with Row Level Security (RLS)",
    contextSummary: "You are configuring a PostgreSQL database and your users table currently has RLS disabled. This is a significant security gap for any multi-tenant or user-facing application.",
    whyNow: "Without RLS, any authenticated user can potentially access all rows in your users table. Enabling RLS before going to production prevents data leaks and is a critical step in securing your application.",
    quickExplanation: "Row Level Security lets you define policies that control which rows a user can see or modify. This guide walks you through enabling RLS, writing your first policy, and testing it.",
    steps: [
      { title: "Understand what RLS does", description: "RLS adds row-level access control to your table. When enabled, all queries are filtered through policies you define. Without a policy, no rows are visible.", type: "explain" },
      { title: "Enable RLS on your users table", description: "Run ALTER TABLE users ENABLE ROW LEVEL SECURITY; in your query editor. This activates RLS but blocks all access until you add a policy.", type: "do" },
      { title: "Create a basic select policy", description: "Write a policy like CREATE POLICY users_select ON users FOR SELECT USING (auth.uid() = id); so users can only read their own row.", type: "do" },
      { title: "Test with different user contexts", description: "Use the SQL editor with SET request.jwt.claims to simulate different users and verify the policy works correctly.", type: "check" },
      { title: "Add insert/update/delete policies", description: "Extend your policies to cover all operations. Each operation type needs its own policy with appropriate USING and WITH CHECK clauses.", type: "practice" },
    ],
    videos: [
      { title: "Row Level Security in PostgreSQL - Complete Guide", url: "https://www.youtube.com/watch?v=Ow_lr0SZVwA", channel: "Supabase", reason: "Official walkthrough of enabling and testing RLS policies", duration: "14 min", difficulty: "Beginner" },
      { title: "Postgres Row Level Security is a MUST", url: "https://www.youtube.com/watch?v=sp2rPQ2bGKU", channel: "Hussein Nasser", reason: "Deep dive into why RLS matters and how it works under the hood", duration: "22 min", difficulty: "Intermediate" },
      { title: "Supabase Auth & RLS - Full Stack Tutorial", url: "https://www.youtube.com/watch?v=0N6M5BBe9AE", channel: "The Net Ninja", reason: "Practical tutorial connecting auth with RLS policies in a real app", duration: "18 min", difficulty: "Intermediate" },
    ],
    docs: [
      { title: "PostgreSQL Row Security Policies", url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html", source: "PostgreSQL Docs", summary: "Official documentation on creating and managing row-level security policies.", reason: "Canonical reference for RLS syntax and behaviour" },
      { title: "Supabase Row Level Security Guide", url: "https://supabase.com/docs/guides/database/postgres/row-level-security", source: "Supabase", summary: "Step-by-step guide to implementing RLS with Supabase Auth integration.", reason: "Platform-specific guidance matching your current setup" },
      { title: "RLS Performance Considerations", url: "https://supabase.com/docs/guides/database/postgres/row-level-security#performance", source: "Supabase", summary: "How RLS policies affect query performance and how to optimize them.", reason: "Ensures your policies do not degrade query speed" },
    ],
    practiceTask: {
      title: "Enable RLS and write your first policy",
      instruction: "In your query editor, enable RLS on the users table with ALTER TABLE users ENABLE ROW LEVEL SECURITY; then create a SELECT policy that restricts users to viewing only their own row.",
      secondaryTasks: ["Try querying the users table without a policy to see that zero rows are returned", "Add a separate INSERT policy for new user registration", "Test your policies by switching between user contexts"],
    },
    roadmapTags: ["Security Hardening", "Data Isolation", "Production Readiness", "Compliance", "Multi-tenant Architecture"],
    skillAreas: [
      { name: "Database Security", relevance: "Primary" },
      { name: "PostgreSQL Administration", relevance: "Primary" },
      { name: "Access Control Design", relevance: "Supporting" },
      { name: "Compliance Awareness", relevance: "Supporting" },
    ],
    estimatedMinutes: 10,
    relevanceLabel: "Directly relevant to your current task",
    confidenceLabel: "High",
    returnToTask: "Return to the schema panel and verify RLS is now enabled on the users table.",
    fallbackUsed: true,
  },
  "Learn SQL JOINs": {
    title: "Master SQL JOINs for complex queries",
    contextSummary: "You just ran a query using LEFT JOIN to count orders per user. This is a strong foundation. Expanding your JOIN knowledge will let you write more powerful reporting and analytics queries.",
    whyNow: "Your current query only uses LEFT JOIN. Many real-world reporting tasks require INNER JOIN, RIGHT JOIN, self-joins, and aggregations. Building this skill now will make you significantly faster at data analysis.",
    quickExplanation: "SQL JOINs combine rows from two or more tables based on related columns. Understanding when to use each type prevents missing data, duplicates, and incorrect counts.",
    steps: [
      { title: "Review JOIN types visually", description: "Understand INNER JOIN (matching rows only), LEFT JOIN (all left + matching right), RIGHT JOIN (all right + matching left), and FULL OUTER JOIN (all rows from both).", type: "explain" },
      { title: "Rewrite your query with INNER JOIN", description: "Change your LEFT JOIN query to INNER JOIN and compare results. Notice which users disappear (those with zero orders).", type: "do" },
      { title: "Add GROUP BY with aggregates", description: "Extend your query to use GROUP BY with COUNT, SUM, and AVG to get richer order statistics per user.", type: "practice" },
      { title: "Try a self-join", description: "Write a query that joins the orders table to itself to find users who placed orders on the same day.", type: "practice" },
    ],
    videos: [
      { title: "SQL Joins Tutorial for Beginners", url: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw", channel: "Programming with Mosh", reason: "Clear visual explanation of all JOIN types with practical examples", duration: "12 min", difficulty: "Beginner" },
      { title: "SQL Joins Explained | INNER, LEFT, RIGHT, FULL", url: "https://www.youtube.com/watch?v=2HVMiPPuPIM", channel: "Socratica", reason: "Concise comparison of JOIN types with Venn diagrams", duration: "8 min", difficulty: "Beginner" },
      { title: "Advanced SQL Tutorial - JOINs and Subqueries", url: "https://www.youtube.com/watch?v=2Fn0WAyZV0E", channel: "freeCodeCamp", reason: "Takes JOINs further into subqueries and complex multi-table analysis", duration: "25 min", difficulty: "Intermediate" },
    ],
    docs: [
      { title: "PostgreSQL JOIN Syntax", url: "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-JOIN", source: "PostgreSQL Docs", summary: "Official reference for all JOIN types and syntax.", reason: "Canonical reference for the database you are using" },
      { title: "SQL Joins - W3Schools", url: "https://www.w3schools.com/sql/sql_join.asp", source: "W3Schools", summary: "Interactive examples of INNER, LEFT, RIGHT, and FULL OUTER JOIN.", reason: "Quick interactive reference with try-it-yourself examples" },
      { title: "Visual Explanation of SQL Joins", url: "https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/", source: "Coding Horror", summary: "Famous visual guide to understanding SQL joins using Venn diagrams.", reason: "Best visual mental model for remembering JOIN behaviour" },
    ],
    practiceTask: {
      title: "Compare LEFT JOIN vs INNER JOIN results",
      instruction: "Run your current LEFT JOIN query, then rewrite it as an INNER JOIN. Compare the row counts and identify which users are missing. These are users with zero orders.",
      secondaryTasks: ["Add a HAVING clause to filter for users with more than 3 orders", "Write a query using FULL OUTER JOIN between users and a payments table", "Create a summary report using GROUP BY with multiple aggregate functions"],
    },
    roadmapTags: ["Data Literacy", "SQL Proficiency", "Reporting Skills", "Analytics Foundations"],
    skillAreas: [
      { name: "SQL Query Writing", relevance: "Primary" },
      { name: "Data Analysis", relevance: "Primary" },
      { name: "Database Design Understanding", relevance: "Supporting" },
      { name: "Reporting & BI", relevance: "Supporting" },
    ],
    estimatedMinutes: 10,
    relevanceLabel: "Directly relevant to your current query",
    confidenceLabel: "High",
    returnToTask: "Return to the query editor and try modifying your LEFT JOIN query with the techniques above.",
    fallbackUsed: true,
  },
  "Add an index": {
    title: "Optimize query performance with indexes",
    contextSummary: "Your current query joins users and orders on user_id. Without an index on orders.user_id, PostgreSQL performs a sequential scan on every query, which gets slower as data grows.",
    whyNow: "Adding an index on orders.user_id can reduce your JOIN query time by 10-100x depending on table size. This is one of the highest-impact performance improvements you can make right now.",
    quickExplanation: "An index is a data structure that lets PostgreSQL find matching rows without scanning the entire table. Creating one on foreign key columns used in JOINs and WHERE clauses dramatically speeds up queries.",
    steps: [
      { title: "Check current query plan", description: "Run EXPLAIN ANALYZE on your current query to see if PostgreSQL is doing a Seq Scan on the orders table.", type: "check" },
      { title: "Create the index", description: "Run CREATE INDEX idx_orders_user_id ON orders(user_id); to add a B-tree index on the foreign key column.", type: "do" },
      { title: "Re-run EXPLAIN ANALYZE", description: "Run EXPLAIN ANALYZE again. You should see an Index Scan instead of Seq Scan, with significantly lower execution time.", type: "check" },
      { title: "Understand index trade-offs", description: "Indexes speed up reads but slow down writes slightly. Learn about when NOT to add indexes and how to monitor index usage.", type: "explain" },
    ],
    videos: [
      { title: "Database Indexing Explained", url: "https://www.youtube.com/watch?v=HubezKbFL7E", channel: "Hussein Nasser", reason: "Deep dive into how B-tree indexes work and when to use them", duration: "18 min", difficulty: "Intermediate" },
      { title: "PostgreSQL Performance Tuning", url: "https://www.youtube.com/watch?v=lJnV7SNy7cE", channel: "Crunchy Data", reason: "Practical PostgreSQL indexing strategies for real-world workloads", duration: "24 min", difficulty: "Intermediate" },
      { title: "Indexing in SQL Explained in 10 Minutes", url: "https://www.youtube.com/watch?v=-qNSXPIi4D4", channel: "Web Dev Simplified", reason: "Quick, clear explanation of index types and when to use each one", duration: "10 min", difficulty: "Beginner" },
    ],
    docs: [
      { title: "PostgreSQL Indexes", url: "https://www.postgresql.org/docs/current/indexes.html", source: "PostgreSQL Docs", summary: "Complete guide to PostgreSQL index types, creation, and maintenance.", reason: "Canonical reference for index syntax and options" },
      { title: "PostgreSQL EXPLAIN Documentation", url: "https://www.postgresql.org/docs/current/sql-explain.html", source: "PostgreSQL Docs", summary: "How to read and interpret query execution plans.", reason: "Essential for verifying your index is actually being used" },
      { title: "Index Types in PostgreSQL", url: "https://www.postgresql.org/docs/current/indexes-types.html", source: "PostgreSQL Docs", summary: "Overview of B-tree, Hash, GiST, and GIN index types.", reason: "Helps you choose the right index type for different column types" },
    ],
    practiceTask: {
      title: "Add an index and measure the improvement",
      instruction: "Run EXPLAIN ANALYZE on your current JOIN query, note the execution time. Then create an index with CREATE INDEX idx_orders_user_id ON orders(user_id); and run EXPLAIN ANALYZE again.",
      secondaryTasks: ["Check for other foreign key columns that might benefit from indexes", "Try a composite index on (user_id, created_at) for time-range queries", "Use pg_stat_user_indexes to check index usage statistics"],
    },
    roadmapTags: ["Performance Optimization", "Database Tuning", "Production Readiness", "Query Efficiency", "Scalability"],
    skillAreas: [
      { name: "Query Performance Tuning", relevance: "Primary" },
      { name: "Database Administration", relevance: "Primary" },
      { name: "PostgreSQL Internals", relevance: "Supporting" },
      { name: "Capacity Planning", relevance: "Supporting" },
    ],
    estimatedMinutes: 10,
    relevanceLabel: "Directly relevant to your current query",
    confidenceLabel: "High",
    returnToTask: "Return to the query editor and run EXPLAIN ANALYZE to verify your new index is being used.",
    fallbackUsed: true,
  },
  "Database design patterns": {
    title: "Multi-tenant database architecture patterns",
    contextSummary: "Your customer-portal schema suggests a multi-tenant application. Choosing the right isolation strategy now prevents costly migrations later and ensures data security between tenants.",
    whyNow: "Multi-tenant architecture decisions are hard to change after launch. Understanding shared schemas vs. separate schemas vs. separate databases now saves significant refactoring effort.",
    quickExplanation: "Multi-tenant databases serve multiple customers from the same application. The key decision is how to isolate tenant data: shared tables with a tenant_id column, separate schemas, or separate databases.",
    steps: [
      { title: "Audit your current schema", description: "Check which tables have a tenant_id or org_id column. Tables without tenant identification are a data isolation risk.", type: "check" },
      { title: "Understand isolation strategies", description: "Learn the three approaches: shared database with tenant_id (cheapest), schema-per-tenant (balanced), and database-per-tenant (most isolated).", type: "explain" },
      { title: "Implement tenant_id with RLS", description: "For shared-table architecture, add RLS policies that filter by tenant_id for strong isolation without separate schemas.", type: "do" },
      { title: "Add connection pooling", description: "Multi-tenant apps need connection pooling (PgBouncer or built-in pooler) to avoid exhausting database connections.", type: "do" },
    ],
    videos: [
      { title: "Multi-tenancy in PostgreSQL", url: "https://www.youtube.com/watch?v=x1fCJ7sUXCM", channel: "Hussein Nasser", reason: "Practical comparison of multi-tenant strategies with PostgreSQL", duration: "20 min", difficulty: "Intermediate" },
      { title: "SaaS Multi-Tenant Database Design", url: "https://www.youtube.com/watch?v=joz0DoSQDNw", channel: "Fireship", reason: "Quick overview of tenant isolation patterns with real-world trade-offs", duration: "8 min", difficulty: "Beginner" },
      { title: "Scaling Multi-Tenant Databases", url: "https://www.youtube.com/results?search_query=scaling+multi+tenant+postgres+database", channel: "Various", reason: "Talks on scaling challenges specific to multi-tenant systems", duration: "15-30 min", difficulty: "Advanced" },
    ],
    docs: [
      { title: "Multi-tenant Data Architecture", url: "https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/multi-tenant-data-architecture.html", source: "AWS Well-Architected", summary: "AWS best practices for designing multi-tenant data layers.", reason: "Industry-standard guidance on tenant isolation patterns" },
      { title: "PostgreSQL Schema-based Multitenancy", url: "https://www.postgresql.org/docs/current/ddl-schemas.html", source: "PostgreSQL Docs", summary: "How to use PostgreSQL schemas for logical tenant separation.", reason: "Foundation for schema-per-tenant isolation strategy" },
      { title: "Supabase Multi-tenancy Guide", url: "https://supabase.com/docs/guides/resources/multi-tenancy", source: "Supabase", summary: "Implementing multi-tenant patterns with Supabase RLS and auth.", reason: "Directly applicable to your current platform setup" },
    ],
    practiceTask: {
      title: "Add tenant_id to your tables and create RLS policies",
      instruction: "Add a tenant_id column to your users and orders tables. Then create RLS policies that filter all queries by the current tenant's ID.",
      secondaryTasks: ["Create a tenants table to store tenant metadata", "Set up a search_path-based schema isolation prototype", "Benchmark query performance with 100k rows across 10 tenants"],
    },
    roadmapTags: ["Architecture Design", "Multi-tenancy", "Data Isolation", "Scalability", "SaaS Foundations", "Security"],
    skillAreas: [
      { name: "Database Architecture", relevance: "Primary" },
      { name: "Multi-tenant Design", relevance: "Primary" },
      { name: "Security Architecture", relevance: "Supporting" },
      { name: "Capacity Planning", relevance: "Supporting" },
    ],
    estimatedMinutes: 10,
    relevanceLabel: "Directly relevant to your schema design",
    confidenceLabel: "High",
    returnToTask: "Return to the schema panel and check which tables need a tenant_id column.",
    fallbackUsed: true,
  },
  "Backup and disaster recovery": {
    title: "Database backup and disaster recovery essentials",
    contextSummary: "You are working with a production database. Having a tested backup and recovery strategy is essential before making schema changes or deploying new features.",
    whyNow: "Database changes like adding indexes, enabling RLS, or modifying schemas carry risk. Knowing you can restore to a known good state gives you confidence to make changes safely.",
    quickExplanation: "A solid backup strategy combines automated snapshots, point-in-time recovery (PITR), and tested restore procedures. The key is not just having backups, but knowing they work.",
    steps: [
      { title: "Check your current backup status", description: "Verify that automated backups are enabled. Check the retention period and last successful backup time.", type: "check" },
      { title: "Understand PITR", description: "Point-in-Time Recovery lets you restore to any moment within your retention window using WAL archiving. More granular than daily snapshots.", type: "explain" },
      { title: "Test a restore procedure", description: "Create a test branch or clone of your database from a backup. Verify the data is complete and your application connects correctly.", type: "do" },
      { title: "Document your recovery plan", description: "Write down the exact steps to restore: who to contact, which tools to use, expected RTO and RPO.", type: "practice" },
    ],
    videos: [
      { title: "PostgreSQL Backup and Recovery", url: "https://www.youtube.com/watch?v=kbCytSYPh0E", channel: "Crunchy Data", reason: "Comprehensive guide to pg_dump, pg_basebackup, and PITR", duration: "22 min", difficulty: "Intermediate" },
      { title: "Database Disaster Recovery Planning", url: "https://www.youtube.com/results?search_query=database+disaster+recovery+planning+postgresql", channel: "Various", reason: "Talks on building reliable database recovery procedures", duration: "15-25 min", difficulty: "Intermediate" },
      { title: "Supabase Database Backups Explained", url: "https://www.youtube.com/results?search_query=supabase+database+backups+point+in+time+recovery", channel: "Supabase", reason: "Platform-specific backup and restore workflows", duration: "10 min", difficulty: "Beginner" },
    ],
    docs: [
      { title: "PostgreSQL Backup and Restore", url: "https://www.postgresql.org/docs/current/backup.html", source: "PostgreSQL Docs", summary: "Official guide covering SQL dump, file system level, and continuous archiving backup methods.", reason: "Canonical reference for all PostgreSQL backup strategies" },
      { title: "Supabase Database Backups", url: "https://supabase.com/docs/guides/platform/backups", source: "Supabase", summary: "How to manage automated backups and perform restores.", reason: "Specific to your current database platform" },
      { title: "RTO vs RPO Explained", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html", source: "AWS Well-Architected", summary: "Understanding Recovery Time and Recovery Point Objectives.", reason: "Framework for defining your backup requirements" },
    ],
    practiceTask: {
      title: "Verify your backup configuration",
      instruction: "Navigate to your database settings and confirm automated backups are enabled. Check the retention period and note the timestamp of the last successful backup.",
      secondaryTasks: ["Take a manual backup using pg_dump before your next schema change", "Practice restoring a backup to a test environment", "Write a one-page disaster recovery runbook"],
    },
    roadmapTags: ["Production Readiness", "Operational Excellence", "Data Durability", "Risk Management", "Compliance"],
    skillAreas: [
      { name: "Database Operations", relevance: "Primary" },
      { name: "Disaster Recovery", relevance: "Primary" },
      { name: "Risk Management", relevance: "Supporting" },
      { name: "Operational Awareness", relevance: "Supporting" },
    ],
    estimatedMinutes: 10,
    relevanceLabel: "Important for your production database",
    confidenceLabel: "High",
    returnToTask: "Return to your database dashboard and verify backup status before continuing schema changes.",
    fallbackUsed: true,
  },
}

function getClientFallback(suggestionTitle: string): CoachingPlan | null {
  for (const [prefix, plan] of Object.entries(CLIENT_FALLBACKS)) {
    if (suggestionTitle.includes(prefix)) return plan
  }
  return null
}

// ── Size modes ──────────────────────────────────────────────────────────────
type PanelSize = "compact" | "expanded" | "full"

const SIZE_CONFIG: Record<PanelSize, { width: number; height: string; detailWidth: number }> = {
  compact:  { width: 380, height: "540px", detailWidth: 440 },
  expanded: { width: 520, height: "75vh",  detailWidth: 560 },
  full:     { width: 580, height: "calc(100vh - 48px)", detailWidth: 620 },
}

// ── Suggestion data ─────────────────────────────────────────────────────────
interface Suggestion {
  id: string
  category: "skill" | "architecture" | "quality" | "deployment" | "resource"
  title: string
  description: string
  relevance: string
  icon: typeof Sparkles
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: "s1",
    category: "deployment",
    title: "Enable Row Level Security (RLS) for your users table",
    description:
      "Your users table has RLS disabled. Enabling it ensures data isolation between tenants and prevents unauthorized access to sensitive user data.",
    relevance: "Based on: RLS status warning in schema panel",
    icon: Shield,
  },
  {
    id: "s2",
    category: "skill",
    title: "Learn SQL JOINs — your query uses LEFT JOIN effectively",
    description:
      "Great use of LEFT JOIN to count orders per user! Want to learn about other JOIN types and when to use them for more complex reporting queries?",
    relevance: "Based on: current query in editor",
    icon: BookOpen,
  },
  {
    id: "s3",
    category: "quality",
    title: "Add an index on orders.user_id for better performance",
    description:
      "Your query joins users and orders on user_id. Adding an index on this foreign key column will significantly speed up this and similar queries.",
    relevance: "Based on: query execution plan analysis",
    icon: TestTube,
  },
  {
    id: "s4",
    category: "architecture",
    title: "Database design patterns for multi-tenant SaaS",
    description:
      "Your customer-portal schema suggests a multi-tenant app. Learn about tenant isolation strategies, shared vs. separate schemas, and connection pooling.",
    relevance: "Based on: database schema structure",
    icon: Wrench,
  },
  {
    id: "s5",
    category: "resource",
    title: "Suggested: Backup and disaster recovery best practices",
    description:
      "Learn how to configure automated backups, point-in-time recovery, and test your restore procedures to ensure data durability.",
    relevance: "Based on: production database context",
    icon: Lightbulb,
  },
]

const categoryStyles: Record<Suggestion["category"], { label: string; color: string }> = {
  skill:        { label: "Upskilling",    color: "text-accent" },
  architecture: { label: "Architecture",  color: "text-chart-4" },
  quality:      { label: "Quality",       color: "text-chart-3" },
  deployment:   { label: "Deployment",    color: "text-chart-1" },
  resource:     { label: "Resource",      color: "text-chart-2" },
}

// ── User profile data ───────────────────────────────────────────────────────
interface UserSkill {
  name: string
  level: number
  maxLevel: number
  category: string
  icon: typeof Database
}

interface RecentTopic {
  id: string
  title: string
  timestamp: Date
  category: string
  icon: typeof BookOpen
  summary: string
  keyPoints: string[]
}

interface BadgeInfo {
  id: string
  name: string
  icon: typeof Zap
  color: string
  description: string
  earnedDate: string
  criteria: string
}

const USER_SKILLS: UserSkill[] = [
  { name: "SQL Queries", level: 3, maxLevel: 5, category: "Database", icon: Database },
  { name: "API Integration", level: 2, maxLevel: 5, category: "Backend", icon: Code },
  { name: "Deployment", level: 4, maxLevel: 5, category: "DevOps", icon: GitBranch },
  { name: "Security", level: 2, maxLevel: 5, category: "Security", icon: Shield },
  { name: "Architecture", level: 1, maxLevel: 5, category: "Design", icon: Wrench },
]

const RECENT_TOPICS: RecentTopic[] = [
  {
    id: "rt1", title: "Row Level Security (RLS)", timestamp: new Date(Date.now() - 30 * 60 * 1000), category: "Security", icon: Shield,
    summary: "Row Level Security (RLS) lets you control which rows in a database table a user can access. It acts as a fine-grained access filter applied directly at the database level, ensuring data isolation without relying solely on application logic.",
    keyPoints: ["RLS policies are defined per-table using CREATE POLICY", "Policies can reference the current user via auth.uid()", "Always enable RLS on tables containing user data", "Test policies thoroughly with different user roles"],
  },
  {
    id: "rt2", title: "SQL LEFT JOIN Patterns", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), category: "Database", icon: Database,
    summary: "A LEFT JOIN returns all rows from the left table and matching rows from the right table. When there is no match, NULL values are returned for the right table columns. This is essential for queries where you need all records from one table regardless of matches.",
    keyPoints: ["LEFT JOIN preserves all rows from the left table", "Use COALESCE to handle NULL values from unmatched rows", "Combine with WHERE clauses carefully to avoid filtering out NULLs", "Consider performance with large tables and add appropriate indexes"],
  },
  {
    id: "rt3", title: "Production Deployment", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), category: "DevOps", icon: GitBranch,
    summary: "Deploying to production involves building your application, running migrations, setting environment variables, and configuring your hosting platform. Following a checklist approach reduces errors and downtime during releases.",
    keyPoints: ["Always run database migrations before deploying new code", "Use environment variables for secrets, never hardcode them", "Set up health checks and monitoring for production services", "Implement rollback strategies for failed deployments"],
  },
  {
    id: "rt4", title: "Environment Variables", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), category: "Configuration", icon: Settings,
    summary: "Environment variables store configuration values outside your codebase. They allow you to change application behaviour across environments (development, staging, production) without modifying code, and keep sensitive data like API keys secure.",
    keyPoints: ["Never commit .env files to version control", "Use .env.local for local development overrides", "Prefix client-side variables with NEXT_PUBLIC_ in Next.js", "Validate required variables at application startup"],
  },
]

const USER_STATS = {
  name: "Alex Chen",
  email: "alex.chen@company.com",
  role: "Full Stack Developer",
  creditsEarned: 145,
  currentStreak: 3,
  completedSessions: 12,
  totalLearningMinutes: 47,
  badges: [
    { id: "b1", name: "Quick Learner", icon: Zap, color: "text-chart-4", description: "Awarded for completing your first 5 learning sessions in under a week. You dove right in and showed exceptional initiative.", earnedDate: "Mar 12, 2026", criteria: "Complete 5 sessions within 7 days" },
    { id: "b2", name: "Database Pro", icon: Database, color: "text-chart-2", description: "Earned by reaching Level 3 in the SQL Queries skill tree. You have demonstrated a solid understanding of database fundamentals.", earnedDate: "Mar 18, 2026", criteria: "Reach Level 3 in any Database skill" },
    { id: "b3", name: "Streak Master", icon: Flame, color: "text-warning", description: "Achieved by maintaining a learning streak of 3 or more consecutive days. Consistency is the key to mastery.", earnedDate: "Mar 20, 2026", criteria: "Maintain a 3+ day learning streak" },
  ] as BadgeInfo[],
}

// ── Suggestion Card ─────────────────────────────────────────────────────────
function SuggestionCard({
  suggestion,
  onAskCoach,
}: {
  suggestion: Suggestion
  onAskCoach: (suggestion: Suggestion) => void
}) {
  const [saved, setSaved] = useState(false)
  const style = categoryStyles[suggestion.category]
  const Icon = suggestion.icon

  return (
    <div className="group rounded-lg border border-border bg-card/60 p-3 hover:bg-card transition-colors">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 w-6 h-6 rounded flex items-center justify-center bg-secondary shrink-0">
          <Icon className={`w-3.5 h-3.5 ${style.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium uppercase tracking-wider ${style.color}`}>
              {style.label}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">{suggestion.title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{suggestion.description}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1.5 italic">{suggestion.relevance}</p>

          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onAskCoach(suggestion)}
              className="flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 px-1.5 py-0.5 rounded transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              Ask coach
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded transition-colors ${
                saved ? "text-chart-4" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className={`w-3 h-3 ${saved ? "fill-current" : ""}`} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Difficulty badge ────────────────────────────────────────────────────────
function DifficultyBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Beginner: "bg-success/15 text-success",
    Intermediate: "bg-chart-4/15 text-chart-4",
    Advanced: "bg-destructive/15 text-destructive",
  }
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${styles[level] || "bg-secondary text-muted-foreground"}`}>
      {level}
    </span>
  )
}

// ── Section header ──────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, color = "text-accent" }: { icon: typeof Sparkles; title: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <div className="w-5 h-5 rounded flex items-center justify-center bg-secondary">
        <Icon className={`w-3 h-3 ${color}`} />
      </div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
    </div>
  )
}

// ── Video Card ───────────────────────────────────────────��──────────────────
function VideoCard({ video, isExpanded }: { video: CoachingPlan["videos"][number]; isExpanded: boolean }) {
  return (
    <div className={`group/vid rounded-lg border border-border bg-card/60 hover:bg-card hover:border-chart-1/30 transition-all ${isExpanded ? "p-4" : "p-3"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-foreground leading-snug hover:text-chart-1 transition-colors cursor-pointer inline-flex items-start gap-1 group/link"
          >
            <span className="underline decoration-transparent group-hover/link:decoration-chart-1/50 transition-all">{video.title}</span>
            <ExternalLink className="w-2.5 h-2.5 mt-0.5 shrink-0 opacity-0 group-hover/link:opacity-60 transition-opacity" />
          </a>
          <p className="text-[10px] text-muted-foreground mt-0.5">{video.channel}</p>
        </div>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-8 h-8 rounded-md bg-chart-1/10 border border-chart-1/20 flex items-center justify-center text-chart-1 opacity-60 hover:opacity-100 hover:bg-chart-1/20 hover:scale-105 transition-all cursor-pointer"
          aria-label={`Play ${video.title}`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
        </a>
      </div>
      <p className={`text-muted-foreground/80 mt-1.5 leading-relaxed ${isExpanded ? "text-[11px]" : "text-[10px]"}`}>{video.reason}</p>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <Clock className="w-2.5 h-2.5" />
          {video.duration}
        </div>
        <DifficultyBadge level={video.difficulty} />
      </div>
    </div>
  )
}

// ── Doc Card ────────────────────────────────────────────────────────────────
function DocCard({ doc, isExpanded }: { doc: CoachingPlan["docs"][number]; isExpanded: boolean }) {
  return (
    <div className={`group/doc rounded-lg border border-border bg-card/60 hover:bg-card hover:border-chart-2/30 transition-all ${isExpanded ? "p-4" : "p-3"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-foreground leading-snug hover:text-chart-2 transition-colors cursor-pointer inline-flex items-start gap-1 group/link"
          >
            <span className="underline decoration-transparent group-hover/link:decoration-chart-2/50 transition-all">{doc.title}</span>
            <ExternalLink className="w-2.5 h-2.5 mt-0.5 shrink-0 opacity-0 group-hover/link:opacity-60 transition-opacity" />
          </a>
          <p className="text-[10px] text-chart-2 mt-0.5 font-medium">{doc.source}</p>
        </div>
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-8 h-8 rounded-md bg-chart-2/10 border border-chart-2/20 flex items-center justify-center text-chart-2 opacity-60 hover:opacity-100 hover:bg-chart-2/20 hover:scale-105 transition-all cursor-pointer"
          aria-label={`Read ${doc.title}`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <p className={`text-muted-foreground/80 mt-1.5 leading-relaxed ${isExpanded ? "text-[11px]" : "text-[10px]"}`}>{doc.summary}</p>
      <p className={`text-muted-foreground/60 mt-1 italic ${isExpanded ? "text-[10px]" : "text-[10px]"}`}>{doc.reason}</p>
    </div>
  )
}

// ── Skill Tree Item ─────────────────────────────────────────────────────────
function SkillTreeItem({ skill }: { skill: UserSkill }) {
  const Icon = skill.icon
  const percentage = (skill.level / skill.maxLevel) * 100

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-foreground">{skill.name}</span>
          <span className="text-[10px] text-muted-foreground">Lvl {skill.level}/{skill.maxLevel}</span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Recent Topic Item ───────────────────────────────────────────────────────
function RecentTopicItem({ topic, onClick }: { topic: RecentTopic; onClick: () => void }) {
  const Icon = topic.icon
  const timeAgo = getTimeAgo(topic.timestamp)

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer group text-left"
    >
      <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary shrink-0">
        <Icon className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground truncate">{topic.title}</p>
        <p className="text-[10px] text-muted-foreground">{timeAgo}</p>
      </div>
      <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

// ── Topic Detail View ───────────────────────────────────────────────────────
function TopicDetailView({ topic, onBack }: { topic: RecentTopic; onBack: () => void }) {
  const Icon = topic.icon

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border bg-popover/80 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Profile
        </button>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{topic.category}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Topic header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-snug">{topic.title}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Reviewed {getTimeAgo(topic.timestamp)}</p>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Summary</h4>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed">{topic.summary}</p>
        </div>

        {/* Key Takeaways */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-chart-4" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Takeaways</h4>
          </div>
          <div className="flex flex-col gap-2">
            {topic.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/40">
                <div className="w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-accent">{i + 1}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Badge Modal ─────────────────────────────────────────────────────────────
function BadgeModal({ badge, onClose }: { badge: BadgeInfo; onClose: () => void }) {
  const BadgeIcon = badge.icon

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-xs rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="text-xs font-semibold text-foreground">Badge Details</h4>
          <button
            onClick={onClose}
            className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-4 py-5 flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
            badge.color === "text-chart-4" ? "bg-chart-4/15" :
            badge.color === "text-chart-2" ? "bg-chart-2/15" :
            "bg-warning/15"
          }`}>
            <BadgeIcon className={`w-7 h-7 ${badge.color}`} />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">{badge.name}</h3>
          <p className="text-[10px] text-muted-foreground mb-3">Earned {badge.earnedDate}</p>
          <p className="text-xs text-foreground/80 leading-relaxed mb-4">{badge.description}</p>
          <div className="w-full p-2.5 rounded-lg bg-secondary/40 border border-border">
            <div className="flex items-center gap-1.5 justify-center">
              <Target className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-medium text-muted-foreground">Criteria:</span>
            </div>
            <p className="text-[11px] text-foreground mt-1">{badge.criteria}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Time ago helper ─────────────────────────────────────────────────────────
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

// ── User Profile View ───────────────────────────────────────────────────────
function UserProfileView({
  onBack,
  panelSize,
}: {
  onBack: () => void
  panelSize: PanelSize
}) {
  const isExpanded = panelSize !== "compact"
  const [selectedTopic, setSelectedTopic] = useState<RecentTopic | null>(null)
  const [selectedBadge, setSelectedBadge] = useState<BadgeInfo | null>(null)

  // Show topic detail view when a recent topic is clicked
  if (selectedTopic) {
    return <TopicDetailView topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Badge modal overlay */}
      {selectedBadge && (
        <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
      )}

      {/* Profile header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border bg-popover/80 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border border-border bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="w-3 h-3" />
          Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* User Info Section */}
        <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{USER_STATS.name}</h3>
              <p className="text-xs text-muted-foreground">{USER_STATS.role}</p>
              <p className="text-[10px] text-muted-foreground/70">{USER_STATS.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/40">
              <div className="w-8 h-8 rounded-lg bg-chart-4/15 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-chart-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{USER_STATS.creditsEarned}</p>
                <p className="text-[10px] text-muted-foreground">Credits</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/40">
              <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center">
                <Flame className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{USER_STATS.currentStreak}</p>
                <p className="text-[10px] text-muted-foreground">Day Streak</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/40">
              <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{USER_STATS.completedSessions}</p>
                <p className="text-[10px] text-muted-foreground">Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/40">
              <div className="w-8 h-8 rounded-lg bg-chart-2/15 flex items-center justify-center">
                <Clock className="w-4 h-4 text-chart-2" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{USER_STATS.totalLearningMinutes}</p>
                <p className="text-[10px] text-muted-foreground">Minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
          <SectionHeader icon={Award} title="Badges Earned" color="text-chart-4" />
          <div className="flex flex-wrap gap-2">
            {USER_STATS.badges.map((badge) => {
              const BadgeIcon = badge.icon
              return (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border hover:border-accent/30 hover:bg-secondary/60 transition-colors cursor-pointer"
                >
                  <BadgeIcon className={`w-3.5 h-3.5 ${badge.color}`} />
                  <span className="text-[11px] font-medium text-foreground">{badge.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Skill Tree Section */}
        <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
          <SectionHeader icon={TrendingUp} title="Skill Tree" color="text-accent" />
          <div className="flex flex-col gap-2">
            {USER_SKILLS.map((skill) => (
              <SkillTreeItem key={skill.name} skill={skill} />
            ))}
          </div>
        </div>

        {/* Recent Topics Section */}
        <div className={`px-4 ${isExpanded ? "py-5" : "py-4"}`}>
          <SectionHeader icon={History} title="Recent Topics" color="text-chart-2" />
          <div className="flex flex-col gap-1">
            {RECENT_TOPICS.map((topic) => (
              <RecentTopicItem key={topic.id} topic={topic} onClick={() => setSelectedTopic(topic)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── AI Coach Detail View ────────────────────────────────────────────────────
function CoachDetail({
  suggestion,
  plan,
  loading,
  error,
  onBack,
  onRetry,
  panelSize,
}: {
  suggestion: Suggestion
  plan: CoachingPlan | null
  loading: boolean
  error: string | null
  onBack: () => void
  onRetry: () => void
  panelSize: PanelSize
}) {
  const [saved, setSaved] = useState(false)
  const [helpful, setHelpful] = useState(false)
  const isExpanded = panelSize !== "compact"
  const useGrid = panelSize === "full" || panelSize === "expanded"

  return (
    <div className="flex flex-col h-full">
      {/* Detail header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border bg-popover/80 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setHelpful(!helpful)}
            className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border transition-colors ${
              helpful
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <ThumbsUp className={`w-3 h-3 ${helpful ? "fill-current" : ""}`} />
            Useful
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border transition-colors ${
              saved
                ? "border-chart-4/30 bg-chart-4/10 text-chart-4"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className={`w-3 h-3 ${saved ? "fill-current" : ""}`} />
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground font-medium">Analyzing your context</p>
              <p className="text-xs text-muted-foreground mt-1">Generating personalized coaching response...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-xs text-destructive">{error}</p>
            <Button onClick={onRetry} variant="outline" size="sm" className="text-xs">
              Retry
            </Button>
          </div>
        )}

        {plan && !loading && (
          <div className="flex flex-col gap-0">

            {/* 1. Context Summary */}
            <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
              <p className={`font-medium text-foreground leading-snug mb-2 ${isExpanded ? "text-base" : "text-sm"}`}>{plan.title}</p>
              <div className="rounded-lg bg-accent/8 border border-accent/15 px-3 py-2.5">
                <p className={`text-foreground/80 leading-relaxed ${isExpanded ? "text-sm" : "text-xs"}`}>{plan.contextSummary}</p>
              </div>
            </div>

            {/* 2. Why This Matters Now */}
            <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
              <SectionHeader icon={Zap} title="Why this matters now" color="text-chart-4" />
              <p className={`text-foreground/80 leading-relaxed ${isExpanded ? "text-sm" : "text-xs"}`}>{plan.whyNow}</p>
            </div>

            {/* 3. Recommended Learning Path */}
            <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
              <SectionHeader icon={ArrowRight} title="Learning path" color="text-accent" />
              <p className={`text-muted-foreground mb-3 leading-relaxed ${isExpanded ? "text-xs" : "text-[11px]"}`}>{plan.quickExplanation}</p>
              <div className="flex flex-col gap-1.5">
                {plan.steps.map((step, i) => {
                  const stepTypeColors: Record<string, string> = {
                    explain: "bg-chart-2/15 text-chart-2",
                    do: "bg-accent/15 text-accent",
                    check: "bg-chart-4/15 text-chart-4",
                    practice: "bg-chart-3/15 text-chart-3",
                  }
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-2.5 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors ${isExpanded ? "p-3" : "p-2.5"}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-xs font-medium text-foreground">{step.title}</p>
                          <span className={`px-1 py-0 rounded text-[8px] font-medium uppercase ${stepTypeColors[step.type] || "bg-secondary text-muted-foreground"}`}>
                            {step.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 4. Videos to Watch */}
            <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
              <SectionHeader icon={Play} title="Videos to watch" color="text-chart-1" />
              <div className={useGrid ? "grid grid-cols-2 gap-2.5" : "flex flex-col gap-2"}>
                {plan.videos.map((video, i) => (
                  <VideoCard key={i} video={video} isExpanded={isExpanded} />
                ))}
              </div>
            </div>

            {/* 5. Docs to Read */}
            <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
              <SectionHeader icon={FileText} title="Docs to read" color="text-chart-2" />
              <div className={useGrid ? "grid grid-cols-2 gap-2.5" : "flex flex-col gap-2"}>
                {plan.docs.map((doc, i) => (
                  <DocCard key={i} doc={doc} isExpanded={isExpanded} />
                ))}
              </div>
            </div>

            {/* 6. Try This Next */}
            <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
              <SectionHeader icon={Target} title="Try this next" color="text-chart-3" />
              <div className={`rounded-lg border border-chart-3/20 bg-chart-3/5 ${isExpanded ? "p-4" : "p-3"}`}>
                <p className="text-xs font-medium text-foreground">{plan.practiceTask.title}</p>
                <p className={`text-foreground/70 mt-1 leading-relaxed ${isExpanded ? "text-sm" : "text-[11px]"}`}>
                  {plan.practiceTask.instruction}
                </p>
                {plan.practiceTask.secondaryTasks && plan.practiceTask.secondaryTasks.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-chart-3/10">
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Also try</p>
                    <div className="flex flex-col gap-1">
                      {plan.practiceTask.secondaryTasks.map((task, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-chart-3/50 mt-1.5 shrink-0" />
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 7. Roadmap Alignment */}
            <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
              <SectionHeader icon={Map} title="Roadmap alignment" color="text-chart-5" />
              <div className="flex flex-wrap gap-1.5">
                {plan.roadmapTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-md bg-secondary border border-border text-[10px] font-medium text-foreground/80 hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 8. Skill Growth */}
            <div className={`px-4 border-b border-border ${isExpanded ? "py-5" : "py-4"}`}>
              <SectionHeader icon={TrendingUp} title="Skill growth" color="text-accent" />
              <div className={useGrid ? "grid grid-cols-2 gap-1.5" : "flex flex-col gap-1.5"}>
                {plan.skillAreas.map((skill, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-secondary/30 px-2.5 py-1.5">
                    <span className="text-[11px] font-medium text-foreground/80">{skill.name}</span>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider ${
                      skill.relevance === "Primary" ? "text-accent" : "text-muted-foreground"
                    }`}>
                      {skill.relevance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta footer */}
            <div className={`px-4 bg-secondary/20 shrink-0 ${isExpanded ? "py-4" : "py-3"}`}>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {plan.estimatedMinutes} min
                </span>
                <span>{plan.relevanceLabel}</span>
                <span>Confidence: {plan.confidenceLabel}</span>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-1.5">{plan.returnToTask}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main popup ──────────────────────────────────────────────────────────────
export function AssistantPopup() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [panelSize, setPanelSize] = useState<PanelSize>("compact")
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [plan, setPlan] = useState<CoachingPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)

  const isDetail = !!selectedSuggestion || showProfile
  const config = SIZE_CONFIG[panelSize]

  function cyclePanelSize() {
    const order: PanelSize[] = ["compact", "expanded", "full"]
    const current = order.indexOf(panelSize)
    const next = (current + 1) % order.length
    setPanelSize(order[next])
  }

  async function fetchPlan(suggestion: Suggestion) {
    setLoading(true)
    setError(null)
    setPlan(null)

    try {
      const res = await fetch("/api/coach/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: suggestion.title,
          taskType: suggestion.category,
          suggestionDescription: suggestion.description,
          sourceSignal: suggestion.relevance,
          currentPage: "Storage / Query Editor",
          triggerType: "contextual-suggestion",
          triggerReason: suggestion.relevance,
          retries: 0,
          recentActions: [
            "Ran SQL query with LEFT JOIN",
            "Viewed users table schema",
            "Checked RLS status",
            "Browsed orders table",
          ],
          userGoal: "Configure and optimize my database",
          confidenceLevel: "intermediate",
          learningPreference: "hands-on",
          availableMinutes: 10,
        }),
      })

      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      const data = await res.json()
      setPlan(data.plan)
    } catch {
      // API failed — use client-side suggestion-specific fallback
      const fallback = getClientFallback(suggestion.title)
      if (fallback) {
        setPlan(fallback)
      } else {
        setError("Failed to generate plan. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  function handleAskCoach(suggestion: Suggestion) {
    setSelectedSuggestion(suggestion)
    fetchPlan(suggestion)
  }

  // Closed state — pill button
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full bg-popover border border-border shadow-2xl shadow-black/40 hover:scale-105 transition-transform"
      >
        <img
          src="/flowstate-logo.jpg"
          alt=""
          className="w-6 h-6 rounded-md object-cover"
        />
        <span className="text-sm font-medium text-foreground">FlowState</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">OFF</span>
      </button>
    )
  }

  const panelWidth = isDetail ? config.detailWidth : config.width
  const panelHeight = minimized ? "52px" : config.height

  const sizeLabel: Record<PanelSize, string> = {
    compact: "Compact",
    expanded: "Expanded",
    full: "Full",
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-xl border border-border bg-popover shadow-2xl shadow-black/40 overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: minimized ? 320 : panelWidth,
        height: panelHeight,
        maxHeight: "calc(100vh - 48px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border shrink-0 bg-popover">
        <img
          src="/flowstate-logo.jpg"
          alt="FlowState"
          className="w-7 h-7 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">FlowState</h3>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-success/20 text-success">
              ON
            </span>
          </div>
          {!minimized && (
            <span className="text-[10px] text-muted-foreground">
              {showProfile ? "User Profile" : selectedSuggestion ? "Coaching response" : "Upskilling Coach — Live suggestions"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Size toggle */}
          {!minimized && (
            <button
              onClick={cyclePanelSize}
              className="flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title={`Size: ${sizeLabel[panelSize]} — click to cycle`}
            >
              <GripVertical className="w-3 h-3" />
              {sizeLabel[panelSize]}
            </button>
          )}
          {/* Profile button */}
          {!minimized && (
            <button
              onClick={() => {
                setShowProfile(!showProfile)
                setSelectedSuggestion(null)
                setPlan(null)
                setError(null)
              }}
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                showProfile
                  ? "bg-accent/20 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              title="User Profile"
            >
              <User className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setMinimized(!minimized)}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={minimized ? "Expand" : "Minimize"}
          >
            {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => { setOpen(false); setPanelSize("compact"); setShowProfile(false) }}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!minimized && (
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {showProfile ? (
            <UserProfileView
              onBack={() => setShowProfile(false)}
              panelSize={panelSize}
            />
          ) : selectedSuggestion ? (
            <CoachDetail
              suggestion={selectedSuggestion}
              plan={plan}
              loading={loading}
              error={error}
              onBack={() => {
                setSelectedSuggestion(null)
                setPlan(null)
                setError(null)
              }}
              onRetry={() => fetchPlan(selectedSuggestion)}
              panelSize={panelSize}
            />
          ) : (
            <>
              {/* Context bar */}
              <div className="px-4 py-2.5 bg-secondary/30 border-b border-border shrink-0">
                <p className="text-[11px] text-muted-foreground">
                  5 suggestions based on your database configuration session
                </p>
              </div>

              {/* Suggestions list */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <SuggestionCard key={s.id} suggestion={s} onAskCoach={handleAskCoach} />
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-border flex items-center justify-between bg-popover shrink-0">
                <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                  Dismiss all
                </button>
                <button className="text-[11px] text-accent hover:text-accent/80 transition-colors flex items-center gap-1">
                  View learning path
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
