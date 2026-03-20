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

// ── Light theme inline colors ──────────────────────────────────────────────
// The global CSS uses dark tokens. The workspace uses hardcoded light colors
// so the dark FlowState popup creates strong visual contrast.
const L = {
  bg: "#fafafa",
  bgAlt: "#ffffff",
  bgSidebar: "#f5f5f5",
  bgHover: "#f0f0f0",
  bgActive: "#eaeaff",
  bgAccent: "#e8f4f8",
  bgAccentSoft: "#dff0f5",
  bgSuccess: "#e6f9ee",
  bgWarning: "#fff8e6",
  bgCard: "#ffffff",
  border: "#e5e5e5",
  borderSoft: "#eeeeee",
  text: "#171717",
  textSecondary: "#525252",
  textMuted: "#a3a3a3",
  textAccent: "#0d9488",
  textWarning: "#d97706",
  textSuccess: "#16a34a",
  textLink: "#0ea5e9",
  textYellow: "#ca8a04",
  shadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
} as const

// --- Fake top nav bar (light Vercel-style) ---
function TopNav() {
  return (
    <header
      className="h-12 flex items-center px-4 gap-3 shrink-0 select-none"
      style={{ background: L.bgCard, borderBottom: `1px solid ${L.border}`, color: L.text }}
    >
      {/* Logo */}
      <svg viewBox="0 0 76 65" className="h-4 w-4" aria-hidden="true" style={{ fill: L.text }}>
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
      <span style={{ color: L.textMuted }} className="text-sm">/</span>
      <span className="text-sm font-medium" style={{ color: L.text }}>Acme Corp</span>
      <span style={{ color: L.textMuted }} className="text-sm">/</span>
      <span className="text-sm font-medium" style={{ color: L.text }}>customer-portal</span>
      <ChevronDown className="w-3.5 h-3.5" style={{ color: L.textMuted }} />

      {/* Tabs */}
      <nav className="hidden md:flex items-center gap-1 ml-6 text-sm">
        {["Project", "Deployments", "Analytics", "Storage", "Settings"].map((tab) => (
          <span
            key={tab}
            className="px-3 py-1.5 rounded-md cursor-default transition-colors"
            style={{
              color: tab === "Storage" ? L.text : L.textSecondary,
              background: tab === "Storage" ? L.bgHover : "transparent",
              fontWeight: tab === "Storage" ? 500 : 400,
            }}
          >
            {tab}
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span style={{ color: L.textMuted }}>Hobby</span>
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-medium"
            style={{ background: L.bgAccent, color: L.textAccent }}
          >
            Upgrade
          </span>
        </div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
          style={{ background: L.bgHover, color: L.textSecondary }}
        >
          SJ
        </div>
      </div>
    </header>
  )
}

// --- Storage sidebar (light) ---
function StorageSidebar({
  activeTable,
  onTableSelect,
}: {
  activeTable: string
  onTableSelect: (table: string) => void
}) {
  const tables = [
    { name: "users", rows: 1284 },
    { name: "orders", rows: 5621 },
    { name: "products", rows: 342 },
    { name: "sessions", rows: 892 },
    { name: "audit_logs", rows: 15420 },
  ]

  return (
    <aside
      className="hidden lg:flex w-60 flex-col shrink-0 select-none overflow-y-auto"
      style={{ background: L.bgSidebar, borderRight: `1px solid ${L.border}` }}
    >
      {/* Database header */}
      <div className="px-3 py-3" style={{ borderBottom: `1px solid ${L.border}` }}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: L.bgAccent }}
          >
            <Database className="w-4 h-4" style={{ color: L.textAccent }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: L.text }}>customer-db</p>
            <p className="text-[10px]" style={{ color: L.textMuted }}>PostgreSQL 15</p>
          </div>
          <button
            className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ color: L.textMuted }}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div
        className="px-3 py-2.5 grid grid-cols-2 gap-2 text-center"
        style={{ borderBottom: `1px solid ${L.border}` }}
      >
        <div className="p-2 rounded" style={{ background: L.bgCard }}>
          <p className="text-[10px]" style={{ color: L.textMuted }}>Tables</p>
          <p className="text-sm font-medium" style={{ color: L.text }}>5</p>
        </div>
        <div className="p-2 rounded" style={{ background: L.bgCard }}>
          <p className="text-[10px]" style={{ color: L.textMuted }}>Size</p>
          <p className="text-sm font-medium" style={{ color: L.text }}>24 MB</p>
        </div>
      </div>

      {/* Tables list */}
      <div className="flex-1 py-2">
        <div className="px-3 py-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: L.textMuted }}>
            Tables
          </span>
          <button className="w-5 h-5 rounded flex items-center justify-center" style={{ color: L.textMuted }}>
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="flex flex-col">
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => onTableSelect(table.name)}
              className="flex items-center gap-2 px-3 py-2 text-sm transition-colors"
              style={{
                color: activeTable === table.name ? L.text : L.textSecondary,
                background: activeTable === table.name ? L.bgActive : "transparent",
                fontWeight: activeTable === table.name ? 500 : 400,
              }}
            >
              <Table className="w-3.5 h-3.5 shrink-0" style={{ color: activeTable === table.name ? L.textAccent : L.textMuted }} />
              <span className="font-mono text-xs truncate flex-1 text-left">{table.name}</span>
              <span className="text-[10px]" style={{ color: L.textMuted }}>{table.rows.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Connection info */}
      <div className="px-3 py-3" style={{ borderTop: `1px solid ${L.border}` }}>
        <button
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md transition-colors text-left"
          style={{ background: L.bgCard, border: `1px solid ${L.borderSoft}` }}
        >
          <Key className="w-3.5 h-3.5" style={{ color: L.textMuted }} />
          <span className="text-xs" style={{ color: L.textSecondary }}>Connection String</span>
          <ChevronRight className="w-3 h-3 ml-auto" style={{ color: L.textMuted }} />
        </button>
      </div>
    </aside>
  )
}

