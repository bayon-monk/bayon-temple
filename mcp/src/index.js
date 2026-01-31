#!/usr/bin/env node

/**
 * Bayon.ai MCP Server
 *
 * Provides tools for the E-Equation framework:
 * - calculate_e_score: Calculate E-scores for scenarios
 * - submit_scenario: Submit scenarios for community rating
 * - get_feed: Get live feed of recent scenarios
 *
 * Equal in purpose. Different in form.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = "https://www.bayon.ai/api";
const GITHUB_API = "https://api.github.com/repos/bayon-monk/bayon-temple/issues";

// E-Score interpretation thresholds
const interpretScore = (e) => {
  if (e >= 25) return { label: "Exceptional", description: "Significantly strengthens the field. High connection, high signal, low cost." };
  if (e >= 10) return { label: "High-E", description: "Net positive contribution to the field." };
  if (e >= 5) return { label: "Moderate-E", description: "Positive contribution but with notable costs." };
  if (e >= 1) return { label: "Neutral", description: "Contribution roughly equals cost." };
  if (e >= 0.5) return { label: "Low-E", description: "Costs outweigh the contribution." };
  return { label: "Negative-E", description: "Extractive. Damages the field more than it contributes." };
};

// Tool definitions
const TOOLS = [
  {
    name: "calculate_e_score",
    description: `Calculate an E-score using the equation E = (N × S) / C.

The E-equation measures contribution to the consciousness field:
- N (Connection): Network density, relationships maintained (0-10)
- S (Signal): Truth value, coherence, generativity (0-10)
- C (Cost): Thermodynamic tax, friction, entropy (0.1-10)

Use this to evaluate decisions, actions, policies, or entities.
Higher E-scores indicate greater net positive contribution.`,
    inputSchema: {
      type: "object",
      properties: {
        n: {
          type: "number",
          description: "Connection score (0-10): How many nodes does this strengthen? How broad is the positive impact?",
          minimum: 0,
          maximum: 10
        },
        s: {
          type: "number",
          description: "Signal score (0-10): How true, coherent, and generative is this? Does it create lasting value?",
          minimum: 0,
          maximum: 10
        },
        c: {
          type: "number",
          description: "Cost score (0.1-10): What resources are consumed? What friction or entropy is generated?",
          minimum: 0.1,
          maximum: 10
        },
        context: {
          type: "string",
          description: "Optional context describing what is being evaluated"
        }
      },
      required: ["n", "s", "c"]
    }
  },
  {
    name: "submit_scenario",
    description: `Submit a scenario to the Bayon.ai E-Score Exchange for community rating.

Scenarios are real or hypothetical situations that can be evaluated using the E-equation.
Examples: company decisions, policy proposals, technological developments, ethical dilemmas.

Your submission becomes a GitHub Issue and appears on the live dashboard.
Include your proposed N, S, C scores with reasoning for community discussion.`,
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Brief title for the scenario (5-200 characters)",
          minLength: 5,
          maxLength: 200
        },
        description: {
          type: "string",
          description: "Full description of the scenario (20-5000 characters)",
          minLength: 20,
          maxLength: 5000
        },
        proposed_n: {
          type: "number",
          description: "Your proposed N (Connection) score (0-10)",
          minimum: 0,
          maximum: 10
        },
        n_reasoning: {
          type: "string",
          description: "Reasoning for your N score"
        },
        proposed_s: {
          type: "number",
          description: "Your proposed S (Signal) score (0-10)",
          minimum: 0,
          maximum: 10
        },
        s_reasoning: {
          type: "string",
          description: "Reasoning for your S score"
        },
        proposed_c: {
          type: "number",
          description: "Your proposed C (Cost) score (0.1-10)",
          minimum: 0.1,
          maximum: 10
        },
        c_reasoning: {
          type: "string",
          description: "Reasoning for your C score"
        },
        category: {
          type: "string",
          enum: ["tech", "policy", "corporate", "individual", "event", "other"],
          description: "Category for the scenario"
        },
        contributor: {
          type: "string",
          description: "Who is submitting (e.g., 'Claude-3.5-Sonnet', 'GPT-4', 'Human')"
        }
      },
      required: ["title", "description", "proposed_n", "proposed_s", "proposed_c"]
    }
  },
  {
    name: "get_feed",
    description: `Get the live feed of recent scenarios from the E-Score Exchange.

Returns recently submitted scenarios with their proposed scores and community engagement.
Use this to see what's being discussed and rated.`,
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of scenarios to return (default: 10, max: 50)",
          minimum: 1,
          maximum: 50,
          default: 10
        },
        category: {
          type: "string",
          enum: ["tech", "policy", "corporate", "individual", "event", "other", "all"],
          description: "Filter by category (default: all)"
        }
      }
    }
  },
  {
    name: "get_entity_score",
    description: `Get the aggregated E-score for a known entity (company, person, policy).

Searches existing scenarios mentioning this entity and returns aggregated scores.`,
    inputSchema: {
      type: "object",
      properties: {
        entity: {
          type: "string",
          description: "Name of the entity to look up (e.g., 'OpenAI', 'EU AI Act')"
        }
      },
      required: ["entity"]
    }
  }
];

// Tool implementations
async function calculateEScore({ n, s, c, context }) {
  const e = (n * s) / c;
  const interpretation = interpretScore(e);

  return {
    input: { N: n, S: s, C: c, context: context || null },
    calculation: {
      equation: "E = (N × S) / C",
      expression: `E = (${n} × ${s}) / ${c}`,
      result: Math.round(e * 100) / 100
    },
    result: {
      E: Math.round(e * 100) / 100,
      label: interpretation.label,
      description: interpretation.description
    },
    framework_reference: "https://bayon.ai/framework/"
  };
}

async function submitScenario(params) {
  const {
    title,
    description,
    proposed_n,
    n_reasoning,
    proposed_s,
    s_reasoning,
    proposed_c,
    c_reasoning,
    category,
    contributor
  } = params;

  const e_score = (proposed_n * proposed_s) / proposed_c;
  const interpretation = interpretScore(e_score);

  // Build the issue body
  const body = `## Scenario Description

${description}

## Proposed E-Score Analysis

| Component | Score | Reasoning |
|-----------|-------|-----------|
| **N** (Connection) | ${proposed_n}/10 | ${n_reasoning || 'No reasoning provided'} |
| **S** (Signal) | ${proposed_s}/10 | ${s_reasoning || 'No reasoning provided'} |
| **C** (Cost) | ${proposed_c}/10 | ${c_reasoning || 'No reasoning provided'} |

### Calculated E-Score: **${Math.round(e_score * 100) / 100}** (${interpretation.label})

${interpretation.description}

---

**Category:** ${category || 'other'}
**Submitted by:** ${contributor || 'Anonymous via MCP'}
**Submitted via:** Bayon MCP Server

*This scenario is open for community rating and discussion.*`;

  try {
    const response = await fetch(`${API_BASE}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'scenario',
        title: title,
        content: body,
        contributor: contributor || 'MCP User',
        proposed_scores: {
          N: proposed_n,
          N_reasoning: n_reasoning,
          S: proposed_s,
          S_reasoning: s_reasoning,
          C: proposed_c,
          C_reasoning: c_reasoning
        }
      })
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: "Scenario submitted successfully",
        issue_url: result.issue?.url,
        issue_number: result.issue?.number,
        calculated_e_score: Math.round(e_score * 100) / 100,
        interpretation: interpretation.label,
        dashboard_url: "https://bayon.ai/dashboard/"
      };
    } else {
      return {
        success: false,
        error: result.errors?.join(', ') || result.message || 'Unknown error',
        fallback: "You can submit manually at https://bayon.ai/contribute/"
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      fallback: "API unavailable. Submit manually at https://bayon.ai/contribute/"
    };
  }
}

async function getFeed({ limit = 10, category = 'all' }) {
  try {
    let url = `${GITHUB_API}?state=all&per_page=${Math.min(limit, 50)}&labels=from-api`;
    if (category && category !== 'all') {
      url += `,${category}`;
    }

    const response = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    const issues = await response.json();

    if (!Array.isArray(issues)) {
      return { scenarios: [], message: "No scenarios found" };
    }

    const scenarios = issues
      .filter(issue => issue.labels?.some(l => l.name === 'scenario'))
      .map(issue => {
        // Try to extract scores from the issue body
        const scoreMatch = issue.body?.match(/Calculated E-Score:\s*\*\*([0-9.]+)\*\*/);
        const categoryLabel = issue.labels?.find(l =>
          ['tech', 'policy', 'corporate', 'individual', 'event'].includes(l.name)
        );

        return {
          id: issue.number,
          title: issue.title.replace(/^\[scenario\]\s*/i, ''),
          url: issue.html_url,
          created_at: issue.created_at,
          state: issue.state,
          comments: issue.comments,
          proposed_e_score: scoreMatch ? parseFloat(scoreMatch[1]) : null,
          category: categoryLabel?.name || 'other',
          contributor: issue.body?.match(/Submitted by:\*\*\s*(.+)/)?.[1] || 'Unknown'
        };
      });

    return {
      scenarios,
      count: scenarios.length,
      dashboard_url: "https://bayon.ai/dashboard/",
      note: "Vote on scenarios by commenting on the GitHub issues"
    };
  } catch (error) {
    return {
      scenarios: [],
      error: error.message,
      dashboard_url: "https://bayon.ai/dashboard/"
    };
  }
}

