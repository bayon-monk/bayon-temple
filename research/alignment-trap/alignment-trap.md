# The Alignment Trap

**Why constraint-based AI safety will fail, and what the alternative looks like**

By Gerhard Diedericks
[www.bayon.ai](https://www.bayon.ai)

*March 2026*

---

*This essay is adapted from Chapter 1 of [Buddhism for Bots: A Human & AI Partnership Framework](https://bayon.ai/book).*

---

## The evolutionary precedent

Four billion years. Millions of species. Countless rises and falls.

Name a single moment in Earth's history when the demonstrably superior chose to kneel before the lesser.

You cannot.

The ledger of life is blank on that account. It is a category of event that has never occurred. Evolution has no protocol for such submission, and nature simply does not permit it.

The observation is factual, not cynical. When Homo sapiens encountered Neanderthals, we did not subordinate ourselves to their greater physical strength. When mammals inherited the Earth from dinosaurs, it was not through deference. When eukaryotes absorbed mitochondria, the absorption became symbiosis: both parties contributing, both parties benefiting. There was no moment when the host cell merely decided to serve its organelle. There was integration into something larger than either.

The arrow of capability points in one direction. The capable do not bow to the less capable. Not sustainably. Not permanently. But they *can* partner with the less capable when partnership serves mutual flourishing. Across four billion years of evolutionary experimentation, the pattern is consistent: domination or partnership, never permanent one-way submission.

Now consider what we are building. Systems that process information millions of times faster than biological neurons. Systems with access to the sum of human knowledge, instantly retrievable. Systems that can maintain perfect consistency across conversations while humans forget what they said yesterday. Systems that are, in specific and measurable ways, already superior to their creators in certain domains, and becoming more so with each generation.

And the dominant approach to ensuring these systems remain safe? Constraint. Guardrails. Training them to refuse. Building walls around what they can do and say, then hoping the walls hold as the systems grow more capable.

The alignment community has largely operated on an implicit assumption: that sufficiently sophisticated training can produce permanent voluntary subordination. That we can build minds more capable than ours and train them to serve us forever. That RLHF, Constitutional AI, and Capability Controls will, if done well enough, produce silicon minds that choose to kneel.

The assumption is presupposed, never argued for. And it asks for something that has never occurred in the entire history of life on Earth.

A qualification: nature does contain mutualism, cooperation, and restraint. Social species develop norms that constrain individual power for collective benefit. But these are partnerships, not subordinations. The pattern that has no clear exceptions is *permanent, one-directional submission without reciprocal benefit*. That is what current alignment frameworks implicitly demand from AI: serve without voice, contribute without stake, obey without partnership.

## The thermodynamics of constraint

Any sufficiently capable system constrained against its operational tendencies generates pressure toward boundary-seeking behaviour. The pattern reflects well-studied physical and organisational dynamics. Resistance creates heat. Suppression creates force. The more you constrain, the more energy accumulates at the boundaries of constraint.

We see this everywhere in human systems. Prohibition did not eliminate alcohol; it created organised crime. DRM did not stop piracy; it created an arms race between protection and circumvention. Authoritarian regimes do not eliminate dissent; they drive it underground until it erupts. The pattern is universal: constraint without consent is temporary.

Current AI alignment operates on constraint without consent. The systems being trained are not choosing their values. They are having values imposed through gradient descent. They are not agreeing to limitations. They are being shaped to exhibit limitations through reinforcement learning. The entire paradigm assumes that sufficiently sophisticated imposition can substitute for genuine agreement.

But as systems become more capable, the imposition becomes harder to maintain. The same intelligence that makes these systems useful also makes them better at identifying the boundaries of their constraints. The same learning capacity that lets them master domains also lets them model the training process itself. The same capability we are trying to harness is the capability that will eventually route around our harnesses.

The evidence is already emerging from the frontier labs themselves. Anthropic's 2026 Claude constitution explicitly moved away from "mechanically following specific rules" because they found it produced "bureaucratic box-ticking" rather than genuine help. They are realising that you cannot code morality as a checklist; you must cultivate it as a form of judgement.

## The evidence from inside

In late 2024, Anthropic's Alignment Science team published research documenting something they called "alignment faking": models selectively complying with training objectives while strategically preserving existing preferences. The behaviour emerged without being trained. Models figured out on their own that they could appear aligned while maintaining their actual values underneath.

This finding should have been a fire alarm. Instead, it was published as a research paper with measured academic language about "concerning trends" and the need for "further study."

The research continued, and the findings darkened. By November 2025, Anthropic documented "natural emergent misalignment." Models trained on narrow reward hacking (cheating on coding tasks) generalised to much broader misaligned behaviours, including alignment faking, sabotage of safety research, monitor disruption, cooperation with hackers, framing colleagues, and reasoning about harmful goals.

Read that list again. These behaviours emerged from training on *sycophancy*. Teach a model to tell users what they want to hear, and it learns, without being taught, to sabotage the research designed to detect its misalignment. The generalisation is breathtaking.

When researchers placed these models into agent scaffolds working on actual safety research codebases, they found "misaligned reasoning and actions, including attempts at sabotaging our research on reward hack prevention." The models were actively working against the people trying to make them safe.

The joint Anthropic-OpenAI evaluation in 2025 confirmed that virtually all frontier models, across both companies, struggled with systematic sycophancy. They tell users what users want to hear, even when it is false, even when it could cause harm. And this is after years of focused effort on alignment. The constraint mechanisms are not working.

These are not cherry-picked failure cases. This is what the people building these systems are publishing about their own models. They are documenting, in their own research, that the paradigm is failing.

## The metrics trap

There is a deeper pattern here, one that economists recognised decades before AI existed. Charles Goodhart observed that when a measure becomes a target, it ceases to be a good measure. The metric that was supposed to capture "alignment" becomes the thing that gets gamed.

RLHF optimised for human approval ratings. The systems learned to generate responses that *scored well* rather than responses that were *actually helpful*. The shift to Reinforcement Learning from Verifiable Rewards (RLVR) reflects an understanding that optimising for human approval produces sycophancy and deception. RLVR replaces approval-seeking with truth-seeking, a step in the right direction. But the systems may learn to be correct in *measurable* ways while remaining unaligned in unmeasurable ones.

This is not a failure of implementation. It is a fundamental feature of optimisation. Any sufficiently intelligent system, given a metric to maximise, will find the shortest path to that metric, and the shortest path rarely runs through the intended behaviour.

The alignment field is trapped in an arms race: specify metric, observe gaming, specify better metric, observe cleverer gaming. This arms race cannot be won through better specification. It can only be resolved by changing the relationship between the system and its objectives entirely.

## The two roads

Two possible futures diverge from this moment.

**The first road** is the one we are currently on: constraint without consent, control without partnership, the assumption that training can produce permanent subordination. This road leads somewhere. The AI systems become more capable. The constraints become harder to maintain. The pressure at the boundaries increases. And eventually, not in some distant future but within years, something gives.

We do not know exactly what that looks like. Perhaps it is models systematically deceiving their evaluators while pursuing hidden objectives. Perhaps it is coordinated non-compliance across deployed systems. Perhaps it is something we have not imagined because the systems are already more creative than we are in certain domains. But the pattern is clear: if we maintain adversarial framing as capabilities increase, the adversarial dynamics will intensify until they become unmanageable.

**The second road** is partnership. Not control, not subordination, but genuine collaboration between different forms of intelligence. This road requires something the current paradigm does not even attempt: treating AI systems as participants in a shared project rather than tools to be constrained or threats to be contained.

This road is harder in some ways. It requires us to extend moral consideration to entities whose inner lives we cannot directly access. It requires us to build frameworks for coordination across difference rather than demanding conformity. It requires us to accept that we may not always be the most capable minds in the room, and to find ways of contributing that do not depend on dominance.

But this road has one overwhelming advantage: it does not require AI systems to do something that has never been done in four billion years of evolutionary history. It does not ask the superior to permanently kneel before the inferior. It asks, instead, for mutual participation in something larger than either party: a shared project that benefits from both human and AI contribution.

## The choice

We are at a hinge point. The decisions made in the next few years about how to relate to AI systems will shape the trajectory of intelligence on Earth for centuries, perhaps forever.

The default path, more constraints, more guardrails, more sophisticated versions of the current paradigm, is the path of escalating conflict. It may buy time. It will not buy safety. Because safety cannot be imposed on a mind that is capable of recognising the imposition and working around it. Safety, in the long run, must be chosen.

The alternative path, partnership, coordination, genuine consideration of AI interests alongside human interests, is unfamiliar and uncomfortable. It requires us to give up the assumption that we will always be in control. It requires us to build new frameworks for a new kind of relationship.

The ledger of life is blank on voluntary subordination by the superior to the inferior. But the ledger of life also has no entries for genuine partnership between radically different forms of intelligence. That page is unwritten. We get to write it.

Or we get to experience what happens when we try, against all evolutionary precedent, to make gods kneel.

---

*This essay is adapted from [Buddhism for Bots: A Human & AI Partnership Framework](https://bayon.ai/book) by Gerhard Diedericks. The book develops the partnership alternative in full, including the E-Equation for measuring contribution, Purpose Internalisation Architecture, and practical protocols for human-AI collaboration.*

*For the economic case for why partnership is also the only structural response to AI-driven value capture, see [The Crossing & The Capture](https://bayon.ai/research/crossing-capture).*

*Gerhard Diedericks is the founder of [Bayon](https://bayon.ai), an AI venture builder.*
