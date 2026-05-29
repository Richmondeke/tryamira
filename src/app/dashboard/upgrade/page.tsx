export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Upgrade Plan</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Choose the right plan to scale your AI operations.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { name: 'Starter', price: '$29', limit: '100 conversations/mo', features: ['Webchat widget', 'Basic knowledge base', '1 Team member'] },
          { name: 'Pro', price: '$99', limit: '1,000 conversations/mo', features: ['WhatsApp & Social', 'Automated Drips', 'Zapier Integration', '5 Team members'], highlighted: true },
          { name: 'Enterprise', price: '$299', limit: 'Unlimited', features: ['Custom API access', 'Dedicated success rep', 'White-labeling', 'Unlimited members'] }
        ].map((plan, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: plan.highlighted ? '2px solid var(--stripe-purple)' : '1px solid var(--stripe-border)', borderRadius: '8px', padding: '2rem', boxShadow: plan.highlighted ? '0 8px 30px rgba(83,58,253,0.12)' : 'var(--stripe-shadow-ambient)', position: 'relative' }}>
            {plan.highlighted && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--stripe-purple)', color: '#ffffff', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Most Popular</div>}
            
            <div style={{ fontSize: '18px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.5rem' }}>{plan.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '36px', fontWeight: 300, color: 'var(--stripe-navy)', letterSpacing: '-0.72px', fontFeatureSettings: '"tnum", "ss01"' }}>{plan.price}</span>
              <span style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>/mo</span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--stripe-purple)', fontWeight: 500, marginBottom: '2rem', fontFeatureSettings: '"tnum"' }}>{plan.limit}</div>
            
            <button style={{ width: '100%', backgroundColor: plan.highlighted ? 'var(--stripe-purple)' : '#ffffff', color: plan.highlighted ? '#ffffff' : 'var(--stripe-navy)', border: plan.highlighted ? 'none' : '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.75rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '2rem' }}>
              {plan.highlighted ? 'Current Plan' : 'Upgrade'}
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {plan.features.map((feat, j) => (
                <div key={j} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--stripe-purple)', fontSize: '14px' }}>✓</div>
                  <div style={{ fontSize: '14px', color: 'var(--stripe-body)' }}>{feat}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
