from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    """Application settings."""

    # App settings
    app_name: str = "Ad Heatmap Analyzer"
    debug: bool = True

    # API settings
    api_v1_prefix: str = "/api/v1"

    # File storage
    upload_dir: Path = Path("static/uploads")
    heatmap_dir: Path = Path("static/heatmaps")
    max_file_size: int = 10 * 1024 * 1024  # 10MB

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # ML Model settings
    use_gpu: bool = False

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

# Create directories if they don't exist
settings.upload_dir.mkdir(parents=True, exist_ok=True)
settings.heatmap_dir.mkdir(parents=True, exist_ok=True)
