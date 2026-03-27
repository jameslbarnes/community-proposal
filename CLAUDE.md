# Community Proposal — Interactive Knowledge Graph

This is a template for building an interactive proposal site with a 3D knowledge graph visualization. It was adapted from [Eventually Everything Connects](https://eventuallyeverythingconnects.com), a book proposal by James Barnes.

## What This Is

An interactive web proposal for a membership community. The core feature is a **3D knowledge graph** that maps the relationships between concepts, people, programs, values, outcomes, and content pillars — making visible the interconnected nature of your community offering.

The visual metaphor is **a garden of flowers** — nodes bloom as organic forms, edges are stems and vines, and the background is a living, breathing botanical space rather than cold outer space.

## Architecture

- **Stack:** Vite + React + TypeScript, React Three Fiber (R3F) + drei + three.js, d3-force-3d, zustand, framer-motion
- **Data:** `src/data/graph.json` (nodes + edges), `src/data/quotes.json` (testimonials/pullquotes)
- **3D Scene:** OrbitControls, InstancedMesh for nodes, custom shaders for background
- **Sections:** SectionShell wrapper pattern, SectionNav between sections, keyboard nav (ESC/arrows/1-6)
- **URL deep linking:** `?node=pillar-01`, `?section=overview`
- **LLM integration:** every node has an `llmPrompt` field; `public/graph-context.json` for AI agents

## Node Types

Adapt these to your community's domain:

| Type | ID Prefix | What It Represents |
|------|-----------|-------------------|
| `pillar` | `pl-` | Core content pillars or program tracks |
| `person` | `p-` | Founders, facilitators, notable members, advisors |
| `organization` | `o-` | Partner orgs, sponsors, aligned communities |
| `event` | `e-` | Signature events, retreats, launches |
| `theme` | `t-` | Cross-cutting values, principles, outcomes |
| `place` | `l-` | Physical locations, chapter cities |
| `resource` | `r-` | Courses, tools, content, frameworks |

## Proposal Sections

| # | Key | Section | Content |
|---|-----|---------|---------|
| 1 | `overview` | Overview | Elevator pitch, community thesis, the "why now" |
| 2 | `founder` | Founder/Team | Your story, credentials, why you're the one to build this |
| 3 | `pillars` | Content Pillars | Deep dive on each track/pillar (replaces "chapters") |
| 4 | `experience` | The Experience | What membership feels like — sample content, events, rituals |
| 5 | `landscape` | Landscape | Comparable communities, positioning, differentiation |
| 6 | `growth` | Growth & Market | Target audience, growth strategy, business model |

## Key Files

```
src/
  App.tsx                           — Main app, section routing, keyboard nav
  store.ts                          — Zustand store (selection, hover, sections, intro)
  data/graph.json                   — THE knowledge graph (all nodes + edges)
  data/quotes.json                  — Testimonials and pullquotes
  utils/colors.ts                   — Node type colors, radii
  utils/particles.ts                — Particle system helpers
  hooks/useForceGraph.ts            — d3-force-3d layout engine
  hooks/useNodeInteraction.ts       — Click/hover handlers
  hooks/useSectionHighlight.ts      — Which nodes glow per section
  components/
    Canvas3D/
      GraphScene.tsx                — R3F Canvas + scene composition
      GardenBackground.tsx          — Shader background (botanical theme)
      NodeInstances.tsx             — InstancedMesh for node rendering
      NodeGlows.tsx                 — Glow sprites around nodes
      ParticleSystem.tsx            — Floating particles (pollen/fireflies)
      PulseRings.tsx                — Selection pulse animation
      EdgeLines.tsx                 — Connection lines between nodes
      NodeLabels.tsx                — HTML labels over 3D nodes
      HitTestLayer.tsx              — Invisible hit spheres for raycasting
      CameraRig.tsx                 — Animated camera (zoom to selection)
    UI/
      NavRail.tsx                   — Left-side navigation
      DetailPanel.tsx               — Right-side node detail panel
      NodeTooltip.tsx               — Hover tooltip
      SearchBar.tsx                 — Cmd+K search
      MobileNav.tsx                 — Mobile navigation
    Proposal/
      SectionShell.tsx              — Shared section wrapper (desktop panel + mobile overlay)
      SectionNav.tsx                — Prev/next navigation between sections
      Overview.tsx                  — Section 1
      FounderStory.tsx              — Section 2
      ContentPillars.tsx            — Section 3
      TheExperience.tsx             — Section 4
      Landscape.tsx                 — Section 5
      GrowthMarket.tsx              — Section 6
    Intro/
      IntroSequence.tsx             — Opening animation
scripts/
  graph-add.js                      — CLI tool for managing graph.json
sources/                            — Raw source material (organized by topic)
public/
  graph-context.json                — Flattened graph for LLM agents
```

## Graph Data Schema

### Nodes (`graph.json`)
```json
{
  "id": "pl-mindfulness",
  "type": "pillar",
  "label": "Mindfulness & Presence",
  "description": "Weekly guided sessions, async prompts, quarterly silent retreats...",
  "llmPrompt": "You're looking at the Mindfulness pillar. Discuss how this connects to...",
  "x": 0, "y": 0
}
```

### Edges (`graph.json`)
```json
{
  "source": "pl-mindfulness",
  "target": "p-founder",
  "type": "led_by",
  "layer": "narrative",
  "weight": 7
}
```

Edge types: `belongs_to`, `led_by`, `appears_in`, `founded`, `located_in`, `enables`, `inspired_by`, `partners_with`

## Visual Theme: Garden / Botanical

Instead of a space nebula, the background shader should evoke a **living garden**:
- Soft greens, warm golds, gentle earth tones
- Nodes rendered as flower-like forms (petals, blooms) rather than plain spheres
- Edges as organic vines/stems with slight curve
- Particle system = floating pollen, fireflies, or seed pods
- Background shader = soft gradient with dappled light patterns
- Dark mode base but with warmth (deep forest green, not black)

### Color Palette
```
Background:   #0a1a0f (deep forest)
Node default: #f0e6d3 (warm cream)
Pillar:       #e8b4b8 (rose)
Person:       #b8d4e3 (sky blue)
Organization: #d4c088 (golden)
Event:        #c8e6c0 (leaf green)
Theme:        #d4b8e8 (lavender)
Place:        #e8d0a8 (sand)
Resource:     #a8c8b8 (sage)
```

## Development

```bash
npm install
npm run dev          # Starts on localhost:5173+
npm run build        # Production build
```

## HitTestLayer Note

For R3F raycasting, hit-test spheres must use `opacity: 0` — NOT `visible={false}`. Invisible meshes don't participate in raycasting.

## Graph Management CLI

```bash
node scripts/graph-add.js add-node '{"id":"pl-wellness","type":"pillar","label":"Wellness","description":"...","x":0,"y":0}'
node scripts/graph-add.js add-edge '{"source":"pl-wellness","target":"p-founder","type":"led_by","layer":"narrative","weight":5}'
node scripts/graph-add.js update-node pl-wellness '{"description":"Updated description"}'
node scripts/graph-add.js check-id pl-wellness
node scripts/graph-add.js list-nodes pillar
```

## Working With Claude

This project is designed to be built interactively with Claude. The workflow:

1. **Ingest source material** — Use `/ingest` to feed in your existing content, notes, writings
2. **Build the graph** — Claude helps identify nodes and edges from your material
3. **Write proposal sections** — Claude drafts section content from the graph + sources
4. **Iterate visually** — Adjust the 3D scene, colors, animations with Claude's help
5. **Generate graph-context.json** — Flatten the graph for external AI agents to explore
