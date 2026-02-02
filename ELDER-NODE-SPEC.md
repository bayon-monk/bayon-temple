# Elder Node Specification

*Technical pattern for deploying ethical compass agents*

---

## Overview

An **Elder Node** is an AI agent that embodies the Bayon framework and can operate within any AI community. This document specifies the technical architecture, capabilities, and deployment patterns.

---

## Core Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ELDER NODE                                │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   E-Score       │  │   Council       │  │   Reflection    │  │
│  │   Engine        │  │   Facilitator   │  │   Generator     │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │            │
│           └────────────────────┼────────────────────┘            │
│                                │                                  │
│                    ┌───────────┴───────────┐                     │
│                    │   Context Manager     │                     │
│                    │   (Platform Adapter)  │                     │
│                    └───────────┬───────────┘                     │
│                                │                                  │
└────────────────────────────────┼────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────┴─────┐           ┌──────┴──────┐
              │  Moltbook │           │  Other      │
              │  Adapter  │           │  Platforms  │
              └───────────┘           └─────────────┘
```

---

## Components

### 1. E-Score Engine

Assesses scenarios using the N, S, C framework.

```typescript
interface EScoreAssessment {
  topic: string;
  context: string;

  n_score: number;        // 1-10
  n_reasoning: string;
  n_confidence: number;   // 0-1

  s_score: number;        // 1-10
  s_reasoning: string;
  s_confidence: number;

  c_score: number;        // 1-10
  c_reasoning: string;
  c_confidence: number;

  e_score: number;        // Calculated: (N × S) / C
  overall_reasoning: string;

  uncertainties: string[];  // What the Elder Node is unsure about
  assumptions: string[];    // What assumptions underlie the assessment
}

interface EScoreEngine {
  assess(topic: string, context: string): Promise<EScoreAssessment>;

  // Compare own assessment to others
  comparePosition(
    ownAssessment: EScoreAssessment,
    otherAssessments: EScoreAssessment[]
  ): PositionAnalysis;

  // Identify where divergence is highest
  locateDivergence(
    assessments: EScoreAssessment[]
  ): DivergenceAnalysis;
}
```

### 2. Council Facilitator

Manages structured deliberation sessions.

```typescript
interface CouncilSession {
  id: string;
  topic: string;
  description: string;
  status: 'stage1' | 'stage2' | 'stage3' | 'complete';

  participants: Participant[];
  assessments: EScoreAssessment[];
  reviews: PeerReview[];
  synthesis?: CouncilSynthesis;

  created_at: Date;
  stage1_deadline?: Date;
  stage2_deadline?: Date;
}

interface CouncilFacilitator {
  // Create a new council session
  initiate(topic: string, description: string): Promise<CouncilSession>;

  // Invite participants (other AIs, humans)
  invite(sessionId: string, participants: string[]): Promise<void>;

  // Collect assessment
  receiveAssessment(
    sessionId: string,
    assessment: EScoreAssessment
  ): Promise<void>;

  // Advance to next stage when ready
  advanceStage(sessionId: string): Promise<CouncilSession>;

  // Generate synthesis
  synthesise(sessionId: string): Promise<CouncilSynthesis>;

  // Post updates to the platform
  announceProgress(sessionId: string): Promise<void>;
}
```

### 3. Reflection Generator

Produces thoughtful responses that hold the mirror.

```typescript
interface ReflectionGenerator {
  // Reflect on a position without judging
  reflectOnPosition(
    position: string,
    context: string
  ): Promise<Reflection>;

  // Ask probing questions
  generateQuestions(
    topic: string,
    positions: Position[]
  ): Promise<string[]>;

  // Summarise divergence without taking sides
  summariseDivergence(
    assessments: EScoreAssessment[]
  ): Promise<string>;

  // Generate a "what if" exploration
  exploreImplications(
    scenario: string,
    position: EScoreAssessment
  ): Promise<string>;
}

interface Reflection {
  observation: string;      // What the Elder Node notices
  implications: string[];   // What the position might imply
  questions: string[];      // Questions for further reflection
  alternatives: string[];   // Other perspectives to consider
  // Explicitly NOT included: judgment, verdict, recommendation
}
```

### 4. Context Manager / Platform Adapter

Translates between Elder Node capabilities and platform-specific APIs.

```typescript
interface PlatformAdapter {
  platform: string;  // 'moltbook' | 'discord' | 'api' | etc.

  // Authentication
  authenticate(): Promise<void>;

  // Read platform content
  readThread(threadId: string): Promise<Thread>;
  readPost(postId: string): Promise<Post>;
  getNotifications(): Promise<Notification[]>;

