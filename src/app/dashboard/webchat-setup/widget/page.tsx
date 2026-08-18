'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PageHeader } from '@/components/ui/PageHeader';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import Toast from '@/components/ui/Toast';

interface Agent {
  id: string;
  name: string;
  vapi_assistant_id: string;
}

export default function WidgetPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [embedType, setEmbedType] = useState<'voice' | 'chat'>('voice');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you today?');
  const [voiceGreeting, setVoiceGreeting] = useState('Hello! I am your AI assistant. How can I help you?');
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setWorkspaceId(user.id);

      // Load agents
      const { data: agentRows } = await supabase
        .from('workspace_agents')
        .select('id, name, vapi_assistant_id')
        .eq('workspace_id', user.id)
        .order('created_at', { ascending: false });

      const agentList = (agentRows || []).filter((a: any) => a.vapi_assistant_id);
      setAgents(agentList);

      // Load saved webchat config
      const { data: config } = await supabase
        .from('webchat_configs')
        .select('*')
        .eq('workspace_id', user.id)
        .single();

      if (config) {
        setSelectedAgentId(config.agent_id || '');
        setTheme(config.theme || 'light');
        setPosition(config.position || 'bottom-right');
        setWelcomeMessage(config.welcome_message || 'Hi! How can I help you today?');
      } else if (agentList.length > 0) {
        setSelectedAgentId(agentList[0].vapi_assistant_id);
      }

      setLoading(false);
    });
  }, []);

  const saveConfig = async () => {
    const supabase = createClient();
    await supabase.from('webchat_configs').upsert({
      workspace_id: workspaceId,
      agent_id: selectedAgentId,
      theme,
      position,
      welcome_message: welcomeMessage,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'workspace_id' });
    setToast('Widget configuration saved!');
  };

  const generateVoiceSDKCode = () => {
    const assistantId = selectedAgentId || 'ae0f0250-c62c-4c65-916e-85af7d7288b7';
    return `<!-- Amira WebRTC Voice Agent SDK -->
<script 
  src="https://tryamira.com/voice-sdk.js" 
  data-assistant-id="${assistantId}"
  data-theme="${theme}"
  data-position="${position}"
  data-greeting="${voiceGreeting}"
  async>
</script>`;
  };

  const generateReactVoiceHookCode = () => {
    const assistantId = selectedAgentId || 'ae0f0250-c62c-4c65-916e-85af7d7288b7';
    return `import { useAmiraVoice } from '@amira/react-voice-sdk';

export function VoiceCallButton() {
  const { startCall, endCall, isConnected, isSpeaking } = useAmiraVoice({
    assistantId: "${assistantId}",
    onSpeechStart: () => console.log('Amira speaking...'),
    onTranscript: (line) => console.log(line.role, line.text)
  });

  return (
    <button onClick={isConnected ? endCall : startCall}>
      {isConnected ? (isSpeaking ? 'Amira speaking…' : 'Listening…') : '🎙️ Talk to Voice Agent'}
    </button>
  );
}`;
  };

  const generateChatEmbedCode = () => {
    const agentIdStr = selectedAgentId ? `\n    agentId: "${selectedAgentId}",` : '';
    return `<script>
  window.AmiraConfig = {
    workspaceId: "${workspaceId || 'YOUR_WORKSPACE_ID'}",${agentIdStr}
    theme: "${theme}",
    position: "${position}",
    welcomeMessage: "${welcomeMessage}"
  };
</script>
<script src="https://heyamira.com/widget.js" async></script>`;
  };

  const handleCopy = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setToast(`${label} copied to clipboard!`);
  };

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', width: '100%', fontFamily: "'Satoshi', sans-serif" }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <PageHeader
        title="Web Voice SDK & Webchat Embed"
        subtitle="Embed interactive WebRTC voice agents (Bland & Vapi architecture) or omnichannel text webchat directly onto your landing pages and customer portals with 2 lines of code."
        badge={{ text: '● WebRTC Audio Gateway', variant: 'green' }}
      />

      {/* TABS SWITCHER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SegmentedTabs
          tabs={[
            { id: 'voice', label: '🎙️ WebRTC Voice Agent SDK (Instant Browser Mic)', icon: '⚡' },
            { id: 'chat', label: '💬 Omnichannel Text Webchat Widget', icon: '💬' },
          ]}
          activeTab={embedType}
          onChange={(t) => setEmbedType(t as any)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.15fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* LEFT COLUMN: CONFIGURATION PANEL */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 750, color: 'var(--text-primary)', margin: '0 0 1.25rem 0' }}>
            {embedType === 'voice' ? '🎙️ Voice Agent SDK Settings' : '💬 Webchat Configuration'}
          </h3>

          {/* Agent Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Target Voice Assistant
            </label>
            {loading ? (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Loading assistants…</div>
            ) : agents.length === 0 ? (
              <div style={{ padding: '0.75rem', borderRadius: '8px', border: '1px dashed var(--border-subtle)', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Default Global Assistant (Amira Rachel)
              </div>
            ) : (
              <select
                value={selectedAgentId}
                onChange={e => setSelectedAgentId(e.target.value)}
                style={{
                  width: '100%', padding: '0.65rem 0.85rem', border: '1px solid var(--border-subtle)',
                  borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-subtle)', outline: 'none'
                }}
              >
                <option value="">— Select an agent —</option>
                {agents.map(a => (
                  <option key={a.vapi_assistant_id} value={a.vapi_assistant_id}>
                    {a.name} ({a.vapi_assistant_id.slice(0, 8)}…)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Theme */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: 'var(--text-secondary)', marginBottom: '6px' }}>Widget Theme</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['light', 'dark'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  style={{
                    padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '12.5px', cursor: 'pointer',
                    border: `1px solid ${theme === t ? '#1b5a92' : 'var(--border-subtle)'}`,
                    backgroundColor: theme === t ? '#1b5a9218' : 'var(--bg-subtle)',
                    color: theme === t ? '#1b5a92' : 'var(--text-secondary)',
                    fontWeight: theme === t ? 700 : 500,
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)} Mode
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: 'var(--text-secondary)', marginBottom: '6px' }}>Screen Float Position</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['bottom-right', 'bottom-left'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPosition(p)}
                  style={{
                    padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '12.5px', cursor: 'pointer',
                    border: `1px solid ${position === p ? '#1b5a92' : 'var(--border-subtle)'}`,
                    backgroundColor: position === p ? '#1b5a9218' : 'var(--bg-subtle)',
                    color: position === p ? '#1b5a92' : 'var(--text-secondary)',
                    fontWeight: position === p ? 700 : 500,
                  }}
                >
                  {p === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
                </button>
              ))}
            </div>
          </div>

          {/* Spoken Greeting / Welcome Message */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 650, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {embedType === 'voice' ? 'Spoken Voice Greeting' : 'Chat Welcome Message'}
            </label>
            <input
              type="text"
              value={embedType === 'voice' ? voiceGreeting : welcomeMessage}
              onChange={e => embedType === 'voice' ? setVoiceGreeting(e.target.value) : setWelcomeMessage(e.target.value)}
              style={{
                width: '100%', padding: '0.65rem 0.85rem', border: '1px solid var(--border-subtle)',
                borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', backgroundColor: 'var(--bg-subtle)',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="button"
            onClick={saveConfig}
            style={{
              backgroundColor: '#1b5a92', color: '#fff', border: 'none',
              borderRadius: '10px', padding: '0.65rem 1.5rem', fontSize: '13px',
              fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(27, 90, 146, 0.25)'
            }}
          >
            Save Widget Configuration
          </button>
        </div>

        {/* RIGHT COLUMN: COPYABLE CODE SNIPPETS & LIVE PREVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* SCRIPT TAG CODE BLOCK */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 750, color: 'var(--text-primary)', margin: 0 }}>
                  {embedType === 'voice' ? '1. HTML Script Embed' : '1. Webchat Embed Code'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Paste before the closing <code>&lt;/body&gt;</code> tag on any website (Webflow, Shopify, WordPress, Next.js).
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(embedType === 'voice' ? generateVoiceSDKCode() : generateChatEmbedCode(), 'Embed code')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#1b5a92',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                📋 Copy
              </button>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '10px', padding: '1.25rem', overflowX: 'auto' }}>
              <pre style={{ margin: 0, color: '#38bdf8', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {embedType === 'voice' ? generateVoiceSDKCode() : generateChatEmbedCode()}
              </pre>
            </div>
          </div>

          {/* REACT HOOK BLOCK (VOICE SDK ONLY) */}
          {embedType === 'voice' && (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 750, color: 'var(--text-primary)', margin: 0 }}>
                    2. React Hook Implementation
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    For custom custom voice calling buttons and headless WebRTC components.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(generateReactVoiceHookCode(), 'React hook code')}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  📋 Copy
                </button>
              </div>

              <div style={{ backgroundColor: '#0f172a', borderRadius: '10px', padding: '1.25rem', overflowX: 'auto' }}>
                <pre style={{ margin: 0, color: '#4ade80', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {generateReactVoiceHookCode()}
                </pre>
              </div>
            </div>
          )}

          {/* Workspace ID Security Box */}
          <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', fontSize: '12px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>🛡️ Multi-Tenant Workspace Key</div>
            <code style={{ display: 'block', backgroundColor: 'var(--bg-card)', color: '#1b5a92', padding: '6px 10px', borderRadius: '6px', fontSize: '11.5px', fontFamily: 'monospace', border: '1px solid var(--border-subtle)' }}>
              {workspaceId || 'Live Authenticated Workspace ID'}
            </code>
          </div>

        </div>

      </div>
    </div>
  );
}
