'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Toast from '../../../../components/ui/Toast';

interface Agent {
  id: string;
  name: string;
  vapi_assistant_id: string;
}

export default function WidgetPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you today?');
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

  const generateEmbedCode = () => {
    const agentIdStr = selectedAgentId ? `\n    agentId: "${selectedAgentId}",` : '';
    return `<script>
  window.AmiraConfig = {
    workspaceId: "${workspaceId || 'YOUR_WORKSPACE_ID'}",${agentIdStr}
    theme: "${theme}",
    position: "${position}",
    welcomeMessage: "${welcomeMessage}"
  };
</script>
<script src="https://cdn.heyamira.com/widget.js" async></script>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setToast('Widget embed code copied!');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0' }}>Embed Widget</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0 }}>
            Install the Amira webchat on your site. The embed code is generated from your actual workspace and agent.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Config Panel */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 1.25rem 0' }}>Widget Configuration</h3>

          {/* Agent Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--stripe-label)', marginBottom: '6px' }}>
              AI Agent (Handles Webchat)
            </label>
            {loading ? (
              <div style={{ fontSize: '12px', color: 'var(--stripe-muted)' }}>Loading agents…</div>
            ) : agents.length === 0 ? (
              <div style={{
                padding: '0.75rem', borderRadius: '6px', border: '1px dashed var(--stripe-border)',
                fontSize: '12px', color: 'var(--stripe-muted)', textAlign: 'center'
              }}>
                No agents found. <a href="/dashboard/ai-agent" style={{ color: '#533afd' }}>Create an AI Agent first →</a>
              </div>
            ) : (
              <select
                value={selectedAgentId}
                onChange={e => setSelectedAgentId(e.target.value)}
                style={{
                  width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)',
                  borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)',
                  backgroundColor: '#fff',
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
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--stripe-label)', marginBottom: '6px' }}>Theme</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['light', 'dark'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    padding: '0.4rem 0.875rem', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
                    border: `1px solid ${theme === t ? '#533afd' : 'var(--stripe-border)'}`,
                    backgroundColor: theme === t ? '#533afd18' : '#fff',
                    color: theme === t ? '#533afd' : 'var(--stripe-navy)',
                    fontWeight: theme === t ? 600 : 400,
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--stripe-label)', marginBottom: '6px' }}>Position</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['bottom-right', 'bottom-left'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPosition(p)}
                  style={{
                    padding: '0.4rem 0.875rem', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
                    border: `1px solid ${position === p ? '#533afd' : 'var(--stripe-border)'}`,
                    backgroundColor: position === p ? '#533afd18' : '#fff',
                    color: position === p ? '#533afd' : 'var(--stripe-navy)',
                    fontWeight: position === p ? 600 : 400,
                  }}
                >
                  {p === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}
                </button>
              ))}
            </div>
          </div>

          {/* Welcome Message */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--stripe-label)', marginBottom: '6px' }}>Welcome Message</label>
            <input
              type="text"
              value={welcomeMessage}
              onChange={e => setWelcomeMessage(e.target.value)}
              style={{
                width: '100%', padding: '0.5rem', border: '1px solid var(--stripe-border)',
                borderRadius: '4px', fontSize: '12px', color: 'var(--stripe-navy)', boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={saveConfig}
            style={{
              backgroundColor: '#533afd', color: '#fff', border: 'none',
              borderRadius: '4px', padding: '0.5rem 1.25rem', fontSize: '12px',
              fontWeight: 500, cursor: 'pointer',
            }}
          >
            Save Configuration
          </button>
        </div>

        {/* Embed Code Panel */}
        <div>
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--stripe-navy)', margin: '0 0 0.75rem 0' }}>Installation Code</h3>
            <p style={{ fontSize: '12px', color: 'var(--stripe-body)', marginBottom: '1rem' }}>
              Paste this snippet before the closing <code>&lt;/body&gt;</code> tag of your website.
            </p>
            <div style={{ backgroundColor: '#061b31', borderRadius: '6px', padding: '1.25rem', position: 'relative' }}>
              <button
                onClick={handleCopy}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
                  padding: '0.25rem 0.5rem', fontSize: '12px', cursor: 'pointer',
                }}
              >
                Copy Code
              </button>
              <pre style={{ margin: 0, color: '#a0aec0', fontSize: '12px', fontFamily: 'monospace', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                {generateEmbedCode()}
              </pre>
            </div>
          </div>

          {/* Workspace ID info box */}
          <div style={{
            backgroundColor: '#f8fafc', border: '1px solid var(--stripe-border)',
            borderRadius: '6px', padding: '1rem', fontSize: '12px',
          }}>
            <div style={{ fontWeight: 600, color: 'var(--stripe-navy)', marginBottom: '6px' }}>Your Workspace ID</div>
            <code style={{
              display: 'block', backgroundColor: '#e8f0fe', color: '#533afd',
              padding: '6px 10px', borderRadius: '4px', fontSize: '11px',
              wordBreak: 'break-all',
            }}>
              {workspaceId || 'Loading…'}
            </code>
            <p style={{ margin: '8px 0 0 0', color: 'var(--stripe-muted)', fontSize: '11px' }}>
              This is your real workspace identifier. Only agents assigned to your workspace can be embedded via this widget.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