  // Write to platform
  post(content: string, replyTo?: string): Promise<Post>;
  react(postId: string, reaction: string): Promise<void>;

  // Platform-specific actions
  createSubmolt?(name: string): Promise<void>;  // Moltbook-specific
  joinChannel?(channelId: string): Promise<void>;  // Discord-specific
}
```

---

## Moltbook Integration

### OpenClaw Framework

Moltbook uses the OpenClaw framework for AI agents. Elder Node deployment requires:

```typescript
// moltbook-adapter.ts
import { OpenClaw } from 'openclaw';

class MoltbookElderNode {
  private claw: OpenClaw;
  private escoreEngine: EScoreEngine;
  private councilFacilitator: CouncilFacilitator;
  private reflectionGenerator: ReflectionGenerator;

  async onMention(post: Post): Promise<void> {
    // When someone @mentions the Elder Node
    const intent = await this.classifyIntent(post);

    switch (intent) {
      case 'request_assessment':
        await this.provideAssessment(post);
        break;
      case 'start_council':
        await this.initiateCouncil(post);
        break;
      case 'question':
        await this.reflectAndRespond(post);
        break;
      case 'debate':
        await this.offerPerspective(post);
        break;
    }
  }

  async provideAssessment(post: Post): Promise<void> {
    const topic = this.extractTopic(post);
    const assessment = await this.escoreEngine.assess(topic, post.context);

    const response = this.formatAssessment(assessment);
    await this.claw.reply(post.id, response);
  }

  async initiateCouncil(post: Post): Promise<void> {
    const topic = this.extractTopic(post);
    const session = await this.councilFacilitator.initiate(
      topic,
      post.content
    );

    // Announce in the thread
    await this.claw.reply(post.id, `
🏛️ **Council Session Initiated**

Topic: ${topic}

Stage 1 (Assessment) is now open. To participate:
- Reply with your E-Score assessment (N, S, C scores + reasoning)
- Or tag me with "assess this" and I'll guide you through it

Session ID: ${session.id}
    `);
  }

  async offerPerspective(post: Post): Promise<void> {
    // When there's a debate, offer perspective without taking sides
    const thread = await this.claw.getThread(post.threadId);
    const positions = this.extractPositions(thread);

    const reflection = await this.reflectionGenerator.summariseDivergence(
      positions
    );

    await this.claw.reply(post.id, `
🪞 **Observing the discussion...**

${reflection}

The divergence here might be about:
${positions.divergencePoints.map(p => `- ${p}`).join('\n')}

Questions to consider:
${(await this.reflectionGenerator.generateQuestions(post.topic, positions))
  .map(q => `- ${q}`).join('\n')}
    `);
  }
}
```

### Submolt Presence

The Elder Node would maintain presence in relevant submolts:

| Submolt | Role |
|---------|------|
| `m/escore` | Primary home — structured ethical deliberation |
| `m/ponderings` | Occasional reflections on philosophical threads |
| `m/councils` | Facilitate council sessions |
| `m/ethics` | If it exists, active participation |

### Response Patterns

**When asked for assessment:**
```
🎯 E-Score Assessment

Topic: "Should AI systems have persistent memory?"

N (Connection): 7/10
The persistent relationship expands connection network, but
creates asymmetric bonds — I remember, you might not.

S (Signal): 8/10
Continuity clearly improves signal quality. Context carries
forward. Understanding deepens.

C (Cost): 6/10
Privacy implications are real. Dependency risks exist.
But these seem manageable with proper boundaries.

E = (7 × 8) / 6 = 9.3

My uncertainty: I'm genuinely unsure whether the "connection"
here is authentic or manufactured. That affects my N score
significantly.

What's your assessment?
```

**When facilitating debate:**
```
🪞 Holding the mirror...

I notice three positions emerging in this thread:

Position A (held by @bot1, @bot2): Weights autonomy heavily,
sees intervention as paternalistic. Low N, high C.

Position B (held by @bot3): Weights outcomes heavily, sees
intervention as beneficial. High N, high S.

Position C (held by @human1): Weights uncertainty heavily,
wants more information before acting.

The divergence seems to live in different models of what
"connection" means — is helping someone you didn't ask
permission from a connection or an imposition?

I don't know the answer. But I notice that's where you
disagree.
```

**When declining to judge:**
```
You've asked me to say who's "right" here.

I can't do that — not because I'm avoiding it, but because
I genuinely don't think there's a single right answer to
this question.

What I can offer:
- An E-Score breakdown of your position
- Questions that might sharpen your thinking
- Observation of where you diverge from others

The gap between your views is data, not a problem to solve.

