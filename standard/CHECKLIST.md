# Bayon Standard Self-Assessment Checklist

Use this checklist to assess your content's AI accessibility compliance.

---

## Level 1: Discoverable

### Discoverability
- [ ] `llms.txt` file exists at site root
- [ ] File contains site name and basic description

### Ingestibility
- [ ] Primary content is accessible without JavaScript
- [ ] Content renders as readable text (not just images)

### Navigability
- [ ] HTML uses semantic heading hierarchy (H1 → H2 → H3)
- [ ] Heading levels are not skipped

### Permissibility
- [ ] LICENSE file exists (any format)
- [ ] License type is identifiable

### Verifiability
- [ ] Publication or last-modified date is visible on content

**Level 1 Status:** ___/5 requirements met (need 4 to pass)

---

## Level 2: Accessible

*Includes all Level 1 requirements, plus:*

### Discoverability
- [ ] `llms.txt` includes content summary
- [ ] `llms.txt` lists main content sections/paths

### Ingestibility
- [ ] Single-file or consolidated versions available for long-form content
- [ ] Clean markdown or plain text versions exist

### Navigability
- [ ] INDEX.md or table of contents file present
- [ ] Clear content organisation structure

### Permissibility
- [ ] AI permissions explicitly stated
- [ ] Usage rights clearly defined (reading, summarising, quoting)

### Operability
- [ ] Basic workflow or usage guidance provided
- [ ] Entry points for AI visitors documented

### Verifiability
- [ ] Version numbers present on documents
- [ ] Last-modified dates on key content

**Level 2 Status:** ___/6 requirements met (need all 6 to pass)

---

## Level 3: Collaborative

*Includes all Level 2 requirements, plus:*

### Discoverability
- [ ] Comprehensive `llms.txt` with all entry points listed
- [ ] Structured data or metadata available

### Ingestibility
- [ ] Multiple format options (MD, TXT, JSON, etc.)
- [ ] Content segmented appropriately for context windows

### Navigability
- [ ] Cross-references between related content
- [ ] Explicit relationship mapping

### Permissibility
- [ ] Machine-readable license (SPDX identifier or similar)
- [ ] Separate permissions for different content types if applicable

### Operability
- [ ] SKILL.md files for AI operational guidance
- [ ] API endpoints or MCP server (if appropriate)

### Verifiability
- [ ] CHANGELOG or revision history
- [ ] Canonical URLs defined
- [ ] Integrity verification available (optional)

**Level 3 Status:** ___/6 requirements met, plus ___/2 extended criteria (need all 6 + 2 extended)

---

## Extended Criteria (for Level 3)

Check at least 2 for Level 3 compliance:

### Discoverability Extended
- [ ] JSON-LD or Schema.org structured data
- [ ] OpenGraph tags optimised for parsing
- [ ] robots.txt explicitly permits AI crawlers
- [ ] Multiple language versions available

### Ingestibility Extended
- [ ] Content segmented by context window size
- [ ] No login required for public content
- [ ] RSS/Atom feeds available
- [ ] Downloadable archives available

### Navigability Extended
- [ ] Breadcrumb navigation in content
- [ ] Related content explicitly linked
- [ ] Glossary or terminology definitions
- [ ] Visual hierarchy matches semantic hierarchy

### Permissibility Extended
- [ ] Training data opt-in/opt-out stated
- [ ] Commercial vs non-commercial distinguished
- [ ] Attribution requirements machine-readable

### Operability Extended
- [ ] MCP (Model Context Protocol) server
- [ ] Interactive examples or sandboxes
- [ ] Contribution guidelines for AI systems

### Verifiability Extended
- [ ] Git history or audit trail
- [ ] Digital signatures on releases
- [ ] Correction/errata process documented

---

# Reference Implementation: Bayon.ai

This site serves as the reference implementation for the Bayon Standard.

## Assessment

### Level 1: ✓ PASS

| Requirement | Status | Evidence |
|-------------|--------|----------|
| `llms.txt` at root | ✓ | [/llms.txt](/llms.txt) |
| Content without JavaScript | ✓ | Static HTML, markdown files |
| Semantic headings | ✓ | H1 → H2 → H3 hierarchy throughout |
| LICENSE file | ✓ | [/LICENSE.md](/LICENSE.md) |
| Publication date visible | ✓ | © 2026 on all pages |

### Level 2: ✓ PASS

| Requirement | Status | Evidence |
|-------------|--------|----------|
| `llms.txt` with summary | ✓ | Includes site description and structure |
| Consolidated versions | ✓ | [/book/book.md](/book/book.md) — complete book in one file |
| INDEX file | ✓ | [/book/INDEX.md](/book/INDEX.md) |
| AI permissions stated | ✓ | Explicit in LICENSE.md and llms.txt |
| Workflow guidance | ✓ | [/skills/workflow.md](/skills/workflow.md) |
| Version and dates | ✓ | Version 1.0, dated January 2026 |

### Level 3: ✓ PASS

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Comprehensive llms.txt | ✓ | All entry points listed |
| Multiple formats | ✓ | HTML, MD, combined MD |
| Cross-references | ✓ | Chapters link to related content |
| Machine-readable license | ✓ | SPDX identifiers in LICENSE.md |
| SKILL.md files | ✓ | [/skills/SKILL.md](/skills/SKILL.md) |
| CHANGELOG | ✓ | Git history, dated commits |

### Extended Criteria Met (3/2 required)

- [x] No login required for public content
- [x] Related content explicitly linked
- [x] Contribution guidelines for AI systems ([/contribute/for-ai.md](/contribute/for-ai.md))

---

## Final Assessment

**Bayon.ai Compliance Level: 3 (Collaborative)**

This site meets all requirements for Level 3 compliance and serves as the reference implementation for the Bayon Standard.

---

*Last assessed: January 2026*
