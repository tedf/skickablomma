# Ad Heatmap Analyzer

AI-powered digital ad heatmap analyzer with attention and click predictions. Upload your ad images and get actionable insights based on eye-tracking research.

## Features

- **Attention Heatmap**: Predicts where viewers will look based on eye-tracking research
- **Click Prediction Heatmap**: Predicts where viewers will click
- **Bullet Report**: Quick summary of what's working and what to improve
- **Detailed Insights**: Actionable recommendations based on ad best practices
- **Element Detection**: Detects faces, text, and CTAs in your ads

## Tech Stack

### Frontend
- Next.js 14+ (React 18+, TypeScript)
- Tailwind CSS
- Radix UI primitives
- react-dropzone for file uploads

### Backend
- FastAPI (Python 3.11+)
- OpenCV for image processing
- NumPy for heatmap generation
- MediaPipe for face detection (optional)
- PaddleOCR for text detection (optional)

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

The frontend will be available at http://localhost:3000

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install minimal dependencies (faster, no ML)
pip install -r requirements-minimal.txt

# Or install full dependencies (includes ML models)
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start development server
python run.py
```

The API will be available at http://localhost:8000

API documentation: http://localhost:8000/docs

## Project Structure

```
ad-heatmap-tool/
├── frontend/                    # Next.js frontend
│   ├── src/
│   │   ├── app/                # Next.js app router
│   │   ├── components/         # React components
│   │   │   ├── ui/            # UI primitives
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── HeatmapVisualization.tsx
│   │   │   ├── BulletReport.tsx
│   │   │   └── InsightCard.tsx
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   └── types/             # TypeScript types
│   └── package.json
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── core/              # Configuration
│   │   ├── models/            # Pydantic models
│   │   └── services/          # Business logic
│   │       ├── analyzer.py    # Main orchestration
│   │       ├── cv_detector.py # Face/text detection
│   │       ├── heatmap_generator.py
│   │       └── insights_generator.py
│   ├── static/                # Uploaded files and heatmaps
│   ├── requirements.txt
│   └── run.py
│
└── README.md
```

## API Endpoints

### POST /api/v1/analyze
Upload an image for analysis.

**Request**: `multipart/form-data` with `image` field

**Response**:
```json
{
  "job_id": "abc123",
  "message": "Image uploaded successfully"
}
```

### GET /api/v1/analyze/{job_id}
Get analysis status and results.

**Response**:
```json
{
  "job_id": "abc123",
  "status": "completed",
  "processing_time_ms": 4832,
  "image": {
    "original_url": "/static/uploads/image.jpg",
    "width": 1200,
    "height": 628
  },
  "heatmaps": {
    "attention": { "url": "/static/heatmaps/attention.png", "confidence": 0.78 },
    "clicks": { "url": "/static/heatmaps/clicks.png", "confidence": 0.65 }
  },
  "analysis": {
    "overall_score": 72,
    "bullet_report": {
      "grade": "C",
      "whats_working": ["..."],
      "suggested_improvements": ["..."],
      "priority_fix": "..."
    },
    "insights": [...]
  }
}
```

## Algorithm Overview

### Attention Prediction

The attention heatmap is generated using a hybrid approach:

1. **Color Saliency** (35%): Identifies visually distinct areas using LAB color space
2. **Pattern Weighting** (20%): Applies F-pattern or Z-pattern based on content type
3. **Face Boosting** (20%): Increases attention weight on detected faces
4. **Contrast Map** (15%): Highlights high-contrast edges
5. **Center Bias** (10%): Applies natural center-viewing tendency

### Click Prediction

Click probability is calculated from:

1. **Attention Score** (40%): Where people look correlates with clicks
2. **CTA Proximity** (30%): Distance to detected CTAs
3. **Text Clarity** (15%): Readable text areas
4. **Visual Affordance** (15%): Button-like elements

### Scoring System

- **Visual Hierarchy**: Element sizes and positions
- **Attention Distribution**: How well attention is spread
- **CTA Effectiveness**: CTA placement in attention zones
- **Mobile Readiness**: Text size adequacy for mobile
- **Text Clarity**: OCR confidence scores
- **Color Contrast**: Estimated from attention variance

## Research Sources

- Nielsen Norman Group - F-pattern study (232 users)
- Microsoft Clarity - Predictive heatmaps research
- Google "Think with Google" - Display ad research
- Academic eye-tracking validation studies

## Development

### Running Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Code Quality

```bash
# Backend
cd backend
ruff check .
ruff format .

# Frontend
cd frontend
npm run lint
```

## License

MIT
