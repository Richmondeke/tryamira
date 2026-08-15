'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ToolItem {
  id: string;
  name: string;
  type: 'Webhook' | 'Client Function' | 'Integration Action';
  description: string;
  status: 'Active' | 'Draft';
  usedByAgentsCount: number;
}

const DEFAULT_TOOLS: ToolItem[] = [
  {
    id: 'tool-1',
    name: 'Schedule Google Calendar Meeting',
    type: 'Integration Action',
    description: 'Creates a live Google Calendar event and sends an invite to the caller.',
    status: 'Active',
    usedByAgentsCount: 3
  },
  {
    id: 'tool-2',
    name: 'Dispatched Gmail Email Receipt',
    type: 'Integration Action',
    description: 'Sends confirmation email with call summary and next steps.',
    status: 'Active',
    usedByAgentsCount: 4
  },
  {
    id: 'tool-3',
    name: 'HubSpot Deal & Lead Lookup',
    type: 'Integration Action',
    description: 'Fetches active deal size, pipeline stage, and contact info from CRM.',
    status: 'Active',
    usedByAgentsCount: 2
  },
  {
    id: 'tool-4',
    name: 'Custom Webhook POST Notification',
    type: 'Webhook',
    description: 'Sends real-time call payload to internal backend endpoint.',
    status: 'Active',
    usedByAgentsCount: 1
  }
];

export default function VoiceToolsPage() {
  const [tools, setTools] = useState<ToolItem[]>(DEFAULT_TOOLS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTool = (typeStr: ToolItem['type']) => {
    const name = prompt(`Enter name for new ${typeStr}:`);
    if (name) {
      setTools(prev => [
        {
          id: `tool-${Date.now()}`,
          name,
          type: typeStr,
          description: `Custom ${typeStr} created for Voice Agent execution.`,
          status: 'Active',
          usedByAgentsCount: 1
        },
        ...prev
      ]);
    }
  };

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Voice Agent Tools
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          Configure webhooks, client functions, and Amira integration actions available to your voice agents during calls.
        </p>
      </div>

      {/* ── QUICK ADD TOOL CARDS (ELEVENLABS STYLE) ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { title: 'Add Webhook Tool', icon: '⚡', desc: 'Trigger HTTP endpoints on live call events', type: 'Webhook' as const },
          { title: 'Add Client Tool', icon: '🔧', desc: 'Execute client-side UI functions during calls', type: 'Client Function' as const },
          { title: 'Add Integration Tool', icon: '🔌', desc: 'Attach Gmail, Calendar, HubSpot, or Sheets actions', type: 'Integration Action' as const },
        ].map(card => (
          <div
            key={card.title}
            onClick={() => handleAddTool(card.type)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
              borderRadius: '12px',
              padding: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'all 0.15s ease-in-out'
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#1b5a92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={{ fontSize: '26px', marginBottom: '0.4rem' }}>{card.icon}</span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{card.title}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '3px' }}>{card.desc}</div>
          </div>
        ))}
      </div>

      {/* ── SEARCH & TOOLS INVENTORY TABLE ─────────────────────────────────── */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Configured Agent Tools ({filteredTools.length})
          </h3>

          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '12px',
                outline: 'none',
                backgroundColor: 'var(--bg-subtle, #f8f9fc)'
              }}
            />
            <span style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--text-tertiary)' }}>
              🔍
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredTools.map(t => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle, #f8f9fc)',
                border: '1px solid var(--border-subtle, rgba(0,0,0,0.06))',
                flexWrap: 'wrap',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                }}>
                  {t.type === 'Webhook' ? '⚡' : t.type === 'Client Function' ? '🔧' : '🔌'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {t.name}
                    </h4>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>
                      {t.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                    {t.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  Used by {t.usedByAgentsCount} Voice {t.usedByAgentsCount === 1 ? 'Agent' : 'Agents'}
                </span>
                <button
                  type="button"
                  onClick={() => setTools(prev => prev.filter(tool => tool.id !== t.id))}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