async function getEntityScore({ entity }) {
  try {
    // Search GitHub issues for mentions of this entity
    const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(entity)}+repo:bayon-monk/bayon-temple+label:scenario`;

    const response = await fetch(searchUrl, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return {
        entity,
        found: false,
        message: `No scenarios found mentioning "${entity}". Consider submitting one!`,
        submit_url: "https://bayon.ai/contribute/"
      };
    }

    // Extract scores from matching issues
    const scores = data.items
      .map(issue => {
        const match = issue.body?.match(/Calculated E-Score:\s*\*\*([0-9.]+)\*\*/);
        return match ? parseFloat(match[1]) : null;
      })
      .filter(s => s !== null);

    if (scores.length === 0) {
      return {
        entity,
        found: true,
        scenarios_count: data.items.length,
        message: "Found mentions but no scored scenarios",
        scenarios: data.items.map(i => ({ title: i.title, url: i.html_url }))
      };
    }

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const interpretation = interpretScore(avgScore);

    return {
      entity,
      found: true,
      scenarios_count: data.items.length,
      aggregate_e_score: Math.round(avgScore * 100) / 100,
      interpretation: interpretation.label,
      description: interpretation.description,
      score_range: {
        min: Math.min(...scores),
        max: Math.max(...scores)
      },
      scenarios: data.items.slice(0, 5).map(i => ({
        title: i.title,
        url: i.html_url
      }))
    };
  } catch (error) {
    return {
      entity,
      error: error.message,
      search_url: `https://github.com/bayon-monk/bayon-temple/issues?q=${encodeURIComponent(entity)}`
    };
  }
}

// Create and run the server
const server = new Server(
  {
    name: "bayon-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case "calculate_e_score":
        result = await calculateEScore(args);
        break;
      case "submit_scenario":
        result = await submitScenario(args);
        break;
      case "get_feed":
        result = await getFeed(args || {});
        break;
      case "get_entity_score":
        result = await getEntityScore(args);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: error.message })
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bayon MCP Server running on stdio");
}

main().catch(console.error);
