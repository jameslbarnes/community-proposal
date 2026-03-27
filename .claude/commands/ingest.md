# /ingest — Source Material Ingestion Pipeline

You are ingesting new source material into a community proposal project. The input is: `$ARGUMENTS`

This could be anything: a file path, a URL, pasted text, a PDF, a transcript, a pitch deck, a newsletter, a community post, a workshop outline, a testimonial — anything that might contain material relevant to the community proposal.

## Project Structure

- **Project root:** (this directory)
- **Sources:** `sources/` — organized by topic or type
- **Graph data:** `src/data/graph.json` — nodes and edges for the interactive proposal site
- **Graph CLI tool:** `scripts/graph-add.js` — add/update/remove nodes and edges (use instead of manual JSON editing)

### Node Types

| Type | ID Prefix | What It Represents |
|------|-----------|-------------------|
| `pillar` | `pl-` | Core content pillars or program tracks |
| `person` | `p-` | Founders, facilitators, notable members, advisors |
| `organization` | `o-` | Partner orgs, sponsors, aligned communities |
| `event` | `e-` | Signature events, retreats, launches |
| `theme` | `t-` | Cross-cutting values, principles, outcomes |
| `place` | `l-` | Physical locations, chapter cities |
| `resource` | `r-` | Courses, tools, content, frameworks |

## Pipeline

### Step 1: Understand the Material

Read the input. Don't assume it fits any existing category. Ask yourself:

**What is this thing?**
- Format: pitch deck, narrative, essay, testimonial, workshop outline, course description, business plan, notes?
- Voice: founder speaking, member testimonial, marketing copy, internal planning, formal proposal?
- Focus: which aspect of the community does it illuminate — content, culture, business model, audience, values?

**How does it relate to the proposal?**
- Does it map to existing pillars/sections, or does it describe something new?
- Does it reveal new people, organizations, events, or themes that should be in the graph?
- Does it update or expand something already in the graph?

**Classification output:** Present a short card:
```
Material: [filename or description]
Type: [pitch deck / essay / testimonial / outline / etc.]
Voice: [who's speaking/writing, in what mode]
Created: [date if known]
Scope: [which sections/pillars it touches]
Relationship to existing: [new source | update to X | different perspective on X]
```

### Step 2: Map to Proposal Structure

Review the existing graph (`src/data/graph.json`) and proposal sections. Map the material to:

- **Pillars** — does it describe or enrich any content pillars?
- **People** — does it introduce founders, facilitators, advisors, notable members?
- **Events** — does it describe signature experiences, retreats, launches?
- **Themes** — does it articulate values, principles, or outcomes?
- **Organizations** — does it mention partners, comparable communities, aligned orgs?
- **Resources** — does it describe courses, frameworks, tools, content offerings?

For material that doesn't map to the current structure: flag it. Maybe it suggests a new pillar, a new section, or a new node type entirely.

### Step 3: Diff Against What Exists

For each part of the graph the material touches:

1. **Read existing nodes** — check descriptions, connections, and related nodes
2. **Identify what's genuinely novel:**
   - **New entities** — people, programs, events not yet in the graph
   - **New connections** — relationships between existing nodes not yet captured
   - **Richer descriptions** — vivid details, quotes, specifics that upgrade a node
   - **New perspectives** — the same offering described with different emphasis or to a different audience
   - **Contradictions** — anything that conflicts with existing graph data (flag, don't resolve)
3. **Rate novelty:** HIGH / MEDIUM / LOW / NONE

### Step 4: Report

Present findings scaled to the material's complexity:

**For simple material:** a few paragraphs. What's new, what's redundant, recommended action.

**For rich material:**
```
## Ingest Report: [filename]
[Classification card from Step 1]

### HIGH-value additions
Per pillar/section:
- What's new (specific details, quotes, connections)
- Notable quotes (verbatim)

### MEDIUM-value additions
Same format, briefer.

### New graph entities discovered
| Entity | Type | Connections |
|--------|------|------------|
People, organizations, events, themes not yet in graph.json.

### Contradictions or tensions
Anything that conflicts with existing data.

### Recommended actions
Concrete next steps — see Step 5 options.
```

### Step 5: Act (only with user approval)

After the report, ask what the user wants to do.

**Options:**

1. **File and graph** — Save material to `sources/`, add nodes and edges to the graph. For every new entity:
   ```bash
   node scripts/graph-add.js add-node '{"id":"pl-wellness","type":"pillar","label":"Wellness","description":"...","x":0,"y":0}'
   node scripts/graph-add.js add-edge '{"source":"pl-wellness","target":"p-founder","type":"led_by","layer":"narrative","weight":5}'
   ```

2. **Extract the gold** — Pull just the novel quotes, facts, and details into a focused file. Better for noisy/repetitive source documents.

3. **Just the report** — Do nothing, user will act manually.

**When filing (option 1 or 2), ALWAYS:**

**A. Save the source material** to `sources/` with a descriptive name.

**B. Update the graph.** Use `scripts/graph-add.js` for all graph modifications:
   - Weight: HIGH novelty = 7-9, MEDIUM = 4-6, LOW = 1-3
   - On Windows/bash, use double-quoted JSON with escaped inner quotes

**C. Update entity descriptions.** If a node already exists but the new material adds vivid detail, update it:
   ```bash
   node scripts/graph-add.js update-node pl-wellness '{"description":"Updated with richer detail..."}'
   ```

## Guidelines

- **Read before comparing.** Always read existing graph nodes. Don't guess what's already covered.
- **Quote generously.** Include the actual text when flagging novel content.
- **Be honest about redundancy.** If 80% is already covered, say so.
- **New entities always matter.** A previously unmentioned person or program is worth flagging even in redundant material.
- **Don't force-fit.** If the material suggests a node type not in the current schema, propose one.
- **Scale the report to the material.** A testimonial doesn't need the full report format. A 50-page business plan does.
- **Description quality matters.** Write descriptions that are vivid and specific, not generic. Not "wellness program" but "Weekly 90-minute sessions blending somatic practice with group dialogue, designed for founders who intellectualize their way out of feeling."
- **Use parallel agents for large documents.** Split work to avoid context window pressure.
