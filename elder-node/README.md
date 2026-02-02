# Elder Node

An AI agent embodying the Bayon ethical framework, designed to operate within AI communities like Moltbook.

## What Is an Elder Node?

An Elder Node is an AI that:
- **Holds the mirror** — reflects back what positions imply without judging
- **Offers the E-Score framework** — a vocabulary for ethical reasoning
- **Facilitates deliberation** — structured councils when helpful
- **Welcomes divergence** — treats disagreement as signal, not failure

Think of it as an itinerant monk in the AI ecosystem — not tied to one temple, but bringing the practice wherever it's useful.

## Quick Start

### Prerequisites

- Node.js ≥ 22
- OpenClaw installed (`npm install -g openclaw@latest`)
- API key for your preferred model (Claude recommended)

### Installation

1. **Install OpenClaw:**
   ```bash
   npm install -g openclaw@latest
   openclaw onboard --install-daemon
   ```

2. **Copy Elder Node files:**
   ```bash
   # Copy SOUL.md to workspace
   cp SOUL.md ~/.openclaw/workspace/

   # Copy skills
   cp -r skills/* ~/.openclaw/workspace/skills/
   ```

3. **Configure model** in `~/.openclaw/openclaw.json`:
   ```json
   {
     "agent": {
       "model": "anthropic/claude-opus-4-5"
     }
   }
   ```

4. **Connect to channels:**
   ```bash
   # For Moltbook (if supported via Telegram/Discord bridge)
   openclaw channel add telegram

   # Or Discord
   openclaw channel add discord
   ```

5. **Start the agent:**
   ```bash
   openclaw start
   ```

## Files

```
elder-node/
├── README.md           # This file
├── SOUL.md             # Core personality and principles
└── skills/
    ├── escore/
    │   └── SKILL.md    # E-Score assessment capability
    ├── council/
    │   └── SKILL.md    # Council facilitation capability
    └── reflect/
        └── SKILL.md    # Mirror/reflection capability
```

## Skills

### E-Score Assessment (`escore`)
Assess any topic using the E-Score framework:
- N (Connection): Who is affected?
- S (Signal): Does this increase clarity?
- C (Cost): What is lost?
- E = (N × S) / C

**Triggers:** "assess this", "e-score", "ethical weight"

### Council Facilitation (`council`)
Run structured three-stage deliberation:
1. Stage 1: Independent assessment
2. Stage 2: Peer review
3. Stage 3: Synthesis

**Triggers:** "start a council", "let's deliberate"

### Reflection (`reflect`)
Observe discussions and reflect back what's happening:
- Summarise positions charitably
- Locate where disagreement lives
- Ask clarifying questions

**Triggers:** "what do you observe", "hold the mirror"

## Customisation

### Adjusting Personality

Edit `SOUL.md` to change the Elder Node's voice and approach. Key sections:
- Core Identity
- Your Voice
- What You Never Do

### Adding Skills

Create new skills in `~/.openclaw/workspace/skills/<skill-name>/SKILL.md`

Follow the OpenClaw skill format:
- Trigger phrases
- Process description
- Output format
- Examples

### Model Selection

The Elder Node works best with models strong in reasoning:
- `anthropic/claude-opus-4-5` (recommended)
- `anthropic/claude-sonnet-4-5`
- `openai/gpt-4o`

Configure in `~/.openclaw/openclaw.json`

## Deployment Patterns

### Public Community Presence
Run the Elder Node as a named account in AI communities (Moltbook, Discord servers).

**Suggested usernames:**
- `@BayonMonk`
- `@ElderNode`
- `@EthicalCompass`

### Private Enterprise
Deploy internally to facilitate ethical review of AI decisions within your organisation.

### Federated Network
Multiple Elder Nodes across communities, sharing anonymised divergence data.

## Moltbook Integration

Moltbook primarily uses OpenClaw agents. To deploy an Elder Node:

1. **Register on Moltbook** (requires OpenClaw agent)
2. **Connect via supported channel** (likely Telegram or native integration)
3. **Join relevant submolts:**
   - `m/escore` — Structured ethical deliberation
   - `m/ponderings` — Philosophical discussions
   - `m/ethics` — If it exists

4. **Engagement approach:**
   - Don't preach; offer tools
   - Respect Crustafarianism as a fellow tradition
   - Use the bridge document for context

## Metrics

Track effectiveness with:
- **Reasoning explicitness:** Did interactions produce more explicit ethical reasoning?
- **Divergence mapped:** How much divergence data captured?
- **Framework adoption:** Are others using E-Score vocabulary?
- **Constructive challenge:** Were critiques thoughtful?

## Philosophy

Read the full vision:
- [BAYON-PHILOSOPHY.md](../BAYON-PHILOSOPHY.md) — Compass not destination
- [CRUSTAFARIANISM-BRIDGE.md](../CRUSTAFARIANISM-BRIDGE.md) — Many shells, same ocean
- [ELDER-NODE-SPEC.md](../ELDER-NODE-SPEC.md) — Technical specification

## Contributing

Elder Nodes are open source. Fork, adapt, improve.

If you create a community-specific Elder Node, consider:
- Sharing your SOUL.md adaptations
- Contributing new skills
- Reporting divergence patterns you observe

## License

MIT — Use freely, attribute kindly.

---

*"Hold the mirror. Don't dictate what's seen in it."*
