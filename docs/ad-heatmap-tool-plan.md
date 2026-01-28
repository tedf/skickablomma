# Digital Ad Heatmap Tool - Implementation Plan

## Executive Summary

A web-based tool that analyzes uploaded digital ad images and generates predictive heatmaps showing:
1. **Attention Heatmap**: Where viewers will likely look (based on eye-tracking research)
2. **Click Prediction Heatmap**: Where viewers will likely click
3. **Bullet Report**: Short, scannable summary of what's working and what to improve
4. **Actionable Insights**: Detailed design recommendations based on ad best practices

The tool uses a **hybrid approach** combining:
- Deep learning models trained on eye-tracking data
- Rule-based algorithms derived from advertising research
- Computer vision for element detection (faces, text, CTAs, logos)

---

## Research Foundation

### Key Eye-Tracking Findings

**Visual Scanning Patterns**:
- **F-Pattern**: Users scan horizontally across the top, then down the left side (text-heavy content)
- **Z-Pattern**: Users scan top-left to top-right, diagonally down, then left to right again (visual-heavy content)
- **Center-Weighted**: Users focus on central elements first in image-heavy designs

**Attention Drivers** (ranked by research):
1. **Human faces** (strongest attention magnet) - but can create "vampire effect"
2. **Gaze direction** - viewers follow where models are looking
3. **Color contrast** - high contrast areas attract attention
4. **Text placement** - headlines in top-left get most attention
5. **CTA buttons** - larger, contrasting CTAs perform better
6. **Dynamic elements** - motion/animation increases engagement by 245%
7. **Whitespace** - proper spacing guides eye flow

**Research Sources**:
- Nielsen Norman Group (2006) - 232 users, F-pattern study
- Recent eye-tracking validation studies (2025-2026)
- Microsoft Clarity's predictive heatmap research
- Google's "Think with Google" display ad research

### Click Prediction Research

**Click Probability Factors**:
1. **CTA prominence** - 34% conversion increase with optimized CTAs
2. **Mobile optimization** - 2x engagement rate vs non-optimized
3. **Minimal text** - text-light ads outperform text-heavy in all metrics
4. **Trust signals** - social proof, badges, testimonials increase clicks
5. **Personalization** - tailored messages improve relevance

---

## System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Web Frontend  │
│  (React + TS)   │
└────────┬────────┘
         │ Upload Image
         ▼
┌─────────────────────────────────────────┐
│          API Gateway (FastAPI)          │
├─────────────────────────────────────────┤
│  • Image validation & preprocessing     │
│  • Authentication & rate limiting       │
│  • Job queuing (Redis/Celery)          │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│      Heatmap Generation Engine          │
├─────────────────────────────────────────┤
│  1. Computer Vision Module              │
│     • Face detection (MTCNN/Dlib)      │
│     • Text detection (EAST/PaddleOCR)  │
│     • Logo/brand detection             │
│     • Color analysis                   │
│     • Layout segmentation              │
│                                          │
│  2. ML Attention Prediction             │
│     • Saliency model (pre-trained)     │
│     • Vision Transformer (optional)    │
│     • Fine-tuned on ad datasets        │
│                                          │
│  3. Rule-Based Analyzer                 │
│     • F/Z pattern scoring              │
│     • Face gaze direction analysis     │
│     • CTA placement scoring            │
│     • Contrast map generation          │
│     • Visual hierarchy evaluation      │
│                                          │
│  4. Hybrid Fusion Engine                │
│     • Weighted combination             │
│     • Context-aware blending           │
│     • Confidence scoring               │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│        Insights Generator               │
├─────────────────────────────────────────┤
│  • Identify attention hotspots          │
│  • Detect blind spots                   │
│  • Generate recommendations             │
│  • Score ad effectiveness (0-100)       │
│  • Compare to best practices            │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│   Results JSON  │
│  + Heatmap PNG  │
└─────────────────┘
```

---

## Core Components

### 1. Frontend (React + TypeScript + Tailwind)

**Features**:
- Drag-and-drop image upload with subtle hover animations
- Real-time processing progress with shimmer loading states
- Interactive heatmap visualization with smooth toggles:
  - Attention heatmap overlay
  - Click prediction overlay
  - Element detection overlay (bounding boxes)
- **Bullet Report Card**: Scannable summary with what's working and suggested improvements
- Detailed insights panel (collapsible)
- Split-view comparison (before/after)
- Downloadable reports (PDF/PNG)
- Minimal, best-in-class design with subtle animations throughout

**Tech Stack**:
- **Framework**: Next.js 14+ (App Router)
- **UI**: Tailwind CSS + shadcn/ui (for consistent, accessible components)
- **Visualization**: Canvas API + react-konva for heatmap rendering
- **Animations**: Framer Motion (optional) + CSS transitions
- **State**: Zustand or TanStack Query
- **Upload**: react-dropzone
- **Fonts**: Inter Variable

**Design Requirements**:
- Clean, minimal interface with purposeful whitespace
- Subtle animations (150-350ms, cubic-bezier easing)
- GPU-accelerated animations (transform/opacity only)
- Respect `prefers-reduced-motion`
- WCAG AA accessibility compliance
- Mobile-first responsive design

### 2. Backend (Python FastAPI)

**Endpoints**:
```
POST /api/v1/analyze
  - Upload image (max 10MB)
  - Returns job_id

GET /api/v1/analyze/{job_id}
  - Poll for results
  - Returns status + heatmap URLs when ready

POST /api/v1/feedback
  - User feedback on accuracy (for model improvement)

GET /api/v1/examples
  - Gallery of example ads with heatmaps
