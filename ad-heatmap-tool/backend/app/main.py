"""Main FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .core.config import settings
from .api.routes import router as api_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.app_name,
        description="AI-powered digital ad heatmap analyzer with attention and click predictions",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount static files
    static_path = Path(__file__).parent.parent / "static"
    static_path.mkdir(parents=True, exist_ok=True)
    (static_path / "uploads").mkdir(exist_ok=True)
    (static_path / "heatmaps").mkdir(exist_ok=True)

    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

    # Include API routes
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/")
    async def root():
        return {
            "message": "Ad Heatmap Analyzer API",
            "docs": "/docs",
            "version": "1.0.0",
        }

    @app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    return app


app = create_app()