// --- SQL Query Editor (light) ---
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
    <div style={{ borderBottom: `1px solid ${L.border}` }}>
      {/* Editor toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: L.bgSidebar, borderBottom: `1px solid ${L.border}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: L.text }}>Query Editor</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ background: L.bgHover, color: L.textSecondary }}
          >
            SQL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs transition-colors" style={{ color: L.textMuted }}>
            <HelpCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Help</span>
          </button>
          <button
            onClick={onRun}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
            style={{ background: L.textAccent, color: "#ffffff" }}
          >
            {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            <span>{running ? "Running..." : "Run Query"}</span>
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-36 p-4 font-mono text-xs resize-none focus:outline-none leading-relaxed"
          style={{ background: L.bgCard, color: L.text }}
          spellCheck={false}
        />
        <div className="absolute bottom-2 right-3 flex items-center gap-2 text-[10px]" style={{ color: L.textMuted }}>
          <span>Ln 10, Col 1</span>
          <span>|</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  )
}

// --- Results Table (light) ---
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
      <div className="flex-1 flex items-center justify-center" style={{ background: L.bgCard }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: L.textAccent }} />
          <p className="text-xs" style={{ color: L.textMuted }}>Executing query...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: L.bgCard }}>
      {/* Results header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{ background: L.bgSidebar, borderBottom: `1px solid ${L.border}` }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium" style={{ color: L.text }}>Results</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ background: L.bgSuccess, color: L.textSuccess }}
          >
            5 rows
          </span>
          <span className="text-[10px]" style={{ color: L.textMuted }}>in 42ms</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-xs transition-colors" style={{ color: L.textMuted }}>
            <RefreshCw className="w-3 h-3" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: copied ? L.textSuccess : L.textMuted }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead style={{ background: L.bgSidebar }}>
            <tr style={{ borderBottom: `1px solid ${L.border}` }}>
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-2.5 font-medium font-mono"
                  style={{ color: L.textSecondary }}
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
                style={{ borderBottom: `1px solid ${L.borderSoft}` }}
              >
                <td className="px-4 py-2.5" style={{ color: L.textAccent }}>{row.id}</td>
                <td className="px-4 py-2.5" style={{ color: L.text }}>{row.email}</td>
                <td className="px-4 py-2.5" style={{ color: L.textMuted }}>{row.created_at}</td>
                <td className="px-4 py-2.5" style={{ color: L.text }}>{row.order_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Schema panel (light) ---
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
    <aside
      className="hidden xl:flex w-72 flex-col shrink-0 overflow-y-auto select-none"
      style={{ background: L.bgCard, borderLeft: `1px solid ${L.border}` }}
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${L.border}` }}
      >
        <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: L.textMuted }}>
          Schema: {table}
        </h3>
        <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: L.textMuted }}>
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Columns */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: L.textMuted }}>
            Columns
          </span>
          <span className="text-[10px]" style={{ color: L.textMuted }}>({columns.length})</span>
        </div>
        <div className="flex flex-col gap-1">
          {columns.map((col) => (
            <div
              key={col.name}
              className="flex items-center gap-2 px-2.5 py-2 rounded transition-colors"
              style={{ background: L.bgSidebar }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs" style={{ color: L.text }}>{col.name}</span>
                  {col.primary && <Key className="w-3 h-3" style={{ color: L.textYellow }} />}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono" style={{ color: L.textAccent }}>{col.type}</span>
                  {!col.nullable && (
                    <span className="text-[10px]" style={{ color: L.textMuted }}>NOT NULL</span>
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
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: L.textMuted }}>
            Indexes
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded" style={{ background: L.bgSidebar }}>
            <Zap className="w-3 h-3 shrink-0" style={{ color: L.textYellow }} />
            <span className="font-mono text-[11px] truncate" style={{ color: L.text }}>{table}_pkey</span>
          </div>
          {table === "users" && (
            <div className="flex items-center gap-2 px-2.5 py-2 rounded" style={{ background: L.bgSidebar }}>
              <Zap className="w-3 h-3 shrink-0" style={{ color: L.textAccent }} />
              <span className="font-mono text-[11px] truncate" style={{ color: L.text }}>users_email_idx</span>
            </div>
          )}
        </div>
      </div>

      {/* RLS */}
      <div className="px-3 py-3 mt-auto" style={{ borderTop: `1px solid ${L.border}` }}>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-3.5 h-3.5" style={{ color: L.textMuted }} />
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: L.textMuted }}>
            Row Level Security
          </span>
        </div>
        <div
          className="flex items-center gap-2 px-2.5 py-2 rounded"
          style={{ background: L.bgWarning, border: `1px solid #fde68a` }}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" style={{ color: L.textWarning }} />
          <span className="text-[11px]" style={{ color: L.textWarning }}>RLS not enabled</span>
        </div>
        <button
          className="w-full mt-2 text-xs text-left transition-colors"
          style={{ color: L.textAccent }}
        >
          Enable RLS policies
        </button>
      </div>
    </aside>
  )
}