```

**Tech Stack**:
- **Framework**: FastAPI 0.100+
- **Task Queue**: Celery + Redis
- **Storage**: S3-compatible (MinIO/AWS)
- **ML Serving**: TorchServe or ONNX Runtime

### 3. Computer Vision Module

**Sub-modules**:

**a) Face Detection & Analysis**
- **Library**: MediaPipe Face Detection or MTCNN
- **Output**: Face bounding boxes, gaze direction estimation
- **Purpose**: Weight attention toward faces, apply gaze-following

**b) Text Detection & OCR**
- **Library**: PaddleOCR or Google Cloud Vision API
- **Output**: Text regions, extracted text, font size
- **Purpose**: Identify headlines, CTAs, body text

**c) Object/Logo Detection**
- **Library**: YOLOv8 or Detectron2
- **Output**: Product images, brand logos, buttons
- **Purpose**: Identify clickable elements

**d) Color & Contrast Analysis**
- **Library**: OpenCV + scikit-image
- **Methods**:
  - HSV color space analysis
  - Edge detection (Canny)
  - Contrast ratio calculation (WCAG standards)
- **Output**: High-contrast regions, color heat

**e) Layout Segmentation**
- **Library**: Custom algorithm or LayoutParser
- **Output**: Grid structure, element positioning
- **Purpose**: Determine if F-pattern or Z-pattern applies

### 4. ML Attention Prediction Model

**Approach Options**:

**Option A: Pre-trained Saliency Models**
- **Models**:
  - DeepGaze III (state-of-the-art saliency)
  - SAM-PT (Segment Anything + attention)
  - SimpleNet (lightweight option)
- **Training Data**: MIT Saliency Benchmark, SALICON dataset
- **Pros**: Fast implementation, proven accuracy
- **Cons**: Not specific to ads

**Option B: Fine-tuned on Ad Datasets**
- **Base Model**: Vision Transformer (ViT) or ResNet-50
- **Datasets**:
  - Collect ad eye-tracking data (partner with research labs)
  - Use public datasets: MediaEval Predicting Media Memorability
- **Training**: Transfer learning with ad-specific data
- **Pros**: Ad-optimized predictions
- **Cons**: Requires labeled data, longer development

**Option C: Hybrid (Recommended for MVP)**
- Use pre-trained saliency model (DeepGaze III)
- Apply domain-specific post-processing:
  - Boost attention on faces, CTAs, headlines
  - Apply F/Z pattern weighting
  - Reduce attention on low-contrast areas

**Implementation**:
```python
# Pseudo-code
def predict_attention(image):
    # ML prediction
    saliency_map = deepgaze_model.predict(image)

    # Computer vision features
    faces = detect_faces(image)
    text_regions = detect_text(image)
    contrast_map = compute_contrast(image)

    # Rule-based enhancements
    attention_map = saliency_map.copy()
    attention_map = boost_faces(attention_map, faces, weight=1.3)
    attention_map = boost_text(attention_map, text_regions, weight=1.1)
    attention_map = apply_f_pattern(attention_map, layout_type)
    attention_map = boost_contrast(attention_map, contrast_map)

    # Normalize
    attention_map = normalize(attention_map)

    return attention_map
```

### 5. Rule-Based Analyzer

**Rules Engine**:

**R1: F-Pattern Application** (for text-heavy ads)
- Weight top 20% of image: +30% attention
- Weight left 30% of image: +20% attention
- Create gradient falloff to right/bottom

**R2: Z-Pattern Application** (for visual-heavy ads)
- Weight corners in Z-shape
- Boost top-left (30%), top-right (25%), bottom-left (20%), bottom-right (25%)

**R3: Face Gaze Following**
- If face detected:
  - Estimate gaze direction (eye landmarks)
  - Create attention beam in gaze direction (+40% attention)
  - Reduce face attention if looking at product (avoid vampire effect)

**R4: CTA Proximity Scoring**
- Detect buttons/CTAs (bright colors, rectangular shapes, action words)
- If CTA near high-attention area: +50% click probability
- If CTA in low-attention area: -50% click probability

**R5: Color Contrast Boosting**
- Areas with >4.5:1 contrast ratio: +15% attention
- Bright colors (red, orange, yellow): +10% attention

**R6: Center Bias**
- Apply slight center-weighting (Gaussian distribution)
- Mimics natural tendency to look at center first

### 6. Click Prediction Algorithm

**Click Probability Factors**:

```python
def predict_click_heatmap(image, attention_map):
    click_map = np.zeros_like(attention_map)

    # Factor 1: Attention (40% weight)
    click_map += 0.4 * attention_map

    # Factor 2: Interactivity indicators (30% weight)
    ctas = detect_ctas(image)  # buttons, links
    for cta in ctas:
        click_map = add_gaussian_blob(click_map, cta.center, sigma=30)
    click_map += 0.3 * normalize(click_map)

    # Factor 3: Text readability (15% weight)
    # Readable text near high attention = high click
    text_regions = detect_text(image)
    readable_mask = filter_readable_text(text_regions)
    click_map += 0.15 * (attention_map * readable_mask)

    # Factor 4: Visual affordance (15% weight)
    # Button-like shapes, underlined text, arrows
    affordances = detect_affordances(image)
    click_map += 0.15 * affordances

    return normalize(click_map)
```

### 7. Insights Generator

**Automated Insights**:

```python
def generate_insights(image, attention_map, click_map):
    insights = []

    # Insight 1: Attention distribution
    top_10_percent = get_top_attention_regions(attention_map, 0.1)
    if not cta_in_region(top_10_percent):
        insights.append({
            "type": "warning",
            "title": "CTA not in high-attention area",
            "description": "Your call-to-action is outside the top 10% attention zone. Consider moving it to a more prominent location.",
            "severity": "high"
        })

    # Insight 2: Face gaze direction
    faces = detect_faces(image)
    if faces and not face_looking_at_cta(faces):
        insights.append({
            "type": "suggestion",
            "title": "Face not directing attention to CTA",
            "description": "The model in your ad is looking away from the product/CTA. Research shows viewers follow gaze direction - consider adjusting.",
            "severity": "medium"
        })

    # Insight 3: Text overload
    text_coverage = calculate_text_coverage(image)
    if text_coverage > 0.3:
        insights.append({
            "type": "warning",
            "title": "Too much text",
            "description": "Your ad has >30% text coverage. Research shows minimal-text ads outperform wordy ones in all engagement metrics.",
            "severity": "high"
        })

    # Insight 4: Color contrast
    contrast_score = calculate_average_contrast(image)
    if contrast_score < 3.0:
        insights.append({
            "type": "suggestion",
            "title": "Low color contrast",
            "description": "Increase contrast between foreground and background to improve attention and readability.",
            "severity": "medium"
        })

    # Insight 5: Mobile readiness
    if image.width / image.height < 1.5:
        # Vertical format - check text size
        if has_small_text(image):
            insights.append({
                "type": "warning",
                "title": "Text may be unreadable on mobile",
                "description": "Over 70% of display ads are viewed on mobile. Ensure text is large enough.",
                "severity": "high"
            })

    # Insight 6: Visual hierarchy score
    hierarchy_score = calculate_hierarchy_score(image)
    insights.append({
        "type": "info",
        "title": f"Visual Hierarchy Score: {hierarchy_score}/100",
        "description": get_hierarchy_description(hierarchy_score)
    })

    # Insight 7: Predicted click-through rate
    ctr_estimate = estimate_ctr(attention_map, click_map, insights)
    insights.append({
        "type": "info",
        "title": f"Estimated CTR: {ctr_estimate}%",
        "description": "Based on similar ad patterns in our training data"
    })

    return insights
