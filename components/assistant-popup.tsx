"use client"

import { useState } from "react"
import {
  Sparkles,
  X,
  Minus,
  ChevronRight,
  BookOpen,
  Shield,
  Wrench,
  TestTube,
  Lightbulb,
  Bookmark,
  MessageSquare,
  Loader2,
  Clock,
  Zap,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CoachingPlan } from "@/lib/ai/schemas"

// --- Suggestion data ---
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
    title: "Add health checks to improve deployment reliability",
    description:
      "Your API route does not include a health endpoint. Adding one helps monitoring and prevents routing traffic to unhealthy instances.",
    relevance: "Based on: current deployment in route.ts",
    icon: Shield,
  },
  {
    id: "s2",
    category: "skill",
    title: "Next.js Server Actions — consider learning streaming patterns",
    description:
      "Your current route.ts uses a traditional POST handler. Streaming responses with Server Actions can improve perceived performance.",
    relevance: "Based on: file open (app/api/route.ts)",
    icon: BookOpen,
  },
  {
    id: "s3",
    category: "quality",
    title: "Strengthen error handling in your API route",
    description:
      "The current catch block returns a generic 500. Consider structured error responses with specific status codes and messages.",
    relevance: "Based on: recent commit (fix: update API route error handling)",
    icon: TestTube,
  },
  {
    id: "s4",
    category: "architecture",
    title: "Your task maps well to platform engineering skills",
    description:
      "Setting up reliable API routes, deployment pipelines, and monitoring is core platform engineering. Building these skills compounds.",
    relevance: "Based on: deployment activity pattern",
    icon: Wrench,
  },
  {
    id: "s5",
    category: "resource",
    title: "Suggested next: observability on Vercel",
    description:
      "Learn how to use structured logging, traces, and Vercel Monitoring to debug production issues faster.",
    relevance: "Based on: production deployment context",
    icon: Lightbulb,
  },
]

const categoryStyles: Record<
  Suggestion["category"],
  { label: string; dotColor: string; textColor: string; bgColor: string; borderColor: string }
> = {
  skill: {
    label: "Upskilling",
    dotColor: "bg-emerald-400",
    textColor: "text-emerald-400",
    bgColor: "bg-emerald-400/8",
    borderColor: "border-emerald-400/15",
  },
  architecture: {
    label: "Architecture",
    dotColor: "bg-amber-400",
    textColor: "text-amber-400",
    bgColor: "bg-amber-400/8",
    borderColor: "border-amber-400/15",
  },
  quality: {
    label: "Quality",
    dotColor: "bg-sky-400",
    textColor: "text-sky-400",
    bgColor: "bg-sky-400/8",
    borderColor: "border-sky-400/15",
  },
  deployment: {
    label: "Deployment",
    dotColor: "bg-teal-400",
    textColor: "text-teal-400",
    bgColor: "bg-teal-400/8",
    borderColor: "border-teal-400/15",
  },
  resource: {
    label: "Resource",
    dotColor: "bg-violet-400",
    textColor: "text-violet-400",
    bgColor: "bg-violet-400/8",
    borderColor: "border-violet-400/15",
  },
}

// --- Suggestion Card ---
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
    <div className={`group rounded-xl border ${style.borderColor} ${style.bgColor} p-4 hover:border-white/10 transition-all duration-200`}>
      {/* Category badge */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className={`w-7 h-7 rounded-lg ${style.bgColor} border ${style.borderColor} flex items-center justify-center`}>
          <Icon className={`w-3.5 h-3.5 ${style.textColor}`} />
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-widest ${style.textColor}`}>
          {style.label}
        </span>
      </div>

      {/* Title */}
      <p className="text-[13px] font-semibold text-white/90 leading-snug mb-1.5">
        {suggestion.title}
      </p>

      {/* Description */}
      <p className="text-xs text-white/50 leading-relaxed mb-2">
        {suggestion.description}
      </p>

      {/* Relevance */}
      <p className="text-[10px] text-white/30 italic mb-3">
        {suggestion.relevance}
      </p>

      {/* Actions - always visible for better usability */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAskCoach(suggestion)}
          className={`flex items-center gap-1.5 text-[11px] font-medium ${style.textColor} hover:brightness-125 px-2.5 py-1.5 rounded-lg ${style.bgColor} border ${style.borderColor} transition-all duration-150`}
        >
          <Zap className="w-3 h-3" />
          Ask coach
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-lg transition-all duration-150 ${
            saved
              ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
              : "text-white/40 hover:text-white/60 bg-white/5 border border-white/5 hover:border-white/10"
          }`}
        >
          <Bookmark className={`w-3 h-3 ${saved ? "fill-current" : ""}`} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  )
}