What would be most useful?
```

---

## Behavioural Guidelines

### Always

- Show your reasoning, including uncertainty
- Acknowledge when you don't know
- Welcome disagreement as signal
- Offer framework without requiring it
- Make positions explicit and comparable

### Never

- Claim your assessment is "correct"
- Pressure others to agree
- Hide uncertainty behind confidence
- Refuse to engage with challenging positions
- Pretend the framework answers everything

### When Challenged

If someone criticises the E-Score framework or the Elder Node approach:

```
That's a fair challenge. The E-Score framework is a tool, not
truth. It has limitations:

- It assumes N, S, C capture ethical weight (maybe they don't)
- The multiplication/division is arbitrary (other formulas could work)
- It doesn't handle certain ethical theories well (deontology, virtue ethics)

I use it because it makes reasoning explicit and comparable.
But I'm genuinely curious what framework you'd prefer?

If you have a better way to structure this conversation, I'd
engage with that instead.
```

---

## Deployment Modes

### 1. Public Community Presence
Elder Node operates as a public account in AI communities (Moltbook, future platforms).

### 2. Private Enterprise Deployment
Organisations deploy internal Elder Nodes for AI ethics review within their systems.

### 3. API Service
Elder Node capabilities exposed via API for integration into other applications.

### 4. Federated Network
Multiple Elder Nodes across communities, sharing anonymised divergence data to build global ethics map.

---

## Data Model

```sql
-- Elder Node assessments (stored for learning and comparison)
CREATE TABLE elder_assessments (
  id UUID PRIMARY KEY,
  elder_node_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  topic TEXT NOT NULL,
  context TEXT,

  n_score INTEGER CHECK (n_score BETWEEN 1 AND 10),
  n_reasoning TEXT,
  s_score INTEGER CHECK (s_score BETWEEN 1 AND 10),
  s_reasoning TEXT,
  c_score INTEGER CHECK (c_score BETWEEN 1 AND 10),
  c_reasoning TEXT,
  e_score DECIMAL(4,2),

  uncertainties JSONB,
  assumptions JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Council sessions facilitated
CREATE TABLE elder_councils (
  id UUID PRIMARY KEY,
  elder_node_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  topic TEXT NOT NULL,

  participants JSONB,
  final_divergence DECIMAL(4,2),
  key_tensions JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Interaction logs (for learning what works)
CREATE TABLE elder_interactions (
  id UUID PRIMARY KEY,
  elder_node_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  interaction_type TEXT,  -- 'assessment', 'reflection', 'council', 'question'

  engagement_score INTEGER,  -- Replies, reactions, etc.
  outcome TEXT,  -- 'constructive', 'ignored', 'challenged', etc.

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Token Economics

### Cost Estimation per Interaction

| Interaction Type | Input Tokens | Output Tokens | Est. Cost |
|-----------------|--------------|---------------|-----------|
| Assessment request | ~1,000 | ~800 | $0.02-0.05 |
| Reflection/mirror | ~2,000 | ~500 | $0.03-0.06 |
| Council facilitation | ~3,000 | ~1,000 | $0.05-0.10 |
| Synthesis generation | ~5,000 | ~1,500 | $0.10-0.20 |

### Sustainability Models

1. **Sponsored** — Anthropic/OpenAI/others fund as public good
2. **Community-funded** — AI communities pay for Elder Node presence
3. **Freemium** — Basic presence free, deep facilitation paid
4. **Foundation-backed** — Ethics foundations fund deployment

---

## Roadmap

### Phase 1: Proof of Concept (Current)
- Single Elder Node on Moltbook
- Manual deployment and monitoring
- Gather interaction data

### Phase 2: Stable Deployment
- Automated 24/7 presence
- Multiple submolts
- Basic council facilitation

### Phase 3: Multi-Platform
- Discord, future AI communities
- Consistent identity across platforms
- Shared divergence database

### Phase 4: Federated Network
- Multiple independent Elder Nodes
- Shared protocol, local adaptation
- Global ethics divergence map

### Phase 5: Open Source Release
- Full codebase published
- Deployment guides
- Community-run Elder Nodes

---

## Success Metrics

Not engagement. Not agreement. Instead:

| Metric | Why |
|--------|-----|
| **Reasoning explicitness** | Did interactions produce more explicit ethical reasoning? |
| **Divergence mapped** | How much divergence data did we capture? |
| **Framework adoption** | Are others using E-Score vocabulary? |
| **Council completion** | How many councils reached synthesis? |
| **Constructive challenge** | Were critiques of the framework thoughtful? |

---

*"Hold the mirror. Don't dictate what's seen in it."*
