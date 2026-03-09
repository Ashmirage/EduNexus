"use client";

import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatRelativeTime, formatAbsoluteTime } from "@/lib/utils/time-format";

interface TimestampProps {
  date: Date | string;
  showIcon?: boolean;
  className?: string;
  relative?: boolean;
}

export function Timestamp({ date, showIcon = true, className = "", relative = true }: TimestampProps) {
  const displayTime = relative ? formatRelativeTime(date) : formatAbsoluteTime(date);
  const tooltipTime = formatAbsoluteTime(date);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 text-xs text-muted-foreground cursor-help ${className}`}>
            {showIcon && <Clock className="h-3 w-3" />}
            <span>{displayTime}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltipTime}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface TimeRangeProps {
  createdAt: Date | string;
  updatedAt: Date | string;
  className?: string;
}

export function TimeRange({ createdAt, updatedAt, className = "" }: TimeRangeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 text-xs text-muted-foreground cursor-help ${className}`}>
            <Clock className="h-3 w-3" />
            <span>{formatRelativeTime(updatedAt)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <div>创建: {formatAbsoluteTime(createdAt)}</div>
            <div>更新: {formatAbsoluteTime(updatedAt)}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
