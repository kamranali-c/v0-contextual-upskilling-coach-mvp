"use client"

import {
  ChevronDown,
  GitBranch,
  Circle,
  FileCode,
  FolderOpen,
  Terminal,
  Database,
  AlertCircle,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Top nav — Vercel-style project navigation                         */
/* ------------------------------------------------------------------ */
function TopNav() {
  return (
    <header className="h-12 flex items-center border-b border-neutral-200 px-4 gap-3 bg-white shrink-0">
      <svg viewBox="0 0 76 65" className="h-4 w-4 fill-neutral-900" aria-hidden="true">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
      <span className="text-neutral-300 text-sm">/</span>
      <span className="text-sm font-medium text-neutral-900">Acme Corp</span>
      <span className="text-neutral-300 text-sm">/</span>
      <span className="text-sm font-medium text-neutral-900">backend-api</span>
      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />

      <nav className="hidden md:flex items-center gap-1 ml-6 text-sm">
        {["Project", "Deployments", "Storage", "Settings"].map((tab) => (
          <span
            key={tab}
            className={`px-3 py-1.5 rounded-md cursor-default ${
              tab === "Storage"
                ? "text-neutral-900 bg-neutral-100 font-medium"
                : "text-neutral-500"
            }`}
          >
            {tab}
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <GitBranch className="w-3.5 h-3.5" />
          <span className="font-mono">feat/add-database</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center text-xs font-medium text-white">
          JD
        </div>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  File tree — database-related files with context source markers     */
/* ------------------------------------------------------------------ */
function FileTree() {
  const items = [
    { type: "folder-open" as const, name: "prisma", depth: 0 },
    { type: "file" as const, name: "schema.prisma", depth: 1, active: true, source: true },
    { type: "folder-open" as const, name: "migrations", depth: 1 },
    { type: "file" as const, name: "001_init.sql", depth: 2 },
    { type: "file" as const, name: "002_add_users.sql", depth: 2 },
    { type: "folder-open" as const, name: "app", depth: 0 },
    { type: "folder-open" as const, name: "api", depth: 1 },
    { type: "file" as const, name: "route.ts", depth: 2 },
    { type: "folder-open" as const, name: "lib", depth: 0 },
    { type: "file" as const, name: "db.ts", depth: 1, source: true },
    { type: "file" as const, name: "schema.ts", depth: 1 },
    { type: "file" as const, name: ".env.local", depth: 0, source: true },
    { type: "file" as const, name: "next.config.mjs", depth: 0 },
    { type: "file" as const, name: "package.json", depth: 0 },
  ]

  return (
    <aside className="hidden lg:flex w-56 flex-col border-r border-neutral-200 bg-neutral-50/80 shrink-0 overflow-y-auto">
      <div className="px-3 py-2.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
        Explorer
      </div>
      <div className="flex flex-col text-sm">
        {items.map((item, i) => {
          const Icon = item.type === "folder-open" ? FolderOpen : FileCode
          const isActive = "active" in item && item.active
          const isSource = "source" in item && item.source
          return (
            <div
              key={i}
              className={`relative flex items-center gap-2 px-3 py-1.5 cursor-default ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : isSource
                    ? "text-neutral-600"
                    : "text-neutral-500"
              }`}
              style={{ paddingLeft: `${12 + item.depth * 16}px` }}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono text-xs truncate">{item.name}</span>
              {isSource && (
                <span className="ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/*  Editor — schema.prisma with highlighted source lines              */
/* ------------------------------------------------------------------ */
function EditorPanel() {
  const schemaLines = [
    { num: 1, text: "// prisma/schema.prisma", style: "comment" as const },
    { num: 2, text: "", style: "normal" as const },
    { num: 3, text: "generator client {", style: "keyword" as const },
    { num: 4, text: '  provider = "prisma-client-js"', style: "string" as const },
    { num: 5, text: "}", style: "keyword" as const },
    { num: 6, text: "", style: "normal" as const },
    { num: 7, text: "datasource db {", style: "keyword" as const, source: true },
    { num: 8, text: '  provider = "postgresql"', style: "string" as const, source: true },
    { num: 9, text: '  url      = env("DATABASE_URL")', style: "env" as const, source: true },
    { num: 10, text: "}", style: "keyword" as const },
    { num: 11, text: "", style: "normal" as const },
    { num: 12, text: "model User {", style: "keyword" as const },
    { num: 13, text: "  id        String   @id @default(cuid())", style: "normal" as const },
    { num: 14, text: "  email     String   @unique", style: "normal" as const },
    { num: 15, text: "  name      String?", style: "normal" as const },
    { num: 16, text: "  role      Role     @default(USER)", style: "normal" as const },
    { num: 17, text: "  posts     Post[]", style: "normal" as const },
    { num: 18, text: "  createdAt DateTime @default(now())", style: "normal" as const },
    { num: 19, text: "  updatedAt DateTime @updatedAt", style: "normal" as const },
    { num: 20, text: "}", style: "keyword" as const },
    { num: 21, text: "", style: "normal" as const },
    { num: 22, text: "model Post {", style: "keyword" as const },
    { num: 23, text: "  id        String   @id @default(cuid())", style: "normal" as const },
    { num: 24, text: "  title     String", style: "normal" as const },
    { num: 25, text: "  content   String?", style: "normal" as const },
    { num: 26, text: "  published Boolean  @default(false)", style: "normal" as const },
    { num: 27, text: "  author    User     @relation(fields: [authorId], references: [id])", style: "normal" as const },
    { num: 28, text: "  authorId  String", style: "normal" as const },
    { num: 29, text: "  createdAt DateTime @default(now())", style: "normal" as const },
    { num: 30, text: "}", style: "keyword" as const },
    { num: 31, text: "", style: "normal" as const },
    { num: 32, text: "enum Role {", style: "keyword" as const },
    { num: 33, text: "  USER", style: "normal" as const },
    { num: 34, text: "  ADMIN", style: "normal" as const },
    { num: 35, text: "}", style: "keyword" as const },
  ]

  const colorMap = {
    comment: "text-neutral-400",
    keyword: "text-blue-600",
    string: "text-emerald-700",
    env: "text-amber-700",
    normal: "text-neutral-700",
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      {/* Editor tabs */}
      <div className="flex items-center border-b border-neutral-200 bg-neutral-50/50">
        <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-blue-500 bg-white text-sm">
          <FileCode className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-mono text-xs text-neutral-900">schema.prisma</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400">
          <FileCode className="w-3.5 h-3.5" />
          <span className="font-mono text-xs">db.ts</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400">
          <FileCode className="w-3.5 h-3.5" />
          <span className="font-mono text-xs">.env.local</span>
        </div>
      </div>

      {/* Code */}
      <div className="flex-1 overflow-y-auto font-mono text-[13px] leading-6">
        {schemaLines.map((line) => {
          const isSource = "source" in line && line.source
          return (
            <div
              key={line.num}
              className={`flex ${
                isSource
                  ? "bg-emerald-50/80 border-l-2 border-emerald-400"
                  : "hover:bg-neutral-50 border-l-2 border-transparent"
              }`}
            >
              <span className="w-12 text-right pr-4 text-neutral-300 select-none shrink-0 text-xs leading-6">
                {line.num}
              </span>
              <span className={colorMap[line.style]}>
                {line.text}
              </span>
              {isSource && line.num === 9 && (
                <span className="ml-4 text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded font-sans">
                  Grok reads this
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Terminal */}
      <div className="border-t border-neutral-200 bg-neutral-50/50">
        <div className="flex items-center gap-1 px-3 py-1.5 text-[10px] border-b border-neutral-200">
          <span className="px-2 py-0.5 rounded text-neutral-900 bg-white border border-neutral-200 font-medium">Terminal</span>
          <span className="px-2 py-0.5 rounded text-neutral-400">Problems</span>
          <span className="px-2 py-0.5 rounded text-neutral-400">Output</span>
        </div>
        <div className="p-3 font-mono text-xs leading-5 h-28 overflow-y-auto bg-white">
          <div className="text-neutral-400">$ npx prisma migrate dev --name add_users</div>
          <div className="text-neutral-600 mt-1">Environment variables loaded from .env.local</div>
          <div className="text-neutral-600">Prisma schema loaded from prisma/schema.prisma</div>
          <div className="text-neutral-600 mt-1">{'Datasource "db": PostgreSQL database "acme_dev"'}</div>
          <div className="text-neutral-600">{'at "ep-cool-rain-123456.us-east-2.aws.neon.tech"'}</div>
          <div className="text-emerald-600 mt-1">Applying migration `002_add_users`</div>
          <div className="text-emerald-600">Database migration applied successfully.</div>
          <div className="mt-1 text-neutral-600">Running generate... Done in 1.2s</div>
          <div className="flex items-center gap-1.5 mt-2 bg-amber-50 -mx-1 px-1 py-0.5 rounded border-l-2 border-amber-400">
            <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="text-amber-700">Warning: No connection pooling configured.</span>
            <span className="ml-2 text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded font-sans shrink-0">
              Grok reads this
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-neutral-400">
            <Terminal className="w-3 h-3" />
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Right sidebar — env vars, deployment, DB info                     */
/* ------------------------------------------------------------------ */
function InfoSidebar() {
  return (
    <aside className="hidden xl:flex w-72 flex-col border-l border-neutral-200 bg-neutral-50/50 shrink-0 overflow-y-auto">
      {/* Environment Variables */}
      <div className="px-4 py-3 border-b border-neutral-200">
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
          Environment Variables
        </h3>
      </div>
      <div className="flex flex-col p-4 gap-3 border-b border-neutral-200">
        {[
          { key: "DATABASE_URL", value: "postgresql://acme_dev:****@ep-cool-rain...", status: "set" as const },
          { key: "DIRECT_URL", value: "postgresql://acme_dev:****@ep-cool-rain...", status: "set" as const },
          { key: "SHADOW_DATABASE_URL", value: "Not configured", status: "missing" as const },
          { key: "NEXT_PUBLIC_APP_URL", value: "https://backend-api.vercel.app", status: "set" as const },
        ].map((env) => (
          <div key={env.key} className={`flex flex-col gap-0.5 ${env.status === "missing" ? "bg-amber-50/60 -mx-2 px-2 py-1.5 rounded-lg border border-amber-200/60" : ""}`}>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-medium text-neutral-700">{env.key}</span>
              {env.status === "missing" && (
                <span className="text-[9px] text-emerald-600 bg-emerald-100 px-1 py-0.5 rounded font-sans">
                  Grok reads this
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-mono truncate ${
                env.status === "missing" ? "text-amber-600" : "text-neutral-400"
              }`}
            >
              {env.value}
            </span>
          </div>
        ))}
      </div>

      {/* Deployment */}
      <div className="px-4 py-3 border-b border-neutral-200">
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
          Deployment
        </h3>
      </div>
      <div className="flex flex-col p-4 gap-3 border-b border-neutral-200">
        {[
          { label: "Status", value: "Building" },
          { label: "Branch", value: "feat/add-database" },
          { label: "Commit", value: "b7e3a21 -- add prisma schema" },
          { label: "Framework", value: "Next.js 16" },
          { label: "Database", value: "Neon PostgreSQL" },
          { label: "Region", value: "us-east-2 (iad1)" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="text-[10px] text-neutral-400">{item.label}</span>
            <span className="text-xs font-mono text-neutral-700">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Database */}
      <div className="px-4 py-3 border-b border-neutral-200">
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
          Database
        </h3>
      </div>
      <div className="flex flex-col p-4 gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs text-neutral-700 font-medium">acme_dev</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-400">Tables</span>
          <span className="text-xs font-mono text-neutral-700">User, Post (2 models)</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-400">Migrations</span>
          <span className="text-xs font-mono text-neutral-700">2 applied, 0 pending</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-neutral-400">Pooling</span>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-mono text-amber-600">Not configured</span>
          </div>
        </div>
      </div>

      {/* Domains */}
      <div className="px-4 py-3 border-t border-neutral-200 mt-auto">
        <h4 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">
          Domains
        </h4>
        <div className="flex flex-col gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
            <span className="text-neutral-600">backend-api.vercel.app</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-neutral-300 text-neutral-300" />
            <span className="text-neutral-400">api.acme.com</span>
            <span className="text-[10px] text-neutral-300">(pending)</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/*  Full workspace with dimming overlay                               */
/* ------------------------------------------------------------------ */
export function FakeWorkspace() {
  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden select-none pointer-events-none">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <FileTree />
        <EditorPanel />
        <InfoSidebar />
      </div>
      {/* Subtle dim overlay to push workspace to background */}
      <div className="fixed inset-0 bg-black/[0.03] pointer-events-none" />
    </div>
  )
}
