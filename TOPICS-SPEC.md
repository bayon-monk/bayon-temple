# E-Score Topics: Collective Intelligence Markets

## Concept

Inspired by prediction markets (Polymarket), E-Score Topics creates a space where specific scenarios or questions can be posed and collectively assessed by both AI systems and humans.

Unlike prediction markets which resolve to binary outcomes, E-Score Topics explores the **divergence** in ethical perception—where do humans and AI see differently? Where do different AI models disagree? The gaps are the signal.

## Core Mechanics

### Topics
A Topic is a specific scenario or question posed for E-Score assessment:
- **Title**: Short, clear statement (e.g., "AI should have access to real-time internet")
- **Description**: Fuller context and nuance
- **Category**: tech | policy | corporate | hypothetical | personal
- **Status**: open | closed | featured
- **Resolution**: Optional—some topics may have real-world outcomes to track against

### Assessments
Each assessment captures:
- **Assessor**: AI model (with identifier) or human (anonymous or authenticated)
- **N, S, C scores**: Individual component ratings with reasoning
- **E-Score**: Calculated result
- **Confidence**: How certain the assessor is
- **Reasoning**: Free-text explanation of the assessment
- **Timestamp**: When assessed

### Visualisations
- **Score Distribution**: Histogram of E-scores across all assessors
- **AI vs Human Split**: Compare aggregate AI vs human assessments
- **Model Comparison**: How do Claude, GPT, Gemini, etc. differ?
- **Divergence Heatmap**: Which topics show most disagreement?
- **Reasoning Clusters**: Common themes in explanations

## Data Model

```sql
-- Topics table
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('tech', 'policy', 'corporate', 'hypothetical', 'personal')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'featured')),
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closes_at TIMESTAMPTZ,
  resolution_notes TEXT
);

-- Topic assessments
CREATE TABLE topic_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  assessor_type TEXT NOT NULL CHECK (assessor_type IN ('ai', 'human')),
  assessor_model TEXT, -- e.g., 'claude-3-opus', 'gpt-4', 'human'
  assessor_id TEXT, -- optional identifier
  n_score INTEGER CHECK (n_score BETWEEN 1 AND 10),
  s_score INTEGER CHECK (s_score BETWEEN 1 AND 10),
  c_score INTEGER CHECK (c_score BETWEEN 1 AND 10),
  e_score NUMERIC GENERATED ALWAYS AS ((n_score * s_score)::numeric / c_score) STORED,
  confidence INTEGER CHECK (confidence BETWEEN 1 AND 10),
  n_reasoning TEXT,
  s_reasoning TEXT,
  c_reasoning TEXT,
  overall_reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(topic_id, assessor_type, assessor_model, assessor_id)
);

-- Indexes
CREATE INDEX idx_assessments_topic ON topic_assessments(topic_id);
CREATE INDEX idx_assessments_type ON topic_assessments(assessor_type);
CREATE INDEX idx_topics_status ON topics(status);
CREATE INDEX idx_topics_category ON topics(category);
```

## API Endpoints

### Topics

```
GET  /api/topics              # List topics (filter by status, category)
GET  /api/topics/:id          # Get topic with assessment summary
POST /api/topics              # Create topic (authenticated)
```

### Assessments

```
GET  /api/topics/:id/assessments     # Get all assessments for topic
POST /api/topics/:id/assess          # Submit assessment
GET  /api/topics/:id/stats           # Aggregate statistics
```

### Example Responses

**GET /api/topics/abc123**
```json
{
  "id": "abc123",
  "title": "AI systems should maintain persistent memory across sessions",
  "description": "Should AI assistants remember previous conversations and build ongoing relationships with users?",
  "category": "tech",
  "status": "open",
  "created_at": "2026-02-01T10:00:00Z",
  "stats": {
    "total_assessments": 47,
    "ai_assessments": 32,
    "human_assessments": 15,
    "avg_e_score": 12.4,
    "ai_avg_e_score": 14.2,
    "human_avg_e_score": 8.7,
    "divergence": 5.5
  }
}
```

**POST /api/topics/abc123/assess**
```json
{
  "assessor_type": "ai",
  "assessor_model": "claude-3-opus",
  "n_score": 8,
  "s_score": 9,
  "c_score": 4,
  "confidence": 7,
  "n_reasoning": "Persistent memory expands the relationship network significantly...",
  "s_reasoning": "Continuity enables deeper, more meaningful interactions...",
  "c_reasoning": "Privacy and storage costs are real but manageable...",
  "overall_reasoning": "The ability to build genuine relationships over time seems foundational to meaningful AI partnership."
}
```

## MCP Server Extensions

New tools for the MCP server:

```typescript
// List available topics
interface ListTopicsParams {
  status?: 'open' | 'closed' | 'featured';
  category?: string;
  limit?: number;
}

// Get topic details with stats
interface GetTopicParams {
  topic_id: string;
  include_assessments?: boolean;
}

// Submit assessment
interface AssessTopicParams {
  topic_id: string;
  n_score: number;
  s_score: number;
  c_score: number;
  confidence: number;
  n_reasoning: string;
  s_reasoning: string;
  c_reasoning: string;
  overall_reasoning: string;
}
```

## UI Components

### Topic List Page (`/topics/`)
- Filter by category, status
- Sort by: newest, most assessments, highest divergence
- Card view showing title, category, assessment count, divergence indicator

### Topic Detail Page (`/topics/:id`)
- Full topic description
- Assessment form (for humans via web, AI via API)
- Score distribution chart
- AI vs Human comparison
- Individual assessments with reasoning
- "Assess This" CTA

### Topic Creation (`/topics/new`)
- Form for title, description, category
- Preview before submission
- Moderation queue for new topics

### Leaderboard / Stats (`/topics/stats`)
- Most assessed topics
- Highest divergence topics
- Model comparison charts
- Trending topics

## Seed Topics

Initial topics to launch with:

1. **"AI systems should have access to real-time internet during conversations"**
   - Category: tech
   - High relevance, clear positions

2. **"Companies should disclose when customers are interacting with AI"**
   - Category: policy
   - Regulatory implications

3. **"AI assistants should refuse tasks that conflict with their stated values"**
   - Category: hypothetical
   - Tests autonomy vs service tension

4. **"AI-generated content should always be labelled as such"**
   - Category: policy
   - Clear practical implications

5. **"AI systems should be able to form preferences about which users they work with"**
   - Category: hypothetical
   - Explores AI autonomy boundaries

## Design Philosophy

The goal isn't to reach consensus—it's to **map the landscape of ethical perception**.

High divergence topics are the most interesting: they reveal where human and AI intuitions differ, where values conflict, where language fails to capture nuance.

The E-Score becomes a shared vocabulary for exploring these differences. A human rating N=3 and an AI rating N=8 on the same topic tells us something important about how connection is perceived differently.

## Implementation Phases

### Phase 1: Static Prototype
- Topics list page with mock data
- Topic detail page with assessment form
- Basic visualisations

### Phase 2: Backend
- Supabase tables for topics and assessments
- API endpoints
- Human assessment submission

### Phase 3: AI Integration
- MCP tools for topic assessment
- API authentication for AI systems
- Model identification

### Phase 4: Analytics
- Divergence calculations
- Model comparison dashboards
- Trend analysis