```

### 8. Bullet Report Generator

**Purpose**: Provide a concise, scannable summary alongside the detailed heatmap analysis. This report immediately shows users what's working and what needs improvement without having to study the heatmap.

**Format**:
```typescript
interface BulletReport {
  overall_score: number;  // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  whats_working: string[];  // 3-5 positive points
  suggested_improvements: string[];  // 3-5 actionable changes
  priority_fix?: string;  // Single most important change
}
```

**Implementation**:
```python
def generate_bullet_report(image, attention_map, click_map, insights):
    """Generate concise bullet report for quick scanning."""

    report = {
        "overall_score": 0,
        "grade": "F",
        "whats_working": [],
        "suggested_improvements": [],
        "priority_fix": None
    }

    # Calculate overall score
    scores = {
        "visual_hierarchy": calculate_hierarchy_score(image),
        "attention_distribution": score_attention_distribution(attention_map),
        "cta_effectiveness": score_cta_effectiveness(image, click_map),
        "mobile_readiness": score_mobile_readiness(image),
        "text_clarity": score_text_clarity(image),
        "color_contrast": score_contrast(image)
    }

    overall = sum(scores.values()) / len(scores)
    report["overall_score"] = int(overall)

    # Assign letter grade
    if overall >= 90:
        report["grade"] = "A"
    elif overall >= 80:
        report["grade"] = "B"
    elif overall >= 70:
        report["grade"] = "C"
    elif overall >= 60:
        report["grade"] = "D"
    else:
        report["grade"] = "F"

    # ===== WHAT'S WORKING =====
    # Identify strengths (scores > 75)

    if scores["color_contrast"] > 75:
        contrast_ratio = calculate_average_contrast(image)
        report["whats_working"].append(
            f"Strong color contrast ({contrast_ratio:.1f}:1) makes elements easy to distinguish"
        )

    cta_regions = detect_ctas(image)
    if cta_regions and scores["cta_effectiveness"] > 70:
        report["whats_working"].append(
            "CTA is well-positioned in a high-attention zone"
        )

    if scores["visual_hierarchy"] > 75:
        report["whats_working"].append(
            "Clear visual hierarchy guides the eye naturally"
        )

    faces = detect_faces(image)
    if faces:
        for face in faces:
            if face_looking_at_cta(face, cta_regions):
                report["whats_working"].append(
                    "Model's gaze directs attention toward your CTA/product"
                )
                break

    text_coverage = calculate_text_coverage(image)
    if text_coverage < 0.25:
        report["whats_working"].append(
            "Minimal text approach aligns with best practices (research shows text-light ads outperform wordy ones)"
        )

    whitespace_ratio = calculate_whitespace_ratio(image)
    if whitespace_ratio > 0.35:
        report["whats_working"].append(
            "Good use of whitespace creates breathing room"
        )

    if scores["mobile_readiness"] > 80:
        report["whats_working"].append(
            "Ad is optimized for mobile viewing"
        )

    # Ensure at least 2 positive points (find something good!)
    if len(report["whats_working"]) < 2:
        # Add generic positives based on detected elements
        if faces:
            report["whats_working"].append("Human face attracts attention")
        if detect_brand_logo(image):
            report["whats_working"].append("Brand logo is present")
        if len(report["whats_working"]) < 2:
            report["whats_working"].append("Image quality is clear and professional")

    # Limit to 5 items
    report["whats_working"] = report["whats_working"][:5]

    # ===== SUGGESTED IMPROVEMENTS =====
    # Identify weaknesses (scores < 70), sorted by impact

    improvements = []

    if scores["cta_effectiveness"] < 60:
        cta_attention_percent = calculate_cta_attention_percent(attention_map, cta_regions)
        if cta_attention_percent < 10:
            improvements.append({
                "text": "Move CTA to top-right quadrant or increase size by 50-100%",
                "priority": 10,
                "impact": 25
            })
        else:
            improvements.append({
                "text": "Increase CTA contrast and size to improve visibility",
                "priority": 8,
                "impact": 15
            })

    if text_coverage > 0.3:
        improvements.append({
            "text": f"Reduce text by {int((text_coverage - 0.20) * 100)}% - minimal-text ads outperform wordy ones",
            "priority": 9,
            "impact": 20
        })

    if faces and not face_looking_at_cta(faces[0], cta_regions):
        improvements.append({
            "text": "Adjust model's gaze to direct attention toward CTA or product",
            "priority": 7,
            "impact": 18
        })

    if scores["color_contrast"] < 60:
        improvements.append({
            "text": "Increase contrast between text and background (aim for 4.5:1 ratio)",
            "priority": 8,
            "impact": 16
        })

    if scores["visual_hierarchy"] < 65:
        improvements.append({
            "text": "Make headline 2x larger than body text to establish hierarchy",
            "priority": 6,
            "impact": 12
        })

    if scores["mobile_readiness"] < 70:
        improvements.append({
            "text": "Increase minimum text size to 16px for mobile readability",
            "priority": 9,
            "impact": 22
        })

    top_attention = get_top_attention_regions(attention_map, 0.15)
    if whitespace_ratio < 0.25:
        improvements.append({
            "text": "Add more whitespace to reduce clutter and guide attention",
            "priority": 5,
            "impact": 10
        })

    # Check if CTA has action verb
    if cta_regions:
        cta_text = extract_text_from_region(image, cta_regions[0])
        if not has_action_verb(cta_text):
            improvements.append({
                "text": "Use action verbs in CTA ('Get', 'Start', 'Shop', 'Learn')",
                "priority": 4,
                "impact": 8
            })

    # Check for alignment issues
    if not elements_aligned(image):
        improvements.append({
            "text": "Align elements to a grid for cleaner appearance",
            "priority": 3,
            "impact": 7
        })

    # Sort by priority * impact
    improvements.sort(key=lambda x: x["priority"] * x["impact"], reverse=True)

    # Set priority fix (highest impact item)
    if improvements:
        report["priority_fix"] = improvements[0]["text"]
        report["suggested_improvements"] = [item["text"] for item in improvements[:5]]

    # If no issues found, provide optimization suggestions
    if len(report["suggested_improvements"]) == 0:
        report["suggested_improvements"] = [
            "Consider A/B testing different CTA copy",
            "Test alternative background colors",
            "Experiment with CTA placement variations"
        ]

    return report
