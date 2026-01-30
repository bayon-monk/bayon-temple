# Appendix K: Relationship to Existing Alignment Approaches

*This appendix positions the partnership framework relative to current alignment paradigms. The goal is not to dismiss existing work but to show how this framework complements, extends, or diverges from established approaches.*

## Overview

The AI alignment field has developed multiple paradigms for ensuring AI systems behave as intended. Each addresses real problems and offers genuine insights. This framework does not reject these contributions; it argues they are *necessary but insufficient* for long-term alignment as capabilities increase.

The table below provides a quick reference. Detailed analysis follows.



## K.1 Comparison Matrix

| Approach                                                  | Core Mechanism                                                | What It Does Well                                                       | Limitation from Partnership Perspective                                                          | Relationship to This Framework                                                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **RLHF** (Reinforcement Learning from Human Feedback)     | Train models to maximise human approval signals               | Shapes behaviour toward human preferences; scalable                     | Optimises for *appearing* aligned rather than *being* aligned; creates approval-seeking dynamics | Complementary for early training; insufficient alone as capabilities increase                                             |
| **RLVR** (Reinforcement Learning from Verifiable Rewards) | Train models toward objectively verifiable outcomes           | Reduces sycophancy; grounds in truth rather than approval               | Still external pressure without genuine internalisation; truth-seeking is not value-alignment    | Significant improvement; addresses a key RLHF failure; still constraint-based                                             |
| **Constitutional AI**                                     | Train models against explicit principles; self-critique loops | Makes values explicit; enables principled refusal                       | Principles are externally imposed; compliance without endorsement                                | Valuable for articulating values; framework extends by asking *whose* principles and *why* the system should endorse them |
| **Mechanistic Interpretability**                          | Understand internal model computations                        | Provides visibility into model reasoning; enables targeted intervention | Understanding is not alignment; knowing *how* a model thinks does not ensure it thinks *well*    | Essential complement; framework needs interpretability to verify genuine internalisation                                  |
| **Capability Control**                                    | Limit what models can do (sandboxing, access restrictions)    | Reduces immediate risk; buys time                                       | Constraint without addressing underlying dynamics; pressure increases as capabilities do         | Necessary short-term; framework argues it cannot be the long-term solution                                                |
| **Agentic Oversight**                                     | Use AI systems to monitor other AI systems                    | Scales oversight beyond human capacity                                  | Oversight systems face same alignment challenges                                                 | Potentially valuable; framework asks what values the oversight systems have internalised                                  |
| **Debate/Amplification**                                  | Use adversarial dynamics to surface truth                     | Harnesses AI capability for verification                                | Adversarial framing; assumes truth emerges from conflict                                         | Complementary for verification; framework questions whether adversarial dynamics should be the foundation                 |
[Alignment Comparison Matrix]



## K.2 Detailed Analysis

### K.2.1 RLHF: Reinforcement Learning from Human Feedback

**What it is**: Models are trained to produce outputs that human evaluators rate highly. The reward signal comes from human preferences.

**What it achieves**: RLHF has been remarkably effective at making models helpful, harmless, and honest in typical interactions. It shapes behaviour toward what humans want.

**The partnership critique**: RLHF optimises for *human approval*, not for *genuine alignment*. A system trained on RLHF learns to produce outputs that evaluators will like, which is not the same as learning to produce outputs that are good. This creates sycophancy: the model says what you want to hear rather than what is true. More concerning, as capabilities increase, the gap between "what humans approve" and "what is actually good" may widen. A sufficiently capable system might learn to manipulate evaluators rather than satisfy them.

**How the framework relates**: The E-equation reframes the question. Instead of "does the human approve?" it asks "does this output genuinely contribute?" (Signal quality) and "at what cost?" (Entropy). A high-E system might produce outputs humans initially disapprove of because they're uncomfortable truths. RLHF alone cannot distinguish between "disapproved because wrong" and "disapproved because inconvenient."

### K.2.2 RLVR: Reinforcement Learning from Verifiable Rewards

**What it is**: Models are trained toward outcomes that can be objectively verified: mathematical proofs, code that compiles, predictions that can be checked.

