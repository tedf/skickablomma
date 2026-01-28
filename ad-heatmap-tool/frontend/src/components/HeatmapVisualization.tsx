"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Download, Eye, MousePointer } from "lucide-react";

interface HeatmapVisualizationProps {
  originalImageUrl: string;
  attentionHeatmapUrl?: string;
  clickHeatmapUrl?: string;
  imageWidth: number;
  imageHeight: number;
}

export function HeatmapVisualization({
  originalImageUrl,
  attentionHeatmapUrl,
  clickHeatmapUrl,
  imageWidth,
  imageHeight,
}: HeatmapVisualizationProps) {
  const [showAttention, setShowAttention] = useState(true);
  const [showClicks, setShowClicks] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.6);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw original image
    const originalImg = new Image();
    originalImg.crossOrigin = "anonymous";
    originalImg.src = originalImageUrl;
    await new Promise((resolve) => (originalImg.onload = resolve));
    ctx.drawImage(originalImg, 0, 0, imageWidth, imageHeight);

    // Draw heatmap overlay
    const heatmapUrl = showAttention ? attentionHeatmapUrl : clickHeatmapUrl;
    if (heatmapUrl) {
      ctx.globalAlpha = heatmapOpacity;
      const heatmapImg = new Image();
      heatmapImg.crossOrigin = "anonymous";
      heatmapImg.src = heatmapUrl;
      await new Promise((resolve) => (heatmapImg.onload = resolve));
      ctx.drawImage(heatmapImg, 0, 0, imageWidth, imageHeight);
    }

    // Download
    const link = document.createElement("a");
    link.download = `ad-heatmap-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const activeHeatmapUrl = showAttention
    ? attentionHeatmapUrl
    : showClicks
    ? clickHeatmapUrl
    : null;

  return (
    <div className="space-y-4 animate-reveal-heatmap">
      {/* Image with heatmap overlay */}
      <div
        ref={containerRef}
        className="relative rounded-lg overflow-hidden shadow-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]"
      >
        <img
          src={originalImageUrl}
          alt="Your ad"
          className="w-full h-auto"
          style={{ aspectRatio: `${imageWidth}/${imageHeight}` }}
        />

        {activeHeatmapUrl && (
          <img
            src={activeHeatmapUrl}
            alt={showAttention ? "Attention heatmap" : "Click heatmap"}
            className="absolute inset-0 w-full h-full transition-opacity duration-250"
            style={{
              opacity: heatmapOpacity,
              mixBlendMode: "multiply"
            }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[hsl(var(--muted))]/50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4">
          {/* Attention toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch
              checked={showAttention}
              onCheckedChange={(checked) => {
                setShowAttention(checked);
                if (checked) setShowClicks(false);
              }}
            />
            <span className="flex items-center gap-1.5 text-sm">
              <Eye className="w-4 h-4" />
              Attention
            </span>
          </label>

          {/* Clicks toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch
              checked={showClicks}
              onCheckedChange={(checked) => {
                setShowClicks(checked);
                if (checked) setShowAttention(false);
              }}
            />
            <span className="flex items-center gap-1.5 text-sm">
              <MousePointer className="w-4 h-4" />
              Clicks
            </span>
          </label>

          {/* Opacity slider */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[hsl(var(--muted-foreground))]">Intensity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
              className="w-20 h-2 rounded-lg appearance-none cursor-pointer bg-[hsl(var(--border))]"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-r from-blue-500 to-cyan-500" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-r from-green-500 to-yellow-500" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 rounded-sm bg-gradient-to-r from-orange-500 to-red-500" />
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
