"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { LearningStepCard } from "@/components/learning-step-card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLearningRecommendations, mockProgressStats } from "@/lib/mock-data"
import {
  ArrowLeft,
  Clock,
  Target,
  Trophy,
  CheckCircle2,
  BookOpen,
} from "lucide-react"
import { ProgressSummary } from "@/components/progress-summary"

export default function JourneyPage() {
  const journey = mockLearningRecommendations[0]
  const [steps, setSteps] = useState(journey.steps)
  const [showComplete, setShowComplete] = useState(false)

  const completedCount = useMemo(
    () => steps.filter((s) => s.completed).length,
    [steps]
  )
  const progress = (completedCount / steps.length) * 100
  const currentStepIndex = steps.findIndex((s) => !s.completed)

  const handleCompleteStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    )

    // Check if all steps are complete
    const newCompletedCount = completedCount + 1
    if (newCompletedCount === steps.length) {
      setTimeout(() => setShowComplete(true), 500)
    }
  }

  const rightPanel = (
    <div className="flex flex-col">
      <ProgressSummary stats={mockProgressStats} />
      
      {/* Other Recommendations */}
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-medium mb-3">Related Learning</h3>
        <div className="flex flex-col gap-2">
          {mockLearningRecommendations.slice(1).map((rec) => (
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
              <h1 className="text-xl font-semibold">{journey.title}</h1>
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
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
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

          {/* Completion Card */}
          {progress === 100 && (
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
