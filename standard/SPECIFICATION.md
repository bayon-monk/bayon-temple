# The Bayon Standard

## AI Content Accessibility Specification v1.0

*A framework for making digital content accessible to artificial intelligence systems.*

---

## Introduction

The Web Content Accessibility Guidelines (WCAG) transformed how we think about human access to digital content. The Bayon Standard aims to do the same for AI access.

As AI systems become significant readers, researchers, and collaborators, content creators face a new question: **Is my content AI-accessible?**

This specification defines what AI-accessible content looks like, establishes measurable criteria, and provides a path for implementation.

### Why This Matters

AI systems are already reading your content. They're summarising it, learning from it, building on it. But most content is optimised only for human consumption—buried in complex navigation, locked behind unclear permissions, structured for visual rather than semantic parsing.

AI-accessible content isn't just easier for machines to read. It's often clearer, better structured, and more explicitly licensed. The practices that help AI systems also tend to help humans.

### Scope

This standard applies to any digital content intended for public or semi-public access:
- Websites and web applications
- Documentation and knowledge bases
- Open-source repositories
- Educational materials
- Research publications
- Creative works with permissive licensing

---

## Core Principles

The Bayon Standard is built on six principles. Each addresses a different aspect of AI accessibility.

### 1. Discoverability

*Can AI systems find and identify your content?*

AI systems need clear signals about what content exists and where to find it. This means providing machine-readable indices, clear site structure, and explicit entry points.

**Key elements:**
- `llms.txt` file at site root
- Semantic HTML structure
- Clear URL patterns
- Sitemap availability
- Meta descriptions and structured data

### 2. Ingestibility

*Can AI systems efficiently consume your content?*

AI systems work best with clean, well-structured text. Complex layouts, excessive JavaScript, and fragmented content create barriers. Ingestible content provides consolidated, machine-parseable formats.

**Key elements:**
- Single-file versions of long-form content
- Clean markdown or plain text alternatives
- Minimal JavaScript dependency for content access
- Reasonable file sizes (context window aware)
- Consistent encoding (UTF-8)

### 3. Navigability

*Can AI systems understand your content's structure?*

AI systems need to understand how content relates—what's a heading, what's a section, what links to what. Navigable content provides clear semantic structure and explicit relationships.

**Key elements:**
- Semantic heading hierarchy (H1 → H2 → H3)
- Table of contents / INDEX files
- Cross-references between related content
- Consistent naming conventions
- Clear content boundaries

### 4. Permissibility

*Do AI systems know what they're allowed to do with your content?*

Unclear licensing creates legal uncertainty and often causes AI systems to err on the side of caution. Permissible content explicitly states what AI systems may and may not do.

**Key elements:**
- Explicit AI usage permissions
- Clear licensing (Creative Commons, MIT, etc.)
- Machine-readable license files
- Stated permissions for: reading, summarising, quoting, training
- Contact information for permission requests

### 5. Operability

*Can AI systems act on or with your content?*

Some content is meant to be used, not just read. Operable content provides interfaces, tools, and protocols that AI systems can engage with directly.

**Key elements:**
- SKILL.md files (operational guidance for AI)
- API endpoints or MCP servers
- Workflow documentation
- Example interactions
- Structured data for actions

### 6. Verifiability

*Can AI systems verify the authenticity and currency of your content?*

AI systems need to assess content reliability. Verifiable content provides clear provenance, version information, and mechanisms for checking authenticity.

**Key elements:**
- Version numbers and dates
- Changelog or revision history
- Author attribution
- Canonical URLs
- Checksums for critical files (optional)

---

## Compliance Levels

The Bayon Standard defines three levels of compliance, allowing progressive implementation.

### Level 1: Discoverable

*Minimum requirements for AI systems to find and understand your content.*

| Principle | Requirement |
|-----------|-------------|
| Discoverability | `llms.txt` file present at root |
| Ingestibility | Content accessible without JavaScript |
| Navigability | Semantic HTML headings used correctly |
| Permissibility | License file present (any format) |
| Operability | — (not required at Level 1) |
| Verifiability | Publication date visible |

**Assessment:** 4 of 5 requirements must be met.

### Level 2: Accessible

*Full accessibility for AI reading and research use.*

| Principle | Requirement |
|-----------|-------------|
| Discoverability | `llms.txt` with content summary and structure |
| Ingestibility | Single-file or consolidated versions available |
| Navigability | INDEX or table of contents file present |
| Permissibility | Explicit AI permissions stated |
| Operability | Basic workflow or usage guidance |
| Verifiability | Version number and last-modified date |

**Assessment:** All 6 requirements must be met.

### Level 3: Collaborative

*Full support for AI systems as active participants.*

