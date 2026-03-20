"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  mockProgressStats,
  mockCompletedSessions,
  mockLearningRecommendations,
} from "@/lib/mock-data"
import {
  Trophy,
  Flame,
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProgressPage() {
  const stats = mockProgressStats
  const nextMilestone = 200
  const milestoneProgress = (stats.creditsEarned / nextMilestone) * 100

  return (
    <AppShell>
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold">Your Progress</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your learning journey and achievements
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.creditsEarned}</p>
                    <p className="text-xs text-muted-foreground">Credits Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/20">
                    <Flame className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.currentStreak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/20">
                    <BookOpen className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedSessions}</p>
                    <p className="text-xs text-muted-foreground">Sessions Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-2/20">
                    <Clock className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalLearningMinutes}</p>
                    <p className="text-xs text-muted-foreground">Minutes Learned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Milestone Progress */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Next Milestone</CardTitle>
              </div>
              <CardDescription>
                {nextMilestone - stats.creditsEarned} credits until your next achievement
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4">
                <Progress value={milestoneProgress} className="flex-1 h-3" />
                <span className="text-sm font-medium text-muted-foreground">
                  {stats.creditsEarned}/{nextMilestone}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Completed Sessions */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <CardTitle className="text-base">Recently Completed</CardTitle>
                </div>
                <CardDescription>Your latest learning sessions</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col gap-3">
                  {mockCompletedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{session.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(session.completedAt, { addSuffix: true })} ·{" "}
                          {session.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium shrink-0 ml-3">
                        <Trophy className="w-3 h-3" />
                        +{session.creditsEarned}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Recommendations */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">Recommended for You</CardTitle>
                </div>
                <CardDescription>
                  Learning paths based on your recent activity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col gap-3">
                  {mockLearningRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{rec.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{rec.estimatedTime}</span>
                          <span>·</span>
                          <span>{rec.steps.length} steps</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 ml-3" asChild>
                        <Link href="/journey">
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Card */}
          <Card className="border-border bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-base">Contextual vs Traditional Learning</CardTitle>
              <CardDescription>
                Why learning in the flow of work is more effective
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h4 className="text-sm font-medium mb-3 text-primary">
                    Contextual Learning
                  </h4>
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>Learn exactly when relevant</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>2-5 minute micro-sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>Apply knowledge immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span>Higher retention rate</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                    Traditional Training
                  </h4>
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <span>Scheduled, often inconvenient</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <span>Hour-long sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <span>Delayed application</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <span>Forgetting curve applies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
