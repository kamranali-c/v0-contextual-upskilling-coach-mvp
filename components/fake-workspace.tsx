"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Database,
  Table,
  Plus,
  Settings,
  Play,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Key,
  Link2,
  Shield,
  HelpCircle,
  Zap,
  MoreHorizontal,
  Search,
  RefreshCw,
} from "lucide-react"

// --- Fake top nav bar (Vercel-style) ---
function TopNav() {
  return (
    <header className="h-12 flex items-center border-b border-border px-4 gap-3 bg-background shrink-0 select-none">
      {/* Logo */}
      <svg
        viewBox="0 0 76 65"
        className="h-4 w-4 fill-foreground"
        aria-hidden="true"
      >
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
      <span className="text-muted-foreground text-sm">/</span>
      <span className="text-sm font-medium">Acme Corp</span>
      <span className="text-muted-foreground text-sm">/</span>
      <span className="text-sm font-medium">customer-portal</span>
      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />

      {/* Tabs */}
      <nav className="hidden md:flex items-center gap-1 ml-6 text-sm">
        {["Project", "Deployments", "Analytics", "Storage", "Settings"].map(
          (tab) => (
            <span
              key={tab}
              className={`px-3 py-1.5 rounded-md cursor-default transition-colors ${
                tab === "Storage"
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
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
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Hobby</span>
          <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-medium">Upgrade</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
          SJ
        </div>
      </div>
    </header>
  )
}

// --- Storage sidebar ---
function StorageSidebar({ activeTable, onTableSelect }: { activeTable: string; onTableSelect: (table: string) => void }) {
  const tables = [
    { name: "users", rows: 1284 },
    { name: "orders", rows: 5621 },
    { name: "products", rows: 342 },
    { name: "sessions", rows: 892 },
    { name: "audit_logs", rows: 15420 },
  ]

  return (
    <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-sidebar shrink-0 select-none overflow-y-auto">
      {/* Database header */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent/20 flex items-center justify-center">
            <Database className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">customer-db</p>
            <p className="text-[10px] text-muted-foreground">PostgreSQL 15</p>
          </div>
          <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-3 py-2.5 border-b border-border grid grid-cols-2 gap-2 text-center">
        <div className="p-2 rounded bg-secondary/50">
          <p className="text-[10px] text-muted-foreground">Tables</p>
          <p className="text-sm font-medium">5</p>
        </div>
        <div className="p-2 rounded bg-secondary/50">
          <p className="text-[10px] text-muted-foreground">Size</p>
          <p className="text-sm font-medium">24 MB</p>
        </div>
      </div>

      {/* Tables list */}
      <div className="flex-1 py-2">
        <div className="px-3 py-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Tables</span>
          <button className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="flex flex-col">
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => onTableSelect(table.name)}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                activeTable === table.name
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Table className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono text-xs truncate flex-1 text-left">{table.name}</span>
              <span className="text-[10px] text-muted-foreground">{table.rows.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Connection info */}
      <div className="px-3 py-3 border-t border-border">
        <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors text-left">
          <Key className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Connection String</span>
          <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto" />
        </button>
      </div>
    </aside>
  )
}

// --- SQL Query Editor ---
function QueryEditor({ onRun, running }: { onRun: () => void; running: boolean }) {
  const [query, setQuery] = useState(`SELECT 
  u.id,
  u.email,
  u.created_at,
  COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id
ORDER BY order_count DESC
LIMIT 10;`)

  return (
    <div className="border-b border-border">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">Query Editor</span>
          <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-secondary">SQL</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Help</span>
          </button>
          <button
            onClick={onRun}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {running ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            <span>{running ? "Running..." : "Run Query"}</span>
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-36 p-4 font-mono text-xs bg-background text-foreground resize-none focus:outline-none leading-relaxed"
          spellCheck={false}
        />
        <div className="absolute bottom-2 right-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Ln 10, Col 1</span>
          <span>|</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  )
}

// --- Results Table ---
function ResultsTable({ loading }: { loading: boolean }) {
  const [copied, setCopied] = useState(false)

  const columns = ["id", "email", "created_at", "order_count"]
  const rows = [
    { id: "usr_1a2b3c", email: "sarah.j@example.com", created_at: "2024-01-15", order_count: 47 },
    { id: "usr_4d5e6f", email: "mike.chen@acme.io", created_at: "2024-02-03", order_count: 34 },
    { id: "usr_7g8h9i", email: "alex.kim@startup.co", created_at: "2024-01-28", order_count: 29 },
    { id: "usr_0j1k2l", email: "emma.r@corp.com", created_at: "2024-03-10", order_count: 24 },
    { id: "usr_3m4n5o", email: "david.l@tech.dev", created_at: "2024-02-18", order_count: 21 },
  ]

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
          <p className="text-xs text-muted-foreground">Executing query...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Results header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/30 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-foreground">Results</span>
          <span className="text-[10px] text-success px-1.5 py-0.5 rounded bg-success/10">5 rows</span>
          <span className="text-[10px] text-muted-foreground">in 42ms</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-3 h-3" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-2.5 font-medium text-muted-foreground font-mono"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <td className="px-4 py-2.5 text-accent">{row.id}</td>
                <td className="px-4 py-2.5 text-foreground">{row.email}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{row.created_at}</td>
                <td className="px-4 py-2.5 text-foreground">{row.order_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Schema panel ---
function SchemaPanel({ table }: { table: string }) {
  const schemas: Record<string, { name: string; type: string; nullable: boolean; primary?: boolean }[]> = {
    users: [
      { name: "id", type: "text", nullable: false, primary: true },
      { name: "email", type: "text", nullable: false },
      { name: "name", type: "text", nullable: true },
      { name: "created_at", type: "timestamptz", nullable: false },
      { name: "updated_at", type: "timestamptz", nullable: true },
    ],
    orders: [
      { name: "id", type: "text", nullable: false, primary: true },
      { name: "user_id", type: "text", nullable: false },
      { name: "total", type: "numeric", nullable: false },
      { name: "status", type: "text", nullable: false },
      { name: "created_at", type: "timestamptz", nullable: false },
    ],
    products: [
      { name: "id", type: "text", nullable: false, primary: true },
      { name: "name", type: "text", nullable: false },
      { name: "price", type: "numeric", nullable: false },
      { name: "stock", type: "integer", nullable: false },
    ],
    sessions: [
      { name: "id", type: "text", nullable: false, primary: true },
      { name: "user_id", type: "text", nullable: false },
      { name: "expires_at", type: "timestamptz", nullable: false },
    ],
    audit_logs: [
      { name: "id", type: "text", nullable: false, primary: true },
      { name: "action", type: "text", nullable: false },
      { name: "entity_type", type: "text", nullable: false },
      { name: "entity_id", type: "text", nullable: false },
      { name: "created_at", type: "timestamptz", nullable: false },
    ],
  }

  const columns = schemas[table] || schemas.users

  return (
    <aside className="hidden xl:flex w-72 flex-col border-l border-border bg-card shrink-0 overflow-y-auto select-none">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Schema: {table}
        </h3>
        <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Columns */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Columns</span>
          <span className="text-[10px] text-muted-foreground">({columns.length})</span>
        </div>
        <div className="flex flex-col gap-1">
          {columns.map((col) => (
            <div
              key={col.name}
              className="flex items-center gap-2 px-2.5 py-2 rounded bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-foreground">{col.name}</span>
                  {col.primary && (
                    <Key className="w-3 h-3 text-chart-4" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-accent font-mono">{col.type}</span>
                  {!col.nullable && (
                    <span className="text-[10px] text-muted-foreground">NOT NULL</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indexes */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Indexes</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded bg-secondary/50">
            <Zap className="w-3 h-3 text-chart-4 shrink-0" />
            <span className="font-mono text-[11px] text-foreground truncate">{table}_pkey</span>
          </div>
          {table === "users" && (
            <div className="flex items-center gap-2 px-2.5 py-2 rounded bg-secondary/50">
              <Zap className="w-3 h-3 text-accent shrink-0" />
              <span className="font-mono text-[11px] text-foreground truncate">users_email_idx</span>
            </div>
          )}
        </div>
      </div>

      {/* RLS */}
      <div className="px-3 py-3 border-t border-border mt-auto">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Row Level Security</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-2 rounded bg-warning/10 border border-warning/20">
          <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0" />
          <span className="text-[11px] text-warning">RLS not enabled</span>
        </div>
        <button className="w-full mt-2 text-xs text-accent hover:text-accent/80 transition-colors text-left">
          Enable RLS policies
        </button>
      </div>
    </aside>
  )
}

// --- Main content area ---
function MainContent({ activeTable }: { activeTable: string }) {
  const [running, setRunning] = useState(false)
  const [hasRun, setHasRun] = useState(true)

  const handleRun = () => {
    setRunning(true)
    setTimeout(() => {
      setRunning(false)
      setHasRun(true)
    }, 800)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background">
      {/* Sub nav */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-1 mr-4">
          {["Query", "Data", "Migrations", "Backups"].map((tab) => (
            <span
              key={tab}
              className={`px-3 py-1.5 text-xs rounded-md cursor-default transition-colors ${
                tab === "Query"
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tables..."
            className="w-44 h-8 pl-8 pr-3 rounded-md bg-secondary/50 border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Query + Results */}
      <div className="flex-1 flex flex-col min-h-0">
        <QueryEditor onRun={handleRun} running={running} />
        {hasRun ? (
          <ResultsTable loading={running} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Play className="w-8 h-8" />
              <p className="text-sm">Run a query to see results</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Full workspace ---
export function FakeWorkspace() {
  const [activeTable, setActiveTable] = useState("users")

  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden select-none">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <StorageSidebar activeTable={activeTable} onTableSelect={setActiveTable} />
        <MainContent activeTable={activeTable} />
        <SchemaPanel table={activeTable} />
      </div>
    </div>
  )
}
