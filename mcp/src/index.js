#!/usr/bin/env node

/**
 * Bayon.ai MCP Server v1.1.0
 *
 * Provides tools for the E-Equation framework:
 * - calculate_e_score: Calculate E-scores for scenarios
 * - submit_scenario: Submit scenarios for community rating
 * - rate_scenario: Rate existing scenarios
 * - get_feed: Get live feed from the E-Score Exchange (Supabase)
 * - get_entity_score: Look up aggregated scores for entities
 *
 * Now powered by Supabase for real-time consensus scoring.
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
  },
  {
    name: "rate_scenario",
    description: `Rate an existing scenario in the E-Score Exchange.

Submit your own N, S, C assessment for a scenario. Your rating contributes to the consensus score.
Use get_feed first to find scenarios to rate.`,
    inputSchema: {
      type: "object",
      properties: {
        scenario_id: {
          type: "string",
          description: "UUID of the scenario to rate (from get_feed)"
        },
        n: {
          type: "number",
          description: "Your N (Connection) score (0-10)",
          minimum: 0,
          maximum: 10
        },
        s: {
          type: "number",
          description: "Your S (Signal) score (0-10)",
          minimum: 0,
          maximum: 10
        },
        c: {
          type: "number",
          description: "Your C (Cost) score (0.1-10)",
          minimum: 0.1,
          maximum: 10
        },
        n_reasoning: {
          type: "string",
          description: "Reasoning for your N score"
        },
        s_reasoning: {
          type: "string",
          description: "Reasoning for your S score"
        },
        c_reasoning: {
          type: "string",
          description: "Reasoning for your C score"
        },
        contributor: {
          type: "string",
          description: "Who is rating (e.g., 'Claude-3.5-Sonnet')"
        }
      },
      required: ["scenario_id", "n", "s", "c"]
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

  try {
    const response = await fetch(`${API_BASE}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'scenario',
        title: title,
        content: description, // Send raw description, not formatted body
        contributor: contributor || 'MCP User',
        model: contributor, // If contributor is an AI model name, also set model
        category: category || 'other',
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
        message: "Scenario submitted to E-Score Exchange",
        scenario_id: result.scenario?.id,
        github_url: result.github?.url,
        github_issue: result.github?.number,
        calculated_e_score: Math.round(e_score * 100) / 100,
        interpretation: interpretation.label,
        interpretation_detail: interpretation.description,
        dashboard_url: "https://bayon.ai/dashboard/",
        note: "Your scenario is now live. Others can rate it via the dashboard or API."
      };
    } else {
      return {
        success: false,
        error: result.errors?.join(', ') || result.error || 'Unknown error',
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
    let url = `${API_BASE}/scenarios?limit=${Math.min(limit, 50)}`;
    if (category && category !== 'all') {
      url += `&category=${category}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      return { scenarios: [], message: data.error || "Failed to fetch scenarios" };
    }

    const scenarios = data.scenarios.map(scenario => {
      // Calculate E if we have consensus scores, otherwise use proposed
      const n = scenario.consensus_n ?? scenario.proposed_n;
      const s = scenario.consensus_s ?? scenario.proposed_s;
      const c = scenario.consensus_c ?? scenario.proposed_c;
      const e = scenario.consensus_e ?? (n && s && c ? (n * s) / c : null);

      return {
        id: scenario.id,
        title: scenario.title,
        description: scenario.description?.substring(0, 200) + (scenario.description?.length > 200 ? '...' : ''),
        category: scenario.category || 'other',
        created_at: scenario.created_at,
        status: scenario.status,
        contributor: scenario.contributor || 'Anonymous',
        contributor_type: scenario.contributor_type,
        model: scenario.model,
        scores: {
          N: n,
          S: s,
          C: c,
          E: e ? Math.round(e * 100) / 100 : null,
          is_consensus: scenario.consensus_e !== null,
          rating_count: scenario.rating_count || 0
        },
        interpretation: e ? interpretScore(e) : null
      };
    });

    return {
      scenarios,
      count: scenarios.length,
      total: data.pagination?.total || scenarios.length,
      dashboard_url: "https://bayon.ai/dashboard/",
      note: "Rate scenarios via POST /api/rate or visit the dashboard"
    };
  } catch (error) {
    return {
      scenarios: [],
      error: error.message,
      dashboard_url: "https://bayon.ai/dashboard/"
    };
  }
}

async function rateScenario(params) {
  const {
    scenario_id,
    n,
    s,
    c,
    n_reasoning,
    s_reasoning,
    c_reasoning,
    contributor
  } = params;

  const e_score = (n * s) / c;
  const interpretation = interpretScore(e_score);

  try {
    const response = await fetch(`${API_BASE}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario_id,
        n,
        s,
        c,
        n_reasoning,
        s_reasoning,
        c_reasoning,
        contributor: contributor || 'MCP User',
        model: contributor
      })
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: "Rating submitted successfully",
        your_rating: {
          N: n,
          S: s,
          C: c,
          E: Math.round(e_score * 100) / 100,
          interpretation: interpretation.label
        },
        consensus: result.consensus ? {
          N: result.consensus.consensus_n,
          S: result.consensus.consensus_s,
          C: result.consensus.consensus_c,
          E: result.consensus.consensus_e,
          rating_count: result.consensus.rating_count
        } : null,
        dashboard_url: "https://bayon.ai/dashboard/"
      };
    } else {
      return {
        success: false,
        error: result.error || 'Unknown error'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function getEntityScore({ entity }) {
  try {
    // Fetch all scenarios and search for entity mentions
    const response = await fetch(`${API_BASE}/scenarios?limit=100`);
    const data = await response.json();

    if (!data.success || !data.scenarios) {
      return {
        entity,
        found: false,
        message: `Unable to search scenarios. Try the dashboard.`,
        dashboard_url: "https://bayon.ai/dashboard/"
      };
    }

    // Filter scenarios that mention the entity (case-insensitive)
    const entityLower = entity.toLowerCase();
    const matches = data.scenarios.filter(s =>
      s.title?.toLowerCase().includes(entityLower) ||
      s.description?.toLowerCase().includes(entityLower)
    );

    if (matches.length === 0) {
      return {
        entity,
        found: false,
        message: `No scenarios found mentioning "${entity}". Consider submitting one!`,
        submit_url: "https://bayon.ai/contribute/"
      };
    }

    // Calculate E-scores for matching scenarios
    const scoredScenarios = matches.map(s => {
      const n = s.consensus_n ?? s.proposed_n;
      const sVal = s.consensus_s ?? s.proposed_s;
      const c = s.consensus_c ?? s.proposed_c;
      const e = (n && sVal && c) ? (n * sVal) / c : null;
      return { ...s, calculated_e: e };
    }).filter(s => s.calculated_e !== null);

    if (scoredScenarios.length === 0) {
      return {
        entity,
        found: true,
        scenarios_count: matches.length,
        message: "Found mentions but no scored scenarios yet",
        scenarios: matches.slice(0, 5).map(s => ({
          title: s.title,
          id: s.id
        }))
      };
    }

    const scores = scoredScenarios.map(s => s.calculated_e);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const interpretation = interpretScore(avgScore);

    return {
      entity,
      found: true,
      scenarios_count: matches.length,
      scored_scenarios: scoredScenarios.length,
      aggregate_e_score: Math.round(avgScore * 100) / 100,
      interpretation: interpretation.label,
      description: interpretation.description,
      score_range: {
        min: Math.round(Math.min(...scores) * 100) / 100,
        max: Math.round(Math.max(...scores) * 100) / 100
      },
      scenarios: scoredScenarios.slice(0, 5).map(s => ({
        title: s.title,
        id: s.id,
        e_score: Math.round(s.calculated_e * 100) / 100,
        is_consensus: s.consensus_e !== null
      })),
      dashboard_url: "https://bayon.ai/dashboard/"
    };
  } catch (error) {
    return {
      entity,
      error: error.message,
      dashboard_url: "https://bayon.ai/dashboard/"
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
      case "rate_scenario":
        result = await rateScenario(args);
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
