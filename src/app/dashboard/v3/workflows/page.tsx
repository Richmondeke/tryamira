'use client';

import React, { useState, useEffect } from 'react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { getSuggestedWorkflows } from '@/app/actions/agent';

export default function V3WorkflowsPage() {
  const { isDemoMode } = useDemoMode();
  const [liveWorkflows, setLiveWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isDemoMode) {
      setIsLoading(true);
      getSuggestedWorkflows().then(res => {
        if (res?.workflows && res.workflows.length > 0) {
          setLiveWorkflows(res.workflows.map(wf => ({
            title: wf.title,
            desc: wf.description,
            status: '• Active'
          })));
        } else {
          setLiveWorkflows([]);
        }
      }).catch(() => setLiveWorkflows([])).finally(() => setIsLoading(false));
    }
  }, [isDemoMode]);

  const demoWorkflows = [
    { title: 'Inbound Lead Qualification & HubSpot Sync', desc: 'When Sales Closer finishes call, create contact in HubSpot and update deal score.', status: '• Active' },
    { title: 'Customer Support Refund & Zoho Log', desc: 'When Support Genie approves refund, trigger Stripe refund and log ticket in Zoho.', status: '• Active' },
    { title: 'Appointment Booking & Google Calendar', desc: 'When Appointment Pro confirms slot, reserve Google Calendar event and email invite.', status: '• Active' },
  ];

  const workflows = isDemoMode ? demoWorkflows : liveWorkflows;

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>Autonomous Workflows</h1>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>
              {isDemoMode ? '3 Demo Recipes' : `${workflows.length} Active Recipes`}
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Define automated post-call trigger recipes across CRMs, email, and internal tools.</p>
        </div>

        <button style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', backgroundColor: '#1b5a92', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          + New Workflow Recipe
        </button>
      </div>

      {!isDemoMode && workflows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '36px' }}>⚡</span>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>No Autonomous Workflows Configured</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '440px', lineHeight: 1.5 }}>
            Your live workspace currently has no active automated workflows. Click &quot;+ New Workflow Recipe&quot; to connect post-call actions with your CRM and calendar.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {workflows.map((wf, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{wf.title}</h3>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>{wf.status}</span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{wf.desc}</p>
              <button style={{ marginTop: '0.5rem', padding: '0.45rem', borderRadius: '8px', border: '1px solid rgba(27,90,146,0.3)', backgroundColor: 'var(--bg-card)', color: '#1b5a92', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Edit Recipe</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
