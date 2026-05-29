'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';
import Link from 'next/link';
import AdCarousel from '../../components/ui/AdCarousel';

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
  const [activities, setActivities] = useState<any[]>([]);
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
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      // Total leads
      const { count: totalLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      // Leads this month
      const { count: leadsThisMonth } = await supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth);
      // Leads last month
      const { count: leadsLastMonth } = await supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', startOfLastMonth).lte('created_at', endOfLastMonth);
      // Conversations
      const { count: totalConv } = await supabase.from('conversations').select('*', { count: 'exact', head: true });
      const { count: convThisMonth } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth);
      const { count: openConv } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'AI Active');
      const { count: resolvedConv } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'Resolved');
      // Converted leads
      const { count: convertedLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'converted');

      // 7-day daily lead trend
      const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
      const { data: recentLeads } = await supabase.from('leads').select('created_at').gte('created_at', sevenDaysAgo.toISOString());
      const leadsByDay = Array(7).fill(0);
      recentLeads?.forEach((l: any) => {
        const daysAgo = Math.floor((Date.now() - new Date(l.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo < 7) leadsByDay[6 - daysAgo]++;
      });

      // 7-day daily conversation trend
      const { data: recentConvs } = await supabase.from('conversations').select('created_at').gte('created_at', sevenDaysAgo.toISOString());
      const convsByDay = Array(7).fill(0);
      recentConvs?.forEach((c: any) => {
        const daysAgo = Math.floor((Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo < 7) convsByDay[6 - daysAgo]++;
      });

      const tLeads = totalLeads || 0;
      const tConverted = convertedLeads || 0;

      setMetrics({
        totalLeads: tLeads,
        leadsThisMonth: leadsThisMonth || 0,
        leadsLastMonth: leadsLastMonth || 0,
        totalConversations: totalConv || 0,
        convThisMonth: convThisMonth || 0,
        openConversations: openConv || 0,
        resolvedConversations: resolvedConv || 0,
        conversionRate: tLeads > 0 ? Math.round((tConverted / tLeads) * 100) : 0,
      });
      setLeadTrend(leadsByDay);
      setConvTrend(convsByDay);

      // Activities
      const { data: actData } = await supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(6);
      setActivities(actData || []);
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

      {/* Onboarding Checklist */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle at top right, rgba(21,190,83,0.05), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '15px', color: 'var(--stripe-navy)', margin: '0 0 0.35rem 0', fontWeight: 600 }}>Get Started</h3>
            <p style={{ color: 'var(--stripe-body)', fontSize: '13px', margin: 0 }}>1 of 6 complete</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1.75rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: '5px', flex: 1, backgroundColor: i === 0 ? '#15be53' : '#e3e8ee', borderRadius: '3px', boxShadow: i === 0 ? '0 0 8px rgba(21,190,83,0.4)' : 'none' }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {[
            { label: 'Connect a messaging channel', done: true, href: '/dashboard/integrations/channels' },
            { label: 'Configure your AI agent', done: false, href: '/dashboard/ai-agent' },
            { label: 'Add training data (FAQs, products...)', done: false, href: '/dashboard/ai-agent' },
            { label: 'Capture your first lead', done: false, href: '/dashboard/leads' },
            { label: 'Receive your first message', done: false, href: '/dashboard/chat' },
            { label: 'Start your 14-day free trial — no credit card required', done: false, href: '/dashboard/upgrade', isAction: true },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.5rem 0.75rem', borderRadius: '8px', margin: '0 -0.75rem', cursor: 'pointer' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: item.done ? '#15be53' : '#fff', border: item.done ? '1px solid #15be53' : '1.5px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4.5L3.5 7L9 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
                <span style={{ fontSize: '13px', color: item.isAction ? '#533afd' : item.done ? '#9ca3af' : '#1f2937', textDecoration: item.done ? 'line-through' : 'none', fontWeight: item.done ? 400 : 500 }}>{item.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.isAction ? '#533afd' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.5 }}><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Welcome */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 400, color: 'var(--stripe-navy)', margin: '0 0 0.25rem 0', letterSpacing: '-0.5px' }}>Is your business growing?</h1>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Real-time data from your leads, conversations, and AI agent activity.</p>
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
