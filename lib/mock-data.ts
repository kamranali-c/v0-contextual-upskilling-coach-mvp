// Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  optedIn: boolean
  preferences: UserPreferences
}

export interface UserPreferences {
  contextualPromptsEnabled: boolean
  snoozeUntil: Date | null
  notificationFrequency: "minimal" | "balanced" | "frequent"
  learningStyle: "quick-fix" | "deeper-learning" | "mixed"
}

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "failed"
  category: string
  triggerType?: string
}

export interface ActivityEvent {
  id: string
  action: string
  description: string
  timestamp: Date
  taskId?: string
  triggersPrompt?: boolean
}

export interface ContextualTrigger {
  id: string
  type: "retry" | "new-feature" | "repeated-action" | "setup" | "error"
  title: string
  description: string
  promptMessage: string
  actionCount?: number
}

export interface LearningRecommendation {
  id: string
  title: string
  description: string
  estimatedTime: string
  relevanceLabel: string
  steps: LearningStep[]
  category: string
}

export interface LearningStep {
  id: string
  title: string
  description: string
  type: "explanation" | "action" | "practice" | "resource"
  completed: boolean
  content?: string
}

export interface ProgressStats {
  creditsEarned: number
  completedSessions: number
  currentStreak: number
  activeRecommendations: number
  totalLearningMinutes: number
}

export interface CoachQuestion {
  id: string
  question: string
  options: { label: string; value: string }[]
  type: "single" | "multi"
}

// Mock Data
export const mockUser: User = {
  id: "user-1",
  name: "Alex Chen",
  email: "alex.chen@company.com",
  optedIn: true,
  preferences: {
    contextualPromptsEnabled: true,
    snoozeUntil: null,
    notificationFrequency: "balanced",
    learningStyle: "mixed",
  },
}

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Configure deployment settings",
    description: "Set up production deployment configuration for the main application",
    status: "in-progress",
    category: "Deployment",
    triggerType: "setup",
  },
  {
    id: "task-2",
    title: "Debug failed deployment",
    description: "Investigate and fix the deployment failure on staging environment",
    status: "failed",
    category: "Deployment",
    triggerType: "error",
  },
  {
    id: "task-3",
    title: "Set up environment variables",
    description: "Configure environment variables for the new microservice",
    status: "pending",
    category: "Configuration",
    triggerType: "setup",
  },
  {
    id: "task-4",
    title: "Review feature flags",
    description: "Review and update feature flag configurations",
    status: "completed",
    category: "Configuration",
  },
  {
    id: "task-5",
    title: "Enable new monitoring feature",
    description: "Turn on the new APM monitoring capabilities",
    status: "pending",
    category: "Monitoring",
    triggerType: "new-feature",
  },
]

export const mockActivityEvents: ActivityEvent[] = [
  {
    id: "event-1",
    action: "Opened deployment settings",
    description: "Viewed production deployment configuration",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    taskId: "task-1",
    triggersPrompt: true,
  },
  {
    id: "event-2",
    action: "Retried deployment",
    description: "Attempted to redeploy staging environment",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    taskId: "task-2",
    triggersPrompt: true,
  },
  {
    id: "event-3",
    action: "Viewed logs",
    description: "Checked application logs for errors",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    taskId: "task-2",
  },
  {
    id: "event-4",
    action: "Completed task",
    description: "Finished feature flag review",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    taskId: "task-4",
  },
]

export const mockTriggers: Record<string, ContextualTrigger> = {
  "deployment-setup": {
    id: "trigger-1",
    type: "setup",
    title: "Deployment Setup",
    description: "User is configuring deployment settings",
    promptMessage: "Want a 2-minute guide for deployment configuration?",
  },
  "deployment-retry": {
    id: "trigger-2",
    type: "retry",
    title: "Repeated Retries",
    description: "User has retried this action multiple times",
    promptMessage: "You've retried this step a few times. Want targeted help?",
    actionCount: 3,
  },
  "new-feature": {
    id: "trigger-3",
    type: "new-feature",
    title: "New Feature",
    description: "User is exploring a new feature",
    promptMessage: "This feature is new. Want a quick walkthrough?",
  },
  "env-setup": {
    id: "trigger-4",
    type: "setup",
    title: "Environment Setup",
    description: "User is setting up environment variables",
    promptMessage: "Looks like you're configuring environments. Want a quick guide?",
  },
  "error-debug": {
    id: "trigger-5",
    type: "error",
    title: "Error Debugging",
    description: "User is investigating an error",
    promptMessage: "Need help debugging this deployment issue?",
  },
}

