"use client"

import { Shield, Check, X, Eye, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TrustInfoCard() {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <CardTitle className="text-base">Privacy & Transparency</CardTitle>
        </div>
        <CardDescription>
          Understand exactly how your data is used
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-4">
          {/* What we track */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              What triggers suggestions
            </h4>
            <ul className="flex flex-col gap-1.5">
              {[
                "Actions you take in the workspace (e.g., clicking buttons, viewing settings)",
                "Number of retries on the same task",
                "Time spent on specific features",
                "Patterns that match known learning opportunities",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What we don't track */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <X className="w-4 h-4 text-destructive" />
              What we do not track
            </h4>
            <ul className="flex flex-col gap-1.5">
              {[
                "Content of your code or documents",
                "Personal communications or messages",
                "Browsing history outside the workspace",
                "Any data when prompts are disabled",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Info note */}
          <div className="flex gap-2 p-3 rounded-lg bg-muted/50 border border-border">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              All activity data is processed locally and used only to improve your
              learning experience. You can disable tracking at any time and your
              data will not be retained.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
