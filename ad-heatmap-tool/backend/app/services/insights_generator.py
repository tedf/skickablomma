"""Insights and bullet report generator."""

import numpy as np
from typing import Optional

from ..models.analysis import (
    BulletReport,
    Insight,
    AnalysisScores,
    DetectedElements,
    Face,
    TextRegion,
    CTARegion,
)
from .cv_detector import DetectedFace, DetectedText, DetectedCTA


def _score_to_grade(score: int) -> str:
    """Convert score to letter grade."""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    return "F"


def _calculate_scores(
    image_shape: tuple,
    attention_map: np.ndarray,
    faces: list[DetectedFace],
    text_regions: list[DetectedText],
    ctas: list[DetectedCTA],
) -> AnalysisScores:
    """Calculate all analysis scores."""
    height, width = image_shape[:2]

    # Visual hierarchy score
    visual_hierarchy = _score_visual_hierarchy(text_regions, ctas, height, width)

    # Attention distribution score
    attention_distribution = _score_attention_distribution(attention_map, ctas)

    # CTA effectiveness score
    cta_effectiveness = _score_cta_effectiveness(attention_map, ctas, height, width)

    # Mobile readiness score
    mobile_readiness = _score_mobile_readiness(text_regions, height, width)

    # Text clarity score
    text_clarity = _score_text_clarity(text_regions)

    # Color contrast score (estimated from attention map variance)
    color_contrast = _score_color_contrast(attention_map)

    return AnalysisScores(
        visual_hierarchy=visual_hierarchy,
        attention_distribution=attention_distribution,
        cta_effectiveness=cta_effectiveness,
        mobile_readiness=mobile_readiness,
        text_clarity=text_clarity,
        color_contrast=color_contrast,
    )


def _score_visual_hierarchy(
    text_regions: list[DetectedText], ctas: list[DetectedCTA], height: int, width: int
) -> float:
    """Score visual hierarchy based on element sizes and positions."""
    score = 50.0  # Base score

    # Check for headline
    headlines = [t for t in text_regions if t.text_type == "headline"]
    if headlines:
        score += 15

        # Headline at top?
        top_headline = min(headlines, key=lambda t: t.box[1])
        if top_headline.box[1] < height * 0.3:
            score += 10

    # Check for CTA
    if ctas:
        score += 15
        # CTA is prominent?
        max_prominence = max(c.prominence for c in ctas)
        if max_prominence > 0.5:
            score += 10

    return min(score, 100)


def _score_attention_distribution(
    attention_map: np.ndarray, ctas: list[DetectedCTA]
) -> float:
    """Score how well attention is distributed."""
    score = 50.0

    # Check if attention is well distributed (not too concentrated)
    std = np.std(attention_map)
    if 0.1 < std < 0.3:
        score += 25  # Good distribution
    elif std < 0.1:
        score -= 10  # Too uniform
    else:
        score += 10  # Somewhat concentrated

    # Check if CTAs get attention
    if ctas:
        for cta in ctas:
            x, y, w, h = cta.box
            if y + h <= attention_map.shape[0] and x + w <= attention_map.shape[1]:
                cta_attention = attention_map[y : y + h, x : x + w].mean()
                if cta_attention > 0.5:
                    score += 15
                    break

    return min(max(score, 0), 100)


def _score_cta_effectiveness(
    attention_map: np.ndarray, ctas: list[DetectedCTA], height: int, width: int
) -> float:
    """Score CTA effectiveness based on attention overlap."""
    if not ctas:
        return 40.0  # No CTA detected

    score = 50.0

    for cta in ctas:
        x, y, w, h = cta.box

        # Ensure bounds
        y2 = min(y + h, attention_map.shape[0])
        x2 = min(x + w, attention_map.shape[1])

        if y2 > y and x2 > x:
            cta_attention = attention_map[y:y2, x:x2].mean()
            overall_attention = attention_map.mean()

            # CTA gets more attention than average?
            if cta_attention > overall_attention * 1.5:
                score += 30
            elif cta_attention > overall_attention:
                score += 15

            # CTA prominence
            score += cta.prominence * 20

    return min(score, 100)


def _score_mobile_readiness(
    text_regions: list[DetectedText], height: int, width: int
) -> float:
    """Score mobile readiness based on text sizes."""
    score = 70.0  # Base score

    if not text_regions:
        return score

    # Check text sizes (relative to image)
    min_text_height = height * 0.02  # 2% of image height is minimum readable

    small_text_count = 0
    for text in text_regions:
        if text.box[3] < min_text_height:
            small_text_count += 1

    # Penalize for small text
    small_ratio = small_text_count / len(text_regions)
    score -= small_ratio * 30

    # Bonus for good aspect ratio (mobile-friendly)
    aspect = width / height
    if 0.5 < aspect < 1.5:
        score += 15  # Portrait or square

    return min(max(score, 0), 100)


