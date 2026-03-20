"use client"

import { X, Clock, HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ContextualTrigger } from "@/lib/mock-data"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ContextualPromptProps {
  trigger: ContextualTrigger
  retryCount?: number
  onAction: (action: "start" | "snooze" | "dismiss") => void
}

export function ContextualPrompt({
  trigger,
  retryCount = 0,
  onAction,
}: ContextualPromptProps) {
  // Customize message based on retry count
  const getMessage = () => {
    if (trigger.type === "retry" && retryCount >= 3) {
      return "You've retried this step a few times. Want targeted help?"
    }
    return trigger.promptMessage
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Card className="w-80 bg-card border-border shadow-xl">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Learning Opportunity</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 -mr-1 -mt-1"
              onClick={() => onAction("dismiss")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Message */}
          <p className="text-sm text-foreground mb-4">{getMessage()}</p>

          {/* Relevance indicator */}
          <div className="flex items-center gap-1.5 mb-4 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>2 min read</span>
            <span className="mx-1">·</span>
            <span>Relevant to your current task</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => onAction("start")} className="flex-1">
              Start
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction("snooze")}
              className="flex-1"
            >
              Not now
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" side="top" align="end">
                <h4 className="text-sm font-medium mb-2">Why am I seeing this?</h4>
                <p className="text-xs text-muted-foreground">
                  {trigger.description}. This prompt appeared because you opted in to
                  contextual learning suggestions.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  You can disable these prompts in{" "}
                  <a href="/settings" className="text-primary underline">
                    Settings
                  </a>
                  .
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
