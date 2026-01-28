"use client";

import React from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import { BulletReport } from "@/components/BulletReport";
import { InsightCard } from "@/components/InsightCard";
import { ProcessingState } from "@/components/ProcessingState";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAnalysis } from "@/hooks/useAnalysis";
import { AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const {
    result,
    isLoading,
    error,
    progress,
    statusMessage,
    analyzeImage,
    reset,
  } = useAnalysis();

  const handleImageUpload = async (file: File) => {
    await analyzeImage(file);
  };

  const showResults = result?.status === "completed" && result.analysis;

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
              <h1 className="text-xl font-semibold">Ad Heatmap Analyzer</h1>
            </div>
            {showResults && (
              <Button variant="outline" size="sm" onClick={reset}>
                Analyze New Ad
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Upload Section */}
        {!showResults && !isLoading && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Analyze Your Digital Ad
              </h2>
              <p className="text-[hsl(var(--muted-foreground))]">
                Upload your ad to get AI-powered attention and click predictions
                with actionable insights.
              </p>
            </div>
            <ImageUpload
              onImageUpload={handleImageUpload}
              isUploading={isLoading}
            />
          </div>
        )}

        {/* Processing State */}
        {isLoading && (
          <ProcessingState progress={progress} statusMessage={statusMessage} />
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 p-4 bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--destructive))]" />
              <div>
                <p className="font-medium text-sm">Analysis Failed</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {error}
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={reset}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && result.analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Heatmap Visualization */}
            <div>
              <HeatmapVisualization
                originalImageUrl={result.image.original_url}
                attentionHeatmapUrl={result.heatmaps?.attention.url}
                clickHeatmapUrl={result.heatmaps?.clicks.url}
                imageWidth={result.image.width}
                imageHeight={result.image.height}
              />
            </div>

            {/* Right: Bullet Report + Insights */}
            <div className="space-y-6">
              {/* Bullet Report Card */}
              <BulletReport report={result.analysis.bullet_report} />

              {/* Detailed Insights (collapsible) */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-sm font-medium">
                    View Detailed Analysis ({result.analysis.insights.length}{" "}
                    insights)
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pb-2">
                      {result.analysis.insights.map((insight, index) => (
                        <InsightCard
                          key={insight.id}
                          insight={insight}
                          index={index}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Estimated CTR */}
              {result.estimated_ctr !== undefined && (
                <div className="text-center p-4 bg-[hsl(var(--muted))]/50 rounded-lg">
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    Estimated Click-Through Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {result.estimated_ctr.toFixed(1)}%
                  </p>
                  {result.benchmark_percentile !== undefined && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Better than {result.benchmark_percentile}% of similar ads
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
            Powered by AI attention prediction models and eye-tracking research
          </p>
        </div>
      </footer>
    </main>
  );
}