// --- Main content area (light) ---
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
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ background: L.bg }}>
      {/* Sub nav */}
      <div
        className="flex items-center gap-1 px-4 py-2 shrink-0"
        style={{ background: L.bgCard, borderBottom: `1px solid ${L.border}` }}
      >
        <div className="flex items-center gap-1 mr-4">
          {["Query", "Data", "Migrations", "Backups"].map((tab) => (
            <span
              key={tab}
              className="px-3 py-1.5 text-xs rounded-md cursor-default transition-colors"
              style={{
                color: tab === "Query" ? L.text : L.textSecondary,
                background: tab === "Query" ? L.bgHover : "transparent",
                fontWeight: tab === "Query" ? 500 : 400,
              }}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative hidden sm:block">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: L.textMuted }}
          />
          <input
            type="text"
            placeholder="Search tables..."
            className="w-44 h-8 pl-8 pr-3 rounded-md text-xs focus:outline-none focus:ring-1"
            style={{
              background: L.bgSidebar,
              border: `1px solid ${L.border}`,
              color: L.text,
            }}
          />
        </div>
      </div>

      {/* Query + Results */}
      <div className="flex-1 flex flex-col min-h-0">
        <QueryEditor onRun={handleRun} running={running} />
        {hasRun ? (
          <ResultsTable loading={running} />
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ background: L.bgCard }}>
            <div className="flex flex-col items-center gap-2">
              <Play className="w-8 h-8" style={{ color: L.textMuted }} />
              <p className="text-sm" style={{ color: L.textMuted }}>Run a query to see results</p>
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
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none" style={{ background: L.bg }}>
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <StorageSidebar activeTable={activeTable} onTableSelect={setActiveTable} />
        <MainContent activeTable={activeTable} />
        <SchemaPanel table={activeTable} />
      </div>
    </div>
  )
}
