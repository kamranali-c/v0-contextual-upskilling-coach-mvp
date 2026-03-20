"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, Check, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import {
  mockCoachQuestions,
  mockLearningRecommendations,
  type ContextualTrigger,
  type LearningRecommendation,
} from "@/lib/mock-data"

interface AICoachDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: ContextualTrigger | null
  onComplete: () => void
}

type CoachState = "questions" | "generating" | "journey"

export function AICoachDrawer({
  open,
  onOpenChange,
  trigger,
  onComplete,
}: AICoachDrawerProps) {
  const router = useRouter()
  const [state, setState] = useState<CoachState>("questions")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedJourney, setSelectedJourney] = useState<LearningRecommendation | null>(
    null
  )

  const questions = mockCoachQuestions
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Generate journey
      setState("generating")
      setTimeout(() => {
        // Select a journey based on trigger type
        const journey =
          trigger?.type === "error" || trigger?.type === "retry"
            ? mockLearningRecommendations[1]
            : mockLearningRecommendations[0]
        setSelectedJourney(journey)
        setState("journey")
      }, 1500)
    }
  }

  const handleStartJourney = () => {
    onOpenChange(false)
    router.push("/journey")
    // Reset state for next time
    setTimeout(() => {
      setState("questions")
      setCurrentQuestion(0)
      setAnswers({})
      setSelectedJourney(null)
    }, 300)
  }

  const handleClose = () => {
    onOpenChange(false)
    onComplete()
    // Reset state
    setTimeout(() => {
      setState("questions")
      setCurrentQuestion(0)
      setAnswers({})
      setSelectedJourney(null)
    }, 300)
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
            {state === "generating" && "Creating your personalized learning journey..."}
            {state === "journey" && "Your tailored learning path is ready"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {/* Questions State */}
          {state === "questions" && (
            <div className="flex flex-col gap-6">
              {/* Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              {/* Current Question */}
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
                        handleAnswer(questions[currentQuestion].id, option.value)
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
                Analyzing your responses...
              </p>
            </div>
          )}

          {/* Journey Preview State */}
          {state === "journey" && selectedJourney && (
            <div className="flex flex-col gap-6">
              {/* Journey Card */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{selectedJourney.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedJourney.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedJourney.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary">
                    <Target className="w-3.5 h-3.5" />
                    <span>{selectedJourney.relevanceLabel}</span>
                  </div>
                </div>
              </div>

              {/* Steps Preview */}
              <div>
                <h4 className="text-sm font-medium mb-3">What you will learn</h4>
                <div className="flex flex-col gap-2">
                  {selectedJourney.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{step.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {step.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={handleStartJourney}>
                  Start Learning Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Return to Task
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
