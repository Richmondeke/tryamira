export default function OverviewPage() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Welcome back, Ashley</h1>
          <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Here's what's happening with your AI agent today.</p>
        </div>
        <img 
          src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" 
          alt="Amira Logo" 
          style={{ height: '40px', width: 'auto' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { title: 'Total Leads', value: '1,248', trend: '+12%', positive: true },
          { title: 'Active Conversations', value: '42', trend: '+5%', positive: true },
          { title: 'Agent Deflection Rate', value: '89%', trend: '-2%', positive: false }
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <div style={{ fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>{stat.title}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <div style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', fontFeatureSettings: '"tnum", "ss01"', letterSpacing: '-0.64px' }}>{stat.value}</div>
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
        ))}
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)', minHeight: '400px' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500, fontFeatureSettings: '"ss01"' }}>Recent Activity</h3>
        
        {[
          { action: 'New lead captured', entity: 'John Doe', time: '10 mins ago' },
          { action: 'Agent handled objection', entity: 'Pricing query', time: '1 hour ago' },
          { action: 'Knowledge base updated', entity: 'Pricing.pdf', time: '3 hours ago' },
          { action: 'Campaign finished', entity: 'Q3 Promo Drip', time: '1 day ago' }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i === 3 ? 'none' : '1px solid var(--stripe-border)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stripe-purple)', flexShrink: 0 }}>
              <span style={{ fontSize: '16px', lineHeight: 1 }}>•</span>
            </div>
            <div style={{ flex: 1, fontFeatureSettings: '"ss01"' }}>
              <div style={{ fontSize: '14px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{item.action}</div>
              <div style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>{item.entity}</div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--stripe-muted)', fontFeatureSettings: '"ss01"' }}>{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
