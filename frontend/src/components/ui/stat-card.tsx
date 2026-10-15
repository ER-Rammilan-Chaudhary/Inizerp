import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statIconVariants = cva(
  "flex items-center justify-center rounded-2xl shrink-0 transition-transform duration-200 group-hover:scale-105",
  {
    variants: {
      variant: {
        amber: "bg-school-amber-light text-school-amber",
        navy: "bg-school-navy-light text-school-navy",
        blue: "bg-school-blue-light text-school-blue",
        green: "bg-school-green-light text-school-green",
        red: "bg-school-red-light text-school-red",
      },
      size: {
        default: "h-13 w-13 [&_svg]:size-6",
        sm: "h-10 w-10 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "amber",
      size: "default",
    },
  }
);

interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statIconVariants> {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  variant = "amber",
  size = "default",
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border",
        className
      )}
      {...props}
    >
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold tracking-tight text-foreground truncate">
            {value}
          </h3>
          {trend && (
            <span
              className={cn(
                "text-xs font-semibold",
                trend.isPositive !== false ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      <div className={cn(statIconVariants({ variant, size }))}>
        <Icon />
      </div>
    </div>
  );
}
