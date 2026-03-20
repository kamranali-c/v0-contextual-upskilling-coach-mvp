import { FakeWorkspace } from "@/components/fake-workspace"
import { AssistantPopup } from "@/components/assistant-popup"

export default function DemoPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      {/* Background layer -- fake Vercel-style working session */}
      <FakeWorkspace />

      {/* Foreground layer -- floating Grok coach popup */}
      <AssistantPopup />
    </main>
  )
}
