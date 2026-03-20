"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  ArrowRight,
  Check,
  Clock,
  Target,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { mockCoachQuestions, type ContextualTrigger } from "@/lib/mock-data"
import type { CoachingPlan, CoachRequest } from "@/lib/ai/schemas"

interface AICoachDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: ContextualTrigger | null
  onComplete: () => void
  recentActions?: string[]
  retryCount?: number
}

type CoachState = "questions" | "generating" | "journey" | "error"

// Maps coach question answer values to readable labels for the API
const goalMap: Record<string, string> = {
  fix: "Fix an immediate issue",
  learn: "Learn how this works",
  setup: "Set up something new",
  optimize: "Optimize existing config",
}
const preferenceMap: Record<string, string> = {
  quick: "Quick fix",
  detailed: "Step-by-step walkthrough",
  deep: "Deeper understanding",
}
const timeMap: Record<string, number> = {
  "2min": 2,
  "5min": 5,
  "10min": 10,
}

export function AICoachDrawer({
  open,
  onOpenChange,
  trigger,
  onComplete,
  recentActions = [],
  retryCount = 0,
}: AICoachDrawerProps) {
  const router = useRouter()
  const [state, setState] = useState<CoachState>("questions")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [plan, setPlan] = useState<CoachingPlan | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const questions = mockCoachQuestions
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const buildPayload = useCallback(
    (finalAnswers: Record<string, string>): CoachRequest => ({
      taskTitle: trigger?.title ?? "Unknown task",
      taskType: trigger?.type ?? "general",
      currentPage: "/demo",
      triggerType: trigger?.type ?? "unknown",
      triggerReason: trigger?.description ?? "No additional context",
      retries: retryCount,
      recentActions:
        recentActions.length > 0
          ? recentActions.slice(0, 5)
          : ["Opened demo workspace"],
      userGoal: goalMap[finalAnswers["q-1"]] ?? "General learning",
      confidenceLevel: finalAnswers["q-2"] ?? "intermediate",
      learningPreference:
        preferenceMap[finalAnswers["q-3"]] ?? "Mixed",
      availableMinutes: timeMap[finalAnswers["q-4"]] ?? 5,
    }),
    [trigger, retryCount, recentActions]
  )

  const fetchPlan = useCallback(
    async (finalAnswers: Record<string, string>) => {
      setState("generating")
      setErrorMessage("")

      try {
        const payload = buildPayload(finalAnswers)
        const res = await fetch("/api/coach/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`)
        }

        const data = await res.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setPlan(data.plan)
        setState("journey")
      } catch (err) {
        console.error("[AICoachDrawer] Failed to fetch plan:", err)
        setErrorMessage(
          err instanceof Error ? err.message : "Something went wrong"
        )
        setState("error")
      }
    },
    [buildPayload]
  )

  const handleAnswer = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value }
    setAnswers(updated)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      fetchPlan(updated)
    }
  }

  const handleStartJourney = () => {
    if (!plan) return
    // Store plan in sessionStorage so the journey page can read it
    sessionStorage.setItem("coachingPlan", JSON.stringify(plan))
    onOpenChange(false)
    router.push("/journey")
    // Reset after transition
    setTimeout(resetState, 300)
  }

  const resetState = () => {
    setState("questions")
    setCurrentQuestion(0)
    setAnswers({})
    setPlan(null)
    setErrorMessage("")
  }

  const handleClose = () => {
    onOpenChange(false)
    onComplete()
    setTimeout(resetState, 300)
  }

  const stepTypeIcon = (type: string) => {
    switch (type) {
      case "explain":
        return "Learn"
      case "do":
        return "Action"
      case "check":
        return "Check"
      case "practice":
        return "Practice"
      default:
        return type
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <SheetTitle>AI Learning Coach</SheetTitle>
          </div>
          <SheetDescription>
            {state === "questions" &&
              "A few quick questions to personalize your learning path"}
            {state === "generating" &&
              "Generating your personalized learning plan with Grok..."}
            {state === "journey" && "Your tailored learning path is ready"}
            {state === "error" && "Something went wrong"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {/* Questions State */}
          {state === "questions" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  {questions[currentQuestion].question}
                </h3>
                <div className="flex flex-col gap-2">
                  {questions[currentQuestion].options.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 text-left"
                      onClick={() =>
                        handleAnswer(
                          questions[currentQuestion].id,
                          option.value
                        )
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Generating State */}
          {state === "generating" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse" />
                <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Analyzing your context with Grok...
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                This usually takes a few seconds
              </p>
            </div>
          )}

          {/* Error State */}
          {state === "error" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-destructive/20 mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-medium mb-2">Could not generate plan</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                {errorMessage || "An unexpected error occurred."}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    fetchPlan(answers)
                  }}
                >
                  Retry
                </Button>
                <Button variant="ghost" onClick={handleClose}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Journey Preview State */}
          {state === "journey" && plan && (
            <div className="flex flex-col gap-6">
              {/* Fallback notice */}
              {plan.fallbackUsed && (
                <div className="p-3 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
                  Context was limited. This is a general recommendation.
                </div>
              )}

              {/* Plan Card */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <h3 className="font-semibold mb-2">{plan.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {plan.whyNow}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.quickExplanation}
                </p>

                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{plan.estimatedMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary">
                    <Target className="w-3.5 h-3.5" />
                    <span>{plan.relevanceLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Check className="w-3.5 h-3.5" />
                    <span>Confidence: {plan.confidenceLabel}</span>
                  </div>
                </div>
              </div>

              {/* Steps Preview */}
              <div>
                <h4 className="text-sm font-medium mb-3">Learning steps</h4>
                <div className="flex flex-col gap-2">
                  {plan.steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {stepTypeIcon(step.type)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practice Task Preview */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs font-medium text-primary mb-1">
                  Practice task
                </p>
                <p className="text-sm font-medium">
                  {plan.practiceTask.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {plan.practiceTask.instruction}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={handleStartJourney}>
                  Start Learning Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  {plan.returnToTask || "Return to Task"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
