export interface BulletReport {
  overall_score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  whats_working: string[];
  suggested_improvements: string[];
  priority_fix?: string;
}

export interface Insight {
  id: string;
  type: "warning" | "suggestion" | "success" | "info";
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  actionable: string;
  research_link?: string;
  score_impact?: number;
}

export interface DetectedElement {
  box: [number, number, number, number]; // [x, y, width, height]
  label: string;
  confidence: number;
}

export interface Face extends DetectedElement {
  gaze_direction: [number, number];
}

export interface TextRegion extends DetectedElement {
  text: string;
  type: "headline" | "body" | "cta";
}

export interface CTARegion extends DetectedElement {
  text: string;
  prominence: number;
}

export interface Heatmap {
  url: string;
  confidence: number;
}

export interface AnalysisScores {
  visual_hierarchy: number;
  attention_distribution: number;
  cta_effectiveness: number;
  mobile_readiness: number;
  text_clarity: number;
  color_contrast: number;
}

export interface DetectedElements {
  faces: Face[];
  text_regions: TextRegion[];
  ctas: CTARegion[];
  logos: DetectedElement[];
}

export interface AnalysisResult {
  job_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  processing_time_ms?: number;
  image: {
    original_url: string;
    width: number;
    height: number;
  };
  heatmaps?: {
    attention: Heatmap;
    clicks: Heatmap;
  };
  analysis?: {
    overall_score: number;
    scores: AnalysisScores;
    detected_elements: DetectedElements;
    bullet_report: BulletReport;
    insights: Insight[];
  };
  recommendations?: string[];
  estimated_ctr?: number;
  benchmark_percentile?: number;
  error?: string;
}

export type AnalysisStatus = AnalysisResult["status"];
