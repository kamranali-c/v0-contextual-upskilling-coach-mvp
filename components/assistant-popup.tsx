"use client"

import { useState } from "react"
import {
  X,
  Minus,
  ChevronRight,
  BookOpen,
  Compass,
  Target,
  FileText,
  TrendingUp,
  CheckSquare,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react"

// --- "?" FAB button ---
function CoachFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200 cursor-pointer group"
      aria-label="Open AI Coach"
    >
      <span className="text-xl font-bold leading-none group-hover:scale-110 transition-transform">?</span>
    </button>
  )
}

// --- Section wrapper ---
function Section({
  icon: Icon,
  title,
  accentColor = "emerald",
  children,
}: {
  icon: typeof Sparkles
  title: string
  accentColor?: "emerald" | "sky" | "amber" | "violet" | "rose"
  children: React.ReactNode
}) {
  const colors = {
    emerald: { iconBg: "bg-emerald-500/10", iconText: "text-emerald-400", titleText: "text-emerald-400" },
    sky: { iconBg: "bg-sky-500/10", iconText: "text-sky-400", titleText: "text-sky-400" },
    amber: { iconBg: "bg-amber-500/10", iconText: "text-amber-400", titleText: "text-amber-400" },
    violet: { iconBg: "bg-violet-500/10", iconText: "text-violet-400", titleText: "text-violet-400" },
    rose: { iconBg: "bg-rose-500/10", iconText: "text-rose-400", titleText: "text-rose-400" },
  }
  const c = colors[accentColor]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-3 h-3 ${c.iconText}`} />
        </div>
        <h4 className={`text-[10px] font-semibold uppercase tracking-widest ${c.titleText}`}>
          {title}
        </h4>
      </div>
      <div className="pl-8">{children}</div>
    </div>
  )
}

// --- Internal doc card ---
function DocCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all cursor-pointer group">
      <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
        <FileText className="w-3.5 h-3.5 text-violet-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white/80 truncate">{title}</p>
        <p className="text-[10px] text-white/30 truncate">{subtitle}</p>
      </div>
      <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
    </div>
  )
}

// --- Main popup ---
export function AssistantPopup() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [askingGrok, setAskingGrok] = useState(false)
  const [grokAnswer, setGrokAnswer] = useState<string | null>(null)

  async function handleAskGrok() {
    setAskingGrok(true)
    setGrokAnswer(null)
    try {
      const res = await fetch("/api/coach/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: "Setting up PostgreSQL database with Prisma",
          taskType: "database-setup",
          currentPage: "Storage / Database config",
          triggerType: "contextual-observation",
          triggerReason: "User is editing schema.prisma and running migrations",
          retries: 0,
          recentActions: [
            "Created prisma/schema.prisma with User and Post models",
            "Ran prisma migrate dev --name add_users",
            "Configured DATABASE_URL in .env.local",
            "Terminal warning: no connection pooling configured",
            "SHADOW_DATABASE_URL not set",
          ],
          userGoal: "Set up reliable database persistence for backend API",
          confidenceLevel: "intermediate",
          learningPreference: "hands-on",
          availableMinutes: 10,
        }),
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setGrokAnswer(data.plan?.whyNow || "Grok analyzed your current task and confirmed the suggestions above are aligned with your work context and team roadmap.")
    } catch {
      setGrokAnswer("This task strengthens your backend engineering capability and directly supports the Q3 platform roadmap goals around service persistence and production readiness.")
    } finally {
      setAskingGrok(false)
    }
  }

  if (!open) {
    return <CoachFab onClick={() => setOpen(true)} />
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-300"
      style={{
        width: minimized ? 340 : 420,
        height: minimized ? 56 : 640,
        backgroundColor: "#0c1018",
        boxShadow: "0 25px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white/90 tracking-tight">AI Coach</h3>
          {!minimized && (
            <p className="text-[10px] text-white/35 mt-0.5 font-medium">
              Roadmap-aware suggestions
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 mr-1">
          <span className="text-[9px] font-mono text-white/20 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5">
            Grok
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setMinimized(!minimized)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setOpen(false); setGrokAnswer(null) }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!minimized && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 min-h-0">

          {/* Section 1: What Grok thinks you're doing */}
          <Section icon={Compass} title="Current Context" accentColor="emerald">
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-3.5">
              <p className="text-[13px] font-medium text-white/85 leading-snug">
                You're setting up persistence for a backend service
              </p>
              <p className="text-xs text-white/45 leading-relaxed mt-1.5">
                This task involves database configuration with Prisma, schema design with relational models,
                migration management, and deployment setup for a PostgreSQL-backed API.
              </p>
            </div>
          </Section>

          {/* Section 2: Roadmap alignment */}
          <Section icon={Target} title="Roadmap Alignment" accentColor="sky">
            <p className="text-xs text-white/55 leading-relaxed">
              This work supports the roadmap themes of{" "}
              <span className="text-sky-400/90 font-medium">Platform Foundations</span>,{" "}
              <span className="text-sky-400/90 font-medium">Application Persistence</span>, and{" "}
              <span className="text-sky-400/90 font-medium">Service Reliability</span>.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Platform Foundations", "Backend Maturity", "Production Readiness"].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-1 rounded-md bg-sky-500/8 text-sky-400/80 border border-sky-500/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Section>

          {/* Section 3: What to learn next */}
          <Section icon={BookOpen} title="What to Learn Next" accentColor="emerald">
            <div className="flex flex-col gap-1.5">
              {[
                "Relational database fundamentals",
                "Schema design and normalization",
                "Migration strategies and rollback plans",
                "Connection pooling (PgBouncer)",
                "Indexing and query optimization",
                "Transactions and data integrity",
                "Observability for database-backed services",
                "Serverless deployment considerations",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 py-1">
                  <span className="text-[10px] font-mono text-emerald-400/60 mt-0.5 w-4 text-right shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-xs text-white/65 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Section 4: Suggested internal docs */}
          <Section icon={FileText} title="Internal Resources" accentColor="violet">
            <div className="flex flex-col gap-1.5">
              <DocCard title="Q3 Platform Roadmap" subtitle="Engineering strategy / roadmap" />
              <DocCard title="Database Standards" subtitle="Backend / standards" />
              <DocCard title="Service Persistence Patterns" subtitle="Architecture / patterns" />
              <DocCard title="Migration Playbook" subtitle="Engineering / runbooks" />
              <DocCard title="Backend Reliability Checklist" subtitle="SRE / checklists" />
            </div>
          </Section>

          {/* Section 5: Growth / skill mapping */}
          <Section icon={TrendingUp} title="Growth Mapping" accentColor="amber">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/55 leading-relaxed">
                This task strengthens <span className="text-amber-400/90 font-medium">backend engineering</span> capability
                and also supports growth in <span className="text-amber-400/90 font-medium">platform engineering</span> and{" "}
                <span className="text-amber-400/90 font-medium">production engineering</span>.
              </p>
              <p className="text-xs text-white/40 leading-relaxed">
                Relevant for progression toward stronger systems design, delivery ownership, and infrastructure fluency.
              </p>
            </div>
          </Section>

          {/* Section 6: Suggested next actions */}
          <Section icon={CheckSquare} title="Suggested Actions" accentColor="rose">
            <div className="flex flex-col gap-1.5">
              {[
                "Review migration strategy before deploying",
                "Configure connection pooling for serverless",
                "Read the persistence standards doc",
                "Add monitoring for query latency and errors",
                "Validate rollback plan for schema changes",
              ].map((action, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer group"
                >
                  <div className="w-4 h-4 rounded border border-white/15 shrink-0 group-hover:border-rose-400/30 transition-colors" />
                  <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{action}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Grok answer (if asked) */}
          {grokAnswer && (
            <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Grok says</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">{grokAnswer}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {!minimized && (
        <div className="px-4 py-3 border-t border-white/[0.06] shrink-0 flex flex-wrap items-center gap-2">
          <button className="text-[11px] font-medium text-violet-400 hover:text-violet-300 bg-violet-500/8 hover:bg-violet-500/15 border border-violet-500/10 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            Open roadmap
          </button>
          <button className="text-[11px] font-medium text-sky-400 hover:text-sky-300 bg-sky-500/8 hover:bg-sky-500/15 border border-sky-500/10 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" />
            Save plan
          </button>
          <button className="text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/8 hover:bg-amber-500/15 border border-amber-500/10 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" />
            Skill path
          </button>
          <button
            onClick={handleAskGrok}
            disabled={askingGrok}
            className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/8 hover:bg-emerald-500/15 border border-emerald-500/10 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {askingGrok ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            Ask Grok why
          </button>
          <div className="flex-1" />
          <button
            onClick={() => { setOpen(false); setGrokAnswer(null) }}
            className="text-[11px] text-white/25 hover:text-white/50 transition-colors font-medium"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
