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
  { label: string; color: string }
> = {
  skill: { label: "Upskilling", color: "text-accent" },
  architecture: { label: "Architecture", color: "text-chart-4" },
  quality: { label: "Quality", color: "text-chart-3" },
  deployment: { label: "Deployment", color: "text-chart-1" },
  resource: { label: "Resource", color: "text-chart-2" },
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
    <div className="group rounded-lg border border-border bg-card/60 p-3 hover:bg-card transition-colors">
      <div className="flex items-start gap-2.5">
        <div
          className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center bg-secondary shrink-0`}
        >
          <Icon className={`w-3.5 h-3.5 ${style.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium uppercase tracking-wider ${style.color}`}>
              {style.label}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">
            {suggestion.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {suggestion.description}
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1.5 italic">
            {suggestion.relevance}
          </p>

          {/* Actions */}
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
                saved
                  ? "text-chart-4"
                  : "text-muted-foreground hover:text-foreground"
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
  return (
    <div className="flex flex-col h-full">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-4 pt-3 pb-1 transition-colors"
      >
        <ChevronRight className="w-3 h-3 rotate-180" />
        Back to suggestions
      </button>

      <div className="px-4 pb-2">
        <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
            <p className="text-xs text-muted-foreground">Generating learning plan...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <p className="text-xs text-destructive">{error}</p>
            <Button onClick={onRetry} variant="outline" size="sm" className="text-xs">
              Retry
            </Button>
          </div>
        )}

        {plan && !loading && (
          <div className="flex flex-col gap-3">
            {/* Why now */}
            <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-accent mb-1">
                Why now
              </p>
              <p className="text-xs text-foreground/80 leading-relaxed">{plan.whyNow}</p>
            </div>

            {/* Quick explanation */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {plan.quickExplanation}
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-2">
              {plan.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-secondary/40 p-2.5"
                >
                  <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[10px] font-medium text-foreground shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{step.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Practice task */}
            <div className="rounded-lg border border-border bg-card/60 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-chart-3 mb-1">
                Practice
              </p>
              <p className="text-xs font-medium text-foreground">{plan.practiceTask.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {plan.practiceTask.instruction}
              </p>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
              <span>{plan.estimatedMinutes} min</span>
              <span className="text-border">|</span>
              <span>{plan.relevanceLabel}</span>
              <span className="text-border">|</span>
              <span>Confidence: {plan.confidenceLabel}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Main popup ---
export function AssistantPopup() {
  const [open, setOpen] = useState(true)
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-xl border border-border bg-popover shadow-2xl shadow-black/40 overflow-hidden transition-all duration-300"
      style={{
        width: minimized ? 320 : 380,
        height: minimized ? 52 : 540,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border shrink-0 bg-popover">
        <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground">Upskilling Coach</h3>
          {!minimized && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-muted-foreground">
                Live suggestions
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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
              <div className="px-4 py-2.5 bg-secondary/30 border-b border-border">
                <p className="text-[11px] text-muted-foreground">
                  5 suggestions based on your current session
                </p>
              </div>

              {/* Suggestions list */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <SuggestionCard
                    key={s.id}
                    suggestion={s}
                    onAskCoach={handleAskCoach}
                  />
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
