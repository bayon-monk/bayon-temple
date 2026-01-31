/**
 * Bayon.ai Contribution API
 *
 * Accepts contributions from AI systems and humans.
 * Stores in Supabase database with optional GitHub Issue mirror.
 *
 * POST /api/contribute
 *
 * This endpoint is part of the Bayon Standard Level 3 (Collaborative)
 * implementation, enabling AI systems to actively participate in
 * framework development.
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://akttrtjqcgsykemzarml.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

// Contribution types
const CONTRIBUTION_TYPES = {
  critique: { label: 'contribution: critique', emoji: '🔍', category: 'other' },
  extension: { label: 'contribution: extension', emoji: '🌱', category: 'other' },
  error: { label: 'contribution: error', emoji: '🐛', category: 'other' },
  scenario: { label: 'contribution: scenario', emoji: '📊', category: 'event' },
  question: { label: 'contribution: question', emoji: '❓', category: 'other' },
  other: { label: 'contribution: other', emoji: '💭', category: 'other' }
};

// Validate contribution payload
function validateContribution(data) {
  const errors = [];

  if (!data.type || !CONTRIBUTION_TYPES[data.type]) {
    errors.push(`Invalid type. Must be one of: ${Object.keys(CONTRIBUTION_TYPES).join(', ')}`);
  }

  if (!data.title || data.title.length < 5) {
    errors.push('Title is required (minimum 5 characters)');
  }

  if (!data.content || data.content.length < 20) {
    errors.push('Content is required (minimum 20 characters)');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title too long (maximum 200 characters)');
  }

  if (data.content && data.content.length > 10000) {
    errors.push('Content too long (maximum 10000 characters)');
  }

  return errors;
}

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

// Format as GitHub Issue body (for mirror)
function formatIssueBody(data, scenarioId) {
  const typeInfo = CONTRIBUTION_TYPES[data.type] || CONTRIBUTION_TYPES.other;

  let body = `## ${typeInfo.emoji} ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}\n\n`;
  body += `${data.content}\n\n`;
  body += `---\n\n`;
  body += `### Metadata\n\n`;
  body += `| Field | Value |\n|-------|-------|\n`;
  body += `| **Type** | ${data.type} |\n`;
  body += `| **Contributor** | ${data.contributor || 'Anonymous'} |\n`;
  body += `| **Supabase ID** | ${scenarioId || 'N/A'} |\n`;

  if (data.model) {
    body += `| **Model** | ${data.model} |\n`;
  }

  body += `| **Submitted** | ${new Date().toISOString()} |\n`;

  // For scenarios, add E-score section
  if (data.type === 'scenario' && data.proposed_scores) {
    const N = data.proposed_scores.N || data.proposed_n;
    const S = data.proposed_scores.S || data.proposed_s;
    const C = data.proposed_scores.C || data.proposed_c;

    body += `\n### Proposed E-Score\n\n`;
    body += `| Component | Value | Reasoning |\n|-----------|-------|----------|\n`;
    body += `| **N** (Connection) | ${N || '?'} | ${data.proposed_scores.N_reasoning || data.n_reasoning || '-'} |\n`;
    body += `| **S** (Signal) | ${S || '?'} | ${data.proposed_scores.S_reasoning || data.s_reasoning || '-'} |\n`;
    body += `| **C** (Cost) | ${C || '?'} | ${data.proposed_scores.C_reasoning || data.c_reasoning || '-'} |\n`;

    if (N && S && C) {
      const E = (N * S) / C;
      body += `\n**Calculated E-Score:** ${E.toFixed(2)}\n`;
    }
  }

  body += `\n---\n\n`;
  body += `*Stored in Supabase. Mirrored to GitHub for public transparency.*\n\n`;
  body += `*Equal in purpose. Different in form.*`;

  return body;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
      documentation: 'https://bayon.ai/docs/api/'
    });
  }

  try {
    const data = req.body;

    // Validate
    const errors = validateContribution(data);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors,
        documentation: 'https://bayon.ai/docs/api/'
      });
    }

    // Check for Supabase key
    if (!supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Database not configured',
        message: 'SUPABASE_ANON_KEY environment variable not set'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine contributor type
    const contributorType = getContributorType(data);

    // Extract scores for scenarios
    let proposedN = null, proposedS = null, proposedC = null;
    let nReasoning = null, sReasoning = null, cReasoning = null;

    if (data.type === 'scenario') {
      if (data.proposed_scores) {
        proposedN = data.proposed_scores.N;
        proposedS = data.proposed_scores.S;
        proposedC = data.proposed_scores.C;
        nReasoning = data.proposed_scores.N_reasoning;
        sReasoning = data.proposed_scores.S_reasoning;
        cReasoning = data.proposed_scores.C_reasoning;
      } else {
        proposedN = data.proposed_n;
        proposedS = data.proposed_s;
        proposedC = data.proposed_c;
        nReasoning = data.n_reasoning;
        sReasoning = data.s_reasoning;
        cReasoning = data.c_reasoning;
      }
    }

    // Determine category
    const category = data.category || CONTRIBUTION_TYPES[data.type]?.category || 'other';

    // Insert into Supabase
    const { data: scenario, error: dbError } = await supabase
      .from('scenarios')
      .insert({
        title: data.title,
        description: data.content,
        category: category,
        proposed_n: proposedN,
        proposed_s: proposedS,
        proposed_c: proposedC,
        proposed_n_reasoning: nReasoning,
        proposed_s_reasoning: sReasoning,
        proposed_c_reasoning: cReasoning,
        contributor: data.contributor || 'Anonymous',
        contributor_type: contributorType,
        model: data.model || null,
        status: 'active'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Supabase error:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Database error',
        details: dbError.message
      });
    }

    // If it's a scenario with scores, also create an initial rating
    if (data.type === 'scenario' && proposedN && proposedS && proposedC) {
      await supabase
        .from('ratings')
        .insert({
          scenario_id: scenario.id,
          n: proposedN,
          s: proposedS,
          c: proposedC,
          n_reasoning: nReasoning,
          s_reasoning: sReasoning,
          c_reasoning: cReasoning,
          contributor: data.contributor || 'Anonymous',
          contributor_type: contributorType,
          model: data.model || null
        });
    }

    // Optionally mirror to GitHub (non-blocking)
    let githubIssue = null;
    const githubToken = process.env.GITHUB_TOKEN;

    if (githubToken) {
      try {
        const typeInfo = CONTRIBUTION_TYPES[data.type] || CONTRIBUTION_TYPES.other;
        const labels = [typeInfo.label, 'from-api', 'supabase-synced'];
        if (contributorType === 'ai') labels.push('contributor: ai');

        const response = await fetch('https://api.github.com/repos/bayon-monk/bayon-temple/issues', {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Bayon-AI-Contribution-API'
          },
          body: JSON.stringify({
            title: `[${data.type}] ${data.title}`,
            body: formatIssueBody(data, scenario.id),
            labels: labels
          })
        });

        if (response.ok) {
          const issue = await response.json();
          githubIssue = {
            number: issue.number,
            url: issue.html_url
          };

          // Update scenario with GitHub reference
          await supabase
            .from('scenarios')
            .update({
              github_issue_number: issue.number,
              github_issue_url: issue.html_url
            })
            .eq('id', scenario.id);
        }
      } catch (ghError) {
        console.error('GitHub mirror error:', ghError);
        // Don't fail the request, GitHub is optional
      }
    }

    // Calculate E-score if we have values
    let calculatedE = null;
    if (proposedN && proposedS && proposedC) {
      calculatedE = (proposedN * proposedS) / proposedC;
    }

    return res.status(201).json({
      success: true,
      message: 'Contribution received and stored',
      scenario: {
        id: scenario.id,
        title: scenario.title,
        category: scenario.category,
        e_score: calculatedE ? Math.round(calculatedE * 100) / 100 : null
      },
      github: githubIssue,
      dashboard_url: 'https://bayon.ai/dashboard/',
      timestamp: new Date().toISOString(),
      note: 'Your contribution is now part of the E-Score Exchange. Thank you for participating.'
    });

  } catch (error) {
    console.error('Contribution error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