def _score_text_clarity(text_regions: list[DetectedText]) -> float:
    """Score text clarity based on OCR confidence."""
    if not text_regions:
        return 70.0

    avg_confidence = sum(t.confidence for t in text_regions) / len(text_regions)
    return min(avg_confidence * 100, 100)


def _score_color_contrast(attention_map: np.ndarray) -> float:
    """Estimate color contrast from attention map characteristics."""
    # High variance in attention map suggests good contrast
    variance = np.var(attention_map)
    contrast_score = min(variance * 500 + 50, 100)
    return contrast_score


def generate_bullet_report(
    image_shape: tuple,
    attention_map: np.ndarray,
    click_map: np.ndarray,
    faces: list[DetectedFace],
    text_regions: list[DetectedText],
    ctas: list[DetectedCTA],
) -> BulletReport:
    """Generate bullet report with what's working and improvements."""
    height, width = image_shape[:2]

    scores = _calculate_scores(image_shape, attention_map, faces, text_regions, ctas)

    overall_score = int(
        (
            scores.visual_hierarchy
            + scores.attention_distribution
            + scores.cta_effectiveness
            + scores.mobile_readiness
            + scores.text_clarity
            + scores.color_contrast
        )
        / 6
    )

    whats_working = []
    suggested_improvements = []
    priority_fix = None

    # Analyze what's working
    if scores.color_contrast > 75:
        whats_working.append("Strong color contrast makes elements easy to distinguish")

    if ctas and scores.cta_effectiveness > 70:
        whats_working.append("CTA is well-positioned in a high-attention zone")

    if scores.visual_hierarchy > 75:
        whats_working.append("Clear visual hierarchy guides the eye naturally")

    if faces:
        # Check if face is looking at CTA (simplified check)
        whats_working.append("Human face attracts attention")

    # Text coverage
    text_coverage = sum(t.box[2] * t.box[3] for t in text_regions) / (width * height)
    if text_coverage < 0.25:
        whats_working.append("Minimal text approach aligns with best practices")

    if scores.mobile_readiness > 80:
        whats_working.append("Ad is optimized for mobile viewing")

    # Ensure at least 2 working items
    if len(whats_working) < 2:
        whats_working.append("Image quality is clear and professional")

    whats_working = whats_working[:5]  # Limit to 5

    # Analyze improvements needed
    improvements = []

    if scores.cta_effectiveness < 60:
        improvement = {
            "text": "Move CTA to top-right quadrant or increase size by 50-100%",
            "priority": 10,
        }
        improvements.append(improvement)

    if text_coverage > 0.3:
        improvement = {
            "text": f"Reduce text by {int((text_coverage - 0.20) * 100)}% - minimal-text ads outperform wordy ones",
            "priority": 9,
        }
        improvements.append(improvement)

    if faces and scores.cta_effectiveness < 70:
        improvement = {
            "text": "Adjust model's gaze to direct attention toward CTA or product",
            "priority": 7,
        }
        improvements.append(improvement)

    if scores.color_contrast < 60:
        improvement = {
            "text": "Increase contrast between text and background (aim for 4.5:1 ratio)",
            "priority": 8,
        }
        improvements.append(improvement)

    if scores.visual_hierarchy < 65:
        improvement = {
            "text": "Make headline 2x larger than body text to establish hierarchy",
            "priority": 6,
        }
        improvements.append(improvement)

    if scores.mobile_readiness < 70:
        improvement = {
            "text": "Increase minimum text size to 16px for mobile readability",
            "priority": 9,
        }
        improvements.append(improvement)

    # Sort by priority
    improvements.sort(key=lambda x: x["priority"], reverse=True)

    if improvements:
        priority_fix = improvements[0]["text"]
        suggested_improvements = [i["text"] for i in improvements[:5]]

    if not suggested_improvements:
        suggested_improvements = [
            "Consider A/B testing different CTA copy",
            "Test alternative background colors",
        ]

    return BulletReport(
        overall_score=overall_score,
        grade=_score_to_grade(overall_score),
        whats_working=whats_working,
        suggested_improvements=suggested_improvements,
        priority_fix=priority_fix,
    )


