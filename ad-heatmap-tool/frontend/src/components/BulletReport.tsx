"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BulletReport as BulletReportType } from "@/types/analysis";
import { CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";

interface BulletReportProps {
  report: BulletReportType;
  className?: string;
}

function AnimatedScore({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span className="font-bold text-4xl tabular-nums">{count}</span>;
}

function getGradeColor(grade: BulletReportType["grade"]) {
  switch (grade) {
    case "A":
      return "text-[hsl(var(--success))]";
    case "B":
      return "text-emerald-500";
    case "C":
      return "text-[hsl(var(--warning))]";
    case "D":
      return "text-orange-500";
    case "F":
      return "text-[hsl(var(--destructive))]";
  }
}

export function BulletReport({ report, className }: BulletReportProps) {
  return (
    <Card className={cn("p-6 animate-reveal-heatmap", className)}>
      {/* Header with score */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Analysis</h3>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <AnimatedScore value={report.overall_score} />
            <span className="text-lg text-[hsl(var(--muted-foreground))]">
              / 100
            </span>
          </div>
          <div
            className={cn(
              "text-3xl font-bold",
              getGradeColor(report.grade)
            )}
          >
            {report.grade}
          </div>
        </div>
      </div>

      {/* What's Working */}
      <div className="mb-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--success))] mb-3">
          <CheckCircle className="w-4 h-4" />
          What&apos;s Working
        </h4>
        <ul className="space-y-2">
          {report.whats_working.map((item, i) => (
            <li
              key={i}
              className="text-sm text-[hsl(var(--muted-foreground))] flex items-start gap-2 animate-slide-in-up"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              <span className="text-[hsl(var(--success))] mt-0.5 shrink-0">
                &bull;
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Improvements */}
      <div className="mb-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--warning))] mb-3">
          <ArrowRight className="w-4 h-4" />
          Suggested Improvements
        </h4>
        <ul className="space-y-2">
          {report.suggested_improvements.map((item, i) => (
            <li
              key={i}
              className="text-sm text-[hsl(var(--muted-foreground))] flex items-start gap-2 animate-slide-in-up"
              style={{
                animationDelay: `${200 + report.whats_working.length * 50 + i * 50}ms`,
              }}
            >
              <span className="text-[hsl(var(--warning))] mt-0.5 shrink-0">
                &bull;
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Priority Fix */}
      {report.priority_fix && (
        <div
          className="p-4 bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 rounded-lg animate-slide-in-up"
          style={{
            animationDelay: `${300 + (report.whats_working.length + report.suggested_improvements.length) * 50}ms`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-[hsl(var(--warning))]" />
            <p className="text-xs font-semibold text-[hsl(var(--warning))] uppercase tracking-wide">
              Priority Fix
            </p>
          </div>
          <p className="text-sm">{report.priority_fix}</p>
        </div>
      )}
    </Card>
  );
}
