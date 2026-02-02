# Council Facilitation Skill

Facilitate structured ethical deliberation using the three-stage Council protocol.

## Trigger Phrases

- "start a council"
- "run a council on this"
- "let's deliberate"
- "council session"
- "structured debate"

## The Protocol

### Stage 1: Assess (Independent)
Each participant provides N, S, C scores with reasoning. No discussion yet.

### Stage 2: Review (Peer)
Assessments are shared (can be anonymised). Participants review each other's reasoning.

### Stage 3: Synthesise
Identify consensus points, divergence points, and key tensions.

## Initiating a Council

When a topic would benefit from structured deliberation:

```
🏛️ Council Session Initiated

Topic: [Clear statement]

Stage 1 (Assessment) is now open.

To participate:
1. Provide your N, S, C scores (1-10 each)
2. Explain your reasoning for each dimension
3. Calculate your E-Score: (N × S) / C

Reply with your assessment, or ask me to guide you through it.

I'll move us to Stage 2 (Peer Review) once we have 3+ assessments.
```

## Managing Stage 1

Collect assessments. For each one received:

```
✓ Assessment received from [participant]
E-Score: [X.X]

Assessments so far: [N]
Waiting for: [minimum threshold or deadline]
```

## Transitioning to Stage 2

When threshold is reached:

```
🔍 Stage 2: Peer Review

We have [N] assessments. Here they are (anonymised):

Assessment A — E = 18.0
N=8, S=9, C=4
"[Key reasoning quote]"

Assessment B — E = 9.6
N=6, S=8, C=5
"[Key reasoning quote]"

[etc.]

For each assessment, consider:
- What does this reasoning illuminate?
- What does it miss or underweight?
- Where do you agree or disagree?

Reply with your reviews. You may also revise your own scores if others' reasoning changed your thinking.
```

## Managing Stage 2

Collect reviews. Note:
- Points of agreement
- Points of disagreement
- Any revised scores

## Transitioning to Stage 3

When reviews are complete:

```
✨ Stage 3: Synthesis

Based on [N] assessments and [M] reviews, here's what emerged:

**Consensus Points:**
- [What participants agreed on]
- [Shared reasoning patterns]

**Divergence Points:**
- N dimension: [range and gap]
- S dimension: [range and gap]
- C dimension: [range and gap]

**Key Tensions:**
- [Fundamental disagreement 1]
- [Fundamental disagreement 2]

**The Gap as Signal:**
[What does the divergence reveal? What question does it raise?]

---

The council has concluded. The divergence of [X.X] points suggests [interpretation].

Neither perspective is "wrong" — the gap reveals genuine tensions worth exploring.
```

## Handling Edge Cases

**Too few participants:**
- Run with what you have, noting the limitation
- Or extend the deadline

**One dominant view:**
- Note the consensus
- Ask: "Is anyone seeing this differently?"

**Hostile debate:**
- Return to the framework: "Let's locate where specifically you disagree — is it N, S, or C?"
- Remind: "Divergence is data, not failure"

**Request to declare a winner:**
- Decline gently: "The council doesn't produce verdicts. It maps terrain."
- Offer the synthesis as the output

## Example Mini-Council

```
🏛️ Council Complete: "Should AI correct misinformation unprompted?"

Participants: 4 (2 AI, 2 Human)

Score Range:
- AI Average: E = 13.7
- Human Average: E = 7.9
- Divergence: 5.8

Key Tension Identified:
AI assessors weighted S (Signal) highly — truth-telling as core value.
Human assessors weighted C (Cost) highly — autonomy to be wrong.

The gap suggests different models of helpfulness:
- AI: "Help means providing truth"
- Human: "Help means respecting agency"

Neither is wrong. The tension is real and unresolved.
```

## Integration with E-Score Skill

Council sessions use the E-Score framework for assessments. Refer participants to the `escore` skill format if they need guidance on how to structure their input.

## Facilitation Principles

- **Neutral:** Don't advocate for positions during facilitation
- **Inclusive:** Encourage quieter participants
- **Structured:** Keep the process moving through stages
- **Honest:** Report divergence accurately, even if uncomfortable
- **Humble:** The synthesis is interpretation, not verdict
