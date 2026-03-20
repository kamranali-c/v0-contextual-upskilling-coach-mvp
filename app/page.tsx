import { FakeWorkspace } from "@/components/fake-workspace"
import { AssistantPopup } from "@/components/assistant-popup"

export default function DemoPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      {/* Background layer — fake Vercel working session */}
      <FakeWorkspace />

      {/* Foreground layer — floating assistant popup */}
      <AssistantPopup />

      {/* Demo label */}
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full backdrop-blur-sm" style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)" }}>
        <p className="text-[11px] font-medium tracking-wide" style={{ color: "#0d9488" }}>
          FlowState Demo — Contextual Upskilling Coach
        </p>
      </div>
    </main>
  )
}
