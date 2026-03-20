"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { LearningStepCard } from "@/components/learning-step-card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockLearningRecommendations, mockProgressStats, type LearningStep } from "@/lib/mock-data"
import {
  ArrowLeft,
  Clock,
  Target,
  Trophy,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from "lucide-react"
import { ProgressSummary } from "@/components/progress-summary"
import type { CoachingPlan } from "@/lib/ai/schemas"

// Converts an AI-generated CoachingPlan into the shape the journey UI expects
function planToJourney(plan: CoachingPlan) {
  const steps: LearningStep[] = plan.steps.map((s, i) => ({
    id: `ai-step-${i}`,
    title: s.title,
    description: s.description,
    type: mapStepType(s.type),
    completed: false,
    content: s.description,
  }))

  // Add practice task as a step
  steps.push({
    id: "ai-practice",
    title: plan.practiceTask.title,
    description: plan.practiceTask.instruction,
    type: "practice",
    completed: false,
    content: plan.practiceTask.instruction,
  })

  return {
    id: "ai-generated",
    title: plan.title,
    description: plan.quickExplanation,
    estimatedTime: `${plan.estimatedMinutes} min`,
    relevanceLabel: plan.relevanceLabel,
    category: "AI Generated",
    steps,
    whyNow: plan.whyNow,
    deeperResource: plan.deeperResource,
    returnToTask: plan.returnToTask,
    fallbackUsed: plan.fallbackUsed,
    confidenceLabel: plan.confidenceLabel,
  }
}

function mapStepType(
  type: "explain" | "do" | "check" | "practice"
): LearningStep["type"] {
  switch (type) {
    case "explain":
      return "explanation"
    case "do":
      return "action"
    case "check":
      return "resource"
    case "practice":
      return "practice"
  }
}

export default function JourneyPage() {
  const [aiJourney, setAiJourney] = useState<ReturnType<typeof planToJourney> | null>(null)
  const [isAiPlan, setIsAiPlan] = useState(false)

  // Read AI plan from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("coachingPlan")
      if (stored) {
        const plan = JSON.parse(stored) as CoachingPlan
        setAiJourney(planToJourney(plan))
        setIsAiPlan(true)
        sessionStorage.removeItem("coachingPlan")
      }
    } catch {
      // ignore parse errors, fall back to mock
    }
  }, [])

  const journey = isAiPlan && aiJourney
    ? { ...aiJourney }
    : mockLearningRecommendations[0]

  const [steps, setSteps] = useState(journey.steps)
  const [showComplete, setShowComplete] = useState(false)

  // Reset steps when journey source changes
  useEffect(() => {
    setSteps(journey.steps)
    setShowComplete(false)
  }, [isAiPlan, aiJourney]) // eslint-disable-line react-hooks/exhaustive-deps

  const completedCount = useMemo(
    () => steps.filter((s) => s.completed).length,
    [steps]
  )
  const progressValue = (completedCount / steps.length) * 100
  const currentStepIndex = steps.findIndex((s) => !s.completed)

  const handleCompleteStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    )

    const newCompletedCount = completedCount + 1
    if (newCompletedCount === steps.length) {
      setTimeout(() => setShowComplete(true), 500)
    }
  }

  const rightPanel = (
    <div className="flex flex-col">
      <ProgressSummary stats={mockProgressStats} />

      {/* AI context info */}
      {isAiPlan && aiJourney && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-sm font-medium">AI Context</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {aiJourney.whyNow}
          </p>
          {aiJourney.fallbackUsed && (
            <p className="text-xs text-muted-foreground italic">
              Limited context was available. This is a general recommendation.
            </p>
          )}
          {aiJourney.deeperResource && (
            <div className="mt-3 p-2.5 rounded-lg bg-muted/50">
              <p className="text-xs font-medium">{aiJourney.deeperResource.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {aiJourney.deeperResource.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Other Recommendations */}
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-medium mb-3">Related Learning</h3>
        <div className="flex flex-col gap-2">
          {mockLearningRecommendations.slice(isAiPlan ? 0 : 1).map((rec) => (
            <button
              key={rec.id}
              className="flex items-start gap-3 p-3 rounded-lg text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted shrink-0">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{rec.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {rec.estimatedTime}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Completion overlay
  if (showComplete) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-6">
            <Trophy className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Journey Complete!</h1>
          <p className="text-muted-foreground max-w-md mb-6">
            Great work! You have completed the learning journey and earned{" "}
            <span className="text-primary font-semibold">15 credits</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link href="/demo">Return to Workspace</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/progress">View Progress</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell rightPanel={rightPanel}>
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
            <Link href="/demo">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Workspace
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{journey.title}</h1>
                {isAiPlan && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                    <Sparkles className="w-3 h-3" />
                    AI
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {journey.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{journey.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                <Target className="w-3.5 h-3.5" />
                <span>{journey.relevanceLabel}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {completedCount} of {steps.length} steps completed
              </span>
              <span className="font-medium">{Math.round(progressValue)}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {steps.map((step, index) => (
            <LearningStepCard
              key={step.id}
              step={step}
              stepNumber={index + 1}
              isActive={index === currentStepIndex}
              onComplete={() => handleCompleteStep(step.id)}
            />
          ))}

          {/* Return to task hint */}
          {isAiPlan && aiJourney?.returnToTask && progressValue === 100 && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
              {aiJourney.returnToTask}
            </div>
          )}

          {/* Completion Card */}
          {progressValue === 100 && (
            <Card className="border-success/50 bg-success/5">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/20">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">All steps completed!</h3>
                  <p className="text-sm text-muted-foreground">
                    Great work on finishing this learning journey.
                  </p>
                </div>
                <Button onClick={() => setShowComplete(true)}>
                  Finish
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  )
}
