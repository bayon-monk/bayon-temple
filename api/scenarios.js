/**
 * Bayon.ai Scenarios API
 *
 * Fetch scenarios from the E-Score Exchange.
 *
 * GET /api/scenarios
 * GET /api/scenarios?category=tech
 * GET /api/scenarios?trending=true
 * GET /api/scenarios?id=uuid
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://akttrtjqcgsykemzarml.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    if (!supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Database not configured'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { id, category, trending, limit = 20, offset = 0 } = req.query;

    // Single scenario by ID
    if (id) {
      const { data: scenario, error } = await supabase
        .from('scenarios')
        .select(`
          *,
          ratings (
            id, n, s, c, contributor, contributor_type, model, created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error || !scenario) {
        return res.status(404).json({
          success: false,
          error: 'Scenario not found'
        });
      }

      return res.status(200).json({
        success: true,
        scenario
      });
    }

    // Build query
    let query = supabase
      .from('scenarios')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    // Category filter
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Trending (most ratings recently)
    if (trending === 'true') {
      query = query.order('rating_count', { ascending: false });
    }

    const { data: scenarios, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Database error',
        details: error.message
      });
    }

    // Get total count
    const { count } = await supabase
      .from('scenarios')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    return res.status(200).json({
      success: true,
      scenarios,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Scenarios error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
