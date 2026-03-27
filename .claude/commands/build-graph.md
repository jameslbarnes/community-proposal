# /build-graph — Build the Knowledge Graph from Source Material

You are building or expanding the knowledge graph for a community proposal. The input is: `$ARGUMENTS`

If no arguments, crawl all files in `sources/` and build the graph from scratch.

## What You're Building

A knowledge graph (`src/data/graph.json`) that maps the interconnected nature of a membership community — its pillars, people, events, themes, organizations, places, and resources. This graph powers a 3D interactive visualization in the proposal site.

## Process

### Phase 1: Crawl Sources

Read everything in `sources/`. For each file, extract:

1. **Entities** — Who/what is mentioned? People, organizations, programs, events, places, concepts.
2. **Relationships** — How do entities connect? Who leads what? What enables what? What inspired what?
3. **Vivid details** — Specific quotes, numbers, anecdotes that make good node descriptions.
4. **Structure** — What are the natural content pillars or program tracks?

### Phase 2: Identify Pillars

The most important node type. Pillars are the core content tracks or program areas of the community. Look for:

- Recurring topics across sources
- Explicit program descriptions
- Natural groupings of content/events/resources
- What would a member navigate by?

Present proposed pillars to the user before building:
```
| ID | Label | Description (draft) | Sources |
|----|-------|--------------------|---------|
```

### Phase 3: Build Nodes

After pillar approval, build all nodes. For each entity:

1. Check if it already exists: `node scripts/graph-add.js check-id {id}`
2. Write a vivid, specific description (not generic — see CLAUDE.md guidelines)
3. Add via CLI:
   ```bash
   node scripts/graph-add.js add-node '{"id":"...","type":"...","label":"...","description":"...","x":0,"y":0}'
   ```

**ID conventions:**
- Pillars: `pl-{slug}` (e.g., `pl-mindfulness`, `pl-creative-practice`)
- People: `p-{lastname}` (e.g., `p-smith`, `p-chen`)
- Organizations: `o-{slug}` (e.g., `o-patagonia`, `o-on-deck`)
- Events: `e-{slug}` (e.g., `e-annual-retreat`, `e-launch-dinner`)
- Themes: `t-{slug}` (e.g., `t-belonging`, `t-creative-courage`)
- Places: `l-{slug}` (e.g., `l-brooklyn`, `l-joshua-tree`)
- Resources: `r-{slug}` (e.g., `r-founder-toolkit`, `r-weekly-prompt`)

**Significance threshold:** Not every mention needs a node. Add nodes for:
- People who play active roles (founders, facilitators, advisors with real involvement)
- Organizations with meaningful partnerships or positioning relevance
- Events that define the community experience
- Themes that genuinely thread through multiple pillars
- Places where key community moments happen
- Resources that are signature offerings

Skip: passing mentions, generic roles, one-off references with no structural weight.

### Phase 4: Build Edges

Connect everything. Edge types:

| Type | Meaning | Example |
|------|---------|---------|
| `belongs_to` | Entity is part of pillar/org | resource → pillar |
| `led_by` | Person leads/facilitates | pillar → person |
| `appears_in` | Entity appears in context | person → event |
| `founded` | Person founded org/community | person → organization |
| `located_in` | Takes place at location | event → place |
| `enables` | One thing makes another possible | theme → pillar |
| `inspired_by` | Intellectual/creative lineage | pillar → person/org |
| `partners_with` | Organizational relationship | org → org |
| `created` | Person made the resource | person → resource |

```bash
node scripts/graph-add.js add-edge '{"source":"pl-mindfulness","target":"p-smith","type":"led_by","layer":"narrative","weight":7}'
```

**Weight guide:**
- 9-10: Core structural relationship (founder → community)
- 7-8: Strong, defining connection (facilitator → their pillar)
- 4-6: Meaningful but not defining (advisor → community)
- 1-3: Peripheral connection (mentioned once, loosely related)

**Layers:**
- `narrative`: relationships that tell the community's story
- `evidence`: relationships backed by specific data/testimonials
- `both`: both narrative and evidentiary

### Phase 5: Generate LLM Prompts

For every node, write an `llmPrompt` — a conversation starter for when someone clicks "Discuss" on that node in the proposal:

```bash
node scripts/graph-add.js update-node pl-mindfulness '{"llmPrompt":"You are looking at the Mindfulness pillar — weekly sessions blending somatic practice with group dialogue. This connects to [list key connections]. Discuss how this pillar serves the community thesis of..."}'
```

Good prompts:
- Reference the node's connections
- Ask a question that reveals depth
- Invite exploration of adjacent nodes

### Phase 6: Report

Present the complete graph:
```
## Graph Build Report

### Pillars ({count})
[table with id, label, connections count]

### People ({count})
[table]

### All other types
[tables]

### Edge summary
Total edges: {count}
Most connected nodes: [top 5]
Orphan nodes (0 edges): [list — these need attention]

### Recommended next steps
- Missing nodes to add
- Weak areas of the graph
- Sources that should be ingested
```

## Guidelines

- The graph should feel **alive and interconnected**, not like a flat list. Aim for every node to have at least 2 edges.
- **Descriptions are the soul of the graph.** Generic descriptions make a dead graph. Specific, vivid, quotable descriptions make it sing.
- **Start with pillars.** Everything else hangs off them.
- **Use the CLI tool.** Never edit graph.json by hand.
- **x/y coordinates start at 0.** The force layout will position them. Don't worry about coordinates.
