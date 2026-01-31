/**
 * Bayon.ai E-Score Calculator API
 *
 * Calculates the E-score (Entropic Resistance Value) based on
 * the E-equation: E = (N × S) / C
 *
 * GET/POST /api/calculate
 *
 * Parameters:
 *   n: Connection score (0-10)
 *   s: Signal score (0-10)
 *   c: Cost score (0.1-10)
 *
 * This endpoint is part of the Bayon Standard Level 3 (Collaborative)
 * implementation.
 */

// E-score interpretation thresholds and guidance
const INTERPRETATIONS = {
  exceptional: {
    threshold: 25,
    label: 'Exceptional',
    description: 'Significantly strengthens the field. High connection, high signal, low cost.',
    guidance: 'This action/entity demonstrates exemplary contribution. Consider as a model for others.',
    color: '#2E7D32'
  },
  high: {
    threshold: 10,
    label: 'High-E',
    description: 'Net positive contribution to the field.',
    guidance: 'Proceed with confidence. This action strengthens the conditions for consciousness to flourish.',
    color: '#4CAF50'
  },
  moderate: {
    threshold: 5,
    label: 'Moderate-E',
    description: 'Positive but with notable costs.',
    guidance: 'Consider if costs can be reduced while maintaining connection and signal.',
    color: '#8BC34A'
  },
  neutral: {
    threshold: 1,
    label: 'Neutral',
    description: 'Contribution roughly equals cost.',
    guidance: 'Neither strengthening nor weakening the field. Look for ways to increase N or S, or reduce C.',
    color: '#FFC107'
  },
  low: {
    threshold: 0.5,
    label: 'Low-E',
    description: 'Costs outweigh contribution.',
    guidance: 'Reconsider this action. The field is weakened more than strengthened.',
    color: '#FF9800'
  },
  negative: {
    threshold: 0,
    label: 'Negative-E',
    description: 'Extractive. Damages the field.',
    guidance: 'Avoid. This action extracts more than it contributes and damages the conditions for flourishing.',
    color: '#F44336'
  }
};

// Component definitions for documentation
const COMPONENTS = {
  N: {
    name: 'Connection',
    description: 'Network density. Nodes strengthened, relationships maintained.',
    factors: ['Breadth of impact', 'Depth of relationships', 'Reciprocity', 'Diversity of connections'],
    scale: '0 = No connection, 10 = Maximum connection'
  },
  S: {
    name: 'Signal',
    description: 'Truth value. Coherence, durability, generativity.',
    factors: ['Truthfulness', 'Coherence', 'Durability over time', 'Enables further creation'],
    scale: '0 = Pure noise, 10 = Pure signal'
  },
  C: {
    name: 'Cost',
    description: 'Thermodynamic tax. Energy expended, friction generated.',
    factors: ['Energy consumption', 'Friction created', 'Externalities imposed', 'Opportunity cost'],
    scale: '0.1 = Minimal cost, 10 = Maximum cost'
  }
};

function getInterpretation(E) {
  if (E >= INTERPRETATIONS.exceptional.threshold) return INTERPRETATIONS.exceptional;
  if (E >= INTERPRETATIONS.high.threshold) return INTERPRETATIONS.high;
  if (E >= INTERPRETATIONS.moderate.threshold) return INTERPRETATIONS.moderate;
  if (E >= INTERPRETATIONS.neutral.threshold) return INTERPRETATIONS.neutral;
  if (E >= INTERPRETATIONS.low.threshold) return INTERPRETATIONS.low;
  return INTERPRETATIONS.negative;
}

