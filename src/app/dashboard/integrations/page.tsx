export default function Page() {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 300, color: 'var(--stripe-navy)', margin: '0 0 0.5rem 0', letterSpacing: '-0.64px', fontFeatureSettings: '"ss01"' }}>Integrations</h1>
        <p style={{ color: 'var(--stripe-body)', fontSize: '16px', margin: 0, fontWeight: 300, fontFeatureSettings: '"ss01"' }}>Connect Amira to your favorite tools and CRMs.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { name: 'HubSpot', desc: 'Sync leads and conversations.', connected: true },
          { name: 'Salesforce', desc: 'Enterprise CRM sync.', connected: false },
          { name: 'Zapier', desc: 'Connect to 5,000+ apps.', connected: false },
          { name: 'Stripe', desc: 'Accept payments in chat.', connected: false },
          { name: 'Google Calendar', desc: 'Book meetings instantly.', connected: true },
          { name: 'Slack', desc: 'Get notified of hot leads.', connected: false }
        ].map((app, i) => (
          <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid var(--stripe-border)', borderRadius: '6px', padding: '1.5rem', boxShadow: 'var(--stripe-shadow-ambient)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#f6f9fc', borderRadius: '8px', border: '1px solid var(--stripe-border)' }}></div>
              {app.connected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--stripe-success-text)' }}></div>}
            </div>
            <div style={{ fontSize: '16px', color: 'var(--stripe-navy)', fontWeight: 500, marginBottom: '0.25rem' }}>{app.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--stripe-body)', marginBottom: '1.5rem', flex: 1 }}>{app.desc}</div>
            <button style={{ width: '100%', backgroundColor: app.connected ? '#f6f9fc' : '#ffffff', color: app.connected ? 'var(--stripe-navy)' : 'var(--stripe-purple)', border: '1px solid var(--stripe-border)', borderRadius: '4px', padding: '0.5rem', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
              {app.connected ? 'Manage' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
