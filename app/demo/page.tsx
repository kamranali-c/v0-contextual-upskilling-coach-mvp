"use client"

import { useState, useCallback } from "react"
import { AppShell } from "@/components/app-shell"
import { TaskList } from "@/components/task-list"
import { EventSimulator } from "@/components/event-simulator"
import { ActivityTimeline } from "@/components/activity-timeline"
import { ProgressSummary } from "@/components/progress-summary"
import { ContextualPrompt } from "@/components/contextual-prompt"
import { AICoachDrawer } from "@/components/ai-coach-drawer"
import {
  mockTasks,
  mockActivityEvents,
  mockProgressStats,
  mockTriggers,
  type ActivityEvent,
} from "@/lib/mock-data"
import { GitBranch, Cloud, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DemoPage() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showCoach, setShowCoach] = useState(false)
  const [currentTrigger, setCurrentTrigger] = useState<string | null>(null)
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(mockActivityEvents)
  const [retryCount, setRetryCount] = useState(0)

  const handleSimulateEvent = useCallback((eventType: string) => {
    // Add activity event
    const newEvent: ActivityEvent = {
      id: `event-${Date.now()}`,
      action: getTriggerAction(eventType),
      description: getTriggerDescription(eventType),
      timestamp: new Date(),
      triggersPrompt: true,
    }
    setActivityEvents((prev) => [newEvent, ...prev].slice(0, 10))

    // Track retries for the retry trigger
    if (eventType === "deployment-retry") {
      setRetryCount((prev) => prev + 1)
    }

    // Show contextual prompt
    setCurrentTrigger(eventType)
    setShowPrompt(true)
  }, [])

  const handleTaskAction = useCallback((taskId: string, action: string) => {
    // Map task actions to trigger types
    const triggerMap: Record<string, string> = {
      settings: "deployment-setup",
      retry: "deployment-retry",
      start: "env-setup",
      logs: "error-debug",
      configure: "env-setup",
    }

    const triggerType = triggerMap[action]
    if (triggerType) {
      handleSimulateEvent(triggerType)
    }
  }, [handleSimulateEvent])

  const handlePromptAction = useCallback((action: "start" | "snooze" | "dismiss") => {
    setShowPrompt(false)
    if (action === "start") {
      setShowCoach(true)
    }
  }, [])

  const handleCoachComplete = useCallback(() => {
    setShowCoach(false)
    setCurrentTrigger(null)
    setRetryCount(0)
  }, [])

  const currentTriggerData = currentTrigger ? mockTriggers[currentTrigger] : null

  // Right panel content
  const rightPanel = (
    <div className="flex flex-col">
      <ProgressSummary stats={mockProgressStats} />
      <ActivityTimeline events={activityEvents} />
    </div>
  )

  return (
    <AppShell rightPanel={rightPanel}>
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Demo Workspace</h1>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="w-4 h-4" />
              <span>main</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-success/20 text-success text-xs font-medium">
              <Cloud className="w-3 h-3" />
              <span>Connected</span>
            </div>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Current Workflow */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
              Current Workflow
            </div>
            <p className="text-sm text-muted-foreground">
              You are setting up a new deployment pipeline for the production environment.
            </p>
          </div>

          {/* Tasks */}
          <TaskList tasks={mockTasks} onTaskAction={handleTaskAction} />

          {/* Event Simulator */}
          <EventSimulator onSimulateEvent={handleSimulateEvent} />

          {/* Mobile Progress Summary */}
          <div className="xl:hidden">
            <ProgressSummary stats={mockProgressStats} />
          </div>
        </div>
      </div>

      {/* Contextual Prompt */}
      {showPrompt && currentTriggerData && (
        <ContextualPrompt
          trigger={currentTriggerData}
          retryCount={retryCount}
          onAction={handlePromptAction}
        />
      )}

      {/* AI Coach Drawer */}
      <AICoachDrawer
        open={showCoach}
        onOpenChange={setShowCoach}
        trigger={currentTriggerData}
        onComplete={handleCoachComplete}
      />
    </AppShell>
  )
}

function getTriggerAction(eventType: string): string {
  const actions: Record<string, string> = {
    "deployment-setup": "Opened deployment settings",
    "deployment-retry": "Retried deployment",
    "new-feature": "Explored new feature",
    "env-setup": "Configuring environment",
    "error-debug": "Viewing error logs",
  }
  return actions[eventType] || "Performed action"
}

function getTriggerDescription(eventType: string): string {
  const descriptions: Record<string, string> = {
    "deployment-setup": "Viewing production deployment configuration",
    "deployment-retry": "Attempting to redeploy staging environment",
    "new-feature": "Exploring new monitoring capabilities",
    "env-setup": "Setting up environment variables",
    "error-debug": "Investigating deployment failure",
  }
  return descriptions[eventType] || "Action performed"
}
