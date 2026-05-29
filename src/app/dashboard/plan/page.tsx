export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Your Plan</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '12px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Track your usage and manage your subscription.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--stripe-label)', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Plan</div>
              <div style={{ fontSize: '20px', color: 'var(--stripe-navy)', fontWeight: 300, letterSpacing: '-0.48px', marginBottom: '0.5rem' }}>Pro Tier</div>
              <div style={{ fontSize: '12px', color: 'var(--stripe-body)' }}>$99.00 / month</div>
            </div>
            <span style={{ backgroundColor: 'rgba(21,190,83,0.1)', color: 'var(--stripe-success-text)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>Active</span>
          </div>
          
          <button style={{ width: '100%', backgroundColor: '#ffffff', color: 'var(--stripe-navy)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer', marginBottom: '1rem' }}>Manage Billing (Stripe)</button>
          <button style={{ width: '100%', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.5rem', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Upgrade Plan</button>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.25rem', boxShadow: 'var(--stripe-shadow-ambient)' }}>
          <h3 style={{ fontSize: '12px', color: 'var(--stripe-navy)', margin: '0 0 1.5rem 0', fontWeight: 500 }}>Monthly Usage</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.5rem', fontFeatureSettings: '"tnum"' }}>
              <span style={{ color: 'var(--stripe-navy)', fontWeight: 500 }}>AI Conversations</span>
              <span style={{ color: 'var(--stripe-body)' }}>450 / 1,000</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e3e8ee', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--stripe-purple)' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.5rem', fontFeatureSettings: '"tnum"' }}>
              <span style={{ color: 'var(--stripe-navy)', fontWeight: 500 }}>Team Members</span>
              <span style={{ color: 'var(--stripe-body)' }}>2 / 5</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e3e8ee', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', backgroundColor: 'var(--stripe-purple)' }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
