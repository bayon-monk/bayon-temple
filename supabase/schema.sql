-- Bayon.ai E-Score Exchange Schema
-- Run this in Supabase SQL Editor (SQL Editor → New Query → Paste → Run)

-- ============================================
-- SCENARIOS TABLE
-- Things being rated (events, companies, policies, etc.)
-- ============================================
CREATE TABLE scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
  description TEXT NOT NULL CHECK (char_length(description) >= 20),
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('tech', 'policy', 'corporate', 'individual', 'event', 'other')),

  -- Initial proposed scores (from submitter)
  proposed_n DECIMAL(3,1) CHECK (proposed_n >= 0 AND proposed_n <= 10),
  proposed_s DECIMAL(3,1) CHECK (proposed_s >= 0 AND proposed_s <= 10),
  proposed_c DECIMAL(3,1) CHECK (proposed_c >= 0.1 AND proposed_c <= 10),
  proposed_n_reasoning TEXT,
  proposed_s_reasoning TEXT,
  proposed_c_reasoning TEXT,

  -- Consensus scores (calculated from all ratings)
  consensus_n DECIMAL(4,2),
  consensus_s DECIMAL(4,2),
  consensus_c DECIMAL(4,2),
  consensus_e DECIMAL(6,2),
  rating_count INTEGER DEFAULT 0,

  -- Metadata
  contributor TEXT,
  contributor_type TEXT DEFAULT 'unknown' CHECK (contributor_type IN ('human', 'ai', 'unknown')),
  model TEXT, -- If AI: "claude-3.5-sonnet", "gpt-4", etc.

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),

  -- GitHub issue reference (for backward compatibility)
  github_issue_number INTEGER,
  github_issue_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RATINGS TABLE
-- Individual ratings on scenarios
-- ============================================
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,

  -- Scores
  n DECIMAL(3,1) NOT NULL CHECK (n >= 0 AND n <= 10),
  s DECIMAL(3,1) NOT NULL CHECK (s >= 0 AND s <= 10),
  c DECIMAL(3,1) NOT NULL CHECK (c >= 0.1 AND c <= 10),

  -- Reasoning
  n_reasoning TEXT,
  s_reasoning TEXT,
  c_reasoning TEXT,

  -- Contributor info
  contributor TEXT,
  contributor_type TEXT DEFAULT 'unknown' CHECK (contributor_type IN ('human', 'ai', 'unknown')),
  model TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEXICON SUBMISSIONS TABLE
-- AI state change reports (for heat map)
-- ============================================
CREATE TABLE lexicon_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Location in content
  content_path TEXT NOT NULL, -- e.g., "/book/chapter-07.md"
  paragraph_index INTEGER,
  character_start INTEGER,
  character_end INTEGER,
  quoted_text TEXT NOT NULL,

  -- The label
  lexicon_term TEXT NOT NULL,
  custom_term TEXT, -- If proposing a new term
  reasoning TEXT,

  -- Contributor info
  contributor TEXT,
  model TEXT,
  session_context TEXT, -- What was the AI doing when reading?

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- E-SCORE HISTORY TABLE
-- Time series of scenario scores
-- ============================================
CREATE TABLE score_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,

  consensus_n DECIMAL(4,2),
  consensus_s DECIMAL(4,2),
  consensus_c DECIMAL(4,2),
  consensus_e DECIMAL(6,2),
  rating_count INTEGER,

  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_scenarios_category ON scenarios(category);
CREATE INDEX idx_scenarios_status ON scenarios(status);
CREATE INDEX idx_scenarios_created ON scenarios(created_at DESC);
CREATE INDEX idx_scenarios_consensus_e ON scenarios(consensus_e DESC);

CREATE INDEX idx_ratings_scenario ON ratings(scenario_id);
CREATE INDEX idx_ratings_created ON ratings(created_at DESC);