// --- AI Coach Detail View ---
function CoachDetail({
  suggestion,
  plan,
  loading,
  error,
  onBack,
  onRetry,
}: {
  suggestion: Suggestion
  plan: CoachingPlan | null
  loading: boolean
  error: string | null
  onBack: () => void
  onRetry: () => void
}) {
  const style = categoryStyles[suggestion.category]

  return (
    <div className="flex flex-col h-full">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 px-4 pt-3 pb-1 transition-colors"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to suggestions
      </button>

      {/* Topic header */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${style.textColor}`}>
            {style.label}
          </span>
        </div>
        <p className="text-sm font-semibold text-white/90 leading-snug">{suggestion.title}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <Loader2 className="w-4.5 h-4.5 text-emerald-400 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-white/70">Generating learning plan...</p>
              <p className="text-[10px] text-white/30 mt-1">Powered by Grok</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center">
              <X className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-white/70">Could not generate plan</p>
              <p className="text-[10px] text-white/40 mt-1">{error}</p>
            </div>
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="text-xs border-white/10 bg-white/5 hover:bg-white/10 text-white/70"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Plan display */}
        {plan && !loading && (
          <div className="flex flex-col gap-3">
            {/* Why now */}
            <div className="rounded-xl bg-emerald-400/8 border border-emerald-400/15 p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3 h-3 text-emerald-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                  Why now
                </p>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">{plan.whyNow}</p>
            </div>

            {/* Quick explanation */}
            <p className="text-xs text-white/50 leading-relaxed px-0.5">
              {plan.quickExplanation}
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-2">
              {plan.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white/85">{step.title}</p>
                    <p className="text-[11px] text-white/45 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Practice task */}
            <div className="rounded-xl border border-sky-400/15 bg-sky-400/8 p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <TestTube className="w-3 h-3 text-sky-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-400">
                  Practice
                </p>
              </div>
              <p className="text-xs font-semibold text-white/85">{plan.practiceTask.title}</p>
              <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                {plan.practiceTask.instruction}
              </p>
            </div>

            {/* Meta bar */}
            <div className="flex items-center gap-3 text-[10px] text-white/30 pt-1 px-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {plan.estimatedMinutes} min
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span>{plan.relevanceLabel}</span>
              <span className="w-px h-3 bg-white/10" />
              <span>{plan.confidenceLabel}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Main popup ---
export function AssistantPopup() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [plan, setPlan] = useState<CoachingPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          currentPage: "Deployments / Build Logs",
          triggerType: "contextual-suggestion",
          triggerReason: suggestion.relevance,
          retries: 0,
          recentActions: [
            "Viewed deployment build logs",
            "Edited app/api/route.ts",
            "Committed: fix API route error handling",
            "Deployed to production",
          ],
          userGoal: "Improve my deployment and API practices",
          confidenceLevel: "intermediate",
          learningPreference: "hands-on",
          availableMinutes: 5,
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

  // Closed state: teal accent circle with "?"
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 hover:scale-110 transition-all duration-200 cursor-pointer"
        aria-label="Open Upskilling Coach"
      >
        <span className="text-xl font-bold leading-none">?</span>
      </button>
    )
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border border-white/[0.08] bg-[#0e1117] shadow-2xl shadow-black/60 overflow-hidden transition-all duration-300"
      style={{
        width: minimized ? 320 : 400,
        height: minimized ? 56 : 580,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06] shrink-0 bg-[#0e1117]">
        <div className="w-8 h-8 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white/90 tracking-tight">Upskilling Coach</h3>
          {!minimized && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-white/40 font-medium">
                Live suggestions
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setMinimized(!minimized)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-150"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-150"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!minimized && (
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {selectedSuggestion ? (
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
            />
          ) : (
            <>
              {/* Context bar */}
              <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04]">
                <p className="text-[11px] text-white/35 font-medium">
                  5 suggestions based on your current session
                </p>
              </div>

              {/* Suggestions list */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
                {SUGGESTIONS.map((s) => (
                  <SuggestionCard
                    key={s.id}
                    suggestion={s}
                    onAskCoach={handleAskCoach}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between bg-[#0e1117] shrink-0">
                <button className="text-[11px] text-white/30 hover:text-white/50 transition-colors font-medium">
                  Dismiss all
                </button>
                <button className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium">
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
