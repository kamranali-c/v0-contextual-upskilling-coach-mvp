"use client"

import { formatDistanceToNow } from "date-fns"
import { Activity, Clock } from "lucide-react"
import type { ActivityEvent } from "@/lib/mock-data"

interface ActivityTimelineProps {
  events: ActivityEvent[]
  onEventClick?: (event: ActivityEvent) => void
}

export function ActivityTimeline({ events, onEventClick }: ActivityTimelineProps) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Recent Activity</h3>
      </div>
      <div className="flex flex-col gap-3">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        ) : (
          events.map((event, index) => (
            <div
              key={event.id}
              className="relative pl-5 pb-3 border-l border-border last:border-l-transparent"
            >
              <div
                className={`absolute left-0 top-0 w-2 h-2 -translate-x-[5px] rounded-full ${
                  event.triggersPrompt
                    ? "bg-primary ring-2 ring-primary/20"
                    : "bg-muted-foreground"
                }`}
              />
              <button
                onClick={() => onEventClick?.(event)}
                className="w-full text-left hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors"
              >
                <p className="text-sm font-medium leading-tight">
                  {event.action}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {event.description}
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground/70">
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
                </div>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
