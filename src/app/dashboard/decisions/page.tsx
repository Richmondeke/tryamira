'use client';

import { useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';

function AmiraSparkle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" fill="#1b5a92" />
      <circle cx="12" cy="11" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}

const DECISIONS = [
  {
    id: 'dec-1',
    title: 'Review Contract — Acme Corp',
    customer: 'Acme Corp',
    value: '$140,000 ARR',
    risk: 'Low',
    riskColor: '#10b981',
    recommendation: 'Approve contract',
    reason: 'Matches legal policy. No unusual indemnification or liability clauses.',
    confidence: '96%',
    approver: 'Richmond (you)',
    docs: ['Enterprise_Agreement_v3.pdf', 'Legal_Audit_Notes.txt'],
  },
  {
    id: 'dec-2',
    title: 'Hire Senior Product Designer — Offer Authorization',
    customer: 'Internal HR',
    value: '$165,000 / yr + 0.15% equity',
    risk: 'Low',
    riskColor: '#10b981',
    recommendation: 'Extend formal offer',
    reason: 'Candidate Sarah Chen scored 4.9/5 across technical and cultural interviews.',
    confidence: '92%',
    approver: 'Richmond (you)',
    docs: ['Sarah_Chen_Portfolio.pdf', 'Interview_Scorecard.pdf'],
  },
  {
    id: 'dec-3',
    title: 'Approve Payment — AWS Monthly Infrastructure',
    customer: 'Amazon Web Services',
    value: '$8,750 USD',
    risk: 'Low',
    riskColor: '#10b981',
    recommendation: 'Approve payment',
    reason: '12% increase from last month due to scheduled Q3 data indexing run.',
    confidence: '99%',
    approver: 'Richmond (you)',
    docs: ['AWS_Invoice_Aug2026.pdf'],
  },
  {
    id: 'dec-4',
    title: 'Security Exception Request — Third-Party API Key',
    customer: 'Amira Integrations Gateway',
    value: 'Operational Access',
    risk: 'Medium',
    riskColor: '#f59e0b',
    recommendation: 'Approve with 30-day rotation policy',
    reason: 'OAuth token requires write scope for HubSpot integration.',
    confidence: '88%',
    approver: 'Richmond (you)',
    docs: ['Security_Audit_Log.json'],
  },
];

export default function DecisionsPage() {
  const { profile } = useUserProfile();
  const [decisions, setDecisions] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('amira_user_decisions');
      if (stored) {
        try { 
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return DECISIONS;
  });
  const [activeAskId, setActiveAskId] = useState<string | null>(null);
  const [askQuery, setAskQuery] = useState('');
  const [askResponses, setAskResponses] = useState<Record<string, string>>({});

  const updateDecisions = (newDecisions: any[]) => {
    setDecisions(newDecisions);
    if (typeof window !== 'undefined') {
      localStorage.setItem('amira_user_decisions', JSON.stringify(newDecisions));
    }
  };

  const handleApprove = (id: string) => {
    updateDecisions(decisions.filter(d => d.id !== id));
  };

  const handleReject = (id: string) => {
    updateDecisions(decisions.filter(d => d.id !== id));
  };

  const handleAsk = (id: string) => {
    if (!askQuery.trim()) return;
    setAskResponses(prev => ({
      ...prev,
      [id]: `Amira: Analyzed documents & context for "${askQuery}". Confidence is high and risk is within normal parameters.`,
    }));
    setAskQuery('');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>

      {/* Header */}
      <PageHeader
        title="Your Decisions & Approvals"
        subtitle="Amira surfaces only high-leverage items requiring human executive judgment, accompanied by AI risk assessments and context recommendations."
        badge={{ text: `${decisions.length} Pending`, variant: decisions.length > 0 ? 'amber' : 'green' }}
        actions={
          <button
            type="button"
            onClick={() => updateDecisions(DECISIONS)}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              fontWeight: 650,
              cursor: 'pointer'
            }}
          >
            ↻ Reset Sample Queue
          </button>
        }
      />

      {decisions.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          description="You have cleared all pending executive decisions and contracts. Amira will notify you when new approvals arrive."
          action={{ label: 'Reload Sample Queue', onClick: () => updateDecisions(DECISIONS) }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {decisions.map(dec => (
            <div key={dec.id} style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderLeft: '4px solid #1b5a92',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
                    {dec.title}
                  </h2>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {dec.reason}
                  </p>
                </div>
              </div>

              {/* Grid Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', padding: '1rem', backgroundColor: '#f8f9fc', borderRadius: '12px', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Customer / Entity</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{dec.customer}</div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Value / Impact</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{dec.value}</div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Risk Level</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: dec.riskColor, marginTop: '2px' }}>{dec.risk}</div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Approver</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{dec.approver}</div>
                </div>
              </div>

              {/* Recommendation */}
              <div style={{ backgroundColor: 'rgba(27,90,146, 0.08)', border: '1px solid rgba(27,90,146, 0.16)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '13px', fontWeight: 700, color: '#1b5a92' }}>
                    <AmiraSparkle size={14} />
                    AI Recommendation: {dec.recommendation}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '99px' }}>
                    {dec.confidence} confidence
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {dec.reason}
                </p>
              </div>

              {/* Supporting Documents */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Supporting Docs:</span>
                {dec.docs && dec.docs.map((doc: string) => (
                  <span key={doc} style={{ fontSize: '11.5px', color: '#1b5a92', backgroundColor: '#f5f3ff', border: '1px solid rgba(27,90,146, 0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                    📄 {doc}
                  </span>
                ))}
              </div>

              {/* Ask Amira Drawer */}
              {activeAskId === dec.id && (
                <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: '#f5f3ff', borderRadius: '12px', border: '1px solid rgba(27,90,146, 0.25)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Ask Amira anything (e.g. Compare with last month's invoice, Summarize clause 4...)"
                      value={askQuery}
                      onChange={e => setAskQuery(e.target.value)}
                      style={{ flex: 1, padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '13px', outline: 'none' }}
                    />
                    <button onClick={() => handleAsk(dec.id)} style={{ padding: '0.6rem 1.1rem', borderRadius: '8px', backgroundColor: '#1b5a92', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      Ask Amira
                    </button>
                  </div>
                  {askResponses[dec.id] && (
                    <div style={{ marginTop: '0.75rem', fontSize: '13px', color: '#1b5a92', lineHeight: 1.5, fontWeight: 500 }}>
                      {askResponses[dec.id]}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleApprove(dec.id)}
                    style={{
                      padding: '0.65rem 1.5rem',
                      borderRadius: '10px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(dec.id)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: '10px',
                      backgroundColor: '#f8f9fc',
                      color: 'var(--text-secondary)',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      border: '1px solid var(--border-strong)',
                      cursor: 'pointer',
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>

                <button
                  onClick={() => setActiveAskId(activeAskId === dec.id ? null : dec.id)}
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1b5a92',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <AmiraSparkle size={14} />
                  {activeAskId === dec.id ? 'Close Ask Amira' : 'Ask Amira'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
