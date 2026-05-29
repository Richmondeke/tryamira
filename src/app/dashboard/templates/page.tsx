export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Agent Templates</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Quick-start your AI with pre-configured personas.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { name: 'Customer Support Bot', desc: 'Handles FAQs, returns policies, and support ticketing.' },
          { name: 'Sales Qualifier', desc: 'Asks BANT questions and books meetings on your calendar.' },
          { name: 'Real Estate Agent', desc: 'Captures property preferences and schedules showings.' },
          { name: 'Ecommerce Concierge', desc: 'Recommends products and tracks order status.' }
        ].map((tpl, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.5rem' }}>{tpl.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1.5rem', flex: 1 }}>{tpl.desc}</div>
            <button style={{ width: '100%', backgroundColor: '#f6f9fc', color: 'var(--stripe-purple)', border: '1px solid rgba(83,58,253,0.2)', borderRadius: '4px', padding: '0.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Use Template</button>
          </div>
        ))}
      </div>

    </div>
  );
}
