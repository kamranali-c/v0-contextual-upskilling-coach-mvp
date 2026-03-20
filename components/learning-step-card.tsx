"use client"

import { Check, BookOpen, Zap, PenTool, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { LearningStep } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface LearningStepCardProps {
  step: LearningStep
  stepNumber: number
  isActive: boolean
  onComplete: () => void
}

const stepTypeConfig = {
  explanation: {
    icon: BookOpen,
    label: "Learn",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  action: {
    icon: Zap,
    label: "Action",
    color: "text-warning",
    bgColor: "bg-warning/20",
  },
  practice: {
    icon: PenTool,
    label: "Practice",
    color: "text-success",
    bgColor: "bg-success/20",
  },
  resource: {
    icon: ExternalLink,
    label: "Resource",
    color: "text-chart-2",
    bgColor: "bg-chart-2/20",
  },
}

export function LearningStepCard({
  step,
  stepNumber,
  isActive,
  onComplete,
}: LearningStepCardProps) {
  const config = stepTypeConfig[step.type]
  const Icon = config.icon

  return (
    <Card
      className={cn(
        "border-border transition-all duration-200",
        isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        step.completed && "opacity-60"
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
              step.completed ? "bg-success text-success-foreground" : config.bgColor
            )}
          >
            {step.completed ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-sm font-semibold">{stepNumber}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={cn(
                  "font-medium",
                  step.completed && "line-through text-muted-foreground"
                )}
              >
                {step.title}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                  config.bgColor,
                  config.color
                )}
              >
                <Icon className="w-3 h-3" />
                {config.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
          </div>
        </div>

        {/* Content (shown when active) */}
        {isActive && !step.completed && step.content && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm leading-relaxed">{step.content}</p>
          </div>
        )}

        {/* Actions (shown when active) */}
        {isActive && !step.completed && (
          <div className="mt-4 flex items-center gap-2">
            <Button size="sm" onClick={onComplete}>
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Mark Complete
            </Button>
            {step.type === "resource" && (
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Open Resource
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
