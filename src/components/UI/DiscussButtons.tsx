import { GraphNode } from '../../store';

// ⚠️ UPDATE THESE when you deploy
const SITE_URL = 'https://your-community-proposal.example.com';
const CONTEXT_URL = `${SITE_URL}/graph-context.json`;

// Community name and elevator pitch — used in every discuss prompt
const COMMUNITY_NAME = 'Your Community Name';
const COMMUNITY_PITCH = 'A brief description of your community for the LLM to understand context.';

export function buildNodePrompt(node: GraphNode): string {
  const nodeType = `${node.type}: ${node.label}`;
  const context = node.description || '';
  const prompt = node.llmPrompt || '';
  const deepLink = `${SITE_URL}/?node=${node.id}`;

  return [
    `I'm exploring an interactive proposal for "${COMMUNITY_NAME}" — ${COMMUNITY_PITCH}`,
    ``,
    `I'm currently looking at: ${nodeType}`,
    `Link: ${deepLink}`,
    ``,
    context ? `Here's the context:\n${context}` : '',
    ``,
    prompt ? `Discussion angle: ${prompt}` : '',
    ``,
    `The full knowledge graph — all pillars, people, events, themes, and connections — is available at: ${CONTEXT_URL}`,
    `Fetch it to explore the full picture. Before we dive in, look through my conversation history to understand what I value and care about — then connect this community to those interests. Let's discuss this part of the proposal and why it might resonate with me specifically.`,
  ].filter(Boolean).join('\n');
}

export function buildSectionPrompt(
  section: string,
  label: string,
  context: string,
  angle: string,
): string {
  const deepLink = `${SITE_URL}/?section=${section}`;

  return [
    `I'm exploring an interactive proposal for "${COMMUNITY_NAME}" — ${COMMUNITY_PITCH}`,
    ``,
    `I'm currently reading: ${label}`,
    `Link: ${deepLink}`,
    ``,
    `Here's the context:\n${context}`,
    ``,
    `Discussion angle: ${angle}`,
    ``,
    `The full knowledge graph is available at: ${CONTEXT_URL}`,
    `Fetch it to explore the full picture. Before we dive in, look through my conversation history to understand what I value and care about — then connect this community to those interests. Let's discuss this section and why it might resonate with me specifically.`,
  ].join('\n');
}

function DiscussButtonPair({ prompt }: { prompt: string }) {
  const openDiscuss = (provider: 'claude' | 'chatgpt') => {
    const encoded = encodeURIComponent(prompt);
    const url =
      provider === 'claude'
        ? `https://claude.ai/new?q=${encoded}`
        : `https://chatgpt.com/?q=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div
      style={{
        marginTop: 32,
        paddingTop: 20,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 2,
          color: '#555',
          marginBottom: 12,
          fontFamily: 'monospace',
        }}
      >
        Discuss this
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => openDiscuss('claude')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid rgba(217, 119, 60, 0.3)',
            background: 'rgba(217, 119, 60, 0.08)',
            color: '#d9773c',
            fontSize: 12,
            fontFamily: 'monospace',
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
            letterSpacing: 0.5,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(217, 119, 60, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(217, 119, 60, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(217, 119, 60, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(217, 119, 60, 0.3)';
          }}
        >
          Discuss with Claude
        </button>
        <button
          onClick={() => openDiscuss('chatgpt')}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid rgba(116, 170, 156, 0.3)',
            background: 'rgba(116, 170, 156, 0.08)',
            color: '#74aa9c',
            fontSize: 12,
            fontFamily: 'monospace',
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
            letterSpacing: 0.5,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(116, 170, 156, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(116, 170, 156, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(116, 170, 156, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(116, 170, 156, 0.3)';
          }}
        >
          Discuss with ChatGPT
        </button>
      </div>
    </div>
  );
}

export function DiscussButtons({ node }: { node: GraphNode }) {
  return <DiscussButtonPair prompt={buildNodePrompt(node)} />;
}

export function SectionDiscussButtons({
  section,
  label,
  context,
  angle,
}: {
  section: string;
  label: string;
  context: string;
  angle: string;
}) {
  return (
    <DiscussButtonPair
      prompt={buildSectionPrompt(section, label, context, angle)}
    />
  );
}
