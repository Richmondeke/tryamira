'use client';

import { useState, useEffect } from 'react';
import { getSuggestedWorkflows, executeAmiraCommand } from '@/app/actions/agent';
import Link from 'next/link';

function AmiraSparkle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" fill="#1b5a92" />
      <circle cx="12" cy="11" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}

function getComposioLogoUrl(toolName: string): string {
  const clean = toolName.toLowerCase().replace(/\s+/g, '');
  const map: Record<string, string> = {
    gmail: 'gmail',
    googlecalendar: 'googlecalendar',
    calendar: 'googlecalendar',
    googlesheets: 'googlesheets',
    sheets: 'googlesheets',
    hubspot: 'hubspot',
    slack: 'slack',
    notion: 'notion',
    github: 'github',
    stripe: 'stripe',
    docusign: 'docusign',
    quickbooks: 'quickbooks',
    zendesk: 'zendesk',
    salesforce: 'salesforce',
    composio: 'composio',
  };
  const slug = map[clean] || clean;
  if (slug === 'composio') return '/amira-logo.svg';
  return `https://logos.composio.dev/api/${slug}`;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all');
  const [activeWorkflowIds, setActiveWorkflowIds] = useState<string[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any | null>(null);
  const [executing, setExecuting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    getSuggestedWorkflows().then(res => {
      if (res.success && res.workflows) {
        setWorkflows(res.workflows);
      }
    }).catch(() => {});

    if (typeof window !== 'undefined') {
      const savedActive = localStorage.getItem('amira_active_workflows');
      if (savedActive) {
        try { setActiveWorkflowIds(JSON.parse(savedActive)); } catch {}
      }
    }
  }, []);

  const toggleWorkflowActive = (wfId: string) => {
    setActiveWorkflowIds(prev => {
      const updated = prev.includes(wfId) ? prev.filter(id => id !== wfId) : [...prev, wfId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('amira_active_workflows', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleRunWorkflowNow = async (wf: any) => {
    setExecuting(true);
    setFeedback(`Executing workflow "${wf.title}" across ${wf.tools.join(' & ')}...`);
    
    // Trigger real action execution via server action
    const res = await executeAmiraCommand(wf.title);
    setExecuting(false);
    
    if (res.success) {
      setFeedback(`✅ Workflow executed successfully! Outcome logged to Recent Activity.`);
      toggleWorkflowActive(wf.id);
      setSelectedWorkflow(null);
    } else {
      setFeedback(`❌ Execution returned status: ${(res as any).error || 'Check integration connection'}`);
    }
  };

  const displayedWorkflows = activeTab === 'active'
    ? workflows.filter(w => activeWorkflowIds.includes(w.id))
    : workflows;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <AmiraSparkle size={20} />
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Multi-Tool Autonomous Workflows
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Automated cross-app synergies suggested by Amira based on your connected Amira Integrations integrations.
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-subtle, #f1f3fa)', padding: '3px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'all' ? '#1b5a92' : 'transparent',
              color: activeTab === 'all' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Suggested ({workflows.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'active' ? '#1b5a92' : 'transparent',
              color: activeTab === 'active' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            Active ({activeWorkflowIds.length})
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          backgroundColor: feedback.includes('✅') ? '#10b98115' : 'var(--bg-card)',
          border: `1px solid ${feedback.includes('✅') ? '#10b98140' : 'var(--border-subtle)'}`,
          color: feedback.includes('✅') ? '#10b981' : 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          {feedback}
        </div>
      )}

      {/* WORKFLOW CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
        {displayedWorkflows.map(wf => {
          const isActive = activeWorkflowIds.includes(wf.id);

          return (
            <div key={wf.id} style={{
              backgroundColor: 'var(--bg-card, #ffffff)',
              border: `1px solid ${isActive ? '#1b5a9260' : 'var(--border-subtle, rgba(0,0,0,0.08))'}`,
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div>
                {/* Integration Tool Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {wf.tools.map((t: string) => (
                      <span key={t} style={{
                        fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                        backgroundColor: 'var(--bg-subtle, #f8f9fc)', color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                      }}>
                        <img
                          src={getComposioLogoUrl(t)}
                          alt={t}
                          style={{ width: '13px', height: '13px', objectFit: 'contain', borderRadius: '2px' }}
                          onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                        />
                        {t}
                      </span>
                    ))}
                  </div>

                  <span style={{
                    fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px',
                    backgroundColor: isActive ? '#10b98115' : 'var(--bg-subtle)',
                    color: isActive ? '#10b981' : 'var(--text-tertiary)',
                    border: `1px solid ${isActive ? '#10b98140' : 'transparent'}`
                  }}>
                    {isActive ? '● ACTIVE' : 'SUGGESTED'}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                  {wf.title}
                </h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {wf.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setSelectedWorkflow(wf)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    borderRadius: '9px',
                    backgroundColor: '#1b5a92',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <AmiraSparkle size={14} />
                  {wf.actionLabel}
                </button>

                <button
                  onClick={() => toggleWorkflowActive(wf.id)}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: '9px',
                    backgroundColor: isActive ? '#10b98115' : 'var(--bg-subtle)',
                    color: isActive ? '#10b981' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: `1px solid ${isActive ? '#10b98140' : 'var(--border-subtle)'}`,
                    cursor: 'pointer'
                  }}
                >
                  {isActive ? 'Active' : 'Enable'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SIDE DRAWER FOR WORKFLOW DETAILS */}
      {selectedWorkflow && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card, #ffffff)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AmiraSparkle size={18} />
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Workflow Configuration
                </span>
              </div>
              <button
                onClick={() => setSelectedWorkflow(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
                {selectedWorkflow.tools.map((t: string) => (
                  <span key={t} style={{
                    fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                    backgroundColor: 'var(--bg-subtle, #f8f9fc)', color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle, rgba(0,0,0,0.08))',
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem'
                  }}>
                    <img
                      src={getComposioLogoUrl(t)}
                      alt={t}
                      style={{ width: '13px', height: '13px', objectFit: 'contain', borderRadius: '2px' }}
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                    {t}
                  </span>
                ))}
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                {selectedWorkflow.title}
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {selectedWorkflow.description}
              </p>
            </div>

            {/* Workflow Trigger & Action Parameters */}
            <div style={{
              backgroundColor: 'var(--bg-subtle, #f8f9fc)',
              borderRadius: '12px',
              padding: '1.1rem',
              border: '1px solid var(--border-subtle, rgba(0,0,0,0.06))',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1b5a92', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.6rem' }}>
                • Trigger & Action Architecture
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '12.5px' }}>
                <div>
                  <span style={{ color: 'var(--text-tertiary)', fontWeight: 700, display: 'block', fontSize: '11px' }}>TRIGGER EVENT</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedWorkflow.trigger}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-tertiary)', fontWeight: 700, display: 'block', fontSize: '11px' }}>AUTOMATED ACTION</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedWorkflow.action}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => handleRunWorkflowNow(selectedWorkflow)}
              disabled={executing}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '10px',
                backgroundColor: '#1b5a92',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(27,90,146,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: executing ? 0.7 : 1
              }}
            >
              <AmiraSparkle size={16} />
              {executing ? 'Executing Workflow...' : selectedWorkflow.actionLabel}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
