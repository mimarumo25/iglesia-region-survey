import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/15 text-primary hover:bg-primary/25 dark:bg-primary/20 dark:border-primary/40",
        secondary:
          "border-secondary/30 bg-secondary/15 text-secondary hover:bg-secondary/25 dark:bg-secondary/20 dark:border-secondary/40",
        destructive:
          "border-destructive/30 bg-destructive/15 text-destructive hover:bg-destructive/25 dark:bg-destructive/20 dark:border-destructive/40",
        outline: "text-foreground border-border hover:bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
