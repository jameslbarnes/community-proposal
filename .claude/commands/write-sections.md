# /write-sections — Generate Proposal Section Content

You are writing (or rewriting) proposal section content for a community membership proposal site. The input is: `$ARGUMENTS`

If no arguments, write all sections. If a section name is given (e.g., "overview", "founder"), write just that one.

## Context

The proposal site has 6 sections displayed as panels alongside a 3D knowledge graph. Each section is a React component that renders the proposal content with framer-motion animations.

## Sections

### 1. Overview (`src/components/Proposal/Overview.tsx`)
**Purpose:** The elevator pitch. Why this community, why now.
**Inputs:** Read all pillar nodes, theme nodes, and the overall graph structure.
**Structure:**
- Community name + tagline
- The thesis (2-3 sentences on what this community believes)
- The "why now" — what cultural/market moment makes this urgent
- What makes it different (1 paragraph)
- Quick stats if available (members, events, content volume)

### 2. Founder/Team (`src/components/Proposal/FounderStory.tsx`)
**Purpose:** Credibility and origin story.
**Inputs:** Read person nodes (especially founder), theme nodes about values.
**Structure:**
- Founder's story — not a resume, a narrative
- Why this person/team is uniquely positioned
- Key credentials woven into story (not a bullet list)
- The founding moment or insight

### 3. Content Pillars (`src/components/Proposal/ContentPillars.tsx`)
**Purpose:** Deep dive on each program track.
**Inputs:** Read all pillar nodes + their connected nodes (people, events, resources).
**Structure:**
- One block per pillar
- Each block: title, description, key offerings, who leads it, signature events
- Show how pillars interconnect (cross-references)

### 4. The Experience (`src/components/Proposal/TheExperience.tsx`)
**Purpose:** What membership actually feels like.
**Inputs:** Read event nodes, resource nodes, testimonials from quotes.json.
**Structure:**
- "A week in the life" or "A month in the life" narrative
- Signature rituals and rhythms
- Sample content (workshop outline, prompt, discussion thread)
- Member testimonials

### 5. Landscape (`src/components/Proposal/Landscape.tsx`)
**Purpose:** Positioning against comparable communities.
**Inputs:** Read organization nodes (comparable communities).
**Structure:**
- 3-5 comparable communities with honest analysis
- Positioning matrix or differentiation framework
- What you're NOT (as important as what you are)

### 6. Growth & Market (`src/components/Proposal/GrowthMarket.tsx`)
**Purpose:** Who this is for, how it grows, business model.
**Inputs:** All graph data, especially theme and organization nodes.
**Structure:**
- Target audience portrait (specific, not generic)
- Pricing model
- Growth strategy (organic, partnerships, content flywheel)
- Key metrics / milestones

## Writing Style

- **Direct and specific.** No filler, no "in today's world." Lead with the point.
- **Vivid over polished.** A rough-edged honest sentence beats a smooth empty one.
- **Show, don't claim.** Instead of "we're innovative," describe the innovation.
- **Conversational authority.** Like a smart friend explaining their passion project, not a pitch deck.
- **Short paragraphs.** The panel is narrow (480px desktop). Long blocks of text feel oppressive.

## Technical Pattern

Each section follows this pattern (see Overview.tsx as reference):

```tsx
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import SectionShell from './SectionShell';
import SectionNav from './SectionNav';

export default function SectionName({ embedded }: { embedded?: boolean }) {
  const setSection = useStore((s) => s.setSection);

  return (
    <SectionShell embedded={embedded}>
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          fontSize: 11,
          fontFamily: 'monospace',
          letterSpacing: 3,
          color: '#e8b4b8',  // accent color
          marginBottom: 32,
          textTransform: 'uppercase',
        }}
      >
        SECTION LABEL
      </motion.div>

      {/* Content */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 15,
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.85)',
          margin: '0 0 20px 0',
        }}
      >
        Paragraph content here.
      </motion.p>

      <SectionNav current="sectionkey" />
    </SectionShell>
  );
}
```

## Process

1. Read the full graph (`src/data/graph.json`)
2. Read `src/data/quotes.json` for testimonials
3. Read any existing section files to understand current state
4. Draft the section content
5. Write the React component(s)
6. Update App.tsx section routing if needed

## Guidelines

- **Pull from the graph.** Every claim in the proposal should trace back to a node or edge. The graph IS the proposal's evidence base.
- **Use quotes from quotes.json.** Testimonials are gold.
- **Cross-reference between sections.** "As we explore in the Mindfulness pillar..." with a link/click handler.
- **Stagger animations.** Increment delay by 0.05-0.1 per element for a cascade effect.
- **Keep each section scannable.** Headers, short paragraphs, occasional pull quotes.
