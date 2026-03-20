"use client"

import {
  ChevronDown,
  GitBranch,
  Circle,
  FileCode,
  Folder,
  FolderOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCw,
  Terminal,
} from "lucide-react"

// --- Fake top nav bar (Vercel-style, light) ---
function TopNav() {
  return (
    <header className="h-12 flex items-center border-b border-neutral-200 px-4 gap-3 bg-white shrink-0 select-none">
      {/* Logo */}
      <svg
        viewBox="0 0 76 65"
        className="h-4 w-4 fill-neutral-900"
        aria-hidden="true"
      >
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
      <span className="text-neutral-300 text-sm">/</span>
      <span className="text-sm font-medium text-neutral-900">Acme Corp</span>
      <span className="text-neutral-300 text-sm">/</span>
      <span className="text-sm font-medium text-neutral-900">web-platform</span>
      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />

      {/* Tabs */}
      <nav className="hidden md:flex items-center gap-1 ml-6 text-sm">
        {["Project", "Deployments", "Analytics", "Logs", "Settings"].map(
          (tab) => (
            <span
              key={tab}
              className={`px-3 py-1.5 rounded-md cursor-default transition-colors ${
                tab === "Deployments"
                  ? "text-neutral-900 bg-neutral-100"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab}
            </span>
          )
        )}
      </nav>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <GitBranch className="w-3.5 h-3.5" />
          <span className="font-mono">main</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center text-xs font-medium text-white">
          JD
        </div>
      </div>
    </header>
  )
}

// --- File tree sidebar (light) ---
function FileTree() {
  const items = [
    { type: "folder-open", name: "app", depth: 0 },
    { type: "folder-open", name: "api", depth: 1 },
    { type: "file", name: "route.ts", depth: 2, active: true },
    { type: "file", name: "layout.tsx", depth: 1 },
    { type: "file", name: "page.tsx", depth: 1 },
    { type: "folder", name: "components", depth: 0 },
    { type: "folder", name: "lib", depth: 0 },
    { type: "file", name: "next.config.mjs", depth: 0 },
    { type: "file", name: "package.json", depth: 0 },
    { type: "file", name: "tsconfig.json", depth: 0 },
  ] as const

  return (
    <aside className="hidden lg:flex w-52 flex-col border-r border-neutral-200 bg-neutral-50 shrink-0 select-none overflow-y-auto">
      <div className="px-3 py-2.5 text-xs font-medium text-neutral-400 uppercase tracking-wider">
        Explorer
      </div>
      <div className="flex flex-col text-sm">
        {items.map((item, i) => {
          const Icon =
            item.type === "folder"
              ? Folder
              : item.type === "folder-open"
                ? FolderOpen
                : FileCode
          return (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-1.5 cursor-default ${
                "active" in item && item.active
                  ? "bg-blue-50 text-blue-700"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
              style={{ paddingLeft: `${12 + item.depth * 16}px` }}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono text-xs truncate">{item.name}</span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

// --- Build log output (light) ---
function BuildLog() {
  const lines = [
    { time: "12:04:02", text: "Cloning github.com/acme/web-platform (Branch: main)", type: "info" },
    { time: "12:04:03", text: "Installing dependencies...", type: "info" },
    { time: "12:04:08", text: "Running build command: next build", type: "info" },
    { time: "12:04:09", text: "Creating an optimized production build...", type: "info" },
    { time: "12:04:12", text: "Compiled successfully", type: "success" },
    { time: "12:04:12", text: "Linting and checking validity of types...", type: "info" },
    { time: "12:04:15", text: "Collecting page data...", type: "info" },
    { time: "12:04:16", text: "Generating static pages (7/7)", type: "info" },
    { time: "12:04:17", text: "Finalizing page optimization...", type: "info" },
    { time: "12:04:18", text: "Route (app)                Size     First Load JS", type: "dim" },
    { time: "", text: "  /                        5.2 kB         92 kB", type: "dim" },
    { time: "", text: "  /api/route               0 B            0 B", type: "dim" },
    { time: "", text: "  /dashboard               8.4 kB         95 kB", type: "dim" },
    { time: "12:04:18", text: "Build completed in 16s", type: "success" },
    { time: "12:04:19", text: "Deploying outputs...", type: "info" },
    { time: "12:04:22", text: "Deployment ready", type: "success" },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Deployment summary bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-neutral-900">Production Deployment</span>
        </div>
        <span className="text-xs text-neutral-400 font-mono">dpl_8Kx2nQ4f</span>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Clock className="w-3 h-3" />
          <span>16s</span>
        </div>
        <div className="flex-1" />
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-blue-600 cursor-default">
          <ExternalLink className="w-3 h-3" />
          <span>web-platform-acme.vercel.app</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-5 pt-3 text-sm border-b border-neutral-200">
        {["Build Logs", "Runtime Logs", "Source"].map((tab) => (
          <span
            key={tab}
            className={`px-3 py-2 cursor-default border-b-2 transition-colors ${
              tab === "Build Logs"
                ? "text-neutral-900 border-neutral-900"
                : "text-neutral-400 border-transparent"
            }`}
          >
            {tab}
          </span>
        ))}
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 text-xs text-neutral-400 px-2 py-1 rounded hover:text-neutral-700 transition-colors cursor-default">
          <RotateCw className="w-3 h-3" />
          Redeploy
        </button>
      </div>

      {/* Log lines */}
      <div className="p-4 font-mono text-xs leading-6">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3">
            {line.time && (
              <span className="text-neutral-300 shrink-0 w-16 select-none">
                {line.time}
              </span>
            )}
            {!line.time && <span className="w-16 shrink-0" />}
            <span
              className={
                line.type === "success"
                  ? "text-emerald-600"
                  : line.type === "dim"
                    ? "text-neutral-400"
                    : "text-neutral-700"
              }
            >
              {line.text}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2 text-neutral-300">
          <Terminal className="w-3 h-3" />
          <span className="animate-pulse">{"_"}</span>
        </div>
      </div>
    </div>
  )
}

// --- Deployment info sidebar (light) ---
function DeploymentInfo() {
  const items = [
    { label: "Status", value: "Ready", accent: true },
    { label: "Environment", value: "Production" },
    { label: "Duration", value: "16s" },
    { label: "Branch", value: "main" },
    { label: "Commit", value: "a4f29c1" },
    { label: "Message", value: "fix: update API route error handling" },
    { label: "Framework", value: "Next.js" },
    { label: "Node.js", value: "20.x" },
    { label: "Region", value: "iad1" },
  ]

  return (
    <aside className="hidden xl:flex w-64 flex-col border-l border-neutral-200 bg-neutral-50 shrink-0 overflow-y-auto select-none">
      <div className="px-4 py-3 border-b border-neutral-200">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Deployment Details
        </h3>
      </div>
      <div className="flex flex-col p-4 gap-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="text-xs text-neutral-400">{item.label}</span>
            <span
              className={`text-sm font-mono ${item.accent ? "text-emerald-600" : "text-neutral-700"}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Domains */}
      <div className="px-4 py-3 border-t border-neutral-200 mt-auto">
        <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
          Domains
        </h4>
        <div className="flex flex-col gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
            <span className="text-neutral-600">acme-web.vercel.app</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
            <span className="text-neutral-600">platform.acme.com</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

// --- Full workspace ---
export function FakeWorkspace() {
  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden select-none">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <FileTree />
        <BuildLog />
        <DeploymentInfo />
      </div>
    </div>
  )
}
