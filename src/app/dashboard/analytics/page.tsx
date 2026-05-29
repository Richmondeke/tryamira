export default function Page() {
  return (
    <div style={ maxWidth: '1080px', margin: '0 auto', width: '100%' }>
      <div style={ marginBottom: '2rem' }>
        <h1 style={ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px' }>Analytics</h1>
        <p style={ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300 }>Visualize your AI agent's performance.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', minHeight: '300px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', color: 'var(--stripe-navy)' }}>Conversations Over Time</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', paddingBottom: '1rem', borderBottom: '1px solid var(--stripe-border)' }}>
            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: 'var(--stripe-purple)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--stripe-muted)', fontSize: '12px' }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', minHeight: '300px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px', color: 'var(--stripe-navy)' }}>Lead Conversion Rate</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
             <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '16px solid var(--stripe-purple)', borderTopColor: '#e5edf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--stripe-navy)' }}>68%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