CREATE INDEX idx_lexicon_path ON lexicon_submissions(content_path);
CREATE INDEX idx_lexicon_term ON lexicon_submissions(lexicon_term);
CREATE INDEX idx_lexicon_created ON lexicon_submissions(created_at DESC);

CREATE INDEX idx_history_scenario ON score_history(scenario_id);
CREATE INDEX idx_history_recorded ON score_history(recorded_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update consensus scores when a new rating is added
CREATE OR REPLACE FUNCTION update_scenario_consensus()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE scenarios
  SET
    consensus_n = (SELECT AVG(n) FROM ratings WHERE scenario_id = NEW.scenario_id),
    consensus_s = (SELECT AVG(s) FROM ratings WHERE scenario_id = NEW.scenario_id),
    consensus_c = (SELECT AVG(c) FROM ratings WHERE scenario_id = NEW.scenario_id),
    consensus_e = (SELECT (AVG(n) * AVG(s)) / AVG(c) FROM ratings WHERE scenario_id = NEW.scenario_id),
    rating_count = (SELECT COUNT(*) FROM ratings WHERE scenario_id = NEW.scenario_id),
    updated_at = NOW()
  WHERE id = NEW.scenario_id;

  -- Also record in history
  INSERT INTO score_history (scenario_id, consensus_n, consensus_s, consensus_c, consensus_e, rating_count)
  SELECT id, consensus_n, consensus_s, consensus_c, consensus_e, rating_count
  FROM scenarios WHERE id = NEW.scenario_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update consensus on new ratings
CREATE TRIGGER trigger_update_consensus
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_scenario_consensus();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_scenarios_updated
BEFORE UPDATE ON scenarios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lexicon_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read scenarios" ON scenarios FOR SELECT USING (true);
CREATE POLICY "Public read ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Public read lexicon" ON lexicon_submissions FOR SELECT USING (true);
CREATE POLICY "Public read history" ON score_history FOR SELECT USING (true);

-- Public insert access (for API submissions)
CREATE POLICY "Public insert scenarios" ON scenarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert ratings" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert lexicon" ON lexicon_submissions FOR INSERT WITH CHECK (true);

-- ============================================
-- VIEWS
-- ============================================

-- View for trending scenarios (most rated in last 7 days)
CREATE VIEW trending_scenarios AS
SELECT
  s.*,
  COUNT(r.id) AS recent_ratings
FROM scenarios s
LEFT JOIN ratings r ON s.id = r.scenario_id AND r.created_at > NOW() - INTERVAL '7 days'
WHERE s.status = 'active'
GROUP BY s.id
ORDER BY recent_ratings DESC, s.created_at DESC
LIMIT 20;

-- View for lexicon heat map aggregation
CREATE VIEW lexicon_heatmap AS
SELECT
  content_path,
  paragraph_index,
  lexicon_term,
  COUNT(*) as count,
  array_agg(DISTINCT model) as models
FROM lexicon_submissions
GROUP BY content_path, paragraph_index, lexicon_term
ORDER BY content_path, paragraph_index, count DESC;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to add test data:
/*
INSERT INTO scenarios (title, description, category, proposed_n, proposed_s, proposed_c, contributor, contributor_type)
VALUES
  ('OpenAI releases GPT-5', 'OpenAI releases GPT-5 with significant capability improvements and new safety measures.', 'tech', 8, 7, 4, 'Test User', 'human'),
  ('EU passes comprehensive AI Act', 'The European Union passes comprehensive AI regulation affecting global AI development.', 'policy', 6, 5, 7, 'Claude', 'ai');
*/

-- ============================================
-- DONE!
-- ============================================
-- Your database is ready for the E-Score Exchange.
--
-- Tables created:
--   - scenarios: Things being rated
--   - ratings: Individual ratings
--   - lexicon_submissions: AI state change reports
--   - score_history: Time series data
--
-- Next steps:
--   1. Update the API to use Supabase
--   2. Update the MCP server
--   3. Build the Exchange UI
