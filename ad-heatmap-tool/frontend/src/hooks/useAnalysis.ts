"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { AnalysisResult } from "@/types/analysis";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface UseAnalysisOptions {
  pollingInterval?: number;
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const { pollingInterval = 1000 } = options;

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const pollStatus = useCallback(
    async (jobId: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/analyze/${jobId}`, {
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to get analysis status: ${response.statusText}`);
        }

        const data: AnalysisResult = await response.json();

        // Update progress based on status
        if (data.status === "pending") {
          setProgress(10);
          setStatusMessage("Queued for processing...");
        } else if (data.status === "processing") {
          setProgress((prev) => Math.min(prev + 10, 90));
          setStatusMessage("Analyzing attention patterns...");
        } else if (data.status === "completed") {
          setProgress(100);
          setStatusMessage("Analysis complete!");
          setResult(data);
          setIsLoading(false);
          clearPolling();
        } else if (data.status === "failed") {
          setError(data.error || "Analysis failed");
          setIsLoading(false);
          clearPolling();
        }

        return data;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return null;
        }
        throw err;
      }
    },
    [clearPolling]
  );

  const analyzeImage = useCallback(
    async (file: File) => {
      // Reset state
      setResult(null);
      setError(null);
      setProgress(0);
      setStatusMessage("Uploading image...");
      setIsLoading(true);

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      clearPolling();

      try {
        // Upload image
        const formData = new FormData();
        formData.append("image", file);

        setProgress(5);
        setStatusMessage("Uploading image...");

        const uploadResponse = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
          method: "POST",
          body: formData,
          signal: abortControllerRef.current.signal,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(errorData.detail || `Upload failed: ${uploadResponse.statusText}`);
        }

        const { job_id } = await uploadResponse.json();

        setProgress(15);
        setStatusMessage("Processing your ad...");

        // Start polling for results
        pollingRef.current = setInterval(() => {
          pollStatus(job_id);
        }, pollingInterval);

        // Initial poll
        pollStatus(job_id);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
        clearPolling();
      }
    },
    [pollStatus, pollingInterval, clearPolling]
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    clearPolling();
    setResult(null);
    setError(null);
    setProgress(0);
    setStatusMessage("");
    setIsLoading(false);
  }, [clearPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      clearPolling();
    };
  }, [clearPolling]);

  return {
    result,
    isLoading,
    error,
    progress,
    statusMessage,
    analyzeImage,
    reset,
  };
}
