"use client"

import { useState } from "react"
import {
  X,
  Minus,
  BookOpen,
  Compass,
  Target,
  FileText,
  TrendingUp,
  CheckSquare,
  Sparkles,
  ExternalLink,
  Loader2,
  Eye,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Context source pill — shows what Grok is reading                  */
/* ------------------------------------------------------------------ */
function SourcePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">
      <Eye className="w-2.5 h-2.5" />
      {label}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Section header                                                    */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Internal doc card                                                 */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  "?" FAB                                                           */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Main popup — starts open to immediately show the concept          */
/* ------------------------------------------------------------------ */
export function AssistantPopup() {
  const [open, setOpen] = useState(true)
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
      setGrokAnswer(
        data.plan?.whyNow ||
        "Based on your schema design and migration patterns, this database setup aligns with the Q3 platform foundations roadmap. Completing connection pooling and shadow database configuration will strengthen your service reliability maturity."
      )
    } catch {
      setGrokAnswer(
        "Based on your schema design and migration patterns, this database setup aligns with the Q3 platform foundations roadmap. Completing connection pooling and shadow database configuration will strengthen your service reliability maturity."
      )
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
        height: minimized ? 56 : "min(680px, calc(100vh - 48px))",
        backgroundColor: "#0c1018",
        boxShadow: "0 25px 80px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 0 40px -10px rgba(16,185,129,0.08)",
      }}
    >
      {/* ---- Header ---- */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white/90 tracking-tight">Grok Coach</h3>
            <span className="text-[9px] font-mono text-emerald-400/60 bg-emerald-500/8 border border-emerald-500/10 rounded px-1.5 py-0.5">
              live
            </span>
          </div>
          {!minimized && (
            <p className="text-[10px] text-white/30 mt-0.5">
              Reading your workspace context
            </p>
          )}
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

      {/* ---- Body ---- */}
      {!minimized && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 min-h-0">

          {/* Context sources banner */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">
              Grok is reading from
            </p>
            <div className="flex flex-wrap gap-1.5">
              <SourcePill label="schema.prisma" />
              <SourcePill label="db.ts" />
              <SourcePill label=".env.local" />
              <SourcePill label="terminal output" />
              <SourcePill label="Q3 roadmap" />
            </div>
          </div>

          {/* Section 1: What you're doing */}
          <Section icon={Compass} title="Current Context" accentColor="emerald">
            <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-3.5">
              <p className="text-[13px] font-medium text-white/85 leading-snug">
                Setting up PostgreSQL persistence with Prisma
              </p>
              <p className="text-xs text-white/45 leading-relaxed mt-1.5">
                You have a working schema with User and Post models, migrations are running successfully,
                but connection pooling is missing and SHADOW_DATABASE_URL is not configured.
              </p>
            </div>
          </Section>

          {/* Section 2: Roadmap alignment */}
          <Section icon={Target} title="Roadmap Alignment" accentColor="sky">
            <p className="text-xs text-white/55 leading-relaxed">
              Matches{" "}
              <span className="text-sky-400/90 font-medium">Platform Foundations</span> and{" "}
              <span className="text-sky-400/90 font-medium">Service Reliability</span>{" "}
              from the Q3 engineering roadmap.
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
                "Connection pooling with PgBouncer for serverless",
                "Shadow databases for safe migration testing",
                "Indexing strategies for your User/Post models",
                "Transaction patterns for data integrity",
                "Query monitoring and observability",
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

          {/* Section 4: Internal docs */}
          <Section icon={FileText} title="Internal Resources" accentColor="violet">
            <div className="flex flex-col gap-1.5">
              <DocCard title="Q3 Platform Roadmap" subtitle="Engineering strategy" />
              <DocCard title="Database Standards" subtitle="Backend / standards" />
              <DocCard title="Migration Playbook" subtitle="Engineering / runbooks" />
            </div>
          </Section>

          {/* Section 5: Growth mapping */}
          <Section icon={TrendingUp} title="Growth Mapping" accentColor="amber">
            <p className="text-xs text-white/55 leading-relaxed">
              Strengthens <span className="text-amber-400/90 font-medium">backend engineering</span> and{" "}
              <span className="text-amber-400/90 font-medium">platform engineering</span> capability.
              Relevant for progression toward systems design and infrastructure fluency.
            </p>
          </Section>

          {/* Section 6: Actions */}
          <Section icon={CheckSquare} title="Suggested Actions" accentColor="rose">
            <div className="flex flex-col gap-1.5">
              {[
                "Configure connection pooling for serverless",
                "Set up SHADOW_DATABASE_URL",
                "Read the database standards doc",
                "Add query latency monitoring",
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

          {/* Grok answer */}
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

      {/* ---- Footer ---- */}
      {!minimized && (
        <div className="px-4 py-3 border-t border-white/[0.06] shrink-0 flex items-center gap-2">
          <button
            onClick={handleAskGrok}
            disabled={askingGrok}
            className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/15 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {askingGrok ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            Ask Grok why
          </button>
          <button className="text-[11px] font-medium text-violet-400 hover:text-violet-300 bg-violet-500/8 hover:bg-violet-500/15 border border-violet-500/10 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            Open roadmap
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
