import { cn } from "@/lib/utils"

type StatusType = "pending" | "in-progress" | "completed" | "failed"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-primary/20 text-primary",
  },
  completed: {
    label: "Completed",
    className: "bg-success/20 text-success",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/20 text-destructive",
  },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
