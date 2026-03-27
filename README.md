# Community Proposal — Interactive Knowledge Graph

An interactive proposal site for a membership community, featuring a 3D knowledge graph visualization with a botanical/garden theme.

Built with Claude Code. Adapted from [Eventually Everything Connects](https://eventuallyeverythingconnects.com).

## Quick Start

### 1. Set up the project

```bash
npm install
```

### 2. Feed Claude your source material

Drop your existing content into `sources/` — pitch decks, notes, essays, workshop outlines, testimonials, anything. Then:

```
/ingest sources/my-pitch-deck.pdf
/ingest sources/workshop-notes.md
/ingest "Here's a testimonial from a member: ..."
```

Claude will classify the material, map it to the proposal structure, and ask what to do.

### 3. Build the knowledge graph

Once you have material ingested:

```
/build-graph
```

Claude will crawl your sources, identify pillars/people/events/themes, and build the graph interactively with you.

### 4. Write the proposal sections

```
/write-sections
/write-sections overview
/write-sections founder
```

Claude drafts React components for each section, pulling from the graph data.

### 5. Run the dev server

```bash
npm run dev
```

### 6. Iterate

The power of this approach is iteration. Keep ingesting material, expanding the graph, and refining sections. The 3D visualization updates live as the graph grows.

## Project Structure

```
├── CLAUDE.md                      # Claude's instructions for this project
├── .claude/commands/
│   ├── ingest.md                  # /ingest — source material pipeline
│   ├── build-graph.md             # /build-graph — construct the knowledge graph
│   └── write-sections.md          # /write-sections — generate proposal content
├── sources/                       # Your raw material goes here
├── scripts/
│   └── graph-add.js               # CLI for managing graph.json
├── src/
│   ├── data/
│   │   ├── graph.json             # The knowledge graph
│   │   └── quotes.json            # Testimonials and pullquotes
│   └── ...                        # React components (Claude builds these)
└── public/
    └── graph-context.json         # Flattened graph for external AI agents
```

## The Workflow

```
Source Material → /ingest → /build-graph → /write-sections → Interactive Proposal
     ↑                                                              |
     └──────────── iterate with Claude ←────────────────────────────┘
```

## Customization

- **Visual theme:** The default is a botanical garden (flowers, vines, warm earth tones). Change the shader in `GardenBackground.tsx` and colors in `utils/colors.ts`.
- **Node types:** Adapt the schema in CLAUDE.md. Current defaults are `pillar`, `person`, `organization`, `event`, `theme`, `place`, `resource`.
- **Sections:** The 6 proposal sections can be renamed/reordered in `App.tsx`.

## Credits

Architecture and tooling adapted from James Barnes's book proposal, [Eventually Everything Connects](https://eventuallyeverythingconnects.com).
