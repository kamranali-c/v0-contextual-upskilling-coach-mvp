"use client"

import { Trophy, Flame, Clock, BookOpen } from "lucide-react"
import type { ProgressStats } from "@/lib/mock-data"

interface ProgressSummaryProps {
  stats: ProgressStats
}

export function ProgressSummary({ stats }: ProgressSummaryProps) {
  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-sm font-medium mb-3">Your Progress</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/20">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">{stats.creditsEarned}</p>
            <p className="text-xs text-muted-foreground">Credits</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-warning/20">
            <Flame className="w-4 h-4 text-warning" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day streak</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-success/20">
            <BookOpen className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">{stats.completedSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-chart-2/20">
            <Clock className="w-4 h-4 text-chart-2" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">{stats.totalLearningMinutes}</p>
            <p className="text-xs text-muted-foreground">Minutes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
