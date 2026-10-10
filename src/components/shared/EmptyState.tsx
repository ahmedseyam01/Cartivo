import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center", className)}>
      <span className="bg-muted mb-5 flex size-14 items-center justify-center rounded-full">
        <Icon className="size-6" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-muted-foreground mt-1.5 max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
