from pydantic import BaseModel, Field
from typing import Literal, Optional
from enum import Enum


class AnalysisStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class BoundingBox(BaseModel):
    """Bounding box coordinates [x, y, width, height]."""

    x: int
    y: int
    width: int
    height: int

    def to_list(self) -> list[int]:
        return [self.x, self.y, self.width, self.height]


class DetectedElement(BaseModel):
    """Base class for detected elements."""

    box: list[int] = Field(..., min_length=4, max_length=4)
    label: str
    confidence: float = Field(..., ge=0, le=1)


class Face(DetectedElement):
    """Detected face with gaze direction."""

    gaze_direction: list[float] = Field(default=[0.0, 0.0], min_length=2, max_length=2)


class TextRegion(DetectedElement):
    """Detected text region."""

    text: str
    type: Literal["headline", "body", "cta"]


class CTARegion(DetectedElement):
    """Detected CTA (Call to Action) region."""

    text: str
    prominence: float = Field(..., ge=0, le=1)


class DetectedElements(BaseModel):
    """All detected elements in an image."""

    faces: list[Face] = []
    text_regions: list[TextRegion] = []
    ctas: list[CTARegion] = []
    logos: list[DetectedElement] = []


class Heatmap(BaseModel):
    """Heatmap data."""

    url: str
    confidence: float = Field(..., ge=0, le=1)


class AnalysisScores(BaseModel):
    """Detailed analysis scores."""

    visual_hierarchy: float = Field(..., ge=0, le=100)
    attention_distribution: float = Field(..., ge=0, le=100)
    cta_effectiveness: float = Field(..., ge=0, le=100)
    mobile_readiness: float = Field(..., ge=0, le=100)
    text_clarity: float = Field(..., ge=0, le=100)
    color_contrast: float = Field(..., ge=0, le=100)


class BulletReport(BaseModel):
    """Bullet report summary."""

    overall_score: int = Field(..., ge=0, le=100)
    grade: Literal["A", "B", "C", "D", "F"]
    whats_working: list[str]
    suggested_improvements: list[str]
    priority_fix: Optional[str] = None


class Insight(BaseModel):
    """Individual analysis insight."""

    id: str
    type: Literal["warning", "suggestion", "success", "info"]
    severity: Literal["low", "medium", "high"]
    title: str
    description: str
    actionable: str
    research_link: Optional[str] = None
    score_impact: Optional[int] = None


class ImageInfo(BaseModel):
    """Image information."""

    original_url: str
    width: int
    height: int


class AnalysisData(BaseModel):
    """Complete analysis data."""

    overall_score: int = Field(..., ge=0, le=100)
    scores: AnalysisScores
    detected_elements: DetectedElements
    bullet_report: BulletReport
    insights: list[Insight]


class AnalysisResult(BaseModel):
    """Complete analysis result."""

    job_id: str
    status: AnalysisStatus
    processing_time_ms: Optional[int] = None
    image: ImageInfo
    heatmaps: Optional[dict[str, Heatmap]] = None
    analysis: Optional[AnalysisData] = None
    recommendations: Optional[list[str]] = None
    estimated_ctr: Optional[float] = None
    benchmark_percentile: Optional[int] = None
    error: Optional[str] = None


class UploadResponse(BaseModel):
    """Response for image upload."""

    job_id: str
    message: str = "Image uploaded successfully"
