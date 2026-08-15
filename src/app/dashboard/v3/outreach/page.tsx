'use client';

import React, { useState, useEffect } from 'react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import masterProspectsRaw from '@/data/master_us_prospects.json';

interface ProspectRecord {
  id: string;
  flag: string;
  company: string;
  type: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  hookUsed: string;
  hookCode: string;
  status: 'Live In Call' | 'Demo Booked' | 'Scheduled' | 'Follow-Up Queued' | 'Enterprise Closed' | 'Completed (No Answer)';
  callDuration?: string;
  sentiment?: string;
  emailSent: boolean;
  emailSubject?: string;
  emailBody?: string;
  notes?: string;
  cadenceStage?: string;
  retryAttempts?: number;
  maxRetries?: number;
  batchDay?: number;
  transcript?: { speaker: string; text: string; time: string }[];
}

const RICHMOND_OS_PROSPECTS: ProspectRecord[] = masterProspectsRaw as ProspectRecord[];

export default function AmiraOutreachTrackerPage() {
  const { isDemoMode } = useDemoMode();
  const [mounted, setMounted] = useState(false);
  const [prospects, setProspects] = useState<ProspectRecord[]>(RICHMOND_OS_PROSPECTS);
  const [selectedProspect, setSelectedProspect] = useState<ProspectRecord | null>(RICHMOND_OS_PROSPECTS[0]);
  const [activeModalType, setActiveModalType] = useState<'company' | 'reached' | 'live' | 'emails' | 'demos' | 'add' | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [liveCallTimer, setLiveCallTimer] = useState<number>(112); // 01:52

  const activeProspect = selectedProspect || prospects[0] || RICHMOND_OS_PROSPECTS[0];

  // New Company Form State
  const [newCompany, setNewCompany] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newHook, setNewHook] = useState('Observation Strategy');

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setLiveCallTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
        Loading Amira Outreach Center...
      </div>
    );
  }

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleOpenCompanyModal = (prospect: ProspectRecord) => {
    setSelectedProspect(prospect);
    setActiveModalType('company');
  };

  const handleDispatchCall = (prospect: ProspectRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProspect(prospect);
    setProspects(prev => prev.map(p => p.id === prospect.id ? { ...p, status: 'Live In Call', callDuration: '00:05' } : p));
    setActiveModalType('live');
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newContact || !newEmail) return;

    const created: ProspectRecord = {
      id: `outreach-new-${Date.now()}`,
      flag: '🌐',
      company: newCompany,
      type: 'Software & Technology Company',
      contactName: newContact,
      role: newRole || 'Decision Maker',
      email: newEmail,
      phone: newPhone || '+1 (415) 263-3600',
      hookUsed: newHook,
      hookCode: 'Hook 2',
      status: 'Scheduled',
      callDuration: 'Pending',
      sentiment: 'Queued',
      emailSent: true,
      emailSubject: 'Amira Voice AI — Free Setup Proposal',
      emailBody: `Hi ${newContact},\n\nAmira will be reaching out to set up your free 24/7 inbound phone assistant.`,
      notes: 'Added via Admin Outreach Panel.',
      transcript: []
    };

    setProspects([created, ...prospects]);
    setActiveModalType(null);
    setNewCompany('');
    setNewContact('');
    setNewRole('');
    setNewEmail('');
    setNewPhone('');
  };

  const filteredProspects = prospects.filter(p => {
    const matchesSearch = p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="v3-widget-animate delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: "'Satoshi', sans-serif" }}>
      
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Amira Customer Calls & Email Outreach
            </h1>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#10b98120', color: '#10b981', border: '1px solid #10b98140' }}>
              🔒 Admin View Only
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Track who Amira is calling, view conversation notes, check sent emails, and manage company demos.
          </p>
        </div>

        <button
          onClick={() => setActiveModalType('add')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          + Add Target Company
        </button>
      </div>

      {/* ── 4 CLICKABLE METRIC CARDS ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        
        {/* Card 1: Companies Reached */}
        <div
          onClick={() => setActiveModalType('reached')}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.25rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Companies</span>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>Click for list ➔</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0 0.2rem 0' }}>
            {prospects.length}
          </div>
          <span style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 700 }}>Verified US Target Companies</span>
        </div>

        {/* Card 2: Live Phone Call Status */}
        {(() => {
          const liveProspect = prospects.find(p => p.status === 'Live In Call');
          return (
            <div
              onClick={() => setActiveModalType('live')}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: `1px solid ${liveProspect ? '#10b98140' : 'var(--border-subtle)'}`,
                borderRadius: '14px',
                padding: '1.25rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Outbound Call Status</span>
                <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '99px', backgroundColor: liveProspect ? '#10b98120' : 'var(--bg-subtle)', color: liveProspect ? '#10b981' : 'var(--text-secondary)', border: `1px solid ${liveProspect ? '#10b98140' : 'var(--border-subtle)'}` }}>
                  {liveProspect ? '● LIVE IN CALL' : '● STANDBY'}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: liveProspect ? '#10b981' : 'var(--text-primary)', margin: '0.35rem 0 0.2rem 0' }}>
                {liveProspect ? `${liveProspect.contactName} (${liveProspect.company.split('(')[0].trim()})` : 'No Active Call in Progress'}
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {liveProspect ? (
                  <>Duration: <strong style={{ color: 'var(--text-primary)' }}>{formatTimer(liveCallTimer)}</strong> | Strategy: <strong style={{ color: '#10b981' }}>{liveProspect.hookCode}</strong></>
                ) : (
                  <>Engine Line: <strong style={{ color: '#10b981' }}>+1 (656) 218-8313</strong> | Ready for Dispatch</>
                )}
              </span>
            </div>
          );
        })()}

        {/* Card 3: In-Call Emails Sent */}
        <div
          onClick={() => setActiveModalType('emails')}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.25rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>In-Call Emails Sent</span>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>View emails ➔</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0 0.2rem 0' }}>
            {prospects.filter(p => p.emailSent).length}
          </div>
          <span style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 700 }}>✓ Live Dispatched Proposal</span>
        </div>

        {/* Card 4: Free Demos Booked */}
        <div
          onClick={() => setActiveModalType('demos')}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.25rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Free Demos Booked</span>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>View calendar ➔</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '0.35rem 0 0.2rem 0' }}>
            {prospects.filter(p => p.status === 'Demo Booked' || p.status === 'Enterprise Closed').length}
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>0 Booked (Awaiting Live Calls)</span>
        </div>
      </div>

      {/* ── LIVE CALL AUDIO MONITOR BANNER (Only active when Live In Call) ───── */}
      {activeProspect.status === 'Live In Call' ? (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid #10b98130', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#10b98115', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '1px solid #10b98140' }}>
                🎙️
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Amira Live Outreach Call — {activeProspect.contactName} ({activeProspect.company.split('(')[0].trim()})
                  </h3>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', backgroundColor: '#10b98115', color: '#10b981' }}>
                    ● LIVE IN CALL
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                  Strategy: <strong>{activeProspect.hookUsed}</strong> | Voice: <strong>[ElevenLabs] Rachel</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                onClick={() => alert(`Live proposal email sent to ${activeProspect.email}!`)}
                style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid #10b98140', backgroundColor: '#10b98115', color: '#10b981', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                ✉ Send Live Email Demo
              </button>
              <button
                onClick={() => handleOpenCompanyModal(activeProspect)}
                style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                📄 View Full Call Log & Notes
              </button>
            </div>
          </div>

          {/* Audio Wavebar */}
          <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              <span style={{ color: '#10b981', fontWeight: 800 }}>● Live Stream Audio:</span>
              <span>{activeProspect.phone}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '20px' }}>
              {[14, 22, 10, 28, 18, 32, 16, 24, 12, 30, 20, 14, 26, 18, 10].map((h, i) => (
                <div key={i} style={{ width: '3px', height: `${h}px`, backgroundColor: '#10b981', borderRadius: '2px', opacity: 0.8 }} />
              ))}
            </div>

            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatTimer(liveCallTimer)}
            </div>
          </div>
        </div>
      ) : (
        /* Quiet Standby Control Bar */
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#10b98110', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '1px solid #10b98130' }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Amira Outbound Call Dispatch Engine
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Status: <strong style={{ color: '#10b981' }}>Ready for Outbound Dispatch</strong> | Originating Line: <strong>+1 (656) 218-8313</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => handleDispatchCall(activeProspect)}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              📞 Dispatch Call to {activeProspect.contactName}
            </button>
          </div>
        </div>
      )}

      {/* ── PIPELINE TABLE ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Search companies, contacts, or emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                width: '280px'
              }}
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Call Statuses</option>
              <option value="Live In Call">Live In Call</option>
              <option value="Demo Booked">Demo Booked</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Follow-Up Queued">Follow-Up Queued</option>
              <option value="Enterprise Closed">Enterprise Closed</option>
            </select>
          </div>

          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing <strong>{filteredProspects.length}</strong> target companies (Click any row for details)
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Target Company</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Contact Person & Role</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Phone & Email</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Phone Call Strategy</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Call Status</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Follow-Up Email</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProspects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => handleOpenCompanyModal(p)}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '0.9rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '16px' }}>{p.flag}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.company}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.type}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '0.9rem 0.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.contactName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{p.role}</div>
                  </td>

                  <td style={{ padding: '0.9rem 0.5rem' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{p.phone}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{p.email}</div>
                  </td>

                  <td style={{ padding: '0.9rem 0.5rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#10b98115', color: '#10b981' }}>
                      {p.hookCode}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.hookUsed}
                    </div>
                  </td>

                  <td style={{ padding: '0.9rem 0.5rem' }}>
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: '99px',
                      backgroundColor: p.status === 'Live In Call' ? '#10b98120' : p.status === 'Demo Booked' ? '#10b98120' : p.status === 'Enterprise Closed' ? '#10b98125' : '#f59e0b20',
                      color: p.status === 'Live In Call' ? '#10b981' : p.status === 'Demo Booked' ? '#10b981' : p.status === 'Enterprise Closed' ? '#10b981' : '#f59e0b'
                    }}>
                      {p.status}
                    </span>
                  </td>

                  <td style={{ padding: '0.9rem 0.5rem' }}>
                    {p.emailSent ? (
                      <span style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 700 }}>✓ Proposal Sent</span>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>⏳ Pending Call</span>
                    )}
                  </td>

                  <td style={{ padding: '0.9rem 0.5rem', textAlign: 'right' }}>
                    <button
                      onClick={(e) => handleDispatchCall(p, e)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      📞 Call Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RIGHT SLIDE-OVER SIDE BAR DRAWER FOR MODALS ──────────────────────── */}
      {activeModalType && (
        <div
          onClick={() => setActiveModalType(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 999
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '520px',
              maxWidth: '92vw',
              height: '100vh',
              backgroundColor: 'var(--bg-card)',
              borderLeft: '1px solid var(--border-subtle)',
              padding: '1.75rem',
              boxShadow: '-12px 0 35px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              overflowY: 'auto'
            }}
          >
            {/* ── DRAWER CONTENT 1: COMPANY DETAILS ───────────────────────── */}
            {activeModalType === 'company' && selectedProspect && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '22px' }}>{selectedProspect.flag}</span>
                    <div>
                      <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {selectedProspect.company}
                      </h2>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedProspect.type}</span>
                    </div>
                  </div>
                  <button onClick={() => setActiveModalType(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Contact Person</span>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedProspect.contactName} ({selectedProspect.role})</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Phone & Email</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>{selectedProspect.phone}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{selectedProspect.email}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Cold Call Strategy</span>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedProspect.hookUsed}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Call Status & Sentiment</span>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#10b981' }}>{selectedProspect.status}</div>
                  </div>
                </div>

                {/* Sent Email Preview */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', marginBottom: '0.4rem' }}>
                    {selectedProspect.status === 'Completed (No Answer)' ? '✉ Missed Call Follow-Up Email' : '✉ Sent Proposal Email (In-Call Demo)'}
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Subject: {selectedProspect.status === 'Completed (No Answer)' ? `Amira Voice AI — Missed Call Follow-Up for ${selectedProspect.contactName}` : selectedProspect.emailSubject}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                    {selectedProspect.status === 'Completed (No Answer)' 
                      ? `Hi ${selectedProspect.contactName},\n\nI tried reaching your desk at ${selectedProspect.company.split('(')[0].trim()} today regarding 24/7 inbound phone coverage for your team. I will attempt a follow-up call tomorrow at 2:00 PM PST.\n\nBest,\nAmira Executive Ambassador`
                      : selectedProspect.emailBody}
                  </p>
                </div>

                {/* Transcript */}
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                    💬 Conversation Transcript Log
                  </h4>
                  {selectedProspect.transcript && selectedProspect.transcript.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedProspect.transcript.map((t, idx) => (
                        <div key={idx} style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', backgroundColor: t.speaker.includes('Amira') ? 'rgba(16,185,129,0.08)' : 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <strong style={{ color: t.speaker.includes('Amira') ? '#10b981' : 'var(--text-primary)' }}>{t.speaker}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.time}</span>
                          </div>
                          <div style={{ color: 'var(--text-primary)' }}>"{t.text}"</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      Call is queued for dispatch. Transcript will populate live once call connects.
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: 'auto' }}>
                  <button onClick={() => setActiveModalType(null)} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', cursor: 'pointer' }}>Close</button>
                  <button onClick={() => handleDispatchCall(selectedProspect)} style={{ padding: '0.55rem 1.2rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>📞 Call Company Now</button>
                </div>
              </>
            )}

            {/* ── DRAWER CONTENT 2: REACHED DIRECTORY ─────────────────────── */}
            {activeModalType === 'reached' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Target Companies ({prospects.length} Total)
                  </h3>
                  <button onClick={() => setActiveModalType(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {prospects.map((p) => (
                    <div key={p.id} onClick={() => handleOpenCompanyModal(p)} style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '18px' }}>{p.flag}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{p.company}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Contact: {p.contactName} ({p.role})</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>View Details ➔</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── DRAWER CONTENT 3: EMAILS DISPATCHED ─────────────────────── */}
            {activeModalType === 'emails' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Dispatched Proposals ({prospects.filter(p => p.emailSent).length} Total)
                  </h3>
                  <button onClick={() => setActiveModalType(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {prospects.filter(p => p.emailSent).length > 0 ? (
                    prospects.filter(p => p.emailSent).map((p) => (
                      <div key={p.id} style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>To: {p.email} ({p.company.split('(')[0].trim()})</strong>
                          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>✓ Delivered</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>Subject: {p.emailSubject}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      No in-call proposal emails dispatched yet today. Emails are automatically delivered live during active calls.
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── DRAWER CONTENT 4: DEMOS BOOKED ──────────────────────────── */}
            {activeModalType === 'demos' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Booked Demos ({prospects.filter(p => p.status === 'Demo Booked' || p.status === 'Enterprise Closed').length} Total)
                  </h3>
                  <button onClick={() => setActiveModalType(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {prospects.filter(p => p.status === 'Demo Booked' || p.status === 'Enterprise Closed').length > 0 ? (
                    prospects.filter(p => p.status === 'Demo Booked' || p.status === 'Enterprise Closed').map((p) => (
                      <div key={p.id} style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid #10b98140', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>{p.company}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Contact: {p.contactName} ({p.email})</div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#10b98120', color: '#10b981' }}>
                          🗓️ Executive Demo Confirmed
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      0 Booked Demos currently. As live calls are dispatched today, confirmed demos will populate here in real time.
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── DRAWER CONTENT 5: ADD COMPANY ───────────────────────────── */}
            {activeModalType === 'add' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Add Target Company</h3>
                  <button onClick={() => setActiveModalType(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>

                <form onSubmit={handleAddCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Software Corp"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', marginTop: '0.25rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Contact Person Name & Role</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <input
                        type="text"
                        required
                        placeholder="Contact Name"
                        value={newContact}
                        onChange={(e) => setNewContact(e.target.value)}
                        style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                      <input
                        type="text"
                        placeholder="Role (e.g. VP Sales)"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Email & Phone Number</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <input
                        type="email"
                        required
                        placeholder="contact@company.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                      <input
                        type="text"
                        placeholder="+1 (415) 263-3600"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Phone Call Strategy</label>
                    <select
                      value={newHook}
                      onChange={(e) => setNewHook(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)', fontSize: '13px', marginTop: '0.25rem', cursor: 'pointer' }}
                    >
                      <option value="Observation Strategy">Observation Strategy (Hook 2)</option>
                      <option value="Permission + Curiosity Strategy">Permission + Curiosity Strategy (Hook 1)</option>
                      <option value="Problem Strategy">Problem Strategy (Hook 3)</option>
                      <option value="Specific Outcome Strategy">Specific Outcome Strategy (Hook 8)</option>
                      <option value="Direct Strategy">Direct Strategy (Hook 10)</option>
                      <option value="Why You? Strategy">Why You? Strategy (Hook 12)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setActiveModalType(null)} style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '12.5px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '0.55rem 1.2rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>+ Add Company</button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
