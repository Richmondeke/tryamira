'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';

// Helper to format timestamps to relative time (e.g. "10 mins ago")
function getRelativeTime(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function OverviewPage() {
  const supabase = createClient();
  const [activities, setActivities] = useState<any[]>([
    // Fallback data while loading or if DB fails
    { action_text: 'New lead captured', entity_name: 'John Doe', created_at: new Date(Date.now() - 600000).toISOString(), avatar_url: 'https://i.pravatar.cc/150?u=1' },
    { action_text: 'Agent handled objection', entity_name: 'Sarah Smith', created_at: new Date(Date.now() - 3600000).toISOString(), avatar_url: 'https://i.pravatar.cc/150?u=2' },
    { action_text: 'Knowledge base updated', entity_name: 'Pricing.pdf', created_at: new Date(Date.now() - 10800000).toISOString(), avatar_url: null },
    { action_text: 'Campaign finished', entity_name: 'Q3 Promo Drip', created_at: new Date(Date.now() - 86400000).toISOString(), avatar_url: null }
  ]);
  const [stats, setStats] = useState({ leads: '1,248' });

  useEffect(() => {
    // 1. Fetch initial activities
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (!error && data && data.length > 0) {
        setActivities(data);
      }
      
      // Also fetch total leads count just as an example of wiring stats
      const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      if (count !== null) {
        setStats({ leads: count.toString() });
      }
    };
    fetchActivities();

    // 2. Subscribe to realtime inserts
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, (payload) => {
        setActivities(prev => [payload.new, ...prev].slice(0, 5)); // Keep top 5
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, () => {
        // Increment stat counter locally when a lead is captured
        setStats(prev => ({ leads: (parseInt(prev.leads.replace(/,/g, '')) + 1).toLocaleString() }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Welcome back, Ashley</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Here's what's happening with your AI agent today.</p>
        </div>
        <img 
          src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
          alt="Amira Logo" 
          style={{ height: '40px', width: 'auto' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1rem' }}>
        {[
          { title: 'Total Leads', value: stats.leads, trend: '+12%', positive: true, link: '/dashboard/leads' },
          { title: 'Active Conversations', value: '42', trend: '+5%', positive: true, link: '/dashboard/chat' },
          { title: 'Agent Deflection Rate', value: '89%', trend: '-2%', positive: false, link: '/dashboard/analytics' }
        ].map((stat, i) => (
          <Link href={stat.link} key={i} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
                 onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(50,50,93,0.1)'; }}
                 onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--stripe-shadow-ambient)'; }}>
              <div style={{ fontSize: '12px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>{stat.title}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <div style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', fontFeatureSettings: '"tnum", "ss01"', letterSpacing: '-0.64px' }}>{stat.value}</div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 500,
                  color: stat.positive ? 'var(--stripe-success-text)' : '#d92d20',
                  backgroundColor: stat.positive ? 'rgba(21,190,83,0.1)' : 'rgba(217,45,32,0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFeatureSettings: '"tnum"'
                }}>
                  {stat.trend}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)', minHeight: '400px' }}>
        <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>Recent Activity</h3>
        
        {activities.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', paddingBottom: '1.5rem', borderBottom: i === activities.length - 1 ? 'none' : '1px solid var(--stripe-border)' }}>
            {item.avatar_url ? (
                <img src={item.avatar_url} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stripe-purple)', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', lineHeight: 1 }}>•</span>
                </div>
            )}
            <div style={{ flex: 1, fontFeatureSettings: '"ss01"' }}>
              <div style={{ fontSize: '12px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{item.action_text}</div>
              <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>{item.entity_name}</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', fontFeatureSettings: '"ss01"' }}>{getRelativeTime(item.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
