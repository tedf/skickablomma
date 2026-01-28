"""Main analysis service that orchestrates the full pipeline."""

import time
import uuid
from pathlib import Path
from typing import Optional

from ..core.config import settings
from ..models.analysis import (
    AnalysisResult,
    AnalysisStatus,
    AnalysisData,
    ImageInfo,
    Heatmap,
)
from .image_processor import load_image, ImageData
from .cv_detector import cv_detector, DetectedFace, DetectedText, DetectedCTA
from .heatmap_generator import heatmap_generator
from .insights_generator import (
    generate_bullet_report,
    generate_insights,
    convert_to_model_elements,
    _calculate_scores,
)


# In-memory job storage (in production, use Redis or a database)
_jobs: dict[str, AnalysisResult] = {}


def get_job(job_id: str) -> Optional[AnalysisResult]:
    """Get job status by ID."""
    return _jobs.get(job_id)


def create_job(image_path: Path, original_filename: str) -> str:
    """Create a new analysis job."""
    job_id = uuid.uuid4().hex[:12]

    # Get image dimensions
    image_data = load_image(image_path)

    # Create initial job result
    result = AnalysisResult(
        job_id=job_id,
        status=AnalysisStatus.PENDING,
        image=ImageInfo(
            original_url=f"/static/uploads/{image_path.name}",
            width=image_data.width,
            height=image_data.height,
        ),
    )

    _jobs[job_id] = result

    return job_id


def run_analysis(job_id: str, image_path: Path) -> AnalysisResult:
    """Run the full analysis pipeline."""
    start_time = time.time()

    job = _jobs.get(job_id)
    if not job:
        raise ValueError(f"Job {job_id} not found")

    # Update status to processing
    job.status = AnalysisStatus.PROCESSING
    _jobs[job_id] = job

    try:
        # Load image
        image_data = load_image(image_path)
        image = image_data.array

        # 1. Detect elements
        faces = cv_detector.detect_faces(image)
        text_regions = cv_detector.detect_text(image)
        ctas = cv_detector.detect_ctas(image, text_regions)

        # 2. Determine if F-pattern or Z-pattern is more appropriate
        # (F-pattern for text-heavy, Z-pattern for visual-heavy)
        text_coverage = cv_detector.calculate_text_coverage(text_regions, image.shape)
        use_f_pattern = text_coverage > 0.2

        # 3. Generate attention heatmap
        attention_map, attention_path = heatmap_generator.generate_attention_heatmap(
            image_data, faces, text_regions, use_f_pattern=use_f_pattern
        )

        # 4. Generate click heatmap
        click_map, click_path = heatmap_generator.generate_click_heatmap(
            image_data, attention_map, ctas, text_regions
        )

        # 5. Generate bullet report
        bullet_report = generate_bullet_report(
            image.shape, attention_map, click_map, faces, text_regions, ctas
        )

        # 6. Generate detailed insights
        insights = generate_insights(
            image.shape, attention_map, click_map, faces, text_regions, ctas
        )

        # 7. Calculate scores
        scores = _calculate_scores(image.shape, attention_map, faces, text_regions, ctas)

        # 8. Convert detected elements
        detected_elements = convert_to_model_elements(faces, text_regions, ctas)

        # 9. Generate recommendations
        recommendations = [
            imp for imp in bullet_report.suggested_improvements[:3]
        ]

        # 10. Estimate CTR (simplified heuristic)
        estimated_ctr = _estimate_ctr(bullet_report.overall_score)
        benchmark_percentile = min(bullet_report.overall_score, 99)

        # Calculate processing time
        processing_time_ms = int((time.time() - start_time) * 1000)

        # Update job with results
        job.status = AnalysisStatus.COMPLETED
        job.processing_time_ms = processing_time_ms
        job.heatmaps = {
            "attention": Heatmap(
                url=f"/static/heatmaps/{attention_path.name}",
                confidence=0.8,
            ),
            "clicks": Heatmap(
                url=f"/static/heatmaps/{click_path.name}",
                confidence=0.7,
            ),
        }
        job.analysis = AnalysisData(
            overall_score=bullet_report.overall_score,
            scores=scores,
            detected_elements=detected_elements,
            bullet_report=bullet_report,
            insights=insights,
        )
        job.recommendations = recommendations
        job.estimated_ctr = estimated_ctr
        job.benchmark_percentile = benchmark_percentile

        _jobs[job_id] = job
        return job

    except Exception as e:
        job.status = AnalysisStatus.FAILED
        job.error = str(e)
        _jobs[job_id] = job
        raise


def _estimate_ctr(score: int) -> float:
    """Estimate CTR based on overall score (simplified heuristic)."""
    # Industry average display ad CTR is around 0.35%
    # Good ads can achieve 1-3%
    base_ctr = 0.35
    if score >= 90:
        return base_ctr * 8  # 2.8%
    elif score >= 80:
        return base_ctr * 5  # 1.75%
    elif score >= 70:
        return base_ctr * 3  # 1.05%
    elif score >= 60:
        return base_ctr * 2  # 0.7%
    else:
        return base_ctr  # 0.35%
