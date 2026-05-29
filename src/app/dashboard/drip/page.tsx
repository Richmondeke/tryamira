export default function Page() {
  return (
    <div style={ maxWidth: '1080px', margin: '0 auto', width: '100%' }>
      <div style={ marginBottom: '2rem' }>
        <h1 style={ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px' }>Drip</h1>
        <p style={ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300 }>Configure and manage your Drip settings.</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f6f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--stripe-purple)', fontSize: '24px' }}>✨</span>
        </div>
        <h3 style={{ fontSize: '20px', color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', fontWeight: 500 }}>Drip is coming soon</h3>
        <p style={{ color: 'var(--stripe-body)', maxWidth: '400px', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>We're working hard to bring you the best experience for this feature. Check back soon for updates.</p>
        <button style={{ backgroundColor: 'var(--stripe-purple)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Join Waitlist</button>
      </div>
    </div>
  );
}