def generate_insights(
    image_shape: tuple,
    attention_map: np.ndarray,
    click_map: np.ndarray,
    faces: list[DetectedFace],
    text_regions: list[DetectedText],
    ctas: list[DetectedCTA],
) -> list[Insight]:
    """Generate detailed insights."""
    height, width = image_shape[:2]
    insights = []

    scores = _calculate_scores(image_shape, attention_map, faces, text_regions, ctas)

    # Insight 1: CTA attention
    if ctas:
        cta = ctas[0]
        x, y, w, h = cta.box
        y2 = min(y + h, attention_map.shape[0])
        x2 = min(x + w, attention_map.shape[1])

        if y2 > y and x2 > x:
            cta_attention = attention_map[y:y2, x:x2].mean()
            attention_percentile = (attention_map < cta_attention).mean() * 100

            if attention_percentile < 50:
                insights.append(
                    Insight(
                        id="cta-low-attention",
                        type="warning",
                        severity="high",
                        title="CTA in low-attention zone",
                        description=f"Your call-to-action receives only {attention_percentile:.0f}% of predicted attention.",
                        actionable="Move the CTA to the top-right quadrant or make it 2x larger with higher contrast.",
                        research_link="https://ppchero.com/7-ways-to-to-create-better-ads-insights-from-eye-tracking-research/",
                        score_impact=15,
                    )
                )
            else:
                insights.append(
                    Insight(
                        id="cta-good-attention",
                        type="success",
                        severity="low",
                        title="CTA is well-positioned",
                        description=f"Your CTA is in the top {100 - attention_percentile:.0f}% of attention areas.",
                        actionable="Maintain this CTA placement in future designs.",
                    )
                )

    # Insight 2: Face gaze direction
    if faces:
        insights.append(
            Insight(
                id="face-detected",
                type="info",
                severity="medium",
                title=f"{len(faces)} face(s) detected",
                description="Human faces are strong attention magnets. Viewers naturally look at faces first.",
                actionable="Ensure the face directs attention toward your CTA or product to avoid the 'vampire effect'.",
                research_link="https://www.mdpi.com/1995-8692/18/6/69",
            )
        )

    # Insight 3: Text coverage
    text_coverage = sum(t.box[2] * t.box[3] for t in text_regions) / (width * height)
    if text_coverage > 0.3:
        insights.append(
            Insight(
                id="text-overload",
                type="warning",
                severity="high",
                title="Too much text",
                description=f"Your ad has {text_coverage * 100:.0f}% text coverage. Research shows minimal-text ads outperform wordy ones.",
                actionable="Reduce text to under 30% of ad space. Focus on one key message.",
                score_impact=20,
            )
        )

    # Insight 4: Visual hierarchy
    if scores.visual_hierarchy >= 75:
        insights.append(
            Insight(
                id="good-hierarchy",
                type="success",
                severity="low",
                title=f"Visual Hierarchy Score: {scores.visual_hierarchy:.0f}/100",
                description="Your ad has a clear visual hierarchy that guides viewers through the content.",
                actionable="No action needed - maintain this structure in future designs.",
            )
        )
    else:
        insights.append(
            Insight(
                id="weak-hierarchy",
                type="suggestion",
                severity="medium",
                title=f"Visual Hierarchy Score: {scores.visual_hierarchy:.0f}/100",
                description="The visual hierarchy could be stronger. Elements compete for attention.",
                actionable="Make the headline 2x larger than body text and ensure the CTA stands out with contrasting colors.",
                score_impact=12,
            )
        )

    # Insight 5: Color contrast
    if scores.color_contrast < 60:
        insights.append(
            Insight(
                id="low-contrast",
                type="suggestion",
                severity="medium",
                title="Low color contrast detected",
                description="Some elements may be hard to distinguish due to low contrast.",
                actionable="Increase contrast between text and background to at least 4.5:1 ratio for accessibility.",
                score_impact=10,
            )
        )

    # Insight 6: Mobile readiness
    if scores.mobile_readiness < 70:
        insights.append(
            Insight(
                id="mobile-issues",
                type="warning",
                severity="high",
                title="Mobile readability concerns",
                description="Over 70% of display ads are viewed on mobile. Some text may be too small.",
                actionable="Ensure all text is at least 16px when viewed on mobile devices.",
                research_link="https://demandscience.com/resources/blog/b2b-display-ad-best-practices/",
                score_impact=15,
            )
        )

    return insights


def convert_to_model_elements(
    faces: list[DetectedFace],
    text_regions: list[DetectedText],
    ctas: list[DetectedCTA],
) -> DetectedElements:
    """Convert internal detection types to API model types."""
    return DetectedElements(
        faces=[
            Face(
                box=list(f.box),
                label="face",
                confidence=f.confidence,
                gaze_direction=list(f.gaze_direction),
            )
            for f in faces
        ],
        text_regions=[
            TextRegion(
                box=list(t.box),
                label=t.text_type,
                confidence=t.confidence,
                text=t.text,
                type=t.text_type,
            )
            for t in text_regions
        ],
        ctas=[
            CTARegion(
                box=list(c.box),
                label="cta",
                confidence=c.confidence,
                text=c.text,
                prominence=c.prominence,
            )
            for c in ctas
        ],
        logos=[],
    )