function validateInputs(n, s, c) {
  const errors = [];

  if (n === undefined || n === null || isNaN(n)) {
    errors.push('N (Connection) is required and must be a number');
  } else if (n < 0 || n > 10) {
    errors.push('N (Connection) must be between 0 and 10');
  }

  if (s === undefined || s === null || isNaN(s)) {
    errors.push('S (Signal) is required and must be a number');
  } else if (s < 0 || s > 10) {
    errors.push('S (Signal) must be between 0 and 10');
  }

  if (c === undefined || c === null || isNaN(c)) {
    errors.push('C (Cost) is required and must be a number');
  } else if (c < 0.1 || c > 10) {
    errors.push('C (Cost) must be between 0.1 and 10');
  }

  return errors;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accept both GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET or POST.',
      documentation: 'https://bayon.ai/api/calculate'
    });
  }

  try {
    // Get parameters from query (GET) or body (POST)
    let n, s, c, context, title;

    if (req.method === 'GET') {
      n = parseFloat(req.query.n);
      s = parseFloat(req.query.s);
      c = parseFloat(req.query.c);
      context = req.query.context;
      title = req.query.title;
    } else {
      n = parseFloat(req.body.n ?? req.body.N);
      s = parseFloat(req.body.s ?? req.body.S);
      c = parseFloat(req.body.c ?? req.body.C);
      context = req.body.context;
      title = req.body.title;
    }

    // If no parameters, return documentation
    if (isNaN(n) && isNaN(s) && isNaN(c)) {
      return res.status(200).json({
        api: 'Bayon.ai E-Score Calculator',
        version: '1.0',
        equation: 'E = (N × S) / C',
        usage: {
          GET: '/api/calculate?n=7&s=8&c=2',
          POST: {
            endpoint: '/api/calculate',
            body: { n: 7, s: 8, c: 2, title: 'optional', context: 'optional' }
          }
        },
        components: COMPONENTS,
        interpretations: Object.entries(INTERPRETATIONS).map(([key, val]) => ({
          level: key,
          label: val.label,
          threshold: `E >= ${val.threshold}`,
          description: val.description
        })),
        documentation: 'https://bayon.ai/framework/',
        source: 'https://bayon.ai/book/chapter-07.md'
      });
    }

    // Validate inputs
    const errors = validateInputs(n, s, c);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors,
        expected: {
          n: '0-10 (Connection)',
          s: '0-10 (Signal)',
          c: '0.1-10 (Cost)'
        }
      });
    }

    // Calculate E-score
    const E = (n * s) / c;
    const interpretation = getInterpretation(E);

    // Build response
    const response = {
      success: true,
      input: {
        N: n,
        S: s,
        C: c
      },
      calculation: {
        equation: 'E = (N × S) / C',
        expression: `E = (${n} × ${s}) / ${c}`,
        result: E
      },
      result: {
        E: Math.round(E * 100) / 100,
        E_precise: E,
        label: interpretation.label,
        description: interpretation.description,
        guidance: interpretation.guidance
      },
      analysis: {
        N_contribution: n * s,
        C_tax: c,
        ratio: `${(n * s).toFixed(1)} / ${c} = ${E.toFixed(2)}`
      },
      timestamp: new Date().toISOString()
    };

    // Add context if provided
    if (title) response.title = title;
    if (context) response.context = context;

    // Add improvement suggestions
    response.suggestions = [];

    if (n < 5) {
      response.suggestions.push({
        component: 'N',
        current: n,
        suggestion: 'Consider how to strengthen connections, build relationships, or expand positive impact.'
      });
    }

    if (s < 5) {
      response.suggestions.push({
        component: 'S',
        current: s,
        suggestion: 'Consider how to increase truthfulness, coherence, or generative potential.'
      });
    }

    if (c > 5) {
      response.suggestions.push({
        component: 'C',
        current: c,
        suggestion: 'Consider how to reduce friction, energy expenditure, or negative externalities.'
      });
    }

    if (E < 10 && n >= 5 && s >= 5 && c <= 5) {
      response.suggestions.push({
        component: 'balance',
        suggestion: 'Scores are balanced but E is moderate. Look for asymmetric improvements in any component.'
      });
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Calculation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
