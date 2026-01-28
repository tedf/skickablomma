"""Heatmap generation engine."""

import numpy as np
from pathlib import Path
import uuid

from .image_processor import (
    ImageData,
    calculate_contrast_map,
    calculate_color_saliency,
    apply_center_bias,
    generate_f_pattern_weights,
    generate_z_pattern_weights,
    normalize_map,
    save_heatmap,
)
from .cv_detector import DetectedFace, DetectedText, DetectedCTA


class HeatmapGenerator:
    """Generate attention and click prediction heatmaps."""

    def __init__(self):
        # Weights for attention fusion
        self.weights = {
            "saliency": 0.35,
            "pattern": 0.20,
            "face": 0.20,
            "contrast": 0.15,
            "center": 0.10,
        }

        # Weights for click prediction
        self.click_weights = {
            "attention": 0.40,
            "cta_proximity": 0.30,
            "text_clarity": 0.15,
            "affordance": 0.15,
        }

    def generate_attention_heatmap(
        self,
        image_data: ImageData,
        faces: list[DetectedFace],
        text_regions: list[DetectedText],
        use_f_pattern: bool = True,
    ) -> tuple[np.ndarray, Path]:
        """Generate attention prediction heatmap."""
        height, width = image_data.height, image_data.width
        image = image_data.array

        # 1. Color saliency map
        saliency_map = calculate_color_saliency(image)

        # 2. Pattern-based attention (F or Z)
        if use_f_pattern:
            pattern_map = generate_f_pattern_weights(height, width)
        else:
            pattern_map = generate_z_pattern_weights(height, width)
        pattern_map = normalize_map(pattern_map)

        # 3. Face attention boost
        face_map = self._generate_face_attention_map(faces, height, width)

        # 4. Contrast map
        contrast_map = calculate_contrast_map(image)
        contrast_map = normalize_map(contrast_map)

        # 5. Center bias
        center_map = apply_center_bias((height, width))

        # Combine maps with weights
        attention_map = (
            self.weights["saliency"] * saliency_map
            + self.weights["pattern"] * pattern_map
            + self.weights["face"] * face_map
            + self.weights["contrast"] * contrast_map
            + self.weights["center"] * center_map
        )

        # Boost attention on text regions
        attention_map = self._boost_text_attention(attention_map, text_regions)

        # Normalize final map
        attention_map = normalize_map(attention_map)

        # Save heatmap
        filename = f"attention_{uuid.uuid4().hex[:8]}.png"
        output_path = save_heatmap(attention_map, filename)

        return attention_map, output_path

    def generate_click_heatmap(
        self,
        image_data: ImageData,
        attention_map: np.ndarray,
        ctas: list[DetectedCTA],
        text_regions: list[DetectedText],
    ) -> tuple[np.ndarray, Path]:
        """Generate click prediction heatmap."""
        height, width = image_data.height, image_data.width

        # 1. Base attention
        click_map = self.click_weights["attention"] * attention_map

        # 2. CTA proximity boost
        cta_map = self._generate_cta_proximity_map(ctas, height, width)
        click_map += self.click_weights["cta_proximity"] * cta_map

        # 3. Text clarity (readable text near attention = higher click)
        text_mask = self._generate_text_mask(text_regions, height, width)
        text_attention = attention_map * text_mask
        click_map += self.click_weights["text_clarity"] * normalize_map(text_attention)

        # 4. Visual affordance (button-like areas)
        affordance_map = self._generate_affordance_map(ctas, height, width)
        click_map += self.click_weights["affordance"] * affordance_map

        # Normalize
        click_map = normalize_map(click_map)

        # Save heatmap
        filename = f"click_{uuid.uuid4().hex[:8]}.png"
        output_path = save_heatmap(click_map, filename)

        return click_map, output_path

    def _generate_face_attention_map(
        self, faces: list[DetectedFace], height: int, width: int
    ) -> np.ndarray:
        """Generate attention map boosting face regions."""
        face_map = np.zeros((height, width), dtype=np.float32)

        for face in faces:
            x, y, w, h = face.box

            # Create Gaussian blob centered on face
            cy, cx = y + h // 2, x + w // 2
            sigma = max(w, h) * 0.5

            yy, xx = np.ogrid[:height, :width]
            blob = np.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * sigma ** 2))

            # Weight by confidence
            face_map += blob * face.confidence

            # Add gaze direction boost
            gx, gy = face.gaze_direction
            if abs(gx) > 0.1 or abs(gy) > 0.1:
                # Create attention beam in gaze direction
                gaze_map = self._create_gaze_beam(cx, cy, gx, gy, height, width)
                face_map += gaze_map * 0.5

        return normalize_map(face_map) if faces else face_map

    def _create_gaze_beam(
        self, cx: int, cy: int, gx: float, gy: float, height: int, width: int
    ) -> np.ndarray:
        """Create attention beam in gaze direction."""
        beam_map = np.zeros((height, width), dtype=np.float32)

        # Normalize gaze direction
        gaze_len = np.sqrt(gx ** 2 + gy ** 2)
        if gaze_len < 0.1:
            return beam_map

        gx, gy = gx / gaze_len, gy / gaze_len

        # Create beam along gaze direction
        yy, xx = np.ogrid[:height, :width]

        # Vector from face to each pixel
        dx = xx - cx
        dy = yy - cy

        # Alignment with gaze direction (dot product)
        alignment = dx * gx + dy * gy

        # Only boost in positive gaze direction
        mask = alignment > 0

        # Distance from face
        distance = np.sqrt(dx ** 2 + dy ** 2)

        # Beam intensity (decays with distance, focused along gaze)
        beam_map[mask] = np.exp(-distance[mask] / 200) * (alignment[mask] / (distance[mask] + 1))

        return beam_map

    def _boost_text_attention(
        self, attention_map: np.ndarray, text_regions: list[DetectedText]
    ) -> np.ndarray:
        """Boost attention on text regions, especially headlines."""
        boosted = attention_map.copy()

        for text in text_regions:
            x, y, w, h = text.box
            x = max(0, x)
            y = max(0, y)
            x2 = min(boosted.shape[1], x + w)
            y2 = min(boosted.shape[0], y + h)

            # Boost factor depends on text type
            if text.text_type == "headline":
                boost = 1.3
            elif text.text_type == "cta":
                boost = 1.4
            else:
                boost = 1.1

            boosted[y:y2, x:x2] *= boost

        return boosted

    def _generate_cta_proximity_map(
        self, ctas: list[DetectedCTA], height: int, width: int
    ) -> np.ndarray:
        """Generate map with high values near CTAs."""
        cta_map = np.zeros((height, width), dtype=np.float32)

        for cta in ctas:
            x, y, w, h = cta.box
            cx, cy = x + w // 2, y + h // 2

            # Gaussian blob on CTA
            sigma = max(w, h)
            yy, xx = np.ogrid[:height, :width]
            blob = np.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * sigma ** 2))

            cta_map += blob * cta.prominence

        return normalize_map(cta_map) if ctas else cta_map

    def _generate_text_mask(
        self, text_regions: list[DetectedText], height: int, width: int
    ) -> np.ndarray:
        """Generate binary mask of text regions."""
        mask = np.zeros((height, width), dtype=np.float32)

        for text in text_regions:
            x, y, w, h = text.box
            x = max(0, x)
            y = max(0, y)
            x2 = min(width, x + w)
            y2 = min(height, y + h)
            mask[y:y2, x:x2] = 1.0

        # Blur slightly for smooth edges
        from scipy import ndimage
        mask = ndimage.gaussian_filter(mask, sigma=3)

        return mask

    def _generate_affordance_map(
        self, ctas: list[DetectedCTA], height: int, width: int
    ) -> np.ndarray:
        """Generate map highlighting clickable-looking elements."""
        affordance_map = np.zeros((height, width), dtype=np.float32)

        for cta in ctas:
            x, y, w, h = cta.box
            x = max(0, x)
            y = max(0, y)
            x2 = min(width, x + w)
            y2 = min(height, y + h)

            # Strong signal on CTA bounding box
            affordance_map[y:y2, x:x2] = cta.prominence * cta.confidence

        return normalize_map(affordance_map) if ctas else affordance_map


# Global instance
heatmap_generator = HeatmapGenerator()