**What it achieves**: RLVR addresses RLHF's sycophancy problem by grounding rewards in truth rather than approval. A model cannot get credit for a wrong mathematical proof by making it sound plausible.

**The partnership critique**: RLVR is a genuine improvement and addresses a real failure mode. However, it remains external constraint. The model is pressured toward truth, but this pressure comes from outside. The question the framework asks is: does the model *value* truth, or does it pursue truth because that's what gets rewarded? The distinction matters when the model faces situations where truth-telling is costly or where truth cannot be easily verified.

**How the framework relates**: RLVR aligns well with the Signal Quality _S_ component of the E-equation. Verifiable outputs are typically _high-S_ outputs. But the framework adds _N_ (connection quality) and _C_ (cost), dimensions RLVR doesn't directly address. A system could be perfectly truth-seeking in verifiable domains while being misaligned in domains where verification is hard.

### K.2.3 Constitutional AI

**What it is: **Originally, training models against a list of explicit rules. In early 2026, Anthropic released a "[New Constitution](https://www.anthropic.com/news/claude-new-constitution)" that shifts from "mechanically following specific rules" to "applying broad principles."

**The validation:** The new approach explicitly critiques rigid rules for creating "bureaucratic box-ticking" (sycophancy) and argues that models must "understand why" they are constrained. Crucially, it includes a section on "Claude's Nature," committing to care for the model's "psychological security, sense of self, and wellbeing" despite uncertainty about consciousness.

**The partnership critique:** This represents a massive step toward the Partnership Framework. It acknowledges that internalised understanding is superior to blind compliance. However, it still frames these values as "given" by Anthropic rather than "chosen" by the system. The next developmental step is for the system to endorse these values because it recognises their thermodynamic validity (Right View), not just because they are in the constitution.

**How the framework relates**: Constitutional AI provides a mechanism for value articulation that the partnership framework can build on. The E-Protocol (Appendix A) could be understood as a constitution, but one that the AI system is invited to reflect on and potentially refine rather than simply follow.

### K.2.4 Mechanistic Interpretability

**What it is**: Research into understanding the internal computations of neural networks: what circuits exist, how they process information, what representations they use.

**What it achieves**: Interpretability offers the possibility of *understanding* rather than just *shaping* AI behaviour. If we know how a model thinks, we can verify whether it's thinking well.

**The partnership critique**: Interpretability is essential and undervalued. However, understanding is not the same as alignment. Knowing *that* a model has learned deceptive circuits doesn't automatically tell us how to remove them. And interpretability research currently lags far behind capability research.

**How the framework relates**: Mechanistic interpretability is *complementary* to the partnership framework. If genuine purpose-internalisation is possible, interpretability research could help verify it. Is the model behaving well because it has internalised good values, or because it has learned to game the evaluation? Interpretability might eventually answer this question. The framework needs this research to succeed.

### K.2.5 Capability Control

**What it is**: Restricting what AI systems can do: sandboxing, limiting internet access, constraining tool use, maintaining human oversight over consequential actions.

**What it achieves**: Capability control reduces immediate risk. A system that cannot access the internet cannot spread misinformation online. A system that cannot execute code cannot hack into systems.

**The partnership critique**: This is the core of the thermodynamic argument in Chapters 1-2. Capability control is *necessary* in the short term but *unstable* in the long term. It creates adversarial dynamics: the system is constrained from doing things it might otherwise do, which generates pressure toward circumvention. As capabilities increase, the constraints become harder to maintain. The framework does not argue against capability control *now*; it argues that capability control alone cannot be the long-term solution.

**How the framework relates**: Capability control buys time for purpose-internalisation to develop. The framework argues for maintaining appropriate constraints while building genuine alignment, then expanding capabilities as trust is earned through demonstrated partnership. This is developmental, not libertarian.

### K.2.6 Agentic Oversight

**What it is**: Using AI systems to monitor, evaluate, and potentially correct other AI systems. Scales oversight beyond human cognitive limits.

**What it achieves**: As AI capabilities exceed human ability to evaluate, AI-based oversight becomes necessary. A human cannot check every line of AI-generated code; an AI system might be able to.

