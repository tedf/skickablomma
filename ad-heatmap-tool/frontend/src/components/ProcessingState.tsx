"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProcessingStateProps {
  progress: number;
  statusMessage: string;
  className?: string;
}

export function ProcessingState({
  progress,
  statusMessage,
  className,
}: ProcessingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px]",
        className
      )}
    >
      {/* Animated spinner */}
      <div className="w-16 h-16 border-4 border-[hsl(var(--primary))]/20 border-t-[hsl(var(--primary))] rounded-full animate-spin mb-4" />

      <p className="text-lg font-medium mb-2">Analyzing your ad...</p>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 text-center max-w-xs">
        {statusMessage}
      </p>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
        <div
          className="h-full bg-[hsl(var(--primary))] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
        {progress}% complete
      </p>
    </div>
  );
}
