"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Insight } from "@/types/analysis";
import {
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Info,
  ExternalLink,
} from "lucide-react";

interface InsightCardProps {
  insight: Insight;
  index: number;
}

function getInsightIcon(type: Insight["type"]) {
  switch (type) {
    case "warning":
      return AlertTriangle;
    case "suggestion":
      return Lightbulb;
    case "success":
      return CheckCircle;
    case "info":
      return Info;
  }
}

function getInsightStyles(type: Insight["type"]) {
  switch (type) {
    case "warning":
      return {
        bg: "bg-[hsl(var(--destructive))]/10",
        border: "border-[hsl(var(--destructive))]/20",
        icon: "text-[hsl(var(--destructive))]",
        badge: "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]",
      };
    case "suggestion":
      return {
        bg: "bg-[hsl(var(--warning))]/10",
        border: "border-[hsl(var(--warning))]/20",
        icon: "text-[hsl(var(--warning))]",
        badge: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
      };
    case "success":
      return {
        bg: "bg-[hsl(var(--success))]/10",
        border: "border-[hsl(var(--success))]/20",
        icon: "text-[hsl(var(--success))]",
        badge: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
      };
    case "info":
      return {
        bg: "bg-[hsl(var(--primary))]/10",
        border: "border-[hsl(var(--primary))]/20",
        icon: "text-[hsl(var(--primary))]",
        badge: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
      };
  }
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const Icon = getInsightIcon(insight.type);
  const styles = getInsightStyles(insight.type);

  return (
    <div
      className={cn(
        "p-4 rounded-lg border animate-slide-in-up",
        styles.bg,
        styles.border
      )}
      style={{ animationDelay: `${100 + index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", styles.icon)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-medium text-sm">{insight.title}</h4>
            {insight.severity === "high" && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full",
                  styles.badge
                )}
              >
                High Priority
              </span>
            )}
          </div>

          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
            {insight.description}
          </p>

          <p className="text-sm font-medium">
            {insight.actionable}
          </p>

          {insight.research_link && (
            <a
              href={insight.research_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-[hsl(var(--primary))] hover:underline"
            >
              Learn more <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {insight.score_impact !== undefined && insight.score_impact > 0 && (
            <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
              Fixing this could improve your score by{" "}
              <span className="font-medium text-[hsl(var(--success))]">
                +{insight.score_impact} points
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
