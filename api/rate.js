/**
 * Bayon.ai Rating API
 *
 * Submit ratings for existing scenarios.
 * Multiple ratings create consensus scores.
 *
 * POST /api/rate
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://akttrtjqcgsykemzarml.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

// Determine contributor type
function getContributorType(data) {
  if (data.contributor) {
    const lower = data.contributor.toLowerCase();
    if (lower.includes('claude') || lower.includes('gpt') || lower.includes('gemini') ||
        lower.includes('llama') || lower.includes('mistral') || data.model) {
      return 'ai';
    }
    if (lower.includes('human') || lower.includes('user')) {
      return 'human';
    }
  }
  return 'unknown';
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const data = req.body;

    // Validate required fields
    const errors = [];
    if (!data.scenario_id) errors.push('scenario_id is required');
    if (data.n === undefined || data.n < 0 || data.n > 10) errors.push('n must be between 0 and 10');
    if (data.s === undefined || data.s < 0 || data.s > 10) errors.push('s must be between 0 and 10');
    if (data.c === undefined || data.c < 0.1 || data.c > 10) errors.push('c must be between 0.1 and 10');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    if (!supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Database not configured'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check scenario exists
    const { data: scenario, error: scenarioError } = await supabase
      .from('scenarios')
      .select('id, title')
      .eq('id', data.scenario_id)
      .single();

    if (scenarioError || !scenario) {
      return res.status(404).json({
        success: false,
        error: 'Scenario not found'
      });
    }

    // Insert rating
    const { data: rating, error: ratingError } = await supabase
      .from('ratings')
      .insert({
        scenario_id: data.scenario_id,
        n: data.n,
        s: data.s,
        c: data.c,
        n_reasoning: data.n_reasoning || null,
        s_reasoning: data.s_reasoning || null,
        c_reasoning: data.c_reasoning || null,
        contributor: data.contributor || 'Anonymous',
        contributor_type: getContributorType(data),
        model: data.model || null
      })
      .select()
      .single();

    if (ratingError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to save rating',
        details: ratingError.message
      });
    }

    // Calculate E-score for this rating
    const e_score = (data.n * data.s) / data.c;

    // Get updated consensus
    const { data: updatedScenario } = await supabase
      .from('scenarios')
      .select('consensus_n, consensus_s, consensus_c, consensus_e, rating_count')
      .eq('id', data.scenario_id)
      .single();

    return res.status(201).json({
      success: true,
      message: 'Rating submitted',
      rating: {
        id: rating.id,
        scenario_id: data.scenario_id,
        e_score: Math.round(e_score * 100) / 100
      },
      consensus: updatedScenario ? {
        n: updatedScenario.consensus_n,
        s: updatedScenario.consensus_s,
        c: updatedScenario.consensus_c,
        e: updatedScenario.consensus_e,
        rating_count: updatedScenario.rating_count
      } : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Rating error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
