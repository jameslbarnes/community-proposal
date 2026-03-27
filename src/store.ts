import { create } from 'zustand';

export interface GraphNode {
  id: string;
  type: 'pillar' | 'person' | 'organization' | 'event' | 'theme' | 'place' | 'resource';
  label: string;
  description?: string;
  llmPrompt?: string;
  x: number;
  y: number;
  z?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  layer: 'narrative' | 'evidence' | 'both';
  weight: number;
}

type Section = 'overview' | 'founder' | 'pillars' | 'experience' | 'landscape' | 'growth' | null;
export type IntroPhase = 'intro' | 'expanding' | 'complete';

interface Store {
  selectedNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  activeSection: Section;
  panelOpen: boolean;
  introComplete: boolean;
  introPhase: IntroPhase;
  mousePos: { x: number; y: number };
  highlightedNodes: string[];
  cameraResetKey: number;
  selectNode: (node: GraphNode | null) => void;
  hoverNode: (node: GraphNode | null) => void;
  setSection: (section: Section) => void;
  dismissIntro: () => void;
  completeReveal: () => void;
  setMousePos: (x: number, y: number) => void;
  setHighlightedNodes: (ids: string[]) => void;
  resetCamera: () => void;
}

export const useStore = create<Store>((set) => ({
  selectedNode: null,
  hoveredNode: null,
  activeSection: null,
  panelOpen: false,
  introComplete: false,
  introPhase: 'intro',
  mousePos: { x: 0, y: 0 },
  highlightedNodes: [],
  cameraResetKey: 0,
  selectNode: (node) => set({ selectedNode: node, panelOpen: !!node }),
  hoverNode: (node) => set({ hoveredNode: node }),
  setSection: (section) => set({ activeSection: section }),
  dismissIntro: () => set({ introComplete: true, introPhase: 'complete' }),
  completeReveal: () => set({ introPhase: 'complete' }),
  setMousePos: (x, y) => set({ mousePos: { x, y } }),
  setHighlightedNodes: (ids) => set({ highlightedNodes: ids }),
  resetCamera: () => set((s) => ({ cameraResetKey: s.cameraResetKey + 1 })),
}));