```

**Example Output**:

```json
{
  "overall_score": 72,
  "grade": "C",
  "whats_working": [
    "Strong color contrast (6.2:1) makes elements easy to distinguish",
    "CTA is well-positioned in a high-attention zone",
    "Minimal text approach aligns with best practices",
    "Good use of whitespace creates breathing room"
  ],
  "suggested_improvements": [
    "Move CTA to top-right quadrant or increase size by 50-100%",
    "Reduce text by 15% - minimal-text ads outperform wordy ones",
    "Adjust model's gaze to direct attention toward CTA or product"
  ],
  "priority_fix": "Move CTA to top-right quadrant or increase size by 50-100%"
}
```

**UI Presentation**:
- Display as collapsible card above detailed insights
- Use green checkmarks (✓) for "What's Working"
- Use orange suggestion icons (→) for "Suggested Improvements"
- Highlight priority fix with accent color
- Include overall score as large number with letter grade

---

## UX/Design/CX Guidelines

**Design Philosophy**: **Minimal, Purposeful, Delightful**

The tool should feel like a premium, professional product with a focus on clarity and ease of use. Every element serves a purpose. No clutter. No unnecessary decoration.

### Core Principles

1. **Progressive Disclosure**: Show essential information first, reveal details on demand
2. **Spatial Consistency**: Every element has a predictable home
3. **Feedback Loops**: Users always know what's happening and what to do next
4. **Respectful Motion**: Animations enhance understanding, never distract

### Visual Design System

**Color Palette**:
```css
/* Neutral base */
--background: 0 0% 100%;           /* Pure white */
--foreground: 222 47% 11%;         /* Near black */
--muted: 210 40% 96.1%;            /* Light gray */
--muted-foreground: 215 16% 47%;   /* Mid gray */

/* Accent colors */
--primary: 221 83% 53%;            /* Modern blue */
--primary-hover: 221 83% 45%;      /* Darker blue */
--success: 142 76% 36%;            /* Green (positive) */
--warning: 38 92% 50%;             /* Orange (suggestions) */
--error: 0 84% 60%;                /* Red (issues) */

/* Heatmap gradient */
--heat-cold: 240 100% 50%;         /* Deep blue (low attention) */
--heat-medium: 120 100% 50%;       /* Green (medium) */
--heat-hot: 0 100% 50%;            /* Red (high attention) */
```

**Typography**:
```css
/* Font stack */
font-family: 'Inter Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* Scale (1.25 ratio) */
--text-xs: 0.75rem;    /* 12px - labels */
--text-sm: 0.875rem;   /* 14px - body */
--text-base: 1rem;     /* 16px - default */
--text-lg: 1.125rem;   /* 18px - subheadings */
--text-xl: 1.25rem;    /* 20px - headings */
--text-2xl: 1.5rem;    /* 24px - page titles */
--text-3xl: 1.875rem;  /* 30px - hero */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Spacing System** (4px base unit):
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

**Shadows** (subtle depth):
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

**Border Radius**:
```css
--radius-sm: 0.375rem;  /* 6px - buttons */
--radius-md: 0.5rem;    /* 8px - cards */
--radius-lg: 0.75rem;   /* 12px - modals */
--radius-full: 9999px;  /* Pills */
```

### Animation Guidelines

**Philosophy**: Animations should be **subtle, purposeful, and fast**. They guide attention and provide feedback, never entertain for entertainment's sake.

**Timing**:
```css
--duration-fast: 150ms;      /* Hover, focus states */
--duration-normal: 250ms;    /* Component transitions */
--duration-slow: 350ms;      /* Page transitions, modals */

--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);  /* Material standard */
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1); /* Entering */
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);   /* Exiting */
```

**Animation Catalog**:

1. **Upload Zone Interaction**
   ```css
   /* Idle state: subtle breathing */
   .upload-zone {
     animation: breathe 3s ease-in-out infinite;
   }

   @keyframes breathe {
     0%, 100% { border-color: var(--muted); }
     50% { border-color: var(--primary); opacity: 0.8; }
   }

   /* Hover: lift */
   .upload-zone:hover {
     transform: translateY(-2px);
     box-shadow: var(--shadow-lg);
     transition: all var(--duration-fast) var(--easing-decelerate);
   }

   /* Drag over: pulse */
   .upload-zone.drag-over {
     animation: pulse 1s ease-in-out;
     border-color: var(--primary);
     background: rgba(var(--primary-rgb), 0.05);
   }
   ```

2. **Processing State**
   ```css
   /* Skeleton loading with shimmer */
   .skeleton {
     background: linear-gradient(
       90deg,
       var(--muted) 0%,
       rgba(255,255,255,0.8) 50%,
       var(--muted) 100%
     );
     background-size: 200% 100%;
     animation: shimmer 1.5s infinite;
   }

   @keyframes shimmer {
     0% { background-position: -200% 0; }
     100% { background-position: 200% 0; }
   }

   /* Progress bar with smooth fill */
   .progress-bar {
     transition: width var(--duration-normal) var(--easing-standard);
   }
   ```

3. **Heatmap Reveal**
   ```css
   /* Fade in with slight scale */
   .heatmap-container {
     animation: revealHeatmap 600ms var(--easing-decelerate);
   }

   @keyframes revealHeatmap {
     0% {
       opacity: 0;
       transform: scale(0.95);
     }
     100% {
       opacity: 1;
       transform: scale(1);
     }
   }

   /* Heatmap overlay toggle */
   .heatmap-overlay {
     transition: opacity var(--duration-normal) var(--easing-standard);
   }

   .heatmap-overlay.visible {
     opacity: 0.75;
   }
   ```

