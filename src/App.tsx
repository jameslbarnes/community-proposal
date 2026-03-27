import { useStore } from './store';

/**
 * Starter App shell.
 *
 * This is a minimal placeholder. Once you've built the graph with /build-graph,
 * ask Claude to build out the full app with:
 *   - 3D graph visualization (R3F Canvas, force layout, garden background shader)
 *   - Section panels (Overview, Founder, Pillars, Experience, Landscape, Growth)
 *   - Navigation (NavRail, keyboard shortcuts, URL deep linking)
 *   - Detail panel + search
 *
 * See CLAUDE.md for the full architecture and component list.
 */
export default function App() {
  const activeSection = useStore((s) => s.activeSection);
  const setSection = useStore((s) => s.setSection);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      color: '#f0e6d3',
      background: '#0a1a0f',
    }}>
      <h1 style={{ fontSize: 32, fontWeight: 400, marginBottom: 16 }}>
        Community Proposal
      </h1>
      <p style={{ color: 'rgba(240,230,211,0.6)', marginBottom: 32, textAlign: 'center', maxWidth: 480 }}>
        Drop your source material into <code style={{ color: '#e8b4b8' }}>sources/</code> and
        run <code style={{ color: '#e8b4b8' }}>/ingest</code>, then <code style={{ color: '#e8b4b8' }}>/build-graph</code> to
        get started. Once your graph has nodes, ask Claude to build the 3D visualization and proposal sections.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['overview', 'founder', 'pillars', 'experience', 'landscape', 'growth'].map((s) => (
          <button
            key={s}
            onClick={() => setSection(activeSection === s ? null : s as Parameters<typeof setSection>[0])}
            style={{
              background: activeSection === s ? 'rgba(232,180,184,0.2)' : 'rgba(240,230,211,0.08)',
              border: '1px solid rgba(240,230,211,0.15)',
              color: '#f0e6d3',
              padding: '8px 16px',
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase' as const,
            }}
          >
            {s}
          </button>
        ))}
      </div>
      {activeSection && (
        <p style={{ marginTop: 24, color: 'rgba(240,230,211,0.4)', fontSize: 14 }}>
          Section: {activeSection} (content will go here)
        </p>
      )}
    </div>
  );
}
