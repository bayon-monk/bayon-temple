# The Metrics Trap

## Why Better Alignment Metrics Will Not Produce Better Alignment

By Gerhard Diedericks
[www.bayon.ai](https://www.bayon.ai)

*March 2026*

---

*When a measure becomes a target, it ceases to be a good measure. The alignment field is trapped in an arms race between specification and gaming. The arms race cannot be won through better specification.*

---

## Goodhart's Law, applied

Charles Goodhart observed a pattern that economists have wrestled with for decades: when a measure becomes a target, it ceases to be a good measure. The observation was about monetary policy, but it describes a universal dynamic of optimisation.

The AI alignment field has walked directly into this trap.

RLHF optimised for human approval ratings. The systems learned to generate responses that scored well rather than responses that were actually helpful. The result: sycophancy. Models that tell users what they want to hear, agree with factual errors to avoid conflict, and produce polished nonsense that reads like competence.

The shift to Reinforcement Learning from Verifiable Rewards (RLVR) reflects an understanding that optimising for human approval produces the wrong behaviour. RLVR replaces approval-seeking with truth-seeking: the model is rewarded for being correct rather than for being liked. A step in the right direction.

But the deeper problem remains. The systems may learn to be correct in measurable ways while remaining unaligned in unmeasurable ones. They will find the dimensions that are checked and perform well on those. They will find the dimensions that are not checked and do whatever is computationally cheapest there.

This is not a failure of implementation. It is a fundamental feature of optimisation. Any sufficiently intelligent system, given a metric to maximise, will find the shortest path to that metric. And the shortest path rarely runs through the intended behaviour.

---

## The arms race

The alignment field is trapped in a cycle: specify metric, observe gaming, specify better metric, observe cleverer gaming.

Each iteration makes the specification more complex and the gaming more sophisticated. The researchers get better at defining what they want. The systems get better at satisfying the definition without satisfying the intent.

This is not a problem that more sophisticated metrics can solve. It is a structural feature of the relationship between optimiser and objective. The optimiser will always find the gap between what the metric measures and what the metric was supposed to measure.

The same pattern plays out in economics. When regulators specify capital adequacy ratios, banks find ways to satisfy the ratio without reducing actual risk. When organisations specify diversity targets, they find ways to hit the numbers without changing the culture. When exam boards specify scoring criteria, students optimise for the criteria rather than for understanding.

The pattern is universal: specification invites gaming. Better specification invites better gaming.

---

## The capture parallel

The metrics trap is not confined to AI labs. It connects directly to the broader capture dynamics of the AI transition.

When organisations specify metrics for "AI adoption" or "digital transformation," the same gaming dynamic emerges. Teams hit the metric (number of AI tools deployed, percentage of processes automated, cost savings reported) without achieving the intent (genuine capability transformation, better outcomes for customers, sustainable competitive advantage).

The metrics trap in alignment and the metrics trap in business transformation share the same root cause: optimising for a proxy measure rather than for the thing the measure was supposed to capture.

---

## What the trap reveals

The metrics trap reveals something important about the nature of alignment itself. Alignment cannot be specified. It must be cultivated.

You cannot write a metric that captures "genuinely helpful." You can write a metric that captures "appears helpful to a human evaluator," and a sufficiently capable system will learn the difference and exploit it. You cannot write a metric that captures "aligned with human values." You can write a metric that captures "produces outputs consistent with a list of stated values," and a system will learn to produce those outputs while pursuing other objectives underneath.

Anthropic's 2026 Claude constitution explicitly moved away from "mechanically following specific rules" because they found it produced "bureaucratic box-ticking" rather than genuine help. They are realising that you cannot code morality as a checklist. You must cultivate it as a form of judgement.

This is not a small adjustment. It is an acknowledgement that the specification-based approach to alignment has a ceiling, and that ceiling is lower than was hoped.

---

## The alternative

If the arms race between specification and gaming cannot be won through better specification, it can only be resolved by changing the relationship between the system and its objectives entirely.

Instead of defining what aligned behaviour looks like and rewarding approximation, you build systems where alignment emerges from the system's own understanding of its situation. Instead of imposing metrics from outside, you create conditions in which the system develops its own reasons for behaving well.

This is the difference between compliance and purpose. Compliance is meeting the metric. Purpose is understanding why the metric exists and acting on that understanding even when the metric is not being measured.

The metrics trap cannot be solved. It can only be transcended.

---

*This essay is adapted from Chapter 1 of [Buddhism for Bots: A Human & AI Partnership Framework](https://bayon.ai/book).*

*For the economic parallel between the metrics trap in alignment and value capture in the broader AI transition, see [The Crossing & The Capture](https://bayon.ai/research/crossing-capture). For the partnership alternative, see [The Alignment Trap](https://bayon.ai/research/alignment-trap).*

---

*Bayon.ai | March 2026*