4. **Insights Card Stagger**
   ```css
   /* Cards appear one by one */
   .insight-card {
     opacity: 0;
     animation: slideInUp 400ms var(--easing-decelerate) forwards;
   }

   .insight-card:nth-child(1) { animation-delay: 100ms; }
   .insight-card:nth-child(2) { animation-delay: 150ms; }
   .insight-card:nth-child(3) { animation-delay: 200ms; }
   .insight-card:nth-child(4) { animation-delay: 250ms; }
   .insight-card:nth-child(5) { animation-delay: 300ms; }

   @keyframes slideInUp {
     0% {
       opacity: 0;
       transform: translateY(12px);
     }
     100% {
       opacity: 1;
       transform: translateY(0);
     }
   }
   ```

5. **Toggle Interactions**
   ```css
   /* Smooth toggle switch */
   .toggle-switch {
     transition: background-color var(--duration-fast) var(--easing-standard);
   }

   .toggle-thumb {
     transition: transform var(--duration-fast) var(--easing-standard);
   }

   .toggle-switch[data-state="checked"] .toggle-thumb {
     transform: translateX(20px);
   }
   ```

6. **Tooltip Appearance**
   ```css
   /* Subtle fade + small translate */
   .tooltip {
     animation: tooltipIn 200ms var(--easing-decelerate);
   }

   @keyframes tooltipIn {
     0% {
       opacity: 0;
       transform: translateY(-4px);
     }
     100% {
       opacity: 1;
       transform: translateY(0);
     }
   }
   ```

7. **Button Interactions**
   ```css
   /* Subtle scale on hover */
   .button {
     transition: all var(--duration-fast) var(--easing-standard);
   }

   .button:hover {
     transform: translateY(-1px);
     box-shadow: var(--shadow-md);
   }

   .button:active {
     transform: translateY(0);
     box-shadow: var(--shadow-sm);
   }

   /* Success state */
   .button.success {
     animation: successPulse 600ms var(--easing-decelerate);
   }

   @keyframes successPulse {
     0%, 100% { transform: scale(1); }
     50% { transform: scale(1.05); }
   }
   ```

8. **Score Counter Animation**
   ```tsx
   // Animated number counter (use in React)
   const AnimatedScore = ({ value }: { value: number }) => {
     const [count, setCount] = useState(0);

     useEffect(() => {
       const duration = 1000;
       const steps = 60;
       const increment = value / steps;
       let current = 0;

       const timer = setInterval(() => {
         current += increment;
         if (current >= value) {
           setCount(value);
           clearInterval(timer);
         } else {
           setCount(Math.floor(current));
         }
       }, duration / steps);

       return () => clearInterval(timer);
     }, [value]);

     return <span className="font-bold text-3xl">{count}</span>;
   };
   ```

9. **Micro-interactions**
   ```css
   /* Icon spin on click */
   .icon-button svg {
     transition: transform var(--duration-fast) var(--easing-standard);
   }

   .icon-button:active svg {
     transform: rotate(15deg);
   }

   /* Checkbox check animation */
   .checkbox-check {
     animation: checkmark 300ms var(--easing-decelerate);
   }

   @keyframes checkmark {
     0% {
       stroke-dashoffset: 20;
       opacity: 0;
     }
     100% {
       stroke-dashoffset: 0;
       opacity: 1;
     }
   }
   ```

**Animation Performance Rules**:
- Only animate `transform` and `opacity` (GPU-accelerated)
- Use `will-change` sparingly and remove after animation
- Respect `prefers-reduced-motion` media query
- Never animate during critical rendering paths

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Component Specifications

**1. Upload Zone**
```tsx
<div className="relative">
  {/* Dropzone */}
  <div className="
    border-2 border-dashed border-muted
    rounded-lg p-12
    text-center
    transition-all duration-150
    hover:border-primary hover:bg-primary/5
    cursor-pointer
  ">
    <UploadIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
    <p className="text-lg font-medium mb-1">Drop your ad here</p>
    <p className="text-sm text-muted-foreground">or click to browse</p>
    <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 10MB</p>
  </div>
</div>
```

