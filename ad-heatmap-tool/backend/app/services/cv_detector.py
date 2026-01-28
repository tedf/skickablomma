"""Computer vision detection service for faces, text, and CTAs."""

import numpy as np
from PIL import Image
import cv2
from typing import Optional
from dataclasses import dataclass
from pathlib import Path

# Optional imports for ML models
try:
    import mediapipe as mp

    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False

try:
    from paddleocr import PaddleOCR

    PADDLE_AVAILABLE = True
except ImportError:
    PADDLE_AVAILABLE = False


@dataclass
class DetectedFace:
    """Detected face with bounding box and gaze direction."""

    box: tuple[int, int, int, int]  # x, y, w, h
    confidence: float
    gaze_direction: tuple[float, float] = (0.0, 0.0)


@dataclass
class DetectedText:
    """Detected text region."""

    box: tuple[int, int, int, int]  # x, y, w, h
    text: str
    confidence: float
    text_type: str = "body"  # headline, body, cta


@dataclass
class DetectedCTA:
    """Detected CTA (button-like element)."""

    box: tuple[int, int, int, int]  # x, y, w, h
    text: str
    confidence: float
    prominence: float


class CVDetector:
    """Computer vision detector for ad elements."""

    def __init__(self):
        self._face_detector = None
        self._ocr = None

    @property
    def face_detector(self):
        """Lazy load face detector."""
        if self._face_detector is None and MEDIAPIPE_AVAILABLE:
            mp_face = mp.solutions.face_detection
            self._face_detector = mp_face.FaceDetection(
                model_selection=1, min_detection_confidence=0.5
            )
        return self._face_detector

    @property
    def ocr(self):
        """Lazy load OCR model."""
        if self._ocr is None and PADDLE_AVAILABLE:
            self._ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
        return self._ocr

    def detect_faces(self, image: np.ndarray) -> list[DetectedFace]:
        """Detect faces in image using MediaPipe."""
        faces = []

        if not MEDIAPIPE_AVAILABLE or self.face_detector is None:
            # Fallback to Haar cascades
            return self._detect_faces_cascade(image)

        # Convert to RGB for MediaPipe
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) if len(image.shape) == 3 else image

        results = self.face_detector.process(rgb)

        if results.detections:
            h, w = image.shape[:2]
            for detection in results.detections:
                bbox = detection.location_data.relative_bounding_box
                x = int(bbox.xmin * w)
                y = int(bbox.ymin * h)
                width = int(bbox.width * w)
                height = int(bbox.height * h)

                # Estimate gaze direction (simplified - assumes looking forward)
                # In a full implementation, you'd use face landmarks
                gaze = (0.0, 0.0)

                faces.append(
                    DetectedFace(
                        box=(x, y, width, height),
                        confidence=detection.score[0],
                        gaze_direction=gaze,
                    )
                )

        return faces

    def _detect_faces_cascade(self, image: np.ndarray) -> list[DetectedFace]:
        """Fallback face detection using Haar cascades."""
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY) if len(image.shape) == 3 else image

        # Use OpenCV's built-in cascade classifier
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        face_cascade = cv2.CascadeClassifier(cascade_path)

        detections = face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )

        faces = []
        for x, y, w, h in detections:
            faces.append(
                DetectedFace(
                    box=(int(x), int(y), int(w), int(h)),
                    confidence=0.8,
                    gaze_direction=(0.0, 0.0),
                )
            )

        return faces

    def detect_text(self, image: np.ndarray) -> list[DetectedText]:
        """Detect text regions in image."""
        texts = []

        if PADDLE_AVAILABLE and self.ocr is not None:
            try:
                result = self.ocr.ocr(image, cls=True)

                if result and result[0]:
                    for line in result[0]:
                        if line is None:
                            continue

                        points, (text, confidence) = line

                        # Convert points to bounding box
                        points = np.array(points)
                        x = int(points[:, 0].min())
                        y = int(points[:, 1].min())
                        w = int(points[:, 0].max() - x)
                        h = int(points[:, 1].max() - y)

                        # Classify text type based on size and position
                        text_type = self._classify_text_type(text, (x, y, w, h), image.shape)

                        texts.append(
                            DetectedText(
                                box=(x, y, w, h),
                                text=text,
                                confidence=confidence,
                                text_type=text_type,
                            )
                        )
            except Exception:
                pass  # OCR failed, return empty list

        return texts

    def _classify_text_type(
        self, text: str, box: tuple[int, int, int, int], image_shape: tuple
    ) -> str:
        """Classify text as headline, body, or CTA."""
        x, y, w, h = box
        img_h, img_w = image_shape[:2]

        # Relative position and size
        rel_y = y / img_h
        rel_h = h / img_h

        # CTA keywords
        cta_keywords = [
            "shop",
            "buy",
            "get",
            "start",
            "learn",
            "sign",
            "join",
            "try",
            "click",
            "order",
            "subscribe",
            "download",
        ]

        text_lower = text.lower()

        # Check for CTA keywords
        if any(keyword in text_lower for keyword in cta_keywords):
            return "cta"

        # Large text at top is likely headline
        if rel_y < 0.3 and rel_h > 0.03:
            return "headline"

        # Everything else is body text
        return "body"

    def detect_ctas(self, image: np.ndarray, text_regions: list[DetectedText]) -> list[DetectedCTA]:
        """Detect CTAs based on visual and text analysis."""
        ctas = []
        img_h, img_w = image.shape[:2]

        # First, check text regions for CTA keywords
        for text in text_regions:
            if text.text_type == "cta":
                # Calculate prominence based on size and position
                x, y, w, h = text.box
                rel_area = (w * h) / (img_w * img_h)
                prominence = min(rel_area * 100, 1.0)

                ctas.append(
                    DetectedCTA(
                        box=text.box,
                        text=text.text,
                        confidence=text.confidence,
                        prominence=prominence,
                    )
                )

        # Also detect button-like shapes
        button_ctas = self._detect_button_shapes(image)
        ctas.extend(button_ctas)

        return ctas

    def _detect_button_shapes(self, image: np.ndarray) -> list[DetectedCTA]:
        """Detect button-like rectangular shapes."""
        ctas = []
        img_h, img_w = image.shape[:2]

        # Convert to grayscale and detect edges
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 50, 150)

        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            # Approximate contour
            peri = cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, 0.02 * peri, True)

            # Check if it's a rectangle (4 vertices)
            if len(approx) == 4:
                x, y, w, h = cv2.boundingRect(approx)

                # Filter by aspect ratio and size (button-like)
                aspect_ratio = w / h if h > 0 else 0
                rel_area = (w * h) / (img_w * img_h)

                # Buttons are typically wider than tall, reasonable size
                if 1.5 < aspect_ratio < 8 and 0.002 < rel_area < 0.1:
                    # Check if it has high contrast (filled background)
                    roi = image[y : y + h, x : x + w]
                    if roi.size > 0:
                        # Check for uniform color (button background)
                        std = np.std(roi)
                        if std < 50:  # Relatively uniform
                            prominence = min(rel_area * 50, 1.0)
                            ctas.append(
                                DetectedCTA(
                                    box=(x, y, w, h),
                                    text="[Button]",
                                    confidence=0.6,
                                    prominence=prominence,
                                )
                            )

        return ctas

    def calculate_text_coverage(self, text_regions: list[DetectedText], image_shape: tuple) -> float:
        """Calculate percentage of image covered by text."""
        if not text_regions:
            return 0.0

        img_h, img_w = image_shape[:2]
        total_area = img_w * img_h

        text_area = sum(t.box[2] * t.box[3] for t in text_regions)

        return text_area / total_area


# Global instance
cv_detector = CVDetector()
