'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlowIcon } from '@/components/ui/GlowIcon';

// Helper component for animated soundwave bars
function LiveWaveform({ color = '#1b5a92', isSmall = false }: { color?: string; isSmall?: boolean }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2.5px', height: isSmall ? '14px' : '20px' }}>
      {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((heightRatio, i) => (
        <span
          key={i}
          style={{
            width: isSmall ? '2px' : '3px',
            height: `${heightRatio * 100}%`,
            backgroundColor: color,
            borderRadius: '99px',
            animation: `wavePulse ${0.8 + (i % 3) * 0.3}s ease-in-out infinite alternate`
          }}
        />
      ))}
      <style>{`
        @keyframes wavePulse {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.1); }
        }
      `}</style>
    </div>
  );
}

// Mini SVG Sparkline Component for KPI Cards
function MiniSparkline({ color = '#10b981' }: { color?: string }) {
  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
      <path
        d="M2 18 C 12 12, 20 20, 30 10 C 40 4, 50 14, 58 4"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

import { useDemoMode } from '@/contexts/DemoModeContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { getVapiCalls, getVapiAssistants, getVapiPhoneNumbers } from '@/app/actions/vapi';
import NotificationDrawer from '@/components/ui/NotificationDrawer';

export default function V3DashboardPage() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { profile } = useUserProfile();
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Live VAPI API state when Demo Mode is OFF
  const [liveVapiCalls, setLiveVapiCalls] = useState<any[]>([]);
  const [liveVapiAssistants, setLiveVapiAssistants] = useState<any[]>([]);
  const [liveVapiNumbers, setLiveVapiNumbers] = useState<any[]>([]);
  const [isLoadingVapi, setIsLoadingVapi] = useState(false);

  React.useEffect(() => {
    if (!isDemoMode) {
      setIsLoadingVapi(true);
      Promise.all([
        getVapiCalls(),
        getVapiAssistants(),
        getVapiPhoneNumbers()
      ]).then(([calls, assistants, numbers]) => {
        setLiveVapiCalls(Array.isArray(calls) ? calls : []);
        setLiveVapiAssistants(Array.isArray(assistants) ? assistants : []);
        setLiveVapiNumbers(Array.isArray(numbers) ? numbers : []);
      }).catch(() => {
        setLiveVapiCalls([]);
        setLiveVapiAssistants([]);
        setLiveVapiNumbers([]);
      }).finally(() => setIsLoadingVapi(false));
    }
  }, [isDemoMode]);

  const getCallDurationSeconds = (c: any): number => {
    if (typeof c.durationSeconds === 'number' && c.durationSeconds > 0) return c.durationSeconds;
    if (typeof c.duration === 'number' && c.duration > 0) return c.duration;
    if (typeof c.costBreakdown?.duration === 'number' && c.costBreakdown.duration > 0) return c.costBreakdown.duration;
    if (c.startedAt && c.endedAt) {
      const start = new Date(c.startedAt).getTime();
      const end = new Date(c.endedAt).getTime();
      if (!isNaN(start) && !isNaN(end) && end > start) {
        return Math.round((end - start) / 1000);
      }
    }
    return 0;
  };

  const totalCallsCount = isDemoMode ? '32,842' : (liveVapiCalls.length > 0 ? liveVapiCalls.length.toLocaleString() : '0');
  const totalSecondsSum = liveVapiCalls.reduce((acc: number, c: any) => acc + getCallDurationSeconds(c), 0);
  const calculatedMinutes = Math.max(1, Math.round(totalSecondsSum / 60));
  const totalMinutesCount = isDemoMode ? '18,276' : (liveVapiCalls.length > 0 ? calculatedMinutes.toLocaleString() : '0');
  const activeAgentsCount = isDemoMode ? '24' : (liveVapiAssistants.length > 0 ? liveVapiAssistants.length.toString() : '0');
  const countriesCount = isDemoMode ? '102' : (liveVapiNumbers.length > 0 ? liveVapiNumbers.length.toString() : '1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1440px', margin: '0 auto' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-28px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .v3-widget-animate {
          animation: slideInLeft 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-1 { animation-delay: 0.04s; }
        .delay-2 { animation-delay: 0.10s; }
        .delay-3 { animation-delay: 0.16s; }
        .delay-4 { animation-delay: 0.22s; }
        .delay-5 { animation-delay: 0.28s; }
      `}} />

      {/* ── TOP HEADER ────────────────────────────────────────────────────── */}
      <div className="v3-widget-animate delay-1" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Welcome Text */}
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 650, color: 'var(--text-primary)', margin: '0 0 0.2rem 0' }}>
            Welcome back, {profile?.full_name ? profile.full_name.split(' ')[0] : 'there'} 👋
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
            Manage your Call center operations in real time.
          </p>
        </div>

        {/* Header Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          
          {/* Live vs Demo Mode Toggle */}
          <button
            type="button"
            onClick={toggleDemoMode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              border: isDemoMode ? '1px solid #f59e0b' : '1px solid #10b981',
              backgroundColor: isDemoMode ? '#fffbeb' : '#ecfdf5',
              color: isDemoMode ? '#b45309' : '#047857',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
            title="Click to toggle between real workspace data and populated demo data"
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isDemoMode ? '#f59e0b' : '#10b981',
              boxShadow: isDemoMode ? '0 0 6px #f59e0b' : '0 0 6px #10b981'
            }} />
            <span>{isDemoMode ? 'Demo Data' : 'Live Data'}</span>
          </button>
          
          {/* Global Selector */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              style={{
                padding: '0.5rem 2.2rem 0.5rem 2.2rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-card)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
              }}
            >
              <option value="Global">🌐 Global</option>
              <option value="Nigeria">🇳🇬 Nigeria</option>
              <option value="United States">🇺🇸 United States</option>
              <option value="United Kingdom">🇬🇧 United Kingdom</option>
              <option value="India">🇮🇳 India</option>
              <option value="Brazil">🇧🇷 Brazil</option>
            </select>
            <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', pointerEvents: 'none', color: '#94a3b8' }}>
              ▼
            </span>
          </div>

          {/* Notification Button */}
          <button
            type="button"
            onClick={() => setShowNotificationModal(true)}
            style={{
              position: 'relative',
              width: '38px', height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '16px' }}>🔔</span>
            <span style={{
              position: 'absolute', top: '5px', right: '5px',
              width: '15px', height: '15px', borderRadius: '50%',
              backgroundColor: '#1b5a92', color: '#ffffff',
              fontSize: '10px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              3
            </span>
          </button>

          {/* Primary CTA Button */}
          <Link
            href="/dashboard/v3/agents"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#1b5a92',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'transform 0.15s ease'
            }}
          >
            + Create Agent
          </Link>
        </div>
      </div>

      {/* ── ANNOUNCEMENT BANNER ───────────────────────────────────────────── */}
      <div className="v3-widget-animate delay-1" style={{
        background: '#1b5a92 url(/amira-background.png) center/cover no-repeat',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        boxShadow: '0 10px 30px rgba(27, 90, 146, 0.25)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        gap: '2rem',
        minHeight: '160px'
      }}>
        {/* Left Side: Announcement Text & CTA */}
        <div style={{ flex: 1, zIndex: 2, paddingRight: '120px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Supercharge Your Call Center Operations with Amira 3.0
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', margin: '0.5rem 0 1.25rem 0', maxWidth: '600px', lineHeight: 1.5 }}>
            Deploy autonomous AI voice agents, manage global phone lines, and automate omnichannel customer conversations in real time.
          </p>
          <Link href="/dashboard/v3/outreach" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '0.65rem 1.35rem',
            borderRadius: '10px',
            fontSize: '13.5px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s ease'
          }}>
            Create AI Voice Agent →
          </Link>
        </div>

        {/* Right Side: Larger Tilted Amirahead Image bleeding outside top & bottom */}
        <img 
          src="/amira-head.png" 
          alt="Amira Head Mascot" 
          style={{ 
            height: '210px', 
            width: 'auto', 
            objectFit: 'contain', 
            position: 'absolute',
            right: '-10px',
            bottom: '-25px',
            transform: 'rotate(-10deg)',
            filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.35))',
            pointerEvents: 'none',
            zIndex: 3
          }} 
        />
      </div>

      {/* ── KPI OVERVIEW CARDS (4 CARDS) ─────────────────────────────────── */}
      <div className="v3-widget-animate delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* KPI 1: Total Calls */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.35rem' }}>Total Calls</div>
            <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {totalCallsCount}
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1b5a9212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowIcon name="phone-outline" size={20} color="#1b5a92" />
          </div>
        </div>

        {/* KPI 2: Minutes Used */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.35rem' }}>Minutes Used</div>
            <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {totalMinutesCount}
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#10b98112', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowIcon name="clock-outline" size={20} color="#10b981" />
          </div>
        </div>

        {/* KPI 3: Active Agents */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.35rem' }}>Active Agents</div>
            <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {activeAgentsCount}
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#3b82f612', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowIcon name="headphones-outline" size={20} color="#3b82f6" />
          </div>
        </div>

        {/* KPI 4: Countries Covered */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.35rem' }}>Countries Covered</div>
            <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {countriesCount}
            </div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#1b5a9212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GlowIcon name="compass-outline" size={20} color="#1b5a92" />
          </div>
        </div>

      </div>

      {/* ── HERO OPERATIONS ROW: ACTIVE AGENTS + LIVE ACTIVITY (2 COLS) ───── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* HERO MAIN WIDGET: ACTIVE AGENTS */}
        <div className="v3-widget-animate delay-3" style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Active Agents</h2>
                <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '99px', backgroundColor: '#1b5a9215', color: '#1b5a92' }}>
                  {isDemoMode ? '• 24 Live' : `• ${liveVapiAssistants.length} Active`}
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                AI agents handling calls and taking actions in real time
              </p>
            </div>

            <Link href="/dashboard/v3/agents" style={{ fontSize: '12.5px', fontWeight: 500, color: '#1b5a92', textDecoration: 'none' }}>
              View all agents →
            </Link>
          </div>

          {/* Agent Rows List or Empty State */}
          {!isDemoMode && liveVapiAssistants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', border: '1px dashed var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/amira-head.png" alt="Amira Head" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>No Active Agents Running in Live Mode</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
                Your live workspace currently has 0 active voice workers. Deploy your first agent to start handling inbound and outbound calls.
              </p>
              <Link href="/dashboard/v3/agents" style={{ marginTop: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '10px', backgroundColor: '#1b5a92', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                + Deploy Voice Agent
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {(!isDemoMode && liveVapiAssistants.length > 0 ? liveVapiAssistants : [
                { id: '1', name: 'Sales Closer', role: 'Outbound Sales', phone: '🇺🇸 +1 (415) 555-0198', action: 'Qualifying lead' },
                { id: '2', name: 'Customer Support Genie', role: 'Inbound Support', phone: '🇬🇧 +44 20 7946 0912', action: 'Answering FAQ' },
                { id: '3', name: 'Appointment Scheduler', role: 'Calendar Booking', phone: '🇨🇦 +1 (416) 555-0143', action: 'Booking Demo' }
              ]).map((agent: any, idx: number) => (
                <div key={agent.id || idx} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1.3fr 0.9fr 1.2fr 1.4fr auto',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {/* Agent Identity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#1b5a92', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <GlowIcon name="headphones-outline" size={20} color="#ffffff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {agent.name || `Voice Agent ${idx + 1}`}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {agent.model?.model || agent.role || 'Voice Assistant'}
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 500, color: '#10b981' }}>🟢 Active</span>
                    </div>
                  </div>

                  {/* Voice / Provider */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>Voice Engine</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {agent.voice?.provider || 'ElevenLabs'} ({agent.voice?.voiceId || 'Rachel'})
                    </div>
                  </div>

                  {/* Activity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LiveWaveform color="#1b5a92" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Ready</span>
                  </div>

                  {/* Greeting / Action */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>Greeting / Prompt</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                      {agent.firstMessage || agent.action || 'Ready for inbound / outbound calls'}
                    </div>
                  </div>

                  {/* Configure */}
                  <Link href={`/dashboard/v3/agents?id=${agent.id}`} style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)', fontSize: '11.5px', color: '#1b5a92', textDecoration: 'none', fontWeight: 600 }}>
                    Configure →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LIVE ACTIVITY SIDE FEED */}
        <div className="v3-widget-animate delay-4" style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>Live Activity</h3>
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px', backgroundColor: isDemoMode ? '#10b98115' : 'var(--bg-subtle)', color: isDemoMode ? '#10b981' : 'var(--text-secondary)' }}>
              {isDemoMode ? '• Live' : '• 0 Streams'}
            </span>
          </div>

          {!isDemoMode ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
              📡 No live call streams active right now.
            </div>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { flag: '🇺🇸', num: '+1 (415) 555-0198', agent: 'Sales Closer', time: '00:01:23', color: '#1b5a92' },
              { flag: '🇮🇳', num: '+91 80 1234 5678', agent: 'Support Genie', time: '00:00:58', color: '#3b82f6' },
              { flag: '🇬🇧', num: '+44 20 7946 0958', agent: 'Appointment Pro', time: '00:02:10', color: '#f97316' },
              { flag: '🇳🇬', num: '+234 812 345 6789', agent: 'Onboarding Buddy', time: '00:01:05', color: '#10b981' },
              { flag: '🇧🇷', num: '+55 11 99999-9999', agent: 'Retention Expert', time: '00:00:47', color: '#ec4899' },
            ].map((call, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '18px' }}>{call.flag}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{call.num}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{call.agent}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LiveWaveform color={call.color} isSmall />
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>{call.time}</span>
                </div>
              </div>
            ))}
          </div>
          )}

          <Link href="/dashboard/v3/calls" style={{ fontSize: '12px', fontWeight: 600, color: '#1b5a92', textDecoration: 'none', textAlign: 'center', marginTop: '0.25rem' }}>
            View all live calls →
          </Link>
        </div>

      </div>

      {/* ── PERFORMANCE & INTEGRATION ROW (3 BOTTOM COLUMNS) ───────────────── */}
      <div className="v3-widget-animate delay-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* WIDGET 1: TOP AGENTS */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>Top Agents</h3>
            <Link href="/dashboard/v3/agents" style={{ fontSize: '12px', fontWeight: 600, color: '#1b5a92', textDecoration: 'none' }}>
              View all agents →
            </Link>
          </div>

          {!isDemoMode ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
              📊 No agent call stats recorded in live mode yet.
            </div>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Sales Closer', calls: '4,572', rate: '92.4%', trend: '↑ 12.4%', color: '#1b5a92' },
              { name: 'Support Genie', calls: '3,912', rate: '89.1%', trend: '↑ 8.7%', color: '#3b82f6' },
              { name: 'Appointment Pro', calls: '2,784', rate: '94.3%', trend: '↑ 14.6%', color: '#f97316' },
              { name: 'Onboarding Buddy', calls: '2,113', rate: '88.7%', trend: '↑ 7.1%', color: '#10b981' },
              { name: 'Retention Expert', calls: '1,902', rate: '91.0%', trend: '↑ 9.3%', color: '#ec4899' },
            ].map(ag => (
              <div key={ag.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '130px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: ag.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlowIcon name="headphones-outline" size={14} color="#ffffff" />
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ag.name}</span>
                </div>

                <span style={{ color: 'var(--text-secondary)' }}>{ag.calls} calls</span>

                <div style={{ width: '70px', backgroundColor: 'var(--bg-subtle)', height: '6px', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: ag.rate, height: '100%', backgroundColor: '#10b981' }} />
                </div>

                <span style={{ fontWeight: 600, color: '#10b981' }}>{ag.trend}</span>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* WIDGET 2: RECENT CALLS */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>Recent Calls</h3>
            <Link href="/dashboard/v3/calls" style={{ fontSize: '12px', fontWeight: 600, color: '#1b5a92', textDecoration: 'none' }}>
              View all calls →
            </Link>
          </div>

          {!isDemoMode ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
              📞 No call logs recorded in live database.
            </div>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { flag: '🇺🇸', num: '+1 (415) 555-0198', agent: 'Sales Closer', status: 'Completed', statusBg: '#10b98115', statusColor: '#10b981', duration: '03:24', time: 'Just now' },
              { flag: '🇮🇳', num: '+91 80 1234 5678', agent: 'Support Genie', status: 'Completed', statusBg: '#10b98115', statusColor: '#10b981', duration: '05:32', time: '5m ago' },
              { flag: '🇬🇧', num: '+44 20 7946 0958', agent: 'Appointment Pro', status: 'Completed', statusBg: '#10b98115', statusColor: '#10b981', duration: '02:18', time: '15m ago' },
              { flag: '🇳🇬', num: '+234 812 345 6789', agent: 'Onboarding Buddy', status: 'Completed', statusBg: '#10b98115', statusColor: '#10b981', duration: '04:11', time: '18m ago' },
              { flag: '🇧🇷', num: '+55 11 99999-9999', agent: 'Retention Expert', status: 'Missed', statusBg: '#ef444415', statusColor: '#ef4444', duration: '--', time: '45m ago' },
            ].map((call, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{call.flag}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{call.num}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{call.agent}</div>
                  </div>
                </div>

                <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', backgroundColor: call.statusBg, color: call.statusColor }}>
                  {call.status}
                </span>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{call.duration}</div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>{call.time}</div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* WIDGET 3: CONNECTED INTEGRATIONS */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 650, color: 'var(--text-primary)', margin: 0 }}>Connected Integrations</h3>
            <Link href="/dashboard/v3/integrations" style={{ fontSize: '12px', fontWeight: 600, color: '#1b5a92', textDecoration: 'none' }}>
              Manage all →
            </Link>
          </div>

          {/* Grid of Apps with Real Logos & Active Connection Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
            {[
              { name: 'HubSpot', slug: 'hubspot', status: 'Active' },
              { name: 'Salesforce', slug: 'salesforce', status: 'Active' },
              { name: 'Zoho CRM', slug: 'zohocrm', status: 'Active' },
              { name: 'Slack', slug: 'slack', status: 'Active' },
              { name: 'Google Sheets', slug: 'googlesheets', status: 'Active' },
              { name: 'Notion', slug: 'notion', status: 'Active' },
              { name: 'Calendly', slug: 'calendly', status: 'Active' },
              { name: '100+ More', slug: 'github', status: 'Explore' },
            ].map(app => (
              <Link
                key={app.name}
                href="/dashboard/v3/integrations"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.85rem 0.6rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.35rem'
                }}>
                  <img
                    src={`https://logos.composio.dev/api/${app.slug}`}
                    alt={app.name}
                    style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                  />
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{app.name}</span>
                {app.status !== 'Active' && (
                  <span style={{
                    fontSize: '9.5px', fontWeight: 600, marginTop: '2px',
                    color: '#1b5a92'
                  }}>
                    Connect
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Notifications Right Sidebar Drawer */}
      <NotificationDrawer
        open={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        workspaceId={profile?.workspace_id || undefined}
      />

    </div>
  );
}