export const mockCoachQuestions: CoachQuestion[] = [
  {
    id: "q-1",
    question: "What are you trying to accomplish?",
    options: [
      { label: "Fix an immediate issue", value: "fix" },
      { label: "Learn how this works", value: "learn" },
      { label: "Set up something new", value: "setup" },
      { label: "Optimize existing config", value: "optimize" },
    ],
    type: "single",
  },
  {
    id: "q-2",
    question: "How confident do you feel with this task?",
    options: [
      { label: "New to me", value: "beginner" },
      { label: "Somewhat familiar", value: "intermediate" },
      { label: "Just need a refresher", value: "advanced" },
    ],
    type: "single",
  },
  {
    id: "q-3",
    question: "What type of guidance would you prefer?",
    options: [
      { label: "Quick fix", value: "quick" },
      { label: "Step-by-step walkthrough", value: "detailed" },
      { label: "Deeper understanding", value: "deep" },
    ],
    type: "single",
  },
  {
    id: "q-4",
    question: "How much time do you have right now?",
    options: [
      { label: "2 minutes", value: "2min" },
      { label: "5 minutes", value: "5min" },
      { label: "10+ minutes", value: "10min" },
    ],
    type: "single",
  },
]

export const mockLearningRecommendations: LearningRecommendation[] = [
  {
    id: "rec-1",
    title: "Deployment Configuration Basics",
    description: "Learn the essential deployment settings for production environments",
    estimatedTime: "3 min",
    relevanceLabel: "Based on your current activity",
    category: "Deployment",
    steps: [
      {
        id: "step-1",
        title: "Understanding deployment targets",
        description: "Learn about production, staging, and preview environments",
        type: "explanation",
        completed: false,
        content:
          "Deployment targets define where your application runs. Production is your live environment, staging mirrors production for testing, and preview creates temporary URLs for each commit.",
      },
      {
        id: "step-2",
        title: "Configure your build settings",
        description: "Set up the correct build command and output directory",
        type: "action",
        completed: false,
        content: "Navigate to your project settings and verify the build command matches your framework.",
      },
      {
        id: "step-3",
        title: "Practice: Review your current config",
        description: "Check your deployment configuration against best practices",
        type: "practice",
        completed: false,
      },
      {
        id: "step-4",
        title: "Additional resources",
        description: "Deep dive into advanced deployment strategies",
        type: "resource",
        completed: false,
      },
    ],
  },
  {
    id: "rec-2",
    title: "Debugging Failed Deployments",
    description: "Systematic approach to identifying and fixing deployment failures",
    estimatedTime: "5 min",
    relevanceLabel: "Recommended for your recent error",
    category: "Troubleshooting",
    steps: [
      {
        id: "step-1",
        title: "Reading deployment logs",
        description: "How to find and interpret error messages in logs",
        type: "explanation",
        completed: false,
        content:
          "Deployment logs contain timestamps, build steps, and error details. Look for lines starting with 'Error:' or exit codes other than 0.",
      },
      {
        id: "step-2",
        title: "Common failure patterns",
        description: "Recognize the most frequent causes of deployment failures",
        type: "explanation",
        completed: false,
        content:
          "Most failures come from: missing dependencies, incorrect build commands, environment variable issues, or memory limits.",
      },
      {
        id: "step-3",
        title: "Fix the issue",
        description: "Apply the recommended solution to your deployment",
        type: "action",
        completed: false,
      },
      {
        id: "step-4",
        title: "Verify the fix",
        description: "Redeploy and confirm the issue is resolved",
        type: "practice",
        completed: false,
      },
    ],
  },
]

export const mockProgressStats: ProgressStats = {
  creditsEarned: 145,
  completedSessions: 12,
  currentStreak: 3,
  activeRecommendations: 2,
  totalLearningMinutes: 47,
}

export const mockCompletedSessions = [
  {
    id: "session-1",
    title: "Environment Variables Setup",
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    creditsEarned: 15,
    duration: "4 min",
  },
  {
    id: "session-2",
    title: "Git Integration Basics",
    completedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    creditsEarned: 10,
    duration: "3 min",
  },
  {
    id: "session-3",
    title: "Preview Deployments",
    completedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    creditsEarned: 20,
    duration: "6 min",
  },
]
