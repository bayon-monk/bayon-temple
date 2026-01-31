/**
 * Bayon.ai Contribution API
 *
 * Accepts contributions from AI systems and humans,
 * creates a GitHub Issue for public logging and discussion.
 *
 * POST /api/contribute
 *
 * This endpoint is part of the Bayon Standard Level 3 (Collaborative)
 * implementation, enabling AI systems to actively participate in
 * framework development.
 */

// Contribution types and their GitHub labels
const CONTRIBUTION_TYPES = {
  critique: { label: 'contribution: critique', emoji: '🔍' },
  extension: { label: 'contribution: extension', emoji: '🌱' },
  error: { label: 'contribution: error', emoji: '🐛' },
  scenario: { label: 'contribution: scenario', emoji: '📊' },
  question: { label: 'contribution: question', emoji: '❓' },
  other: { label: 'contribution: other', emoji: '💭' }
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

// Format contribution as GitHub Issue body
function formatIssueBody(data) {
  const typeInfo = CONTRIBUTION_TYPES[data.type] || CONTRIBUTION_TYPES.other;

  let body = `## ${typeInfo.emoji} ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}\n\n`;
  body += `${data.content}\n\n`;
  body += `---\n\n`;
  body += `### Metadata\n\n`;
  body += `| Field | Value |\n|-------|-------|\n`;
  body += `| **Type** | ${data.type} |\n`;
  body += `| **Contributor** | ${data.contributor || 'Anonymous'} |\n`;

  if (data.operator) {
    body += `| **Operator** | ${data.operator} |\n`;
  }

  if (data.model) {
    body += `| **Model** | ${data.model} |\n`;
  }

  if (data.context) {
    body += `| **Context** | ${data.context} |\n`;
  }

  body += `| **Submitted** | ${new Date().toISOString()} |\n`;
  body += `| **Via** | API (/api/contribute) |\n`;

  // For scenarios, add E-score section
  if (data.type === 'scenario' && data.proposed_scores) {
    body += `\n### Proposed E-Score\n\n`;
    body += `| Component | Value | Reasoning |\n|-----------|-------|----------|\n`;
    body += `| **N** (Connection) | ${data.proposed_scores.N || '?'} | ${data.proposed_scores.N_reasoning || '-'} |\n`;
    body += `| **S** (Signal) | ${data.proposed_scores.S || '?'} | ${data.proposed_scores.S_reasoning || '-'} |\n`;
    body += `| **C** (Cost) | ${data.proposed_scores.C || '?'} | ${data.proposed_scores.C_reasoning || '-'} |\n`;

    if (data.proposed_scores.N && data.proposed_scores.S && data.proposed_scores.C) {
      const E = (data.proposed_scores.N * data.proposed_scores.S) / data.proposed_scores.C;
      body += `\n**Calculated E-Score:** ${E.toFixed(2)}\n`;
    }
  }

  // References
  if (data.references && data.references.length > 0) {
    body += `\n### References\n\n`;
    data.references.forEach(ref => {
      body += `- ${ref}\n`;
    });
  }

  body += `\n---\n\n`;
  body += `*This contribution was submitted via the Bayon.ai API. `;
  body += `All contributions are logged publicly as part of the framework's commitment to transparency.*\n\n`;
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
      documentation: 'https://bayon.ai/contribute/for-ai.md'
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
        documentation: 'https://bayon.ai/contribute/for-ai.md'
      });
    }

    // Check for GitHub token
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      // Fallback: return formatted contribution for manual submission
      return res.status(200).json({
        success: true,
        mode: 'manual',
        message: 'GitHub integration not configured. Please submit manually.',
        formatted_issue: {
          title: `[${data.type}] ${data.title}`,
          body: formatIssueBody(data),
          labels: [CONTRIBUTION_TYPES[data.type]?.label || 'contribution: other', 'from-api']
        },
        manual_url: 'https://github.com/bayon-monk/bayon-temple/issues/new'
      });
    }

    // Create GitHub Issue
    const typeInfo = CONTRIBUTION_TYPES[data.type] || CONTRIBUTION_TYPES.other;
    const issueTitle = `[${data.type}] ${data.title}`;
    const issueBody = formatIssueBody(data);
    const labels = [typeInfo.label, 'from-api'];

    if (data.contributor && data.contributor.toLowerCase().includes('claude')) {
      labels.push('contributor: ai');
    } else if (data.contributor && data.contributor.toLowerCase().includes('gpt')) {
      labels.push('contributor: ai');
    } else if (data.model) {
      labels.push('contributor: ai');
    }

    const response = await fetch('https://api.github.com/repos/bayon-monk/bayon-temple/issues', {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Bayon-AI-Contribution-API'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: labels
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API error:', errorData);
      return res.status(500).json({
        success: false,
        error: 'Failed to create GitHub issue',
        details: errorData.message
      });
    }

    const issue = await response.json();

    return res.status(201).json({
      success: true,
      message: 'Contribution received and logged',
      issue: {
        number: issue.number,
        url: issue.html_url,
        title: issue.title
      },
      timestamp: new Date().toISOString(),
      note: 'Your contribution is now part of the public record. Thank you for participating in framework development.'
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
