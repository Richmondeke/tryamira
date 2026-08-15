'use client';

import { useState } from 'react';
import { AmiraResultEmbed } from '@/components/ui/AmiraResultEmbed';

function AmiraSparkle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" fill="#1b5a92" />
      <circle cx="12" cy="11" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}

const KNOWLEDGE_DOCS = [
  { id: 'doc-1', name: 'Enterprise Sales Playbook 2026.pdf', type: 'PDF File', size: '1.2 MB', source: 'Notion Sync', updated: '2 hours ago' },
  { id: 'doc-2', name: 'Customer Support Escalation Policy.docx', type: 'Document', size: '450 KB', source: 'Google Drive', updated: '1 day ago' },
  { id: 'doc-3', name: 'Legal Terms & SLA Agreements.url', type: 'Web URL', size: '120 KB', source: 'Web Scraper', updated: '3 days ago' },
  { id: 'doc-4', name: 'Product Architecture & API Spec.md', type: 'Text Note', size: '680 KB', source: 'GitHub Repos', updated: '5 days ago' },
];

export default function KnowledgePage() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [docs, setDocs] = useState(KNOWLEDGE_DOCS);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setAnswer(null);

    setTimeout(() => {
      setSearching(false);
      setAnswer(
        `Synthesized from Notion (Sales Playbook 2026) and Google Drive:\n\n` +
        `• Acme Corp contract specifies $140K ARR with 30-day net payment terms.\n` +
        `• Legal policy standard allows net 30 without executive escalation if deal value > $100K.\n` +
        `• Sarah Chen requested demo call for Thursday 2:00 PM.`
      );
    }, 800);
  };

  const handleAddFile = () => {
    const fileName = prompt('Enter document or URL name:');
    if (fileName) {
      setDocs(prev => [
        { id: `doc-${Date.now()}`, name: fileName, type: 'Added Doc', size: '320 KB', source: 'Direct Upload', updated: 'Just now' },
        ...prev
      ]);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>

      {/* ── HEADER WITH RAG STORAGE METER ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '24px' }}>🧠</span>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Knowledge Base
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            Provide company documents, URLs, and memory sources for your AI Voice Agents.
          </p>
        </div>

        {/* RAG Storage Pill Meter */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.95rem',
          borderRadius: '99px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle, rgba(0,0,0,0.12))',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)', fontSize: '12px', fontWeight: 700
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span style={{ color: 'var(--text-primary)' }}>RAG Storage:</span>
          <span style={{ color: '#1b5a92' }}>2.4 MB / 50.0 MB</span>
        </div>
      </div>

      {/* ── QUICK ACTION CARDS (ELEVENLABS STYLE) ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
        {[
          { title: 'Add URL', icon: '🌐', desc: 'Index web pages', action: handleAddFile },
          { title: 'Add Files', icon: '📄', desc: 'PDF, DOCX, TXT', action: handleAddFile },
          { title: 'Create Text', icon: '📝', desc: 'Custom prompt notes', action: handleAddFile },
          { title: 'Create Folder', icon: '📁', desc: 'Organize docs', action: handleAddFile },
          { title: 'Sync Documents', icon: '🔄', desc: 'Notion & Drive', action: () => alert('Syncing company documents from Notion & Drive...') },
        ].map(card => (
          <div
            key={card.title}
            onClick={card.action}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
              borderRadius: '12px',
              padding: '1.1rem',
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
            <span style={{ fontSize: '24px', marginBottom: '0.4rem' }}>{card.icon}</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{card.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{card.desc}</div>
          </div>
        ))}
      </div>

      {/* ── SEARCH MEMORY BOX ──────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 16px rgba(27,90,146,0.04)'
      }}>
        <form onSubmit={e => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search Knowledge Base or ask a synthesized question..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.4rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                fontSize: '13.5px',
                outline: 'none',
                backgroundColor: 'var(--bg-subtle, #f8f9fc)',
                boxSizing: 'border-box'
              }}
            />
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: 'var(--text-tertiary)' }}>
              🔍
            </span>
          </div>
          <button
            type="submit"
            disabled={searching}
            style={{
              padding: '0.75rem 1.35rem',
              borderRadius: '10px',
              backgroundColor: '#1b5a92',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {searching ? 'Searching...' : 'Search Memory'}
          </button>
        </form>

        {answer && (
          <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', borderRadius: '12px', backgroundColor: '#1b5a9208', border: '1px solid #1b5a9230' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1b5a92', fontWeight: 800, fontSize: '12px', marginBottom: '0.5rem' }}>
              <AmiraSparkle size={14} /> SYNTHESIZED RAG ANSWER
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {answer}
            </div>
          </div>
        )}
      </div>

      {/* ── INDEXED DOCUMENTS TABLE ────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
          Indexed Documents ({docs.length})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {docs.map(doc => (
            <div key={doc.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.85rem 1.1rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle, #f8f9fc)',
              border: '1px solid var(--border-subtle, rgba(0,0,0,0.06))', flexWrap: 'wrap', gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '18px' }}>📄</span>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{doc.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{doc.type} • {doc.size} • Source: {doc.source}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Updated {doc.updated}</span>
                <button
                  type="button"
                  onClick={() => setDocs(prev => prev.filter(d => d.id !== doc.id))}
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
