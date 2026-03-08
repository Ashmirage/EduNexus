import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description: string;
  tags?: string[];
  actions?: ReactNode;
  metaLabel?: string;
  statusLabel?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  tags = [],
  actions,
  metaLabel = "EduNexus · Web 学习生态",
  statusLabel = "系统在线",
  className
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-6 mb-12 animate-in", className)}>
      {/* Meta 信息 */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="status-dot online" />
          <span className="text-muted-foreground font-medium">{metaLabel}</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <Badge variant="secondary" className="badge-success">
          {statusLabel}
        </Badge>
      </div>

      {/* 主标题区 */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {description}
            </p>
          </div>

          {actions && (
            <div className="flex gap-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* 标签 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  "feature-chip",
                  index === 0 && "badge-primary"
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator className="divider" />
    </header>
  );
}
