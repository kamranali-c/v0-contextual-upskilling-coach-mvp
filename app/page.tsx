import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Clock,
  Eye,
  BellOff,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">Contextual Upskilling Coach</span>
            </div>
            <nav className="hidden sm:flex items-center gap-6">
              <Link
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works
              </Link>
              <Link
                href="#principles"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Principles
              </Link>
              <Button asChild>
                <Link href="/demo">
                  Open Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </nav>
            <Button asChild className="sm:hidden">
              <Link href="/demo">Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Opt-in, privacy-first learning</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight text-balance">
            Learn in the flow of
            <span className="text-primary"> your work</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Get relevant upskilling guidance exactly when you need it. No separate
            learning platform. No context switching. Just helpful tips that appear
            while you work.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/demo">
                View Demo Workspace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Contextually Relevant</CardTitle>
                <CardDescription>
                  Suggestions appear based on what you are actually doing, not generic
                  training schedules.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Short and Focused</CardTitle>
                <CardDescription>
                  Learning journeys take 2-5 minutes. Get back to work quickly with new
                  knowledge.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">AI-Personalized</CardTitle>
                <CardDescription>
                  The coach adapts to your experience level, time available, and learning
                  preferences.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              A simple flow that fits naturally into your workday
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {[
              {
                step: "1",
                title: "You opt in to contextual learning",
                description:
                  "Choose to receive learning suggestions. You stay in control at all times.",
              },
              {
                step: "2",
                title: "Continue working as normal",
                description:
                  "Use your tools and platforms. The coach watches for relevant learning moments.",
              },
              {
                step: "3",
                title: "A prompt appears when relevant",
                description:
                  "When the system detects an opportunity, a small non-blocking prompt appears.",
              },
              {
                step: "4",
                title: "Accept, snooze, or dismiss",
                description:
                  "Choose to start learning, postpone, or skip entirely. No pressure.",
              },
              {
                step: "5",
                title: "Complete a short learning journey",
                description:
                  "If you accept, the AI coach guides you through a quick, tailored lesson.",
              },
              {
                step: "6",
                title: "Return to your task with new skills",
                description:
                  "Apply what you learned immediately. Progress is tracked automatically.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section id="principles" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our principles</h2>
            <p className="mt-3 text-muted-foreground">
              Built to be helpful, never intrusive
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4 p-5 rounded-xl bg-card border border-border">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Clearly opt-in</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You explicitly choose to receive suggestions. Never forced on anyone.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl bg-card border border-border">
              <BellOff className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Easy to ignore</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Prompts are non-blocking and can be dismissed with a single click.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl bg-card border border-border">
              <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Easy to snooze</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Not the right time? Snooze for an hour, a day, or a week.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl bg-card border border-border">
              <Eye className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Transparent data use</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  See exactly what triggers suggestions. Nothing hidden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to see it in action?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Try the interactive demo to experience contextual upskilling firsthand.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/demo">
              Open Demo Workspace
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Contextual Upskilling Coach</span>
          </div>
          <p className="text-sm text-muted-foreground">
            A product demo. No real data is collected.
          </p>
        </div>
      </footer>
    </div>
  )
}
