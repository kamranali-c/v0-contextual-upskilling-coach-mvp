"use client"

import { Zap, Settings, RefreshCw, Sparkles, AlertCircle, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EventSimulatorProps {
  onSimulateEvent: (eventType: string) => void
}

const simulatedEvents = [
  {
    id: "deployment-setup",
    label: "Open Deployment Settings",
    description: "Triggers setup guidance",
    icon: Settings,
  },
  {
    id: "deployment-retry",
    label: "Retry Failed Deployment",
    description: "Triggers troubleshooting help",
    icon: RefreshCw,
  },
  {
    id: "new-feature",
    label: "Use New Feature",
    description: "Triggers feature walkthrough",
    icon: Sparkles,
  },
  {
    id: "env-setup",
    label: "Configure Environment",
    description: "Triggers env setup guide",
    icon: FileCode,
  },
  {
    id: "error-debug",
    label: "View Error Logs",
    description: "Triggers debugging help",
    icon: AlertCircle,
  },
]

export function EventSimulator({ onSimulateEvent }: EventSimulatorProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <CardTitle className="text-base font-medium">Event Simulator</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Click to simulate user actions and trigger contextual prompts
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-2">
          {simulatedEvents.map((event) => (
            <Button
              key={event.id}
              variant="outline"
              className="justify-start h-auto py-2 px-3"
              onClick={() => onSimulateEvent(event.id)}
            >
              <event.icon className="w-4 h-4 mr-2 shrink-0 text-muted-foreground" />
              <div className="text-left">
                <p className="text-sm font-medium">{event.label}</p>
                <p className="text-xs text-muted-foreground">{event.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
