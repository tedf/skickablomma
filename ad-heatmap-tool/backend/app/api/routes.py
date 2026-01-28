"""API routes for the ad heatmap analyzer."""

import uuid
import aiofiles
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse

from ..core.config import settings
from ..models.analysis import AnalysisResult, UploadResponse
from ..services.analyzer import create_job, get_job, run_analysis

router = APIRouter()


ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def validate_image(file: UploadFile) -> None:
    """Validate uploaded image."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")


@router.post("/analyze", response_model=UploadResponse)
async def upload_and_analyze(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
):
    """Upload an image and start analysis."""
    # Validate file
    validate_image(image)

    # Generate unique filename
    ext = Path(image.filename).suffix.lower()
    filename = f"{uuid.uuid4().hex[:12]}{ext}"
    file_path = settings.upload_dir / filename

    # Save file
    try:
        async with aiofiles.open(file_path, "wb") as f:
            content = await image.read()

            # Check file size
            if len(content) > settings.max_file_size:
                raise HTTPException(
                    status_code=400,
                    detail=f"File too large. Maximum size is {settings.max_file_size // (1024 * 1024)}MB",
                )

            await f.write(content)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Create job
    job_id = create_job(file_path, image.filename or "unknown")

    # Start analysis in background
    background_tasks.add_task(run_analysis, job_id, file_path)

    return UploadResponse(job_id=job_id)


@router.get("/analyze/{job_id}", response_model=AnalysisResult)
async def get_analysis_status(job_id: str):
    """Get the status and results of an analysis job."""
    job = get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")

    return job


@router.get("/examples")
async def get_examples():
    """Get example ads with pre-computed heatmaps."""
    # In a real implementation, this would return curated examples
    return {
        "examples": [
            {
                "id": "example-1",
                "title": "E-commerce Product Ad",
                "thumbnail_url": "/static/examples/ecommerce-thumb.jpg",
                "description": "A high-converting product ad with strong CTA placement",
            },
            {
                "id": "example-2",
                "title": "Brand Awareness Ad",
                "thumbnail_url": "/static/examples/brand-thumb.jpg",
                "description": "An ad optimized for brand recall and recognition",
            },
        ]
    }


@router.post("/feedback")
async def submit_feedback(
    job_id: str,
    accuracy_rating: int,
    comments: str = "",
):
    """Submit feedback on analysis accuracy."""
    if not 1 <= accuracy_rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # In a real implementation, this would store feedback for model improvement
    return {"message": "Thank you for your feedback!", "job_id": job_id}
