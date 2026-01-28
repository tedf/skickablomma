"""Image processing and analysis service."""

import numpy as np
from PIL import Image
from pathlib import Path
import cv2
from typing import Optional
import uuid
from dataclasses import dataclass

from ..core.config import settings


@dataclass
class ImageData:
    """Container for image data."""

    array: np.ndarray
    width: int
    height: int
    path: Path


def load_image(image_path: Path) -> ImageData:
    """Load an image from disk."""
    img = Image.open(image_path).convert("RGB")
    array = np.array(img)
    return ImageData(
        array=array,
        width=img.width,
        height=img.height,
        path=image_path,
    )


def save_heatmap(
    heatmap: np.ndarray,
    filename: str,
    colormap: int = cv2.COLORMAP_JET,
) -> Path:
    """Save a heatmap array as an image."""
    # Normalize to 0-255
    heatmap_normalized = ((heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8) * 255).astype(np.uint8)

    # Apply colormap
    heatmap_colored = cv2.applyColorMap(heatmap_normalized, colormap)

    # Convert BGR to RGB
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

    # Save
    output_path = settings.heatmap_dir / filename
    Image.fromarray(heatmap_colored).save(output_path)

    return output_path


def calculate_contrast_map(image: np.ndarray) -> np.ndarray:
    """Calculate contrast map using edge detection."""
    # Convert to grayscale
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    else:
        gray = image

    # Apply Canny edge detection
    edges = cv2.Canny(gray, 50, 150)

    # Dilate edges to create regions
    kernel = np.ones((5, 5), np.uint8)
    dilated = cv2.dilate(edges, kernel, iterations=2)

    # Gaussian blur for smooth map
    contrast_map = cv2.GaussianBlur(dilated.astype(np.float32), (21, 21), 0)

    return contrast_map


def calculate_color_saliency(image: np.ndarray) -> np.ndarray:
    """Calculate color-based saliency map."""
    # Convert to LAB color space
    lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB).astype(np.float32)

    # Calculate mean color
    mean_lab = np.mean(lab, axis=(0, 1))

    # Calculate color distance from mean
    diff = np.sqrt(np.sum((lab - mean_lab) ** 2, axis=2))

    # Normalize
    saliency = (diff - diff.min()) / (diff.max() - diff.min() + 1e-8)

    return saliency


def apply_center_bias(shape: tuple[int, int], sigma: float = 0.4) -> np.ndarray:
    """Create a center bias map (Gaussian centered on image)."""
    height, width = shape
    y, x = np.ogrid[:height, :width]
    cy, cx = height / 2, width / 2

    # Gaussian centered on image center
    center_bias = np.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * (sigma * min(width, height)) ** 2))

    return center_bias


def generate_f_pattern_weights(height: int, width: int) -> np.ndarray:
    """Generate F-pattern attention weights."""
    weights = np.ones((height, width), dtype=np.float32)

    # Horizontal bar 1 (top)
    top_bar = int(0.15 * height)
    weights[:top_bar, :] *= 1.3

    # Horizontal bar 2 (middle)
    mid_start = int(0.4 * height)
    mid_end = int(0.5 * height)
    mid_width = int(0.6 * width)
    weights[mid_start:mid_end, :mid_width] *= 1.2

    # Vertical bar (left)
    left_bar = int(0.15 * width)
    weights[:, :left_bar] *= 1.2

    # Exponential decay to right
    for x in range(width):
        decay_x = np.exp(-2 * x / width)
        weights[:, x] *= 1 + 0.5 * decay_x

    return weights


def generate_z_pattern_weights(height: int, width: int) -> np.ndarray:
    """Generate Z-pattern attention weights."""
    weights = np.ones((height, width), dtype=np.float32)

    # Define Z-pattern regions
    top_region = int(0.25 * height)
    bottom_region = int(0.75 * height)

    # Top-left boost
    weights[:top_region, : int(0.5 * width)] *= 1.3

    # Top-right boost
    weights[:top_region, int(0.5 * width) :] *= 1.25

    # Bottom-left boost
    weights[bottom_region:, : int(0.5 * width)] *= 1.2

    # Bottom-right boost
    weights[bottom_region:, int(0.5 * width) :] *= 1.25

    # Diagonal boost (middle)
    for y in range(top_region, bottom_region):
        progress = (y - top_region) / (bottom_region - top_region)
        x_pos = int(width * (1 - progress))
        weights[y, max(0, x_pos - 30) : min(width, x_pos + 30)] *= 1.15

    return weights


def normalize_map(arr: np.ndarray) -> np.ndarray:
    """Normalize array to [0, 1] range."""
    min_val = arr.min()
    max_val = arr.max()
    if max_val - min_val < 1e-8:
        return np.zeros_like(arr)
    return (arr - min_val) / (max_val - min_val)
