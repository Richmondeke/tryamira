'use client';

import { useState } from 'react';

const TODAY_ITEMS = [
  { time: '9:42 AM', title: 'Onboard Acme Corp', dept: 'Customer Success', category: 'Completed', desc: 'CRM record created, welcome email sent, Notion workspace set up.', icon: '✅', color: '#10b981' },
  { time: '10:05 AM', title: 'Weekly Executive Report', dept: 'Executive', category: 'Completed', desc: 'Synthesized sales, product, and financial KPIs into executive summary.', icon: '✅', color: '#10b981' },
  { time: '11:15 AM', title: 'Stripe Invoice Collection', dept: 'Finance', category: 'Completed', desc: 'Auto-verified $12,500 deposit for Superace renewal.', icon: '✅', color: '#10b981' },
  { time: '1:30 PM', title: 'Prepare Board Deck Q3', dept: 'Executive', category: 'Current', desc: 'Amira is pulling financial metrics from QuickBooks & HubSpot.', icon: '⚡', color: '#1b5a92' },
  { time: '2:15 PM', title: 'Screen Engineering Candidates', dept: 'HR', category: 'Current', desc: 'Parsing candidate resumes & checking interview availability.', icon: '⚡', color: '#1b5a92' },
  { time: '3:00 PM', title: 'AWS Invoice Exceeds Threshold', dept: 'Finance', category: 'Blocked', desc: 'Awaiting your approval on $8,750 payment decision card.', icon: '⚠️', color: '#ef4444' },
  { time: '4:30 PM', title: 'Deploy Feature v2.4 to Staging', dept: 'Engineering', category: 'Upcoming', desc: 'Automated test suite & changelog summary queued.', icon: '🕒', color: '#f59e0b' },
  { time: '5:00 PM', title: 'Send Customer Renewal Reminders', dept: 'Sales', category: 'Upcoming', desc: '3 contracts expiring in 30 days queued for personalized follow-up.', icon: '🕒', color: '#f59e0b' },
];

export default function TodayPage() {
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Current' | 'Blocked' | 'Upcoming'>('All');

  const filtered = filter === 'All' ? TODAY_ITEMS : TODAY_ITEMS.filter(i => i.category === filter);

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>

      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '24px' }}>📅</span>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Today's Timeline
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
          Real-time execution feed across all your connected tools and workflows.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {(['All', 'Completed', 'Current', 'Blocked', 'Upcoming'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '99px',
              fontSize: '13px',
              fontWeight: filter === cat ? 700 : 500,
              backgroundColor: filter === cat ? '#1b5a92' : '#ffffff',
              color: filter === cat ? '#ffffff' : 'var(--text-secondary)',
              border: filter === cat ? '1px solid #1b5a92' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((item, idx) => (
          <div key={idx} style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.25rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: `${item.color}15`,
              color: item.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0,
            }}>
              {item.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {item.title}
                  </h3>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '99px', backgroundColor: '#f1f3fa', color: 'var(--text-secondary)' }}>
                    {item.dept}
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)' }}>{item.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
