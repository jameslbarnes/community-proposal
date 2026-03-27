# Community Proposal — Interactive Knowledge Graph

An interactive proposal site for a membership community, featuring a 3D knowledge graph visualization with a botanical/garden theme.

Built with [Claude Code](https://claude.ai/code).

## What This Does

You give Claude your raw material — pitch decks, notes, testimonials, workshop outlines, whatever you have — and it builds an interactive 3D knowledge graph that maps your community's pillars, people, events, themes, and offerings. Then it writes the proposal sections for you, pulling from the graph.

The result is a web app where visitors can explore your community as an interconnected living system, not a flat pitch deck.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Claude Code](https://claude.ai/code) CLI installed

## Step-by-Step: From Zero to Proposal

### 1. Clone and install

```bash
git clone https://github.com/jameslbarnes/community-proposal.git
cd community-proposal
npm install
```

### 2. Gather your source material

Collect everything you have about your community into a folder. It can be anywhere on your machine. Examples of good material:

- Pitch decks, one-pagers, slide decks
- Workshop outlines, course descriptions, curriculum
- Member testimonials, feedback, survey results
- Website copy, landing pages, newsletters
- Business plans, pricing docs, financial models
- Competitor research, market analysis
- Notes, brainstorms, journal entries
- Conversation transcripts, interview recordings

Messy is fine. Overlapping is fine. Contradictory is fine. The pipeline handles it.

### 3. Open Claude Code in this project

```bash
claude
```

### 4. Ingest your material

Point Claude at your files one at a time, or ask it to crawl a whole folder:

```
/ingest /path/to/pitch-deck.pdf
/ingest /path/to/workshop-notes.md
/ingest /path/to/testimonials.txt
```

Or point at a folder:

```
Can you read through everything in /path/to/my/community-docs/ and ingest the key materials?
```

Or paste text directly:

```
/ingest Here's what a member said: "I came for the content but stayed for the people."
```

For each piece, Claude classifies it, maps it to the proposal structure, identifies what's novel, and asks what to do. **Ingest everything before moving on.**

### 5. Build the knowledge graph

```
/build-graph
```

Claude crawls all ingested sources and proposes:
- **Content pillars** — the core tracks of your community (you approve these)
- **People** — founders, facilitators, advisors
- **Events** — retreats, launches, signature experiences
- **Themes** — values, principles, outcomes
- **Organizations** — partners, comparable communities
- **Resources** — courses, tools, frameworks

Each node gets a vivid description and connections to related nodes. This is collaborative — Claude proposes, you approve and refine.

### 6. Build the 3D visualization

Ask Claude to build the visual layer:

```
Build the 3D knowledge graph visualization using the garden/botanical theme from CLAUDE.md.
```

Claude creates the React Three Fiber scene: force-directed layout, garden background shader, flower-like nodes, vine edges, floating pollen particles, camera rig, interaction layer.

### 7. Write the proposal sections

```
/write-sections
```

Or one at a time:

```
/write-sections overview
/write-sections founder
/write-sections pillars
/write-sections experience
/write-sections landscape
/write-sections growth
```

Each section becomes a React component displayed as a panel alongside the 3D graph.

### 8. Run the dev server

```bash
npm run dev
```

### 9. Iterate

Keep feeding material, expanding the graph, and refining sections. The site evolves with your thinking.

## Project Structure

```
CLAUDE.md                          # Full instructions for Claude (read this first)
.claude/commands/
  ingest.md                        # /ingest slash command
  build-graph.md                   # /build-graph slash command
  write-sections.md                # /write-sections slash command
sources/                           # Your raw material (after ingestion)
scripts/
  graph-add.js                     # CLI for managing graph.json
src/
  data/graph.json                  # The knowledge graph (starts empty)
  data/quotes.json                 # Testimonials and pullquotes
  App.tsx                          # Main app shell
  store.ts                         # State management (zustand)
```

## The Workflow

```
Your Material → /ingest → /build-graph → /write-sections → Interactive 3D Proposal
      ↑                                                              |
      └──────────────── keep iterating with Claude ←─────────────────┘
```

## Customization

- **Visual theme:** Garden/botanical by default. Change colors in CLAUDE.md, Claude builds the shaders.
- **Node types:** `pillar`, `person`, `organization`, `event`, `theme`, `place`, `resource` — or propose new ones.
- **Sections:** 6 default sections, renameable/reorderable.
- **Everything else:** It's just React + Three.js. Ask Claude to change anything.
