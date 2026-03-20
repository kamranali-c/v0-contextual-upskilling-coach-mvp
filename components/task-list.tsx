"use client"

import { Settings, RefreshCw, Play, FileText, Eye, AlertTriangle } from "lucide-react"
import type { Task } from "@/lib/mock-data"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskListProps {
  tasks: Task[]
  onTaskAction: (taskId: string, action: string) => void
}

const actionIcons: Record<string, React.ReactNode> = {
  settings: <Settings className="w-3.5 h-3.5" />,
  retry: <RefreshCw className="w-3.5 h-3.5" />,
  start: <Play className="w-3.5 h-3.5" />,
  logs: <FileText className="w-3.5 h-3.5" />,
  view: <Eye className="w-3.5 h-3.5" />,
}

function getTaskActions(task: Task): { action: string; label: string }[] {
  switch (task.status) {
    case "failed":
      return [
        { action: "retry", label: "Retry" },
        { action: "logs", label: "View Logs" },
      ]
    case "in-progress":
      return [
        { action: "settings", label: "Settings" },
        { action: "logs", label: "Logs" },
      ]
    case "pending":
      return [
        { action: "start", label: "Start" },
        { action: "settings", label: "Configure" },
      ]
    case "completed":
      return [{ action: "view", label: "View" }]
    default:
      return []
  }
}

export function TaskList({ tasks, onTaskAction }: TaskListProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Current Tasks</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          {tasks.map((task) => {
            const actions = getTaskActions(task)
            return (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium truncate">{task.title}</h4>
                    <StatusBadge status={task.status} />
                    {task.status === "failed" && (
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {task.description}
                  </p>
                  <span className="inline-block mt-1.5 text-xs text-muted-foreground/70 px-1.5 py-0.5 rounded bg-muted">
                    {task.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {actions.map(({ action, label }) => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      onClick={() => onTaskAction(task.id, action)}
                      className="h-7 text-xs"
                    >
                      {actionIcons[action]}
                      <span className="ml-1.5">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