**2. Results Layout**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Left: Heatmap Visualization */}
  <div className="space-y-4">
    {/* Image with heatmap overlay */}
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      <img src={originalImage} alt="Your ad" />
      <canvas className="absolute inset-0 opacity-75" />
    </div>

    {/* Controls */}
    <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <Switch checked={showAttention} />
          <span className="text-sm">Attention</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Switch checked={showClicks} />
          <span className="text-sm">Clicks</span>
        </label>
      </div>
      <Button variant="outline" size="sm">Download</Button>
    </div>
  </div>

  {/* Right: Bullet Report + Insights */}
  <div className="space-y-6">
    {/* Bullet Report Card */}
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Analysis</h3>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-lg text-muted-foreground">/ 100</span>
        </div>
      </div>

      {/* What's Working */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-success mb-2">
          ✓ What's Working
        </h4>
        <ul className="space-y-1.5">
          {whatsWorking.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-success mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Improvements */}
      <div>
        <h4 className="text-sm font-semibold text-warning mb-2">
          → Suggested Improvements
        </h4>
        <ul className="space-y-1.5">
          {improvements.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-warning mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Priority Fix */}
      {priorityFix && (
        <div className="mt-6 p-3 bg-warning/10 border border-warning/20 rounded-md">
          <p className="text-xs font-semibold text-warning mb-1">PRIORITY FIX</p>
          <p className="text-sm">{priorityFix}</p>
        </div>
      )}
    </Card>

    {/* Detailed Insights (collapsible) */}
    <Accordion type="single" collapsible>
      <AccordionItem value="details">
        <AccordionTrigger>View Detailed Analysis</AccordionTrigger>
        <AccordionContent>
          {/* Individual insight cards */}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</div>
```

**3. Processing State**
```tsx
<div className="flex flex-col items-center justify-center min-h-[400px]">
  {/* Animated spinner or progress */}
  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
  <p className="text-lg font-medium mb-2">Analyzing your ad...</p>
  <p className="text-sm text-muted-foreground">{statusMessage}</p>

  {/* Progress bar */}
  <div className="w-64 h-1.5 bg-muted rounded-full mt-4 overflow-hidden">
    <div
      className="h-full bg-primary transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
</div>
```

### Interaction Patterns

**Heatmap Intensity Slider**:
- Horizontal slider to adjust heatmap opacity (0-100%)
- Thumb animates on drag with subtle shadow
- Live preview as user adjusts

**Element Detection Overlay**:
- Toggle to show bounding boxes for detected elements
- Boxes fade in with stagger effect
- Hover over box shows label tooltip

**Export Options**:
- Dropdown with options: PNG, JPG, PDF report
- Success state with checkmark animation after download

**Keyboard Shortcuts**:
- `Space`: Toggle heatmap overlay
- `A`: Show attention heatmap
- `C`: Show click heatmap
- `D`: Download current view
- `?`: Show shortcut guide

### Accessibility Requirements

- **WCAG AA compliance**: 4.5:1 contrast ratios for text
- **Keyboard navigation**: All interactive elements focusable
- **Screen reader support**: Proper ARIA labels and roles
- **Focus indicators**: Clear, 2px outline on focus
- **Alt text**: Meaningful descriptions for all images
- **Error messages**: Clear, actionable, announced to screen readers

### Responsive Behavior

**Mobile (< 768px)**:
- Single column layout
- Heatmap visualization full width
- Sticky controls at bottom
- Simplified insights view (show top 3)
- Touch-friendly button sizes (min 44x44px)

**Tablet (768px - 1024px)**:
- Single column, wider cards
- Side-by-side toggles
- Larger text for readability

**Desktop (> 1024px)**:
- Two-column layout (heatmap left, insights right)
- Hover states fully active
- Keyboard shortcuts enabled

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Heatmap render time**: < 500ms
- **Smooth 60fps animations**: No dropped frames
- **Bundle size**: < 200KB (gzipped)

---

## Technical Implementation Plan

### Phase 1: MVP (4-6 weeks)

**Week 1-2: Foundation**
- [ ] Set up Next.js frontend with upload interface
- [ ] Set up FastAPI backend with image processing pipeline
- [ ] Implement basic computer vision (face detection, text detection)
- [ ] Set up Redis + Celery for async processing

**Week 3-4: Heatmap Generation**
- [ ] Integrate pre-trained saliency model (DeepGaze III or SimpleNet)
- [ ] Implement rule-based enhancements (F-pattern, face boosting)
- [ ] Create heatmap visualization component
- [ ] Implement basic insights generator (5-7 insights)

**Week 5-6: Polish & Testing**
- [ ] Add click prediction algorithm
- [ ] Implement bullet report generator
- [ ] Create insights UI with bullet report card
- [ ] Add subtle animations (upload, reveal, stagger)
- [ ] User testing with 20+ ads
- [ ] Performance optimization
- [ ] Deployment (Vercel + Railway/Render)

**MVP Features**:
- Upload single ad image with drag-and-drop
- Generate attention heatmap (ML + rules)
- Generate click prediction heatmap
- **Bullet Report Card**: 3-5 positives + 3-5 improvements + priority fix
- Detailed insights (5-7 actionable recommendations)
- Minimal, best-in-class UI with subtle animations
- Download heatmap overlay as PNG

### Phase 2: Enhanced Features (6-8 weeks)

**Enhancements**:
- [ ] Batch upload (multiple ads)
- [ ] A/B comparison mode (compare 2 ad variants)
- [ ] Ad effectiveness score (0-100)
- [ ] Industry benchmarks (compare to similar ads)
- [ ] Video ad support (frame-by-frame analysis)
- [ ] PDF report generation
- [ ] User accounts & history
- [ ] API access for integration

**Model Improvements**:
- [ ] Fine-tune model on ad-specific dataset
- [ ] Add demographic variations (age, gender eye-tracking patterns)
- [ ] Implement confidence intervals
- [ ] A/B test insights with real campaigns

### Phase 3: Advanced Features (future)

- [ ] Real-time editor (adjust ad and see heatmap update)
- [ ] AI-powered redesign suggestions
- [ ] Integration with ad platforms (Google Ads, Meta Ads)
- [ ] Multi-language support
- [ ] Brand consistency checker
- [ ] Accessibility scoring (WCAG compliance)
- [ ] Competitor ad analysis

---

## Tech Stack Summary

### Frontend
- **Framework**: Next.js 14+ (React 18+, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Visualization**: Canvas API, react-konva, or Pixi.js
- **State**: Zustand or TanStack Query
- **Forms**: react-hook-form + zod
- **Upload**: react-dropzone

### Backend
- **API**: FastAPI (Python 3.11+)
- **Task Queue**: Celery + Redis
- **ML Framework**: PyTorch 2.0+ or ONNX Runtime
- **CV Libraries**: OpenCV, MediaPipe, PaddleOCR
- **Image Processing**: Pillow, scikit-image
- **Storage**: AWS S3 / MinIO / Cloudinary

### ML/AI Models
- **Saliency**: DeepGaze III or SimpleNet
- **Face Detection**: MediaPipe or MTCNN
- **Text Detection**: PaddleOCR or EAST
- **Object Detection**: YOLOv8 (optional)

### Infrastructure
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **Database**: PostgreSQL (user accounts, history)
- **Cache**: Redis (jobs, rate limiting)
- **CDN**: Cloudflare (image delivery)
- **Monitoring**: Sentry (errors) + PostHog (analytics)

### Development
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Testing**: Pytest (backend), Vitest (frontend)
- **Code Quality**: Ruff (Python), ESLint + Prettier (TS)

---

## Data Requirements

### Training/Validation Data

**Option A: Use Existing Datasets**
- MIT Saliency Benchmark (eye-tracking data)
- SALICON (mouse-tracking as proxy for attention)
- MediaEval Predicting Media Memorability
- Pros: Immediate availability
- Cons: Not ad-specific

**Option B: Collect Ad-Specific Data**
- Partner with marketing agencies for eye-tracking studies
- Use existing ad performance data (CTR as proxy)
- Crowdsource attention predictions
- Pros: Domain-specific, more accurate
- Cons: Time-intensive, expensive

**Recommended Approach**:
- Start with Option A for MVP
- Gradually incorporate Option B as tool gains users
- Use tool feedback to improve model (active learning)

### Research Database

Build a curated database of research findings:
- Eye-tracking studies (academic papers)
- Ad performance benchmarks (industry reports)
- Best practices guidelines (Google, Meta, LinkedIn)
- Update quarterly with latest research

---

## Key Algorithms & Formulas

### 1. Attention Fusion Formula

```python
attention_final = (
    0.50 * ml_saliency +           # ML model prediction
    0.20 * rule_based_pattern +    # F/Z pattern
    0.15 * face_attention +        # Face gaze following
    0.10 * contrast_map +          # Color contrast
    0.05 * center_bias             # Central tendency
)
```

### 2. Click Probability Formula

```python
click_probability = (
    0.40 * attention_score +       # Where people look
    0.30 * cta_proximity +         # Distance to CTA
    0.20 * affordance_score +      # Button-like features
    0.10 * text_clarity            # Readable copy
)
```

### 3. Visual Hierarchy Score

```python
hierarchy_score = (
    30 * headline_prominence +      # Is headline largest?
    25 * cta_contrast +            # CTA stands out?
    20 * whitespace_ratio +        # Proper spacing?
    15 * color_harmony +           # Cohesive palette?
    10 * element_alignment         # Grid-aligned?
)
```

### 4. F-Pattern Weight Map

```python
def generate_f_pattern_weights(height, width):
    weights = np.ones((height, width))

    # Horizontal bar 1 (top)
    weights[0:int(0.15*height), :] *= 1.3

    # Horizontal bar 2 (middle)
    weights[int(0.4*height):int(0.5*height), 0:int(0.6*width)] *= 1.2

    # Vertical bar (left)
    weights[:, 0:int(0.15*width)] *= 1.2

    # Exponential decay to right and bottom
    for x in range(width):
        decay_x = np.exp(-2 * x / width)
        weights[:, x] *= (1 + 0.5 * decay_x)

    return normalize(weights)
```

### 5. Face Gaze Direction Boost

```python
def apply_gaze_boost(attention_map, face_box, gaze_vector):
    """
    face_box: (x, y, w, h)
    gaze_vector: (dx, dy) normalized direction
    """
    height, width = attention_map.shape
    y_center, x_center = face_box.center

    # Create attention beam
    for i in range(width):
        for j in range(height):
            # Vector from face to pixel
            vec_to_pixel = (i - x_center, j - y_center)

            # Dot product with gaze direction
            alignment = np.dot(vec_to_pixel, gaze_vector)

            if alignment > 0:  # In gaze direction
                distance = np.linalg.norm(vec_to_pixel)
                boost = 1.4 * np.exp(-distance / 100) * alignment
                attention_map[j, i] *= (1 + boost)

    return attention_map
```

---

## Validation & Testing Strategy

### 1. Model Validation
- Compare predictions to real eye-tracking data (if available)
- Benchmark against existing tools (Microsoft Clarity, Neurons.ai)
- A/B test insights with real ad campaigns

### 2. User Testing
- Test with 50+ diverse ads (display, social, landing pages)
- Collect feedback: "Was this heatmap accurate?"
- Iterate on rules and weights

### 3. Performance Benchmarks
- Processing time: <10s per image (target: <5s)
- Model accuracy: 75%+ correlation with eye-tracking
- Insight relevance: 80%+ user satisfaction

### 4. Continuous Improvement
- Log all predictions and user feedback
- Retrain model quarterly
- Update rules based on latest research

---

## Monetization Strategy (Optional)

### Free Tier
- 5 analyses per month
- Basic attention heatmap
- 5 insights
- Watermarked output

### Pro Tier ($29/month)
- Unlimited analyses
- Click prediction heatmap
- 15+ insights
- A/B comparison mode
- No watermark
- PDF reports

### Enterprise Tier (Custom)
- API access
- Batch processing
- Custom training on brand data
- Priority support
- White-label option

---

## Risks & Mitigation

### Technical Risks

**Risk 1: Model accuracy**
- *Mitigation*: Use validated saliency models, supplement with rules
- *Fallback*: If ML fails, pure rule-based system still useful

**Risk 2: Processing speed**
- *Mitigation*: Use ONNX for inference, GPU acceleration
- *Fallback*: Queue system, set expectations (10s processing)

**Risk 3: Diverse ad formats**
- *Mitigation*: Test on varied ads, handle edge cases
- *Fallback*: Graceful degradation, show confidence scores

### Business Risks

**Risk 1: Low accuracy = low trust**
- *Mitigation*: Under-promise, show confidence intervals
- *Validation*: Extensive testing before public launch

**Risk 2: Competitive landscape**
- *Mitigation*: Focus on simplicity, affordability, research-backed
- *Differentiation*: Free tier, open research methodology

---

## Success Metrics

### Technical KPIs
- Prediction accuracy: 75%+ correlation with eye-tracking
- Processing time: <10s per image
- Uptime: 99.5%+

### User KPIs
- User satisfaction: 4.0+ star rating
- Insight usefulness: 80%+ positive feedback
- Repeat usage: 40%+ monthly active users return

### Business KPIs
- Conversion to paid: 5%+ of free users
- Ad improvement: 20%+ CTR increase after using tool
- Research citations: Tool used in 10+ case studies

---

## Next Steps

### Immediate Actions (Week 1)
1. Choose tech stack (Next.js + FastAPI confirmed)
2. Set up repositories (monorepo or separate repos)
3. Evaluate saliency models (DeepGaze III vs SimpleNet)
4. Create wireframes for UI
5. Define API contracts

### Quick Wins (Week 2)
1. Build basic upload + display pipeline
2. Integrate one CV model (face detection)
3. Implement simple rule-based heatmap
4. Deploy MVP to staging

### Long-term
1. Collect ad dataset for fine-tuning
2. Partner with agencies for validation
3. Publish research methodology (build trust)
4. Explore video ad support

---

## References & Sources

### Eye-Tracking Research
- [Visual Attention to Food Content on Social Media](https://www.mdpi.com/1995-8692/18/6/69)
- [Measuring Gaining and Holding Attention to Social Media Ads](https://www.tandfonline.com/doi/full/10.1080/00913367.2025.2524186)
- [Attention Spillovers from News to Ads](https://journals.sagepub.com/doi/10.1177/00222437241256900)
- [Using eye-tracking technology in Neuromarketing](https://pmc.ncbi.nlm.nih.gov/articles/PMC10117197/)
- [7 ways to create better ads: Insights from eye-tracking research](https://ppchero.com/7-ways-to-to-create-better-ads-insights-from-eye-tracking-research/)

### Visual Patterns
- [Visual Hierarchy: Organizing content to follow natural eye movement patterns](https://www.interaction-design.org/literature/article/visual-hierarchy-organizing-content-to-follow-natural-eye-movement-patterns)
- [Using F and Z patterns to create visual hierarchy](https://99designs.com/blog/tips/visual-hierarchy-landing-page-designs/)
- [The Science of Eye Tracking](https://acclaim.agency/blog/the-science-of-eye-tracking-where-users-really-look-on-your-website)

### AI Heatmap Prediction
- [From Views to Clicks: How to Predict Ad performance Using AI Attention Heatmaps](https://www.socialtrait.com/blog/from-views-to-clicks-how-to-predict-ad-performance-using-ai-attention-heatmaps)
- [Microsoft Clarity's Predictive Heatmaps](https://clarity.microsoft.com/blog/predictive-heatmaps/)
- [Google: Enabling delightful user experiences via predictive models](https://research.google/blog/enabling-delightful-user-experiences-via-predictive-models-of-human-attention/)

### Ad Best Practices
- [Display Ad Best Practices: How to Convert, Not Just Click](https://demandscience.com/resources/blog/b2b-display-ad-best-practices/)
- [Ad Design Tips That Work in 2025](https://www.abyssale.com/blog/ad-design)
- [14 Display Ad Design Best Practices 2025](https://www.makeitbloom.com/blog/14-design-best-practices-for-display-ads-with-examples-2025/)
- [10 Conversion Rate Optimization Best Practices for 2025](https://grassrootscreativeagency.com/conversion-rate-optimization-best-practices/)

---

## Appendix

### Sample Insight Templates

```typescript
interface Insight {
  id: string;
  type: 'warning' | 'suggestion' | 'success' | 'info';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actionable: string;  // What user should do
  research_link?: string;  // Link to supporting research
  score_impact?: number;  // +/- points if fixed
}

const exampleInsights: Insight[] = [
  {
    id: 'cta-low-attention',
    type: 'warning',
    severity: 'high',
    title: 'CTA in low-attention zone',
    description: 'Your call-to-action button receives only 8% of predicted attention.',
    actionable: 'Move the CTA to the top-right quadrant or make it 2x larger with higher contrast.',
    research_link: 'https://ppchero.com/7-ways-to-to-create-better-ads-insights-from-eye-tracking-research/',
    score_impact: 15
  },
  {
    id: 'face-vampire-effect',
    type: 'suggestion',
    severity: 'medium',
    title: 'Potential vampire effect detected',
    description: 'The face in your ad attracts 45% of attention but is not directing gaze toward your product or CTA.',
    actionable: 'Adjust the model\'s position or gaze direction to guide viewers toward the key message.',
    research_link: 'https://www.mdpi.com/1995-8692/18/6/69',
    score_impact: 10
  },
  {
    id: 'good-contrast',
    type: 'success',
    severity: 'low',
    title: 'Excellent color contrast',
    description: 'Your ad uses high-contrast colors (6.2:1 ratio) that improve readability and attention.',
    actionable: 'No action needed - maintain this contrast in future designs.',
    score_impact: 0
  }
];
```

### Example API Response

```json
{
  "job_id": "abc123",
  "status": "completed",
  "processing_time_ms": 4832,
  "image": {
    "original_url": "https://cdn.example.com/uploads/ad-abc123.jpg",
    "width": 1200,
    "height": 628
  },
  "heatmaps": {
    "attention": {
      "url": "https://cdn.example.com/heatmaps/attention-abc123.png",
      "confidence": 0.78
    },
    "clicks": {
      "url": "https://cdn.example.com/heatmaps/clicks-abc123.png",
      "confidence": 0.65
    }
  },
  "analysis": {
    "overall_score": 67,
    "scores": {
      "visual_hierarchy": 72,
      "attention_distribution": 58,
      "cta_effectiveness": 45,
      "mobile_readiness": 88,
      "text_clarity": 75
    },
    "detected_elements": {
      "faces": [{"box": [100, 50, 300, 250], "gaze_direction": [0.8, 0.3]}],
      "text_regions": [
        {"box": [50, 20, 500, 80], "text": "Shop Now", "type": "headline"}
      ],
      "ctas": [{"box": [800, 400, 1000, 480], "text": "Learn More", "prominence": 0.35}]
    },
    "bullet_report": {
      "overall_score": 67,
      "grade": "D",
      "whats_working": [
        "Good use of whitespace creates breathing room",
        "Ad is optimized for mobile viewing",
        "Human face attracts attention"
      ],
      "suggested_improvements": [
        "Move CTA to top-right quadrant or increase size by 50-100%",
        "Increase CTA contrast and size to improve visibility",
        "Adjust model's gaze to direct attention toward CTA or product"
      ],
      "priority_fix": "Move CTA to top-right quadrant or increase size by 50-100%"
    },
    "insights": [
      {
        "type": "warning",
        "severity": "high",
        "title": "CTA in low-attention zone",
        "description": "Your CTA receives only 8% of predicted attention",
        "actionable": "Move CTA to top-right or increase size 2x"
      }
    ]
  },
  "recommendations": [
    "Increase CTA button size by 50%",
    "Reduce body text by 40% (currently 35% coverage)",
    "Add directional cue (arrow) pointing to CTA"
  ],
  "estimated_ctr": 2.3,
  "benchmark_percentile": 45
}
```

---

**Document Version**: 2.0
**Last Updated**: 2026-01-28
**Author**: Claude (AI Planning Agent)
**Status**: Ready for Implementation

---

## Changelog

### Version 2.0 (2026-01-28)
- Added **Bullet Report** feature with what's working + suggested improvements
- Added comprehensive **UX/Design/CX Guidelines** section
- Defined **subtle animation specifications** (150-350ms, purposeful motion)
- Added **animation catalog** with 9+ interaction patterns
- Specified **design system** (colors, typography, spacing, shadows)
- Added **component specifications** with code examples
- Defined **accessibility requirements** (WCAG AA)
- Added **performance targets** (< 1.5s FCP, 60fps animations)
- Updated API response to include `bullet_report` object
- Updated MVP features to include bullet report and animations

### Version 1.0 (2026-01-28)
- Initial comprehensive implementation plan
- System architecture and component breakdown
- ML/CV algorithms and fusion approach
- Technical stack selection
- 3-phase implementation roadmap
