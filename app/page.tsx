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
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm">
        <p className="text-[11px] text-accent font-medium tracking-wide">
          Concept Demo — Contextual Upskilling Coach
        </p>
      </div>
    </main>
  )
}