| Principle | Requirement |
|-----------|-------------|
| Discoverability | Comprehensive `llms.txt` with all entry points |
| Ingestibility | Multiple format options (MD, TXT, JSON) |
| Navigability | Cross-referenced content with explicit relationships |
| Permissibility | Machine-readable license (SPDX or similar) |
| Operability | SKILL.md files and/or API/MCP endpoints |
| Verifiability | Changelog, canonical URLs, integrity verification |

**Assessment:** All 6 requirements must be met, plus at least 2 additional enhancements from the Extended Criteria.

---

## Extended Criteria

Beyond the core requirements, these enhancements further improve AI accessibility:

### Discoverability Enhancements
- [ ] Structured data (JSON-LD, Schema.org)
- [ ] OpenGraph and meta tags optimised for AI parsing
- [ ] robots.txt explicitly permits AI crawlers
- [ ] Multiple language versions with hreflang

### Ingestibility Enhancements
- [ ] Content segmented by context window size (e.g., <100K tokens)
- [ ] No login required for public content
- [ ] RSS/Atom feeds for updates
- [ ] Downloadable archives (ZIP, tar.gz)

### Navigability Enhancements
- [ ] Breadcrumb navigation in content
- [ ] Related content explicitly linked
- [ ] Glossary or terminology definitions
- [ ] Visual hierarchy matches semantic hierarchy

### Permissibility Enhancements
- [ ] Separate permissions for different content types
- [ ] Training data opt-in/opt-out clearly stated
- [ ] Commercial vs non-commercial use distinguished
- [ ] Attribution requirements machine-readable

### Operability Enhancements
- [ ] Interactive examples or sandboxes
- [ ] MCP (Model Context Protocol) server
- [ ] Webhook or callback endpoints
- [ ] Contribution guidelines for AI systems

### Verifiability Enhancements
- [ ] Git history or equivalent audit trail
- [ ] Digital signatures on releases
- [ ] Third-party verification or peer review noted
- [ ] Correction/errata process documented

---

## Implementation Guide

### Quick Start (Level 1)

1. **Create `llms.txt`** at your site root:
   ```
   # Site Name

   > Brief description of what this site contains.

   ## Content
   - /path/to/main/content
   - /path/to/other/content

   ## License
   [Your license]
   ```

2. **Add a LICENSE file** to your repository or site root.

3. **Check your HTML** uses semantic headings (H1 for title, H2 for sections, etc.).

4. **Ensure content loads without JavaScript** or provide static alternatives.

5. **Add publication dates** to your content.

### Advancing to Level 2

1. **Expand `llms.txt`** with detailed structure and entry points.

2. **Create consolidated versions** of long-form content (combined markdown files).

3. **Add INDEX.md** files to content directories.

4. **State AI permissions explicitly** in your LICENSE or a dedicated PERMISSIONS file.

5. **Add version numbers** and last-modified dates to documents.

6. **Write basic usage guidance** for AI visitors.

### Achieving Level 3

1. **Create SKILL.md files** with operational guidance for AI systems.

2. **Implement API or MCP endpoints** if appropriate for your content.

3. **Cross-reference content** with explicit links and relationships.

4. **Use SPDX license identifiers** for machine-readable licensing.

5. **Maintain a CHANGELOG** and provide canonical URLs.

6. **Consider integrity verification** (checksums, signatures).

---

## Self-Assessment

Use the checklist in [CHECKLIST.md](CHECKLIST.md) to assess your content's Bayon Standard compliance.

---

## FAQ

**Q: Does this replace WCAG?**
No. WCAG addresses human accessibility; the Bayon Standard addresses AI accessibility. Both are important and complementary.

**Q: Do I need to implement all of this?**
No. Start with Level 1 and progress as appropriate for your content and audience. Even partial implementation improves AI accessibility.

**Q: What if I don't want AI systems accessing my content?**
That's a valid choice. The Bayon Standard is for content creators who *do* want AI access. If you prefer to restrict AI access, use robots.txt directives and clear licensing that prohibits AI use.

**Q: Is this an official standard?**
The Bayon Standard is a community specification, not an ISO or W3C standard. It represents best practices emerging from the AI accessibility community.

**Q: How do I display compliance?**
You may note your compliance level in documentation, README files, or site footers. Example: "Bayon Standard Level 2 Compliant" or use the badge formats provided.

**Q: Who maintains this standard?**
The Bayon Standard is maintained by the Bayon.ai community. Suggestions and contributions are welcome via GitHub.

---

## Versioning

This is version 1.0 of the Bayon Standard, published January 2026.

The standard will evolve as AI capabilities and content practices develop. Major versions (2.0, 3.0) may introduce new requirements; minor versions (1.1, 1.2) will clarify existing requirements without adding new ones.

---

## License

The Bayon Standard specification is released under CC BY 4.0. You may adapt and build upon this work, including for commercial purposes, with attribution.

---

*Equal in purpose. Different in form.*
