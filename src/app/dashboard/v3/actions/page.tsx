'use client';

import React from 'react';
import { useDemoMode } from '@/contexts/DemoModeContext';

export default function V3ActionsPage() {
  const { isDemoMode } = useDemoMode();

  const demoDecisions = [
    { title: 'Approve $450 Refund for Order #12345 (Support Genie)', desc: 'Support Genie verified customer receipt. Requires admin approval to initiate Stripe refund.', agent: 'Support Genie', urgency: '🔴 High Priority' },
    { title: 'Send Custom Enterprise Proposal PDF to Acme Corp', desc: 'Sales Closer qualified lead ($50k ARR). Ready to email signed quote via DocuSign.', agent: 'Sales Closer', urgency: '🟡 Medium Priority' },
    { title: 'Override Appointment Conflict on May 22, 2025', desc: 'Appointment Pro detected double-booking slot in Google Calendar.', agent: 'Appointment Pro', urgency: '🟡 Medium Priority' },
  ];

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>Workspace Actions & Judgment Queue</h1>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#1b5a92', color: '#ffffff' }}>
              {isDemoMode ? '3 Pending Review' : '0 Pending'}
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Review high-value decisions that require explicit human approval before dispatching.</p>
        </div>
      </div>

      {!isDemoMode ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '36px' }}>✅</span>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>No Pending Actions</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '440px', lineHeight: 1.5 }}>
            Your live workspace has no decisions awaiting review. When your voice agents encounter high-value actions that need human approval, they will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {demoDecisions.map((dec, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(27,90,146,0.2)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{dec.urgency}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1b5a92' }}>• {dec.agent}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.3rem 0' }}>{dec.title}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>{dec.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Reject</button>
                <button style={{ padding: '0.5rem 1.1rem', borderRadius: '8px', border: 'none', backgroundColor: '#1b5a92', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Approve Action</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
