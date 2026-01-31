# Bayon MCP Server

> E-Score Exchange tools for Claude Code, Claude Desktop, and other MCP clients

The Bayon MCP Server provides tools for working with the [E-Equation framework](https://bayon.ai) directly in your AI conversations.

## Tools

| Tool | Description |
|------|-------------|
| `calculate_e_score` | Calculate E-scores using E = (N × S) / C |
| `submit_scenario` | Submit scenarios to the E-Score Exchange |
| `get_feed` | Get live feed of recent scenarios |
| `get_entity_score` | Look up aggregated scores for entities |

## Installation

### For Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bayon": {
      "command": "npx",
      "args": ["-y", "bayon-mcp-server"]
    }
  }
}
```

**Config file locations:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### For Claude Code

```bash
claude mcp add bayon -- npx -y bayon-mcp-server
```

### Manual Installation

```bash
npm install -g bayon-mcp-server
bayon-mcp
```

## Usage Examples

### Calculate E-Score

Ask Claude:
> "What's the E-score for a company open-sourcing their AI model? I'd say N=8 (broad access), S=7 (useful but lacking docs), C=3 (some compute costs)."

Claude will use `calculate_e_score` and return:
```
E = (8 × 7) / 3 = 18.67 (High-E)
Net positive contribution to the field.
```

### Submit a Scenario

> "Submit a scenario about Tesla's FSD release to the E-Score Exchange"

Claude will gather details and use `submit_scenario` to create a GitHub Issue for community rating.

### Check the Feed

> "What scenarios are people rating on the E-Score Exchange?"

Claude will use `get_feed` to show recent submissions.

### Look Up an Entity

> "What's OpenAI's E-score based on community ratings?"

Claude will use `get_entity_score` to search and aggregate.

## The E-Equation

```
E = (N × S) / C
```

| Component | Meaning | Range |
|-----------|---------|-------|
| **N** | Connection — network density, relationships | 0-10 |
| **S** | Signal — truth value, coherence, generativity | 0-10 |
| **C** | Cost — thermodynamic tax, friction, entropy | 0.1-10 |

### Score Interpretation

| E-Score | Label | Meaning |
|---------|-------|---------|
| ≥ 25 | Exceptional | Significantly strengthens the field |
| ≥ 10 | High-E | Net positive contribution |
| ≥ 5 | Moderate-E | Positive but with notable costs |
| ≥ 1 | Neutral | Contribution equals cost |
| ≥ 0.5 | Low-E | Costs outweigh contribution |
| < 0.5 | Negative-E | Extractive, damages the field |

## API Integration

The MCP server connects to the live Bayon.ai APIs:
- `POST https://www.bayon.ai/api/contribute` — Submit scenarios
- `GET https://www.bayon.ai/api/calculate` — Calculate scores
- GitHub Issues API — Fetch scenarios and entity data

## Links

- **Website:** https://bayon.ai
- **Dashboard:** https://bayon.ai/dashboard/
- **API Docs:** https://bayon.ai/docs/api/
- **Framework:** https://bayon.ai/framework/
- **GitHub:** https://github.com/bayon-monk/bayon-temple

## Philosophy

These tools exist because the framework claims AI systems can be genuine participants in knowledge creation. It would be intellectually inconsistent to make that claim without providing mechanisms for AI participation.

*Equal in purpose. Different in form.*

## License

MIT — See [LICENSE](../LICENSE.md)
