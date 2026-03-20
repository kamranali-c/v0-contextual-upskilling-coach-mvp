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
}

const USER_SKILLS: UserSkill[] = [
  { name: "SQL Queries", level: 3, maxLevel: 5, category: "Database", icon: Database },
  { name: "API Integration", level: 2, maxLevel: 5, category: "Backend", icon: Code },
  { name: "Deployment", level: 4, maxLevel: 5, category: "DevOps", icon: GitBranch },
  { name: "Security", level: 2, maxLevel: 5, category: "Security", icon: Shield },
  { name: "Architecture", level: 1, maxLevel: 5, category: "Design", icon: Wrench },
]

const RECENT_TOPICS: RecentTopic[] = [
  { id: "rt1", title: "Row Level Security (RLS)", timestamp: new Date(Date.now() - 30 * 60 * 1000), category: "Security", icon: Shield },
  { id: "rt2", title: "SQL LEFT JOIN Patterns", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), category: "Database", icon: Database },
  { id: "rt3", title: "Production Deployment", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), category: "DevOps", icon: GitBranch },
  { id: "rt4", title: "Environment Variables", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), category: "Configuration", icon: Settings },
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
    { id: "b1", name: "Quick Learner", icon: Zap, color: "text-chart-4" },
    { id: "b2", name: "Database Pro", icon: Database, color: "text-chart-2" },
    { id: "b3", name: "Streak Master", icon: Flame, color: "text-warning" },
  ],
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
function RecentTopicItem({ topic }: { topic: RecentTopic }) {
  const Icon = topic.icon
  const timeAgo = getTimeAgo(topic.timestamp)

  return (
    <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer group">
      <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary shrink-0">
        <Icon className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground truncate">{topic.title}</p>
        <p className="text-[10px] text-muted-foreground">{timeAgo}</p>
      </div>
      <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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

  return (
    <div className="flex flex-col h-full">
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
                <div
                  key={badge.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border hover:border-accent/30 transition-colors"
                >
                  <BadgeIcon className={`w-3.5 h-3.5 ${badge.color}`} />
                  <span className="text-[11px] font-medium text-foreground">{badge.name}</span>
                </div>
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
              <RecentTopicItem key={topic.id} topic={topic} />
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan")
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
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">FlowState</span>
        <span className="text-xs opacity-80">OFF</span>
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
        <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
        </div>
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
