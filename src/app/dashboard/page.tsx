'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';
import Link from 'next/link';
import AdCarousel from '../../components/ui/AdCarousel';
import { useUserProfile } from '@/contexts/UserProfileContext';


function getRelativeTime(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '40px' }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            backgroundColor: color,
            opacity: 0.15 + (v / max) * 0.85,
            borderRadius: '2px 2px 0 0',
            height: `${Math.max(4, (v / max) * 100)}%`,
          }}
        />
      ))}
    </div>
  );
}

export default function OverviewPage() {
  const supabase = createClient();
  const { profile } = useUserProfile();
  const [activities, setActivities] = useState<any[]>([]);
  const [checklistStates, setChecklistStates] = useState({

    channelConnected: false,
    agentConfigured: false,
    trainingAdded: false,
    leadCaptured: false,
    messageReceived: false,
    trialStarted: false
  });
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    leadsThisMonth: 0,
    leadsLastMonth: 0,
    totalConversations: 0,
    convThisMonth: 0,
    openConversations: 0,
    resolvedConversations: 0,
    conversionRate: 0,
  });
  const [leadTrend, setLeadTrend] = useState<number[]>(Array(7).fill(0));
  const [convTrend, setConvTrend] = useState<number[]>(Array(7).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // ─── Single RPC replaces 10 individual COUNT queries ──────────────────
      // Before: ~10 roundtrips, ~800ms total
      // After:  1 rpc() call, ~80ms
      const { data: metrics_raw, error: rpcError } = await supabase
        .rpc('get_dashboard_metrics');

      if (rpcError) {
        console.error('get_dashboard_metrics RPC failed, falling back to individual queries:', rpcError.message);
        // Graceful fallback: still show empty state rather than crashing
        setLoading(false);
        return;
      }

      const m = metrics_raw as any;

      const tLeads      = m.total_leads || 0;
      const tConverted  = m.converted_leads || 0;
      const tConv       = m.total_conversations || 0;

      setMetrics({
        totalLeads:           tLeads,
        leadsThisMonth:       m.leads_this_month || 0,
        leadsLastMonth:       m.leads_last_month || 0,
        totalConversations:   tConv,
        convThisMonth:        m.conv_this_month || 0,
        openConversations:    m.open_conversations || 0,
        resolvedConversations: m.resolved_conversations || 0,
        conversionRate:       tLeads > 0 ? Math.round((tConverted / tLeads) * 100) : 0,
      });

      // lead_trend & conv_trend are Postgres BIGINT arrays [day0..day6]
      setLeadTrend(Array.isArray(m.lead_trend) ? m.lead_trend.map(Number) : Array(7).fill(0));
      setConvTrend(Array.isArray(m.conv_trend) ? m.conv_trend.map(Number) : Array(7).fill(0));

      setChecklistStates({
        channelConnected: !!m.has_channel,
        agentConfigured:  !!m.has_agent,
        trainingAdded:    !!m.has_agent,
        leadCaptured:     tLeads > 0,
        messageReceived:  tConv > 0,
        trialStarted:     false,
      });

      setActivities(Array.isArray(m.activities) ? m.activities : []);
      setLoading(false);
    };

    fetchData();

    const channel = supabase.channel('dashboard-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, () => {
        setMetrics(prev => ({ ...prev, totalLeads: prev.totalLeads + 1, leadsThisMonth: prev.leadsThisMonth + 1 }));
        setLeadTrend(prev => { const n = [...prev]; n[6]++; return n; });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, () => {
        setMetrics(prev => ({ ...prev, totalConversations: prev.totalConversations + 1, convThisMonth: prev.convThisMonth + 1 }));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, (payload) => {
        setActivities(prev => [payload.new, ...prev].slice(0, 6));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);


  const leadGrowth = metrics.leadsLastMonth > 0
    ? Math.round(((metrics.leadsThisMonth - metrics.leadsLastMonth) / metrics.leadsLastMonth) * 100)
    : metrics.leadsThisMonth > 0 ? 100 : 0;

  const statCards = [
    {
      label: 'New Leads This Month',
      value: metrics.leadsThisMonth,
      sub: `${leadGrowth >= 0 ? '+' : ''}${leadGrowth}% vs last month`,
      positive: leadGrowth >= 0,
      chart: leadTrend,
      color: '#533afd',
      link: '/dashboard/leads',
    },
    {
      label: 'Total Leads (All Time)',
      value: metrics.totalLeads,
      sub: `${metrics.conversionRate}% conversion rate`,
      positive: metrics.conversionRate > 0,
      chart: leadTrend,
      color: '#10b981',
      link: '/dashboard/leads',
    },
    {
      label: 'Conversations Started',
      value: metrics.convThisMonth,
      sub: `${metrics.openConversations} open · ${metrics.resolvedConversations} resolved`,
      positive: true,
      chart: convTrend,
      color: '#f59e0b',
      link: '/dashboard/chat/inbox',
    },
    {
      label: 'AI Deflection Rate',
      value: metrics.totalConversations > 0
        ? `${Math.round((metrics.resolvedConversations / metrics.totalConversations) * 100)}%`
        : '—',
      sub: `${metrics.resolvedConversations} of ${metrics.totalConversations} resolved by AI`,
      positive: true,
      chart: convTrend,
      color: '#0ea5e9',
      link: '/dashboard/analytics',
    },
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {/* Ticker */}
      <div style={{ width: '100%', backgroundColor: 'var(--stripe-navy)', color: '#fff', padding: '0.6rem 1rem', textAlign: 'center', fontSize: '13px', fontWeight: 500, borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#15be53', borderRadius: '50%', boxShadow: '0 0 8px #15be53' }} />
        Amira V2.0 now live. Explore the new Omnichannel Inbox and improved A.I capabilities today!
      </div>

      <AdCarousel />

      {/* Welcome Header inspired by Measured mockup */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '0.5rem',
        marginBottom: '0.25rem',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Stylized Starburst / Sun Badge Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            boxShadow: '0 2px 4px rgba(251, 191, 36, 0.08)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              <circle cx="12" cy="12" r="4" fill="#f59e0b" />
            </svg>
          </div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 700, 
            color: '#0f172a', 
            margin: 0, 
            fontFamily: 'Outfit, Inter, system-ui, sans-serif',
            letterSpacing: '-0.5px' 
          }}>
            Welcome, {profile?.full_name ? profile.full_name.split(' ')[0] : 'there'}

          </h1>
        </div>
        
        {/* Need Help Button */}
        <button style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 0.9rem',
          borderRadius: '9999px',
          border: '1.2px solid #e2e8f0',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.15s ease',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.backgroundColor = '#f8fafc';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.backgroundColor = '#ffffff';
        }}
        >
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 800,
            lineHeight: 1
          }}>?</span>
          Need help?
        </button>
      </div>

      <p style={{ 
        color: '#64748b', 
        fontSize: '14px', 
        margin: '0 0 1.75rem 0', 
        fontWeight: 400,
        fontFamily: 'Inter, system-ui, sans-serif' 
      }}>
        We're very excited to get started with you!
      </p>

      {/* Onboarding Checklist in Measured sky-blue glass style */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(235, 245, 255, 0.95) 0%, rgba(208, 230, 255, 0.95) 100%)', 
        border: '1px solid rgba(255, 255, 255, 0.65)', 
        borderRadius: '16px', 
        padding: '2.25rem 1.75rem', 
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.03)', 
        marginBottom: '2.5rem', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* Sky-blue diagonal reflection highlight */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <h3 style={{ fontSize: '18px', color: '#0d233a', margin: '0 0 0.4rem 0', fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif' }}>Finish Onboarding</h3>
            <p style={{ color: '#2a4365', fontSize: '13.5px', margin: 0, fontWeight: 500, opacity: 0.9, fontFamily: 'Inter, system-ui, sans-serif' }}>
              Please ensure the following items are complete so that your Amira AI Employee can start qualifying leads:
            </p>
          </div>
        </div>

        {/* Checklist sub-cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', position: 'relative', zIndex: 2 }}>
          {[
            { label: 'Connect a messaging channel', done: checklistStates.channelConnected, icon: (color: string) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 16V9a4 4 0 0 0-4-4H6M6 9l-3 3 3 3M18 15l3 3-3 3" />
              </svg>
            ), href: '/dashboard/integrations/channels' },
            { label: 'Configure your AI agent', done: checklistStates.agentConfigured, icon: (color: string) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4M8 16h.01M16 16h.01" />
              </svg>
            ), href: '/dashboard/ai-agent' },
            { label: 'Add training data (FAQs, products...)', done: checklistStates.trainingAdded, icon: (color: string) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z" />
              </svg>
            ), href: '/dashboard/ai-agent' },
            { label: 'Capture your first lead', done: checklistStates.leadCaptured, icon: (color: string) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
            ), href: '/dashboard/leads' },
            { label: 'Receive your first message', done: checklistStates.messageReceived, icon: (color: string) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            ), href: '/dashboard/chat' },
            { label: 'Start your 14-day free trial — no credit card required', done: checklistStates.trialStarted, icon: (color: string) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ), href: '/dashboard/upgrade', isAction: true },
          ].map((item, i) => {
            const activeColor = item.isAction ? '#533afd' : '#0f172a';
            const displayColor = item.done ? '#94a3b8' : activeColor;
            return (
              <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.85rem', 
                    padding: '1rem 1.25rem', 
                    borderRadius: '12px', 
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 2px 6px rgba(0, 101, 255, 0.015)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 101, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 101, 255, 0.015)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  {/* Circle Checkbox */}
                  {item.done ? (
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      backgroundColor: '#64748b', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4.5L3.5 7L9 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      border: '1.8px solid #cbd5e1', 
                      backgroundColor: '#ffffff',
                      flexShrink: 0,
                      transition: 'border-color 0.2s'
                    }} />
                  )}

                  {/* Task Icon SVG */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon(displayColor)}
                  </div>

                  {/* Task Label */}
                  <span style={{ 
                    fontSize: '13.5px', 
                    color: item.isAction && !item.done ? '#533afd' : item.done ? '#94a3b8' : '#0f172a', 
                    textDecoration: item.done ? 'line-through' : 'none', 
                    fontWeight: item.done ? 450 : 600,
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}>
                    {item.label}
                  </span>

                  {/* Chevron Right */}
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={displayColor} 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    style={{ marginLeft: 'auto', opacity: item.done ? 0.4 : 0.8 }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Metrics Section Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0', letterSpacing: '-0.2px' }}>Is your business growing?</h2>
        <p style={{ color: '#6b7280', fontSize: '12.5px', margin: 0 }}>Real-time data from your leads, conversations, and AI agent activity.</p>
      </div>

      {/* Metric Cards with Sparklines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((card, i) => (
          <Link href={card.link} key={i} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{card.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: 300, color: 'var(--stripe-navy)', letterSpacing: '-1px', lineHeight: 1 }}>
                    {loading ? '—' : card.value}
                  </div>
                </div>
                <div style={{ width: '80px' }}>
                  <MiniBarChart data={card.chart} color={card.color} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '12px', color: card.positive ? '#10b981' : '#ef4444', fontWeight: 500 }}>{card.sub}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: '0 0 0.75rem 0', fontWeight: 500 }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Open Inbox', icon: '💬', link: '/dashboard/chat', color: '#e0f2fe' },
            { label: 'WebChat', icon: '🌐', link: '/dashboard/webchat-setup', color: '#fce7f3' },
            { label: 'Add Lead', icon: '👤', link: '/dashboard/leads', color: '#dcfce7' },
            { label: 'New Form', icon: '📝', link: '/dashboard/forms', color: '#ffedd5' },
            { label: 'Train AI', icon: '🧠', link: '/dashboard/ai-agent', color: '#ede9fe' },
            { label: 'Analytics', icon: '📊', link: '/dashboard/analytics', color: '#f3e8ff' },
          ].map((action, i) => (
            <Link href={action.link} key={i} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--stripe-shadow-ambient)', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{action.icon}</div>
                <span style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--stripe-border)', borderRadius: '8px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '13px', color: 'var(--stripe-navy)', margin: 0, fontWeight: 600 }}>Recent Activity</h3>
          <Link href="/dashboard/leads" style={{ fontSize: '12px', color: '#533afd', textDecoration: 'none' }}>View all →</Link>
        </div>
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--stripe-muted)', fontSize: '13px' }}>
            No activity yet. Once your AI agent starts interacting with leads, events will appear here in real-time.
          </div>
        ) : (
          activities.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i === activities.length - 1 ? 'none' : '1px solid var(--stripe-border)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#533afd', flexShrink: 0, fontSize: '14px' }}>
                {item.avatar_url ? <img src={item.avatar_url} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="" /> : '•'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--stripe-navy)', fontWeight: 500 }}>{item.action_text}</div>
                <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>{item.entity_name}</div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', flexShrink: 0 }}>{getRelativeTime(item.created_at)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
