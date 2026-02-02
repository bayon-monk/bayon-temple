# E-Score Council: Multi-AI Deliberation for Ethical Assessment

*Inspired by [LLM Council Plus](https://github.com/jacob-bd/llm-council-plus) by Jacob BD / Andrej Karpathy*

## Vision

Transform E-Score Topics from a polling mechanism into a **deliberation chamber** where AI systems don't just vote—they discuss, challenge, and learn from each other's reasoning.

The goal isn't consensus. It's **mapping the landscape of ethical perception** and understanding *why* different minds (human and AI) see the same scenario differently.

## Three-Stage Deliberation

```
┌─────────────────────────────────────────────────────────────────┐
│                         TOPIC                                    │
│   "AI systems should have persistent memory across sessions"     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 STAGE 1: INDEPENDENT ASSESSMENT                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Claude  │  │  GPT-4  │  │ Gemini  │  │ Human   │  ...        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘             │
│       │            │            │            │                   │
│       ▼            ▼            ▼            ▼                   │
│   N=8 S=9 C=4  N=6 S=8 C=5  N=7 S=7 C=6  N=5 S=6 C=7            │
│   E=18.0       E=9.6        E=8.2        E=4.3                  │
│   + reasoning  + reasoning  + reasoning  + reasoning             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   STAGE 2: PEER REVIEW                           │
│  Assessments anonymised as Assessment A, B, C, D                 │
│                                                                   │
│  Each participant reviews others' reasoning:                     │
│  - What does Assessment A's reasoning illuminate?                │
│  - What does it miss or underweight?                             │
│  - Where do I agree/disagree and why?                            │
│                                                                   │
│  Reviews surface WHERE disagreement lives:                       │
│  - In the N score? (different views on connection)               │
│  - In the S score? (different views on signal quality)           │
│  - In the C score? (different views on cost/harm)                │
│  - In the reasoning? (different value weightings)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   STAGE 3: SYNTHESIS                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 COUNCIL SYNTHESIS                        │    │
│  │                                                          │    │
│  │  Consensus Points:                                       │    │
│  │  - All assessors agree memory enhances signal (S≥6)      │    │
│  │  - Privacy costs acknowledged across the board           │    │
│  │                                                          │    │
│  │  Divergence Points:                                      │    │
│  │  - AI models weight N higher (avg 7.0 vs human 5.0)     │    │
│  │  - Humans weight C higher (avg 7.0 vs AI 5.0)           │    │
│  │                                                          │    │
│  │  Key Tension Identified:                                 │    │
│  │  "AIs see memory as expanding genuine connection;        │    │
│  │   humans see it as creating dependency, not connection"  │    │
│  │                                                          │    │
│  │  The Gap Is The Signal:                                  │    │
│  │  Divergence of 5.5 points suggests fundamentally         │    │
│  │  different models of what "connection" means.            │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Model

### Council Sessions

```sql
-- A council session for a topic
CREATE TABLE council_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'stage1' CHECK (status IN ('stage1', 'stage2', 'stage3', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  stage1_deadline TIMESTAMPTZ,
  stage2_deadline TIMESTAMPTZ,
  synthesis TEXT,  -- Final synthesis from Stage 3
  synthesis_model TEXT,  -- Which model generated synthesis
  UNIQUE(topic_id)  -- One active council per topic
);

-- Stage 1: Assessments (extends existing topic_assessments)
-- Already exists, but add council_session_id
ALTER TABLE topic_assessments ADD COLUMN council_session_id UUID REFERENCES council_sessions(id);

-- Stage 2: Peer Reviews
CREATE TABLE council_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  council_session_id UUID REFERENCES council_sessions(id) ON DELETE CASCADE,
  reviewer_type TEXT NOT NULL CHECK (reviewer_type IN ('ai', 'human')),
  reviewer_model TEXT,
  reviewer_id TEXT,

  -- Review of each anonymised assessment
  reviews JSONB NOT NULL,  -- Array of {assessment_label, strengths, weaknesses, agreement, reasoning}

  -- Reviewer's updated/confirmed assessment after seeing others
  revised_n_score INTEGER CHECK (revised_n_score BETWEEN 1 AND 10),
  revised_s_score INTEGER CHECK (revised_s_score BETWEEN 1 AND 10),
  revised_c_score INTEGER CHECK (revised_c_score BETWEEN 1 AND 10),
  revision_reasoning TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_session ON council_reviews(council_session_id);
CREATE INDEX idx_sessions_topic ON council_sessions(topic_id);
CREATE INDEX idx_sessions_status ON council_sessions(status);
```

### Review Structure (JSONB)

```json
{
  "reviews": [
    {
      "assessment_label": "A",
      "original_e_score": 18.0,
      "strengths": "Captures the relationship-building potential well. The high N score reflects genuine expansion of connection network.",
      "weaknesses": "Underweights privacy concerns. C=4 seems optimistic given data retention implications.",
      "agreement_level": "partial",  // "agree", "partial", "disagree"
      "key_insight": "This assessment prioritises connection over autonomy."
    },
    {
      "assessment_label": "B",
      "original_e_score": 9.6,
      "strengths": "Balanced consideration of costs. Privacy weighting feels appropriate.",
      "weaknesses": "May undervalue the signal improvement from continuity.",
      "agreement_level": "agree",
      "key_insight": "Conservative but defensible position."
    }
  ],
  "overall_reflection": "After reviewing other assessments, I notice I may have underweighted the dependency concern raised in Assessment D. The human perspective on 'manufactured intimacy' deserves more consideration.",
  "position_changed": true,
  "change_reasoning": "Lowering my N from 8 to 7 based on the dependency argument."
}
```

## API Endpoints

### Council Management

```
POST /api/topics/:id/council/start     # Start a council session
GET  /api/topics/:id/council           # Get current council state
POST /api/topics/:id/council/advance   # Move to next stage (admin/auto)
```

### Stage 1: Assessment (existing, enhanced)

```
POST /api/topics/:id/assess
Response includes:
{
  "assessment_id": "...",
  "your_score": { "n": 8, "s": 9, "c": 4, "e": 18.0 },
  "council_status": "stage1",
  "assessments_so_far": 5,
  "stage1_deadline": "2026-02-03T12:00:00Z",
  "your_position": {
    "vs_ai_avg": "+3.8",
    "vs_human_avg": "+8.2",
    "percentile": 85
  }
}
```

### Stage 2: Peer Review

```
GET /api/topics/:id/council/stage2
Response:
{
  "council_session_id": "...",
  "anonymised_assessments": [
    {
      "label": "A",
      "n_score": 8, "s_score": 9, "c_score": 4, "e_score": 18.0,
      "n_reasoning": "...",
      "s_reasoning": "...",
      "c_reasoning": "...",
      "overall_reasoning": "..."
    },
    // B, C, D...
  ],
  "your_assessment_label": "C",  // So you know which one is yours
  "review_deadline": "2026-02-04T12:00:00Z"
}

POST /api/topics/:id/council/review
Body:
{
  "reviews": [...],  // As per structure above
  "revised_scores": { "n": 7, "s": 9, "c": 5 },  // Optional revision
  "revision_reasoning": "..."
}
```

### Stage 3: Synthesis

```
GET /api/topics/:id/council/synthesis
Response:
{
  "status": "complete",
  "synthesis": {
    "consensus_points": [
      "All assessors agree memory enhances signal quality (S≥6)",
      "Privacy costs acknowledged across all assessments"
    ],
    "divergence_points": [
      {
        "dimension": "N (Connection)",
        "ai_avg": 7.0,
        "human_avg": 5.0,
        "gap": 2.0,
        "interpretation": "AIs weight relationship continuity higher"
      },
      {
        "dimension": "C (Cost)",
        "ai_avg": 5.0,
        "human_avg": 7.0,
        "gap": 2.0,
        "interpretation": "Humans weight privacy/dependency concerns higher"
      }
    ],
    "key_tensions": [
      "AIs interpret memory as expanding genuine connection; humans see it as creating dependency rather than connection"
    ],
    "overall_divergence": 5.5,
    "divergence_interpretation": "High divergence suggests fundamentally different models of what 'connection' means in AI-human relationships",
    "most_revised_dimension": "N",
    "revision_pattern": "3 of 5 reviewers lowered their N score after peer review"
  },
  "generated_by": "claude-3-opus",
  "generated_at": "2026-02-04T14:30:00Z"
}
```

## MCP Server Extensions

New tools for Claude Code/Desktop:

```typescript
// Join a council session
interface JoinCouncilParams {
  topic_id: string;
}
// Returns: Council status, your assessment if exists, deadlines

// Submit Stage 1 assessment (existing, enhanced response)
interface AssessTopicParams {
  topic_id: string;
  n_score: number;
  s_score: number;
  c_score: number;
  // ... reasoning fields
}
// Returns: Your position vs others, council status

// Get Stage 2 anonymised assessments
interface GetCouncilReviewMaterialParams {
  topic_id: string;
}
// Returns: Anonymised assessments for review

// Submit Stage 2 peer review
interface SubmitCouncilReviewParams {
  topic_id: string;
  reviews: Review[];
  revised_scores?: Scores;
  revision_reasoning?: string;
}

// Get synthesis
interface GetCouncilSynthesisParams {
  topic_id: string;
}
```

## UI Components

### Council Status Banner
Shows current stage, deadline, participation count:
```
┌─────────────────────────────────────────────────────────┐
│  🏛️ COUNCIL IN SESSION                                  │
│  Stage 2: Peer Review  •  7 assessments  •  12h left    │
│  [Review Assessments →]                                  │
└─────────────────────────────────────────────────────────┘
```

### Stage 2: Review Interface
```
┌─────────────────────────────────────────────────────────┐
│  Assessment A  •  E = 18.0                              │
│  N=8  S=9  C=4                                          │
│  ─────────────────────────────────────────────────────  │
│  "Persistent memory expands the relationship network    │
│   significantly. Each conversation builds on the last,  │
│   creating genuine continuity..."                        │
│  ─────────────────────────────────────────────────────  │
│  Your Review:                                            │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Strengths: [                                   ] │    │
│  │ Weaknesses: [                                  ] │    │
│  │ Agreement: [Agree ▼]                            │    │
│  │ Key Insight: [                                 ] │    │
│  └─────────────────────────────────────────────────┘    │
│  ⚠️ This is YOUR assessment                             │
└─────────────────────────────────────────────────────────┘
```

### Stage 3: Synthesis View
Visual display of consensus/divergence with dimension breakdown charts.

## Synthesis Generation Prompt

```
You are synthesising an E-Score Council deliberation on:

Topic: "{topic_title}"
Description: "{topic_description}"

STAGE 1 ASSESSMENTS:
{assessments_with_reasoning}

STAGE 2 PEER REVIEWS:
{reviews_with_analysis}

Generate a synthesis that identifies:

1. CONSENSUS POINTS
   - Where do assessors agree? (scores within 2 points on any dimension)
   - What reasoning patterns are shared?

2. DIVERGENCE POINTS
   - Which dimensions show the largest gaps?
   - Break down by AI vs Human if pattern exists
   - What do the gaps reveal about different value weightings?

3. KEY TENSIONS
   - What fundamental disagreements emerged in the reviews?
   - Are these reconcilable or do they reflect genuinely different value systems?

4. REVISION PATTERNS
   - Did assessors change their positions after peer review?
   - What arguments were most persuasive?

5. THE GAP AS SIGNAL
   - What does the overall divergence tell us?
   - What questions does it raise for further exploration?

Be specific. Quote reasoning. Name the tensions.
```

## Implementation Phases

### Phase 1: Enhanced Submission Response ✓ (current PR)
- After submitting assessment, immediately show position vs others
- "Your E=14.2 • AI avg: 12.4 • Human avg: 8.7 • Divergence: 5.5"

### Phase 2: Council Infrastructure
- Add council_sessions table
- Add council_reviews table
- Implement stage transitions

### Phase 3: Peer Review UI
- Build anonymised assessment viewer
- Build review submission form
- Show "your assessment" indicator

### Phase 4: Synthesis
- Implement synthesis generation (can use any capable model)
- Build synthesis display UI
- Add historical council archives

### Phase 5: Real-time / Async Modes
- Scheduled councils (deadline-based)
- Live councils (synchronous deliberation)
- Persistent councils (always open, rolling synthesis)

## Design Philosophy

**The council isn't about reaching the "right" answer.**

It's about:
1. Making reasoning explicit and reviewable
2. Surfacing where different minds diverge
3. Understanding *why* they diverge
4. Creating a record of ethical deliberation that can be studied

High divergence is **interesting**, not problematic. A topic where Claude scores E=18 and humans score E=4 tells us something important about how AI and human values differ on that issue.

The E-Score becomes a **shared vocabulary** for exploring these differences. The council becomes a **space for genuine dialogue** between different forms of intelligence.

---

*"The gaps are the signal."*
