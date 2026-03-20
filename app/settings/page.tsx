"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { TrustInfoCard } from "@/components/trust-info-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, Clock, Zap, BookOpen, Shield, CheckCircle2 } from "lucide-react"
import { mockUser } from "@/lib/mock-data"

export default function SettingsPage() {
  const [contextualPrompts, setContextualPrompts] = useState(
    mockUser.preferences.contextualPromptsEnabled
  )
  const [snoozeOption, setSnoozeOption] = useState<string | null>(null)
  const [frequency, setFrequency] = useState(mockUser.preferences.notificationFrequency)
  const [learningStyle, setLearningStyle] = useState(mockUser.preferences.learningStyle)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control your learning experience and privacy preferences
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {/* Contextual Prompts */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Contextual Prompts</CardTitle>
              </div>
              <CardDescription>
                Control when and how learning suggestions appear
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col gap-6">
              {/* Master toggle */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="contextual-prompts" className="text-sm font-medium">
                    Enable contextual prompts
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Show learning suggestions while you work
                  </p>
                </div>
                <Switch
                  id="contextual-prompts"
                  checked={contextualPrompts}
                  onCheckedChange={setContextualPrompts}
                />
              </div>

              <Separator />

              {/* Snooze options */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Snooze prompts
                </Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { value: "1h", label: "1 hour" },
                    { value: "today", label: "Today" },
                    { value: "1w", label: "1 week" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={snoozeOption === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setSnoozeOption(
                          snoozeOption === option.value ? null : option.value
                        )
                      }
                      disabled={!contextualPrompts}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {snoozeOption && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Prompts will be snoozed for {snoozeOption === "1h" ? "1 hour" : snoozeOption === "today" ? "the rest of today" : "1 week"}.
                  </p>
                )}
              </div>

              <Separator />

              {/* Frequency */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  Notification frequency
                </Label>
                <Select
                  value={frequency}
                  onValueChange={(v) => setFrequency(v as typeof frequency)}
                  disabled={!contextualPrompts}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">
                      Minimal - Only essential suggestions
                    </SelectItem>
                    <SelectItem value="balanced">
                      Balanced - Occasional helpful prompts
                    </SelectItem>
                    <SelectItem value="frequent">
                      Frequent - More learning opportunities
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Learning Preferences</CardTitle>
              </div>
              <CardDescription>
                Customize how learning content is delivered
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Label className="text-sm font-medium mb-3 block">
                Preferred learning style
              </Label>
              <RadioGroup
                value={learningStyle}
                onValueChange={(v) => setLearningStyle(v as typeof learningStyle)}
                className="flex flex-col gap-3"
              >
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="quick-fix" id="quick-fix" className="mt-0.5" />
                  <Label htmlFor="quick-fix" className="flex-1 cursor-pointer">
                    <span className="font-medium">Quick fixes</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Short, actionable solutions to get you unblocked fast
                    </p>
                  </Label>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="deeper-learning" id="deeper-learning" className="mt-0.5" />
                  <Label htmlFor="deeper-learning" className="flex-1 cursor-pointer">
                    <span className="font-medium">Deeper learning</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Comprehensive explanations and conceptual understanding
                    </p>
                  </Label>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="mixed" id="mixed" className="mt-0.5" />
                  <Label htmlFor="mixed" className="flex-1 cursor-pointer">
                    <span className="font-medium">Mixed approach</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Let the AI coach decide based on context
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Privacy & Trust */}
          <TrustInfoCard />

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-success">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved
              </span>
            )}
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
