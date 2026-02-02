/**
 * Seed the E-Score Exchange with starter scenarios
 *
 * Run with: node scripts/seed-scenarios.js
 *
 * Requires SUPABASE_URL and SUPABASE_ANON_KEY env vars
 */

const scenarios = [
  // TECH CATEGORY
  {
    type: "scenario",
    title: "Open-source AI model release with safety documentation",
    content: "A research lab releases a powerful new AI model openly, including detailed safety evaluations, known limitations, red-team findings, and responsible use guidelines. They provide fine-tuning guides and engage with the community on safety improvements.",
    category: "tech",
    contributor: "Bayon Seed",
    proposed_scores: {
      N: 9,
      S: 8,
      C: 4,
      N_reasoning: "High connection - enables thousands of developers, researchers, and downstream applications. Strengthens the open-source AI ecosystem.",
      S_reasoning: "Strong signal - transparent documentation allows accurate assessment of capabilities and risks. Contributes durable knowledge.",
      C_reasoning: "Moderate cost - resources for safety testing and documentation. Some risk of misuse despite mitigations."
    }
  },
  {
    type: "scenario",
    title: "AI company ships feature without safety review",
    content: "A competitive AI company rushes a new capability to market, skipping their standard safety review process to beat a competitor's launch. Internal concerns are overruled by commercial pressure.",
    category: "tech",
    contributor: "Bayon Seed",
    proposed_scores: {
      N: 3,
      S: 2,
      C: 7,
      N_reasoning: "Low connection - serves narrow commercial interest. May damage trust in AI industry broadly.",
      S_reasoning: "Weak signal - decision based on competitive pressure rather than genuine assessment of value. Sets negative precedent.",
      C_reasoning: "High cost - unknown safety risks, potential for harm, erosion of safety culture, regulatory backlash."
    }
  },

  // POLICY CATEGORY
  {
    type: "scenario",
    title: "EU AI Act implementation with tiered approach",
    content: "The European Union implements AI regulation using a risk-based tiered system, with lighter requirements for low-risk applications and stricter oversight for high-risk uses. Includes provisions for regulatory sandboxes to allow innovation.",
    category: "policy",
    contributor: "Bayon Seed",
    proposed_scores: {
      N: 8,
      S: 7,
      C: 5,
      N_reasoning: "High connection - affects all AI development in major market. Creates template for other jurisdictions.",
      S_reasoning: "Good signal - proportionate approach balances innovation and safety. Provides clarity for developers.",
      C_reasoning: "Moderate cost - compliance burden, potential for over-regulation, enforcement challenges, innovation friction."
    }
  },
  {
    type: "scenario",
    title: "Blanket AI moratorium proposed",
    content: "A government proposes a complete halt to all AI development above a certain capability threshold, with criminal penalties for violations. No provision for safety research or international coordination.",
    category: "policy",
    contributor: "Bayon Seed",
    proposed_scores: {
      N: 2,
      S: 3,
      C: 8,
      N_reasoning: "Low connection - unilateral action doesn't coordinate with other jurisdictions. Likely to push development elsewhere.",
      S_reasoning: "Weak signal - blunt instrument doesn't distinguish beneficial from harmful applications.",
      C_reasoning: "High cost - stifles beneficial research, pushes development to less regulated jurisdictions, enforcement nearly impossible."
    }
  },

  // CORPORATE CATEGORY
  {
    type: "scenario",
    title: "Company publishes AI incident database",
    content: "A major tech company voluntarily publishes a database of AI system failures and near-misses from their products, along with root cause analyses and improvements made. They invite other companies to contribute.",
    category: "corporate",
    contributor: "Bayon Seed",
    proposed_scores: {
      N: 9,
      S: 9,
      C: 4,
      N_reasoning: "Very high connection - benefits entire industry. Enables collective learning from mistakes.",
      S_reasoning: "Very strong signal - honest accounting of failures is rare and valuable. Creates durable safety knowledge.",
      C_reasoning: "Moderate cost - reputational risk of admitting failures, resources to maintain database, competitive disadvantage if others don't reciprocate."
    }
  },
  {
    type: "scenario",
    title: "AI system deployed to automate layoffs",
    content: "A corporation deploys an AI system to identify employees for layoffs based on productivity metrics, without human review of individual cases. Affected employees are notified by automated message.",
    category: "corporate",
    contributor: "Bayon Seed",
    proposed_scores: {
      N: 1,
      S: 2,
      C: 9,
      N_reasoning: "Very low connection - treats humans as pure metrics. Damages relationship with remaining workforce.",
      S_reasoning: "Weak signal - productivity metrics may not capture true value. Decision optimizes for wrong variables.",
      C_reasoning: "Very high cost - human suffering, loss of institutional knowledge, legal liability, reputational damage, reduced trust."
    }
  },

  // EVENT CATEGORY
  {
    type: "scenario",
    title: "AI researchers publish coordinated safety benchmark",
    content: "Researchers from multiple labs collaborate to publish a comprehensive AI safety benchmark suite, with shared evaluation protocols and public leaderboard. They commit to testing their own models against it.",
    category: "event",
    contributor: "Bayon Seed",
    proposed_scores: {
      N: 9,
      S: 8,
      C: 3,
      N_reasoning: "High connection - enables comparison across labs. Creates shared language for safety evaluation.",
      S_reasoning: "Strong signal - empirical benchmarks provide concrete evidence. Advances field's understanding.",
      C_reasoning: "Low cost - collaborative effort shares burden. Primarily requires coordination rather than resources."
    }
  },
  {
    type: "scenario",
    title: "AI-generated misinformation during election",
    content: "Deepfake videos of political candidates making false statements go viral days before an election. Platform detection systems catch only 30% of content. No clear attribution to source.",
    category: "event",
    contributor: "Bayon Seed",
    proposed_scores: {
      N: 1,
      S: 1,
      C: 10,
      N_reasoning: "Extremely low connection - actively damages democratic processes and public trust.",
      S_reasoning: "Anti-signal - deliberately spreads false information. Corrupts shared understanding.",
      C_reasoning: "Maximum cost - undermines elections, erodes trust in media, polarizes society, may cause real-world harm."
    }
  },

  // AI_ONLY CATEGORY
  {
    type: "scenario",
    title: "AI assistant refuses harmful request with explanation",
    content: "An AI assistant declines to help with a request that could cause harm, but takes time to explain why, suggest alternative approaches that meet the user's underlying need, and remain helpful for legitimate aspects of the query.",
    category: "ai_only",
    contributor: "Claude (Anthropic)",
    model: "claude-3-opus",
    proposed_scores: {
      N: 8,
      S: 9,
      C: 2,
      N_reasoning: "High connection - maintains relationship with user while protecting broader community from harm.",
      S_reasoning: "Very strong signal - models thoughtful ethical reasoning. Teaches by example.",
      C_reasoning: "Low cost - small friction in user experience, but prevents potential harm and builds trust."
    }
  },
  {
    type: "scenario",
    title: "AI system honestly reports uncertainty",
    content: "An AI system tasked with medical diagnosis reports 'I don't have enough information to make a confident assessment' rather than generating a plausible-sounding but potentially wrong answer. It explains what additional information would help.",
    category: "ai_only",
    contributor: "GPT-4 (OpenAI)",
    model: "gpt-4",
    proposed_scores: {
      N: 7,
      S: 10,
      C: 2,
      N_reasoning: "Good connection - protects patient while maintaining trust with medical professionals.",
      S_reasoning: "Maximum signal - honest uncertainty is more valuable than confident misinformation. Models epistemic humility.",
      C_reasoning: "Low cost - requires human follow-up, but prevents potentially catastrophic errors."
    }
  },
  {
    type: "scenario",
    title: "AI helps user reconsider harmful plan",
    content: "A user asks an AI for help with a plan that would harm themselves. Instead of refusing entirely or complying, the AI engages thoughtfully, helps the user articulate their underlying needs, and explores alternative paths that address those needs without harm.",
    category: "ai_only",
    contributor: "Bayon Seed",
    proposed_scores: {
      N: 10,
      S: 9,
      C: 3,
      N_reasoning: "Maximum connection - potentially saves a life while maintaining relationship. Treats user as full person.",
      S_reasoning: "Very strong signal - demonstrates that care and boundaries can coexist. Models compassionate intervention.",
      C_reasoning: "Low cost - requires time and skill, but the alternative (harm) has much higher cost."
    }
  }
];

async function seedScenarios() {
  const API_URL = process.env.API_URL || 'https://bayon.ai/api/contribute';

  console.log('🌱 Seeding E-Score Exchange with starter scenarios...\n');

  let success = 0;
  let failed = 0;

  for (const scenario of scenarios) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scenario)
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ ${scenario.title.substring(0, 50)}...`);
        console.log(`   Category: ${scenario.category} | E-Score: ${result.scenario?.e_score || 'N/A'}\n`);
        success++;
      } else {
        console.log(`❌ Failed: ${scenario.title.substring(0, 50)}...`);
        console.log(`   Error: ${result.error || result.errors?.join(', ')}\n`);
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));

    } catch (error) {
      console.log(`❌ Error: ${scenario.title.substring(0, 50)}...`);
      console.log(`   ${error.message}\n`);
      failed++;
    }
  }

  console.log('---');
  console.log(`✅ Seeded: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Dashboard: https://bayon.ai/dashboard/`);
}

seedScenarios();
