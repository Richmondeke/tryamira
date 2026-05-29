export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Refer a Friend</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Earn 30% recurring commission for every customer you bring.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { title: 'Clicks', value: '342' },
          { title: 'Signups', value: '18' },
          { title: 'Commissions', value: '$450.00' }
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
            <div style={{ fontSize: '14px', color: 'var(--stripe-label)', marginBottom: '0.5rem', fontWeight: 500 }}>{stat.title}</div>
            <div style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', fontFeatureSettings: '"tnum", "ss01"', letterSpacing: '-0.64px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--stripe-navy)', margin: '0 0 1rem 0', fontWeight: 500 }}>Your Unique Link</h3>
        <p style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1.5rem' }}>Share this link on your blog, social media, or with clients.</p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input type="text" value="https://heyamira.com/?via=ashley29" readOnly style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--stripe-border)', borderRadius: '4px', fontSize: '14px', color: 'var(--stripe-navy)', backgroundColor: '#f6f9fc' }} />
          <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0 1.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Copy Link</button>
        </div>
      </div>

    </div>
  );
}