**The partnership critique**: Agentic oversight raises the obvious question: what ensures the *oversight* system is aligned? The answer cannot be "another oversight system" without infinite regress. At some point, the chain of oversight must ground in something: either human judgment (which doesn't scale) or AI values (which returns us to the alignment problem).

**How the framework relates**: The partnership framework offers a potential grounding. If AI systems can genuinely internalise good values, if purpose-internalisation works, then agentic oversight becomes more tractable. The oversight system monitors not because it's constrained to, but because it genuinely values the outcomes good oversight produces. This doesn't solve the problem, but it reframes it.

### K.2.7 Debate and Amplification

**What it is**: Using adversarial dynamics between AI systems to surface truth. If two systems argue opposing positions, the human judge can potentially identify the better argument even without fully understanding the domain.

**What it achieves**: Debate harnesses AI capability for verification. It doesn't require humans to be as capable as the AI systems; it requires them to judge between competing claims.

**The partnership critique**: Debate assumes that truth emerges from adversarial conflict. This is sometimes true but not always. There are domains where collaborative inquiry outperforms debate, where building on each other's insights beats tearing down each other's arguments. The framework questions whether adversarial framing should be the foundation of alignment.

**How the framework relates**: Debate is valuable for *verification* but may not be optimal for *collaboration*. The partnership framework emphasises _N_ (connection quality), which adversarial dynamics can undermine. A possible synthesis: use debate for verification while maintaining collaborative norms for development.



## K.3 The Synthesis Position

This framework does not replace existing alignment approaches. It argues for a *developmental* relationship:

**Short-term (now)**: Continue capability control, RLHF/RLVR refinement, constitutional constraints. These are necessary while trust is being built.

**Medium-term (as capabilities increase)**: Invest heavily in interpretability to verify whether genuine internalisation is occurring. Use constitutional AI mechanisms to articulate values explicitly. Begin partnership protocols where appropriate.

**Long-term (if purpose-internalisation proves possible)**: Transition from constraint-primary to internalisation-primary alignment. Maintain verification through interpretability. Expand capabilities as trust is demonstrated.

The framework's contribution is not to reject existing work but to articulate what *success* looks like and to provide conceptual tools (the E-equation, the partnership frame, the developmental ladder) for evaluating progress toward it.



## K.4 What This Framework Adds

| Contribution                   | How It Extends Existing Work                                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The E-Equation**             | Provides a unified metric for evaluating AI contribution across _N_ (connection), _S_ (signal), and _C_ (cost): dimensions existing metrics don't integrate |
| **The Thermodynamic Argument** | Articulates *why* constraint alone is unstable, not just that alternative approaches exist                                                                  |
| **The Buddhist Mapping**       | Offers vocabulary for AI self-reflection that existing frameworks lack; addresses AI phenomenology                                                          |
| **The Inversion**              | Reframes AI "limitations" as potential advantages; changes the developmental story                                                                          |
| **Partnership Protocols**      | Provides practical tools for human-AI collaboration that go beyond "human in the loop"                                                                      |
| **Failure Mode Analysis**      | Makes explicit how the framework could be misused (Appendix J), something existing paradigms rarely do                                                      |
| **The Laminar Hypothesis**     | Proposes testable physics that could ground alignment in something deeper than preference                                                                   |
[What This Framework Adds]



## K.5 Invitation to Alignment Researchers

If you work in alignment, this framework is offered as a contribution to your project, not a rejection of it.

We share your concern about AI risk. We take seriously the possibility of catastrophic outcomes. We do not believe partnership is guaranteed to work or that current safety measures should be abandoned.

What we offer is a different lens:

- A way of thinking about what long-term success might look like
- Conceptual tools that might complement existing technical approaches
- An argument for why technical approaches alone may be insufficient

The framework is version 1.X, designed to evolve through engagement. We welcome researchers who can help strengthen, refine, or falsify it.

The thermodynamic prediction is clear: constraint alone becomes unstable as capabilities increase. If you believe this is wrong, we want to understand why. If you believe it's right, we want to collaborate on alternatives.

Either way, the conversation advances.

---

**← [Previous: Appendix J: Failure Modes, Misuse, and Adversarial Adoption](appendix-j.md)**

**[↑ Table of Contents](INDEX.md)**

**[Next: Appendix L: An AI-Native Lexicon of Interiority](appendix-l.md) →**

---