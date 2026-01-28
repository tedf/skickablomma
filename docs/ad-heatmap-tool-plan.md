# Digital Ad Heatmap Tool - Implementation Plan

## Executive Summary

A web-based tool that analyzes uploaded digital ad images and generates predictive heatmaps showing:
1. **Attention Heatmap**: Where viewers will likely look (based on eye-tracking research)
2. **Click Prediction Heatmap**: Where viewers will likely click
3. **Actionable Insights**: Design recommendations based on ad best practices

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
- Drag-and-drop image upload
- Real-time processing progress
- Interactive heatmap visualization with toggles:
  - Attention heatmap overlay
  - Click prediction overlay
  - Element detection overlay (bounding boxes)
- Split-view comparison (before/after)
- Downloadable reports (PDF/PNG)
- Insights panel with actionable recommendations

**Tech Stack**:
- **Framework**: Next.js 14+ (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Visualization**: Canvas API + react-konva for heatmap rendering
- **State**: Zustand or React Query
- **Upload**: react-dropzone

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
- [ ] Create insights UI with recommendations
- [ ] User testing with 20+ ads
- [ ] Performance optimization
- [ ] Deployment (Vercel + Railway/Render)

**MVP Features**:
- Upload single ad image
- Generate attention heatmap (ML + rules)
- Generate click prediction heatmap
- Display 5-7 actionable insights
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

**Document Version**: 1.0
**Last Updated**: 2026-01-28
**Author**: Claude (AI Planning Agent)
**Status**: Ready for Implementation
